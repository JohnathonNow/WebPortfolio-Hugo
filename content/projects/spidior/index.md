+++
date = "2021-01-29T23:11:00-04:00"
draft = false
title = "Spidior: Because Regex Wasn't Awful Enough"
tags = [ "Projects" ]
categories = [ "For Fun", "Programming Languages", "Tools", "Rust" ]
+++

I've occasionally found myself wanting to refactor code in ways that current
free tools don't make easy for me. I wish I had something to make it easier.

<!--more-->

For instance, recently I changed a lot of really bad code into slightly less
bad code for [a game I started in high school](https://github.com/JohnathonNow/Bending).
The main source file, Client.java, was responsible for far too much.
It was a giant mess of game logic, UI handling, game rendering, networking,
some utility functions, and so on. It was unmaintainable, and I wanted to fix it.
This was painstaking, but it got done. Along the way, I moved some utility functions
from Client.java to a new file, Ops.java. These functions were called through the 
codebase as Client.lengthdir\_x or Client.point\_dis, but now they were in a 
different location. I ended up just running 4 or 5 different regex replacements,
but having a more powerful regex system would have been very helpful.

Another problem occured when I changed what was passed between objects to alter
the game state - for example, when you cast a spell it might add a projectile
entity or heal the caster. Before it was passed Client, which kinda held everything.
Now it was passed a Session, which held game state. But the vs code refactorer
left the name of the parameter as client, which was very sad.
And a regex to replace "client" is kind of a non-starter, as it would have
many false positives.

So what I really want is a regex replacement system, like sed, that is 
context aware. I wanted at least these two features:

## Acess to Source Information

For example, to after moving some functions from Client to Ops, to fix references,
I could do this:
`%s/Client\.([[what=functions,from=Ops.java]])/Ops.\1/g`

Which says, for everywhere, replace Client dot the name of any function in Ops, 
with Ops dot that name.

You would also be able to do that with fields and other such things.

## Access to Context

To rename client to session properly, I could do:
`%s/[[name=client;type=Session]]/session/g`

Which says, for everywhere, replace any identifier named client of the type Session
with the name session.

## The Grammar

To provide access to source information as well as context, I provide a new
regex set, done with two square braces. Using these, you can query for variables
or functions. This is done by adding to the grammar a new rule, to look for two
square braces and two closing braces, containing a comma separated list of queries.
I intend to support the features above, and any more that seem helpful.

## The Soltuion

I began writing a tool called [spidior](https://github.com/JohnathonNow/spidior).
As of when this blog post went up, it is capable of extracting the extra information I
need for those features for Java and C. I plan on adding support for Python and Rust
as well, but they are not a priority at the moment. Instead, the priority is actually
having it do anything useful whatsoever. I also have a working parser for a regex
extension, like the one I have written above. All that remains is actually
performing the regex replacements.

When it is done, it will prove yet another tool that is too dangerous for
anyone to use reliably. But is it really programming if the dev tools aren't
a massive cause of frustration?
