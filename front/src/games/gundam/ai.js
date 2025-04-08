/* eslint-disable no-unused-vars */

class ai {
    static newTurnForAI(game, task) {
        if (!task.haveBeenRefresh) {
            task.haveBeenRefresh = true;
            game.cards.forEach(card => card.AiUsed = null);
            this.addTaskFirst({ id: this.refreshFieldAndHand.name, isPlayer1: false, delay: true });
            return { stop: true };
        }

        const result = this.refreshAiTurn(game, task, game.player2);
        if (result && result.taskAdded)
            this.startTasks(game);

        return result;
    }

    static refreshAiTurn(game, task, player) {
        const cardsAvailable = player.hand.filter(x => x.selectable);
        const combos = this.getAiCombos(game, task, player, cardsAvailable);

        let result = this.handleAiHand(game, task, player, cardsAvailable, combos);
        if (result.stop || result.taskAdded)
            return result;

        result = this.handleAiField(game, task, player);
        if (result.taskAdded)
            return result;

        this.endTurn(game);
        return {};
    }

    static getAiCombos(game, task, player, cardsAvailable) {
        const units = cardsAvailable.filter(card => this.isCardUnit(card));
        const pilots = cardsAvailable.filter(card => this.isCardPilot(card));

        return {
            pilotLinkUnits: this.getAiCombosPilotLinkUnit(game, task, player, units, pilots),
            pilotLinkUnitsOnFieldWithEffects: this.getAiCombosPilotLinkUnitFieldWithEffects(game, task, player, pilots)
        };
    }

    static getAiCombosPilotLinkUnit(game, task, player, units, pilots) {
        if (pilots.length < 1)
            return [];

        let result = [];
        units.forEach(unit => {
            const costRemaining = player.resourcesAvailable - unit.cost;
            const pilot = pilots.find(pilot => this.isLink(unit, pilot) && pilot.cost <= costRemaining);
            if (pilot) {
                unit.AiUsed = pilot.index;
                pilot.AiUsed = unit.index;
                const value = unit.level + pilot.level;
                result.push({ unit, pilot, value, id: `${unit.name}-${pilot.name}-${value}` });
            }
        });

        result = result.sort((a, b) => b.value - a.value);
        return result;
    }

    static getAiCombosPilotLinkUnitFieldWithEffects(game, task, player, pilots) {
        if (pilots.length < 1)
            return [];

        let result = [];
        player.field.filter(unit => !unit.pair).forEach(unit => {
            const unitHasEffect = this.hasLinkEffect(unit);
            const pilot = pilots.find(pilot => !pilot.AiUsed && this.isLink(unit, pilot) && (unitHasEffect || this.hasLinkEffect(pilot)));
            if (pilot) {
                pilot.AiUsed = unit.index;
                const value = unit.level + pilot.level;
                result.push({ unit, pilot, value, id: `${unit.name}-${pilot.name}-${value}` });
            }
        });

        result = result.sort((a, b) => b.value - a.value);
        return result;
    }

    static hasLinkEffect(card) {
        return card && card.effects && card.effects.find(x => x.trigger === this.trigger_onlink) ? true : false;
    }

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

        const playAsap = cardsAvailable.filter(x => x.strategy && x.strategy == "playAsap");
        if (playAsap.length > 0)
            return this.playCombo(player, { unit: playAsap[0] });

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

        const notEnoughShield = this.getNotEnoughShield(game, task, player, unitsThatCanAttack);
        const target = this.getTarget(game, task, player, attacker, notEnoughShield);
        this.addTasksFirst([
            {
                id: this.attack.name,
                attacker, isPlayer1: false,
                target
            }
        ]);
        return { taskAdded: true };
    }

    static getNotEnoughShield(game, task, player, unitsThatCanAttack) {
        return game.player1.base.concat(game.player1.shield).length < unitsThatCanAttack.length;
    }

    static getTarget(game, task, player, attacker, notEnoughShield) {
        if (notEnoughShield)
            return null;

        const targets = game.player1.field.filter(x => this.isValidTarget(game.player1, attacker, x) && x.hp <= attacker.ap);
        if (targets.length > 0)
            return targets.sort((a, b) => b.level - a.level)[0];
    }

    static handleAiPopup(game, task) {
        const selectChoiceNull = task.text.includes('action card');
        if (selectChoiceNull && task.choices && task.choices.length > 0) {
            task.task.choice = task.choices[0];
            return {};
        }

        if (task.cards && task.cards.length > 0) {
            task.task.cardChoice = task.cards[0];
            return {};
        }

        if (task.choices && task.choices.length > 0) {
            task.task.choice = task.choices[0];
            return {};
        }

        this.deletePopup();
        return {};
    }

    static getPlayCardTasks(player, card1, card2) {
        return [{ id: this.play.name, card1, card2, zone: player.positions.field, regularPlay: true }]
    }
}


export default ai;
