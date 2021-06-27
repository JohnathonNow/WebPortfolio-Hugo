+++
date = "2021-06-27T02:24:00-04:00"
draft = true
title = "Sequential Consistency Sandbox"
tags = [ "Projects" ]
categories = [ "For Fun" ]
series = [ "Consistency", "Interactable" ]
+++


<!--more-->

{{< editor >}};;;;hoo
(machine
    (put "bob" 1)
    (wait "bob" 2)
    (get "bob")
)
(machine
    (wait "bob" 1)
    (put "bob" 2)
    (get "bob")
)
{{< /editor >}}

{{< consist >}}
