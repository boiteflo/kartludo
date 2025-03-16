import gameTask from './gameTask';
import effects from './gundam/effects'

class global {
    static game = null;
    static grid;
    static index = 1;
    static isPlayer1;
    static animDuration=500;

    static phase = 0;
    static phaseStart = 0;
    static phaseDraw = 1;
    static phaseResource = 2;
    static phaseMain = 3;
    static phaseAttack = 4;
    static phaseBlock = 5;
    static phaseAction = 6;
    static phaseDamage = 7;
    static phaseEnd = 8;

    static locationEmpty = 0;
    static locationDeck = 1;
    static locationShield = 2;
    static locationHand = 3;
    static locationField = 4;
    static locationBase = 5;
    static locationTrash = 6;
    static locationResource = 7;

    static getLocationArrayProperty(location) {
        if (location == this.locationEmpty) return 'empty';
        else if (location == this.locationDeck) return 'deck';
        else if (location == this.locationShield) return 'shield';
        else if (location == this.locationHand) return 'hand';
        else if (location == this.locationField) return 'field';
        else if (location == this.locationBase) return 'base';
        else if (location == this.locationResource) return 'resource';
        return 'trash';
    }

    static spawn(player, card, locationFrom, locationTo, ignoreRefresh) {
        const cardSpawn = this.spawnNotShown(player, card, locationFrom, locationTo);
        cardSpawn.zindex = 11;
        global.game.cards = global.addIn(global.game.cards, cardSpawn);

        if (!ignoreRefresh)
            gameTask.addTasks(global.game.tasks, [{ id: gameTask.taskRefreshField, isPlayer1: player.isPlayer1 }]);
        return cardSpawn;
    }

    static spawnNotShown(player, card, locationFrom, locationTo) {
        const from = global.getLocationArrayProperty(locationFrom);
        const to = global.getLocationArrayProperty(locationTo);

        if (!card)
            card = player[from].splice(0, 1)[0];
        else
            player[from] = global.removeByIndex(player[from], card.index);

        card.position = player.positions[from];
        card.isPlayer1 = player.isPlayer1;
        card.active = true;

        player[to] = global.addIn(player[to], card);

        return card;
    }
    
    static spawnOrMove(player, card, locationFrom, locationTo, ignoreRefresh) {
        const needSpawn = global.cards.includes(x=> x.index === card.index);
        if(needSpawn) 
            this.spawn(player, card, locationFrom, locationTo, ignoreRefresh);
        else
            this.move(player, card, locationFrom, locationTo, ignoreRefresh);
    }

    static move(player, card, locationFrom, locationTo, ignoreRefresh) {
        const from = global.getLocationArrayProperty(locationFrom);
        const to = global.getLocationArrayProperty(locationTo);

        player[from] = global.removeByIndex(player[from], card);
        player[to] = global.addIn(player[to], card);

        if (!ignoreRefresh)
            gameTask.addTasks(global.game.tasks, [{ id: gameTask.taskRefreshField, isPlayer1: player.isPlayer1 }]);

        return card;
    }

    static pair(player, cardUnit, cardPilot) {
        const from = global.getLocationArrayProperty(cardPilot.location);
        player[from] = global.removeByIndex(player[from], cardPilot);
        cardUnit.pair = cardPilot;
        cardPilot.selectable = false;
        cardPilot.isPaired = true;
        cardPilot.zindex = 1;
        cardUnit.zindex = 2;
        cardUnit.ap += cardPilot.ap;
        cardUnit.hp += cardPilot.hp;
        effects.apply(effects.onpair, player, cardUnit, cardPilot);
        gameTask.addTasks(global.game.tasks, [{ id: gameTask.taskRefreshField, isPlayer1: player.isPlayer1 }]);

        if (this.isLink(cardUnit, cardPilot)) {
            cardUnit.link = true;
            cardPilot.link = true;
            cardUnit.active = true;
            cardUnit.selectable = true;
            cardUnit.canAttack = true;
            effects.apply(effects.onlink, player, cardUnit, cardPilot);
        }
    }

    static isLink(cardUnit, cardPilot) {
        return cardUnit.link.includes(cardPilot.name);
    }

    static createCard(id) {
        const card = this.clone(this.cards.find(x => x.id === id));
        card.index = this.getNextIndex();
        return card;
    }

    static getNextIndex() {
        this.index++;
        return this.index;
    }

    // Card
    static setActive(card, active) {
        card.active = active;
        card.selectable = false;
        card.canAttack = active;
        const degree = card.active ? 0 : 90;
        if (!card.to)
            card.to = this.clone(card.position);
        card.to.rotation = degree;
    }

    // Player Turn
    static getPlayerTurn() {
        return global.isPlayer1 ? global.game.player1 : global.game.player2;
    }
    static getPlayerTurnOpponent() {
        return global.isPlayer1 ? global.game.player2 : global.game.player1;
    }
    static getPlayer(isPlayer1) {
        return isPlayer1 ? global.game.player1 : global.game.player2;
    }
    static getOpponent(isPlayer1) {
        return isPlayer1 ? global.game.player1 : global.game.player2;
    }

    // Array
    static getAndRemoveFirst(array) {
        return array.splice(0, 1)[0];
    }

    static removeByIndex(array, card) {
        return array.filter(x => x.index !== card.index);
    }

    static addIn(array, card) {
        if (array && !array.includes(x => x.index === card.index))
            return array.concat([card]);
    }

    static sortRandom(cards) { return cards.sort(() => Math.random() - 0.5); }

    // Tasks 
    static startAttackAnimation(player, opponent, attacker, target) {
        const delay = this.animDuration;
        gameTask.addTasks(global.game.tasks,
            [{ id: gameTask.taskCardToMiniCenter, card1: attacker, isPlayer1: attacker.isPlayer1 },
            { id: gameTask.taskCardToMiniCenter2, delay: delay, card1: target, isPlayer1: target.isPlayer1 },
            { id: gameTask.taskAttack, player, opponent, attacker, target, delay }
            ]);
    }

    static moveCardToMiniCenterThenBackToSquareOne(card1, card2) {
        const delay = this.animDuration;
        gameTask.addTasks(global.game.tasks,
            [{ id: gameTask.taskCardToMiniCenter, card1, isPlayer1: card1.isPlayer1 },
            { id: gameTask.taskCardToMiniCenter2, delay: delay * 2, card1: card2, isPlayer1: card2.isPlayer1 },
            { id: gameTask.taskRefreshField, isPlayer1: card1.isPlayer1 },
            { id: gameTask.taskRefreshField, isPlayer1: card2.isPlayer1 }
            ]);
    }

    static moveCardToMiniCenterWithTextThenBackToSquareOne(card1, text) {
        const delay = this.animDuration;
        gameTask.addTasks(global.game.tasks,
            [{ id: gameTask.taskCardToMiniCenter, card1, isPlayer1: card1.isPlayer1 },
            { id: gameTask.taskTextToMiniCenter2, delay: delay * 2, text },
            { id: gameTask.taskTextToTrash },
            { id: gameTask.taskRefreshField, isPlayer1: card1.isPlayer1 },
            { id: gameTask.taskDeleteText },
            ]);
    }

    static moveCardToMiniCenterWithTextThenDeleteIt(card1, text) {
        const delay = this.animDuration;
        gameTask.addTasks(global.game.tasks,
            [{ id: gameTask.taskCardToMiniCenter, card1, isPlayer1: card1.isPlayer1 },
            { id: gameTask.taskTextToMiniCenter2, delay: delay * 2, text },
            { id: gameTask.taskTextToTrash },
            { id: gameTask.taskCardToTrash, delay, card1, isPlayer1: card1.isPlayer1 },
            { id: gameTask.taskDeleteCard, card1, isPlayer1: card1.isPlayer1 },
            { id: gameTask.taskDeleteText },
            { id: gameTask.taskRefreshField, isPlayer1: card1.isPlayer1 }
            ]);
    }

    static moveCardToCenterThenDeleteIt(card1, removeBase = false) {
        const delay = this.animDuration;
        gameTask.addTasks(global.game.tasks,
            [{ id: gameTask.taskCardToCenter, delay, card1, isPlayer1: card1.isPlayer1 },
            { id: gameTask.taskCardToTrash, delay, card1, isPlayer1: card1.isPlayer1 },
            { id: gameTask.taskDeleteCard, card1, removeBase, isPlayer1: card1.isPlayer1 }
            ]);
    }

    static moveCardToCenterThenBackToSquareOne(card1) {
        const delay = this.animDuration;
        gameTask.addTasks(global.game.tasks,
            [{ id: gameTask.taskCardToCenter, delay, card1, isPlayer1: card1.isPlayer1 },
            { id: gameTask.taskRefreshField, isPlayer1: card1.isPlayer1 },
            ]);
    }

    static moveCardToTrashThenDeleteIt(card1, removeBase = false) {
        gameTask.addTasks(global.game.tasks,
            [{ id: gameTask.taskCardToTrash, delay: this.animDuration, card1, isPlayer1: card1.isPlayer1 },
            { id: gameTask.taskDeleteCard, card1, removeBase, isPlayer1: card1.isPlayer1 }
            ]);
    }

    // Utils
    static log(text) { this.game.logs = text + '<br>' + this.game.logs; }
    static logEffect(effect, text) { 
        this.log(text);
        effect.texts = (effect.texts ? effect.texts : []).concat([text]);
    }

    static clone(obj) { return Object.assign({}, obj); }
}


export default global;
