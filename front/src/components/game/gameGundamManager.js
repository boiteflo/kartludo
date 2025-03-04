import GameGundamGlobal from './GameGundamGlobal';
import GameGundamGridAndSize from './gameGundamGridAndSize';

class GameGundamManager {

    // ------------------ Setup
    static createGame(width, height) {
        GameGundamGlobal.size = GameGundamGridAndSize.calculateGameSize(width, height);

        GameGundamGlobal.world = {
            size: GameGundamGlobal.size,
            cards: [],
            popup: null
        };
        GameGundamGlobal.world.player1 = this.createPlayer(GameGundamGridAndSize.getPlayerPosition(true), true);
        GameGundamGlobal.world.player2 = this.createPlayer(GameGundamGridAndSize.getPlayerPosition(false), false);

        this.draw(GameGundamGlobal.world.player1, 5);
        this.draw(GameGundamGlobal.world.player2, 5);

        GameGundamGlobal.isPlayer1Turn = false; //Math.floor(Math.random() * 2) == 1;
        const nonPlayerTurn = GameGundamGlobal.getPlayerTurn(); //non player turn is the player turn of this turn0. (before nextTurn)
        nonPlayerTurn.resourcesEx = 1;

        GameGundamGlobal.world.player1.shield = this.addToShield(GameGundamGlobal.world.player1, 6);
        GameGundamGlobal.world.player2.shield = this.addToShield(GameGundamGlobal.world.player2, 6);

        this.nextTurn();
        this.refreshHandPosition(GameGundamGlobal.getPlayerTurnOpponent());

        return GameGundamGlobal.world;
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
        const card = GameGundamGlobal.clone(GameGundamGlobal.cards.find(x => x.id === "EXBP-001"));
        card.index = GameGundamGlobal.index;
        GameGundamGlobal.index++;
        this.spawnCard(player, card, GameGundamGlobal.locationBase);
        return card;
    }

    static createDeck(isPlayer1) {
        let result = [];

        // To delete after test
        const gundam = GameGundamGlobal.cards.find(x => x.id === 'GD01-034');
        const trowa = GameGundamGlobal.cards.find(x => x.id === 'ST02-012');
        for (let i = 0; i < 21; i++)result = result.concat([GameGundamGlobal.clone(gundam), GameGundamGlobal.clone(trowa)]);

        GameGundamGlobal.cards.forEach(card => {
            result.push(GameGundamGlobal.clone(card));
            result.push(GameGundamGlobal.clone(card));
            result.push(GameGundamGlobal.clone(card));
            result.push(GameGundamGlobal.clone(card));
        });

        result = result.splice(0, 50);
        result.forEach(x => {
            x.index = GameGundamGlobal.index;
            x.isPlayer1 = isPlayer1;
            x.location = GameGundamGlobal.locationDeck;
            GameGundamGlobal.index++;
        })
        return result;
    }

    // ------------------ During game
    static nextTurn() {
        GameGundamGlobal.isPlayer1Turn = !GameGundamGlobal.isPlayer1Turn;
        const player = GameGundamGlobal.getPlayerTurn();

        GameGundamGlobal.world.cards.forEach(card => card.selectable = false);
        player.field.forEach(card => GameGundamGlobal.setActive(card, true));
        player.resourcesMax += 1;
        player.resourcesAvailable = player.resourcesMax + player.resourcesEx;
        player.resources = player.resourcesMax;
        player.resAString = player.resourcesAvailable + " (" + player.resources + "+" + player.resourcesEx + ") / " + player.resourcesMax;

        this.draw(player, 1);

        this.refreshHandPosition(player, false);
        player.field.forEach(card => {
            card.active = true;
            card.selectable = true;
        });

        return GameGundamGlobal.world;
    }

    static refreshHandPosition(player, setSelectableOff=true){
        player.hand.forEach((card, index) => {
            card.to = this.getHandPosition(player, index);
            card.selectable = setSelectableOff ? false :  this.isSelectable(player, card);
        });
    }

    static refreshFieldPosition(player){
        player.field.forEach((card, index) => {
            card.to = card.to ?? this.getFieldPosition(player, card, index);
            if(card.pair && !card.pair.to)
                card.pair.to = {x:card.to.x, y:card.pair.position.y};
        });
    }

    static draw(player, cardNumber) {
        for (let i = 0; i < cardNumber; i++)
            this.spawnCard(player, player.deck.splice(0, 1)[0], GameGundamGlobal.locationHand);
    }

    static isSelectable(player, card) {
        if (card.location === GameGundamGlobal.locationHand) {
            const isCostAvailable = card.level <= player.resourcesMax && card.cost <= player.resourcesAvailable;
            if (!isCostAvailable)
                return false;
        }

        return GameGundamGlobal.getCardHandler(card).isSelectable(GameGundamGlobal.world, player, card);
    }

    static selectCard(card, choiceType, choiceCard) {
        const player = GameGundamGlobal.getPlayerTurn();
        if (card.isPlayer1 != player.isPlayer1 || !card.selectable) 
            return GameGundamGlobal.world;

        
        GameGundamGlobal.world.popup = null;
        if (card.location === GameGundamGlobal.locationHand) {
            const playCost = GameGundamGlobal.getCardHandler(card, choiceType).play(GameGundamGlobal.world, player, card, choiceCard);
            if(playCost)
                this.playCardCost(player, card);
        }
        else if (card.location === GameGundamGlobal.locationField) {
            if (GameGundamGlobal.isCardUnit(card) && card.active) {
                GameGundamGlobal.setActive(card, false);
                this.attack(player, card);
            }
        }

        this.refreshHandPosition(player, false);
        this.refreshFieldPosition(player, false);

        return GameGundamGlobal.world;
    }

    static selectChoiceType(choice) {
        GameGundamGlobal.lastChoiceType = choice;
        this.selectCard(GameGundamGlobal.world.popup.card, choice, null);
        return GameGundamGlobal.world;
    }

    static selectChoiceCard(choiceCard) {
        this.selectCard(GameGundamGlobal.world.popup.card, GameGundamGlobal.lastChoiceType, choiceCard);
        return GameGundamGlobal.world;
    }

    static attack(player, card) {
        const opponent = GameGundamGlobal.getPlayerTurnOpponent();
        card.selectable = false;

        if (opponent.base) {
            this.attackCard(card, opponent.base, opponent);
            opponent.base = null;
        } else if (opponent.shield.length < 1) {
            this.endFight();
        } else {
            const shield = opponent.shield[0];
            this.spawnCard(opponent, shield, GameGundamGlobal.locationShield);
        }
    }

    static attackCard(attacker, target, targetPlayer) {
        target.hp -= attacker.ap;
        if (target.hp < 1)
            GameGundamGlobal.sendToGrave(targetPlayer, target);
    }

    static spawnCard(player, card, location) {
        if (location == GameGundamGlobal.locationHand) {
            card.position = player.position.res;
            player.hand.push(card);
            card.height = GameGundamGlobal.size.boxSize.height * 2 + 5;
        }
        if (location == GameGundamGlobal.locationShield) {
            card.position = player.position.shield;
            card.to = player.position.grave;
            player.shield = player.shield.filter(x => x.index !== card.index);
            player.grave.push(card);
            card.height = GameGundamGlobal.size.cardSize.height;
            card.explode = true;
        }
        if (location == GameGundamGlobal.locationBase) {
            card.position = player.position.base;
            card.width = GameGundamGlobal.size.boxSize.width;
            card.show = true;
            card.isTrash = true;
        }
        card.location = location;
        card.show = true;
        card.width = GameGundamGlobal.size.cardSize.width;
        card.bgposition = 'top center';
        GameGundamGlobal.world.cards.push(card);
        return card;
    }

    static endFight() {
        const message = GameGundamGlobal.isPlayer1Turn ? "Victory" : "Defeat";
        alert(message);
    }

    // ------------------ Utilities

    static refreshGameSize(width, height){
        GameGundamGlobal.size = GameGundamGridAndSize.calculateGameSize(width, height);
    }

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
            card.width = GameGundamGlobal.size.cardSize.width;
            card.location = GameGundamGlobal.locationShield;
            card.show = false;
            result.push(card);
        }
        return result;
    }

    static getHandPosition(player, index = -1) {
        const posIndex = index > -1 ? index : player.hand.length;
        return this.getCardPosition(player, posIndex, player.position.hand, player.hand.length, false, GameGundamGlobal.size.handWidth);
    }
    static getFieldPosition(player, card, index = -1) {
        const posIndex = index > -1 ? index : player.field.length;
        const result = this.getCardPosition(player, posIndex, player.position.field, player.field.length, true, GameGundamGlobal.size.fieldWidth);
        result.rotation = card.position.rotation;
        return result;
    }
    static getCardPosition(player, index, position, cardsLength, useRotateWidth, widthAvailable) {
        const rotateWidth = !useRotateWidth ? 0 : (GameGundamGlobal.size.cardSize.height - GameGundamGlobal.size.cardSize.width) / 2;
        let cardWidth = GameGundamGlobal.size.cardSize.width + 5 + rotateWidth;
        const result = this.getCenteredX(index, cardWidth, cardsLength, widthAvailable);
        return { x: position.x + result, y: position.y }; //(rotateWidth * direction) + position.x + (index * direction * cardWidth)
    }
    static getCenteredX(index, elementWidth, totalElements, zoneWidth) {
        if (totalElements == 1) return (zoneWidth - elementWidth) / 2;
        const marginCount = totalElements + 1;
        const zoneWidthAvailable = zoneWidth - (totalElements * elementWidth);
        const marginWidth = zoneWidthAvailable / marginCount;
        const result = (index + 1) * marginWidth + index * elementWidth;
        return result;
    }

    static sortRandom(cards) { return cards.sort(() => Math.random() - 0.5); }

    static endAnimation() {
        GameGundamGlobal.world.cards.filter(x => x.show && x.to).forEach(card => {
            card.position = card.to;
            card.to = null;
        });
        GameGundamGlobal.world.cards = GameGundamGlobal.world.cards.filter(x => !x.explode);
        return GameGundamGlobal.world;
    }
}


export default GameGundamManager;
