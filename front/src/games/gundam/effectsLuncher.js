class effectsLuncher {
    static trigger_onplay = 'onplay';
    static trigger_onpair = 'onpair';
    static trigger_onlink = 'onlink';
    static trigger_refresh = 'refresh';
    static trigger_battle = 'battle';
    static trigger_burst = 'burst';
    static trigger_command = 'command';
    static trigger_action = 'action';
    static trigger_ondestroyed = 'ondestroyed';
    static trigger_end = 'end';

    static lunchEffectTriggerMultiple(cards, trigger) {
        const cardsList = cards.filter(x => x.effects && x.effects.find(y => y.trigger === trigger));
        let tasks = [];

        cardsList.forEach(card1 => {
            tasks.push({ id: this.applyEffectCard.name, card1, trigger });
        });

        if (tasks.length > 0)
            this.addTasksFirst(tasks);

        return tasks.length > 0;
    }

    static lunchEffectTriggerForOneCard(card1, trigger) {
        const result = { isEffectExisting: false };
        const effects = this.getEffects(card1, trigger);
        if (!effects || effects.length < 1)
            return result;

        result.isEffectExisting = true;
        result.cancelMoveToTrash = this.getCancelMoveToTrash(effects);
        this.addTaskFirst({ id: this.applyEffectCard.name, card1, trigger });

        return result;
    }

    static lunchEffectTriggerForTwoCard(card1, card2, trigger) {
        const isExistingCard1Effect = this.getEffects(card1, trigger);
        const isExistingCard2Effect = this.getEffects(card2, trigger);
        if (!isExistingCard1Effect && !isExistingCard2Effect)
            return false;

        const tasks = [];

        if (isExistingCard1Effect)
            tasks.push({ id: this.applyEffectCard.name, card1, cardUnit: card1, trigger });

        if (isExistingCard2Effect)
            tasks.push({ id: this.applyEffectCard.name, card1: card2, cardUnit: card1, trigger });

        this.addTasksFirst(tasks);
        return tasks.length > 0;
    }

    static getEffects(card, trigger) {
        let result = [];
        if (!card || !card.effects)
            return result;
        result = card.effects.filter(y => y.trigger === trigger);
        if (card.pair && card.pair.effects)
            result = result.concat(card.pair.effects.filter(y => y.trigger === trigger));
        return result;
    }

    static getCancelMoveToTrash(effects) {
        const effectsThatCancelMoveToTrash = [this.sendToHand.name, this.deploy.name];
        return effects.find(effect => effectsThatCancelMoveToTrash.includes(effect.id)) ? true : false;
    }

    static applyEffectCard(game, task) {
        const effects = task.card1.effects.filter(x => x.trigger == task.trigger);
        const text = effects.map(fx => this.getEffectText(fx)).join('<br>');
        let tasks = [];
        const show = effects.filter(fx => !fx.hide).length > 0;

        if (show)
            tasks.push({ ...task, id: this.showCards.name, text, delay: true });

        tasks = tasks.concat(effects.map(effect => { return { ...task, id: this.applyEffect.name, effect }; }));

        this.addTasksFirst(tasks);
    }

    static getEffectText(effect) {
        let result = [effect.id?.toString(), effect.value?.toString(), effect.target?.toString(), effect.effect2?.toString()];
        if (effect.ap)
            result.push('ap ' + effect.ap);

        if (effect.hp)
            result.push('hp ' + effect.ap);

        if (effect.effects)
            result = result.concat(effect.effects.map(x => this.getEffectText(x)).join(', '));

        return result.filter(x => x && x.length > 0).join(' ');
    }

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

    static applyEffect(game, task, player, opponent) {
        const targetResult = this.handleEffectTarget(game, task, player, opponent);
        if (targetResult.stop || targetResult.end)
            return targetResult;

        if (!this.isEffectMatchConditions(game, task, player, opponent))
            return {};

        if (task.effect.oneTurn)
            task.card1.removeEndTurn = !task.card1.removeEndTurn ? [task.effect]
                : task.card1.removeEndTurn.concat([task.effect]);

        task.isConditionsAfterRespected = this.isConditionsAfterRespected(game, task, player, opponent);
        if (task.card2)
            task.card2.fx = task.isConditionsAfterRespected;

        return this[task.effect.id](game, task, player, opponent);
    }
}


export default effectsLuncher;
