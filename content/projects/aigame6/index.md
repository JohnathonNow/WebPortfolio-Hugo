+++
date = "2020-10-28T22:24:00-04:00"
draft = false
title = "AI Game 6 - Recovery"
tags = [ "Projects" ]
categories = [ "For Fun", "Interactable" ]
series = [ "AI Game" ]
+++

I found an unfinished blog post from Halloween of 2017. Given the state of the world, it might be worth revisiting.

<!--more-->

Several years ago I had this idea for a game, where people would
make virtual robots from snapped together components, and then program
the robots in a language of my (poor) design. I've actually discussed
it a few times [on my blog](https://johnwesthoff.com/series/ai-game/).

I wanted to write a typechecker for the language, or at least something better
for error handling, but I didn't. It looks like three years ago I _started_ to,
but I never finished anything substantial. That hasn't changed.

Instead I am really just throwing this out there once again -
with the possibility that yet another FIRST Robotics competition
season is cancelled, I think the time is now to come up with some kind
of robotics related competition that can be done poorly virtually.

I've only added one feature to the language, the `set` built-in function.
`set` behaves very similarly to `def`, which defines one or more variables
in global scope. `set`, on the other hand, re-defines variables in the
closest scope it can. This means it is now possible to have a closure
change one of its captured variables, meaning it is now possible to
pretend to have mutable objects through closures. This is pretty cool,
and it only took a minute or so of work.

{{< editor >}};;;;A demo for driving a little car robot
;;define the IDs of the six wheels
(def lf (part# 3) ;the left front wheel is the third part of the robot
     rf (part# 4) ;the right front wheel is the fourth
     lm (part# 5) ;the left middle is the fifth
     rm (part# 6) ;right middle
     lb (part# 7) ;left back
     rb (part# 8) ;right back
)
;;define a function named obj
;;that returns a closure
;;that pretends to be an object with a getter and setter
(def obj (fun '(x) 
    (fun '(f a...) (switch f '()
        "get" x
        "set" (set x (car a))
    ))
))
;;create two instances of our "object"
(def obj1 (obj 0))
(def obj2 (obj 10))

(def gs (part# 9)) ;define gyroscope
;;define two helper functions for controlling the robot like a tank
;;each take a speed in the range [-1, 1]
(def left  (fun '(speed) (do (lf speed) (lm speed) (lb speed)))
     right (fun '(speed) (do (rf speed) (rm speed) (rb speed))))

;;define the function that gets called every iteration of the game loop
;;it must be called run - it must take no arguments,
;;and it can alter global state
(def run (fun '() (do
  ;be a finite state machine and store the state in the variable STATE
  (state STATE "START_STRAIGHT" ;default state is "START_STRAIGHT"
   ;when state is start straight go forward and set the timer to 50, goto straight
   "START_STRAIGHT"  (do (left -0.6) (right 0.6) (def time 50) "STRAIGHT")
   ;when the state is straight, subtract 1 from time, if it is below 0 go to start turn
   "STRAIGHT"        (do (def time (- time 1)) (if (> 0 time) "START_TURN" "STRAIGHT"))
   ;when state is start turn, set wheels to turn and set the timer to 50, go to turn
   "START_TURN"      (do (left 0.6) (right 0.6) (def time 12) "TURN")
   ;when state is turn, subtract 1 from time, if it is below 0 go to start straight
   "TURN"            (do (def time (- time 1)) (if (> 0 time) "START_STRAIGHT" "TURN"))
  )
  ;print out some pretty stuff
  ((obj1 "set" (+ 1 (obj1 "get"))))
  (log (+ "obj1.x is " (obj1 "get")))
  (log (+ "obj2.x is " (obj2 "get")))
  (log (+ "current gyro reading is " (gs)))
)))
{{< /editor >}}

{{< game >}}

Going forward, I'd like to add more sensors and actuators. I wonder if
some kind of fake electrical subsystem is worth adding. The game does use
a 2D physics engine, so perhaps a weight limit could be added, and then
there could be different motors, giving more mechanically inclined people
something to do. A 3D game would probably be better for this stuff, but
that's hard considering the game being in-browser was a major goal of mine
(lots of people use Chromebooks or tablets).
