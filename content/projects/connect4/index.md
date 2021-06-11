+++
date = "2021-05-27T20:24:00-04:00"
draft = false
title = "Connect 4 - The Power (or, here, lack thereof) Two Choices"
tags = [ "Projects" ]
categories = [ "For Fun", "Interactable" ]
series = [ "AI", "Interactable" ]
+++

A year or so ago, in my lab's reading group we read the famous power of two choices in randomized load balancing paper, and it gave me an awful idea - 
what if we applied a similar idea to games?


<!-- more -->

As a very quick explanation, for the task of load balancing requests - basically, you have a bunch of servers handling
things for you like fetching emails, and you want to spread out the work evenly - a common approach is to just
pick a random server and send the next request there. But it turns out if you can pick two random servers and send
the request to the less burdened one, this is way, way better than just doing it randomly.

Now, as it turns out, for most games making random moves is like, not a good strategy. 
Others have [done work](https://www.youtube.com/watch?v=DpXy041BIlA) on quanitfying how not good random is for some games. And, as it turns out,
a lot of games that people actually bother playing aren't easy for computers to do. So I wondered, how much better than random, and how much
worse than optimal, is considering _two_ random choices at every step in a game, and going with the better of the two choices?

I had to pick a solved game, but I didn't want to pick a trivial game like tic-tac-toe where the best strategy is something everybody
can memorize in a few minutes. I decided to go with Connect 4, since as far as I'm aware it isn't terribly difficult for computers to solve
while still being difficult enough for humans that it's not boring.

So I wrote up my stupid idea in Rust, and realized that even if at every step the AI considers only two moves, it still takes forever to search.
So I wrote up a stupid metric for evaluating positions, which is just the 10x the number of wins minus 20000x the losses that the AI considers
possible futures. If this score is above 100000000 then it just goes with the move that leads there. I don't think this is elegant or works well
whatsoever, but it was quick. If I get some free time eventually I'd much rather see if [alpha-beta pruning](https://en.wikipedia.org/wiki/Alpha%E2%80%93beta_pruning)
helps at all.

Anyway, I also took the oppurtunity to see how compiling to wasm works for Rust, so now the connect 4 thingy is playable below. In the first few moves it's still very slow, so don't be shocked if it lags your browser.

{{< connect4 >}}

