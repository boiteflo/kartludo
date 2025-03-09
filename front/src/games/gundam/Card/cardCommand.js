/* eslint-disable */
import global from '../global';
import effects from '../effects';

class GameGundamCardCommand {
    static isSelectable(player, card) {

        if (card.location !== global.locationHand) return false;

        const unitsOnField = player.field.filter(x => global.isCardUnit(x));
        card.CommandtargetAvailable = unitsOnField.map(x => x.index);

        return !card.targetUnit ? true : card.CommandtargetAvailable.length > 0;
    }

    static play(player, card, choiceCard) {
        if (card.CommandTargetAvailable) {
            if (card.CommandTargetAvailable.length > 1 && !choiceCard) {
                global.showPopupSelectCard(card, card.CommandTargetAvailable);
                return { stop:true, playCost: false, refreshHand: false, refreshField: false };
            } else
                choiceCard = global.getCardsByIndex(card.CommandTargetAvailable)[0];
        }

        const effectResult= effects.apply(effects.command, player, card, choiceCard);
        if(effectResult.stop)
            return {stop:true};

        card.height = global.size.cardSize.height;
        player.hand = player.hand.filter(x => x.index !== card.index);
        card.to = global.size.center;
        card.explode = true;
        

        return { playCost: true, refreshHand: true, refreshField: false };
    }
}


export default GameGundamCardCommand;