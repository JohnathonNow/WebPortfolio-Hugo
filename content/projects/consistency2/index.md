+++
date = "2021-06-28T01:23:00-04:00"
draft = false
title = "Causal Consistency Sandbox"
tags = [ "Projects" ]
categories = [ "For Fun" ]
series = [ "Consistency", "Interactable" ]
+++

In a sequentially consistent distributed system, all processes observe all write operations in some common order.
A **causally consistent** system has a slightly weaker guarantee - only causally related writes must be observed in a common order,
and processes can disagree on the order of causally unrelated events. <!--more-->
Causation here is the "happened before" relation. There are two sources of 
"happened before" in this memory model, and "happened before" is transitive:
1. Program order - within a process, each operation a process performs happens before operations that come later in the program the process is running  
2. Reading other's writes - when a process reads a value from another process's write, that write happened before the read  

  
</br></br>

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

In exchange for being a weaker consistency model, causal consistency is available under partition, and can guarantee low latency. In order to track causality,
processes can either directly track what operations newly issued writes depend on as a dependency graph, or they can use a vector clock. To save on space,
when using a dependency graph typically only the nearest dependencies are stored with each write event. In either case, when a process performs a write, it
adds the write to an outbound queue along with some metadata to track causality. Then, in the background it sends the contents of the outbound queue to every other
node, which add the write to an inbound queue. Each process applies the operations from their inbound queue only once all of their dependencies are met. For an explicit graph this entails checking if each dependent operation has been applied.

I find the vector clock approach to be more natural, so I will describe it in more detail. Every process has a local datastore of the objects in the system, which
stores the value that process believes is most current. Each process also has a vector clock, which is an array with a single integer for each process in the
system. Say Mp is the datastore at process p, so Mp[x] is the value of x that p has in its datastore. Let Vp be the vector clock at process p, and
Vp[i] be the integer counter for process i within the vector clock Vp. So when process p writes a value to x, it stores that value in Mp[x] 
and increments Vp[p] by one. p then adds to its outbound queue the tuple (x, Mp[x], Vp). This tuple will eventually be be replicated to every other process
in the background.

When a process k receives a write event tuple from process p, it adds the tuple to its inbound queue. The inbound queue of each process is sorted, with
the earliest events according to the vector clock at the start of the queue. In the background, process k looks at the head of its inbound queue - say it is the
tuple (x, Mp[x], Vp). Process k will only apply this write (and remove the tuple from the inbound queue) if the following holds:
for every index i in Vp except for i=p, Vp[i] >= Vk[i], and Vp[p] == Vk[p] + 1. That is, every write that causally happened before (x, Mp[x], Vp) has
been applied, and it is the next write from process p that k has yet to apply.
