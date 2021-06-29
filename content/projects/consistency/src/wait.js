gFunMap['wait'] = function (c, n) {
    var key = _eval(c, n.children[1]).eval.value;
    var val = _eval(c, n.children[2]).eval.value;
    var back = 1;
    if (n.children.length > 3) {
        back = _eval(c, n.children[3]).eval.value;
    }
    var neval = (val == getmem(c, c.machine, key)["val"].value);
    n.eval = new Node("boolean", neval, 0);
    c.loops[n.line] = (c.loops[n.line] || 0) + 1;
    if (!neval && c.loops[n.line] < 100) {
        c.steps[c.machine] -= back;
    } else {
        newline(neval ? "met criteria " + key + " = " + val : "early termination, " + key + " != " + val, c);
    }
}