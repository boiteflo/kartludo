

class setup {

    static setupGame(game) {
        game.player1 = this.createPlayer(game, true, game.decklistPlayer1);
        game.player2 = this.createPlayer(game, false, game.decklistPlayer2);
        game.isPlayer1 = false; // Math.floor(Math.random() * 2) == 1;

        const handStartLength = 5;
        for (let i = 0; i < handStartLength; i++) {
            this.addTasks({ id: this.spawnOrMove.name, from: this.locationDeck, to: this.locationHand, isPlayer1: true });
            this.addTasks({ id: this.spawnOrMove.name, from: this.locationDeck, to: this.locationHand, isPlayer1: false });
        }

        this.addTasks({ id: this.mulligan.name });
    }

    static createPlayer(game, isPlayer1, decklist) {
        const deck = this.createDeck(game, isPlayer1, decklist);

        const result = {
            isPlayer1, deck, shield: [], hand: [], field: [], trash: [], base: [], empty: [],
            positions : {
                deck : isPlayer1 ? game.grid.player1Deck : game.grid.player2Deck,
                shield : isPlayer1 ? game.grid.player1Shield : game.grid.player2Shield,
                hand : isPlayer1 ? game.grid.player1Hand : game.grid.player2Hand,
                field : isPlayer1 ? game.grid.player1Field : game.grid.player2Field,
                trash : isPlayer1 ? game.grid.player1Trash : game.grid.player2Trash,
                base : isPlayer1 ? game.grid.player1Base : game.grid.player2Base,
                empty: {}
            }
        };
        return result;
    }

    static createDeck(game, isPlayer1, decklist) {
        let result = [];

        decklist.split(',').forEach(line => {
            const info = line.split('x');
            const quantity = parseInt(info[0]);
            const id = info[1];

            const card = game.cardList.find(x => x.id == id);
            if (!card)
                throw new Error("This card doesn't exist : " + id);
            for (let i = 0; i < quantity; i++)
                result.push(this.createCard(card.id));
        })

        result.forEach(x => {
            x.index = this.getNextIndex();
            x.isPlayer1 = isPlayer1;
            x.location = this.locationDeck;
        });

        result = this.sortRandom(result);
        return result;
    }

    static createCard(id) {
        const card = this.clone(this.cards.find(x => x.id === id));
        card.index = this.getNextIndex();
        card.hpMax = card.hp;
        card.effects = !card.effects ? [] : card.effects.map(fx => this.clone(fx));
        return card;
    }

    static sortRandom(cards) {
        return cards.sort(() => Math.random() - 0.5);
    }

    static getNextIndex() {
        this.index++;
        return this.index;
    }

    static mulligan() {
        console.log('mulligan ?');
    }
}


export default setup;
