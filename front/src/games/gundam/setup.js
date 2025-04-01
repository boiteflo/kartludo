

class setup {

    static handStartLength=5;
    static shieldStartLength=6;

    static setupGame(game) {
        game.player1 = this.createPlayer(game, true, game.decklistPlayer1);
        game.player2 = this.createPlayer(game, false, game.decklistPlayer2);
        game.isPlayer1 = false; // Math.floor(Math.random() * 2) == 1;

        for (let i = 0; i < this.handStartLength; i++) {
            this.addTasks([
                { id: this.spawnOrMove.name, from: this.locationDeck, to: this.locationHand, isPlayer1: true },
                { id: this.spawnOrMove.name, from: this.locationDeck, to: this.locationHand, isPlayer1: false }]);
        }
    }

    static createPlayer(game, isPlayer1, decklist) {
        const deck = this.createDeck(game, isPlayer1, decklist);

        const result = {
            isPlayer1, deck, shield: [], hand: [], field: [], trash: [], base: [], empty: [],
            positions: {
                deck: isPlayer1 ? game.grid.player1Deck : game.grid.player2Deck,
                shield: isPlayer1 ? game.grid.player1Shield : game.grid.player2Shield,
                hand: isPlayer1 ? game.grid.player1Hand : game.grid.player2Hand,
                field: isPlayer1 ? game.grid.player1Field : game.grid.player2Field,
                trash: isPlayer1 ? game.grid.player1Trash : game.grid.player2Trash,
                base: isPlayer1 ? game.grid.player1Base : game.grid.player2Base,
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

    static mulligan(game, task) {
        task.choice = {};
        if (!task.choice) {
            return this.addTaskFirst({ id: this.popup.name, task, text: 'Do you want to do a mulligan ?', choices: [{ id: 'yes', text: 'yes' }, { text: 'no' }] });
        } else {
            let tasks = [];
            if (task.choice.id === 'yes') {
                game.player1.deck = this.sortRandom(game.player1.deck.concat(game.player1.hand));
                const removeIds = game.player1.hand.map(x => x.index);
                game.cards = game.cards.filter(x => !removeIds.includes(x.index));
                game.player1.hand = [];

                for (let i = 0; i < this.handStartLength; i++) 
                    tasks.push({ id: this.spawnOrMove.name, from: this.locationDeck, to: this.locationHand, isPlayer1: true });
            }
            
            tasks = tasks.concat(this.addShielsAndBase(game));
            tasks.push({ id: this.nextTurn.name, isPlayer1: game.isPlayer1 });
            this.addTasks(tasks);
        }
    }

    static addShielsAndBase(game){
        let tasks = [];
        
        for (let i = 0; i < this.shieldStartLength; i++) {
            tasks.push({ id: this.move.name, from: this.locationDeck, to: this.locationShield, isPlayer1: true });
            tasks.push({ id: this.move.name, from: this.locationDeck, to: this.locationShield, isPlayer1: false });
        }

        game.player1.base = [this.createCard('EXB-001')];
        game.player2.base = [this.createCard('EXB-001')];

        return tasks;
    }
}

export default setup;
