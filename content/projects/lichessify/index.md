+++
date = "2021-04-27T00:23:00-04:00"
draft = false
title = "Getting Free Analysis from Games on Chess.com with Lichessify"
tags = [ "Projects" ]
categories = [ "For Fun" ]
series = [ "" ]
+++
I have been playing like, a normal amount of chess lately. I'm not yet past the "don't just move your queen to her death" phase yet,
but I have noticeably gotten better since I rage-quit last year against my little brother.

<!--more-->

In any case, I find the daily analysis limit on [chess.com](https://chess.com) to be very, well, limiting. After finding out that
[lichess.org](https://lichess.org) has much less rude limits, I realized I could import my games there for free analysis.

Later I had what I considered to be a brilliant idea - a browser plugin that automatically copies your chess.com games to lichess.org!
I set off to do it, looking through the various requests that chess.com sends to its server to find where it 
keeps the [pgn](https://en.wikipedia.org/wiki/Portable_Game_Notation) for each game. As it turns out, the initial page has it,
and stores it in a nice variable in javascript. Coupled with the fact that lichess.org has a friendly and public API, I realized I could
do one better than a browser plugin, I could just write a bookmark. (After all, why waste time write lot code when few code do trick?)

So, I present <a href='(javascript:(function(){var xhr = new XMLHttpRequest(); xhr.open("POST", "https://lichess.org/api/import", true); xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); xhr.send(     "pgn="+encodeURIComponent(window.chesscom.analysis.pgn) ); xhr.onload = function() {    window.location=(JSON.parse(this.responseText).url); }}())'>Lichessify</a>.

If you simply save that to your bookmarks bar, whenever you click it while on the chess.com analysis page, it will whisk you away to the lichess.org analysis
of the very same game, where you can do your analysis free-er of fear of running into pesky daily limits.
