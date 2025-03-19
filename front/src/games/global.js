import gameTask from './gameTask';
import effects from './gundam/effects'

class global {
    static game = null;
    static grid;
    static index = 1;
    static isPlayer1;
    static delay;
    static effects;

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

    static locationEmpty = 'locationEmpty';
    static locationTrash = 'locationTrash';
    static locationDeck = 'locationDeck';
    static locationShield = 'locationShield';
    static locationHand = 'locationHand';
    static locationField = 'locationField';
    static locationBase = 'locationBase';
    static locationResource = 'locationResource';
    static locationPair = 'locationPair';

    static getLocationArrayProperty(location) {
        if (location == this.locationEmpty) return 'empty';
        else if (location == this.locationDeck) return 'deck';
        else if (location == this.locationShield) return 'shield';
        else if (location == this.locationHand) return 'hand';
        else if (location == this.locationField) return 'field';
        else if (location == this.locationBase) return 'base';
        else if (location == this.locationResource) return 'resource';
        else if (location == this.locationPair) return 'pair';
        return 'trash';
    }

    static spawnOrMove(player, card, locationFrom, locationTo, ignoreRefresh) {
        const cardSpawn = this.move(player, card, locationFrom, locationTo, ignoreRefresh);
        this.spawnIfNot(cardSpawn);
    }

    static spawnIfNot(card) {
        if(!card)
            return;

        if (!global.game.cards.find(x => x.index === card.index))
            global.game.cards = global.addIn(global.game.cards, card);
        
        const player = card.isPlayer1 ? global.game.player1 : global.game.player2;
        if(!card.positon)
            card.position = this.clone(player.positions.deck);
        card.zindex = 11;
    }

    static move(player, card, locationFrom, locationTo, ignoreRefresh) {
        if (!locationFrom && card && card.location)
            locationFrom = card.location;

        const from = global.getLocationArrayProperty(locationFrom);
        const to = global.getLocationArrayProperty(locationTo);

        if (!card)
            card = player[from].splice(0, 1)[0];
        else
            player[from] = global.removeByIndex(player[from], card);

        if (!card.isTemporaryCard)
            player[to] = global.addIn(player[to], card);

        if (from)
            card.position = card.position ? card.position : this.clone(player.positions[from]);
        if (from)
            card.location = player.positions[from].location;

        card.isPlayer1 = player.isPlayer1;
        card.active = true;
        card.hidestat = card.location === global.locationTrash;

        if (card.pair) {
            card.pair.isPaired = false;
            card.pair.link = false;
            this.move(player, card.pair, locationFrom, locationTo, ignoreRefresh);
            delete (card.pair);
            card.link = false;
        }

        const needToRefreshAllField = [global.locationHand, global.locationField].includes(locationTo);
        if (!needToRefreshAllField) {
            card.to = this.clone(player.positions[to]);
            if (locationTo === this.locationTrash) {
                card.to.height = 0;
                card.hidestat = true;
            }
        }

        if (!ignoreRefresh) {
            gameTask.addTasks(global.game.tasks, [{ id: gameTask.taskRefreshField, isPlayer1: player.isPlayer1 }]);
        }

        return card;
    }

    static pair(player, card1, card2, isShowingEffect) {
        const cardUnit = this.isCardUnit(card1) ? card1 : card2;
        const cardPilot = this.isCardPilot(card1) ? card1 : card2;
        const isLink = this.isLink(cardUnit, cardPilot);
        const trigger = isLink ? effects.onlink : effects.onpair;
        const task = { id: gameTask.taskPairCardWithEffect, card1: cardUnit, card2: cardPilot };
        const effectResult = global.handleEffects(player, cardUnit, cardPilot, isShowingEffect, trigger, task);
        if (effectResult.stop)
            return effectResult;

        const from = global.getLocationArrayProperty(cardPilot.location);
        player[from] = global.removeByIndex(player[from], cardPilot);
        cardUnit.pair = cardPilot;
        cardPilot.selectable = false;
        cardPilot.isPaired = true;
        cardPilot.location = global.locationPair;
        cardPilot.zindex = 1;
        cardUnit.zindex = 2;
        cardUnit.ap += cardPilot.ap;
        cardUnit.hp += cardPilot.hp;

        gameTask.addTasks(global.game.tasks, [{ id: gameTask.taskRefreshField, isPlayer1: player.isPlayer1 }]);

        if (this.isLink(cardUnit, cardPilot)) {
            cardUnit.link = true;
            cardPilot.link = true;
            cardUnit.active = true;
            cardUnit.selectable = true;
            cardUnit.canAttack = true;
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

    // Effects 
    static handleEffects(player, card1, card2, isShowingEffect, trigger, task) {
        const effectsRemainings = effects.getEffectsRemaining(trigger, card1, card2);
        const text = effectsRemainings.map(x => `${x.effect} ${x.value}`).join('<br>');
        const delay = global.delay;
        if (effectsRemainings && effectsRemainings.length > 0) {
            if (!isShowingEffect) {
                const taskShowCards = card2
                    ? [
                        { id: gameTask.taskCardToMiniCenter, card1: card1, isPlayer1: card1.isPlayer1 },
                        { id: gameTask.taskCardToMiniCenter2, card1: card2, isPlayer1: card1.isPlayer1 }
                    ]
                    : [{ id: gameTask.taskCardToMiniCenter, card1: card1, isPlayer1: card1.isPlayer1 }];

                gameTask.addTasks(global.game.tasks, taskShowCards.concat([{ id: gameTask.taskTextShow, delay, text }, task]));
                return { stop: true, destroy:true };
            } else
                gameTask.addTasks(global.game.tasks, [
                    { id: gameTask.taskRefreshField, isPlayer1: card1.isPlayer1 },
                    { id: gameTask.taskTextHide, delay },
                    { id: gameTask.taskTextDelete },
                ]);
        }

        return effects.apply(trigger, player, card1, card2);
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
    static startAttackAnimation(player, opponent, attacker, target, zone, breach) {
        const delay = this.delay;
        gameTask.addTasks(global.game.tasks,
            [{ id: gameTask.taskCardToMiniCenter, card1: attacker, isPlayer1: attacker.isPlayer1 },
            { id: gameTask.taskCardToMiniCenter2, delay: delay, card1: target, isPlayer1: target.isPlayer1 },
            { id: gameTask.taskAttack, player, opponent, attacker, target, delay, zone, breach }
            ]);
    }

    static moveCardToMiniCenterThenBackToSquareOne(card1, card2) {
        const delay = this.delay;
        gameTask.addTasks(global.game.tasks,
            [{ id: gameTask.taskCardToMiniCenter, card1, isPlayer1: card1.isPlayer1 },
            { id: gameTask.taskCardToMiniCenter2, delay: delay * 2, card1: card2, isPlayer1: card2.isPlayer1 },
            { id: gameTask.taskRefreshField, isPlayer1: card1.isPlayer1 },
            { id: gameTask.taskRefreshField, isPlayer1: card2.isPlayer1 }
            ]);
    }

    static moveCardToMiniCenterWithTextThenBackToSquareOne(card1, text) {
        const delay = this.delay;
        gameTask.addTasks(global.game.tasks,
            [{ id: gameTask.taskCardToMiniCenter, card1, isPlayer1: card1.isPlayer1 },
            { id: gameTask.taskTextShow, delay: delay * 2, text },
            { id: gameTask.taskTextHide },
            { id: gameTask.taskRefreshField, isPlayer1: card1.isPlayer1, delay },
            { id: gameTask.taskTextDelete },
            ]);
    }

    static moveCardToMiniCenterWithTextThenDeleteIt(card1, text) {
        const delay = this.delay;
        gameTask.addTasks(global.game.tasks,
            [{ id: gameTask.taskCardToMiniCenter, card1, isPlayer1: card1.isPlayer1 },
            { id: gameTask.taskTextShow, delay: delay * 2, text },
            { id: gameTask.taskTextHide },
            { id: gameTask.taskMove, delay, card1, to: global.locationTrash, isPlayer1: card1.isPlayer1, ignoreRefresh: true },
            { id: gameTask.taskTextDelete },
            { id: gameTask.taskRefreshField, isPlayer1: card1.isPlayer1 }
            ]);
    }

    static moveCardToCenterThenDeleteIt(card1) {
        const delay = this.delay;
        gameTask.addTasks(global.game.tasks,
            [{ id: gameTask.taskCardToCenter, delay, card1, isPlayer1: card1.isPlayer1 }]);
    }

    static moveCardToCenterThenBackToSquareOne(card1) {
        const delay = this.delay;
        gameTask.addTasks(global.game.tasks,
            [{ id: gameTask.taskCardToCenter, delay, card1, isPlayer1: card1.isPlayer1 },
            { id: gameTask.taskRefreshField, isPlayer1: card1.isPlayer1 },
            ]);
    }

    static deletePopup(){
        delete(this.game.popup);
        delete(this.game.choice);
        delete(this.game.actionPlayer);
        delete(this.game.actionOpponent);
        delete(this.game.cardChoice);
    }

    // Card Type
    static isCardUnit(card) { return card.type?.includes(0); }
    static isCardPilot(card) { return card.type?.includes(1); }

    // Utils
    static log(text) { this.game.logs = text + '<br>' + this.game.logs; }
    static logEffect(effect, text) {
        this.log(text);
        this.effects = this.effects ? this.effects.concat([text]) : [text];
    }

    static clone(obj) { return Object.assign({}, obj); }
}


export default global;
