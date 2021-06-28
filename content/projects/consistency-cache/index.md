+++
date = "2021-06-28T11:38:00-04:00"
draft = false
title = "Cache Consistency Sandbox"
tags = [ "Projects" ]
categories = [ "For Fun" ]
series = [ "Consistency", "Interactable" ]
+++

Another weaker model than causal consistency is **Cache Consistency**. In order for a system to be Cache Consistent,
every process must see every write to the same object in the same sequential order.

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

You can think of Cache Consistency as giving every shared object a global atomic queue. A write to that shared object appends to the end of that object's queue,
and in the backgroung each process applies the writes in FIFO order from each object's global atomic queues. So writes to the same object are seen in the
same order by all processes, but writes to different objects can be seen in different orders by each process. Unlike PRAM consistency, writes from the
same process don't need to be seen in the same order from all processes if the writes are to different objects. Notice that PRAM consistency and Cache consistency
offer very different, non-overlapping guarantees - in fact, the two are incomparable, neither one is stronger nor weaker than the other.
