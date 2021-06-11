+++
date = "2019-03-20T20:24:00-04:00"
draft = false
title = "Prototyping RGB LED Patterns in JavaScript"
tags = [ "Projects" ]
categories = [ "For Fun", "Interactable" ]
series = [ "2607", "Interactable" ]
+++

I have been asked semi-frequently to add LED strips to various things, so I figured I'd like something that lets me play with LED strip patterns.

<!--more-->

Below is my attempt at creating one. It's pretty simple, but I think it'll work nicely.

<link rel="stylesheet" type="text/css" href="style.css">
<script src="https://johnwesthoff.com/js/jquery.min.js"> </script>
<script src="leds.js"></script>

---

<ul id='ledstrip'></ul>

{{< jseditor >}}
step = function (time) {
    for (var i = 0; i < NUMPIXELS; i++) {
        var r = triangle_wave(time / 4 + i, 10);
        var g = triangle_wave(time / 4 + i + 5, 10);
        var b = triangle_wave(time / 4 + i + 10, 10);
        set(i, r, g, b);
    }
};
function triangle_wave(x, radius) {
    return Math.abs((x % (radius*2)) - radius) / radius * MAX;
} 
{{< /jseditor >}}

---

I stole some code from my [graduation cap](https://johnwesthoff.com/projects/gradcapus/) to make
a line of "LEDs". I defined some simple helper functions (described below) for managing the LEDs - these functions are meant
to mirror the functions commonly available in WS2812B libraries, namely functions for getting and setting the nth LED in the strip.
Finally, I basically just `eval` the contents of the code editor above, which lets you redefine the `step` function, which I call from
some code that has been `setInterval`ed.


You can edit the script. The function `step` is called 50 times a second, and it takes as input a number that increases by one every
time `step` is called. There are 32 LEDs for you to play iwth in my little example. 

The `Run` button runs the code in the editor, while the `Share` button reloads the page to a URL that will load the code in the text box, which
you can then share with others.

Here is a description of the helper functions I provide:

```javascript
function set(index, r, g, b)
```
<div>
<b>Sets the LED at index to have the color (r, g, b)</b>
<ul><li><code>index</code> is numbered from 0 to NUMPIXELS.  </li>
<li><code>r</code>, <code>g</code>, and <code>b</code> can be between 0 and 255, inclusive.  </li>
<li><code>get(index)</code> sees the result of this function immediately,
but the color will not change until after step terminates.  </li>
</ul>
</div>

<br>

```javascript
function get(index)
```
<div>
<b>Gets the LED at index</b>
<ul>
<li><code>index</code> is numbered from 0 to NUMPIXELS.  </li>
<li>This returns an object with three properties:
<code>'r'</code>, <code>'g'</code>, and <code>'b'</code> - these properties represent
the red, blue, and green values of the color of the LED at <code>index</code>.
</li>
</ul>
</div>
<br>
<div>
I also define a few constants, which may also be helpful:
<ul>
<li><code>NUMPIXELS</code>: the number of LEDs in the strip (<code>32</code>).</li>
<li><code>MIN</code>: the minimum LED subpixel value (<code>0</code>).</li>
<li><code>MAX</code>: the maximum LED subpixel value (<code>255</code>).</li>
<li><code>FPS</code>: the number of times per second <code>step</code> is called (<code>50</code>).</li>
</ul>
</div>
