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

<div id="letter-area"/>

<script>
    console.log("hi");
    let area = document.querySelector(".letter-area");
    document.querySelector("#letters").onchange = function(event) {
        let value = event.target.value;
        console.log(event.target.value);
        area.innerHTML = "";
        for (let i = 0; i < value.length; i++) {
            let element = document.createElement("div");
            element.classList.add("letter");
            element.textContent = value[i];
            area.appendChild(element);
        }
    }
</script>

<style>
    #letters {
        display: inline-block;
    }
    #letter-area {
        display: block;
    }
    .letter {
        width: 32px;
        height: 32px;
        border: 1px black;
    }
</style>