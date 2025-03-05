/* eslint-disable */
import GameGundamGlobal from '../GameGundamGlobal';

class GameGundamCardPilot {

    static isSelectable(world, player, card) {
        if (card.location !== GameGundamGlobal.locationHand)
            return false;

        const unitsOnField = player.field.filter(x => GameGundamGlobal.isCardUnit(x));
        const unitsOnFieldWithoutPilot = unitsOnField.filter(x => !x.pair);
        card.PilotTargetAvailable = unitsOnFieldWithoutPilot.map(x => x.index);

        return card.PilotTargetAvailable.length > 0;
    }

    static play(world, player, card, choiceCard) {
        if (card.PilotTargetAvailable.length > 1 && !choiceCard) {
            GameGundamGlobal.showPopupSelectCard(card, card.PilotTargetAvailable);
            return {playCost:false, refreshHand:false, refreshField:false};
        } else if(!choiceCard){
            choiceCard = GameGundamGlobal.getCardsByIndex(card.PilotTargetAvailable)[0];
        }

        card.height = GameGundamGlobal.size.cardSize.height;
        player.hand = player.hand.filter(x => x.index !== card.index);
        GameGundamGlobal.pairCards(player, choiceCard, card);
        return {playCost:true, refreshHand:true, refreshField:false};
    }

    static activate(world, player, card) {
    }
}


export default GameGundamCardPilot;