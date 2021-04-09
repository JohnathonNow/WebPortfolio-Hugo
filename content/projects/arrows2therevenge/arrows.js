#!/usr/bin/env python

const DIRS = new Set(
    [[0, 1], [0, -1], [-1, 0], [1, 0]]
    );

function find_start(d) {
    for y in range (1, len(d)-1):
        for x in range(1, len(d[y])-1):
            if d[y-1][x-1:x+2] == [true, true, false]  && \
               d[y-0][x-1:x+2] == [true, false, false] && \
               d[y+1][x-1:x+2] == [true, true, false]:
                return [x + 2, y]
}

function get_paths(d, x, y) {
    return [di for di in DIRS if d[y+di[1]][x+di[0]]]
}

function rhr(di) {
    return [di[1], -di[0]]
}
function lhr(di) {
    return [-di[1], di[0]]
}
function get_path_at_fork(di, register) {
    if register == 0:
        return rhr(di)
    else:
        return lhr(di)
    }
function get_paths_turn(d, x, y, p) {
    return [di for di in DIRS if d[y+di[1]][x+di[0]] && ((di[0] != -p[0]) && (di[1] !=  -p[1]))]
}
function get_turns(di) {
    return (tuple(-x for x in di[::-1]), di[::-1])
}
function is_at_arrow(d, x, y, di) {
    t = get_turns(di)
    return d[y+t[0][1]][x+t[0][0]] && d[y+t[1][1]][x+t[1][0]]
}   
function is_at_in(d, x, y, di) {
    t = get_turns(di)
    return ! d[y+t[0][1]][x+t[0][0]] && ! d[y+t[1][1]][x+t[1][0]]
}
function is_at_out(d, x, y, di) {
    t = get_turns(di)
    x -= di[0]
    y -= di[1]
    return ! d[y+t[0][1]*2][x+t[0][0]*2] && ! d[y+t[1][1]*2][x+t[1][0]*2]
}
function is_at_turn(d, x, y, di) {
    t = get_turns(di)
    return (d[y+t[0][1]][x+t[0][0]] || d[y+t[1][1]][x+t[1][0]]) && ! d[y+di[1]][x+di[0]]
}
function get_skip(x, y, di) {
    return (x + di[0]*3, y + di[1]*3)
}
function check_paths(d, xx, yy, di) {
    out = []
    for p in di:
        x = xx
        y = yy
        pp = p
        while d[y][x]:
            x += p[0]
            y += p[1]
            if is_at_turn(d, x, y, p):
                p = get_paths_turn(d, x, y, p)[0]
            if is_at_arrow(d, x, y, p):
                out.append(pp)
                break
    return out
}
function in_bounds(x, y, d) {
    return y >= 0 && y < len(d) && x >= 0 && x < len(d[0])
}
function load(f) {
    img = Image.open(f)
    w, h = img.size
    arr = img.load()

    return [[arr[x, y][0] > 100 for x in range(w)] for y in range(h)]
}
function run(f) {
    data = load(f)
    x, y = find_start(data)
    lstack = [0]
    rstack = [0]
    register = 0
    try:
        while in_bounds(x, y, data):
            pp = get_paths(data, x, y)
            pp = check_paths(data, x, y, pp)
            if len(pp) == 2:
                p = get_path_at_fork(p, register)
            else:
                p = pp[0]
            pathy = 0
            while not is_at_arrow(data, x, y, p):
                x += p[0]
                y += p[1]
                pathy += 1
                if pathy == 5:
                    pathy = 0
                    register += 1
                if is_at_turn(data, x, y, p):
                    pathy = 0
                    p = get_paths_turn(data, x, y, p)[0]
                    if p == (1, 0):
                        register -= rstack.pop()
                    elif p == (0, 1):
                        rstack.append(register)
                    elif p == (-1, 0):
                        register -= lstack.pop()
                    elif p == (0, -1):
                        lstack.append(register)
                    if len(rstack) == 0:
                        rstack.append(0)
                    if len(lstack) == 0:
                        lstack.append(0)

            if is_at_out(data, x, y, p):
                sys.stdout.write(chr(register))
                sys.stdout.flush()
            x, y = get_skip(x, y, p)
            while data[y][x]:
                if is_at_in(data, x, y, p):
                    register = ord(sys.stdin.read(1))
                x += p[0]
                y += p[1]
            x += p[0]
            y += p[1]
    except Exception as E:
        print(E)
    }