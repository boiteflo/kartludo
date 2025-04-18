class aiPlay {
    static handleAiHand(game, task, player, cardsAvailable, combos) {
        if (player.base.length < 1) {
            const bases = cardsAvailable.filter(card => this.isCardBase(card));
            if (bases.length > 0)
                return this.playCombo(player, { unit: bases[0] });
        }

        if (combos.pilotLinkUnits.length > 0)
            return this.playCombo(player, combos.pilotLinkUnits[0]);

        if (combos.pilotLinkUnitsOnFieldWithEffects.length > 0)
            return this.playCombo(player, combos.pilotLinkUnitsOnFieldWithEffects[0]);

        const combo = this.handleStrategy(game, player, cardsAvailable);
        if (combo.stop || combo.taskAdded)
            return combo;
        if (combo && combo.unit)
            return this.playCombo(player, combo);

        const units = cardsAvailable.filter(card => this.isCardUnit(card))
            .sort((a, b) => b.level - a.level);
        if (units.length > 0)
            return this.playCombo(player, { unit: units[0] });

        return {};
    }

    static playCombo(player, combo) {
        let tasks = [];
        if (combo.unit && combo.unit.location === this.locationHand)
            tasks = tasks.concat(this.getPlayCardTasks(player, combo.unit));

        if (combo.pilot && combo.pilot.location === this.locationHand)
            tasks = tasks.concat(this.getPlayCardTasks(player, combo.pilot, combo.unit));

        this.addTasksFirst(tasks);
        return { taskAdded: tasks.length > 0 };
    }

    static handleAiField(game, task, player) {
        const unitsThatCanAttack = player.field
            .filter(card => this.isCardUnit(card) && card.canAttack)
            .sort((a, b) => b.ap - a.ap);
        const attacker = unitsThatCanAttack[0];
        if (!attacker)
            return {};

        const notEnoughShield = this.getNotEnoughShield(game, task, player, unitsThatCanAttack, attacker);
        const target = this.getTarget(game, task, player, attacker, notEnoughShield);
        this.declareAiAttack(attacker, target);
        return { taskAdded: true };
    }

    static getNotEnoughShield(game, task, player, unitsThatCanAttack, attacker) {
        let attackMinimimForWin = game.player1.shield.length + 1;
        if (game.player1.base.length > 0) {
            attackMinimimForWin += 1;
            const base = game.player1.base[0];
            if (base.hp > attacker.ap)
                attackMinimimForWin += 1;
        }
        return attackMinimimForWin <= unitsThatCanAttack.length;
    }

    static getTarget(game, task, player, attacker, notEnoughShield) {
        const targets = game.player1.field.filter(x => this.isValidTarget(game.player1, attacker, x) && x.hp <= attacker.ap);
        const target = targets.length < 1 ? null : targets.sort((a, b) => b.level - a.level)[0];

        if (target && attacker.breach)
            return target;

        if (notEnoughShield)
            return null;

        return target;
    }

    static getPlayCardTasks(player, card1, card2) {
        const value = `I Play ${card1.name} ${card2 ? 'with ' + card2.name : ''}`;
        return [
            { id: this.showTitle.name, value, isPlayer1: false, delay: true },
            { id: this.play.name, card1, card2, zone: player.positions.field, regularPlay: true }
        ]
    }

    static declareAiAttack(attacker, target) {
        const value = `I attack with ${attacker.name} (Level ${attacker.level}, AP ${attacker.ap}) ${target ? 'against ' + target.name : ''}`;
        this.addTasksFirst([
            { id: this.showTitle.name, value, isPlayer1: false, delay: true },
            {
                id: this.attack.name,
                attacker, isPlayer1: false,
                target
            }
        ]);
    }
}


export default aiPlay;
