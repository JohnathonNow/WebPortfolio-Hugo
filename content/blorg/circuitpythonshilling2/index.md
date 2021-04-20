+++
date = "2020-04-20T18:03:30-04:00"
draft = false
title = "My new-er favorite thing - RP2040 with CircuitPython"
heading = "Blog"
tags = [ "Ads", "CircuitPython", "RP2040" ]
categories = [ "Ads" ]
series = [ "Goofing off" ]
+++

Back when I did [my Model M thingy with CircuitPython](https://johnwesthoff.com/projects/keyboard-2-circuitpython/), I encountered 
a lot of difficulties doing I/O. For one, the I/O speed was much too slow for bit-banging anything in Python. Now, you
could write some C and call it from Python, but that defeats the benefit of working with Python to begin with. Additionally,
hardware peripherals seemed to be destined to be behind in Python. I doubt this will ever change, but a certain recent product
seems to offer a bizarre best-of-all-worlds.


I ordered this [super smol RP2040 board from adafruit](https://www.adafruit.com/product/4900), and barring some disappointment
with the documentation, I am obsessed. It is built on the RP2040, a very unique microprocessor with a killer feature: 
it has two Programmable IO blocks that each have 4 state machines for running I/O programs. Basically, it has two special
co-processors each with room for 32 instructions and 4 independent state machines that can execute those instructions,
allowing you to bit-bang I/O protocols in the low level way that said task demands without being forced to use a CPU
core solely on I/O or having to worry about being fast enough for I/O and whatever actual processing you want to do.

But the really amazing feature is that these boards support CircuitPython, and adafruit has a library
for using the PIO from Python. It looks _super wonky_, with assembly programs being written inside
Python strings, but this is probably the best way to go about it. 

Now, [adafruit has a great guide on their library](https://learn.adafruit.com/intro-to-rp2040-pio-with-circuitpython), but
it does have one major omission - for my board, the QT RP2040, I could find no information on controlling the integrated RGB
LED. Specifically, I could not find what GPIO pin it was wired to. After digging for a while, I found a header file with
some pin declarations, and found that the RGB led is wired to pin 12, but its power is controlled by pin 11, meaning to get it working
you also need to set that pin high.

So with that in mind, I modified the NeoPixel example from the guide I just linked:
```python
# SPDX-FileCopyrightText: 2021 Scott Shawcroft, written for Adafruit Industries
#
# SPDX-License-Identifier: MIT

import time
import rp2pio
import board
import microcontroller
import adafruit_pioasm
from digitalio import DigitalInOut, Direction, Pull

# NeoPixels are 800khz bit streams. Zeroes are 1/3 duty cycle (~416ns) and ones
# are 2/3 duty cycle (~833ns).
program = """
.program ws2812
.side_set 1
.wrap_target
bitloop:
  out x 1        side 0 [1]; Side-set still takes place when instruction stalls
  jmp !x do_zero side 1 [1]; Branch on the bit we shifted out. Positive pulse
do_one:
  jmp  bitloop   side 1 [1]; Continue driving high, for a long pulse
do_zero:
  nop            side 0 [1]; Or drive low, for a short pulse
.wrap
"""

assembled = adafruit_pioasm.assemble(program)

NEOPIXEL_POWER = microcontroller.pin.GPIO11
NEOPIXEL = board.GP12

# Turn on power for the NeoPixel
led_power = DigitalInOut(NEOPIXEL_POWER)
led_power.direction = Direction.OUTPUT
led_power.value = True


sm = rp2pio.StateMachine(
    assembled,
    frequency=800000 * 6,  # 800khz * 6 clocks per bit
    first_sideset_pin=NEOPIXEL,
    auto_pull=True,
    out_shift_right=False,
    pull_threshold=8,
)
print("real frequency", sm.frequency)

for i in range(30):
    sm.write(b"\x0a\x00\x00")
    time.sleep(0.1)
    sm.write(b"\x00\x0a\x00")
    time.sleep(0.1)
    sm.write(b"\x00\x00\x0a")
    time.sleep(0.1)
print("writes done")

time.sleep(2)
```
