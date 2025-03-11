import setup from './setup';
import cards from '../../data/gundamCards.json';

class manager {

    static createGame(game) {
        game.cards = cards.cards;
        setup.createGame(game);
    }
}


export default manager;
