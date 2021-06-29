gFunMap['get'] = function (c, n) {
    var key = _eval(c, n.children[1]).eval.value;
    var faken = getmem(c, c.machine, key)["val"];
    newline("<u>get</u> " + key + " = " + faken.eval.value, c);
    return faken;
}