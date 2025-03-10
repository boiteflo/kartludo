/* eslint-disable */
import global from '../global';

class GameGundamCardBase {

    static isSelectable(player, card) {
        return true;
    }
    
    static play(player, card) {
        card.height = global.size.cardSize.height;
        player.hand = player.hand.filter(x => x.index !== card.index);
        card.to = player.position.base;
        if (player.base)
            global.sendToGrave(player, player.base);
        player.base = card;
        card.selectable=false;
        return {playCost:true, refreshHand:true, refreshField:false};
    }
}


export default GameGundamCardBase;