class effectsTarget {

    static handleEffectTarget(game, task, player, opponent) {
        const needNewCard2 = ['opponentUnitHpUnderValue', 'opponentActiveUnitHpUnderValue', 'opponentUnitRested',  'opponentUnit', 'playerUnitWithAttribute', 'playerUnit', 'playerUnitBlocker'];
        let card2Obj = task.effect.target && needNewCard2.includes(task.effect.target) ? task.cardChoice : task.card2;

        if (task.effect.target) {
            if (task.effect.target == "myself")
                task.card2 = task.card1;
            else if (!card2Obj)
                return this.popupTargetCards(game, task, player, opponent);
            else
                task.card2 = card2Obj;
        }

        return {};
    }

    static popupTargetCards(game, task, player, opponent) {
        let cards = [];
        if (task.effect.target === 'opponentUnitHpUnderValue')
            cards = opponent.field.filter(x => this.isCardUnit(x) && x.hp < task.effect.value);

        else if (task.effect.target === 'opponentActiveUnitHpUnderValue')
            cards = opponent.field.filter(x => this.isCardUnit(x) && x.hp < task.effect.value && x.active);

        else if (task.effect.target === 'opponentUnitRested')
            cards = opponent.field.filter(x => this.isCardUnit(x) && !x.active);

            else if (task.effect.target === 'opponentUnit')
                cards = opponent.field.filter(x => this.isCardUnit(x));

        else if (task.effect.target === 'playerUnit')
            cards = player.field.filter(x => this.isCardUnit(x));

        else if (task.effect.target === 'playerUnitBlocker')
            cards = player.field.filter(x => this.isCardUnit(x) && this.hadBlocker(x));

        else if (task.effect.target === 'playerUnitWithAttribute')
            cards = player.field.filter(x => this.isCardUnit(x) && x.attribute.includes(task.effect.targetAttribute));

        else if (task.effect.target === 'unit')
            throw new Error("Can't handle this tast target : 'unit'");

        if (cards.length < 1) {
            this.log(`Can't play ${task.card1.name} (${task.effect.id}) because there is no target available`);
            return {};
        }

        this.game.tasks = [{
            id: this.popup.name,
            isPlayer1: player.isPlayer1,
            task,
            text: 'Select available target',
            cards
        }].concat(this.game.tasks);
        return { stop: true }
    }
}


export default effectsTarget;
