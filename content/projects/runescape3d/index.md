+++
date = "2021-07-17T01:43:00-04:00"
draft = false
title = "A Game Better Than RuneScape 3... In 3D!"
tags = [ "RuneScape" ]
series = [ "Goofing Off" ]
+++
Last time I wrote about RuneScape, I described how I play the game without really playing it at all.
But what if I like, did want to actually look at the game I'm playing?

<!--more-->
Well, as anybody who has ever even _seen_ the game can tell you, the graphics are very dated.
I guess at this point I should mention that I'm specifically talking about Old School RuneScape,
not whatever RuneScape 3 is. And, of course Old School RuneScape has dated looking graphics -
how could it be "Old School" if it didn't?

In any case, a lot of people in the community (myself included), wouldn't mind the _option_ for
more up to date graphics. I especially like the looks of various projects that aim to give
the game the 2008 "HD" look, mostly because about half of my time playing was in that era.
I think I have an idea that can appeal to everyone, however! I have a VR headset that I
only occasionally use, and I think I know the perfect, immersive experience it can enable:
playing OSRS in VR.

How would that work? Well, in principle to have something work in VR, we need some way to
control the game, and we need an image for each eye. These images should be the same
3D scene rendered from slightly different perspectives, to emulate the two different
images our eyes would see if we were the game's camera. The controls we can't change
very much, since that's cheating. But we _can_ control the image part.

I've been playing around with the RuneLite source code for a little while now, and
I realized that it's actually very easy to have the camera move a little in the GPU
Plugin source code. I figured what I could do is have an extra integer offset for
camera during rendering, and after every frame I flip the offset (that is, I multiply
it by negative one). I tested this, and it worked - I saw a flickering mess of
the game perspective jumping back and forth. Hooray!

Now, I realized the easiest way to have it "work" in VR would be to use a game
called [Bigscreen](https://www.bigscreenvr.com/), which is a handy dandy program that
gives you a... big screen... inside of VR. It has some cool social features too but
those aren't relevant here. All that's important is that it lets you see a giant
projector screen of your desktop and any applications in VR, _and_ it lets you
treat your desktop as two "side by side" 3D images, where the left half of your screen
is sent to your left eye only (and stretched to cover the entire eye), and the right half
of the screen is sent to your right eye only (and stretched accordingly). So, if instead of
rendering the alternating images in the same place, I could render them side by side, then everything
would just work!

![RuneScape in glorious 3D!](rs.png)

Well, I did that, and it did! For the most part. There are some issues - for some reason I'm having
trouble having the 2D UI elements like the HUD and game chat render correctly. I
think I should be able to fix that soon though. Additionally, it's hard to know where the mouse actually is, since
the game is just rendered as two halves. I plan on drawing a virtual mouse where the game thinks
the real one is on each eye image, which should fix that. Also, right now rotating the camera doesn't work,
but that's because I was too lazy to do math and would take only a few minutes or so to fix.

This weekend I should have it in a passable state. Right now, as the [source code](https://github.com/JohnathonNow/runelite-3d)
shows, it is a fork of the entire [runelite](https://github.com/runelite/runelite) client. This probably won't be
necessary once I'm done, and I'll convert it to a standard plugin and see about adding it to the plugin hub.
