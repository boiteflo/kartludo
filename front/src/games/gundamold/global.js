import cards from '../../data/gundamCards.json';
import cardUnit from './Card/cardUnit';
import cardCommandPilot from './Card/cardCommandPilot';
import cardCommand from './Card/cardCommand';
import cardPilot from './Card/cardPilot';
import cardBase from './Card/cardBase';
import GameGundamEffect from './effects';

class global {
    static world = null;
    static cards = cards.cards;
    static lastChoiceType;
    static awaitingCardChoice = false;
    static awaitingAttackTarget = false;
    static size;
    static index = 1;
    static isPlayer1Turn;
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

    static locationDeck = 0;
    static locationShield = 1;
    static locationHand = 2;
    static locationField = 3;
    static locationBase = 4;
    static locationGrave = 5;

    static getPlayerTurn() {
        return this.isPlayer1Turn ? this.world.player1 : this.world.player2;
    }
    static getPlayerTurnOpponent() {
        return this.isPlayer1Turn ? this.world.player2 : this.world.player1;
    }
    static setActive(card, active) {
        card.active = active;
        const degree = card.active ? 0 : 90;
        if (!card.to) card.to = card.position;
        card.to = { x: card.to.x, y: card.to.y, rotation: degree };
    }

    static pairCards(player, cardUnit, cardPilot) {
        const cardHeight25Percent = this.size.cardSize.height * 0.25;
        cardPilot.to = this.clone({ x: cardUnit.position.x, y: cardUnit.position.y + cardHeight25Percent });
        cardPilot.zindex = 1;
        cardPilot.active = false;
        cardPilot.selectable = false;
        cardUnit.zindex = 2;
        cardUnit.pair = cardPilot;
        cardUnit.ap += cardPilot.ap;
        cardUnit.hp += cardPilot.hp;

        GameGundamEffect.apply(GameGundamEffect.onpair, player, cardUnit, cardPilot);

        if (this.isLink(cardUnit, cardPilot)) {
            cardUnit.link = true;
            cardPilot.link = true;
            cardUnit.active = true;
            cardUnit.selectable = true;
            GameGundamEffect.apply(GameGundamEffect.onlink, player, cardUnit, cardPilot);
        }
    }

    static isLink(cardUnit, cardPilot) {
        return cardUnit.link.includes(cardPilot.name);
    }

    static showPopupSelectPilotOrCommand(card) {
        this.showPopup(card, "Comand or Pilot ?", [{ text: 'Command' }, { text: 'Pilot' }]);
    }

    static showPopupSelectCard(card, targetAvailable) {
        this.prepareResetSelectable();
        const cards = this.getCardsByIndex(targetAvailable);
        cards.forEach(card => card.selectable = true);
        card.selectable = true;
        this.awaitingCardChoice = true;
        this.showPopup(card, "Choice a card", cards);
    }

    static prepareResetSelectable(){
        this.world.cards.forEach(card => {
            card.selectableOld = card.selectable;
            card.selectable = false;
        });
    }

    static showPopupSelectHiddenCard(card, text, cards) {
        this.prepareResetSelectable();
        card.selectable = true;
        const width = 64 * 107 / 150;
        cards.forEach((card, index) => {
            card.position = { x: index * (width + 5), y: 0 };
            card.width = width;
        });
        this.awaitingCardChoice = true;
        this.showPopup(card, text, cards);
        this.world.popup.showCards=true;
    }

    static showPopupSelectAttackTarget(card, targetAvailable, hasBase) {
        this.world.cards.forEach(card => {
            card.selectableOld = card.selectable;
            card.selectable = false;
        });
        targetAvailable.forEach(card => card.selectable = true);
        card.selectable = true;
        this.awaitingAttackTarget = true;
        this.showPopup(card, "Choice a target", []);
        this.world.popup.attackShield = !hasBase;
    }

    static showPopup(card, text, choices) {
        this.world.popup = {
            card,
            text,
            choices
        };
    }

    static draw(player, cardNumber) {
        for (let i = 0; i < cardNumber; i++)
            this.spawnCard(player, player.deck.splice(0, 1)[0], this.locationHand);
    }

    static addToShield(player, cardNumber) {
        const result = [];
        for (let i = 0; i < cardNumber; i++) {
            const card = player.deck.splice(0, 1)[0];
            card.width = this.size.cardSize.width;
            card.location = this.locationShield;
            card.show = false;
            result.push(card);
        }
        return result;
    }

    static spawnCard(player, card, location) {
        if (location == this.locationHand) {
            card.position = player.position.res;
            player.hand.push(card);
            card.height = this.size.boxSize.height * 2 + 5;
        }
        if (location == this.locationShield) {
            card.position = player.position.shield;
            card.to = player.position.grave;
            player.shield = player.shield.filter(x => x.index !== card.index);
            player.grave.push(card);
            card.height = this.size.cardSize.height;
            card.explode = true;
        }
        if (location == this.locationBase) {
            card.position = player.position.base;
            card.width = this.size.boxSize.width;
            card.height = this.size.cardSize.height;
            card.show = true;
            card.isTrash = true;
        }
        card.location = location;
        card.show = true;
        card.width = this.size.cardSize.width;
        card.bgposition = 'top center';
        this.world.cards.push(card);
        return card;
    }

    static sendToGrave(player, card) {
        card.to = player.position.grave;
        card.explode = true;
        if (card.pair)
            this.sendToGrave(player, card.pair);
        if (!card.isTrash)
            player.grave.push(card);
    }

    static resetSelectable() {
        this.world.cards.forEach(card => {
            card.selectable = card.selectableOld;
            delete (card.selectableOld);
        });
    }

    static getRes(player) { return player.resourcesAvailable + " / " + player.resourcesMax; }

    static isCardUnit(card) { return card.type?.includes(0); }
    static isCardPilot(card) { return card.type?.includes(1); }
    static isCardCommand(card) { return card.type?.includes(2); }
    static isCardCommandPilot(card) { return this.isCardPilot(card) && this.isCardCommand(card); }
    static isCardBase(card) { return card.type?.includes(3); }
    static getCardHandler(card, choiceType) {
        if (choiceType)
            return choiceType.text == 'Pilot' ? cardPilot : cardCommand;

        if (this.isCardUnit(card)) return cardUnit;
        if (this.isCardCommandPilot(card)) return cardCommandPilot;
        if (this.isCardCommand(card)) return cardCommand;
        if (this.isCardPilot(card)) return cardPilot;
        if (this.isCardBase(card)) return cardBase;
    }

    static getCardsByIndex(ids) { return this.world.cards.filter(x => ids.includes(x.index)); }

    static log(text) { this.world.logs = text + '<br>' + this.world.logs; }

    static clone(obj) { return Object.assign({}, obj); }

    static removeObj(array, obj, property = 'index') { return array.filter(x => x[property] !== obj[property]); }

    static sortRandom(cards) { return cards.sort(() => Math.random() - 0.5); }

}


export default global;