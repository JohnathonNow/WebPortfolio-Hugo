+++
date = "2021-02-15T06:04:14-04:00"
draft = false
title = "The Unlikely Cost of Hobby Software Development"
heading = "Blog"
+++

A [game I started writing in High School](https://github.com/JohnathonNow/Bending) just almost cost me $98, and not in any way
that makes any sense.

<!--more-->

Way back in 2012, I discovered the language php. I saw how it could
read the [part of URLs after the question mark](https://en.wikipedia.org/wiki/Query_string), and
I immediately realized that that's how all those "we emailed you a link, please click on it!"
registration things worked. This, to me, was one of the most exciting things in the world.

At the time, I had been writing a game kinda similar to pocket tanks, where players
can shoot things at each other and blow holes in the ground. It was an online game,
where players host their own servers like a lot of older games did. I realized
I could use php to have a centralized list of all the servers running. I realized
I could use php to have each server update a webpage saying how many people were
connected to each. I even realized I could have one of them fancy account
registration things for players, so it could keep track of how many times you
won games, and then I could even have it send them one of those confirmation emails.

I got to work on writing my fancy send-someone-an-email-confirmation php script
and sent myself about 30 emails, which promptly filled my gmail inbox full of garbage.


```php
<?php
// some old code I wrote in september 2012 to send one of those fancy registration emails
$verify = $_GET['name'];
$message =    "<h1>Hello! To complete your registration<br>"
              . "just click the following link:<br>"
              . "<a href = \"http://johnbot.net78.net/yes.php?name=" . $verify . "\"> Verify Account </a></h1>";
$to = $_GET['to'];
$subject = "Complete your registration!";
$from = $to;
$headers = "From: " . $from . "\r\n";;
$headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
mail($to,$subject,$message,$headers);
echo "Success";
?>	

```

So I did the sensible thing and told gmail to filter emails with the subject "Complete your registration!" -
rather than cluttering my inbox, they would instead go to a special folder labeled "Test". I would then completely
forget about all of this for almost a decade.

Fast forward to the year of the apocalypse. I moved out of my Brooklyn apartment,
got married, and moved in with my wife. I get an email from an insurance company,
who I guess purchased my policy from my previous insurer, and assured me I didn't
need to do anything because they'd just renew my policy and charge me automatically.
Of course, I didn't live in that apartment anymore so I didn't _want_ them doing that. 

I registered an account with them in December. And then a few times in January. Every time I registered
an account, it told me I had to confirm my email to complete my registration. Every time, I never
received the email. I was furious, and worried I'd be charged $98.

Today, by a stroke of luck, I figured I'd try searching the name of the new insurer, to see if they
ever sent me anything else... and all of the confirmation emails showed up. I then checked all of my
folders, and saw that they were in my Test folder. Finally, I checked the filter rules for my
gmail account, and removed that one. Oops.
