+++
date = "2026-01-03T16:03:30-04:00"
draft = false
title = "Anagram Maker"
heading = "Project"
tags = [ "project" ]
categories = [ "project" ]
series = [ "for fun" ]
+++

I often do cryptic crosswords where I want to make anagrams, but I don't want to cheat all the way and generate a list of them. 

<!-- more -->

<input value="" id="letters"></input>


<script>
    console.log("hi");
    document.querySelector("#letters").onchange = function(event) {
        console.log(event.target.value);
    }
</script>