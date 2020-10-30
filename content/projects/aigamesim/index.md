+++
date = "2020-10-30T12:24:00-04:00"
draft = false
title = "AI Game Sandbox"
tags = [ "Projects" ]
categories = [ "For Fun" ]
series = [ "AI Game", "Interactable" ]
+++

Just a place to mess around with the most current version of my [AI Game](https://johnwesthoff.com/series/ai-game/).

<!--more-->

{{< editor >}};;;;A demo for driving a little car robot
;;define the IDs of the six wheels
(def lf (part# 3) ;the left front wheel is the third part of the robot
     rf (part# 4) ;the right front wheel is the fourth
     lm (part# 5) ;the left middle is the fifth
     rm (part# 6) ;right middle
     lb (part# 7) ;left back
     rb (part# 8) ;right back
)
(def gs (part# 9)) ;define gyroscope
;;define two helper functions for controlling the robot like a tank
;;each take a speed in the range [-1, 1]
(def left  (fun '(speed) (do (lf speed) (lm speed) (lb speed)))
     right (fun '(speed) (do (rf speed) (rm speed) (rb speed))))

;;define the function that gets called every iteration of the game loop
;;it must be called run - it must take no arguments,
;;and it can alter global state
(def run (fun '() (do
    ;;spin fast
    (left 1)
    (right 1)
  )
  (log (+ "Gyro: " (gs)))
)))
{{< /editor >}}

{{< game >}}
