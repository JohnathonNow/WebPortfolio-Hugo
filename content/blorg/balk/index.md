+++
date = "2026-04-16T06:10:30-04:00"
draft = false
title = "You can't just be up there and just doin' a mongodb text search like that"
heading = "Blog"
tags = [ "mongodb" ]
categories = [ "mongodb" ]
series = [ "Goofing off" ]
+++

Recently I've been doing a lot of work involving indexed full text search in _Azure Cosmos DB for MongoDB_, and, man, are the pitfalls there _weird_.

To drive my points home, I'll tell my story somewhat interactively. Let's say you wanted to store the rules to a game in a mongdodb database. You might insert records such as rule_number and rule_text, containing the index of the rule in the book and the text of the rule, respectively. So, let's introduce our data:

|rule_number	| rule_text
|-------------|-----------
|1	| You can't just be up there and just doin' a balk like that.
|1a	| A balk is when you
|1b	| Okay well listen. A balk is when you balk the
|1c	| Let me start over
|1c-a|	 The pitcher is not allowed to do a motion to the, uh, batter, that prohibits the batter from doing, you know, just trying to hit the ball. You can't do that.
|1c-b|	 Once the pitcher is in the stretch, he can't be over here and say to the runner, like, I'm gonna get ya! I'm gonna tag you out! You better watch your butt! and then just be like he didn't even do that.
|1c-b(1)	| Like, if you're about to pitch and then don't pitch, you have to still pitch. You cannot not pitch. Does that make any sense?
|1c-b(2)	 |You gotta be, throwing motion of the ball, and then, until you just throw it.
|1c-b(2)-a|	 Okay, well, you can have the ball up here, like this, but then there's the balk you gotta think about.
|1c-b(2)-b|	 Fairuza Balk hasn't been in any movies in forever. I hope she wasn't typecast as that racist lady in American History X.
|1c-b(2)-b(i)	| Oh wait, she was in The Waterboy too! That would be even worse.
|1c-b(2)-b(ii)	| get in mah bellah -- Adam Water, The Waterboy. Haha, classic...
|1c-b(3)	| Okay seriously though. A balk is when the pitcher makes a movement that, as determined by, when you do a move involving the baseball and field of
|2 |	Do not do a balk please

You import all of these rows as documents, and you create a [text index](https://www.mongodb.com/docs/manual/core/indexes/index-types/index-text/) on the rule_text field.

Next, you implement a search feature in your rulebook application that uses the text index to perform the search.

One of your users, having forgotten just what a balk is, but vaguely remembering some of the first rule, searches `you can't be up there doing a balk like that` in effort to find just rule 1. It is nearly identical to the actual text of the rule, so your user expects it to come up as the only result.

To their surprise, all of these documents are returned:

|rule_number	| rule_text
|-------------|-----------
|1b	| Okay well listen. A balk is when you balk the
|1a	| A balk is when you
|2 |	Do not do a balk please
|1	| You can't just be up there and just doin' a balk like that.
|1c-b(2)-a|	 Okay, well, you can have the ball up here, like this, but then there's the balk you gotta think about.
|1c-b(2)-b|	 Fairuza Balk hasn't been in any movies in forever. I hope she wasn't typecast as that racist lady in American History X.
|1c-b(3)	| Okay seriously though. A balk is when the pitcher makes a movement that, as determined by, when you do a move involving the baseball and field of
|1c-b|	 Once the pitcher is in the stretch, he can't be over here and say to the runner, like, I'm gonna get ya! I'm gonna tag you out! You better watch your butt! and then just be like he didn't even do that.
|1c-b(1)	| Like, if you're about to pitch and then don't pitch, you have to still pitch. You cannot not pitch. Does that make any sense?

Befuddled from all the extra noise, your user reduces their search to `you can't be up there`, as they are certain these words are in the text. Here are the results:

|rule_number	| rule_text
|-------------|-----------


Your user is now even more confused about the balk rules than when they started, and they are completely lost as to how your search function works.

The issue here is [stop words](https://en.wikipedia.org/wiki/Stop_word). Mongodb has something like [174 of them](https://github.com/igorbrigadir/stopwords/blob/master/en/mongodb.txt). Basically, to avoid creating a massive index on common words, many text indices strip out the most common words from the corpus when creating the index, and then strip those same words out of any search queries. So when designing an information retrieval system that operates on full text search terms, you have to keep the preprocessing steps of your system in mind. Mongodb does let you disable this by setting the language to "none" in your index. Note that this will also disable stemming - when the search matches root words together (`run` matches `running` and `ran`, and `blueberry` matches `blueberries`, but `blue` does not match `blueberry`).

You're probably thinking, "jeffrie, that isn't enough pitfalls!"

Well, you're in luck! If you recall, I started this by saying that I've been working with _Azure Cosmos DB for MongoDB_. The [eagle-eyed](https://oldschool.runescape.wiki/w/Eagle_Eye) among you may have noticed that that has more words than just "mongodb." It turns out that the differences between Azure Cosmos DB for MongoDB and a self-hosted MongoDB do not stop with the name!

Now, the things we've discussed so far may have [gaslated](https://www.youtube.com/shorts/qCSEpCgEo-Q) me to the point of just being wrong on some details here, but [bear with me](https://en.wikipedia.org/wiki/Man_or_bear).

In the text search on a text with an index, queries with words in double quotes behave much the way they do in a search engine. That is, it must match everything in quotation marks in the order it appears in the documents. There are still some quirks, though. If our user had searched `pitcher motion`, they'd get back these results:

|rule_number	| rule_text
|-------------|-----------
|1c-b(2)	 |You gotta be, throwing motion of the ball, and then, until you just throw it.
|1c-a|	 The pitcher is not allowed to do a motion to the, uh, batter, that prohibits the batter from doing, you know, just trying to hit the ball. You can't do that.
|1c-b(3)	| Okay seriously though. A balk is when the pitcher makes a movement that, as determined by, when you do a move involving the baseball and field of
|1c-b|	 Once the pitcher is in the stretch, he can't be over here and say to the runner, like, I'm gonna get ya! I'm gonna tag you out! You better watch your butt! and then just be like he didn't even do that.

But if they instead search `"pitcher" "motion"` ([https://en.wikipedia.org/wiki/Jeopardy!](notice the quotation marks)), they'd instead get back:

|rule_number	| rule_text
|-------------|-----------
|1c-a|	 The pitcher is not allowed to do a motion to the, uh, batter, that prohibits the batter from doing, you know, just trying to hit the ball. You can't do that.

So, the behavior we are seeing here is that if there are multiple search terms, if they are not in quotes we OR them together (find documents that contain _any_ of the terms). but if they are in quotes we AND them together (find only documents that contain _all_ of the terms.)

This on its own isn't too bad, but if we do both searches in Azure Cosmos DB for MongoDB, we actually get back the same both times:

|rule_number	| rule_text
|-------------|-----------
|1c-b(2)	 |You gotta be, throwing motion of the ball, and then, until you just throw it.
|1c-a|	 The pitcher is not allowed to do a motion to the, uh, batter, that prohibits the batter from doing, you know, just trying to hit the ball. You can't do that.
|1c-b(3)	| Okay seriously though. A balk is when the pitcher makes a movement that, as determined by, when you do a move involving the baseball and field of
|1c-b|	 Once the pitcher is in the stretch, he can't be over here and say to the runner, like, I'm gonna get ya! I'm gonna tag you out! You better watch your butt! and then just be like he didn't even do that.

So in Azure CosmosDB for MongoDB, it would seem that search terms are always ORed together. Not so fast [buster](https://www.youtube.com/watch?v=14HkqP0JZ78)! This was the balk rule that inspired this article! We're only seeing the quoted terms being ORed together here because they each are only one word long! If instead our search terms were each multiple words long, they'd be ANDed together just like in our self-hosted MongoDB.

So if you searched `"The pitcher is not allowed" "motion to the, uh, batter"`, they'd be ANDed together, so it'd only return this:

|rule_number	| rule_text
|-------------|-----------
|1c-a|	 The pitcher is not allowed to do a motion to the, uh, batter, that prohibits the batter from doing, you know, just trying to hit the ball. You can't do that.

The cherry on top of all of this is that this stacks with the stop words removal rule. So if you searched `"The pitcher is not" "to do a motion to the"`, you might expect Azure CosmosDB for MongoDB to only return a document containing both of those phrases, but instead it will return:

|rule_number	| rule_text
|-------------|-----------
|1c-b(2)	 |You gotta be, throwing motion of the ball, and then, until you just throw it.
|1c-a|	 The pitcher is not allowed to do a motion to the, uh, batter, that prohibits the batter from doing, you know, just trying to hit the ball. You can't do that.
|1c-b(3)	| Okay seriously though. A balk is when the pitcher makes a movement that, as determined by, when you do a move involving the baseball and field of
|1c-b|	 Once the pitcher is in the stretch, he can't be over here and say to the runner, like, I'm gonna get ya! I'm gonna tag you out! You better watch your butt! and then just be like he didn't even do that.

because both search terms had their stop words removed, turning them into one-word quoted search terms, so they are ORed together...

One final bit of frustration is that if the search query has both single word quoted search terms and multi-word quoted search terms, all of the single word quoted search terms are effectively ignored. 

So, I guess the [moral of the story](https://www.youtube.com/watch?v=gAYL5H46QnQ) is that the rules for search terms are

|rule_number	| rule_text
|-------------|-----------
|1	| You can't just be up there and just doin' a mongodb text search like that
|1a	| An indexed text search is when you
|1b	| Okay well listen. A indexed text search is when you search the
|1c	| Let me start over
|1c-a|	 The document term is not allowed to do have any, uh, stop words, that prohibits the index from being built efficiently. You can't do that.
|1c-b|	 Once the stop word is in the search term, he can't be over here and say to the database, like, I'm gonna find ya! I'm gonna get a document out! You better watch your butt! the database will just be like he didn't even do that.
|1c-b(1)	| Like, if you're about to use an index in MongoDB, but you use Azure CosmosDB for MongoDB instead, you still gotta consider the stop words. You can't not consider them. Does that make sense?
|1c-b(2)	 | You gotta AND all the quoted search terms for MongoDB, but OR single-word ones for Azure CosmosDB for MongoDB.
|1c-b(2)-a|	 Okay, well, you can have the multi-worded quoted search term up here, like this, but then there's the stop words you gotta think about.
|1c-b(2)-b|	I'm tired of typing out this bit.
|2 |	Do not forget to consider the text preprocessing steps of your system please.
