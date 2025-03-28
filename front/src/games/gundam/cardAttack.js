import global from '../global';
import gameTask from '../gameTask';
import effects from './effects';

class cardAttack {

    static prepareAttack(player, card1, card2, zone, breach) {
        const isSamePlayer = zone.isPlayer1 == player.isPlayer1;
        if (isSamePlayer) {
            return { sendBack: true };
        }

        const opponent = global.getPlayerTurnOpponent();
        const blockers = opponent.field.filter(x => x.block && x.active);
        let selectedAsBlocker = false;
        if (!global.game.blocker && blockers.length > 0) {
            if (!global.game.cardChoice && !global.game.choice) {
                global.game.tasks = [{
                    id: gameTask.taskPopup.name,
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

        /*const actionCardResult = cardAction.askForActionCards(player, opponent);
        if (actionCardResult && actionCardResult.stop)
            return actionCardResult;*/

        delete (global.game.blocker);
        global.deletePopup();

        if (card2 && card2.isPlayer1 === opponent.isPlayer1) {
            const isValidTarget = selectedAsBlocker || !card2.active || card1.attackActiveEnnemy > card2.level;
            if (!isValidTarget)
                return { sendBack: true };

            this.startAttackAnimation(player, opponent, card1, card2, zone, breach);
            return;
        }

        return this.attack(player, opponent, card1, zone);
    }

    static attack(player, opponent, card1, zone) {

        if (opponent.shield < 1 && opponent.base.length < 1)
            return { end: true, isPlayer1: opponent.isPlayer1 };

        if (opponent.base.length > 0) {
            const target = opponent.base[0];
            this.startAttackAnimation(player, opponent, card1, target, zone);
            return;
        }

        global.setActive(card1, false);
        let card = opponent.shield.splice(0, 1)[0];
        gameTask.addTasks(global.game.tasks, [
            { id: gameTask.taskApplyEffect.name, card1: card, trigger: effects.burst },
            { id: gameTask.taskMove.name, card1: card, to: global.locationTrash, isPlayer1: card.isPlayer1 }
        ]);
        return { sendBack: true };
    }

    static startAttackAnimation(player, opponent, attacker, target, zone, breach) {
        const delay = this.delay;
        gameTask.addTasks(global.game.tasks,
            [{ id: gameTask.taskCardsToMiniCenter.name, delay: global.delay, card1: attacker, card2: target },
            { id: gameTask.taskAttack.name, player, opponent, attacker, target, delay, zone, breach }
            ]);
    }

    static attackCard(player, opponent, attacker, target, zone, breach) {
        const effectResult = effects.apply(effects.battle, player, attacker);
        if (effectResult.stop) {
            return effectResult;
        }

        let damage = breach ? breach : attacker.ap;
        if (target.immuneAp && damage < target.immuneAp)
            damage = 0;
        target.hp -= damage;

        damage = target.ap;
        if (attacker.immuneAp && attacker < target.immuneAp)
            damage = 0;
        attacker.hp -= damage;

        const activeBreach = !breach && global.isCardUnit(target) && attacker.breach && target.hp < 1;
        global.setActive(attacker, false);
        const tasks = [];

        if (attacker.hp < 1) {
            attacker.dead = true;
            const delayForTarget = target.hp < 1 || activeBreach ? null : global.delay;
            tasks.push({ id: gameTask.taskMove.name, delay: delayForTarget, card1: attacker, to: global.locationTrash, isPlayer1: attacker.isPlayer1 });
        }

        if (target.hp < 1) {
            target.dead = true;
            tasks.push({ id: gameTask.taskMove.name, delay:global.delay, card1: target, to: global.locationTrash, isPlayer1: target.isPlayer1 });
        }

        global.setActive(attacker, false);

        if (activeBreach)
            tasks.push({ id: gameTask.taskAttack.name, player, opponent, attacker, zone, breach: attacker.breach });

        gameTask.addTasks(global.game.tasks, tasks);
    }
}


export default cardAttack;
