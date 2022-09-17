+++
date = "2022-09-16T23:24:00-04:00"
draft = false
title = "Towards More Accessible Video Games: Part 1 - Overthinking Everything"
tags = [ "Projects" ]
categories = [ "For Fun" ]
series = [ "" ]
+++

I mentioned recently a desire to create more accessible computer games. In this blog, I
briefly cover some early findings towards that goal.

<!--more-->

## Introduction

Long ago in a distant land, some friends and I started writing a procedurally generated
dungeon crawler named [hag](https://github.com/a3qz/hag). Much more recently, I had the
idea to try to make it more accessible to those with visual impairments. This seems
relatively straightforward, as hag has a pretty simple internal representation of the
world. There is a list of enemies, a list of items on the ground, a list of rooms,
and a list of hallways connecting them. Right now, things close enough to the player
are drawn on the screen using terminal graphics. Unfortunately, I don't think that plays
nicely with screen readers or other assistive technologies.

## An idea


Here is, uh, a screenshot of hag.
```text
#############..#######.#######################..########┌──────────────────────────────────────────────────────┐
##############..######.########################..#######│Current HP: 175/175                                   │
###############..#####.#########################..######│Strength: 10                                          │
################..####.##########################..#####│Dexterity: 10                                         │
#################..###.###########################..####│Intelligence: 10                                      │
##################..##.############################..###│Luck: 1000                                            │
###################..#.#############################..##│Experience: 0/112                                     │
####################............................#####..#│Current Level: 1                                      │
#####################...........................######..│Current Item: s 0                                     │
######################..........................#######.│Turns: 2                                              │
######################....k.@...................########│                                                      │
######################..........................########│k: kobold HP: 50                                      │
######################...........&..............########│k: kobold HP: 50                                      │
######################..........................########│&: Potion                                             │
######################......./..................########│/: Strength Weapon                                    │
######################..........................########│                                                      │
######################..........................########│                                                      │
######################..........................########│                                                      │
######################..........................########│                                                      │
######################..........................########└──────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                                              │
│                                                                                                              │
│                                                                                                              │
│You find yourself on the first floor of a dangerous dungeon.                                                  │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

There are three main points of interest - the main game window, which is full of pound signs, dots, slashes, and other
characters, the status window, which describes the current status of the player as well as presents a key for the main
game window, and the flavortext window, which just provides a log of flavortext for the player to read. 

The status window and flavortext window are probably OK for screenreaders, though the key for the game window is probably
not helpful. The main game window, however, seems entirely useless for assistive technologies. I suppose it _could_
be used to play the game, but that experience seems miserable, and we can definitely do better.

So, what if instead of rendering out nearby content (the player @ sign, the k for kobold, / for strength weapon, etc.), we
generated a list of nearby features? The main game window above could instead be rendered as the following:

```text
You are in room three.
There is a kobold two paces west.
There is a Strength Weapon one pace east and four paces south.
There is a potion five paces east and three paces south.
There is a vertical hallway six paces west and four paces north.
There is a North-East hallway six paces west and two paces north.
```


This gives enough information to render the game playable, but perhaps it would not be enjoyable.
The issue is it is very repetitive, which defeats the purpose of a rogue-like.

## High Tech Space Wizardry

Obviously the solution to this problem is to take that output and throw it at a language model. I took that output and pre-pended
"Rewrite the following more succinctly, with more flourish: " and let text-davinci-002 loose on it. Here is what it
produced:

```text
You are in room three. A kobold lurks two paces west, while a Strength Weapon can be found one pace east and four paces south. A potion rests five paces east and three paces south, and a vertical hallway yawns six paces west and four paces north. A North-East hallway also lies six paces west and two paces north.
```

Woah! That has a lot more flavor than the laundry-list we produced programatically! Let's try again!

```text
You are in room three. To your west is a kobold, and to your east and south is a Strength Weapon. Five paces east and three paces south is a potion, and six paces west and four paces north is a vertical hallway. Finally, six paces west and two paces north is a North-East hallway.
```

Hmm, it like, just ignored half the details. Maybe that was a fluke.

```text
You are in room three. A kobold lurks two paces west, while a Strength Weapon lies one pace east and four paces south. A potion can be found five paces east and three paces south, while a vertical hallway leads six paces west and four paces north. A North-East hallway also intersects six paces west and two paces north.
```

This is mostly good, though "leads" there is a little inaccurate. Let's re-run it a few times more.

```text
You are in room three.
A kobold lurks two paces west.
A Strength Weapon lies one pace east and four paces south.
A potion beckons five paces east and three paces south.
A vertical hallway yawns six paces west and four paces north.
A North-East hallway awaits six paces west and two paces north.
```

```text
You are in room three. To your west is a kobold, and to your east and south is a Strength Weapon. To your east and south is also a potion, while to your west and north is a vertical hallway. Finally, to your west and north is also a North-East hallway.
```

```text
You are in room three.
To your west is a kobold, two paces away.
To your east, one pace away and four paces south, is a Strength Weapon.
Five paces east and three paces south is a potion.
And six paces west and four paces north is a vertical hallway.
Six paces west and two paces north is a North-East hallway.
```

```text
Room 3
- Kobold: 2 west
- Strength Weapon: 1 east, 4 south
- Potion: 5 east, 3 south
- Vertical hallway: 6 west, 4 north
- North-East hallway: 6 west, 2 north
```

```text
You are in room three. There is a kobold two paces west. There is a Strength Weapon one pace east and four paces south. There is a potion five paces east and three paces south. There is a vertical hallway six paces west and four paces north. There is a North-East hallway six paces west and two paces north.
```

```text
You are in room three. A kobold lurks two paces west, while a Strength Weapon lies one pace east and four paces south. A potion can be found five paces east and three paces south, while a vertical hallway awaits six paces west and four paces north. Finally, a North-East hallway can be found six paces west and two paces north.
```

There is some good variety, but that comes at the cost of accuracy and consistency. Perhaps some other model could check that
the output from GPT-3 was accurate to the prompt, but that's introducing a lot of complexity to a game compiled with C89 and
curses graphics. 

Before moving on to a different approach, I would like to highlight one cool feature of a language model approach - what you
prepend for the prompt could be customizable, either by the user (for personal preference or for modding) or by the program
(for different tones and so on). For example, consider the following prompt-output pairs:

```text
Rewrite the following with a sense of urgency:
You are in room three.
There is a kobold two paces west.
There is a Strength Weapon one pace east and four paces south.
There is a potion five paces east and three paces south.
There is a vertical hallway six paces west and four paces north.
There is a North-East hallway six paces west and two paces north.

Room Three
Kobold Two paces west
Strength Weapon one pace east and four paces south
Potion five paces east and three paces south
Vertical Hallway six paces west and four paces north
North-East hallway six paces west and two paces north
```

```text
Rewrite the following with a sense of panic:
You are in room three.
There is a kobold two paces west.
There is a Strength Weapon one pace east and four paces south.
There is a potion five paces east and three paces south.
There is a vertical hallway six paces west and four paces north.
There is a North-East hallway six paces west and two paces north.

You're in room three and there's a kobold two paces west! There's also a Strength Weapon one pace east and four paces south, and a potion five paces east and three paces south. There's a vertical hallway six paces west and four paces north, and a North-East hallway six paces west and two paces north.
```

```text
Rewrite the following with a mysterious tone:
You are in room three.
There is a kobold two paces west.
There is a Strength Weapon one pace east and four paces south.
There is a potion five paces east and three paces south.
There is a vertical hallway six paces west and four paces north.
There is a North-East hallway six paces west and two paces north.

You find yourself in room three. A kobold lurks two paces west. A Strength Weapon waits one pace east and four paces south. A potion lies five paces east and three paces south. A vertical hallway beckons six paces west and four paces north. A North-East hallway entices six paces west and two paces north.
```

```text
Rewrite the following with a creepy tone:
You are in room three.
There is a kobold two paces west.
There is a Strength Weapon one pace east and four paces south.
There is a potion five paces east and three paces south.
There is a vertical hallway six paces west and four paces north.
There is a North-East hallway six paces west and two paces north.

You are in room three.
There is a kobold two paces west, just waiting to pounce.
There is a Strength Weapon one pace east and four paces south, glinting menacingly in the dim light.
There is a potion five paces east and three paces south, probably full of some foul poison.
There is a vertical hallway six paces west and four paces north, leading who knows where.
There is a North-East hallway six paces west and two paces north, full of darkness and who-knows-what.
```

```text
Rewrite the following with a halloween theme:
You are in room three.
There is a kobold two paces west.
There is a Strength Weapon one pace east and four paces south.
There is a potion five paces east and three paces south.
There is a vertical hallway six paces west and four paces north.
There is a North-East hallway six paces west and two paces north.

You are in a haunted house.
There is a ghost two paces west.
There is a Strength Weapon one pace east and four paces south.
There is a potion five paces east and three paces south.
There is a vertical staircase six paces west and four paces north.
There is a North-East hallway six paces west and two paces north.
```

Hey, that last one is just a lie! Anyways, there is certainly a lot of fun to be had with the model,
but it does make the game harder to actually play. One last example:

```text
Craft a story involving the following:
You are in room three.
There is a kobold two paces west.
There is a Strength Weapon one pace east and four paces south.
There is a potion five paces east and three paces south.
There is a vertical hallway six paces west and four paces north.
There is a North-East hallway six paces west and two paces north.

You wake up groggy, trying to make sense of your surroundings. You're in some kind of dungeon, and from the looks of it, you're not the only one here. You see a kobold two paces west of you, and a Strength Weapon one pace east and four paces south. There's also a potion five paces east and three paces south. The only way out seems to be a vertical hallway six paces west and four paces north, or a North-East hallway six paces west and two paces north. You're not sure what to do, but you know you need to get out of here. You start to make your way towards the North-East hallway when the kobold suddenly attacks you.
```

This one even took away our player's agency!

## Back to Basics

This problem seems like one well suited to more traditional procedural generation techniques. Rather than
have an AI model write our flavortexts, we could write a bunch of paragraphs describing situations and then
slot in the necessary information afterwards. One could create a simplistic English
grammar and expand it out until it has enough objects listed, and then fill in adjectives and adverbs as necessary.
Either of these approaches would solve the accuracy problem, and should resolve the repetitive problem as well
so long as sufficiently many options are provided. In an inevitable part 2 I will explore these options in more depth.
