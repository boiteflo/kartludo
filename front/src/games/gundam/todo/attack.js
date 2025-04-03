class attack {

    static taskAttackPlayerAnimation(game, task, player) {
        const opponent = global.getPlayer(!player.isPlayer1);
        const heartPosition = opponent.isPlayer1 ? global.grid.player1Heart : global.grid.player2Heart;
        task.card1.to = { ...task.card1.position, x: heartPosition.x, y: heartPosition.y };
    }
    
    static createAttackTask(player, opponent, card1, card2, zone, breach) {
        gameTask.addTasks([{ id: gameTask.taskAttack.name, player, opponent, attacker: card1, target: card2, zone, breach }]);
    }

    static attack(task) {
        global.game.taskAttack = task;
        let result = {};
        task.step = task.step ? task.step : this.attackStep[0];

        while (!result.stop && !result.end) {
            if (task.step === this.stepSelectBlocker)
                result = this.selectBlocker(task);

            else if (task.step === this.stepSelectActionCards)
                result = this.selectCardAction(task);

            else if (task.step === this.stepSelectCardOpponent)
                result = this.selectCardOpponent(task);

            else if (task.step === this.stepEffectBattle)
                result = this.effectBattle(task);

            else if (task.step === this.stepShowFight)
                result = this.showFight(task);

            else if (task.step === this.stepFight)
                result = this.fight(task);

            else
                result.end = true;

            if (!result.stop && !result.end)
                this.nextStep(task);
        }

        return result;
    }

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

    static nextStep(task) {
        const array = this.attackStep;
        const index = array.indexOf(task.step);
        if (index < array.length - 1)
            task.step = array[index + 1];
        else
            task.step = 'end';
        return {};
    }

    static selectBlocker(task) {
        const blockers = task.opponent.field.filter(x => x.block && x.active);
        if (task.attacker.highManeuver || task.blocker || blockers.length < 1)
            return {};

        if (!global.game.cardChoice && !global.game.choice)
            return gameTask.addTasksFirst([{ id: gameTask.taskPopup.name, text: 'Select a blocker ?', cards: blockers, choices: [{ text: 'none' }] }]);

        task.blocker = global.game.cardChoice;
        global.deletePopup();
        return {};
    }

    static selectCardAction() {// task
        /*const actionCardResult = cardAction.askForActionCards(task.player, task.opponent);
        if (actionCardResult && actionCardResult.stop)
            return actionCardResult;*/
        return {};
    }

    static selectCardOpponent(task) {
        if (task.blocker) {
            task.target = task.blocker;
            return {};
        }

        if (task.target) {
            const isValidTarget = task.target.isPlayer1 === task.opponent.isPlayer1
                && (!task.target.active || (task.attacker.attackActiveEnnemy && task.attacker.attackActiveEnnemy > task.target.level));
            return { end: !isValidTarget };
        }

        if (task.opponent.base.length > 0) {
            task.target = task.opponent.base[0];
            return {};
        }

        if (task.opponent.shield.length > 0) {
            task.step = 'end';
            global.setActive(task.attacker, false);

            gameTask.addTasks([
                { id: gameTask.taskAttackPlayerAnimation.name, card1: task.attacker, delay: true },
                { id: gameTask.taskMove.name, card1: task.opponent.shield[0], to: global.locationTrash }
            ]);
            return { end: true };
        }

        return global.end(task.player.isPlayer1);
    }

    static effectBattle(task) {
        return effects.handleEffects(task.player, task.attacker, task.target, effects.battle);
    }

    static showFight(task) {
        gameTask.addTasksFirst([{ id: gameTask.taskCardsToMiniCenter.name, delay: true, card1: task.attacker, card2: task.target }]);
        this.nextStep(task);
        return { stop: true };
    }

    static fight(task) {
        let damage = task.breach ? task.breach : task.attacker.ap;
        if (task.target.immuneAp && damage < task.target.immuneAp)
            damage = 0;
        task.target.hp -= damage;

        damage = task.target.ap;
        if (task.attacker.immuneAp && task.attacker < task.target.immuneAp)
            damage = 0;
        task.attacker.hp -= damage;

        const activeBreach = !task.breach && global.isCardUnit(task.target) && task.attacker.breach && task.target.hp < 1;
        global.setActive(task.attacker, false);
        let tasks = [];

        if (task.attacker.hp < 1)
            tasks = tasks.concat(global.destroyUnit(task.attacker, task.target.hp > 0 && !activeBreach));

        if (task.target.hp < 1)
            tasks = tasks.concat(global.destroyUnit(task.target));

        global.setActive(task.attacker, false);

        if (activeBreach)
            tasks.push({
                id: gameTask.taskAttack.name,
                player: task.player, opponent: task.opponent,
                attacker: task.attacker, zone: task.zone,
                breach: task.attacker.breach
            });

        gameTask.addTasks(tasks);
        return {};
    }
}


export default attack;
