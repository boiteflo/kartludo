import cards from '../../data/gundamCards.json';
import global from '../global';
import positioner from '../positioner';

class manager {
    static getCards(){return cards.cards;}
    static getDeckLenth(){return 50;}
    static getHandStartLength(){return 5;}

    static setup(game){
        this.createDefaultBase(game.player1);
        this.createDefaultBase(game.player2);
        
        for(let i=0; i <6; i++){
            global.spawnNotShown(game.player1, null, global.locationDeck, global.locationShield);
            global.spawnNotShown(game.player2, null, global.locationDeck, global.locationShield);
        }
    }

    static createDefaultBase(player) {
        const card = global.createCard("EXBP-001");
        global.spawn(player, card, global.locationBase, global.locationBase);
        return card;
    }

    static refreshFieldAndHand(player) {
        positioner.refresh(player.hand, player.positions.hand);
        positioner.refresh(player.field,player.positions.field);
        positioner.refresh(player.base, player.positions.base, true);

        player.positions.deck.text = player.deck.length;
        player.positions.shield.text = player.shield.length;
        player.positions.trash.text = player.trash.length;
        player.positions.resource.text = '1/1';
    }
}


export default manager;
