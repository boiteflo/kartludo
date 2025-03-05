/* eslint-disable */
import GameGundamGlobal from '../GameGundamGlobal';

class GameGundamCardCommandPilot {
    static isCardUnit(card) { return card.type.includes(0); }
    static locationHand = 2;

    static isSelectable(world, player, card){        

        if (card.location !== this.locationHand) return false;

        const unitsOnField = player.field.filter(x => this.isCardUnit(x));
        const unitsOnFieldWithoutPilot = unitsOnField.filter(x => !x.pair);
        card.PilotTargetAvailable = unitsOnFieldWithoutPilot.map(x => x.index);
        card.CommandtargetAvailable = unitsOnField.map(x => x.index);

        return !card.targetUnit ? true : card.PilotTargetAvailable.length > 0 || card.CommandtargetAvailable.length > 0;
    }
    static play(world, player, card) {
        GameGundamGlobal.showPopupSelectPilotOrCommand(card);
        return {playCost:false, refreshHand:false, refreshField:false};;
    }

    static activate(world, player, card) {
    }
}


export default GameGundamCardCommandPilot;