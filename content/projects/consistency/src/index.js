//VERSION 2

#include "./local.js"
#include "./cache.js"
#include "./pram.js"
#include "./processor.js"
#include "./causal.js"
#include "./seqcst.js"
#include "./linear.js"


var editor = ace.edit("editor");
var gStuff = [];
var gMap = {};
var gEmptyVector = [];
var gUndefined = new Node("undefined", "undefined", 0);
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

function newline(s, c) {
    $('#telem').html($('#telem').html() + '<b>' + c.machine + '</b>: ' + s + '<br>');
}

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
