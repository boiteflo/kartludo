import cards from '../../data/gundamCards.json';
import global from '../global';
import positioner from '../positioner';
import cardHandler from './cardHandler';
import effects from './effects';

class manager {
    static getCards() { return cards.cards; }
    static getDeckLenth() { return 50; }
    static getAnimDuration() { return 400; }
    static getHandStartLength() { return 12; }

    static setup(game) {
        game.player1 = {
            ...game.player1,
            base: [], shield: [], pair: [],
            resAString: "0", resourcesMax: 6, resourcesAvailable: 0, resourcesEx: 0,
        };
        game.player2 = {
            ...game.player2,
            base: [], shield: [], pair: [],
            resAString: "0", resourcesMax: 6, resourcesAvailable: 0, resourcesEx: 0,
        };

        this.createDefaultBase(game.player1);
        this.createDefaultBase(game.player2);

        for (let i = 0; i < 6; i++) {
            global.move(game.player1, null, global.locationDeck, global.locationShield);
            global.move(game.player2, null, global.locationDeck, global.locationShield);
        }

        game.player1.deck = [global.createCard("ST02-013")].concat(game.player1.deck);
        game.player2.deck = [global.createCard("ST02-013")].concat(game.player2.deck);

        game.player1.shield = [global.createCard("ST02-013")].concat(game.player1.shield);
        game.player2.shield = [global.createCard("ST02-013")].concat(game.player2.shield);

        // const playerOpponent = global.game.isPlayer1Turn ? game.player2 : game.player1;
        // playerOpponent.resourcesEx += 1;
    }

    static createDefaultBase(player) {
        const card = global.createCard("EXBP-001");
        global.spawnOrMove(player, card, global.locationBase, global.locationBase);
        card.isTemporaryCard = true;
        return card;
    }

    static nextTurn() {
        const player = global.getPlayerTurn();
        effects.removeOneTurnEffect(global.game.cards);
        player.resourcesMax += 1;
        player.resourcesAvailable = player.resourcesMax + player.resourcesEx;
        cardHandler.nextTurn(player);

        const baseText = player.base.length > 0 ? player.base[0].hp + 'hp ' : '-';
        global.log(`-- Turn player ${player.number}, ${player.resourcesAvailable}re, ${player.shield.length}sh, ${baseText}ba`);
    }

    static refreshFieldAndHand(player) {
        positioner.refresh(player.hand, player.positions.hand, false, 7);
        positioner.refresh(player.field, player.positions.field, false, 3);
        positioner.refresh(player.base, player.positions.base, true);
        const cardsToRemoveIndex = player.trash.filter(x => !x.to).map(x => x.index);
        global.game.cards = global.game.cards.filter(x => !cardsToRemoveIndex.includes(x.index));

        cardHandler.setSelectable(player);

        player.positions.deck.text = player.deck.length;
        player.positions.shield.text = player.shield.length;
        player.positions.trash.text = player.trash.length;
        player.positions.resource.text = player.resourcesAvailable + '/' + player.resourcesMax;
    }

    static playCard(player, card1, card2, zone, isShowingEffect) {
        return cardHandler.play(player, card1, card2, zone, isShowingEffect);
    }

    static attack(player, opponent, card1, card2, zone, breach) {
        cardHandler.attackCard(player, opponent, card1, card2, zone, breach);
    }

    static selectChoiceCard(game, card) {
        return cardHandler.selectChoiceCard(game, card);
    }

    static selectChoice(game, choice){
        return cardHandler.selectChoice(game, choice);
    }

    static pair(player, card1, card2, isShowingEffect) {
        return global.pair(player, card1, card2, isShowingEffect);
    }
}


export default manager;
