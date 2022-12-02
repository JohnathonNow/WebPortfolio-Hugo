+++
date = "2021-06-27T02:24:00-04:00"
draft = false
title = "Sequential Consistency Sandbox"
tags = [ "Projects" ]
categories = [ "For Fun" ]
series = [ "Consistency", "Interactable" ]
+++

A distributed system that meets the condition "the result of any execution is the same as if the operations of all processers were executed
in some sequential order, and the operations of each individual process appear in this sequence in the order specified by its program" is said
to be **Sequentially consistent**.

<!--more-->

Getting an intuition for how different consistency models behave can be difficult, 
so I am working on these random little sandboxes to play around with different models.
You can edit the program below to play with different operations. As a limitation of my execution enigne, every S-expression is executed atomically,
while different expressions may be executed in different orders at each execution. So you might want to run your program
multiple times to see how it changes the resulting execution.

There are a few different functions supported:  
 - (machine statements...) - Defines a node in the distributed program that runs each statement in `statements` in order  
 - (put key value) - stores `value` in global memory at the location specified by `key`  
 - (get key) - reads the value from global memory at the location specified by `key`  
 - (wait key value) - delays progress in this node until the value in global memory at the location specified by `key` equals `value`  

{{< editor >}};;;;Define a few machines
(machine ; machine 0
    (put "data" "bad")
    (put "data" "good")
    (put "lock" 1)
)
(machine ; machine 1
    (wait "lock" 1)
    (get "data")
)
(machine ; machine 2
    (wait "lock" 1)
    (get "data")
)
(machine ; machine 3
    (wait "lock" 1)
    (get "data")
)
{{< /editor >}}

{{< consist >}}


-----------

Unlike with causal consistency, which only requires that every process see the same order
of causally related writes, sequential consistency requires that every process
observe the same order of _all_ writes. Note, however, that stale reads (with respect to real time)
are still possible,
as sequential consistency does not impose the real time constraint. 

Note that the simulator here is currently slightly stronger, and in fact provides linearizability. I am in the middle of
re-writing the consistency models and this will be improved soon.
