//VERSION 5
const MAX_STACK = 100;

class Node {
    constructor(type, value, line) {
        this.type = type;
        this.value = value;
        this.eval = this;
        this.children = [];
        this.line = line;
    }
}

class Context {
    constructor() {
        this.stack = [globals, {}];
    }
}

function isNonSpace(c) {
    return c !== " " && c !== "\n";
}

function parse(code) {
    code = "(do " + code.trim() + ")";
    var line = 1;
    function _parse() {
        for (c = code[0]; c == " " || c == "\n" || c == "\t"; c = code[0]) {
            if (c == "\n") line++;
            code = code.slice(1);
        }
        //code = code.trimLeft();
        //c = code[0];
        code = code.slice(1);
        if (code.length == 0) {
            return null;
        } else if (c === "(") {
            var toRet = new Node("function", "function", line);
            while (code[0] !== ")" && code[0]) {
                var n = _parse();
                if (n) {
                    toRet.children.push(n);
                }
            }
            code = code.slice(1);
            return toRet;
        } else if ((c >= "0" && c <= "9") || c == "." || c == "-") {
            num = c;
            while (isNonSpace(code[0]) && code[0] !== ")" && code[0]) {
                num += code[0];
                if (code[0] !== ")") {
                    code = code.slice(1);
                }
            }
            if (num === "-") {
                return new Node("identifer", num, line);
            } else {
                return new Node("float", parseFloat(num), line);
            }
        } else if (c === "'" && code[0] === "(") {
            var toRet = new Node("list", "", line);
            code = code.slice(1);
            while (code[0] !== ")" && code[0]) {
                var n = _parse();
                if (n) {
                    toRet.children.push(n);
                }
            }
            code = code.slice(1);
            return toRet;
        } else if (c === '#') {
            var toRet = new Node("boolean", (code[0] === "t"), line);
            code = code.slice(1);
            return toRet;
        } else if (c === "\"") {
            var str = "";
            while (code[0] !== "\"" && code[0]) {
                if (code[0] === "\\") {
                    if (code[1] === "\"") {
                        str += "\"";
                        code = code.slice(2);
                    } else {
                        code = code.slice(1);
                    }
                } else {
                    str += code[0];
                    code = code.slice(1);
                }
            }
            code = code.slice(1);
            return new Node("string", str, line);
        } else if (c === ")") {
            code = ")" + code;
            return null;  
        } else if (c === ";") {
            while (code[0] !== "\n" && code[0]) {
                code = code.slice(1);
            }
            line++;
            code = code.slice(1);
            return _parse();
        } else {
            var id = c;
            while (isNonSpace(code[0]) && code[0] !== ")" && code[0]) {
                id += code[0];
                if (code[0] !== ")") {
                    code = code.slice(1);
                }
            }
            return new Node("identifier", id, line);
        }
    }
    return _parse();
}

var globals = {"nil": new Node("list","",0)};
var gFunMap = {
    ""       : _user,
    "def"    : _def,
    "ldef"    : _ldef,
    "set"    : _set,
    "isdef?" : _isdef,
    "+"      : _add,
    "-"      : _sub,
    "/"      : _div,
    "*"      : _mul,
    "if"     : _if,
    "do"     : _do,
    "cons"   : _cons,
    "cdr"    : _cdr,
    "car"    : _car,
    "type"   : _type,
    "scar"   : _scar,
    "scdr"   : _scdr,
    "|"      : _or,
    "&"      : _and,
    "fun"    : _fun,
    "="      : _equals,
    ">"      : _gt,
    "<"      : _lt,
    "let"    : _let,
    "state"  : _state,
    "switch" : _switch,
};

function eval(root) {
    var context = new Context();
    var result = root;
    var l = 0;
    try {
        if (root) {
            l = root.line;
            var result = _eval(context, root);
        }
    } catch(err) {
        console.log(err);
        return new Node('error', "ERR: Could not evaluate!", l);
    }
    if (context.stack.length != 2) {
        return new Node('error', "ERR: Stack Leak!", root.line);
    }
    return result;
}

function _lookup(c, n) {
    const parts = n.value.split(".");
    var ores = null;
    var res = null
    for (var k = 0; k < parts.length; k++) {
        var x = parts[k];
        if (x === "" && res && res.eval) { //blank path parts are derefs
            x = res.eval.value;
            res = ores;
        }
        ores = res;
        if (res && res.context && (x in res.context)) {
            res = res.context[x];
        } else {
            for (var i = c.stack.length - 1; i >= 0; i--) {
                if (c.stack[i] && (x in c.stack[i])) {
                    res = c.stack[i][x];
                    break;
                }
            }
        } 
    }
    return res || n;
}

function _eval(c, n) {
    if (c.stack.length > MAX_STACK) {
        return new Node('error', "ERR: Stack Overflow!", n.line);
    }
    switch (n.type) {
        case "string":
        case "float":
        case "boolean":
        case "code":
        case "part":
            n.eval = n;
            return n;
        case "list":
            for (var i = 0; i < n.children.length; i++) {
                _eval(c, n.children[i]);
            }
            n.eval = n;
            return n;
        case "identifier":
            n.eval =_lookup(c, n);
            return n;
        case "function":
            if (n.children[0].type === "function") {
                _call(c, n);
            } else if (n.children[0].type === "part") {
                part && part(c, n);
            } else {
                (gFunMap[n.children[0].value] || _named)(c, n);
            }
            return n;
    }
}

function setCallVars(c, frame, vars, vals) {
    for (var i = 0; i < vars.children.length - 1; i += 1) {
        frame[vars.children[i].value] = _eval(c, vals[i]).eval;
    }
    if (vars.children.length > 0) {
        var lastVar = vars.children[vars.children.length - 1].value;
        if (lastVar.endsWith('...')) {
            lastVar = lastVar.slice(0, -3);
            var last = new Node("list", "", 0);
            last.children = vals.slice(vars.children.length - 1);
            frame[lastVar] = _eval(c, last).eval;
        } else {
            frame[lastVar] = _eval(c, vals[vars.children.length - 1]).eval;
        }
    }
}

function _call(c, n) {
    n.eval = _eval(c, n.children[0]).eval;
    if (n.eval.type === "part") {
        part && part(c, n);
    } else {
        var vars = _eval(c, n.eval.children[0]).eval;
        var vals = n.children.slice(1);
        var frame = {};
        var r = n.eval;

        setCallVars(c, frame, vars, vals);

        c.stack.push(frame);
        if (r.context) {
            c.stack.push(r.context);
        }
        n.eval = _eval(c, n.eval.children[1]).eval;
        c.stack.pop();
        if (r.context) {
            c.stack.pop();
        }
    }
}
function _named(c, n) {
    n.value = n.children[0].value;
    var fn = _lookup(c, n);
    if (fn.type === "part") {
        _call(c, n);
    } else {
        _user(c, n, fn);
    }
}
function _user(c, n, r) {
    if (!r) {
        r = n.children[0];
    }
    n.eval = _eval(c, r).eval;
    var vars = _eval(c, r.children[0]).eval;
    var vals = n.children.slice(1);
    var frame = {};

    setCallVars(c, frame, vars, vals);

    c.stack.push(frame);
    if (r.context) {
        c.stack.push(r.context);
    }
    n.eval = _eval(c, r.children[1]).eval;
    c.stack.pop();
    if (r.context) {
        c.stack.pop();
    }
}
function _fun(c, n) {
    _eval(c, n.children[1]);
    n.eval = new Node("code", "", 0);
    n.eval.context = c.stack.slice()[c.stack.length - 2];
    n.eval.children = n.children.slice(1);
    n.eval.eval = n.eval;
}
function _let(c, n) {
    var pairs = _eval(c, n.children[1]).eval.children;
    for (var i = 1; i < pairs.length; i+=2) {
        _eval(c, pairs[i]);
    }
    var frame = {};
    for (var i = 0; i < pairs.length; i+=2) {
        frame[pairs[i].value] = pairs[i+1].eval;
    }
    c.stack.push(frame);
    n.eval = _eval(c, n.children[2]).eval;
    c.stack.pop();
}
function _isdef(c, n) {
    n.eval = new Node("boolean", false, 0);
    for (var i = c.stack.length - 1; i >= 0; i--) {
        if (n.children[1].value in c.stack[i]) {
            n.eval.value = true;
            break;
        }
    }
}
function _set(c, n) {
    for (var j = 1; j < n.children.length; j+=2) {
        for (var i = c.stack.length - 1; i >= 0; i--) {
            if (c.stack[i] && (n.children[j].value in c.stack[i])) {
                c.stack[i][n.children[j].value] = _eval(c, n.children[j+1]).eval;
                break;
            }
        }
    }
}
function _ldef(c, n) {
    const i = c.stack.length - 2;
    for (var j = 1; j < n.children.length; j+=2) {
        c.stack[i][n.children[j].value] = _eval(c, n.children[j+1]).eval;
    }
}
function _def(c, n) {
    for (var i = 1; i < n.children.length; i+=2) {
        globals[n.children[i].value] = _eval(c, n.children[i+1]).eval;
    }
}
function _or(c, n) {
    for (var i = 1; i < n.children.length; i++) {
        n.eval = _eval(c, n.children[i]).eval;
        if (n.eval.value && n.eval.type === "boolean") break;
    }
}
function _and(c, n) {
    for (var i = 1; i < n.children.length; i++) {
        n.eval = _eval(c, n.children[i]).eval;
        if (!n.eval.value && n.eval.type === "boolean") break;
    }
}
function _sub(c, n) {
    n.eval = _eval(c, n.children[1]).eval.value;
    for (var i = 2; i < n.children.length; i++) {
        n.eval -= _eval(c, n.children[i]).eval.value;
    }
    n.eval = new Node("float", n.eval, n.line);
}
function _div(c, n) {
    n.eval = _eval(c, n.children[1]).eval.value;
    for (var i = 2; i < n.children.length; i++) {
        n.eval /= _eval(c, n.children[i]).eval.value;
    }
    n.eval = new Node(n.children[1].type, n.eval, 0);
}
function _mul(c, n) {
    n.eval = _eval(c, n.children[1]).eval.value;
    for (var i = 2; i < n.children.length; i++) {
        n.eval *= _eval(c, n.children[i]).eval.value;
    }
    n.eval = new Node(n.children[1].type, n.eval, 0);
}
function _add(c, n) {
    n.eval = _eval(c, n.children[1]).eval.value;
    for (var i = 2; i < n.children.length; i++) {
        n.eval += _eval(c, n.children[i]).eval.value;
    }
    n.eval = new Node(n.children[1].type, n.eval, 0);
}
function _equals(c, n) {
    var a = _eval(c, n.children[1]).eval;
    var b = _eval(c, n.children[2]).eval;

    n.eval = new Node("boolean", a.value === b.value && a.type === b.type, 0);

    if (n.children[1].eval.type === "list" &&
        n.children[2].eval.type === "list") {
        n.eval.value = true;
        if (n.children[1].eval.children.length != 
            n.children[2].eval.children.length) {
            n.eval.value = false;
        } else {
            for (var i=n.children[1].eval.children.length;i--;) {
                if (n.children[1].eval.children[i].eval.value !==
                    n.children[2].eval.children[i].eval.value) {
                    n.eval.value = false; break;
                }
            }
        }
    }
}
function _gt(c, n) {
    var a = _eval(c, n.children[1]).eval;
    var b = _eval(c, n.children[2]).eval;

    n.eval = new Node("boolean", a.value > b.value, 0);
}
function _lt(c, n) {
    var a = _eval(c, n.children[1]).eval;
    var b = _eval(c, n.children[2]).eval;

    n.eval = new Node("boolean", a.value < b.value, 0);
}
function _do(c, n) {
    for (var i = 1; i < n.children.length; i++) {
        n.eval = _eval(c, n.children[i]).eval;
    }
}
function _switch(c, n) {
    var case_node = n.children[1];
    var case_eval = _eval(c, case_node).eval;
    
    n.eval = null;
    if (case_eval.type !== "identifier") {
        for (var i = 3; i < n.children.length; i += 2) {
            if (_eval(c, n.children[i]).eval.value === case_eval.value) {
                n.eval = _eval(c, n.children[i + 1]).eval;
                break;
            }
        }
    }
    n.eval = n.eval || _eval(c, n.children[2]).eval;
}function _state(c, n) {
    var cur_state = n.children[1];
    _switch(c, n);
    globals[cur_state.value] = n.eval;
}
function _if(c, n) {
    var cond = _eval(c, n.children[1]).eval.value;
    if (cond === false) {
        n.eval = _eval(c, n.children[3]).eval;
    } else {
        n.eval = _eval(c, n.children[2]).eval;
    }
}
function _type(c, n) {
    n.eval = new Node("string", _eval(c, n.children[1]).eval.type, 0);
}
function _scar(c, n) {
    n.eval = new Node("string", _eval(c, n.children[1]).eval.value[0], 0);
}
function _scdr(c, n) {
    n.eval = new Node("string", _eval(c, n.children[1]).eval.value.slice(1), 0);
}
function _car(c, n) {
    n.eval = _eval(c, n.children[1]).eval.children[0].eval;
}
function _cdr(c, n) {
    n.eval = new Node("list", "", 0);
    n.eval.children = _eval(c, n.children[1]).eval.children.slice(1);
    n.eval.eval = n.eval;
}
function _cons(c, n) {
    n.eval = new Node("list", "", 0);
    var b = _eval(c, n.children[n.children.length - 1]).eval;
    n.eval.children = b.children.slice(); //copy array
    for (var i = n.children.length - 1; i-- - 1;) {
        n.eval.children.unshift(_eval(c, n.children[i]).eval);
    }
    n.eval.eval = n.eval;
}

function stringify(node) {
    function _stringify(n) {
        switch (n.eval.type) {
            case "list":
                var toRet = "'(";
                for (var i = 0; i < n.eval.children.length; i++) {
                    if (i > 0) toRet += " ";
                    toRet += _stringify(n.eval.children[i]);
                }
                return toRet + ")";
            case "code":
                var toRet = "&ltfunction over '(";
                for (var i = 0; i < n.eval.children[0].children.length; i++) {
                    if (i > 0) toRet += " ";
                    toRet += n.eval.children[0].children[i].value;
                }
                return toRet + ")&gt";
            default:
                return "" + n.eval.value;
        }
    }
    return _stringify(node);
}
