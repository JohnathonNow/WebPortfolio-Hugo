//VERSION 2
const THRUST_VAL = 1200;
const MAX_FORCE = Infinity;
const ANIMATION_SPEED = 60;

var editor = ace.edit("editor");
editor.setTheme("ace/theme/chrome");
editor.setAutoScrollEditorIntoView(true);
editor.setOption("maxLines", 30);
editor.getSession().setMode("ace/mode/lisp");

var game = game = new Phaser.Game(600, 600, Phaser.AUTO, 'game_div',
    {preload: preload, create: create, update: update, render: render,
     scaleMode:  Phaser.ScaleManager.SHOW_ALL,});
var robot_root = null;
var runner = null;
var all_parts = [];

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

function preload() {
    game.load.image('block', 'pics/block.png');
    game.load.image('gyro', 'pics/gyroscope.png');
    game.load.spritesheet('wheel', 'pics/wheel_strip.png', 32, 32, 5, 0, 1);
    game.time.advancedTiming = true;
    game.stage.disableVisibilityChange = true;
    game.input.enabled = false;
    game.input.touch.preventDefault = false;
    Phaser.Canvas.setTouchAction(game.canvas, "auto");
    game.scale.refresh();
}

function add_part_np(type, base, v, h) {
    var n = null;
    //n = game.make.sprite(base.x-(32*h), base.y-(32*v), type);
    n = game.make.sprite(-(32*h), -(32*v), type);
    base.addChild(n);
    n.robot_speed = 0;
    n.robot_children = [];
    n.type = type;
    n.mom = base;
    n.id = all_parts.length;
    all_parts.push(n);
    return n;
}
function add_part(type, base, v, h) {
    var n = null;
    if (base) {
        n = game.add.sprite(base.x-(32*h), base.y-(32*v), type);
        game.physics.p2.enable(n);
        var a;
        if (h == 1 && v == 0) {
            a = 180;
        } else if (h == -1 && v == 0) {
            a = 0;
        } else if (h == 0 && v == 1) {
            a = 270;
        } else {
            a = 90;
        }
        n.body.angle = a;
        base.robot_children.push(n);
        game.physics.p2.createLockConstraint(base, n,
        [-32*Math.cos(n.body.rotation - base.body.rotation),
         -32*Math.sin(n.body.rotation - base.body.rotation)],
        (a - base.body.angle) * Math.PI/180,
        MAX_FORCE);
    } else {
        n = game.add.sprite(200, 200, type);
        game.physics.p2.enable(n);
    }
    n.body.damping = 0.9;
    n.robot_speed = 0;
    n.robot_children = [];
    n.forward = n.animations.add("forward");
    n.type = type;
    n.id = all_parts.length;
    all_parts.push(n);
    return n;
}

function create() {

    game.physics.startSystem(Phaser.Physics.P2JS);

    game.stage.backgroundColor = '#21a2ec';

    robot_root = add_part('block');
    var front = add_part('block', robot_root, 1, 0); //1
    var back = add_part('block', robot_root, -1, 0); //2
    var lf = add_part('wheel', front, 0, -1);        //3
    var rf = add_part('wheel', front, 0, 1);         //4
    var lm = add_part('wheel', robot_root, 0, -1);   //5
    var rm = add_part('wheel', robot_root, 0, 1);    //6
    var lb = add_part('wheel', back, 0, -1);         //7
    var rb = add_part('wheel', back, 0, 1);          //8
    var gyro = add_part_np('gyro', robot_root, 1, 0);//9
}

function update() {
    (typeof telem_clear != 'undefined') && telem_clear();
    if (typeof runner != 'undefined') {
        var res = eval(runner);
        if (res) console.log(res);
    }
    for (var i = 0; i < all_parts.length; i++) {
        if (all_parts[i].robot_speed != 0) {
            all_parts[i].body.thrust(all_parts[i].robot_speed * THRUST_VAL);
            if (!all_parts[i].forward.isPlaying) {
                all_parts[i].forward.reversed = (all_parts[i].robot_speed > 0);
                all_parts[i].forward.play(
                 Math.abs(Math.floor(all_parts[i].robot_speed*ANIMATION_SPEED)),
                 false);
            }
        }
    }
}

function render() {
    game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");  
}

//Add function to parser
gFunMap['go'] = function(c, n) {
    var which = _eval(c, n.children[1]).eval.value;
    if (n.children.length > 2) {
        n.eval = _eval(c, n.children[2]).eval;
        var val = Math.min(Math.max(n.eval.value, -1), 1);
        n.eval = new Node("float", val, 0);
        if (all_parts[which].type == "wheel") {
            all_parts[which].robot_speed = (val);
        }
    } else {
        n.eval = new Node("float", all_parts[which].robot_speed, 0);
    }
}
gFunMap['part#'] = function(c, n) {
    var which = _eval(c, n.children[1]).eval.value;
    n.eval = new Node("part", all_parts[which], 0);
}
function part(c, n) {
    var which = n.children[0].eval.value;
    if (which.type === "wheel") {
        if (n.children.length > 1) {
            n.eval = _eval(c, n.children[1]).eval;
            var val = Math.min(Math.max(n.eval.value, -1), 1);
            n.eval = new Node("float", val, 0);
            if (which.type == "wheel") {
                which.robot_speed = (val);
            }
        } else {
            n.eval = new Node("float", which.robot_speed, 0);
        }
    } else {
        n.eval = new Node("float", which.mom.body.angularVelocity, 0);
    }
}

var acc = {'x': 0, 'y':0};
//Add
gFunMap['loggo'] = function(c, n) {
    var v = all_parts[1].body.velocity;
    var t = '' + (v.x - acc.x) + ',' + (v.y - acc.y);
    acc.x = v.x;
    acc.y = v.y;
    $('#telem').html($('#telem').html() + "t:" + t + '<br>');
}
//Add telemetry function to parser
gFunMap['log'] = function(c, n) {
    n.eval = _eval(c, n.children[1]).eval;
    $('#telem').html($('#telem').html() + stringify(n.eval) + '<br>');
}
function telem_clear(c, n) {
    $('#telem').empty();
}
