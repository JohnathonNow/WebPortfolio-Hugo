+++
date = "2017-06-30T23:24:00-04:00"
draft = false
title = "AI Game 4 - Robot Test Run"
tags = [ "Projects" ]
categories = [ "For Fun" ]
series = [ "AI Game" ]
+++

OK, I'm pretty excited. It might not have been clear what this project was,
but I think this will clear it up.
<!--more-->
As I have said before, the project is a game where users create robots
by snapping together blocks, and then program them in the language I've been
describing. Well, if it wasn't clear what I meant by blocks, and by programming
the robots, just read on!

Below you <s>will</s> should see an editor followed by a blue canvas with
a weird centipede thing. Do not fear, for that is not a centipede, but
is instead a six-wheel-drive robot. It has a very blocky appearance, as it
is made up of blocks - nine of them to be exact.
It has three structure pieces running
down the middle, and three wheels on each side, two on each structure piece.


In the little demo below, I have a very simply program set up to drive the
robot in circles. To start it, press "Start Script". You can modify the program,
and click "Reload Script" whenever you want to.

{{< editor >}};;;;A demo for driving a little car robot
;;define the IDs of the six wheels
(def lf 3 rf 4 lm 5 rm 6 lb 7 rb 8)
;;define two helper functions for controlling the robot like a tank
;;the `go` function takes a wheel ID and a speed, where the speed
;;is in the range [-1, 1]
(def left  (fun '(speed) (do (go lf speed) (go lm speed) (go lb speed)))
     right (fun '(speed) (do (go rf speed) (go rm speed) (go rb speed))))

;;define the function that gets called every iteration of the game loop
;;it must be called run - it must take no arguments,
;;and it can alter global state
(def run (fun '() (do   ;this demo drives forward and turns slightly
  (left -0.6)           ;drive the left wheels at 60% reverse
  (right 1.0)           ;drive the right wheels at 100% forward
)))
{{< /editor >}}

{{< game >}}
<br> 
The biggest link between the editors that you might have seen in my previous
posts and the game window you saw above is that the game window will run
a user defined function called `run` every iteration of the game loop.
This `run` function must be defined in global scope (i.e. using `def`),
and it must take no arguments (i.e. it must be declared with something like
`(def run (fun '() ...))`).

The robot forms a bit of a tree, with the center structure piece as the root,
two wheels and two structure pieces as children, and two wheels as children
of each of the structure pieces. This tree-like structure is why I chose 
a LISP for the language used to program the robots.
For simplicity at the moment, however, I
have the robot represented as a list, with each piece getting an ID starting
with the root at 1.

To allow the code to control the robot, I introduced a function named `go`.
As I had intended for the tree structure of the robot to mesh with 
the programming by allowing users
to "call" pieces of the robot as functions to control them, `go` is just a
temporary solution until the game is more mature.

`go` has two forms:  
 1. `(go ID SPEED)` runs wheel with the ID ID at speed SPEED. SPEED is in the range `[-1, 1]` where `-1` is full reverse and `1` is full forward. *Forward* is the direction of the treads on the wheel sprite.  
 2. `(go ID)` simply returns the current speed of the wheel identified by ID.  


I still have a lot of work to do to make this project what I hope it can be.
Right now my next steps are to make the wheels have an animation while moving (to make it
more clear which wheels are spinning), to make it easier
to control the robot from the language, and to make it easier to implement
state machines within the language.
Hopefully by the end of the summer I'll have an even cooler demo to show off!
