+++
date = "2021-06-28T17:34:00-04:00"
draft = false
title = "One thing consists of consistency"
tags = [ "Projects" ]
categories = [ "For Fun" ]
series = [ "Consistency", "Interactable" ]
+++

Getting an intuition for how different consistency models behave can be difficult, 
so I am working on some random little sandboxes to play around with different models.

<!--more-->

You can edit the program below to play with different operations. As a limitation of my execution enigne, every S-expression is executed atomically,
while different expressions may be executed in different orders at each execution. So you might want to run your program
multiple times to see how it changes the resulting execution. Additionally, you can
play around with different consistency models with the dropdown box.

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

{{< fullconsist >}}


-----------

This page is kind of the aggregate page for playing with different consistency models. If you
click the Consistency link below you can get to more detailed explanations for each individual consistency model. As a quick summary, local consistency is the weakest model while
linearizability (not presented here) is the strongest. Sequential consistency is stronger than causal consistency, which is stronger than processor consistency. Processor consistency
is the combination of PRAM consistency and cache consistency, which are incomparable with
each other but both stronger than local consistency.