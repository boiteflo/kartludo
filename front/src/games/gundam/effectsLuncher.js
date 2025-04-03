class effectsLuncher {
    static trigger_onplay = 'onplay';
    static trigger_onpair = 'onpair';
    static trigger_onlink = 'onlink';
    static trigger_battle = 'battle';
    static trigger_burst = 'burst';
    static trigger_command = 'command';
    static trigger_ondestroyed = 'ondestroyed';
    static trigger_onRefreshField = 'onRefreshField';
    static trigger_end = 'end';

    static removeOneTurnEffect(cards) {
        cards.filter(x => x.removeEndTurn).forEach(card => {
            const lost = [];
            card.removeEndTurn.forEach(fx => {
                delete card[fx.id];
                lost.push(fx.id);
            })
            this.log(`${card.name} lost ${lost.join(', ')}`);
        });
    }

    static lunchEffectTriggerMultiple(cards, trigger) {
        const cardsList = cards.filter(x => x.effects && x.effects.find(y => y.trigger === trigger));
        let tasks = [];

        cardsList.forEach(card1 => {
            tasks.push({ id: this.applyEffectTrigger.name, card1, trigger });
        });

        if (tasks.length > 0)
            this.addTasksFirst(tasks);

        return tasks.length > 0;
    }

    static lunchEffectTriggerForOneCard(card1, card2, trigger) {
        const isExisting = card1.effects && card1.effects.find(y => y.trigger === trigger);
        if (!isExisting)
            return false;

        this.addTaskFirst({ id: this.applyEffectCard.name, card1, card2, trigger });
        return true;
    }

    static lunchEffectTriggerForTwoCard(card1, card2, trigger) {
        const isExistingCard1Effect = card1.effects && card1.effects.find(y => y.trigger === trigger);
        const isExistingCard2Effect = card2.effects && card2.effects.find(y => y.trigger === trigger);
        if (!isExistingCard1Effect && !isExistingCard2Effect)
            return false;

        if(isExistingCard1Effect)
            this.addTaskFirst({ id: this.applyEffectCard.name, card1, card2, trigger });
        
        if(isExistingCard2Effect)
            this.addTaskFirst({ id: this.applyEffectCard.name, card1:card2, card2:card1, trigger });
        return true;
    }

    static applyEffectCard(game, task) {
        const effects = task.card1.effects.filter(x => x.trigger == task.trigger);
        this.addTasksFirst(effects
            .map(effect => { return { ...task, id: this.applyEffect.name, effect }; }));
    }

    static popupTargetCards(game, task, player, opponent) {
        let cards = [];
        if (task.effect.target === 'opponentUnitHpUnderValue')
            cards = opponent.field.filter(x => this.isCardUnit(x) && x.hp < task.effect.value);

        else if (task.effect.target === 'opponentUnitRested')
            cards = opponent.field.filter(x => this.isCardUnit(x) && !x.active);

        else if (task.effect.target === 'playerUnit')
            cards = player.field.filter(x => this.isCardUnit(x));

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
            text: 'Select available target',
            cards
        }].concat(this.game.tasks);
        return { stop: true }
    }

    static applyEffect(game, task, player, opponent) {
        const needNewCard2 = ['opponentUnitHpUnderValue', 'opponentUnitRested', 'playerUnitWithAttribute', 'playerUnit'];
        let card2Obj = task.effect.target && needNewCard2.includes(task.effect.target) ? task.cardChoice : task.card2;

        if (task.effect.target && !card2Obj)
            return this.popupTargetCards(game, task, player, opponent);

        if (task.effect.oneTurn)
            task.card1.removeEndTurn = !task.card1.removeEndTurn ?  [task.effect]
                : task.card1.removeEndTurn.concat([task.effect]);

        return this[task.effect.id](game, task, player, opponent);
    }
}


export default effectsLuncher;
