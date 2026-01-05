+++
date = "2020-12-15T02:03:30-04:00"
draft = true
title = "Cheaping out on RGB Fans - Aigo DR12 controller mod"
tags = [ "Ads", "CircuitPython", "PC" ]
categories = [ "Ads" ]
series = [ "Goofing off" ]
+++

My personal desktop is a strange hodge-podge of budget-friendly parts and
somewhat enthusiast parts. I have a Ryzen 7 3700x in an
ASUS ROG Crosshair VI Hero, a fairly high-end X370 motherboard. That I got
used for $99. I have two GTX 1080s in SLI - the first I got for $550 during
the mining craze when the next cheapest GPU was a GTX 1060 for $400, and
the second was card used for mining that I got for $200. My case is a fairly
nice Maingear Vybe RGB case that I got openbox at Microcenter. I have 32GB of
3000Mhz, CAS 15 memory - 16GB of which is EVGA brand??? and 16GB of which is
Oloy. As you can see, there is a clear pattern of overkill components done
in a budget friendlier way.

So, of course, when it comes to the most important part of any gaming PC,
the RGB lighting, I again cheaped out. I got 
[these DR12 fans](https://www.amazon.com/gp/product/B07WFM1QT5/ref=ppx_yo_dt_b_search_asin_title?ie=UTF8&psc=1)
which are some of the cheapest RGB fans on Amazon.
They do have some issues, however. First of all, they use a proprietary controller than runs
the fans (which is fine by me) as well as the RGB (which is not OK). The fans
each have a proprietary 6 pin connector, which I'd never seen before and
couldn't quite work out (separate power and ground lines for the fans and LEDs, plus an LED data line
equals five pins...)
Now there are more expensive fan kits that look similar but allow one to use
a motherboard addressable RGB header to control the fans. These cost
roughly $9 more, which in this case is like 33% of the price, so that's hardly
worth it.

Opening up one of the fans reveals
that the six pins are in fact power and ground for the fans, power and ground for the LEDs, and 
data in for the LEDs as well as their data out (so different fans can have different lighting
effects by daisy chaining them). So that's cool. 

Opening up the fan controller, however, reveals that the data-out lines are maked No Connection,
and all of the data in lines are tied together, so they can't have different lighting effects.
Interestingly enough, the manual says you must use the fan headers in sequential order starting
from 1, which is what you'd expect as a requirement if the LEDs were daisychained.
This simultaneously makes the fix very easy while also making me kind of disappointed that the
fans can't have different effects.

So the easiest fix if you want to control the LEDs of all of the fans at once is to open up the fan
controller and cut this trace. Now you can feed digital data in to one of the LED headers on the
controller. 
![picture](blah.jpg)

This is a very quick fix but it unfortunately again means that all of the fans
are the same in terms of lighting. To fix that, we have to separate the data in lines from the fans
and daisy chain them. We can do this by again cutting the traces on the board as seen below.
![picture](blah.jpg)
We then have to add jumpers between the data out pins of each fan and the data in pins of the next
fan. This is great, easy.
![picture](blah.jpg)

Of course, an arguably simpler solution is to simply not use their controller at all, and instead
cut the connectors off the fans and solder on standard fan headers for the fan parts
and the connector of your choice for the RGB portion. Personally I avoid cutting the connectors on
devices if I can, and the wiring seemed cleaner using their fan controller anyway.
