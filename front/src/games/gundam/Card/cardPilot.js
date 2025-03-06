/* eslint-disable */
import global from '../global';

class GameGundamCardPilot {

    static isSelectable(world, player, card) {
        if (card.location !== global.locationHand)
            return false;

        const unitsOnField = player.field.filter(x => global.isCardUnit(x));
        const unitsOnFieldWithoutPilot = unitsOnField.filter(x => !x.pair);
        card.PilotTargetAvailable = unitsOnFieldWithoutPilot.map(x => x.index);

        return card.PilotTargetAvailable.length > 0;
    }

    static play(world, player, card, choiceCard) {
        if (card.PilotTargetAvailable.length > 1 && !choiceCard) {
            global.showPopupSelectCard(card, card.PilotTargetAvailable);
            return {playCost:false, refreshHand:false, refreshField:false};
        } else if(!choiceCard){
            choiceCard = global.getCardsByIndex(card.PilotTargetAvailable)[0];
        }

        card.height = global.size.cardSize.height;
        player.hand = player.hand.filter(x => x.index !== card.index);
        global.pairCards(player, choiceCard, card);
        return {playCost:true, refreshHand:true, refreshField:false};
    }

    static activate(world, player, card) {
    }
}


export default GameGundamCardPilot;