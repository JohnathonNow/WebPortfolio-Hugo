+++
date = "2021-07-12T22:03:30-04:00"
draft = false
title = "Thoughts on Babysitting GitHub Copilot"
heading = "Blog"
tags = [ "Plagiarism", "GitHub Copilot" ]
+++

[GitHub Copilot](https://copilot.github.com/) is a very cool idea, and at the very least will be very fun to play around with.
But there're definitely some things to be concerned about.

<!--more-->

Copilot generates code suggestions for you, as an "ai pair programmer". The problem with having
an AI generate code for you, however, is you don't know or trust them. This leads to both
[security considerations](https://gist.github.com/0xabad1dea/be18e11beb2e12433d93475d72016902)
and potentially legal ones - you don't know that it isn't just copying verbatim a function
from its training data. I have really no idea what the exact legal ramifications of
using pieces of copyrighted code in your codebase, but I don't imagine it changes
if you accidentally get access to that copyrighted code through an AI. Now, I think addressing
these concerns is important if an idea like Copilot is going to succeed, but I _also_ don't really
have any experience with making sure a code snippet doesn't have security vulnerabilities baked in.
I do, however, have an idea on how to stop it from copying and pasting training code into your project.

The core of the idea is simple - we already have a probably-good-enough-ish solution in the academic world in fact - plagiarism detection.
Essentially, given a collection of works, we check if any of them have suspiciously matching contents. In the classroom setting
in Computer Science, typically professors will take every assignment and run them through a system such as Moss [(Measure of Software Similarity)](https://theory.stanford.edu/~aiken/moss/). I think we can check plagiarism of all of the training data for Copilot against each code suggestion it generates.
To explain my idea though, I think I should first explain how these plagiarism systems work.

Moss works in a few steps. First, it normalizes the code, removing all insignificant whitespace and changing all identifiers to the same thing (to prevent
simply renaming variables and functions to trick the system). Then, it tokenizes the input. Next, it fingerprints each input program by dividing them
into a sequence of overlapping k-grams, where k is chosen based on the programming language used. Each k-gram is hashed, and then a subset of the hashes are chosen 
by Moss's "winnowing algorithm". The winnowing algorithm divides the k-grams into overlapping windows, and the minimum hash value of the window is chosen to
fingerprint that section of code. When a hash value for a window is chosen, if it is the same as the previous window's hash, it is ignored. 
This reduces the number of hashes that make up the fingerprint for the program, as the minimum hash value for one window is likely to be
the minimum value for several windows in a row. This video by a complete stranger describes it better than I could:

{{< youtube JNW4v93fHr8 >}}

Now, Moss wasn't really designed with something like checking Copilot in mind - it was built to check many to many pairwise, not one to many, and it was designed
to handle maybe a few hundred or a few thousand source files? Given how long it takes to run for sane class sizes, I don't expect it would work for _billions_ of
input programs. Of course, there _are_ plagiarism detectors built to check against billions of documents - even the 
[first product I found online](https://unicheck.com/) can handle that. And while I think these systems obviously have imense value, they're not well suited
for this either. Unicheck claims to take about 4 seconds to process a file - I think for a suggestion tool this much latency would make people angry
and cause them to stop using it. (I suppose it could give you the code and then check in the background, which would probably work given how infrequently
Copilot gives verbatim code, but it could be equally frustrating to get a suggestion and start tweaking it just for a popup to come and say "oops this code
isn't legal for you to use!". Further, I'm not sure about how _seeing_ the code and then implementing the same function plays with the law.)
Additionally, unicheck has checked 124 million files, and their copyright is from 2017. But let's say all 124M files were processed in one year, only
during east coast business hours. That's about 12 checks per second. 
It might not be fair to draw conclusions about how much throughput their system can achieve from this, but it seems likely that this style of plagiarism
checker wouldn't meet the needs of a Copilot babysitter.

My idea, then, is to make a new plagiarism detector for the era of low-latency suggested code from training sets. The system would work much the same
way Moss does - by fingerprinting programs and comparing the resulting fingerprints. At the beginning of time before the system is up and running, we
can fingerprint every source file used in the training set. We then create a distributed mapping of fingerprints to the list of source files
that contain said fingerprint. This mapping will be partitioned N ways - perhaps each partition stores only hashes that equal some index modulo N.

When Copilot generates a suggestion, it could send the suggestion to the babysitter system. the babysitter then fingerprints the code sample, and allocates
N buffers. It inserts into each ith buffer the hashes that are tracked by the ith partition in the system, and then sends each buffer to the corresponding
partition server. The partition server replies with a list of source files that had matching hashes (and how many hashes matched for each file), which
are aggregated by the babysitter. The babysitter then decides if potential plagiarism has occured the same way humans typically do - by seeing if the number
of matches exceeds some threshold. The babysitter reports its findings to Copilot, which could then either give the suggestion to the user,
or if it fails the plagiarism check, perhaps still give the suggestion to the user along with a comment containing the code it believes it could have
plagiarised for the user to make the final judgement call as to whether or not the code is too similar to use.
