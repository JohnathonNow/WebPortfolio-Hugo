+++
date = "2021-06-28T08:38:00-04:00"
draft = false
title = "PRAM Consistency Sandbox"
tags = [ "Projects" ]
categories = [ "For Fun" ]
series = [ "Consistency", "Interactable" ]
+++

A weaker model than causal consistency is **PRAM Consistency**. In order for a system to be PRAM consistent,
each process must see its own operations in program order, and operations from a single source must be seen in the order
they were issued.

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
 - (clk) - displays the vector clock for this machine  
 - (die) - puts the machine in a failed state, where it makes no more progress  

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

PRAM stands for Pipelined Random Access Memory. You can think of the implementation of PRAM consistency as each process
has a pipeline from every other process. When a process p issues a write, it sends that write down the pipeline to everyone else.
They will apply the writes from process p in the order they receive them from the pipe - but if there are two different
processes writing to values, the writes from different processes can be applied in any order.
