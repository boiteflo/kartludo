import gameTask from './gameTask';

class global {
    static game = null;
    static grid;
    static index = 1;
    static isPlayer1;

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

    static spawn(player, card, locationFrom, locationTo) {
        const cardSpawn = this.spawnNotShown(player,card, locationFrom, locationTo);
        global.game.cards = global.addIn(global.game.cards, cardSpawn);
        gameTask.addTasks(global.game.tasks, [gameTask.refreshField(player.isPlayer1)]);
        return cardSpawn;
    }

    static spawnNotShown(player, card, locationFrom, locationTo) {
        const from = global.getLocationArrayProperty(locationFrom);
        const to = global.getLocationArrayProperty(locationTo);

        if (!card)
            card = player[from].splice(0, 1)[0];
        else
            player[from] = global.removeByIndex(player[from], card.index);

        card.position = card.position ? card.position : this.getDefaultPosition(player, from);

        player[to] = global.addIn(player[to], card);

        return card;
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
        const degree = card.active ? 0 : 90;
        if (!card.to) card.to = card.position;
        card.to = { x: card.to.x, y: card.to.y, rotation: degree };
    }

    static getDefaultPosition(player, propertyFrom) {
        const position = player.positions[propertyFrom];
        return position;
    }

    // Player Turn
    static getPlayerTurn() {
        return global.isPlayer1 ? global.game.player1 : global.game.player2;
    }
    static getPlayerTurnOpponent() {
        return global.isPlayer1 ? global.game.player2 : global.game.player1;
    }

    // Array
    static removeByIndex(array, card) {
        return array.filter(x => x.index !== card.index);
    }

    static addIn(array, card) {
        if (array && !array.includes(x => x.index === card.index))
            return array.concat([card]);
    }

    static sortRandom(cards) { return cards.sort(() => Math.random() - 0.5); }

    // Utils
    static log(text) { this.world.logs = text + '<br>' + this.world.logs; }

    static clone(obj) { return Object.assign({}, obj); }
}


export default global;
