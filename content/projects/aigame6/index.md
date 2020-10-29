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

I've only added one feature to the language - the ability to modify variables
at more local scopes than global. For instance, the `set` built-in function.
`set` behaves very similarly to `def`, which defines one or more variables
in global scope. `set`, on the other hand, re-defines variables in the
closest scope it can. This means it is now possible to have a closure
change one of its captured variables, meaning it is now possible to
pretend to have mutable objects through closures. This is pretty cool,
and it only took a minute or so of work.

Additionally, I added dot notation for closures, so you can say `obj.x`
to get the value of the variable x captured by closure obj. This was
done in a hacky and bad way, but it does work as long as there is only
one level of indirection. Finally, I added another def command, ldef,
which is like set or def, but it adds a variable to the most local scope.
This is useful for closures having their own state that is separate
from their creating function.

{{< editor >}};;;;A demo for showing closures
;;define a function named obj
;;that returns a closure
;;that pretends to be an object with a getter and setter
(def obj (fun '(x) (do
    (ldef y 2607)
    (fun '(f a...) (switch f '()
        "get" x
        "set" (set x (car a))
    ))
)))

(def str "")                                    ;define an empty string to store a message
(def obj1 (obj 23))                             ;construct an obj with x=23 named obj1
(def str (+ str "After constructor, obj1.x is " 
    obj1.x "&lt;br&gt;"))                             ;add the value to our message
(obj1 "set" 14)                                 ;set obj1.x to 14
(def str (+ str "After set, obj1.x is " obj1.x 
    "&lt;br&gt;"))                                    ;add the new value to our message
(def str (+ str "obj1.y is " obj1.y))           ;add the value of obj1.y to the message
str                                             ;return our nice string
{{< /editor >}}


Going forward, I'd like to add more sensors and actuators. I wonder if
some kind of fake electrical subsystem is worth adding. The game does use
a 2D physics engine, so perhaps a weight limit could be added, and then
there could be different motors, giving more mechanically inclined people
something to do. A 3D game would probably be better for this stuff, but
that's hard considering the game being in-browser was a major goal of mine
(lots of people use Chromebooks or tablets).

