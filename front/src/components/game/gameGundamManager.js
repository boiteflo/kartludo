
import cards from '../../data/gundamCards.json';

class GameGundamManager {
    static world = null;
    static cards = cards.cards;
    static centerPosition;
    static cardSize;
    static boxSize;
    static p1Position;
    static p2Position;
    static index = 1;
    static isPlayer1LastTurn = true;
    static locationDeck = 0; 
    static locationShield = 1; 
    static locationHand = 2; 
    static locationField = 3; 
    static locationGrave = 4;

    // ------------------ Setup
    static createGame(center, cardSize, boxSize, p1Positions, p2Positions) {
        this.centerPosition = center;
        this.cardSize = cardSize;
        this.boxSize = boxSize;
        this.p1Position = p1Positions;
        this.p2Position = p2Positions;

        this.world = {
            player1: this.createPlayer(this.p1Position, true),
            player2: this.createPlayer(this.p2Position, false),
            cards: [],
            turnPlayer:null
        };

        const cardTest = {index: -1, id:'ST02-010', show:true, width: this.cardSize.width, position:this.getFieldPosition(this.world.player1, 0, p1Positions.field, 0)};
        cardTest.position.y+= (this.cardSize.height * 0.25);

        this.world.cards = [this.world.player1.base, this.world.player2.base]// .concat([cardTest])
            .concat(this.draw(this.world.player1, 5))
            .concat(this.draw(this.world.player2, 5));

        this.isPlayer1LastTurn = Math.floor(Math.random() * 2);
        const nonPlayerTurn = this.isPlayer1LastTurn ? this.world.player1 : this.world.player2;
        nonPlayerTurn.resourcesEx= 1;

        this.world.player1.shield = this.addToShield(this.world.player1, 6);
        this.world.player2.shield = this.addToShield(this.world.player2, 6);

        this.nextTurn();

        return this.world;
    }

    static createPlayer(position, isPlayer1) {
        let deck = this.createDeck(isPlayer1);
        deck = this.sortRandom(deck);
        return {
            deck,
            position,
            isPlayer1,
            hand: [],
            field: [],
            shield : [],
            grave : [],
            resAString: "0",
            resourcesMax : 0,
            resourcesRemaining : 0,
            resourcesEx : 0,
            resBString: "0",
            base: this.createDefaultBase(position)
        };
    }

    static createDefaultBase(position){
        const card = Object.assign({}, this.cards.find(x=> x.id ==="EXBP-001"));
        card.index = this.index;
        this.index++;
        card.position = Object.assign({}, position.base);
        card.width= this.boxSize.width;
        card.show=true;
        return card;
    }

    static createDeck(isPlayer1) {
        let result = [];
        this.cards.forEach(card => {
            result.push(Object.assign({}, card));
            result.push(Object.assign({}, card));
            result.push(Object.assign({}, card));
            result.push(Object.assign({}, card));
        });
        result = result.splice(0, 50);
        result.forEach(x=>{
            x.index = this.index;
            x.isPlayer1 = isPlayer1;
            x.location = this.locationDeck;
            this.index++;
        })
        return result;
    }
    
    // ------------------ During game
    static draw(player, cardNumber) {
        const result = [];
        for (let i = 0; i < cardNumber; i++) {
            const card = player.deck.splice(0, 1)[0];
            card.position = player.position.res;
            card.to = this.getHandPosition(player, result.length);
            card.location = this.locationHand;
            card.show=true;
            card.width= this.cardSize.width;
            result.push(card);
        }
        player.hand = player.hand.concat(result);
        return result;
    }

    static nextTurn(){
        this.world.turnPlayer = this.isPlayer1LastTurn ? this.world.player2 : this.world.player1;
        this.isPlayer1LastTurn = !this.isPlayer1LastTurn;

        this.world.turnPlayer.field.forEach(card => {card.active = true; card.selectable = true;});
        this.world.turnPlayer.resourcesMax+=1;
        this.world.turnPlayer.resources = this.world.turnPlayer.resourcesMax + this.world.turnPlayer.resourcesEx;
        this.world.turnPlayer.resAString= this.world.turnPlayer.resourcesMax + " + " + this.world.turnPlayer.resourcesEx;

        this.world.cards = this.world.cards.concat(this.draw(this.world.turnPlayer, 1));

        this.world.turnPlayer.hand.forEach(card => {
            card.selectable = card.level <= this.world.turnPlayer.resources;
        });

        return this.world;
    }

    static selectCard(card){
        const player = this.world.turnPlayer;
        if(card.isPlayer1 != player.isPlayer1) return this.world;

        let refreshLocationHand = false;
        let refreshLocationField = false;

        if(card.location === this.locationHand){
            player.hand = player.hand.filter(x=> x.index !== card.index);
            player.field.push(card);
            card.location = this.locationField;
            refreshLocationHand=true;
            refreshLocationField= true;
        }        
        else if(card.location === this.locationField){
            card.active = !card.active;
            const degree = card.active ? 0 : 90;
            card.to = {x: card.position.x, y: card.position.y, rotation:degree};
        }

        if(refreshLocationHand)
            player.hand.forEach((card,index) => card.to = this.getCardPosition(player, index, player.position.hand, 0, false));

        if(refreshLocationField)
            player.field.forEach((card,index) => card.to = this.getCardPosition(player, index, player.position.field, 0, true));

        return this.world;
    }

    // ------------------ Utilities
    static addToShield(player, cardNumber) {
        const result = [];
        for (let i = 0; i < cardNumber; i++) {
            const card = player.deck.splice(0, 1)[0];
            card.width= this.cardSize.width;
            card.location = this.locationShield;
            card.show = false;
            result.push(card);
        }
        return result;
    }

    static getHandPosition(player, increment) { return this.getCardPosition(player, increment, player.position.hand, player.hand.length, false);}
    static getFieldPosition(player, increment) { return this.getCardPosition(player, increment, player.position.field, player.field.length, true);}
    static getCardPosition(player, increment, base, cardsAlreadyThere, useRotateWidth) {
        const direction = player.isPlayer1 ? 1 : -1;
        const rotateWidth = !useRotateWidth ? 0 : (this.cardSize.height - this.cardSize.width) / 2;
        return { x: (rotateWidth * direction) + base.x + ((increment + cardsAlreadyThere) * direction * (this.cardSize.width + 5 + rotateWidth)), y: base.y };
    }

    static sortRandom(cards) { return cards.sort(() => Math.random() - 0.5); }

    static endAnimation(){        
        this.world.cards.filter(x=> x.show && x.to).forEach(card => {
            card.position = card.to;
            card.to = null;
        });
    }
}


export default GameGundamManager;
