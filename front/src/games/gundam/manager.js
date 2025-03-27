import cards from '../../data/gundamCards.json';
import global from '../global';
import positioner from '../positioner';
import cardHandler from './cardHandler';
import effects from './effects';

class manager {
    static getCards() { return cards.cards; }
    static getDeckLenth() { return 50; }
    static getAnimDuration() { return 500; }
    static getHandStartLength() { return 5; }
    static getDeckList(isPlayer1){ 
        const deckList = isPlayer1 ? 'Witch from Mercury' : 'Unicorn';
        return this.getDeckListBySerie(deckList);
    }

    static getDeckListBySerie(name){
        return name === 'Origin blue' ? '4xST01-001,4xST01-002,4xST01-005,4xST01-010,4xST01-012,4xST01-013,4xST01-015,4xGD01-004,4xGD01-008,4xGD01-009,4xGD01-013,4xGD01-015,4xGD01-099,4xGD01-124'
            : name === 'Origin green' ? '7xST03-007,7xST03-008,6xST03-011,7xST03-016,7xGD01-026,7xGD01-030,6xGD01-031,6xGD01-105'
            : name === 'Unicorn' ? '7xGD01-005,8xGD01-011,7xGD01-016,7xGD01-018,7xGD01-088,7xGD01-089,7xGD01-100'
            : name === 'Seed' ? '5xST04-001,5xST04-002,5xST04-005,5xST04-010,5xST04-013,5xST04-015,4xGD01-068,4xGD01-077,4xGD01-081,4xGD01-118,4xGD01-120'
            : name === 'Witch from Mercury' ? '5xST01-007,5xST01-008,5xST01-011,5xST01-016,5xGD01-070,5xGD01-072,5xGD01-075,5xGD01-076,5xGD01-097,5xGD01-117'
            : name === 'Wing' ? '4xGD01-028,4xGD01-034,4xGD01-040,4xGD01-041,4xGD01-091,3xGD01-107,4xST02-001,4xST02-002,4xST02-005,4xST02-010,4xST02-012,4xST02-013,3xST02-015'
            :  '1xST04-001,1xGD01-004,1xGD01-026,1xGD01-070,1xGD01-088,1xGD01-100,1xGD01-107,1xGD01-118,1xST01-001,1xST01-011,1xST02-001,1xST03-011';
    }

    static setup(game) {
        game.player1 = {
            ...game.player1,
            base: [], shield: [], pair: [],
            resAString: "0", resourcesMax: 0, resourcesAvailable: 0, resourcesEx: 0,
        };
        game.player2 = {
            ...game.player2,
            base: [], shield: [], pair: [],
            resAString: "0", resourcesMax: 0, resourcesAvailable: 0, resourcesEx: 0,
        };

        this.createUniqueRare(game.player1);
        //this.createUniqueRare(game.player2);

        this.createDefaultBase(game.player1);
        this.createDefaultBase(game.player2);

        for (let i = 0; i < 6; i++) {
            global.move(game.player1, null, global.locationDeck, global.locationShield);
            global.move(game.player2, null, global.locationDeck, global.locationShield);
        }

        
        //global.spawnOrMove(game.player1, global.createCard("GD01-041"), global.locationDeck, global.locationField);
        //global.spawnOrMove(game.player2, global.createCard("GD01-041"), global.locationDeck, global.locationField);

        // game.player1.shield = [global.createCard("ST02-013")].concat(game.player1.shield);
        // game.player2.shield = [global.createCard("ST02-013")].concat(game.player2.shield);

        const playerOpponent = global.isPlayer1 ? game.player1 : game.player2;
        playerOpponent.resourcesEx += 1;

        /*gameTask.addTasks(game.tasks, [{
            id: gameTask.taskPopup.name,
            text: 'Muligan ?',
            choices: [{ text: 'yes', id: 'muligan' }, { text: 'no', id: 'muliganNo' }]
        }]);*/
    }

    static createUniqueRare(player){
        const rareKeyWord = "_p1";
        var rareCards = cards.files.split(',').filter(x=> x.includes(rareKeyWord)).map(x=> x = x.replace(rareKeyWord,""));
        rareCards.forEach(rareCard=> {
            const firstCard = player.deck.find(x=> x.id === rareCard);
            if(firstCard)
                firstCard.id+=rareKeyWord;
        });
    }

    static createDefaultBase(player) {
        const card = global.createCard("EXB-001");
        global.spawnOrMove(player, card, global.locationBase, global.locationBase);
        card.isTemporaryCard = true;
        return card;
    }

    static nextTurn() {
        const player = global.getPlayerTurn();
        effects.removeOneTurnEffect(global.game.cards);
        if (player.resourcesMax < 10)
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

    static playCard(player, card1, card2, zone, regularPlay) {
        const result = cardHandler.play(player, card1, card2, zone, regularPlay);

        if (result && result.end)
            global.end(result.isPlayer1);

        return result;
    }

    static attack(player, opponent, card1, card2, zone, breach) {
        cardHandler.attackCard(player, opponent, card1, card2, zone, breach);
    }

    static selectChoiceCard(game, card) {
        return cardHandler.selectChoiceCard(game, card);
    }

    static selectChoice(game, choice) {
        if (choice.id && choice.id.startsWith('muligan')) {
            global.deletePopup();

            if (choice.id == 'muligan')
                this.doMuligan(game, game.player1);
        }

        cardHandler.selectChoice(game, choice);
    }

    static doMuligan(game, player) {
        player.deck = global.sortRandom(player.deck.concat(player.hand));
        const removeIds = player.hand.map(x => x.index);
        game.cards = game.cards.filter(x => !removeIds.includes(x.index));
        player.hand = [];

        for (let i = 0; i < this.getHandStartLength(); i++)
            global.spawnOrMove(player, null, global.locationDeck, global.locationHand, true);

        this.refreshFieldAndHand(player);
    }

    static pair(player, card1, card2) {
        return global.pair(player, card1, card2);
    }
}


export default manager;
