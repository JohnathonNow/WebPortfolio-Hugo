+++
date = "2021-12-18T21:54:00-07:00"
draft = false
title = "AlephZeroChess 2 - Lessons Learned from WASM"
tags = [ "Projects" ]
categories = [ "For Fun" ]
series = [ "AlephZeroChess" ]
+++


I've had some new-found motivation to work on my [big chess game](http://alephzerochess.com/), but hit a silly problem.

<!--more-->

Basically, like all chess games, I want users to be able to click or drag a piece, and have squares that are legal to move to highlighted
in some way. This comes with some unique challenges with an infinitely large chess board, as you cannot simply enumerate every move.
There are several approaches you can use to overcome this - for example, for each of the pieces that can move infinitely in a direction, you could compute
how far in each direction it can move before it would colide with another piece by looping over the other pieces and doing algebra. The method I settled
on is instead allow for querying if a move between two squares is legal, as this seemed easier to implement and not worse enough given that
users tend not to make millions of moves per second. In any case, to show users what moves they are allowed to make, I need to implement a move validator.

Now, because I started this project while on a "build my rust portfolio" spree, the backend is written in rust. I actually quite like it for
my typical long-polling web-app shenanigans, especially compared to nodejs and python. This is where my silly problem comes in. The front
end of my chess game is written in JavaScript, as one does. Thus, it has a move validator written in JavaScript. But I can't trust that clients'
moves are legal on the server, they would just lie and cheat and enpassant the opponent's queen. I saw four potential solutions:  
1. Require clients to prove their move is valid.  
2. Run the JavaScript valdiator server side, either embedding a JS interpretter in rust or by rewriting in nodejs.  
3. Send every move validation request to the backend rather than doing it client side.  
4. Compile the backend validator to webassembly and run it in the client.

Now, obviously from the title you can tell which method I went with, but I will still explain my reasoning. Idea 1 seems like a non-starter,
as I'd then be verifying their proof server-side, and thus still implementing more things than necessary compared to the other ideas. Idea 2
to me just stood out as ridiculous, but honestly I was strongly considering it. Ultimately I said, well, then why even have written anything in rust?
But I _wanted_ to, that was why the project was started. Idea 3 I initially implemented because it took all of 11 minutes, but I knew I wouldn't
stick with it because of the latency of showing move options. How could I support bullet chess if I required an extra RTT for moves to be made???

Idea 4 just really called my name. WASM seems like a useful technology to learn about, and this is a fun way to learn.
There was just one problem - the interface to the board was written like this:
```rust
Board::get_piece_at(&mut self, rank: BigInt, file: BigInt) -> &Piece;
Board::is_move_legal(&mut self, from_rank: BigInt, from_file: BigInt, to_rank: BigInt, to_file: BigInt) -> bool;
Board::place_piece(&mut self, piece: Piece);
```

WASM was furious. It was spicy. It hated me passing around objects like that. Fair enough. It was easy enough to say that like, I don't _have_ to return
a piece reference, I could return an index into the list of pieces instead, and provide a way to access that. I also could pass around Strings instead of BigInts.
I also made all of the members of the Board struct private, because otherwise wasm-bindgen would automatically generate accessors, which might return Pieces or BigInts and thus not be allowed.
I hated having to do this (because effort but also serializing and deserializing everywhere is so sad), but I rewrote all of my code.

I then held my undo button for like 3 minutes straight, as I realized that only the public interface to WASM needed to be different, and as long as everything
else was only visible at the crate level everything would be fine. I created a WasmBoard struct that has a private Board member, and has the following interface:
```rust
WasmBoard::get_piece_at(&mut self, rank: String, file: String) -> usize;
WasmBoard::is_move_legal(&mut self, from_rank: String, from_file: String, to_rank: String, to_file: String) -> bool;
WasmBoard::place_piece(&mut self, piece_type: String, rank: String, file: String, color: String);
```

WasmBoard basically just handles the serialization and deserialization for BigInts and punts the method calls off to the underlying Board instance, and then once
in the rust code we are free to pass around references and return complex data types and eat hot chip and lie. We just need to make sure our interface callable
from JS is acceptable to the mighty wasm. And we can get around needing to return references by returning indices into whatever data structure is holding our data.
So now my chess game has a single move validator written in rust that runs on both the backend and in the client, which I think is pretty cool.
