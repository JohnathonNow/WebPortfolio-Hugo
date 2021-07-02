//VERSION 2

import SequentialConsistency from "./seqcst.js";
import newline from "./common.js";

var editor = ace.edit("editor");
var gStuff = [];
var gMap = {};
var gEmptyVector = [];
var gSteps = 0;
var gModels = {
    "local": local,
    "pram": pram,
    "cache": cache,
    "processor": processor,
    "causal": causal,
    "seqcst": seqcst,
    "linear": linearizable
};

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

gDoneHooks.push(function(c) { 
    var model = $('#consistency').val();
    gModels[model](c);
});

gResetHooks.push(function () {
    gStuff = []; gMap = {};
    $('#telem').html('');
});

gFunMap['die'] = function (c, n) {
    newline("failed", c);
    c.done[c.machine] = true;
}

gFunMap['machine'] = function (c, n) {
    var statements = n.children;
    gStuff.push(statements);
}

gFunMap['clk'] = function (c, n) {
    newline("clock is " + c.machines[c.machine]["clk"], c);
}
