import positioner from './positioner';
import global from './global';

class gameManager {

    static createGame(manager, width, height) {
        global.game = { cards: [], tasks: [], popup: null };
        global.cards = manager.getCards();

        global.grid = positioner.createGrid(width, height);
        global.game.grid = global.grid;

        const deckLength = manager.getDeckLenth();
        global.game.player1 = this.createPlayer(global.cards, deckLength, true);
        global.game.player2 = this.createPlayer(global.cards, deckLength, false);

        global.game.player1.positions = positioner.getPositions(global.grid, true);
        global.game.player2.positions = positioner.getPositions(global.grid, false);
        global.game.fields = positioner.createField(global.game.player1.positions, global.game.player2.positions);

        const isPlayer1 = Math.floor(Math.random() * 2) == 1;
        global.isPlayer1 = isPlayer1;

        for (let i = 0; i < manager.getHandStartLength(); i++) {
            global.spawnOrMove(global.game.player1, null, global.locationDeck, global.locationHand, true);
            global.spawnOrMove(global.game.player2, null, global.locationDeck, global.locationHand, true);
        }

        return global.game;
    }

    static createPlayer(cards, length, isPlayer1) {
        let result = [];

        // TO DO : create deck by using decklist
        cards.forEach(card => {
            result.push(global.createCard(card.id));
            result.push(global.createCard(card.id));
            result.push(global.createCard(card.id));
            result.push(global.createCard(card.id));
        });

        result = result.splice(0, length);
        result.forEach(x => {
            x.index = global.getNextIndex();
            x.isPlayer1 = isPlayer1;
            x.location = global.locationDeck;
        });
        result = global.sortRandom(result);
        return { deck: result, shield: [], hand: [], field: [], trash: [], isPlayer1, base:[], empty:[]};
    }
}


export default gameManager;
