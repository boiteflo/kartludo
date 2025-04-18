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
        if (this.quickstart) {
            this.endTurn(game);
            return {};
        }

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
}


export default ai;
