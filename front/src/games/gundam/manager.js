import cards from '../../data/gundamCards.json';
import global from '../global';
import positioner from '../positioner';
import cardHandler from './cardHandler';
import effects from './effects';

class manager {
    static getCards() { return cards.cards; }
    static getDeckLenth() { return 50; }
    static getHandStartLength() { return 5; }

    static setup(game) {
        game.player1 = {
            ...game.player1,
            base: [], shield: [],
            resAString: "0", resourcesMax: 6, resourcesAvailable: 0, resourcesEx: 0,
        };
        game.player2 = {
            ...game.player2,
            base: [], shield: [],
            resAString: "0", resourcesMax: 6, resourcesAvailable: 0, resourcesEx: 0,
        };

        //this.createDefaultBase(game.player1);
        //this.createDefaultBase(game.player2);

        for (let i = 0; i < 6; i++) {
            global.spawnNotShown(game.player1, global.createCard("ST02-015"), global.locationDeck, global.locationShield);
            global.spawnNotShown(game.player2, global.createCard("ST02-015"), global.locationDeck, global.locationShield);
        }

        const playerOpponent = global.game.isPlayer1Turn ? game.player2 : game.player1;
        playerOpponent.resourcesEx+=1;
    }

    static createDefaultBase(player) {
        const card = global.createCard("EXBP-001");
        global.spawn(player, card, global.locationBase, global.locationBase);
        return card;
    }

    static nextTurn() {
        const player = global.getPlayerTurn();
        effects.removeOneTurnEffect(global.game.cards);
        player.resourcesMax+=1;
        player.resourcesAvailable = player.resourcesMax + player.resourcesEx;
        cardHandler.nextTurn(player);
        
        const baseText = player.base.length > 0 ? player.base[0].hp + 'hp ' : '-';
        global.log(`-- Turn player ${player.number}, ${player.resourcesAvailable}re, ${player.shield.length}sh, ${baseText}ba`);
    }

    static refreshFieldAndHand(player) {
        positioner.refresh(player.hand, player.positions.hand);
        positioner.refresh(player.field, player.positions.field);
        positioner.refresh(player.base, player.positions.base, true);      

        cardHandler.setSelectable(player);

        player.positions.deck.text = player.deck.length;
        player.positions.shield.text = player.shield.length;
        player.positions.trash.text = player.trash.length;
        player.positions.resource.text = player.resourcesAvailable + '/' + player.resourcesMax;
    }

    static playCard(game, card1, card2, zone){     
        const player = global.getPlayerTurn(); 
        cardHandler.play(player, card1, card2, zone);
        return game;
    }

    static attack(player, opponent, card1, card2){
        cardHandler.attackCard(player, opponent, card1, card2);
    }
}


export default manager;
