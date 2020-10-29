+++
date = "2017-06-03T23:24:00-04:00"
draft = false
title = "AI Game 1 - Language"
tags = [ "Projects" ]
categories = [ "For Fun" ]
series = [ "AI Game" ]
+++

For a little while now I've wanted to make a game to teach AI programming
and robotics. Between school and my summer internship I was able to
start it, and here I'll outline some of my progress.

# The Project Idea

What I want to build is a game in which robots are assembled by snapping
together components. The robots are then programmed. The programs
must define a `run` function, which is run every tick of the game.
The code can control the robot through a variable, perhaps called `R`, which
contains a list detailing the structure of the robot. Each component of the
robot would act as a function. A motor, for instance, would be a function
that takes 0 or 1 arguments. If 0 arguments are provided, the motor would report
its current speed, if 1 argument is provided, it sets its speed to the value
of that argument.

# The Language

The language I've built is a LISP.
It has a few primitive types - **Numbers**, **Strings**, **Booleans**,
**Lists**, and **Functions**.  
**Numbers** are all floating point, and
are written normally (i.e. `3.0`, `6`, `-9.2`, etc).  
**Strings** are written in between quotes (i.e. `"hello world"`).  
**Booleans** are written as either `#t` for true or `#f` for false.  
**Lists** are written in between `'()`, so a list might look like `'(1 2 3)`.  
**Functions** are defined using the `fun` function, which is described below.

It currently has a few built-in functions:

 - `(g x y...)` - binds the name x to y in the global namespace, with alternating pairs of identifiers and their values
 - `(do X...)` - evaluates every argument, and then returns the last evaluation
 - `(if X Y Z)` - evaluates X, if it is false then evaluates and returns Z, otherwise it evaluates and returns Y
 - `(fun X Y)` - returns a function where X is its argument list and Y is the defined function
 - `(= X Y)` - evaluates X and Y and returns `#t` if they are equal, `#f` otherwise
 - `(+ X...)` - evaluates each argument and returns their sum
 - `(- X Y...)` - evaluates each argument and returns the result of subtracting them from the first argument
 - `(car X)` - returns the first element of list X
 - `(cdr X)` - returns the list X with the first element removed
 - `(cons X Y)` - appends X to the end of list Y
 - `(def X Y)` - evaluates the list X, which is a list of alternating identifiers and values, and binds each identifier to the value that follows, and then evaluates and returns expression Y with those bindings  

<br>
You can try out the language below:

{{< editor >}}

Type your code and hit `Run` to see the result.
