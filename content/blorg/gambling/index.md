+++
date = "2021-08-31T16:03:30-04:00"
draft = true
title = "Thoughts on Online Gambling"
heading = "Blog"
tags = [ "RuneScape" ]
categories = [ "RuneScape" ]
series = [ "Goofing off" ]
+++

I've posted a few times now about RuneScape, and since recently I've been falling behind
on my GitHub commits, I figured I'd do it again.

<!-- more -->

# Backstory

Shortly after deciding to make RuneScape 2 in 3D, I started to
message my good friend a3qz some thoughts on how one could do
fair gambling in the game Old School RuneScape. You see, ever
since I was a kid, people would gamble in the game. This typically
took the form of using the Duel Arena and staking, but it also
involved planting flowers and betting on what color grew. More
recently, bots have flooded the game that effectively pick
a random number between 1 and 100, and you win if you roll
above, say, 60.

These are almost certainly a scam, and not just because of
the odds favoring the house. We have no way to know if the
RNG it is using is fair - it could even just always have you
lose! In fact, I'd definitely believe that they always have
legitimate players lose, and have an allow-list of users who
will win that are in on the scam. Even if the source code
was available for us to read, there would be no way for us
to verify that that's the actual code that's running. So how
can we gamble in our MMO with confidence that everything is fair?

Well, rather than just go and read about all the solutions that
I'm sure exist, I thought it would be fun to think through this
problem. Big disclaimer, I have absolutely no idea what I'm talking
about here, so don't like, treat any of this as accurate or "good".

# Decks of Cards

In real life, decks of 52 playing cards are commonly used for gambling.
I don't really have much experience with that - while recently driving
from Western Massachusetts to Northern California, I stopped at a casino
in Nevada with $10 in my pocket, and 4 confusing hands of video blackjack
later I had no more money. But anyway, shuffling a deck of cards and then
dealing them is a common thing in gambling. So one thing we could
do is shuffle a deck of cards, hash it, and tell the players what the hash is.
Then, after the game is played, we reveal the original deck, and they
can verify that the deck used was set in stone at the beginning, that is, that
the house didn't change it midway through for their advantage. This solves
our issues, right?

Well, no - the house could be dishonest and
only issue decks that it knows are likely to advantage the dealer. In black
jack, this could mean having a ten, a two, and another ten be the cards
meant for the player, as they are likely to hit on a 12 (and would bust),
and if they stand, the house can ensure they'll get to 17 or higher without busting,
beating the 12.

So what if we went with a game that doesn't let the house cheat like this?
In the gameshow Cardsharks, there is a deck of cards that players will draw from,
guessing if the next card will be higher or lower than the most recently drawn card.
We could do the same thing, right? Shuffle a deck, hash it, send the hash, draw one card,
reveal it, ask for high-or-low, and then draw another, and reveal the deck?

Again this kinda won't work. Two decks can hash to the same value, so the dishonest
house could find pairs of decks with the same first card and the same hash, but
with different answers for "is the second card higher or lower than the second?"
Then, the cheaters could just choose which deck to go with after getting your answer.
Fooey.

# Maybe an Approach that Works

Should "that" be capitalized? I don't know.

We could try moving away from decks for a bit, to think about more simple games.
Perhaps the simplest betting game is the house flips a coin, and the player guesses
heads or tails. Now, obviously you cannot have the player guess first, since the house
could just always say the opposite of what the player said. And even if the house
flips first, they could just lie about it. So what can we do?

Well, one approach could be to flip a coin, and then based off the result of the
coin flip the house can generate a difficult computational problem such that
the problem has a "yes" answer if the coin is heads, and a "no" answer if the coin
is tails. Now, these problems would have to be big enough that they are
both hard to solve and also unlikely to be generated twice and the result memorized.

For example, the house could flip a coin. If it is heads, the house sends a random prime number
to the player, and if it is tails, they send a random composite number. The player then gets
a few seconds to answer (so as to not get to cheat and solve the difficult computational problem),
and after they make their guess, the house reveals the answer. The player can then verify
that they were honest, and there is no way for the house to have changed the game midway through.

This does work, but it has the unfortunate side effect of giving the player a slight edge -
they could try a few random solutions to the computational problem and could get lucky
and find it in time. This might be counteracted by the time constraint - maybe the
player's internet is more likely to drop out for a few seconds than they are
actually solve whatever the chosen problem is in the time constraint. It's hard to know
this for certain, though. Another downside is that the game only has two outcomes,
whereas real gambling games have like, several. Roulette, for example, has
38 different outcomes. That's not a power of two last time I checked, so we cannot
simply repeat this game 5 or 6 times and have it map nicely. 

# An Apprach That Probably Doesn't Work

Well, ok, what if instead of sending prime or composite, we always send a composite. This composite will
be semi-prime, that is, the product of two primes. These primes will be randomly chosen. Let X be the
larger of the two primes. What we bet on now is what the value of X mod 7 is. Because X is prime, this
will never be 0 (because then X is divisible by 7 and therefore not prime), and will always take
on values between 1 and 6. Hey, that's like, the values from a die! And, as far as I know,
all values are equally likely to show up. Neat.

But wait, the example I just gave is Roulette, which has 38 possible numbers. So like, can we take
X modulo 39? Well, no, because 39 is not prime. No prime, for example, is congruent to 36 modulo 39:
that would mean the prime is equal to 39x + 36, which is the same as 3(13x + 12), meaning it would
be divisible by 3 and therefore not prime. So how can we do a Roulette wheel with this silly idea?


