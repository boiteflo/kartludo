import gameTask from '../gameTask';
import global from '../global';

class cardAction {
    static noActionCard = 'no action card';

    static askForActionCards(player, opponent) {
        if (!global.game.actionOpponent) {
            if (global.game.choice && global.game.choice.text === this.noActionCard)
                global.game.actionOpponent = global.game.choice;
            else if (global.game.cardChoice) {
                global.game.choice = { text: 'Command' };
                global.game.tasks = [{ id: gameTask.taskPlayCard.name, card1: global.game.cardChoice, zone: opponent.positions.field }]
                    .concat(global.game.tasks);
                global.deletePopup();
                return { stop: true };
            }
            else {
                const result = this.askForActionCardsForThisPlayer(opponent);
                if (result && result.stop)
                    return result;
                global.game.actionOpponent = { text: this.noActionCard };
            }
        }

        if (!global.game.actionPlayer) {
            if (global.game.choice && global.game.choice.text === this.noActionCard)
                global.game.actionPlayer = global.game.choice;
            else if (global.game.cardChoice) {
                global.game.choice = { text: 'Command' };
                global.game.tasks = [{ id: gameTask.taskPlayCard.name, card1: global.game.cardChoice, zone: player.positions.field }]
                    .concat(global.game.tasks);
                global.deletePopup();
                return { stop: true };
            }
            else {
                const result = this.askForActionCardsForThisPlayer(player);
                if (result && result.stop)
                    return result;
                global.game.actionPlayer = { text: this.noActionCard };
            }
        }

        return {};
    }

    static askForActionCardsForThisPlayer(player) {
        const actionCard = player.hand.filter(x => x.effect && x.effect.find(fx => fx.trigger === 'action'));
        if (actionCard.length > 0) {
            global.game.tasks = [{
                id: gameTask.taskPopup.name,
                text: 'Select an action card ?',
                cards: actionCard,
                choices: [{ text: this.noActionCard }]
            }].concat(global.game.tasks);
            return { stop: true };
        }

    }

    static removeOneTurnEffect(cards) {
        cards.filter(x => x.removeEndTurn).forEach(card => {
            const lost = [];
            card.removeEndTurn.forEach(fx => {
                delete card[fx.effect];
                lost.push(fx.effect);
            })
            global.log(`${card.name} lost ${lost.join(', ')}`);
        });
    }
}

export default cardAction;