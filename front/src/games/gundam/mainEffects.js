/* eslint-disable no-unused-vars */

class mainEffects {
    static handleMainEffectsCard(game, card, active) {
        if (!card.mainEffect)
            return;

        if (active)
            game.effects = game.effects.concat(card.effects.filter(fx => fx.trigger === this.trigger_main).map(fx => { return { ...fx, card, index: card.index }; }))
        else
            game.effects = game.effects.filter(x => x.index !== card.index);
    }

    static lunchMainEffectCard(game, task) {
        if (!task) {
            this.addTaskFirst({ id: this.lunchMainEffectCard.name });
            return game;
        }

        if (task.choice)
            return {};

        if (!task.cardChoice) {
            this.addTaskFirst({
                id: this.popup.name,
                text: `Select a main effect.`,
                cards: game.effects.map(x => x.card),
                task, isPlayer1: true,
                choices: [{ text: 'cancel' }]
            });
            return { stop: true };
        }


        return this.lunchEffectTriggerForOneCard(task.cardChoice, this.trigger_main);
    }
}


export default mainEffects;
