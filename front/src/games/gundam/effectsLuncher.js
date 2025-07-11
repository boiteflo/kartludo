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
    static trigger_turn = 'turn';
    static trigger_end = 'end';
    static trigger_main = 'main';

    static lunchEffectTriggerMultiple(cards, trigger) {
        let isEffectExisting = false;
        cards.forEach(card1 => {
            const result = this.lunchEffectTriggerForOneCard(card1, trigger);
            isEffectExisting = isEffectExisting || result.isEffectExisting;
        });
        return isEffectExisting;
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
            tasks.push({ id: this.applyEffectCard.name, card1, cardUnit: card1, cardPilot: card2, trigger });

        if (isExistingCard2Effect)
            tasks.push({ id: this.applyEffectCard.name, card1: card2, cardUnit: card1, cardPilot: card2, trigger });

        this.addTasksFirst(tasks);
        return tasks.length > 0;
    }

    static getEffects(card, trigger, ignorePair) {
        let result = [];
        if (!card || !card.effects)
            return result;

        result = card.effects.filter(y => y.trigger === trigger).map(fx => { return { ...fx, card } });

        if (!ignorePair && card.pair && card.pair.effects)
            result = result.concat(card.pair.effects.filter(y => y.trigger === trigger).map(fx => { return { ...fx, card: card.pair } }));

        return result;
    }

    static getCancelMoveToTrash(effects) {
        const effectsThatCancelMoveToTrash = [this.sendToHand.name, this.deploy.name];
        return effects.find(effect => effectsThatCancelMoveToTrash.includes(effect.id)) ? true : false;
    }

    static applyEffectCard(game, task) {
        if (!task.card1)
            return;

        const effects = this.getEffects(task.card1, task.trigger, true);
        if (effects.length > 0) {
            const text = effects.map(fx => this.getEffectText(fx)).join('<br>');
            let tasks = [];
            let tasksDelay = [];
            const show = effects.filter(fx => !fx.hide).length > 0;

            if (show)
                tasks.push({ ...task, id: this.showCardsEffect.name, text, delay:this.delay*2 });

            tasks = tasks.concat(effects.map(effect => { return { ...task, id: this.applyEffect.name, effect }; }));
            tasksDelay = tasks.filter(x => x.effect && x.effect.delay);
            tasks = tasks.filter(x => !x.effect || !x.effect.delay);

            if (tasks.length > 0) this.addTasksFirst(tasks);
            if (tasksDelay.length > 0) this.addTasks(tasksDelay);
        }

        if (task.card1.pair)
            this.applyEffectCard(game, { ...task, card1: task.card1.pair });
    }

    static getEffectText(effect) {
        let result = [effect.id?.toString(), effect.value?.toString(), effect.target?.toString(), effect.effect2?.toString()];
        if (effect.ap)
            result.push('ap ' + effect.ap);

        if (effect.hp)
            result.push('hp ' + effect.ap);

        if (effect.effects)
            result = result.concat(effect.effects.map(x => this.getEffectText(x)).join(', '));

        return result.map(x=> x?.replace("gainEffects", "")).filter(x => x && x.length > 0).join(' ');
    }

    static removeOneTurnEffect(game) {
        game.incruises = game.incruises.filter(x => !x.removeEndTurn);
        const players = [game.player1, game.player2];
        players.forEach(player => {
            player.incruises = player.incruises.filter(x => !x.removeEndTurn);
            player.field.forEach(card => {
                card.incruises = card.incruises.filter(x => !x.removeEndTurn);
                this.recalculateApHp(game, player, card);
            });
        });

        game.cards.filter(x => x.removeEndTurn).forEach(card => {
            const lost = [];
            card.removeEndTurn.forEach(fx => {
                delete card[fx.id];
                lost.push(fx.id);
            })
            card.removeEndTurn = [];
            this.log(`${card.name} lost ${lost.join(', ')}`);
        });
    }

    static applyEffect(game, task, player, opponent) {
        const targetResult = this.handleEffectTarget(game, task, player, opponent);
        if (targetResult.stop || targetResult.end)
            return targetResult;

        if (!this.isEffectMatchConditions(game, task, player, opponent))
            return {};

        if (task.effect.cost) {
            if (player.resourcesAvailable < task.effect.cost) {
                this.log(`Can't play ${task.effect.card.name} because cost can't be played : ${task.effect.cost}`);
                return {};
            }

            this.playCardCost(player, task.effect.cost);
        }

        if (task.effect.oneTurn)
            task.card2.removeEndTurn = !task.card2.removeEndTurn ? [task.effect]
                : task.card2.removeEndTurn.concat([task.effect]);

        task.isConditionsAfterRespected = this.isConditionsAfterRespected(game, task, player, opponent);
        if (task.card2)
            task.card2.fx = task.isConditionsAfterRespected;

        if (task.effect.rest)
            this.setActive(game, task.effect.card, false);

        return this[task.effect.id](game, task, player, opponent);
    }
}


export default effectsLuncher;
