/* eslint-disable */
import global from '../global';

class GameGundamCardUnit {

    static isSelectable(world, player, card){        
        return true;
    }
    
    static play(world, player, card, choiceType, choiceCard) {
        player.hand = player.hand.filter(x => x.index !== card.index);
        player.field.push(card);
        card.location = global.locationField;
        card.height = global.size.cardSize.height;
        card.selectable = false;
        card.active = true;
        return {playCost:true, refreshHand:true, refreshField:true};
    }

    static activate(world, player, card) {
    }
}


export default GameGundamCardUnit;