+++
date = "2026-13-03T16:03:30-04:00"
draft = false
title = "Um why was this server on Xenial???"
heading = "Project"
tags = [ "project" ]
categories = [ "project" ]
series = [ "for fun" ]
+++

I tried adding that anagram solver from the last post, but Hugo fails to build on this server, because the OS was twelve years old.

<!-- more -->

So I performed distro upgrades from 14 to 16 to 18 to 20 to 22 to 24. There's not a lot installed here,
so there wasn't a ton to break. That said, the only thing that actually matters, apache2, suffered a poor fate.

I just had to disable a few modules though. Some it helpfully told me about when starting apache2, others were in the error logs.

```bash
sudo a2dismod wsgi
sudo a2dismod python
sudo a2dismod php7.4
```

And, well, if you're reading this (you're not), the upgrade went smoothly with no trouble!
