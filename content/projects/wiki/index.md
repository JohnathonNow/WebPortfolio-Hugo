+++
date = "2021-05-18T17:24:00-04:00"
draft = false
title = "Using TiddlyWiki Behind Apache"
tags = [ "Projects" ]
categories = [ "For Fun" ]
series = [ "" ]
+++
This is mostly a reference for future me, or anyone else who wants to use [https://tiddlywiki.com/](TiddlyWiki)
behind a proxy with apache.

<!--more-->

Throughout my academic career, I've taken many different approaches to taking notes.

Prior to undergrad, I used regular [copybooks](https://www.mead.com/c/notebooks/school-notebooks/composition-notebooks/). Then in college everyone made fun of me
for calling them copybooks instead of notebooks, so I switched to using OneNote and a little keyboard on my tablet. This was nice for quickly
adding pictures to my notes, and being able to search was very helpful. But one day OneNote silently decided to silently stop syncing, and after
my tablet's battery died two weeks later all my notes from that period were lost forever. This obviously sucked, but paper notes aren't searchable as
easily, and aren't as accessibly from anywhere. So I switched between OneNote and paper for a few years, until I decided to start using
[my own thing](https://johnwesthoff.com/projects/notes/).

I used that markdown-lite setup I made until the end of my first year of grad school. At that point,
I wasn't taking classes anymore, so "just write down what people say quickly" was no longer _how_ I took notes.
Now I wanted notes to organize thoughts. In the past when goofing off and working on games, I used a moleskin notebook
to track everything - I find the gridlines very helpful for being organized. I switched to doing the same for
my research for about a semester before switching back to digital, then using a mix of Dropbox Paper and Google Docs.
The problem I have with those solutions, however, is it's hard to link my thoughts together. Specifically, I was reading
a lot of papers, and I wanted somewhere to summarize them or otherwise write my thoughts about them, then work that into
my thoughts about research. I settled on TiddlyWiki, and set it up at the start of the pandemic.

I quite like TiddlyWiki. I have a lot of issues with it - I don't get why they use their own markup language instead of markdown, getting
it to work behind apache was miserable, the login button took me to my blog homepage instead of the wiki page, and probably some other things I've supressed from
my memory. But it has a very cool macro system, the tags work well, it's all easy to use, and I can access it anywhere.

Anyhoo, if you're like me and running tiddlywiki on a server running apache2, I have some recommendations.

1. Run it on a subdomain instead of using a pathprefix. This does two things for you:
    1. Now if you have a link to `/login-basic`, after logging in, it will keep you on the wiki instead of sending you to your main site. I'm not sure why the 
login ignores the pathprefix for me, but it does, and that is sad.
    2. You don't have to deal with [this nonsense](https://tiddlywiki.com/#Using%20a%20custom%20path%20prefix%20with%20the%20client-server%20edition). Seriously
why do you have to create a page to configure something I'm literally shaking rn.
2. If you must use a path prefix, then, as [this nonsense](https://tiddlywiki.com/#Using%20a%20custom%20path%20prefix%20with%20the%20client-server%20edition) says,
you have to also create a tiddle named `$:/config/tiddlyweb/host` whose contents are the full path of your wiki, including the protocol (https) and pathprefix.
3. If you are using a subdomain, make an apache configuration that looks like this:
```
<IfModule mod_ssl.c>
<VirtualHost *:443>
    ServerName yoursub.domain.com
    ProxyPass / http://127.0.0.1:8900/
    ProxyPassReverse / http://127.0.0.1:8900/
</IfModule>
</VirtualHost>
```
4. If you are using a path prefix, you would instead use a configuration like:
```
<IfModule mod_ssl.c>
<VirtualHost *:443>
    ServerName yoursub.domain.com
    <Location /pathprefix>
        ProxyPass http://127.0.0.1:8900/pathprefix
        ProxyPassReverse http://127.0.0.1:8900/pathprefix
    </Location>
</IfModule>
</VirtualHost>
```
Note the differences in the `ProxyPass` and `ProxyPassReverse` between the two configurations.
