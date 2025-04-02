class effects {

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
