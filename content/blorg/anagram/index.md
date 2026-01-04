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

<div id="board" class="board"></div>
<div id="words"></div>

<script>
    console.log("hi");
    const board = document.getElementById('board');
    const words = document.getElementById('words');
    const inputBox = document.querySelector("#letters");
    let dragEl = null;
    let placeholder = document.createElement('div');
    placeholder.className = 'placeholder';

    function addWord(event) {
        let value = inputBox.value;
        board.innerHTML = "";
        for (let i = 0; i < value.length; i++) {
            let element = document.createElement("div");
            element.classList.add("tile");
            element.textContent = value[i];
            board.appendChild(element);
        }
    }

    inputBox.onkeyup = addWord;
    document.onload = addWord;

    // Helper to animate layout changes
    function animateLayout() {
        const tiles = [...board.querySelectorAll('.tile:not(.dragging)')];
        // 1. FIRST: Get current positions
        const firstPositions = tiles.map(el => el.getBoundingClientRect());

        // Perform the DOM change (this happens instantly)
        // ... (called inside move logic)

        requestAnimationFrame(() => {
            // 2. LAST: Get new positions
            const lastPositions = tiles.map(el => el.getBoundingClientRect());

            tiles.forEach((el, i) => {
                const dx = firstPositions[i].left - lastPositions[i].left;
                if (dx === 0) return;

                // 3. INVERSE: Move back to old position instantly
                el.style.transition = 'none';
                el.style.transform = `translateX(${dx}px)`;

                // 4. PLAY: Smoothly transition to 0
                requestAnimationFrame(() => {
                    el.style.transition = 'transform 0.2s ease-out';
                    el.style.transform = '';
                });
            });
        });
    }

    board.addEventListener('pointerdown', (e) => {
        const tile = e.target.closest('.tile');
        if (!tile) return;

        dragEl = tile;
        const rect = dragEl.getBoundingClientRect();
        
        dragEl.style.width = rect.width + 'px';
        dragEl.style.height = rect.height + 'px';
        dragEl.style.left = rect.left + 'px';
        dragEl.style.top = rect.top + 'px';
        
        dragEl.after(placeholder);
        dragEl.classList.add('dragging');
        dragEl.setPointerCapture(e.pointerId);
        e.preventDefault();
    });

    board.addEventListener('pointermove', (e) => {
        if (!dragEl) return;

        dragEl.style.left = (e.clientX - 32) + 'px';
        dragEl.style.top = (e.clientY - 32) + 'px';

        const siblings = [...board.querySelectorAll('.tile:not(.dragging)')];
        const nextSibling = siblings.find(sib => {
            const rect = sib.getBoundingClientRect();
            return e.clientX < rect.left + rect.width / 2;
        });

        const newPosition = nextSibling || null;
        if (placeholder.nextSibling !== newPosition && placeholder !== newPosition) {
            animateLayout(); // Animate others moving
            if (newPosition) {
                board.insertBefore(placeholder, newPosition);
            } else {
                board.appendChild(placeholder);
            }
        }
        e.preventDefault();
    });

    board.addEventListener('pointerup', (e) => {
        if (!dragEl) return;

        animateLayout();
        dragEl.classList.remove('dragging');
        dragEl.style.position = '';
        dragEl.style.left = '';
        dragEl.style.top = '';
        dragEl.style.width = '';
        dragEl.style.height = '';
        
        placeholder.replaceWith(dragEl);
        dragEl.releasePointerCapture(e.pointerId);
        dragEl = null;
        e.preventDefault();
        let word = board.innerText;
        let element = document.createElement("p");
        element.innerText = word.replaceAll("\n", "");
        words.append(element);
    });
</script>

<style>
    #letters {
        display: inline-block;
    }
    #letter-area {
        display: block;
    }
.board {
            display: flex;
            gap: 12px;
            padding: 20px;
            background-color: #7d5a44;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            position: relative;
            min-height: 80px;
        }

        .tile {
            width: 64px;
            height: 64px;
            background-color: #f3cf7a;
            border-radius: 6px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 28px;
            font-weight: bold;
            color: #333;
            cursor: grab;
            box-shadow: 0 4px 0 #bfa05a;
            user-select: none;
            position: relative;
            transition: transform 0.2s ease;
        }

        /* The Ghost/Placeholder */
        .placeholder {
            width: 64px;
            height: 64px;
            background-color: rgba(0, 0, 0, 0.2);
            border-radius: 6px;
            border: 2px dashed rgba(255, 255, 255, 0.2);
        }

        .tile.dragging {
            position: fixed; /* Detach from flex flow */
            pointer-events: none; /* Let us see elements underneath */
            z-index: 1000;
            transform: scale(1.1);
            box-shadow: 0 15px 30px rgba(0,0,0,0.3);
            transition: none;
        }

        /* .tile::after {
            content: attr(data-pts);
            position: absolute;
            bottom: 5px;
            right: 8px;
            font-size: 10px;
        } */

</style>