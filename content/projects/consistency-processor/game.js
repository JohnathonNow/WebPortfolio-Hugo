//VERSION 2
var editor = ace.edit("editor");
var gStuff = [];
var gMap = {};
var gEmptyVector = [];
var gUndefined = new Node("undefined", "undefined", 0);
var gSteps = 0;
editor.setTheme("ace/theme/chrome");
editor.setAutoScrollEditorIntoView(true);
editor.setOption("maxLines", 30);
editor.getSession().setMode("ace/mode/lisp");

function start() {
    var e = eval(parse(ace.edit('editor').getValue()));
    if (globals && 'run' in globals) {
        if (!runner) {
            $("#but").text("Reload Script");
        }
        runner = new Node("function", "", 0);
        runner.children = [new Node("identifier", "run", 0)];
    }
}

gResetHooks.push(function() { gStuff = []; gMap = {}; 
    $('#telem').html('');
});

function getmem(c, p, x) {
    c.machines[p]["m"][x] = c.machines[p]["m"][x] || {"val": gUndefined};
    return c.machines[p]["m"][x];
}

function write(c, x, v) {
    var clk = c.machines[c.machine]["clk"].slice();
    for (var i = 0; i < c.machines.length; i++) {
        c.machines[i]["q"][x] = c.machines[i]["q"][x] || [];
        c.machines[i]["q"][x].unshift({"val": v, "clk": clk, "from": c.machine});
    }
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
    return c1[p] + 1 == c2[p];
}

function stepqueues(c, x) {
    var keys = Object.keys(c.machines[x]["q"]);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        while (Math.random() > 0.7 && c.machines[x]["q"][key].length > 0) {
            var write = c.machines[x]["q"][key][c.machines[x]["q"][key].length - 1];
            if (clockcmp(c.machines[x]["clk"], write["clk"], write["from"])) {
                c.machines[x]["q"][key].pop();
                putmem(c, x, write["from"], key, write["val"]);
                newline("applying " + key + " = " + write["val"].value, c);
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

gDoneHooks.push(function(c) { 
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
        c.machines.push({"m": {}, "q": {}});
    }

    for (var i = 0; i < gStuff.length; i++) {
        c.machines[i]["clk"] = gEmptyVector.slice();
    }

    while (!c.done.every((x) => x)) {
        gSteps++;
        var x = Math.floor(Math.random() * gStuff.length);
        if (!c.done[x]) {
            c.done[x] = (c.steps[x] >= gStuff[x].length) && (Object.keys(c.machines[x]["q"]).every((k) => c.machines[x]["q"][k].length == 0) || gSteps > 1000000);
        }
        if (!c.done[x]) {
            c.machine = x;
            step(c, x);
            c.steps[x] += 1;
        }
    }

});

function newline(s, c) {
    $('#telem').html($('#telem').html() + '<b>' + c.machine + '</b>: '+ s + '<br>');
}

gFunMap['wait'] = function(c, n) {
    var key = _eval(c, n.children[1]).eval.value;
    var val = _eval(c, n.children[2]).eval.value;
    var back = 1;
    if (n.children.length > 3) {
        back = _eval(c, n.children[3]).eval.value;
    }
    var eval = (val == getmem(c, c.machine, key)["val"].value);
    n.eval = new Node("boolean", eval, 0);
    c.loops[n.line] = (c.loops[n.line] || 0) + 1;
    if (!eval && c.loops[n.line] < 100) {
        c.steps[c.machine] -= back;
    } else {
        newline(eval?"met criteria " + key + " = " + val : "early termination, " + key + " != " + val, c);
    }
}

gFunMap['put'] = function(c, n) {
    var key = _eval(c, n.children[1]).eval.value;
    var val = _eval(c, n.children[2]).eval;
    var wrt = putmem(c, c.machine, c.machine, key, val);
    write(c, key, val);
    n.eval = val;
    newline("<u>put</u> " + key + " = " + n.eval.value, c);
}

gFunMap['get'] = function(c, n) {
    var key = _eval(c, n.children[1]).eval.value;
    n.eval = getmem(c, c.machine, key)["val"];
    newline("<u>get</u> " + key + " = " + n.eval.value, c);
}

gFunMap['clk'] = function(c, n) {
    newline("clock is " + c.machines[c.machine]["clk"], c);
}

gFunMap['die'] = function(c, n) {
    newline("failed", c);
    c.done[c.machine] = true;
}

gFunMap['machine'] = function(c, n) {
    var statements = n.children;
    gStuff.push(statements);
}
