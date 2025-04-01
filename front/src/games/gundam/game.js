import setup from './setup';
import positioner from './positioner';
import cardMove from './cardMove';
import refresh from './refresh';
import tasks from './tasks';
import array from './array';

/* eslint-disable no-unused-vars */
class game {
    static game = null;
    static index = 1;
    static delay;
    static needTaskEndRefresh;
    static cardHighlight = [];

    static setup(width, height, cards, decklistPlayer1, decklistPlayer2) {
        this.cards = cards.cards;
        this.game = {cards:[], tasks:[{id:'setupGame'}], cardList: cards.cards, decklistPlayer1, decklistPlayer2};
        this.addFunction([tasks, array, setup, positioner, refresh, cardMove], this);
        this.game.grid=this.createGrid(width, height);
        return this.continue(this.game);
    }

    static continue(game){
        // this.endAnimation(game);
        return this.handleTasks(game);
    }

    static playCard(game, card1, card2, drop){
        
    }

    static selectChoice(game, choice){
        
    }

    static selectChoiceCard(game, card){
        
    }

    static nextTurn(game, card1, card2, drop){
        
    }


    /*


    static pair(player, card1, card2) {
        const cardUnit = this.isCardUnit(card1) ? card1 : card2;
        const cardPilot = this.isCardPilot(card1) ? card1 : card2;
        const isLink = this.isLink(cardUnit, cardPilot);
        const trigger = isLink ? effects.onlink : effects.onpair;
        const effectResult = effects.handleEffects(player, cardUnit, cardPilot, trigger);
        if (effectResult.stop)
            return effectResult;

        const from = cardPilot.location;
        player[from] = global.removeByIndex(player[from], cardPilot);
        cardUnit.pair = cardPilot;
        cardPilot.selectable = false;
        cardPilot.isPaired = true;
        cardPilot.location = global.locationPair;
        cardPilot.zindex = 1;
        cardUnit.zindex = 2;
        cardUnit.ap += cardPilot.ap;
        cardUnit.hp += cardPilot.hp;

        if (this.isLink(cardUnit, cardPilot)) {
            cardUnit.link = true;
            cardPilot.link = true;
            cardUnit.active = true;
            cardUnit.selectable = true;
            cardUnit.canAttack = true;
        }
    }

    static isLink(cardUnit, cardPilot) {
        if (cardUnit.link.includes('['))
            return cardUnit.link.includes(cardPilot.name);
        else {
            const targetStr = cardUnit.link.replace('(', '').replace(')', '');
            return cardPilot.attribute.includes(targetStr);
        }
    }

    static destroyUnit(card1, delay = true) {
        card1.dead = true;
        return [
            { id: gameTask.taskApplyEffect.name, card1, trigger: effects.ondestroyed },
            { id: gameTask.taskMove.name, delay, card1, to: this.locationTrash, isPlayer1: card1.isPlayer1 }
        ];
    }

    static end(isPlayer1) {
        this.game.end = true;
        const message = isPlayer1 ? 'Victory' : 'Defeat';
        alert(message);
        return { end: true };
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
        */


    static deletePopup() {
        delete (this.game.popup);
        delete (this.game.choice);
        delete (this.game.actionPlayer);
        delete (this.game.actionOpponent);
        delete (this.game.cardChoice);
    }

    // Card Type
    static isCardUnit(card) { return card.type?.includes(0); }
    static isCardPilot(card) { return card.type?.includes(1); }
    static isCardCommand(card) { return card.type?.includes(2); }
    static isCardCommandPilot(card) { return this.isCardPilot(card) && this.isCardCommand(card); }
    static isCardBase(card) { return card.type?.includes(3); }
    static isCardToken(card) { return card.type?.includes(4); }
    static isCardResource(card) { return card.type?.includes(5); }

    // Utils
    static log(text) { this.game.logs = text + '<br>' + this.game.logs; }
    static logEffect(effect, text) {
        this.log(text);
        this.effects = this.effects ? this.effects.concat([text]) : [text];
    }

    static clone(obj) { return Object.assign({}, obj); }

    static addFunction(cla, obj) {
        const ignore = ['length', 'name', 'prototype'];
        cla.forEach(c => {
            Object.getOwnPropertyNames(c).forEach(method => {
                if (!ignore.includes(method))
                    obj[method] = c[method];
            });
        });
    }
    

    static test(message){
        alert(message);
    }
}


export default game;
