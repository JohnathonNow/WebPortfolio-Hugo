/* tslint:disable */
/* eslint-disable */
/**
*/
export class Board {
  free(): void;
/**
*/
  constructor();
/**
* @returns {Int8Array}
*/
  raw(): Int8Array;
/**
* @returns {string}
*/
  string(): string;
/**
* @param {number} piece
* @param {number} row
*/
  place(piece: number, row: number): void;
/**
* @returns {number}
*/
  is_won(): number;
/**
* @returns {Uint32Array}
*/
  free_columns(): Uint32Array;
}
/**
*/
export class Evaluation {
  free(): void;
/**
* @returns {number}
*/
  score(): number;
/**
* @returns {Evaluation}
*/
  flip(): Evaluation;
/**
* @param {Evaluation} other
*/
  add(other: Evaluation): void;
/**
* @param {number} piece
* @param {number} slot
* @param {number} wins
* @param {number} losses
* @param {number} ties
*/
  constructor(piece: number, slot: number, wins: number, losses: number, ties: number);
/**
* @returns {number}
*/
  losses: number;
/**
* @returns {number}
*/
  piece: number;
/**
* @returns {number}
*/
  slot: number;
/**
* @returns {number}
*/
  ties: number;
/**
* @returns {number}
*/
  wins: number;
}
/**
*/
export class Evaluator {
  free(): void;
/**
*/
  constructor();
/**
* @param {Board} b
* @param {number} piece
* @returns {Evaluation}
*/
  get_move(b: Board, piece: number): Evaluation;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_evaluation_free: (a: number) => void;
  readonly __wbg_get_evaluation_piece: (a: number) => number;
  readonly __wbg_set_evaluation_piece: (a: number, b: number) => void;
  readonly __wbg_get_evaluation_slot: (a: number) => number;
  readonly __wbg_set_evaluation_slot: (a: number, b: number) => void;
  readonly __wbg_get_evaluation_wins: (a: number) => number;
  readonly __wbg_set_evaluation_wins: (a: number, b: number) => void;
  readonly __wbg_get_evaluation_losses: (a: number) => number;
  readonly __wbg_set_evaluation_losses: (a: number, b: number) => void;
  readonly __wbg_get_evaluation_ties: (a: number) => number;
  readonly __wbg_set_evaluation_ties: (a: number, b: number) => void;
  readonly evaluation_score: (a: number) => number;
  readonly evaluation_flip: (a: number) => number;
  readonly evaluation_add: (a: number, b: number) => void;
  readonly evaluation_new: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly __wbg_board_free: (a: number) => void;
  readonly board_new: () => number;
  readonly board_raw: (a: number, b: number) => void;
  readonly board_string: (a: number, b: number) => void;
  readonly board_place: (a: number, b: number, c: number) => void;
  readonly board_is_won: (a: number) => number;
  readonly board_free_columns: (a: number, b: number) => void;
  readonly __wbg_evaluator_free: (a: number) => void;
  readonly evaluator_new: () => number;
  readonly evaluator_get_move: (a: number, b: number, c: number) => number;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
}

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
