+++
date = "2020-10-19T02:03:30-04:00"
draft = false
title = "What I've Done During the End Times"
heading = "Blog"
tags = [ "Updates" ]
categories = [ "Update" ]
series = [ "Goofing off" ]
+++

I haven't really worked on anything I felt was worth posting here, but I
really don't want to have gone an entire year with no blog post. So, I
figured I'd do a write-up of everything I have done since the world ended,
mostly with the intent of it being a reminder that I actually did stuff.

# The Before Times

So, immediately before the world ended, I had just been starting on my second
research project, Multiverse. Multiverse was intended as a re-thinking of
multi-tenancy in light of advances like hardware offloading and changing
workloads that gave rise to serverless and other such fun things. 
I actually gave a talk to the NYU Systems group about the motivation of the
project. Seeing as how that talk was on March 6th, and the following talk had
to be made optional because of the growing pandemic, I can't help but feel
that my talk doomed the world. I'm sorry everyone. Anyway,
my pretty bad slides are [on Google Docs](https://docs.google.com/presentation/d/1ppd5ObniuZb1kuopj2t_2ixL1ezy4gi5SffoALpB9Qw/edit?usp=sharing).

# The Early Days

Throughout the first half of the summer, I worked on Multiverse.

I wrote a
very fast application loader that completely cheats by loading the binary
ahead of time into a program that doesn't immediately execute it, which we
dub a "husk". The husk, upon being launched, loads in any binaries it may
execute and patches the binaries with the locations of any dynamically
linked libaries it may needs. It then writes less-likely-to-be-used
patched binaries to disk, keeping more-likely-to-be-used binaries in memory.
Then, when you want to launch one of those binaries, a free husk is chosen
and told which binary to begin executing. If the binary is in memory
it just jumps to its entry point, otherwise it has to read the binary
into memory and set the permissions on memory, and then jump to the
entry point. This ends up being significantly faster than fork-exec.
Unfortunately-for-me, we ended up finding a similiar technique already
being used, so this porition of the work was less good.

I also worked on the hardware offloads part of Multiverse, and wrote
a system to multiplex access to an NVMe drive. It performed well, but
then the Multiverse project was put on hiatus.

# Unrelatedly...

It was also around this time that I fanned the flames of my woodworking
hobby. You see, after the 'rona started, I moved in with my then-fiancee,
into a house that we are renting. The benefits of the house include an
unfinished basement, where I stuck my chop-saw, drill press, and lathe.
I then bought a table saw and built some work benches, and made a pretty
OK woodshop. You know, for doing computer science.

I haven't worked on too many cool wood things yet, but back in June I made this cup.

{{< youtube XWpxoYk34R8 >}}

{{< youtube 5-CBEb5dIyQ >}}

And last week, we made this spook, which I cut out with a scroll saw I bought
off craigslist for $20, and then my wife painted and covered with spook-fuzz.

![Spooky](spook.jpg)

# OK But Computers Tho?

It was also late-June that I started teaching Java programming to my old
high school robotics team, [FRC Team 2607, The Fighting RoboVikings](https://robovikings.com).
The class has five or so students who attend regularly, and it has been going
relatively smoothly. More recently I've been having them work on 
[a chatbot](https://github.com/JohnathonNow/FRC2607_DiscordBot).

# Back to Work, Today

Going back to research, quite literally, I've also been working on my first
research project, Edgy, which aims to enable richer applications at the
edge, as currently many applications deployed at the edge lack persistent
state, and if they do have persistent state, it's almost always eventually
consistent. The project basically aims to separate application logic (what the
developer is primarily concerned with) from placement logic (the problem
of deciding where to replicate data). We aim to make it so developers
cannot introduce correctness bugs when specifying where to replicate data,
and thus make it easier for them to deploy applications to the edge.
The project has previously been submitted-and-rejected twice, but
third time's the charm, right?

# OK, but This Post is Part of a Series on Goofing Off

In my spare time, I have been reviving two ancient projects. As I've been
teaching Java, both of them are written in it. One project I actually wrote
about here four years ago, a [multiplayer spaceship game](https://johnwesthoff.com/projects/vrremake/)
where players design 2D space ships and battle it out, as a "we have X at
home" version of Void Hunters, a game that no longer exists, so the market
is ripe for cornering. The other is a 2D platforming shooter based off of
Avatar: The Last Airbender, in which I straight up stole the name, and
called it [Bending](https://github.com/JohnathonNow/Bending). It's strange
looking back at code that I wrote before I had a clue what I was doing, but
it's also very fun to look back at myself in anger as I struggle to understand
why I [did stuff like this](https://github.com/JohnathonNow/Bending/blob/ffe1d99d19247da9a883c3d1dc56d9e0cd250958/src/main/java/com/johnwesthoff/bending/Client.java#L1951-L1966).

Oh, also, I got married. I guess I could have led with that.
