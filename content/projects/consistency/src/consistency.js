import newline from "./common.js";
export class ConsistencyModel {
    constructor(_eval) {
        this.eval = _eval;
    }
    
    getmem(context, process, object) {
        //
    }

    putmem(conext, process, writer, object, value) {
        //
    }

    get(context, ast_node) {
        var key = this.eval(context, ast_node.children[1]).eval.value;
        var result_node = this.getmem(context, context.machine, key)["val"];
        this.eval(c, result_node);
        newline("<u>get</u> " + key + " = " + result_node.eval.value, c);
        return result_node;
    }

    wait(conext, ast_node) {
        var key = _eval(conext, ast_node.children[1]).eval.value;
        var val = _eval(conext, ast_node.children[2]).eval.value;
        var back = 1;
        if (n.children.length > 3) {
            back = _eval(conext, ast_node.children[3]).eval.value;
        }
        var neval = (val == this.getmem(conext, conext.machine, key)["val"].value);
        ast_node.eval = new Node("boolean", neval, 0);
        conext.loops[ast_node.line] = (conext.loops[ast_node.line] || 0) + 1;
        if (!neval && conext.loops[ast_node.line] < 100) {
            conext.steps[conext.machine] -= back;
        } else {
            newline(neval ? "met criteria " + key + " = " + val : "early termination, " + key + " != " + val, c);
        }
    }

    put(context, ast_node) {
        //
    }

    run(context) {
        //
    }
}