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

Getting an intuition for what this can mean can be difficult, and as there are many different consistency models that systems can support,
knowing the differences between models can be difficult. So I am working on these random little sandboxes to play around with different models.
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

One way of thinking about sequential consistency is that there is a single global memory module with a multiplexor that hooks the memory module
up to each machine, one at a time so that at any given moment only one machine can issue commands to the memory module. Additionally, which machine is connected
to the memory module at any instant in time is completely arbitrary. Finally, each machine must only issue commands in the order that they exist within
their local program. This is how this consistency model is implemented here.

I plan on implementing this same sandbox for a few different consistency models and provide a way to switch between them on the fly. I'd also like to make the
programming model more sane, since right now control flow and the like is non-existent.
