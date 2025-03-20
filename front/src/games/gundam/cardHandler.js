import global from '../global';
import gameTask from '../gameTask';
import effects from './effects';

class cardHandler {
    static nextTurn(player) {
        global.game.cards.forEach(card => card.selectable = false);

        player.field.forEach(x => {
            x.active = true;
            x.canAttack = true;
        });
    }

    static setSelectable(player) {
        player.hand.forEach(card => {
            const resourcesMax = Math.max(player.resourcesMax, player.resourcesAvailable);
            const isCostAvailable = card.level <= resourcesMax && card.cost <= player.resourcesAvailable;
            const isTurnPlayer = global.isPlayer1 === card.isPlayer1;

            card.selectable = isCostAvailable && isTurnPlayer;
            if (global.isCardUnit(card) && player.field.length > 5)
                card.selectable = false;
        });

        player.field.forEach(card => {
            card.selectable = card.canAttack;
        });
    }

    static play(player, card1, card2, zone, isShowingEffect) {
        const noDropZone = !card2 && !zone;
        if (noDropZone) {
            this.sendCardBackToSquareOne(card1);
            return;
        }

        if (card1.location === global.locationHand)
            return this.playFromHand(player, card1, card2, zone, isShowingEffect);
        else if (card1.location === global.locationField)
            return this.attack(player, card1, card2, zone);
        else
            return this.playCard(player, card1, card2, zone, isShowingEffect, false);
    }

    static sendCardBackToSquareOne(card) {
        const rotation = card.active ? 0 : 90;
        card.to = { ...global.clone(card.position), rotation };
        card.position = { ...card.position, ...card.positionDrag };
        global.game.refresh = true;
        return global.game;
    }

    static playFromHand(player, card1, card2, zone, isShowingEffect) {
        const isSamePlayer = zone.isPlayer1 == player.isPlayer1;
        if (!isSamePlayer || zone.location == global.locationHand) {
            this.sendCardBackToSquareOne(card1);
            return;
        }

        return this.playCard(player, card1, card2, zone, isShowingEffect, true);
    }

    static playCard(player, card1, card2, zone, isShowingEffect, playCost) {
        let isPilot = this.isCardPilot(card1);
        let isCommand = this.isCardCommand(card1);

        if (this.isCardPilot(card1) && this.isCardCommand(card1) && card2) {
            if (!global.game.choice) {
                const choices = [{ text: 'Pilot' }, { text: 'Command' }];
                global.game.tasks = [{
                    id: gameTask.taskPopup,
                    text: 'Do you want to play as pilot or command ?',
                    choices
                }].concat(global.game.tasks);
                return { stop: true }
            } else {
                isPilot = global.game.choice.text === 'Pilot';
                isCommand = global.game.choice.text === 'Command';
                delete (global.game.choice);
                delete (global.game.popup);
            }
        }


        if (!global.game.cards.find(x => x.index === card1.index)) {
            global.game.cards.push(card1);
        }

        const effectResult = effects.handleEffects(player, card1, card2, effects.onplay);
        if (effectResult.stop)
            return effectResult;

        if (this.isCardUnit(card1) && player.field.length < 6) {
            card1.canAttack = false;
            if (playCost)
                player.resourcesAvailable -= card1.cost;
            global.move(player, card1, card1.location, player.positions.field.location);
            return;
        }

        if (this.isCardBase(card1)) {
            if (player.base.length > 0)
                gameTask.addTasks(global.game.tasks, [{ id: gameTask.taskMove, card1: player.base[0], to: global.locationTrash, isPlayer1: card1.isPlayer1 }]);

            global.move(player, card1, card1.location, global.locationBase);
            card1.selectable = false;
            return;
        }

        if (isPilot && card2 && this.isCardUnit(card2)) {
            if (card1.pair || card2.pair || card1.isPaired || card2.isPaired) {
                this.sendCardBackToSquareOne(card1);
                return;
            }

            if (playCost)
                player.resourcesAvailable -= card1.cost;
            gameTask.addTasks(global.game.tasks, [{ id: gameTask.taskPairCard, card1, card2 }]);
            return;
        }

        if (isCommand) {
            const effectResult = effects.apply(effects.command, player, card1, card2);
            if (effectResult.stop) {
                return;
            }

            if (playCost)
                player.resourcesAvailable -= card1.cost;

            global.moveCardToMiniCenterWithTextThenDeleteIt(card1, global.effects.join('<br>'));
            return;
        }

        this.sendCardBackToSquareOne(card1);
    }

    static attack(player, card1, card2, zone, breach) {
        const isSamePlayer = zone.isPlayer1 == player.isPlayer1;
        if (isSamePlayer) {
            this.sendCardBackToSquareOne(card1);
            return;
        }

        const opponent = global.getPlayerTurnOpponent();
        const blockers = opponent.field.filter(x => x.block && x.active);
        let selectedAsBlocker = false;
        if (!global.game.blocker && blockers.length > 0) {
            if (!global.game.cardChoice && !global.game.choice) {
                global.game.tasks = [{
                    id: gameTask.taskPopup,
                    text: 'Select a blocker ?',
                    cards: blockers,
                    choices: [{ text: 'none' }]
                }
                ].concat(global.game.tasks);
                return { stop: true };
            }

            card2 = global.game.cardChoice;
            global.game.blocker = card2;
            selectedAsBlocker = true;
        }

        /*const actionCardResult = effects.askForActionCards(player, opponent);
        if (actionCardResult && actionCardResult.stop)
            return actionCardResult;*/

        delete (global.game.blocker);
        global.deletePopup();

        if (card2 && card2.isPlayer1 === opponent.isPlayer1) {
            const isValidTarget = card1.attackActiveEnnemy ? card2.level < card1.attackActiveEnnemy : selectedAsBlocker || !card2.active;
            if (!isValidTarget) {
                this.sendCardBackToSquareOne(card1);
                return;
            }

            global.startAttackAnimation(player, opponent, card1, card2, zone, breach);
            return;
        }

        if (opponent.shield < 1 && opponent.base.length < 1)
            return this.end(opponent);

        if (opponent.base.length > 0) {
            const target = opponent.base[0];
            global.startAttackAnimation(player, opponent, card1, target, zone);
            return;
        } else {
            global.setActive(card1, false);

            let card = opponent.shield.splice(0, 1)[0];
            const effectResult = effects.apply(effects.burst, opponent, card, card1);
            if (effectResult.stop) {
                return;
            }

            gameTask.addTasks(global.game.tasks, [
                { id: gameTask.taskCardToCenter, card1: card, isPlayer1: card.isPlayer1, delay: global.delay },
                { id: gameTask.taskMove, card1: card, to: global.locationTrash, isPlayer1: card.isPlayer1 },
            ]);
        }

        this.sendCardBackToSquareOne(card1);
    }

    static attackCard(player, opponent, attacker, target, zone, breach) {
        const effectResult = effects.apply(effects.battle, player, attacker);
        if (effectResult.stop) {
            return;
        }

        const delay = global.delay;

        let damage = breach ? breach : attacker.ap;
        if (target.immuneAp && damage < target.immuneAp)
            damage = 0;
        target.hp -= damage;

        damage = target.ap;
        if (attacker.immuneAp && attacker < target.immuneAp)
            damage = 0;
        attacker.hp -= damage;

        const activeBreach = !breach && this.isCardUnit(target) && attacker.breach && target.hp < 1;
        global.setActive(attacker, false);
        const tasks = [];

        if (attacker.hp < 1) {
            attacker.dead = true;
            const delayForTarget = target.hp < 1 ? null : global.delay;
            tasks.push({ id: gameTask.taskMove, delay: delayForTarget, card1: attacker, to: global.locationTrash, isPlayer1: attacker.isPlayer1 });
        }
        else if (!activeBreach)
            tasks.push({ id: gameTask.taskRefreshField, isPlayer1: attacker.isPlayer1 });

        if (target.hp < 1) {
            target.dead = true;
            tasks.push({ id: gameTask.taskMove, delay, card1: target, to: global.locationTrash, isPlayer1: target.isPlayer1 });
        }
        else
            tasks.push({ id: gameTask.taskRefreshField, isPlayer1: target.isPlayer1 });

        global.setActive(attacker, false);

        gameTask.addTasks(global.game.tasks, tasks);

        if (activeBreach) {
            this.attack(player, attacker, null, zone, attacker.breach);
        }
    }

    static selectChoiceCard(game, card) {
        game.cardChoice = card;
    }

    static selectChoice(game, choice) {
        game.choice = choice;
    }

    static end(opponent) {
        const message = opponent.isPlayer1 ? 'Defeat' : 'Victory';
        alert(message);
    }

    static isCardUnit(card) { return card.type?.includes(0); }
    static isCardPilot(card) { return card.type?.includes(1); }
    static isCardCommand(card) { return card.type?.includes(2); }
    static isCardCommandPilot(card) { return this.isCardPilot(card) && this.isCardCommand(card); }
    static isCardBase(card) { return card.type?.includes(3); }
}


export default cardHandler;
