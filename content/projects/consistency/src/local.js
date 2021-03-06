function local(c) {
    function getmem(c, p, x) {
        c.machines[p][x] = c.machines[p][x] || { "val": gUndefined };
        return c.machines[p][x];
    }

    function write(p, x, v, clk) {
        return { "index": x, "from": p, "val": v, "clk": clk };
    }

    function putmem(c, p, k, x, v) {
        //in context c, for process p, put the value v into object x
        //with the write issued from k
        var val = getmem(c, p, x);
        val["val"] = v;
        c.machines[p]["clk"][k]++;
        return val;
    }

    function clockcmp(c1, c2, p) {
        return Math.random() > 0.9;
    }

    function stepqueues(c, x) {
        while (Math.random() > 0.5 && c.machines[x]["out"].length > 0) {
            var write = c.machines[x]["out"].pop();
            newline("sending " + write["index"], c);
            for (var i = 0; i < c.machines.length; i++) {
                if (i != x) {
                    c.machines[i]["in"].push(write);
                }
            }
        }
        while (Math.random() > 0.5 && c.machines[x]["in"].length > 0) {
            for (var i = 0; i < c.machines[x]["in"].length; i++) {
                var write = c.machines[x]["in"][i];
                if (clockcmp(c.machines[x]["clk"], write["clk"], write["from"])) {
                    c.machines[x]["in"].splice(i, 1);
                    putmem(c, x, write["from"], write["index"], write["val"]);
                    newline("applying " + write["index"] + " = " + write["val"].value, c);
                }
            }
        }
    }
    function step(c, x) {
        stepqueues(c, x);
        if (c.steps[x] < gStuff[x].length) {
            _eval(c, gStuff[x][c.steps[x]]);
        }
        stepqueues(c, x);
    }

    gFunMap['put'] = function (c, n) {
        var key = _eval(c, n.children[1]).eval.value;
        var val = _eval(c, n.children[2]).eval;
        var wrt = putmem(c, c.machine, c.machine, key, val);
        c.machines[c.machine]["out"].push(write(c.machine, key, val, c.machines[c.machine]["clk"].slice()));
        n.eval = val;
        newline("<u>put</u> " + key + " = " + n.eval.value, c);
    }

    #include "get.js"
    #include "wait.js"

    gFunMap['clk'] = function (c, n) {
        newline("clock is " + c.machines[c.machine]["clk"], c);
    }

    gFunMap['die'] = function (c, n) {
        newline("failed", c);
        c.done[c.machine] = true;
    }


    gFunMap['machine'] = function (c, n) {
        var statements = n.children;
        gStuff.push(statements);
    }

    c.machines = [];
    c.steps = [];
    c.done = [];
    c.loops = {};
    gEmptyVector = [];
    gSteps = 0;
    for (var i = 0; i < gStuff.length; i++) {
        c.steps.push(1);
        gEmptyVector.push(0);
        c.done.push(false);
        c.machines.push({
            "mem": {},
            "out": [],
            "in": []
        });
    }

    for (var i = 0; i < gStuff.length; i++) {
        c.machines[i]["clk"] = gEmptyVector.slice();
    }

    while (!c.done.every((x) => x)) {
        gSteps++;
        var x = Math.floor(Math.random() * gStuff.length);
        if (!c.done[x]) {
            c.done[x] = (c.steps[x] >= gStuff[x].length) && ((c.machines[x]["in"].length == 0 && c.machines[x]["out"].length == 0) || gSteps > 1000000);
        }
        if (!c.done[x]) {
            c.machine = x;
            step(c, x);
            c.steps[x] += 1;
        }
    }
}