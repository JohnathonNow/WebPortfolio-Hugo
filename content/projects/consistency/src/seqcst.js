import newline from "common.js";
import { ConsistencyModel } from "./consistency.js";
export class SequentialConsistency extends ConsistencyModel {

    getmem(c, p, x) {
        c.machines[p][x] = c.machines[p][x] || { "val": gUndefined };
        return c.machines[p][x];
    }

    write(p, x, v, clk) {
        return { "index": x, "from": p, "val": v, "clk": clk };
    }

    putmem(c, p, k, x, v) {
        //in context c, for process p, put the value v into object x
        //with the write issued from k
        var val = getmem(c, p, x);
        val["val"] = v;
        c.machines[p]["clk"][k]++;
        return val;
    }

    stepqueues(c, x) {
        while (Math.random() > 0.5 && c.machines[x]["out"].length > 0) {
            var write = c.machines[x]["out"].shift();
            newline("sending " + write["index"], c);
            for (var i = 0; i < c.machines.length; i++) {
                if (i != x) {
                    c.machines[i]["in"].push(write);
                }
            }
        }
        while (Math.random() > 0.5 && c.machines[x]["in"].length > 0) {
            var write = c.machines[x]["in"].shift();
            putmem(c, x, write["from"], write["index"], write["val"]);
            newline("applying " + write["index"] + " = " + write["val"].value, c);
        }
    }
    step(c, x) {
        stepqueues(c, x);
        if (c.steps[x] < gStuff[x].length) {
            _eval(c, gStuff[x][c.steps[x]]);
        }
        stepqueues(c, x);
    }

    put(c, n) {
        var key = _eval(c, n.children[1]).eval.value;
        var val = _eval(c, n.children[2]).eval;
        this.putmem(c, c.machine, c.machine, key, val);
        c.machines[c.machine]["out"].push(write(c.machine, key, val, c.machines[c.machine]["clk"].slice()));
        n.eval = val;
        newline("<u>put</u> " + key + " = " + n.eval.value, c);
    }

    run(c) {
        c.machines = [];
        c.steps = [];
        c.done = [];
        c.loops = {};
        var gEmptyVector = [];
        this.gSteps = 0;
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
            this.gSteps++;
            var x = Math.floor(Math.random() * gStuff.length);
            if (!c.done[x]) {
                c.done[x] = (c.steps[x] >= gStuff[x].length) && ((c.machines[x]["in"].length == 0 && c.machines[x]["out"].length == 0) || this.gSteps > 1000000);
            }
            if (!c.done[x]) {
                c.machine = x;
                step(c, x);
                c.steps[x] += 1;
            }
        }
    }

}