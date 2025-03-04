import cards from '../../data/gundamCards.json';
import gameGundamCardUnit from './gameGundamCardUnit';
import gameGundamCardCommandPilot from './gameGundamCardCommandPilot';
import gameGundamCardCommand from './gameGundamCardCommand';
import gameGundamCardPilot from './gameGundamCardPilot';
import gameGundamCardBase from './gameGundamCardBase';

class GameGundamGlobal {
    static world = null;
    static cards = cards.cards;
    static lastChoiceType;
    static size;
    static index = 1;
    static isPlayer1Turn;

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

    static pairCards(cardUnit, cardPilot) {
        const cardHeight25Percent = GameGundamGlobal.size.cardSize.height * 0.25;
        cardPilot.to = GameGundamGlobal.clone({ x: cardUnit.position.x, y: cardUnit.position.y + cardHeight25Percent });
        cardPilot.zindex = 1;
        cardPilot.active = false;
        cardPilot.selectable = false;
        cardUnit.zindex = 2;
        cardUnit.pair = cardPilot;
        cardUnit.hp += cardPilot.hp;
        cardUnit.hp += cardPilot.hp;
        
        if (this.isLink(cardUnit, cardPilot)) {
            cardUnit.link = true;
            cardPilot.link = true;
            cardUnit.active = true;
            cardUnit.selectable = true;
        }
    }

    static isLink(cardUnit, cardPilot) {
        return cardUnit.link.includes(cardPilot.name);
    }



    static showPopupSelectPilotOrCommand(card) {
        this.showPopup(card, "Comand or Pilot ?", [{ text: 'Command' }, { text: 'Pilot' }]);
    }
    static showPopupSelectCard(card, targetAvailable) {
        const cards = this.getCardsByIndex(targetAvailable);
        this.showPopup(card, "Choice a card", cards);
    }
    static showPopup(card, text, choices) {
        this.world.popup = {
            card,
            text,
            choices
        };
    }

    static sendToGrave(player, card){        
        card.to= player.position.grave;
        card.explode = true;
        if (!card.isTrash)
            player.grave.push(card);
    }

    static isCardUnit(card) { return card.type.includes(0); }
    static isCardPilot(card) { return card.type.includes(1); }
    static isCardCommand(card) { return card.type.includes(2); }
    static isCardCommandPilot(card) { return this.isCardPilot(card) && this.isCardCommand(card); }
    static isCardBase(card) { return card.type.includes(3); }
    static getCardHandler(card, choiceType){
        if(choiceType)
            return choiceType.text == 'Pilot' ? gameGundamCardPilot : gameGundamCardCommand;

        if(this.isCardUnit(card)) return gameGundamCardUnit;
        if(this.isCardCommandPilot(card)) return gameGundamCardCommandPilot;
        if(this.isCardCommand(card)) return gameGundamCardCommand;
        if(this.isCardPilot(card)) return gameGundamCardPilot;
        if(this.isCardBase(card)) return gameGundamCardBase;
    }

    static getCardsByIndex(ids) { return this.world.cards.filter(x => ids.includes(x.index)); }
    static clone(obj) { return Object.assign({}, obj); }
    
}


export default GameGundamGlobal;