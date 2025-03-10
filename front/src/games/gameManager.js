import gameTask from './gameTask';
import positioner from './positioner';
import global from './global';

class gameManager {

    static createGame(manager, width, height) {
        global.game = {cards:[], tasks:[], popup:[]};
        global.cards = manager.getCards();
        gameTask.addTasks(global.game.tasks, [gameTask.refreshHand(true), gameTask.refreshHand(false)]);
        this.nextTurn();

        global.grid = positioner.createGrid(width, height);
        global.game.grid = global.grid;

        global.game.player1 = {deck:[], shield:[], hand:[], field:[], trash:[], isPlayer1:true};
        global.game.player2 = {deck:[], shield:[], hand:[], field:[], trash:[], isPlayer1:false};

        global.game.player1.positions = positioner.getPositions(global.grid, true);
        global.game.player2.positions = positioner.getPositions(global.grid, false);

        global.game.fields = positioner.createField(global.game.player1.positions, global.game.player2.positions);

        for(let i=0; i<10; i++){
            this.spawn(global.game.player1, this.createCard('GD01-028'), global.locationDeck, global.locationHand, false);
            this.spawn(global.game.player2, this.createCard('GD01-028'), global.locationDeck, global.locationHand, false);
            if(i < 6){
                this.spawn(global.game.player1, this.createCard('GD01-028'), global.locationDeck, global.locationField, false);
                this.spawn(global.game.player2, this.createCard('GD01-028'), global.locationDeck, global.locationField, false);
            }
        }
        
        positioner.refresh(global.game.player1, global.game.player1.hand, global.locationHand);
        positioner.refresh(global.game.player2, global.game.player2.hand, global.locationHand);
        positioner.refresh(global.game.player1, global.game.player1.field, global.locationField);
        positioner.refresh(global.game.player2, global.game.player2.field, global.locationField);

        return global.game;
    }

    static createCard(id){
        const card = global.clone(global.cards.find(x => x.id === id));
        card.index= global.getNextIndex();
        return card;
    }

    static spawn(player, card, locationFrom, locationTo, ignore){
        const from = global.getLocationArrayProperty(locationFrom);
        const to = global.getLocationArrayProperty(locationTo);

        player[from] = global.removeByIndex(player[from], card.index);
        player[to] = global.addIn(player[to], card);

        global.game.cards = global.addIn(global.game.cards, card);
        
        if(!ignore){
            positioner.refresh(player, player[from], locationFrom);
            positioner.refresh(player, player[to], locationTo);
        }
    }

    static nextTurn() {
        //console.log('test');
    }
}


export default gameManager;
