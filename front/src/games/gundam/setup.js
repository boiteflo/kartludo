import global from './global';

class setup {

    static createGame(game) {
        global.size = gridAndSize.calculateGameSize(width, height);

        global.world = {
            size: global.size,
            cards: [],
            popup: null,
            logs: 'Start game<br>'
        };
        global.world.player1 = this.createPlayer(gridAndSize.getPlayerPosition(true), true);
        global.world.player2 = this.createPlayer(gridAndSize.getPlayerPosition(false), false);

        global.isPlayer1Turn = Math.floor(Math.random() * 2) == 1;
        const nonPlayerTurn = global.getPlayerTurn();
        nonPlayerTurn.resourcesEx = 1;

        global.world.player1.shield = global.addToShield(global.world.player1, 6);
        global.world.player2.shield = global.addToShield(global.world.player2, 6);

        global.draw(global.world.player1, 5);
        global.draw(global.world.player2, 5);

        return global.world;
    }

    static createPlayer(position, isPlayer1) {
        let deck = this.createDeck(isPlayer1);
        deck = global.sortRandom(deck);
        const result = {
            deck,
            position,
            isPlayer1,
            number : isPlayer1 ? 1 :2,
            hand: [],
            field: [],
            shield: [],
            grave: [],
            resAString: "0",
            resourcesMax: 0,
            resourcesRemaining: 0,
            resourcesEx: 0,
            resBString: "0",

        };
        result.base = this.createDefaultBase(result);
        return result;
    }


    static createDefaultBase(player) {
        const card = global.clone(global.cards.find(x => x.id === "EXBP-001"));
        card.index = global.index;
        global.index++;
        global.spawnCard(player, card, global.locationBase);
        return card;
    }

    static createDeck(isPlayer1) {
        let result = [];

        // To delete after test
        /*
        const gundam = global.clone(global.cards.find(x => x.id === 'GD01-034'));
        const pilot = global.cards.find(x => x.id === 'ST02-012');
        for (let i = 0; i < 8; i++)result = result.concat([global.clone(pilot)]);
        for (let i = 0; i < 8; i++)result = result.concat([global.clone(gundam)]);
        */

        global.cards.forEach(card => {
            result.push(global.clone(card));
            result.push(global.clone(card));
            result.push(global.clone(card));
            result.push(global.clone(card));
        });

        result = result.splice(0, 50);
        result.forEach(x => {
            x.index = global.index;
            x.isPlayer1 = isPlayer1;
            x.location = global.locationDeck;
            global.index++;
        })
        return result;
    }
}


export default setup;
