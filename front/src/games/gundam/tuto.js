/* eslint-disable no-unused-vars */

class tuto {
    static handStartLength = 0;
    static shieldStartLength = 2;
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

    static mulligan(game) {
        this.addTasks(this.addShielsAndBase(game, false));
    }

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

    static conditionNexTurn(context, game) {
        return game.player1.hand.length > 0 && !game.player1.hand[0].to && context.cardHighlight.length < 1;
    }

    static tutoText = {
        used: null,
        en: {
            welcome: 'Welcome to Gundam TCG.',
            deck: 'This is your deck. It contains 50 cards.',
            playUnit: 'The first turn has begun. You’ve drawn one card from your deck. It’s a unit card you can play. Select it and place it here.',
            cantAttack: "A unit can't attack the turn it's played unless it's linked with a pilot. We’ll learn about linking pilots shortly.",
            endTurn: "You’ve done all you can this turn. Press the 'End Turn' button to proceed.",
            zoom: "Click on a card to zoom in and see its details.",
            showLevelCost: "In the top-left corner of a card, you can see its level (3) and cost (2).",
            showLink: "In the bottom-left corner, you’ll find the card’s pilot link condition: (White Base Team) Trait.",
            showApHp: "In the bottom-right corner, you’ll see the card’s Attack Points (AP: 2) and Hit Points (HP: 3). Click again to unzoom.",
            showResources: "This is the 2 resource bars. The bottom bar is yours; the top one belongs to your opponent. You currently have 3 resources.",
            showResources2: "Your opponent has 2 regular resources (yellow) and 1 EX resource (blue). Player 2 always starts with one EX resource.",
            showResources3: "To play a card, you must pay its cost using your available resources. EX resources are always used first. At the start of each turn, you gain 1 additional resource.",
            playLevel3: "To play a level 3 card that costs 2, you need at least 3 total resources, including 2 available ones.",
            playIt: "The requirements are met. The card is glowing yellow, meaning you can play it. Do it like the previous one.",
            resourcesUsed: "2 resources were used. You still have 1 available (yellow) and 2 unavailable (red).",
            ennemyBase: "This is the enemy base. Each player starts the game with one.",
            attack: "This unit is ready to attack. Select it and release it on the opponent’s field to launch an attack.",
            rested: "This unit has attacked. It’s now rested (rotated 90 degrees).",
            showApHp2: "Above the card, you see (0 - 1), indicating the card’s AP (0) and HP (1).",
            showApHp3: "The unit attacked the enemy base, dealing 2 AP damage. The base had 3 HP and is now reduced to 1 HP.",
            showEffect: "When a card’s effect activates, a red circle with text appears. For this card: 'repair 1'.",
            p2LinkUnit: "Player 2 has played a unit with a linked pilot, so it can attack this turn.",
            p2AttackBase: "Player 2 can now use this unit to attack our base.",
            p2AttackUnit: "Alternatively, it can attack our rested units.",
            unitTrash: "Our unit’s HP reached 0. It’s been sent to the trash.",
            linkUnit: "This unit can be linked with a pilot. Play it now.",
            linkPilot: "You can now pair this pilot with the unit you just played.",
            attackLink: "Now you can attack using the linked unit."
        },
        fr: {
            welcome: 'Bienvenue dans Gundam TCG.',
            deck: 'Voici votre deck. Il contient 50 cartes.',
            playUnit: 'Le premier tour commence. Vous avez pioché une carte de votre deck. C’est une carte unité que vous pouvez jouer. Sélectionnez-la et placez-la ici.',
            cantAttack: "Une unité ne peut pas attaquer le tour où elle est jouée, sauf si elle est liée à un pilote. Nous verrons cela dans un instant.",
            endTurn: "Vous ne pouvez plus rien faire ce tour-ci. Appuyez sur le bouton 'Fin du tour' pour continuer.",
            zoom: "Cliquez sur une carte pour zoomer et voir ses détails.",
            showLevelCost: "En haut à gauche d’une carte, vous pouvez voir son niveau (3) et son coût (2).",
            showLink: "En bas à gauche, vous trouverez la condition de liaison de pilote : (White Base Team) Trait.",
            showApHp: "En bas à droite, vous verrez les Points d’Attaque (AP : 2) et les Points de Vie (HP : 3) de la carte. Cliquez à nouveau pour dézoomer.",
            showResources: "Voici les 2 barres de ressources. Celle du bas est la vôtre ; celle du haut est celle de votre adversaire. Vous disposez actuellement de 3 ressources.",
            showResources2: "Votre adversaire possède 2 ressources classiques (jaunes) et 1 ressource EX (bleue). Le joueur 2 commence toujours avec une ressource EX.",
            showResources3: "Pour jouer une carte, vous devez en payer le coût avec vos ressources disponibles. Les ressources EX sont toujours utilisées en premier. Au début de chaque tour, vous gagnez une ressource supplémentaire.",
            playLevel3: "Pour jouer une carte de niveau 3 avec un coût de 2, vous devez avoir au moins 3 ressources au total, dont 2 disponibles.",
            playIt: "Les conditions sont remplies. La carte brille en jaune : vous pouvez la jouer, comme la précédente.",
            resourcesUsed: "2 ressources ont été utilisées. Il vous en reste 1 disponible (jaune) et 2 indisponibles (rouges).",
            ennemyBase: "Voici la base ennemie. Chaque joueur commence la partie avec une base.",
            attack: "Cette unité est prête à attaquer. Sélectionnez-la et relâchez-la sur le terrain adverse pour lancer l’attaque.",
            rested: "Cette unité a attaqué. Elle est maintenant engagée (pivotée à 90 degrés).",
            showApHp2: "Au-dessus de la carte, vous voyez (0 - 1), indiquant les AP (0) et les HP (1).",
            showApHp3: "L’unité a attaqué la base ennemie, infligeant 2 points de dégâts (AP). La base avait 3 HP, elle en a maintenant 1.",
            showEffect: "Lorsqu’un effet de carte est activé, un cercle rouge avec du texte apparaît. Pour cette carte : 'Réparer 1'.",
            p2LinkUnit: "Le joueur 2 a joué une unité avec un pilote lié. Elle peut donc attaquer ce tour-ci.",
            p2AttackBase: "Le joueur 2 peut utiliser cette unité pour attaquer notre base.",
            p2AttackUnit: "Ou bien il peut attaquer notre unité engagée.",
            unitTrash: "Les PV de notre unité sont tombés à 0. Elle a été envoyée à la défausse.",
            linkUnit: "Cette unité peut être liée à un pilote. Jouez-la maintenant.",
            linkPilot: "Vous pouvez maintenant associer ce pilote à l’unité que vous venez de jouer.",
            attackLink: "Vous pouvez maintenant attaquer avec cette unité liée."
        }
    }

    static getTextTuto(prop) {
        if (!this.tutoText.used)
            this.tutoText.used = this.tutoText.fr;
        return this.tutoText.used[prop];
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
                    text: context.getTextTuto('welcome')
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
                game.player1.deck[1].id = 'GD01-004';
                game.tutoMasks = game.tutoMasks.filter(x => x.id != 'player1Deck' && x.id !== 'player2Deck');
                game.isPlayer1 = false;
                game.showTextTuto = {
                    ...context.alignPositionNextTo(game, game.grid.player1Deck),
                    text: context.getTextTuto('deck')
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
                return context.conditionNexTurn(context, game);
            },
            action: (context, game) => {
                game.showTextTuto = {
                    ...game.grid.player1Field, y: game.grid.player1Field.y - game.grid.player1Field.height * 0.75, hideNext: true, sens: 1,
                    text: context.getTextTuto('playUnit')
                };
                game.showTextTuto.arrow = context.addArrow(game.showTextTuto, game.grid.player1Field, 1);
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
                    ...context.alignPositionNextTo(game, game.player1.field[0].position, 300, game.grid.boxHeight * 1.5),
                    text: context.getTextTuto('cantAttack')
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
                    text: context.getTextTuto('endTurn')
                };
            }
        },
        {
            // unfreeze and mask end turn button
            conditions: (context, game, task) => { return task && task.id === context.nextTurn.name; },
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
                return context.conditionNexTurn(context, game);
            },
            action: (context, game) => {
                game.freeze = true;
                game.showTextTuto = {
                    ...context.alignPositionNextTo(game, game.player1.hand[0].position), hideNext: true,
                    text: context.getTextTuto('zoom')
                };
            }
        },
        {
            // show tuto text on zoom card
            conditions: (context, game, task) => { return game.cardCenter; },
            action: (context, game) => {
                game.tutoMasks = game.tutoMasks.filter(x => x.id != 'resources');
                game.showTextTuto = {
                    ...game.cardCenter.position, y: game.cardCenter.position.y + game.cardCenter.position.height * 0.17, height: game.cardCenter.position.height * 0.83, zindex: 120,
                    text: context.getTextTuto('showLevelCost')
                };
            }
        },
        {
            // show tuto text on zoom card
            conditions: (context, game, task) => { return false },
            action: (context, game) => {
                game.tutoMasks = game.tutoMasks.filter(x => x.id != 'resources');
                game.showTextTuto = {
                    ...game.cardCenter.position, y: game.cardCenter.position.y, height: game.cardCenter.position.height * 0.9, zindex: 120,
                    text: context.getTextTuto('showLink')
                };
            }
        },
        {
            // show tuto text on zoom card
            conditions: (context, game, task) => { return false },
            action: (context, game) => {
                game.freeze = false;
                game.tutoMasks = game.tutoMasks.filter(x => x.id != 'resources');
                game.showTextTuto = {
                    ...game.cardCenter.position, y: game.cardCenter.position.y, height: game.cardCenter.position.height * 0.9, zindex: 120, hideNext: true,
                    text: context.getTextTuto('showApHp')
                };
            }
        },
        {
            // show tuto text
            conditions: (context, game, task) => { return !game.cardCenter; },
            action: (context, game) => {
                game.freeze = true;
                game.showTextTuto = {
                    ...context.alignPositionNextToUsingSens(game, game.grid.resources, 300, game.grid.boxHeight * 1.5, 3),
                    text: context.getTextTuto('showResources')
                };
            }
        },
        {
            // show tuto text
            conditions: (context, game, task) => { return false; },
            action: (context, game) => {
                game.showTextTuto = {
                    ...context.alignPositionNextToUsingSens(game, game.grid.resources, 300, game.grid.boxHeight * 1.5, 1),
                    text: context.getTextTuto('showResources2')
                };
            }
        },
        {
            // show tuto text
            conditions: (context, game, task) => { return false; },
            action: (context, game) => {
                game.showTextTuto = {
                    ...context.alignPositionNextToUsingSens(game, game.grid.resources, 300, game.grid.boxHeight * 2, 3),
                    text: context.getTextTuto('showResources3')
                };
            }
        },
        {
            // show tuto text
            conditions: (context, game, task) => { return false; },
            action: (context, game) => {
                game.showTextTuto = {
                    ...context.alignPositionNextTo(game, game.player1.hand[0].position),
                    text: context.getTextTuto('playLevel3')
                };
            }
        },
        {
            // play opponent unit
            conditions: (context, game, task) => { return false; },
            action: (context, game) => {
                game.freeze = false;
                game.freezeButtons = false;
                game.showTextTuto = {
                    ...context.alignPositionNextTo(game, game.player1.hand[0].position), hideNext: true,
                    text: context.getTextTuto('playIt')
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
                    text: context.getTextTuto('resourcesUsed')
                };
            }
        },
        {
            // animations base arriving
            conditions: (context, game, task) => { return false; },
            action: (context, game) => {
                game.showTextTuto = null;                
                game.tutoMasks = game.tutoMasks.filter(x => x.id != 'player1Base' && x.id != 'player2Base');                
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
                    text: context.getTextTuto('ennemyBase')
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
                    text: context.getTextTuto('attack')
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
                    text: context.getTextTuto('rested')
                };
            }
        },
        {
            // show text tuto
            conditions: (context, game, task) => { return context.tutoStep == 18 && !task; },
            action: (context, game) => {
                game.showTextTuto = {
                    ...context.alignPositionNextTo(game, game.player2.base[0].position),
                    text: context.getTextTuto('showApHp2')
                };
            }
        },
        {
            // show text tuto
            conditions: (context, game, task) => { return false; },
            action: (context, game) => {
                game.showTextTuto = {
                    ...context.alignPositionNextToUsingSens(game, game.player2.base[0].position, 300, game.grid.boxHeight * 1.5, 1),
                    text: context.getTextTuto('showApHp3')
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
                game.player1.field[1].fxTextCancelFadeout = true;
                game.showTextTuto = {
                    ...context.alignPositionNextTo(game, game.grid.buttonEndTurn), hideNext: true,
                    text: context.getTextTuto('endTurn')
                };
            }
        },
        {
            // prepare ai turn
            conditions: (context, game, task) => { return task && task.id === context.nextTurn.name; },
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
            conditions: (context, game, task) => { return task && task.id === context.showCardsEffect.name && task.hideFx },
            action: (context, game) => {
                game.freeze = true;
                game.showTextTuto = {
                    ...context.alignPositionNextTo(game, game.player1.field[1].position),
                    text: context.getTextTuto('showEffect')
                };
            }
        },
        {
            // prepare ai turn
            conditions: (context, game, task) => { return false; },
            action: (context, game) => {
                game.showTextTuto = null;
                game.freezeButtons = true;
                game.freeze = false;
            }
        },
        {
            // show text tuto
            conditions: (context, game, task) => { return game.player2.field.length > 0 && !task; },
            action: (context, game) => {
                game.freeze = true;
                game.player1.field[1].fxTextCancelFadeout = false;
                game.showTextTuto = {
                    ...context.alignPositionNextTo(game, game.player2.field[0].position),
                    text: context.getTextTuto('p2LinkUnit')
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
                    text: context.getTextTuto('p2AttackBase')
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
                    text: context.getTextTuto('p2AttackUnit')
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
        {
            // show text tuto
            conditions: (context, game, task) => { return context.conditionNexTurn(context, game) && !task; },
            action: (context, game) => {
                game.tutoMasks = game.tutoMasks.filter(x => x.id != 'player1Trash' && x.id != 'player2Trash');
                game.freeze = false;
                game.freezeButtons = true;
                game.showTextTuto = {
                    ...context.alignPositionNextToUsingSens(game, game.player1.positions.trash, 300, game.grid.boxHeight * 1.5, 2),
                    text: context.getTextTuto('unitTrash')
                };
            }
        },
        {
            // Attack Guncannon vs Gelgoog
            conditions: (context, game, task) => { return !task },
            action: (context, game) => {
                game.freezeButtons = false;
                game.showTextTuto = {
                    ...context.alignPositionNextTo(game, game.player1.field[0].position), hideNext: true,
                    text: 'We will avenge it by attacking the gelgoog with our unit. Select it and release it on the opponent unit.'
                };
            }
        },
        {
            // Fight Guncannon vs Gelgoog
            conditions: (context, game, task) => {
                const isGood = task && task.card1 && task.card1.id === 'GD01-004' && task.card2 && task.card2.id == 'GD01-031'; // Guncanon vs Gelgoog
                if (!isGood) {
                    game.tasks = [];
                }
                return isGood;
            },
            action: (context, game) => {
                game.showTextTuto = null;
                game.freezeButtons = true;
            }
        },
        {
            // show tuto text add one card to hand
            conditions: (context, game, task) => { return !task; },
            action: (context, game) => {
                game.freezeButtons = true;
                game.showTextTuto = {
                    ...context.tutoSmall(game),
                    text: "Now it's time to link a unit and a pilot. For this purpose, I will give you one famous unit card."
                };
            }
        },
        {
            // Add gundam to hand
            conditions: (context, game, task) => { return false; },
            action: (context, game) => {
                game.showTextTuto = null;
                context.addTask({ id: context.spawnOrMove.name, isPlayer1: true, from: context.locationDeck, to: context.locationHand });
                context.addTask({ id: context.spawnOrMove.name, isPlayer1: false, from: context.locationDeck, to: context.locationHand });
            }
        },
        {
            // Show tuto text gundam link
            conditions: (context, game, task) => { return !task && !game.player1.hand[1].to; },
            action: (context, game) => {
                game.freezeButtons = false;
                game.showTextTuto = {
                    ...context.alignPositionNextTo(game, game.player1.hand[1].position), hideNext: true,
                    text: context.getTextTuto('linkUnit')
                };
            }
        },
        {
            // Gundam is played
            conditions: (context, game, task) => {
                const isGood = task && task.card1 && task.card1.id.startsWith('ST01-001'); // Gundam
                if (!isGood) {
                    game.tasks = [];
                }
                return isGood;
            },
            action: (context, game) => {
                game.showTextTuto = null;
            }
        },
        {
            // Show tuto text play Amuro
            conditions: (context, game, task) => { return !task && !game.player1.field[0].to },
            action: (context, game) => {
                game.cardFocus = game.player1.hand[0];
                game.showTextTuto = {
                    ...context.alignPositionNextTo(game, game.cardFocus.position), hideNext: true,
                    text: context.getTextTuto('linkPilot')
                };
            }
        },
        {
            // Amuro is played
            conditions: (context, game, task) => {
                const isGood = task && task.card1 && task.card1.id === 'ST01-010' && task.card2 && task.card2.id.startsWith('ST01-001'); // Amuro on Gundam
                if (!isGood) {
                    game.tasks = [];
                }
                return isGood;
            },
            action: (context, game) => {
                game.showTextTuto = null;
            }
        },
        {
            // Show tuto text Attack with gundam
            conditions: (context, game, task) => { return !task && !game.cardFocus.to; },
            action: (context, game) => {
                game.cardFocus = null;
                game.showTextTuto = {
                    ...context.alignPositionNextTo(game, game.player1.field[0].position), hideNext: true,
                    text: context.getTextTuto('attackLink')
                };
            }
        },
        {
            // Gundam attack
            conditions: (context, game, task) => { return task && task.id == context.play.name; },
            action: (context, game) => {
                game.freeze = false;
                game.showTextTuto = null;
            }
        },
        {
            // show shield
            conditions: (context, game, task) => { return !task; },
            action: (context, game) => {
                game.tutoMasks = game.tutoMasks.filter(x => x.id != 'player1Shield' && x.id != 'player2Shield');
                game.showTextTuto = {
                    ...context.alignPositionNextToUsingSens(game, game.player2.positions.shield, 300, game.grid.boxHeight*2, 1),
                    text: 'The ennemy base have been destroyed. To win this fight, we need now to destroy all shield cards and perform a final attack.'
                };
            }
        },
        {
            // press end turn
            conditions: (context, game, task) => { return false },
            action: (context, game) => {
                game.tutoMasks = game.tutoMasks.filter(x => x.id != 'buttonEndTurn');
                game.showTextTuto = {
                    ...context.alignPositionNextTo(game, game.grid.buttonEndTurn), hideNext: true,
                    text: context.getTextTuto('endTurn')
                };
            }
        },
        {
            // unfreeze and mask end turn button
            conditions: (context, game, task) => { return task && task.id === context.nextTurn.name; },
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
            // play base
            conditions: (context, game, task) => { return context.conditionNexTurn(context, game)},
            action: (context, game) => {
                game.freeze = false;
                game.freezeButtons = false;
                game.showTextTuto = {
                    ...context.alignPositionNextTo(game, game.player1.hand[0].position), hideNext: true,
                    text: "This is not a unit or a pilot. It's base. Play it"
                };
            }
        },
        {
            // Base is played
            conditions: (context, game, task) => {
                const isGood = task && task.card1 && task.card1.id === 'ST01-015'; // White base
                if (!isGood) {
                    game.tasks = [];
                }
                return isGood;
            },
            action: (context, game) => {
                game.freezeButtons = true;
                game.showTextTuto = null;
            }
        },
        {
            // show text tuto
            conditions: (context, game, task) => { return !task; },
            action: (context, game) => {
                game.showTextTuto = {
                    ...context.alignPositionNextTo(game, game.player1.base[0].position),
                    text: "A player can only have one base. The previous one have been replaced."
                };
            }
        },
        {
            // show use effect button
            conditions: (context, game, task) => { return false },
            action: (context, game) => {
                game.freezeButtons = false;
                game.tutoMasks = game.tutoMasks.filter(x => x.id != 'buttonEffect');
                game.showTextTuto = {
                    ...context.alignPositionNextTo(game, game.grid.buttonEffect), hideNext: true,
                    text: "Our base has an effect that we can activate here."
                };
            }
        },
        {
            // use effect popup
            conditions: (context, game, task) => { 
                const isGood = task && task.id == context.lunchMainEffectCard.name;
                if (!isGood) {
                    game.tasks = [];
                }
                return isGood;
             },
            action: (context, game) => {
                game.showTextTuto = null;
            }
        },
        {
            // popup select white base
            conditions: (context, game, task) => {
                const isGood = task && task.card1 && task.card1.id === 'ST01-015'; // White base
                if (task && task.id == context.popup.name)
                    return false;
                if (!task) {
                    game.tutoStep-=1;
                    this.tutoSteps[game.tutoStep].isDone=false;
                    this.tutoSteps[game.tutoStep+1].isDone=false;
                    return false;
                }
                if (!isGood) {
                    game.tasks = [];
                }
                return isGood;
            },
            action: (context, game) => {
                game.showTextTuto = null;
            }
        },
        {
            // show text tuto
            conditions: (context, game, task) => { return !task && game.player1.field.length > 0 && !game.player1.field[1].to; },
            action: (context, game) => {
                game.freezeButtons = true;
                game.showTextTuto = {
                    ...context.alignPositionNextTo(game, game.player1.field[1].position),
                    text: "The white base effect will give you one unit. This unit doesn't have a link condition"
                };
            }
        },
        {
            // show text tuto play banagher
            conditions: (context, game, task) => { return false; },
            action: (context, game) => {
                game.freezeButtons=false;
                game.showTextTuto = {
                    ...context.alignPositionNextTo(game, game.player1.hand[0].position), hideNext:true,
                    text: "But we can still pair this pilot to it"
                };
            }
        },
        {
            // play banagher
            conditions: (context, game, task) => {
                const isGood = task && task.card1 && task.card1.id.startsWith('GD01-088') && task.card2 && task.card2.id === 'T-002'; // banagher on token guncanon
                if (!isGood) {
                    game.tasks = [];
                }
                return isGood;
            },
            action: (context, game) => {
                game.freezeButtons = false;
                game.showTextTuto = null;
            }
        },
        {
            // Show text tuto banagher guncanon
            conditions: (context, game, task) => { return !task; },
            action: (context, game) => {
                game.showTextTuto = {
                    ...context.alignPositionNextTo(game, game.player1.field[1].position, 300,  game.grid.boxHeight*1.5),
                    text: "Theses cards are not linked, they are only paired. It means this unit can't attack this turn. But the AP and HP of the pilot have been added to the one of this unit"
                };
            }
        },
        {
            // Attack with gundam
            conditions: (context, game, task) => { return false; },
            action: (context, game) => {
                game.freezeButtons=true;
                game.tutoMasks = [];
                game.showTextTuto = {
                    ...context.tutoSmall(game),
                    text: "It's time for you to play alone. Try to win this duel by attacking the ennemy where there is no shield or base left."
                };
            }
        },
        {
            // hide text tuto
            conditions: (context, game, task) => { return task && task.id === context.play.name; },
            action: (context, game) => {
                game.freezeButtons=false;
                game.showTextTuto = null;
            }
        },
        {
            // burst
            conditions: (context, game, task) => { return task && task.id == context.applyEffectCard.name && task.card1 && task.card1.id=='ST01-010'; },
            action: (context, game) => {
                game.showTextTuto = {
                    ...context.alignPositionNextTo(game, game.grid.player1Shield),
                    text: "This card have a burst effect. these kind of effect is trigger when the card is reveal from the shield area"
                };
            }
        },
        {
            // End
            conditions: (context, game, task) => { return false; },
            action: (context, game) => {
                game.freeze = false;
                game.freezeButtons = false;
                game.showTextTuto = null;
            }
        }
    ];
}


export default tuto;
