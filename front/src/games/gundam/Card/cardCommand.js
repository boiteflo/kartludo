/* eslint-disable */
import global from '../global';
import effects from '../effects';

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
        if (card.CommandTargetAvailable) {
            if (card.CommandTargetAvailable.length > 1 && !choiceCard) {
                global.showPopupSelectCard(card, card.CommandTargetAvailable);
                return { playCost: false, refreshHand: false, refreshField: false };
            } else
                choiceCard = global.getCardsByIndex(card.CommandTargetAvailable)[0];
        }

        card.height = global.size.cardSize.height;
        player.hand = player.hand.filter(x => x.index !== card.index);
        card.to = global.size.center;
        card.explode = true;
        
        effects.apply(effects.command, player, card, choiceCard);

        return { playCost: true, refreshHand: true, refreshField: false };
    }

    static activate(world, player, card) {
    }
}


export default GameGundamCardCommand;