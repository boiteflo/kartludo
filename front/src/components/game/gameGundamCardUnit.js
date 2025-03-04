/* eslint-disable */
import GameGundamGlobal from './GameGundamGlobal';

class GameGundamCardUnit {

    static isSelectable(world, player, card){        
        return true;
    }
    
    static play(world, player, card, choiceType, choiceCard) {
        player.hand = player.hand.filter(x => x.index !== card.index);
        player.field.push(card);
        card.location = GameGundamGlobal.locationField;
        card.height = GameGundamGlobal.size.cardSize.height;
        card.selectable = false;
        return true;
    }

    static activate(world, player, card) {
    }
}


export default GameGundamCardUnit;