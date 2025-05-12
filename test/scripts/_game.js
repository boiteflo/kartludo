import board from './board.js';

export class Game {
  static setup(game, width, height) {
    board.createBoard(game, width, height);
  }
  
  static resize(game, width, height) {
    board.createBoard(game, width, height);
  }
}
