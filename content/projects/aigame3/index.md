+++
date = "2017-06-27T23:24:00-04:00"
draft = false
title = "AI Game 3 - Language Update"
tags = [ "Projects" ]
categories = [ "For Fun" ]
series = [ "AI Game" ]
+++

The language is coming along nicely. I refactored the evaluation function,
moving out all of the function call logic into more digestible functions.
This led to a few nice advances.
<!--more-->

# Bug Fixes

I think I got scoping to work well enough, fixing that closure example from
last time.

{{< editor >}}
;;;; An example to show that closures might work now
(def _cons                                     ;define our own cons function
  (fun '(_car _cdr)                            ;it takes in the first and rest
    (fun '(which) (if which _car _cdr)         ;and makes a closure
)))

;; convert a fake list to a string
(def go2String
  (fun '(l)                                    ;take in a list
    (if (= (l #f) nil)                         ;if we are at the end, stop
      (l #t)                                   ;and return our last element
      (+ "" (l #t) "  " (go2String (l #f)))    ;otherwise recurse
)))

(def myList (_cons 0 (_cons 1 (_cons 2 nil)))) ;make a list using _cons


(go2String myList)                             ;stringify
{{< /editor >}}

# Feature Additions

I added the ability to specify functions with variable numbers of arguments.
To do this, add `...` to the end of the last variable declaration. Then,
when the function is called, the last argument will be set to a list containing
all of the unnamed arguments.

That is, 
{{< editor 1>}}
;;;; An example to showcase variable argument list lengths
(def test (fun '(x...) x))
(test 1 2 3)      
{{< /editor >}}
will print `'(1 2 3)`.

Also, I added very rudimentary error messages, which you can
mess up because they're basically strings. You'll encounter one of my
new errors if you run through all of the examples here. Also, I added
a cap to the stack size. It's currently 40, because I kept making
things that recursed forever and wanted them to stop quickly. If you
overflow the stack there is an error for that.

# Some Quirks

Internally, functions are just a list of two elements: an argument list,
and the function expression. When a user-defined function is called,
the function arguments are evaluated, and mapped to each element of the
argument list inside a frame. This frame is then pushed onto the stack,
along with the function's context, that is, the frame that was at the
top of the stack when the function was defined.

This led to an interesting realization - lists in this language can be
called *as* functions, and they will just return their second element.
Additionally, they can take in arguments, as listed in their first element!

As an example, consider the following:
{{< editor 2>}}
;;;; An example to demonstrate that functions are just lists
(def test '('(x) (+ x 5))) ;define a list function that adds 5 to its argument
(test 1)
{{< /editor >}}

But, I lied a little. Lists are not functions. My first paragraph hinted
at a key difference - functions store context. When a function is created
using `fun`, the current stack frame is stored in the function node in the
syntax tree. This does not happen with lists. So what if we do our little
function-as-list example using lists-as-functions-as-lists?

{{< editor 3>}}
;;;; An example to show that I've got too much *clap clap* time on my hands
(def _lcons
  '('(_car _cdr)
    '('(which) (if which _car _cdr)
)))

;; convert a fake list to a string
(def go2String
  (fun '(l)                                    ;take in a list
    (if (= (l #f) nil)                         ;if we are at the end, stop
      (l #t)                                   ;and return our last element
      (+ "" (l #t) "  " (go2String (l #f)))    ;otherwise recurse
)))

(def myList (_lcons 0 (_lcons 1 (_lcons 2 nil)))) ;make a list using _lcons


(go2String myList)                             ;stringify
{{< /editor >}}

If you notice, it doesn't successfully run, which is to be expected. Fret not,
however, as there is something interesting about this lack of context that
can give the illusion that it is there.

{{< editor 4>}}
;;;; Proof by contradiction
(def add-x '('(x) '('(y) (+ x y))))  ;define a function that returns
                                     ;a function that adds the argument
                                     ;from the first to the argument from the
                                     ;second

(def add-6 (add-x 6))                ;define a function that adds 6 to its arg

(add-6 24)                           ;be amazed that it evaluates to 30
{{< /editor >}}

Finally, I realized that I didn't make a map properly in JavaScript.
I had assumed the familiar {"key": "value"} syntax was good enough, not
realizing that that creates an Object with a prototype that defines
things such as `toString`. Well, because of that, um, you can't
define an identifier named `toString` and expect it to work, at least
not yet.

So
{{< editor 5>}}
;;;; Why JavaScript, why?
(def toString "anything but the words \"function\" or \"undefined\"")
toString 
{{< /editor >}}
and
{{< editor 6>}}
(def constructor "anything but the words \"function\" or \"undefined\"")
constructor 
{{< /editor >}}
fail, but
{{< editor 7>}}
(def toStringUGH "anything but the word \"function\"")
toStringUGH 
{{< /editor >}}
works as expected...

I plan on fixing this, but need to decide on which course is best (aka easiest
but still compatible with enough browsers).
