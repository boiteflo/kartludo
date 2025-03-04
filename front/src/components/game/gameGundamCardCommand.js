/* eslint-disable */
import GameGundamGlobal from './GameGundamGlobal';

class GameGundamCardCommand {
    static isCardUnit(card) { return card.type.includes(0); }
    static locationHand = 2;

    static isSelectable(world, player, card) {

        if (card.location !== this.locationHand) return false;

        const unitsOnField = player.field.filter(x => this.isCardUnit(x));
        card.CommandtargetAvailable = unitsOnField.map(x => x.index);

        return !card.targetUnit ? true : card.CommandtargetAvailable.length > 0;
    }

    static play(world, player, card, choiceCard) {
        if (card.CommandTargetAvailable.length > 1 && !choiceCard) {
            GameGundamGlobal.showPopupSelectCard(card, card.CommandTargetAvailable);
            return GameGundamGlobal.world;
        } else
            choiceCard = GameGundamGlobal.getCardsByIndex(card.CommandTargetAvailable)[0];

        card.height = GameGundamGlobal.size.cardSize.height;
        player.hand = player.hand.filter(x => x.index !== card.index);
        card.to = GameGundamGlobal.size.center;
        card.explode = true;
    }

    static activate(world, player, card) {
    }
}


export default GameGundamCardCommand;