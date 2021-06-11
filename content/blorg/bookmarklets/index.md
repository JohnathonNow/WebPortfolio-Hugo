+++
date = "2021-06-11T02:03:30-04:00"
draft = false
title = "Random Bookmarklets"
heading = "Blog"
visible = false
tags = [ "Bookmarklets" ]
categories = [ "Bookmarklets" ]
series = [ "For Fun" ]
+++

Hello, this is the page on the internet where there are a few random bookmarklets that are likely only useful for me, Jeffrey. However, on the off chance they are useful to anyone else, they are provided here, free of charge!

 - <a href='javascript:(function(){var xhr = new XMLHttpRequest(); xhr.open("POST", "https://lichess.org/api/import", true); xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); xhr.send(     "pgn="+encodeURIComponent(window.chesscom.analysis.pgn) ); xhr.onload = function() {    window.location=(JSON.parse(this.responseText).url); }}())'>Lichessify</a> - the first bookmarklet I ever made, it converts a Chess.com analysis page into a lichess analysis page. I blogged about it [here](/projects/lichessify).  
 - <a href='javascript:(function(){var s = ""; for (var x = 0; x < $("[name=\"sshurl\"]").length; x++) s += ($("[name=\"sshurl\"]")[x].innerText.split(" ")[3].split("@")[1]) + "\n"; navigator.clipboard.writeText(s);}())'>CloudLab URLs</a> - this one copies to your clipboard all of the URLs to a node on [CloudLab](https://www.cloudlab.us/).