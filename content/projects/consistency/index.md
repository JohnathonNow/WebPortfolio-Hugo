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

So what is a consistency model? Well, imagine you have a computer program running on several different computers. They might want to share data
with each other - maybe they're the servers for discord, and when you connect to a different server you want your messages to be there too.
Well, when one computer changes a piece of data, it essentially writes the data on a piece of paper that it can read later. Well, how do the
other computers know what that data is? What if two computers write on their pieces of paper different values for the same data? This is the
problem consistency models solve - consistency models are sets of rules for how each computer in the system sees the writes done by any
computer.

Ideally, when a computer writes a piece of data, every other computer would instantly be able to see that. This is called **strict consistency**, and it is
impossible because we cannot instantly communicate data. So in the real world, we use consistency models like **sequential consistency**, which says that,
while computers at a moment in time might see different values for a piece of data, they will all see the changes made in the same order, so they'll
never be in situations where you post a picture to social media and the post shows up before the picture is uploaded. On the other side, there are
weak consistency models. In **local consistency**, the weakest set of rules, a computer only needs to see changes in the order that it made them, and
it can get the changes from other computers in any order. This might sound useless, since it is a lot easier to think about every computer
seeing the changes in the same order, but it turns out that stronger consistency models stop working if your computers can't all talk to each other,
and in many situations they take longer for data to be read or written to compared to weaker models.

This page is for playing around with a few different models to get a feel for these different models. You can edit the program below
as you see fit, but here I'll describe the one I put there. There are four machines, numbered 0 to 3. Machine number 0 will
first set the variable "data" to the value "bad", then it will change "data" to "good", and finally it will set the variable "lock" to 1.
The other three machines will wait until they see that "lock" has a value of 1, and then read the value of the variable "data". 
In the PRAM, Processor, Causal, and Sequential consistency models, the other 3 machines will all see the value "good" when they read "data",
because they all see the order of the write operations from machine number 0 in the same order. In the Local and Cache consistency models,
however, they can see "bad", "good", or even undefined for the value of "data", since they don't necessarily see the writes from machine
number 0 in the order machine 0 actually did them.  
Note that a different program might work differently with different models. [Here](https://johnwesthoff.com/projects/consistency/?pb=60da9c2a5b81f60d073e37c2)
is a program that works under Cache, Processor, Causal, and Sequential consistency but not Local or PRAM consistency - if you run it several times with
either of those consistency models you will see that machine 3 occasionally reads a value other than 3 for "step" which doesn't make sense, but
that doesn't break the rules of those models.

The order of the which machine gets to make progress and when is randomized every time you press the run button,
so you might want to press the button multiple times to see how the results cange. You can also play
with the different consistency models by changing the dropdown.

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
linearizability (not presented here) is the strongest possible. Sequential consistency is stronger than causal consistency and processor consistency, which aren't comparable with each other. Processor consistency
is the combination of PRAM consistency and cache consistency, which are incomparable with
each other but both stronger than local consistency. Causal consistency is stronger than PRAM consistency and incomparable with cache consistency.
