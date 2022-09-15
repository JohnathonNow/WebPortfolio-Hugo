+++
date = "2022-09-14T23:24:00-04:00"
draft = true
title = "Towards more accessible video games, a comparison of approaches"
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
