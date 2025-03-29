import global from '../global';
import cardPlay from './cardPlay';
import cardAttack from './cardAttack';

class cardHandler {
    static nextTurn(player) {
        global.game.cards.forEach(card => card.selectable = false);

        player.field.forEach(x => {
            x.active = true;
            x.canAttack = true;
        });
    }

    static setSelectable(player) {
        player.hand.forEach(card => {
            const resourcesMax = Math.max(player.resourcesMax, player.resourcesAvailable);
            const isCostAvailable = card.level <= resourcesMax && card.cost <= player.resourcesAvailable;
            const isTurnPlayer = global.isPlayer1 === card.isPlayer1;

            card.selectable = isCostAvailable && isTurnPlayer;
            if (global.isCardUnit(card) && player.field.length > 5)
                card.selectable = false;
        });

        player.field.forEach(card => {
            card.selectable = card.canAttack;
        });
    }

    static play(player, card1, card2, zone, regularPlay) {
        const noDropZone = !card2 && !zone;
        let result = {};
        if (noDropZone)
            result.sendBack = true;

        else if (card1.location === global.locationHand)
            result = cardPlay.playFromHand(player, card1, card2, zone, regularPlay);
        else if (card1.location === global.locationField)
            result = this.prepareAttack(player, card1, card2, zone);
        else
            result = cardPlay.playCard(player, card1, card2, zone, false);

        if (result && result.sendBack)
            cardPlay.sendCardBackToSquareOne(card1);

        return result;
    }

    static prepareAttack(player, card1, card2, zone, breach) {
        const isSamePlayer = zone.isPlayer1 == player.isPlayer1;
        if (isSamePlayer || !card1.canAttack) {
            return { sendBack: true };
        }
        
        const opponent = global.getPlayer(!player.isPlayer1);
        cardAttack.createAttackTask(player, opponent, card1, card2, zone, breach);
    }

    static attack(task) {
        return cardAttack.attack(task);
    }

    static selectChoiceCard(game, card) {
        game.cardChoice = card;
    }

    static selectChoice(game, choice) {
        game.choice = choice;
    }
}


export default cardHandler;
