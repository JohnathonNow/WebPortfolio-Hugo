+++
date = "2017-06-19T23:24:00-04:00"
draft = false
title = "AI Game 2 - Components"
tags = [ "Projects" ]
categories = [ "For Fun" ]
series = [ "AI Game" ]
+++

I've spent a few days now planning out more of my project. I worked on
the language some more, and brainstormed ideas for blocks I would like to have
in the program. I also decided to use [phaser](https://phaser.io/) as the
game engine for the building and simulation of robots. This decision was
based off the presence of a physics engine and the ability to specify
constraints on sprites, which will take off the heavy lifting of
"constructing" robots.
# Parts
Below is a list
of some of my robot block ideas, as well as how they'd fit into the language
I described in my last post:

 - **Structure** - a 1x1 piece with mass that does not add functionality
 - **Wheel** - a 1x1 piece with mass that exerts a force in one of two
directions and is user-controllable. `(x)` gives the current power of the
wheel, while `(x y)` sets the power of x to y, where y is in `[-1,1]`, where
`1` is full power in the forward direction and `-1` is full power in the
reverse direction, with `0` being exert no force.
 - **Accelerometer** - a 1x1 piece with no mass that reports on the
force experienced by the robot at the location it is present on. It is
run by `(x)`, and returns something of the form `'(x y)` where x is the
horizontal acceleration experienced, and y is the vertical acceleration - this
will be `'(0 0)` when the robot is not accelerating.
 - **Gyroscope** - a 1x1 piece with no mass that reports on the torque
experienced by the robot at the point of the piece. It returns a single number.
 - **IR TOF** - a 1x1 piece with no mass that sends a beam out forward. The
beam travels 2 blocks, and if it colides with nothing the sensor reads -1.
Otherwise it will read in the range `[0,2]`, being the number of blocks as
a float to the point the beam collides with something. It is run as `(x)`.
 - **LIDAR** - a 1x1 piece with no mass that sends a beam forward. The beam
reads 0 until it travels at least 1 block, where it will then read 1. The
beam will travel up to 90 blocks. It is similar to the **IR TOF** in other
regards.
 - **SERVO** - a 1x1 piece that rotates. It is runnable in two ways. `(x)` 
returns its current rotation in degrees. `(x y)` sets its angle to y degrees.
The return value of `(x)` and the value of y in `(x y)` are in the range 
`[0, 360]`, and values outside this range will be changed to fit this range
by adding or subtracting 360 until they are within the range.
 

# Language Progress

I made a few language changes, outlined below:  

 - `cons` now appends to the start of a list rather than the end, to be more in line with other LISPs.  
 - `+` now properly handles string types.  
 - `=` now properly handles each type.  
 - `(type x)` has been added, and returns a string describing the type of an expression.  
 - `(isdef? x)` has been added, and returns a boolean if identifier x has been defined.  
 - `(| x...)` has been added, and returns the first true value, or the last false value if no value is true.  
 - `(& x...)` has been added, and returns the first false value, or the last true value if no value is false.  
 - `(* x...)` has been added, and returns the product of the arguments.  
 - `(/ x...)` has been added, and returns the result of dividing the first argument by each of the subsequent arguments. I.e. It is equal to the first argument divided by the product of the remaining arguments.  
 - `(scar x)` has been added, and returns the first character of a string.  
 - `(scdr x)` has been added, and returns the string x with the first character removed.  
 - `g` has been renamed to `def` and `def` has been renamed to `let`... sorry...   
 - Spaces can now come between the closing paren of a function call and the function's last argument.  
 - Newlines now count as spaces.  
 - Comments have been added, and begin with a `;` and continue to the end of the line.  
 - Multiline programs are now supported, and return the result of the last expression (the same as wrapping the whole program inside of a `(do ...)`). (OK, I just wrapped every program inside of `(do ...)`...)

# Language Errata
I played around a little and found that the below expression causes bad behavior:

{{< editor >}}
;;;; An example to show that closures don't quite work
;;;; also shows off embedding preset code a little
(def _cons                                   ;define our own cons function
  (fun '(_car _cdr)                          ;it takes in the first and rest
    (fun '(which) (if which _car _cdr)       ;and makes a closure
)))
(def list (_cons 0 (_cons 1 (_cons 2 nil)))) ;make a list using this
((list #f) #t)                               ;retrieve the second element
                                             ;this is expected to be 1
;;cry because the result is wrong (we get 0 instead of 1)
{{< /editor >}}

This appears to be caused by issues of storing context information.
Ideally, when the `_cons` function gets called, it would return a function
that has access to the `_car` and `_cdr` values. However, it appears
that it gets stuck with the `_car` and `_cdr` values from the first time
`_cons` is called.

In terms of the language this is the issue I will spend the most time on at the moment.
Next to that, having proper error messages and the like is a priority,
followed by some more minor details.
