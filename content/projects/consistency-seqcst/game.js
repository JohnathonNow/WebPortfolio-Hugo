//VERSION 2
var editor = ace.edit("editor");
var gStuff = [];
var gMap = {};
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

gDoneHooks.push(function(c) { 
    c.steps = [];
    c.done = [];
    c.loops = {};
    for (var i = 0; i < gStuff.length; i++) {
        c.steps.push(1);
        c.done.push(false);
    }

    while (!c.done.every((x) => x)) {
        var x = Math.floor(Math.random() * gStuff.length);
        c.done[x] = (c.steps[x] >= gStuff[x].length);
        if (!c.done[x]) {
            c.machine = x;
            _eval(c, gStuff[x][c.steps[x]]);
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
    var eval = (val == (gMap[key] || new Node("undefined", "undefined", 0)).value);
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
    gMap[key] = val;
    n.eval = val;
    newline("<u>put</u> " + key + " = " + n.eval.value, c);
}

gFunMap['get'] = function(c, n) {
    var key = _eval(c, n.children[1]).eval.value;
    n.eval = gMap[key] || new Node("undefined", "undefined", 0);
    newline("<u>get</u> " + key + " = " + n.eval.value, c);
}

gFunMap['machine'] = function(c, n) {
    var statements = n.children;
    gStuff.push(statements);
}
