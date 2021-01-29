+++
date = "2021-11-28T22:24:00-04:00"
draft = true
title = "Esed"
tags = [ "Projects" ]
categories = [ "For Fun", "Interactable" ]
+++

I've occasionally found myself wanting to refactor code in ways that current
free tools don't make easy for me.

For instance, recently I changed a lot of really bad code into slightly less
bad code for a game I started in high school. The main source file, Client.java,
was responsible for far too much. It was a giant mess of game logic, UI handling,
game rendering, networking, some utility functions, and so on. It was unmaintainable,
and I wanted to fix it. This was painstaking, but it got done. Along the way, I moved
some utility functions from Client.java to a new file, Ops.java. These functions were
called through the codebase as Client.lengthdir\_x or Client.point\_dis, but now
they were in a different location. I ended up just running 4 or 5 different regex
replacements, but having a more powerful regex system would have been very helpful.

Another problem occured when I changed what was passed between objects to alter
the game state - for example, when you cast a spell it might add a projectile
entity or heal the caster. Before it was passed Client, which kinda held everything.
Now it was passed a Session, which held game state. But the vs code refactorer
left the name as client, which was very sad. And a regex to replace "client"
is kind of a non-starter.

So what I really want is a regex replacement system, like sed, that is 
context aware. I wanted at least these two features:

## Acess to Source Information

For example, to after moving some functions from Client to Ops, to fix references,
I could do this:
`%s/Client\.([[Ops.functions]])/Ops.\1/g`

Which says, for everywhere, replace Client dot the name of any function in Ops, 
with Ops dot that name.

You would also be able to do that with fields and other such things.

## Access to Context

To rename client to session properly, I could do:
`%s/[[name=client;type=Session]]/session/g`

Which says, for everywhere, replace any identifier named client of the time Session with the name session.
