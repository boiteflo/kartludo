import GameGundamGlobal from './GameGundamGlobal';
import GameGundamGridAndSize from './gameGundamGridAndSize';

class GameGundamSetup {

    static createGame(width, height) {
        GameGundamGlobal.size = GameGundamGridAndSize.calculateGameSize(width, height);

        GameGundamGlobal.world = {
            size: GameGundamGlobal.size,
            cards: [],
            popup: null
        };
        GameGundamGlobal.world.player1 = this.createPlayer(GameGundamGridAndSize.getPlayerPosition(true), true);
        GameGundamGlobal.world.player2 = this.createPlayer(GameGundamGridAndSize.getPlayerPosition(false), false);

        GameGundamGlobal.draw(GameGundamGlobal.world.player1, 9);
        GameGundamGlobal.draw(GameGundamGlobal.world.player2, 5);

        GameGundamGlobal.isPlayer1Turn = false; //Math.floor(Math.random() * 2) == 1;
        const nonPlayerTurn = GameGundamGlobal.getPlayerTurn(); 
        nonPlayerTurn.resourcesEx = 1;

        GameGundamGlobal.world.player1.shield = GameGundamGlobal.addToShield(GameGundamGlobal.world.player1, 6);
        GameGundamGlobal.world.player2.shield = GameGundamGlobal.addToShield(GameGundamGlobal.world.player2, 6);

        return GameGundamGlobal.world;
    }

    static createPlayer(position, isPlayer1) {
        let deck = this.createDeck(isPlayer1);
        deck = GameGundamGlobal.sortRandom(deck);
        const result = {
            deck,
            position,
            isPlayer1,
            hand: [],
            field: [],
            shield: [],
            grave: [],
            resAString: "0",
            resourcesMax: 8,
            resourcesRemaining: 0,
            resourcesEx: 0,
            resBString: "0",

        };
        result.base = this.createDefaultBase(result);
        return result;
    }


    static createDefaultBase(player) {
        const card = GameGundamGlobal.clone(GameGundamGlobal.cards.find(x => x.id === "EXBP-001"));
        card.index = GameGundamGlobal.index;
        GameGundamGlobal.index++;
        GameGundamGlobal.spawnCard(player, card, GameGundamGlobal.locationBase);
        return card;
    }

    static createDeck(isPlayer1) {
        let result = [];

        // To delete after test
        /*
        const gundam = GameGundamGlobal.clone(GameGundamGlobal.cards.find(x => x.id === 'GD01-034'));
        const trowa = GameGundamGlobal.cards.find(x => x.id === 'ST02-012');
        for (let i = 0; i < 21; i++)result = result.concat([GameGundamGlobal.clone(gundam), GameGundamGlobal.clone(trowa)]);
        */

        GameGundamGlobal.cards.forEach(card => {
            result.push(GameGundamGlobal.clone(card));
            result.push(GameGundamGlobal.clone(card));
            result.push(GameGundamGlobal.clone(card));
            result.push(GameGundamGlobal.clone(card));
        });

        result = result.splice(0, 50);
        result.forEach(x => {
            x.index = GameGundamGlobal.index;
            x.isPlayer1 = isPlayer1;
            x.location = GameGundamGlobal.locationDeck;
            GameGundamGlobal.index++;
        })
        return result;
    }
}


export default GameGundamSetup;
