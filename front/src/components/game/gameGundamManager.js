
import cards from '../../data/gundamCards.json';

class GameGundamManager {
    static world = null;
    static cards = cards.cards;
    static centerPosition;
    static cardSize;
    static p1Position;
    static p2Position;
    static index = 1;
    static isPlayer1LastTurn = true;

    static createGame(center, cardSize, p1Positions, p2Positions) {
        this.centerPosition = center;
        this.cardSize = cardSize;
        this.p1Position = p1Positions;
        this.p2Position = p2Positions;

        this.world = {
            player1: this.createPlayer(this.p1Position, true),
            player2: this.createPlayer(this.p2Position, false),
            cards: [],
            turnPlayer:null
        };

        this.world.cards = this.draw(this.world.player1, 5)
            .concat(this.draw(this.world.player2, 5));

        this.isPlayer1LastTurn = Math.floor(Math.random() * 2);
        var nonPlayerTurn = this.isPlayer1LastTurn ? this.world.player1 : this.world.player2;
        nonPlayerTurn.resourcesExRemaining= 1;

        this.world.player1.shield = this.addToShield(this.world.player1, 6);
        this.world.player2.shield = this.addToShield(this.world.player2, 6);

        this.nextTurn();

        return this.world;
    }

    static createPlayer(position, isPlayer1) {
        let deck = this.createDeck();
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
            base : "1"
        }
    }

    static createDeck() {
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
            this.index++;
        })
        return result;
    }

    static sortRandom(cards) { return cards.sort(() => Math.random() - 0.5); }

    static draw(player, cardNumber) {
        const result = [];
        for (let i = 0; i < cardNumber; i++) {
            const card = player.deck.splice(0, 1)[0];
            card.position = player.position.deck;
            card.to = this.getHandPosition(player, result.length);
            card.show=true;
            result.push(card);
        }
        player.hand = player.hand.concat(result);
        return result;
    }

    static addToShield(player, cardNumber) {
        const result = [];
        for (let i = 0; i < cardNumber; i++) {
            const card = player.deck.splice(0, 1)[0];
            card.show = false;
            result.push(card);
        }
        return result;
    }

    static getHandPosition(player, handIncrement) {
        var direction = player.isPlayer1 ? 1 : -1;
        var base = player.position.hand.x;
        return { x: base + ((handIncrement + player.hand.length) * direction * (this.cardSize.width + 5)), y: player.position.hand.y };
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
    }
}


export default GameGundamManager;
