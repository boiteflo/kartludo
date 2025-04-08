/* eslint-disable no-unused-vars */

class attack {
    static stepSelectBlocker = 'stepSelectBlocker';
    static stepSelectActionCards = 'stepSelectActionCards';
    static stepSelectCardOpponent = 'stepSelectCardOpponent';
    static stepEffectBattle = 'stepEffectBattle';
    static stepShowFight = 'stepShowFight';
    static stepFight = 'stepFight';
    static attackStep = [
        this.stepSelectBlocker,
        this.stepSelectActionCards,
        this.stepSelectCardOpponent,
        this.stepEffectBattle,
        this.stepShowFight,
        this.stepFight
    ];

    static attack(game, task, player, opponent) {
        game.taskAttack = task;
        let result = {};
        task.step = task.step ? task.step : this.attackStep[0];

        while (!result.stop && !result.end) {
            if (task.step === this.stepSelectBlocker)
                result = this.selectBlocker(game, task, player, opponent);

            else if (task.step === this.stepSelectActionCards)
                result = this.askForActionCards(game, task, player, opponent);

            else if (task.step === this.stepSelectCardOpponent)
                result = this.selectCardOpponent(game, task, player, opponent);

            else if (task.step === this.stepEffectBattle)
                result = this.effectBattle(game, task, player, opponent);

            else if (task.step === this.stepShowFight)
                result = this.showFight(game, task, player, opponent);

            else if (task.step === this.stepFight)
                result = this.fight(game, task, player, opponent);

            else
                result.end = true;

            if (!result || (!result.stop && !result.end))
                this.nextStep(task);
        }

        return result;
    }

    static nextStep(task) {
        const array = this.attackStep;
        const index = array.indexOf(task.step);
        if (index < array.length - 1)
            task.step = array[index + 1];
        else
            task.step = 'end';
        return {};
    }

    static selectBlocker(game, task, player, opponent) {
        const blockers = opponent.field.filter(x => x.blocker && x.active);
        if (task.attacker.highManeuver || task.blocker || blockers.length < 1)
            return {};

        if (!task.cardChoice && !task.choice)
            return this.addTaskFirst({
                id: this.popup.name,
                isPlayer1: opponent.isPlayer1,
                task,
                text: 'Select a blocker ?',
                cards: blockers,
                choices: [{ text: 'none' }]
            });

        task.blocker = task.cardChoice;
        delete (task.cardChoice);
        delete (task.choice);
        return {};
    }

    static selectCardOpponent(game, task, player, opponent) {
        if (task.blocker) {
            task.target = task.blocker;
            return {};
        }

        if (task.target) {
            const isValidTarget = this.isValidTarget(opponent, task.attacker, task.target);
            return { end: !isValidTarget };
        }

        if (opponent.base.length > 0) {
            task.target = opponent.base[0];
            return {};
        }

        if (opponent.shield.length > 0) {
            task.step = 'end';
            this.setActive(task.attacker, false);
            if (task.shieldProtection)
                return { end: true };

            const card1 = opponent.shield[0];
            card1.position = this.clone(opponent.positions.shield);
            task.attacker.to = { ...task.attacker.position, x: opponent.positions.shield.x, y: opponent.positions.shield.y };

            const burstEffect = this.lunchEffectTriggerForOneCard(card1, null, this.trigger_burst);
            const tasks = [];
            if(!burstEffect.isEffectExisting)
                tasks.push({ id: this.showCards.name, card1, delay: 100 });

            if(!burstEffect.cancelMoveToTrash)
                tasks.push({ id: this.spawnOrMove.name, card1, to: this.locationTrash });

            this.addTasks(tasks);
            return { end: true };
        }

        return this.end(player.isPlayer1);
    }

    static isValidTarget(opponent, attacker, target){
        return target.isPlayer1 === opponent.isPlayer1
            && (!target.active || (attacker.attackActiveEnnemy && attacker.attackActiveEnnemy > target.level));
    }

    static effectBattle(game, task, player, opponent) {
        let isExisting = task.battleEffectsAlreadyDone ? false
            : this.lunchEffectTriggerForOneCard(task.attacker, task.target, this.trigger_battle);
        if (isExisting) {
            task.battleEffectsAlreadyDone = true;
            return { stop: true };
        }
        return {};
    }

    static showFight(game, task, player, opponent) {
        this.addTaskFirst({ id: this.showCards.name, card1: task.attacker, card2: task.target, delay: true });
        this.nextStep(task);
        return { stop: true };
    }

    static fight(game, task, player, opponent) {
        let damage = task.breach ? task.breach : task.attacker.ap;
        if (task.target.immuneAp && damage < task.target.immuneAp)
            damage = 0;
        task.target.hp -= damage;

        damage = task.target.ap;
        if (task.attacker.immuneAp && task.attacker < task.target.immuneAp)
            damage = 0;
        task.attacker.hp -= damage;

        const activeBreach = !task.breach && this.isCardUnit(task.target) && task.attacker.breach && task.target.hp < 1;
        this.setActive(task.attacker, false);
        let tasks = [];
        const delay = activeBreach;
        let tasksAttackerDead = [];

        if (!task.breach && task.attacker.hp < 1)
            tasksAttackerDead = this.destroyUnit(task.attacker, false);

        if (task.target.hp < 1)
            tasks = this.destroyUnit(task.target, delay);

        this.setActive(task.attacker, false);

        if (activeBreach) {
            this.cardHighlight = this.cardHighlight.filter(x => x.index !== task.attacker.index);
            tasks.push({
                id: this.attack.name, step: this.stepSelectCardOpponent,
                attacker: task.attacker, isPlayer1: task.attacker.isPlayer1,
                breach: task.attacker.breach, delay: true
            });
        }

        if (tasksAttackerDead.length > 0)
            tasks = tasks.concat(tasksAttackerDead);

        this.addTasks(tasks);
        return {};
    }
}


export default attack;
