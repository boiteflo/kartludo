/* eslint-disable */
import global from '../global';

class cardCommandPilot {

    static isSelectable(player, card){        

        if (card.location !== global.locationHand) return false;

        const unitsOnField = player.field.filter(x => global.isCardUnit(x));
        const unitsOnFieldWithoutPilot = unitsOnField.filter(x => !x.pair);
        card.PilotTargetAvailable = unitsOnFieldWithoutPilot.map(x => x.index);
        card.CommandtargetAvailable = unitsOnField.map(x => x.index);

        return !card.targetUnit ? true : card.PilotTargetAvailable.length > 0 || card.CommandtargetAvailable.length > 0;
    }
    static play(player, card) {
        global.showPopupSelectPilotOrCommand(card);
        return {playCost:false, refreshHand:false, refreshField:false};;
    }
}


export default cardCommandPilot;