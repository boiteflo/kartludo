import board from './board.js';

export class Game {
  static setup(game, width, height) {
    board.createBoard(game, width, height);
  }
}
