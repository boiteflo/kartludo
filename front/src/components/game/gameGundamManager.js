import cards from '../../data/gundamCards.json';
import GameGundamGridAndSize from './gameGundamGridAndSize';

class GameGundamManager {
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

    // ------------------ Setup
    static createGame(width, height) {
        this.size = GameGundamGridAndSize.calculateGameSize(width, height);

        this.world = {
            size: this.size,
            cards: [],
            popup: null
        };
        this.world.player1 = this.createPlayer(GameGundamGridAndSize.getPlayerPosition(true), true);
        this.world.player2 = this.createPlayer(GameGundamGridAndSize.getPlayerPosition(false), false);

        this.draw(this.world.player1, 5);
        this.draw(this.world.player2, 5);

        this.isPlayer1Turn = false; //Math.floor(Math.random() * 2) == 1;
        const nonPlayerTurn = this.getPlayerTurn(); //the turn0 player is the turn1 opponent
        nonPlayerTurn.resourcesEx = 1;

        this.world.player1.shield = this.addToShield(this.world.player1, 6);
        this.world.player2.shield = this.addToShield(this.world.player2, 6);

        this.nextTurn();
        const opponent = this.getPlayerTurnOpponent();
        opponent.hand.forEach((card, index) => card.to = this.getHandPosition(opponent, index));

        return this.world;
    }

    static refreshGameSize(width, height){
        this.size = GameGundamGridAndSize.calculateGameSize(width, height);
    }

    static createPlayer(position, isPlayer1) {
        let deck = this.createDeck(isPlayer1);
        deck = this.sortRandom(deck);
        const result = {
            deck,
            position,
            isPlayer1,
            hand: [],
            field: [],
            shield: [],
            grave: [],
            resAString: "0",
            resourcesMax: 8,
            resourcesRemaining: 0,
            resourcesEx: 0,
            resBString: "0",

        };
        result.base = this.createDefaultBase(result);
        return result;
    }


    static createDefaultBase(player) {
        const card = this.clone(this.cards.find(x => x.id === "EXBP-001"));
        card.index = this.index;
        this.index++;
        this.spawnCard(player, card, this.locationBase);
        return card;
    }

    static createDeck(isPlayer1) {
        let result = [];
        const maganac = this.cards.find(x => x.id === 'GD01-034');
        const trowa = this.cards.find(x => x.id === 'ST02-012');

        for (let i = 0; i < 21; i++)result = result.concat([this.clone(maganac), this.clone(trowa)]);
        this.cards.forEach(card => {
            result.push(this.clone(card));
            result.push(this.clone(card));
            result.push(this.clone(card));
            result.push(this.clone(card));
        });
        result = result.splice(0, 50);
        result.forEach(x => {
            x.index = this.index;
            x.isPlayer1 = isPlayer1;
            x.location = this.locationDeck;
            this.index++;
        })
        return result;
    }

    // ------------------ During game
    static nextTurn() {
        this.isPlayer1Turn = !this.isPlayer1Turn;
        const turnPlayer = this.getPlayerTurn();

        this.world.cards.forEach(card => card.selectable = false);
        turnPlayer.field.forEach(card => this.setActive(card, true));
        turnPlayer.resourcesMax += 1;
        turnPlayer.resourcesAvailable = turnPlayer.resourcesMax + turnPlayer.resourcesEx;
        turnPlayer.resources = turnPlayer.resourcesMax;
        turnPlayer.resAString = turnPlayer.resourcesAvailable + " (" + turnPlayer.resources + "+" + turnPlayer.resourcesEx + ")";

        this.draw(turnPlayer, 1);

        turnPlayer.hand.forEach((card, index) => {
            card.to = this.getHandPosition(turnPlayer, index);
            card.selectable = this.isSelectable(turnPlayer, card);
        });
        turnPlayer.field.forEach(card => {
            card.active = true;
            card.selectable = true;
        });

        return this.world;
    }

    static draw(player, cardNumber) {
        const result = [];
        for (let i = 0; i < cardNumber; i++)
            result.push(this.spawnCard(player, player.deck.splice(0, 1)[0], this.locationHand));
        return result;
    }

    static isSelectable(player, card) {
        if (card.location === this.locationHand) {
            const isCostAvailable = card.level <= player.resourcesMax && card.cost <= player.resourcesAvailable;
            if (!isCostAvailable)
                return false;

            const isCommand = this.isCardCommand(card);
            const isPilot = this.isCardPilot(card);
            if (isCommand || isPilot) {
                const unitsOnField = player.field.filter(x => this.isCardUnit(x));
                const unitsOnFieldWithoutPilot = unitsOnField.filter(x => !x.pair);
                card.PilotTargetAvailable = isPilot ? unitsOnFieldWithoutPilot.map(x => x.index) : null;
                card.CommandtargetAvailable = isCommand ? unitsOnField.map(x => x.index) : null;

                if (isPilot && isCommand && card.targetUnit)
                    return card.PilotTargetAvailable.length > 0 || card.CommandtargetAvailable.length > 0;
                else if (isPilot) 
                    return card.PilotTargetAvailable.length > 0;
                else if (isCommand) 
                    return card.targetUnit ? card.CommandtargetAvailable.length > 0 : true;
            } else {
                return true;
            }
        }
    }

    static selectCard(card, choiceType, choiceCard) {
        const player = this.getPlayerTurn();
        if (card.isPlayer1 != player.isPlayer1 || !card.selectable) return this.world;

        let refreshLocationHand = false;
        let refreshLocationField = false;

        if (card.location === this.locationHand) {
            if (this.isCardUnit(card)) {
                player.hand = player.hand.filter(x => x.index !== card.index);
                player.field.push(card);
                card.location = this.locationField;
                card.height = this.size.cardSize.height;
                card.selectable = false;
                refreshLocationHand = true;
                refreshLocationField = true;
            } else {
                let isCommand = this.isCardCommand(card);
                let isPilot = this.isCardPilot(card);
                if (isCommand && isPilot) {
                    if (!choiceType) {
                        this.showPopupSelectPilotOrCommand(card);
                        return this.world;
                    }
                    isPilot = choiceType.text === 'Pilot';
                    isCommand = choiceType.text === 'Command';

                    if (isPilot) {
                        if (card.PilotTargetAvailable.length > 1 && !choiceCard) {
                            this.showPopupSelectCard(card, card.PilotTargetAvailable);
                            return this.world;
                        } else
                            choiceCard = this.getCardsById(card.PilotTargetAvailable)[0];
                    }

                    if (isCommand) {
                        if (card.CommandTargetAvailable.length > 1 && !choiceCard) {
                            this.showPopupSelectCard(card, card.CommandTargetAvailable);
                            return this.world;
                        } else
                            choiceCard = this.getCardsById(card.CommandTargetAvailable)[0];
                    }

                    this.world.popup = null;
                    card.height = this.size.cardSize.height;
                    player.hand = player.hand.filter(x => x.index !== card.index);

                    if (isPilot) {
                        this.pairCards(choiceCard, card);
                    } else {
                        card.to = this.size.center;
                        card.explode = true;
                    }
                }
            }
            this.playCardCost(player, card);
            refreshLocationHand = true;
        }
        else if (card.location === this.locationField) {
            if (this.isCardUnit(card) && card.active) {
                this.setActive(card, false);
                this.attack(player, card);
            }
        }

        if (refreshLocationHand)
            player.hand.forEach((card, index) => {
                card.to = this.getHandPosition(player, index);
                card.selectable = this.isSelectable(player, card);
            });

        if (refreshLocationField)
            player.field.forEach((card, index) => {
                card.to = this.getFieldPosition(player, card, index);
            });

        return this.world;
    }

    static pairCards(cardUnit, cardPilot) {
        const cardHeight25Percent = this.size.cardSize.height * 0.25;
        cardPilot.to = this.clone({ x: cardUnit.position.x, y: cardUnit.position.y + cardHeight25Percent });
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

    static selectChoiceType(choice) {
        this.lastChoiceType = choice;
        this.selectCard(this.world.popup.card, choice, null);
        return this.world;
    }

    static selectChoiceCard(choiceCard) {
        this.selectCard(this.world.popup.card, this.lastChoiceType, choiceCard);
        return this.world;
    }

    static attack(player, card) {
        const opponent = this.getPlayerTurnOpponent();
        card.selectable = false;

        if (opponent.base) {
            this.attackCard(card, opponent.base, opponent);
            opponent.base = null;
        } else if (opponent.shield.length < 1) {
            this.endFight();
        } else {
            const shield = opponent.shield[0];
            this.spawnCard(opponent, shield, this.locationShield);
        }
    }

    static attackCard(attacker, target, targetPlayer) {
        target.hp -= attacker.ap;
        if (target.hp < 1) {
            if (!target.isTrash)
                targetPlayer.grave.push(targetPlayer.target);
            target.explode = true;
            target.to = targetPlayer.position.grave;
        }
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

    static endFight() {
        const message = this.isPlayer1Turn ? "Victory" : "Defeat";
        alert(message);
    }

    // ------------------ Utilities
    static playCardCost(player, card) {
        const remainingCost = card.cost - player.resourcesEx;
        if (remainingCost <= 0) {
            player.resourcesEx -= card.cost;
        }
        else {
            player.resourcesEx = 0;
            player.resources -= remainingCost;
        }
        player.resourcesAvailable = player.resources + player.resourcesEx;
        player.resAString = player.resourcesAvailable + " (" + player.resources + "+" + player.resourcesEx + ")";
        player.resBString = player.resourcesMax - player.resources;
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

    static getHandPosition(player, index = -1) {
        const posIndex = index > -1 ? index : player.hand.length;
        return this.getCardPosition(player, posIndex, player.position.hand, player.hand.length, false, this.size.handWidth);
    }
    static getFieldPosition(player, card, index = -1) {
        const posIndex = index > -1 ? index : player.field.length;
        const result = this.getCardPosition(player, posIndex, player.position.field, player.field.length, true, this.size.fieldWidth);
        result.rotation = card.position.rotation;
        return result;
    }
    static getCardPosition(player, index, position, cardsLength, useRotateWidth, widthAvailable) {
        const rotateWidth = !useRotateWidth ? 0 : (this.size.cardSize.height - this.size.cardSize.width) / 2;
        let cardWidth = this.size.cardSize.width + 5 + rotateWidth;
        const result = this.getCenteredX(index, cardWidth, cardsLength, widthAvailable);
        return { x: position.x + result, y: position.y }; //(rotateWidth * direction) + position.x + (index * direction * cardWidth)
    }
    static getCenteredX(index, elementWidth, totalElements, zoneWidth) {
        if (totalElements == 1) return (zoneWidth - elementWidth) / 2;
        const marginCount = totalElements + 1;
        const zoneWidthAvailable = zoneWidth - (totalElements * elementWidth);
        const marginWidth = zoneWidthAvailable / marginCount;
        const result = (index + 1) * marginWidth + index * elementWidth;
        console.log(`getCenteredX(${index},${elementWidth},${totalElements},${zoneWidth})=${result}`);
        return result;
    }

    static sortRandom(cards) { return cards.sort(() => Math.random() - 0.5); }

    static endAnimation() {
        this.world.cards.filter(x => x.show && x.to).forEach(card => {
            card.position = card.to;
            card.to = null;
        });
        this.world.cards = this.world.cards.filter(x => !x.explode);
        return this.world;
    }

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
    static showPopupSelectPilotOrCommand(card) {
        this.showPopup(card, "Comand or Pilot ?", [{ text: 'Command' }, { text: 'Pilot' }]);
    }
    static showPopupSelectCard(card, targetAvailable) {
        const cards = this.getCardsById(targetAvailable);
        this.showPopup(card, "Choice a card", cards);
    }
    static showPopup(card, text, choices) {
        this.world.popup = {
            card,
            text,
            choices
        };
    }

    static isCardUnit(card) { return card.type.includes(0); }
    static isCardPilot(card) { return card.type.includes(1); }
    static isCardCommand(card) { return card.type.includes(2); }
    static isCardBase(card) { return card.type.includes(3); }
    static getCardsById(ids) { return this.world.cards.filter(x => ids.includes(x.index)); }
    static clone(obj) { return Object.assign({}, obj); }
}


export default GameGundamManager;
