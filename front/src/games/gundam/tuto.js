/* eslint-disable no-unused-vars */

class tuto {
    static handStartLength = 0;
    static tutoStep = 0;
    static tutoStepDone = -1;
    static tutoSmall(game) { return { ...game.grid.resources, x: game.grid.width / 2 - 150, width: 300 }; }

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

    static mulligan(game) { }

    static continueTuto(game) {
        game.tutoStep = game.tutoStep ? game.tutoStep : 0;

        if (game.showTextTuto && game.showTextTuto.next) {
            game.tutoStep++;
            game.showTextTuto.next = false;
        }

        let step = this.tutoSteps[game.tutoStep];
        if (!step)
            return;

        if (this.autoNextStep(game, step)) {
            game.tutoStep++;
        }

        step = this.tutoSteps[game.tutoStep];
        if (!step || step.isDone)
            return;

        step.isDone = true;
        step.action(this, game);
    }

    static autoNextStep(game, step) {
        if (!step.isDone || game.tutoStep + 1 > this.tutoSteps.length)
            return false;

        const nextStep = this.tutoSteps[game.tutoStep + 1];
        const task = game.tasks.length > 0 ? game.tasks[0] : null;
        return nextStep.conditions(this, game, task);
    }

    static tutoSteps = [
        {
            // Show title
            conditions: (context, game, task) => { return false; },
            action: (context, game) => {
                game.freeze = true;
                context.addTutoMask(game);
                game.showTextTuto = {
                    ...context.tutoSmall(game),
                    text: 'Welcome to Gundam TCG.'
                };
            }
        },
        {
            // Show deck icon
            conditions: (context, game, task) => { return false; },
            action: (context, game) => {
                game.player1.resourcesMax = 1;
                game.player1.resourcesEx = 0;
                game.player2.resourcesMax = 1;
                game.player2.resourcesEx = 1;
                game.tutoMasks = game.tutoMasks.filter(x => x.id != 'player1Deck' && x.id !== 'player2Deck');
                game.isPlayer1 = false;
                game.showTextTuto = {
                    ...context.alignPositionNextTo(game, game.grid.player1Deck),
                    text: 'This is your deck with 50 cards'
                };
            }
        },
        {
            // draw a card for the first turn
            conditions: (context, game, task) => { return false; },
            action: (context, game) => {
                game.freeze = false;
                game.showTextTuto = null;
            }
        },
        {
            // Play Gm unit
            conditions: (context, game, task) => { 
                return game.player1.hand.length > 0 && !game.player1.hand[0].to && context.cardHighlight.length < 1;
             },
            action: (context, game) => {
                game.showTextTuto = {
                    ...game.grid.player1Field, hideNext: true,
                    text: 'The first turn began. You have drawned one card from your deck to your hand. This is a unit card that you can play. Select it and release it here'
                };
            }
        },
        {
            // hide text tuto
            conditions: (context, game, task) => { return task && task.id === context.play.name; },
            action: (context, game) => {
                game.showTextTuto = null;
            }
        },
        {
            // show tuto text
            conditions: (context, game, task) => { return game.player1.field.length === 1 && !game.player1.field[0].to; },
            action: (context, game) => {
                game.freeze = false;
                game.showTextTuto = {
                    ...context.alignPositionNextTo(game, game.player1.field[0].position),
                    text: "Without link Pilot, an unit can't attack the turn you play it. We will see link pilot in a few minutes."
                };
            }
        },
        {
            // press end turn
            conditions: (context, game, task) => { return false; },
            action: (context, game) => {
                game.tutoMasks = game.tutoMasks.filter(x => x.id != 'buttonEndTurn');
                game.freeze = false;
                game.showTextTuto = {
                    ...context.alignPositionNextTo(game, game.grid.buttonEndTurn), hideNext: true,
                    text: "You can't do anything more this turn, press the end turn button"
                };
            }
        },
        {
            // unfreeze and mask end turn button
            conditions: (context, game, task) => { return  task && task.id === context.nextTurn.name;},
            action: (context, game) => {
                game.showTextTuto = null;
                game.freezeButtons = true;
                game.tutoMasks.push({
                    isPlayer1: true, id: 'buttonEndTurn',
                    x: game.grid.buttonEndTurn.x - 10, width: game.grid.buttonEndTurn.width + 20,
                    y: game.grid.buttonEndTurn.y - 10, height: game.grid.buttonEndTurn.height + 20
                });
            }
        },
        {
            // zoom on a card
            conditions: (context, game, task) => { 
                return game.isPlayer1 && !task && game.player1.hand.length > 0 && !game.player1.hand[0].to && context.cardHighlight.length < 1;
            },
            action: (context, game) => {
                game.freeze = true;
                game.showTextTuto = {
                    ...context.alignPositionNextTo(game, game.player1.hand[0].position), hideNext: true,
                    text: "You can zoom on a card by doing a click on it"
                };
            }
        },
        { 
            // show tuto text on zoom card
            conditions: (context, game, task) => { return game.cardCenter; },
            action: (context, game) => {
                game.tutoMasks = game.tutoMasks.filter(x => x.id != 'resources');
                game.showTextTuto = {
                    ...game.cardCenter.position, y: game.cardCenter.position.y + game.cardCenter.position.height * 0.2, height: game.cardCenter.position.height * 0.8, zindex: 120,
                    text: "At the top left corner, you can see the level of the card (3) and the cost of the card (2)."
                };
            }
        },
        { 
            // show tuto text on zoom card
            conditions: (context, game, task) => { return false },
            action: (context, game) => {
                game.tutoMasks = game.tutoMasks.filter(x => x.id != 'resources');
                game.showTextTuto = {
                    ...game.cardCenter.position, y: game.cardCenter.position.y, height: game.cardCenter.position.height * 0.8, zindex: 120,
                    text: "At the bottom left corner, you can see the link pilot conditions of this card : (White Base Team) Trait"
                };
            }
        },
        { 
            // show tuto text on zoom card
            conditions: (context, game, task) => { return false },
            action: (context, game) => {
                game.tutoMasks = game.tutoMasks.filter(x => x.id != 'resources');
                game.showTextTuto = {
                    ...game.cardCenter.position, y: game.cardCenter.position.y, height: game.cardCenter.position.height * 0.8, zindex: 120, hideNext: true,
                    text: "At the bottom right corner, you can see the Attack point AP (2) and the Hip Point HP (3). Click on the card to unzoom it"
                };
            }
        },
        {
            // show tuto text
            conditions: (context, game, task) => { return !game.cardCenter; },
            action: (context, game) => {
                game.showTextTuto = {
                    ...context.alignPositionNextToUsingSens(game, game.grid.resources, 300, game.grid.boxHeight, 3),
                    text: "This is the resources bar. The bottom one is yours, the other one for your ennemy. You have 3 ressources available."
                };
            }
        },
        {
            // show tuto text
            conditions: (context, game, task) => { return false; },
            action: (context, game) => {
                game.showTextTuto = {
                    ...context.alignPositionNextToUsingSens(game, game.grid.resources, 300, game.grid.boxHeight * 1.5, 1),
                    text: "Your opponent has 2 classical ressource (yellow) and one ex ressource (blue). The player 2 always start the game with one ex ressource."
                };
            }
        },
        {
            // show tuto text
            conditions: (context, game, task) => { return false; },
            action: (context, game) => {
                game.showTextTuto = {
                    ...context.alignPositionNextTo(game, game.player1.hand[0].position),
                    text: "To play a level 3 card with a cost of 2, you need at least 3 resources with minimum 2 available."
                };
            }
        },
        {
            // play GD01-004 Guncanon
            conditions: (context, game, task) => { return false; },
            action: (context, game) => {
                game.freeze = false;
                game.freezeButtons = false;
                game.showTextTuto = {
                    ...context.alignPositionNextTo(game, game.player1.hand[0].position), hideNext: true,
                    text: "The conditions are respected, the card is shining with a yellow effect, you can play it like the previous one"
                };
            }
        },
        {
            // show text tuto
            conditions: (context, game, task) => {
                const isGood = task && task.card1.id === 'GD01-004'; // Guncanon
                if (!isGood) { 
                    game.tasks = [];
                }
                return isGood;
            },
            action: (context, game) => {
                game.freeze = true;
                game.showTextTuto = {
                    ...context.alignPositionNextToUsingSens(game, game.grid.resources, 300, game.grid.boxHeight, 3),
                    text: "2 resource has been used. 1 is still available (yellow) but 2 unavailable (red)."
                };
            }
        },
        {
            // animations base arriving
            conditions: (context, game, task) => { return false; },
            action: (context, game) => {
                game.showTextTuto = null;
                context.addShielsAndBase(game);
                game.freeze = false;
                context.addTask({ id: context.taskEndRefresh.name });
            }
        },
        {
            // show text tuto
            conditions: (context, game, task) => { return game.tasks.length == 0 && game.player2.base.length > 0 && !game.player2.base[0].to; },
            action: (context, game) => {
                game.freeze = true;
                game.showTextTuto = {
                    ...context.alignPositionNextTo(game, game.player2.positions.base),
                    text: "This is the ennemy base. Each player start the game with this one"
                };
            }
        },
        {
            // Gm attack
            conditions: (context, game, task) => { return false; },
            action: (context, game) => {
                game.freeze = false;
                game.showTextTuto = {
                    ...context.alignPositionNextTo(game, game.player1.field[0].position), hideNext: true,
                    text: "This unit is ready to attack. Select it and release it on the opponent field to attack"
                };
            }
        },
        {
            // hide text tuto
            conditions: (context, game, task) => { return task && task.id === context.play.name; },
            action: (context, game) => {
                game.showTextTuto = null;
                game.freezeButtons = true;
            }
        },
        {
            // show text tuto
            conditions: (context, game, task) => { return !task && !game.player1.field[0].to; },
            action: (context, game) => {
                game.showTextTuto = {
                    ...context.alignPositionNextTo(game, game.player1.field[0].position),
                    text: "This unit has attack. It is now rested (90 degree rotation)"
                };
            }
        },
        {
            // show text tuto
            conditions: (context, game, task) => { return context.tutoStep == 18 && !task; },
            action: (context, game) => {
                game.showTextTuto = {
                    ...context.alignPositionNextTo(game, game.player2.base[0].position),
                    text: "Above the card, you can see (0 - 1). It represent the AP (0) and HP (1) of the card."
                };
            }
        },
        {
            // show text tuto
            conditions: (context, game, task) => { return false; },
            action: (context, game) => {
                game.showTextTuto = {
                    ...context.alignPositionNextToUsingSens(game, game.player2.base[0].position, 300, game.grid.boxHeight * 1.5, 1),
                    text: "The unit has attacked the enemy base. 2 AP damage was inflicted. The base originally had 3 HP, which has now been reduced to 1 HP."
                };
            }
        },
        {
            // press end turn
            conditions: (context, game, task) => { return false; },
            action: (context, game) => {
                game.tutoMasks = game.tutoMasks.filter(x => x.id != 'buttonEndTurn');
                game.freeze = false;
                game.freezeButtons = false;
                game.showTextTuto = {
                    ...context.alignPositionNextTo(game, game.grid.buttonEndTurn), hideNext: true,
                    text: "You can't do anything more this turn, press the end turn button"
                };
            }
        },
        {
            // prepare ai turn
            conditions: (context, game, task) => { return  task && task.id === context.nextTurn.name;},
            action: (context, game) => {
                game.showTextTuto = null;
                game.freezeButtons = true;
                game.player2.resourcesMax = 2;
                game.tutoMasks.push({
                    isPlayer1: true, id: 'buttonEndTurn',
                    x: game.grid.buttonEndTurn.x - 10, width: game.grid.buttonEndTurn.width + 20,
                    y: game.grid.buttonEndTurn.y - 10, height: game.grid.buttonEndTurn.height + 20
                });
            }
        },
        {
            // show text tuto
            conditions: (context, game, task) => { return game.player2.field.length > 0 && !task; },
            action: (context, game) => {
                game.freeze = true;
                game.showTextTuto = {
                    ...context.alignPositionNextTo(game, game.player2.field[0].position),
                    text: "Player 2 has played a unit with a link pilot, it can attack this turn."
                };
            }
        },
        {
            // show text tuto
            conditions: (context, game, task) => { return false; },
            action: (context, game) => {
                game.freeze = true;
                game.showTextTuto = {
                    ...context.alignPositionNextTo(game, game.player1.base[0].position),
                    text: "Player 2 can use his unit to attack our base"
                };
            }
        },
        {
            // show text tuto
            conditions: (context, game, task) => { return false; },
            action: (context, game) => {
                game.freeze = true;
                game.showTextTuto = {
                    ...context.alignPositionNextTo(game, game.player1.field[0].position),
                    text: "Because this unit is rested, it can be attacked by the opponent's unit"
                };
            }
        },
        {
            // hide text tuto
            conditions: (context, game, task) => { return false; },
            action: (context, game) => {
                game.freeze = false;
                game.showTextTuto = null;
            }
        },
        // show text tuto
        {
            conditions: (context, game, task) => { return task && task.id === context.newTurnForAI.name; },
            action: (context, game) => {
                game.tutoMasks = game.tutoMasks.filter(x => x.id != 'player1Trash' && x.id != 'player2Trash');
                game.freeze = true;
                game.showTextTuto = {
                    ...context.alignPositionNextToUsingSens(game, game.player1.positions.trash, 300, game.grid.boxHeight * 1.5, 2),
                    text: "Our unit's HP have been reduced to 0. The unit have been send to trash."
                };
            }
        },
        {
            conditions: (context, game, task) => { return false; },
            action: (context, game) => {
                game.freeze = false;
                context.addTask({ id: context.spawnOrMove.name, isPlayer1: true, from: context.locationDeck, to: context.locationHand });
                game.showTextTuto = null;
            }
        },
        {
            conditions: (context, game, task) => { return false; },
            action: (context, game) => {
                game.showTextTuto = {
                    ...context.alignPositionNextTo(game, game.player1.hand[0].position), hideNext: true,
                    text: "This unit can be linked with a pilot. Play it"
                };
            }
        },
        {
            conditions: (context, game, task) => { return false; },
            action: (context, game) => {
                game.showTextTuto = {
                    ...context.alignPositionNextTo(game, game.player1.hand[0].position), hideNext: true,
                    text: "You can pair this pilot with the unit you just played"
                };
            }
        },
        {
            conditions: (context, game, task) => { return false; },
            action: (context, game) => {
                game.showTextTuto = {
                    ...context.alignPositionNextTo(game, game.player1.field[1].position), hideNext: true,
                    text: "Now you can attack with it"
                };
            }
        },
        {
            conditions: (context, game, task) => { return false; },
            action: (context, game) => {
                game.freeze = false;
                game.showTextTuto = null;
            }
        }
    ];
}


export default tuto;
