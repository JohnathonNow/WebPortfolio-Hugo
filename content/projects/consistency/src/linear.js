function linearizable(c) {


}
import newline from "./common.js";
import { ConsistencyModel } from "./consistency.js";
export class LinearizableConsistency extends ConsistencyModel {

    getmem(c, p, x) {
        return {"val": this.gMap[x] || gUndefined};
    }

    write(p, x, v, clk) {
        return { "index": x, "from": p, "val": v, "clk": clk };
    }

    step(c, x) {
        if (c.steps[x] < gStuff[x].length) {
            this.eval(c, gStuff[x][c.steps[x]]);
        }    
    }

    put(c, n) {
        var key = _eval(c, n.children[1]).eval.value;
        var val = _eval(c, n.children[2]).eval;
        gMap[key] = val;
        n.eval = val;
        newline("<u>put</u> " + key + " = " + n.eval.value, c);
    }

    run(c) {
        this.gMap = {};
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
    }

}