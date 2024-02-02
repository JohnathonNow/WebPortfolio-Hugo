+++
date = "2024-02-01T02:03:30-04:00"
draft = false
title = "Removing Boilerplate In Teams Messages Via Email"
heading = "Blog"
tags = [ "Work" ]
categories = [ "Work" ]
series = [ "Goofing off" ]
+++

Microsoft Teams allows you to message a channel by sending an email to
a certain address. This is great unless you are at a corporation that
appends some boilerplate to all outgoing emails. Then it is frustrating
and sad.

<!--more-->

## The problem  


It is very easy to automate sending a message on teams - 
[you can actually just send an email](https://support.microsoft.com/en-us/office/tip-send-email-to-a-channel-2c17dbae-acdf-4209-a761-b463bdaaa4ca).
We use this on my team to automatically send update notes when we
promote to production. There was one simple problem - our company
has an email gateway that automatically appends some legalize to
every email sent out of the company's domain. This is pretty
common, with it often saying something about the email potentially
having sensitive information and if you're not the intended receiver
please delete it, etc. So it was very unwelcome that this text
was appearing with our release notes.

## The hack  

The solution to this is simultaneously quite elegant while also a
totally gross hack - append an open script tag to the email you
are sending to Teams. That is, make sure your email ends with
`<script>`, and then boom, no more legalize super-glued to your
Teams message! It makes sense that this would work - Teams is
probably santizing the HTML from the email and removing all
script tags, but it is very funny that this works. I tried with
some other less scary tags but didn't have further success.

