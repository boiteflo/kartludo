/* eslint-disable */
import GameGundamGlobal from '../GameGundamGlobal';

class GameGundamCardBase {

    static isSelectable(world, player, card) {
        return true;
    }
    static play(world, player, card) {
        card.height = GameGundamGlobal.size.cardSize.height;
        player.hand = player.hand.filter(x => x.index !== card.index);
        card.to = player.position.base;
        if (player.base)
            GameGundamGlobal.sendToGrave(player, player.base);
        player.base = card;
        card.selectable=false;
        return {playCost:true, refreshHand:true, refreshField:false};
    }

    static activate(world, player, card) {
    }
}


export default GameGundamCardBase;