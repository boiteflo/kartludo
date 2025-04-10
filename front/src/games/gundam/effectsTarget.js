class effectsTarget {

    static handleEffectTarget(game, task, player, opponent) {
        if (task.effect.target) {
            if (task.choice)
                return { end: true };
            else if (!task.cardChoice)
                return this.popupTargetCards(game, task, player, opponent);
            else
                task.card2 = task.cardChoice;
        }

        if (!task.card2 && task.effect.card.pairedWith)
            task.cardUnit = game.cards.find(x => x.index === task.effect.card.pairedWith);

        if (!task.card2 && task.cardUnit)
            task.card2 = task.cardUnit;

        if (!task.card2)
            task.card2 = task.effect.card;

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

        else if (task.effect.target === 'playerCardById')
            cards = player.hand.filter(x => x.id === task.effect.targetId);

        else if (task.effect.target === 'playerUnitWithAttribute')
            cards = player.field.filter(x => this.isCardUnit(x) && x.attribute.includes(task.effect.targetAttribute));

        else if (task.effect.target === 'playerUnitWithEffect')
            cards = player.field.filter(x => this.isCardUnit(x) && this.hasEffect(x, task.effect.effect));

        else if (task.effect.target === 'unit')
            throw new Error("Can't handle this tast target : 'unit'");

        if (cards.length < 1) {
            this.log(`Can't play ${task.effect.card.name} (${task.effect.id}) because there is no target available`);
            return { end: true };
        }

        const choices = [];
        if (task.effect.optional)
            choices.push({ text: 'None' });

        this.game.tasks = [{
            id: this.popup.name,
            isPlayer1: player.isPlayer1,
            task,
            text: 'Select available target',
            choices,
            cards
        }].concat(this.game.tasks);
        return { stop: true }
    }
}


export default effectsTarget;
