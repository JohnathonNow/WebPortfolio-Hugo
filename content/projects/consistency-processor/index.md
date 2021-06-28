+++
date = "2021-06-28T13:34:00-04:00"
draft = false
title = "Processor Consistency Sandbox"
tags = [ "Projects" ]
categories = [ "For Fun" ]
series = [ "Consistency", "Interactable" ]
+++

If a system is both cache consistent and PRAM consistent, then it is also **processor consistent**, meaning all writes from a single process are seen
in the same order by all process, and all writes to the same location are seen in the same order by all processes.

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

Processor consistency is stronger than both PRAM consistency and cache consistency, but weaker than causal consistency. It is implemented here as
a set of global atomic queues for each shared object, where each write puts a tuple of a vector clock and the written value into the corresponding object's
queue (giving cache consistency). Each write is applied by each process only when that write is at the front of its queue _and_ it is the next operation
from the process that issued it that the process has yet to apply (giving PRAM consistency). Checking if an operation is the next from a given process is easy - 
if process p with vector clock Vp is looking to apply the write to object x (Vk, v) issued by process k, that write can be applied if Vk[k] = Vp[k] + 1.
