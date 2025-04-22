class tuto {
    static handStartLength = 0;
    static tutoStep = 0;
    static tutoStepDone = -1;
    static tutoFullScreen(game) { return { x: 0, y: 0, width: game.grid.width, height: game.grid.height }; }
    static tutoHalfScreen(game) { return { x: 0, y: 0, width: game.grid.width, height: game.grid.centerZoneP2.y }; }
    static tutoSmall(game) { return { ...game.grid.resources, x: game.grid.width / 2 - 150, width: 300 }; }
    static tutoEnnemyFieldPosition(game) { return game.player2.positions.field; }

    static addTutoMask(game) {
        const properties = 'player1Shield,player1Base,player1Deck,player1Trash,player2Shield,player2Base,player2Deck,player2Trash';
        game.tutoMasks = properties
            .split(',')
            .map(prop => { return { ...game.grid[prop], isPlayer1: prop.startsWith('player1'), id: prop } });

        game.tutoMasks.push({ ...game.grid.resources, isPlayer1: true, id: 'resources' });
        game.tutoMasks.push({ ...game.grid.logZone, isPlayer1: false, id: 'logZone' });
        game.tutoMasks.push({
            isPlayer1: true, id: 'buttonEffect',
            x: game.grid.buttonEffect.x - 10, width: game.grid.buttonEffect.width + 20,
            y: game.grid.buttonEffect.y - 10, height: game.grid.buttonEffect.height + 20
        });
        game.tutoMasks.push({
            isPlayer1: true, id: 'buttonEndTurn',
            x: game.grid.buttonEndTurn.x - 10, width: game.grid.buttonEndTurn.width + 20,
            y: game.grid.buttonEndTurn.y - 10, height: game.grid.buttonEndTurn.height + 20
        });
    }

    static tutoAlignTextUpTo(game, pos) {
        let x = pos.x;
        let y = pos.y - game.grid.boxHeight - game.grid.border;
        let width = 300;
        const xOffset = x + width - game.grid.width;
        if (xOffset > 0)
            x = x - xOffset - game.grid.border2;

        let height = game.grid.boxHeight;
        return { x, y, width, height };
    }

    static tutoAlignTextNextTo(game, pos) {
        let x = pos.x + pos.width + game.grid.border;
        let y = pos.y;
        let width = 300;
        let height = game.grid.boxHeight;
        if (x + width > game.grid.width)
            x = pos.x - game.grid.border2 - width;

        const yOffset = y + height - game.grid.height;
        if (yOffset > 0)
            y = y - yOffset - game.grid.border2;
        return { x, y, width, height };
    }

    static refreshAiTurn(game) {
        this.endTurn(game);
        return {};
    }

    static mulligan(game) {
        if (this.tutoStep < 2) {
            game.freeze = true;
            this.continueTuto(game);
            return { stop: true };
        }
        game.player1.deck = [
            this.createCard('ST03-007', true, this.locationDeck),
            this.createCard('ST03-008', true, this.locationDeck),
            this.createCard('GD01-026', true, this.locationDeck),
            this.createCard('ST03-011', true, this.locationDeck),
            this.createCard('ST03-008', true, this.locationDeck),
            this.createCard('ST03-008', true, this.locationDeck),
        ].concat(game.player1.deck.slice(0, 45));

        const tasks = [];
        for (let i = 0; i < 0; i++)
            tasks.push({ id: this.spawnOrMove.name, from: this.locationDeck, to: this.locationHand, isPlayer1: true });

        tasks.push({ id: this.nextTurn.name, isPlayer1: game.isPlayer1 });
        this.addTasks(tasks);
    }

    static incruiseTutoStepIfConditions(game) {
        let incruiseStep = false;

        if (this.tutoStep == 2 && game.player1.hand.length > 0 && !game.player1.hand[0].to && this.cardHighlight.length < 1)
            incruiseStep = true;

        if (this.tutoStep == 3 && game.tasks.length == 1 && game.tasks[0].id === this.play.name)
            incruiseStep = true;

        if (this.tutoStep == 4 && game.player1.field.length === 1 && !game.player1.field[0].to)
            incruiseStep = true;

        if (this.tutoStep == 5 && game.player1.hand.length === 1 && !game.player1.hand[0].to && this.cardHighlight.length < 1)
            incruiseStep = true;

        if (this.tutoStep == 6 && game.tasks.length == 1 && game.tasks[0].id === this.nextTurn.name)
            incruiseStep = true;

        if (this.tutoStep == 7 && game.player1.hand.length > 0 && !game.player1.hand[0].to && this.cardHighlight.length < 1)
            incruiseStep = true;

        if (this.tutoStep == 8 && game.cardCenter)
            incruiseStep = true;

        if (this.tutoStep == 9 && !game.cardCenter)
            incruiseStep = true;

        if (this.tutoStep == 13 && game.tasks.length == 1) {
            if (game.tasks[0].card1.id !== 'ST03-008') { // Zaku II
                game.tasks = [];
                return;
            }
            incruiseStep = true;
        }

        if (this.tutoStep == 14 && game.player2.base.length > 0 && !game.player2.base[0].to)
            incruiseStep = true;

        if (this.tutoStep == 16 && !game.player1.field.to)
            incruiseStep = true;

        if (incruiseStep)
            this.tutoStep++;
    }

    static continueTuto(game) {
        if (game.showTextTuto && game.showTextTuto.next) {
            this.tutoStep++;
            game.showTextTuto.next = false;
        }

        this.incruiseTutoStepIfConditions(game);

        game.tutoStep = this.tutoStep;
        if (this.tutoStepDone == this.tutoStep)
            return;

        this.tutoStepDone = this.tutoStep;

        if (this.tutoStep == 0) {
            if (this.tutoStep == 0)
                this.log("This is the log section");
            this.addTutoMask(game);
            game.showTextTuto = {
                ...this.tutoSmall(game),
                text: 'Welcome to Gundam TCG.'
            };
        }

        else if (this.tutoStep == 1) {
            game.tutoMasks = game.tutoMasks.filter(x => x.id != 'player1Deck' && x.id !== 'player2Deck');
            game.isPlayer1 = false;
            game.showTextTuto = {
                ...this.tutoAlignTextUpTo(game, game.grid.player1Deck),
                text: 'This is your deck with 50 cards'
            };
        }

        else if (this.tutoStep == 2) {
            game.freeze = false;
            game.showTextTuto = null;
        }

        else if (this.tutoStep == 3) {
            game.freeze = false;
            game.showTextTuto = {
                ...game.grid.player1Field, hideNext: true,
                text: 'This is a unit card that you can play. Select it and release it here'
            };
        }

        else if (this.tutoStep == 4) {
            game.showTextTuto = null;
        }

        else if (this.tutoStep == 5) {
            game.freeze = false;
            game.showTextTuto = {
                ...this.tutoAlignTextNextTo(game, game.player1.field[0].position),
                text: "Without link Pilot, an unit can't attack the turn you play it. We will see link pilot in a few minutes."
            };
        }

        else if (this.tutoStep == 6) {
            game.tutoMasks = game.tutoMasks.filter(x => x.id != 'buttonEndTurn');
            game.freeze = false;
            game.showTextTuto = {
                ...this.tutoAlignTextNextTo(game, game.grid.buttonEndTurn), hideNext: true,
                text: "You can't do anything more this turn, press the end turn button"
            };
        }

        else if (this.tutoStep == 7) {
            game.showTextTuto = null;
            this.freezeButtons = true;
            game.tutoMasks.push({
                isPlayer1: true, id: 'buttonEndTurn',
                x: game.grid.buttonEndTurn.x - 10, width: game.grid.buttonEndTurn.width + 20,
                y: game.grid.buttonEndTurn.y - 10, height: game.grid.buttonEndTurn.height + 20
            });
        }

        else if (this.tutoStep == 8) {
            game.freeze = true;
            game.showTextTuto = {
                ...this.tutoAlignTextNextTo(game, game.player1.hand[0].position), hideNext: true,
                text: "You can zoom on a card by doing a click on it"
            };
        }

        else if (this.tutoStep == 9) {
            game.tutoMasks = game.tutoMasks.filter(x => x.id != 'resources');
            game.showTextTuto = {
                ...game.cardCenter.position, y: game.cardCenter.position.y + game.cardCenter.position.height * 0.2, height: game.cardCenter.position.height * 0.8, zindex: 120, hideNext: true,
                text: "On the top left corner, you can see the level of the card (2) and the cost of the card (1). Click on the card to unzoom it"
            };
        }

        else if (this.tutoStep == 10) {
            game.showTextTuto = {
                ...this.tutoAlignTextUpTo(game, game.grid.resources),
                text: "This is the resources bar. The bottom one is yours, the other one for your ennemy. You have 2 ressources available."
            };
        }

        else if (this.tutoStep == 11) {
            game.showTextTuto = {
                ...this.tutoAlignTextUpTo(game, game.grid.resources),
                text: "Your opponent has one classical ressource (yellow) and one ex ressource (blue). The player 2 always start the game with one ex ressource."
            };
        }

        else if (this.tutoStep == 12) {
            game.showTextTuto = {
                ...this.tutoAlignTextUpTo(game, game.player1.hand[0].position),
                text: "To play a level 2 card with a cost of 1, you need at least 2 resources with minimum 1 available."
            };
        }

        else if (this.tutoStep == 13) {
            game.freeze = false;
            game.showTextTuto = {
                ...this.tutoAlignTextUpTo(game, game.player1.hand[0].position), hideNext: true,
                text: "The conditions are respected, the card is shining with a yellow effect, you can play it like the previous one"
            };
        }

        else if (this.tutoStep == 14) {
            game.showTextTuto = {
                ...this.tutoAlignTextUpTo(game, game.grid.resources),
                text: "1 resource has been used. 1 is still available (yellow) but 1 unavailable (red)."
            };
        }

        else if (this.tutoStep == 15) {
            this.addShielsAndBase(game);
            this.freeze = false;
        }

        else if (this.tutoStep == 16) {
            game.showTextTuto = {
                ...this.tutoAlignTextNextTo(game, game.player2.positions.base),
                text: "This is the ennemy base. Each player start the game with this one"
            };
        }

        else if (this.tutoStep == 17) {
            this.freezeButtons = false;
            game.showTextTuto = {
                ...this.tutoAlignTextNextTo(game, game.player1.field[0].position), hideNext: true,
                text: "This unit is ready to attack. Select it and release it on the opponent field to attack"
            };
        }

        else if (this.tutoStep == 18) {
            this.freezeButtons = false;
            game.showTextTuto = {
                ...this.tutoAlignTextNextTo(game, game.player1.field[0].position),
                text: "This unit has attack. It is now rested (90 degree rotation)"
            };
        }

        else {
            game.freeze = false;
            game.showTextTuto = null;
        }

        if (game.showTextTuto && game.showTextTuto.text.length > 0 && this.tutoStep > 0)
            this.log('Tuto : ' + game.showTextTuto.text);
    }
}


export default tuto;
