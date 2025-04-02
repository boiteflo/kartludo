class effects {
    // trigger
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

    static lunchEffectTrigger(cards, trigger) {
        const cardsList = cards.filter(x => x.effects && x.effects.find(y => y.trigger === trigger));
        let tasks = [];
        cardsList.forEach(card => {
            tasks.push({
                id: this.applyEffectTrigger.name,
                card1: card,
                trigger: trigger
            });
        });
        this.addTasks(tasks);
        return tasks.length > 0;
    }

    static applyEffectTrigger(game, task) {
        const effects = task.card1.effects.filter(x => x.trigger == task.trigger);
        this.addTasksFirst(effects
            .map(effect => { return { id: this.applyEffect.name, card1: task.card1, effect }; }));
    }

    static applyEffect(game, task) {
        console.log(JSON.stringify(task));
    }
}


export default effects;
