class cardAction {    
    static noActionCard = 'no action card';

    static askForActionCards(game, task, player, opponent) {
        let result = this.askForActionCardsForThisPlayer(game, task, 'actionCardOpponent', opponent);
        if(result.stop)
            return result;

        return this.askForActionCardsForThisPlayer(game, task, 'actionCardPlayer', player);
    }

    static askForActionCardsForThisPlayer(game, task, property, player) {        
        if (task[property]) 
            return {};

        if (task.choice && task.choice.text === this.noActionCard){
            task[property] = task.choice;
            task.choice = null;
            task.cardChoice = null;
            return {};
        }

        if (task.cardChoice) {
            this.playCardCost(player, task.cardChoice.cost);
            this.addTasksFirst([
                { id: this.applyEffectCard.name, card1: task.cardChoice, trigger: this.trigger_action, taskAttack:task },
                { id: this.move.name, card1: task.cardChoice, to: this.locationTrash }
            ]);
            task[property] = task.cardChoice;
            task.choice = null;
            task.cardChoice = null;
            return { stop: true };
        }
        
        const actionCard = player.hand.filter(x => x.effects && x.effects.find(fx => fx.trigger === this.trigger_action) && x.cost <= player.resourcesAvailable);
        if (actionCard.length > 0) {
            const playerIndex = player.isPlayer1 ? '1' : '2';
            game.tasks = [{
                id: this.popup.name,
                text: `Select an action card for player ${playerIndex} ?`,
                cards: actionCard,
                task,  isPlayer1:player.isPlayer1,
                choices: [{ text: this.noActionCard }]
            }].concat(game.tasks);
            return { stop: true };
        }
        
        task[property] = { text: this.noActionCard };
        return {};
    }
}


export default cardAction;
