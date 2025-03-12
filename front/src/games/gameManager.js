import gameTask from './gameTask';
import global from './global';
import setup from './setup';

class gameManager {

    static createGame(manager, width, height) {
        setup.createGame(manager, width, height);
        global.game.manager = manager;
        manager.setup(global.game);
        return this.nextTurn(global.game);
    }

    static nextTurn(game) {
        global.isPlayer1 = !global.isPlayer1;
        game.isPlayer1 = global.isPlayer1;
        const playerId = global.isPlayer1 ? '1' : '2';     

        gameTask.addTasks(game.tasks, [
            { id: gameTask.taskShowTitle, value: 'New turn for player ' + playerId, isPlayer1: global.isPlayer1, delay:1200 },
            { id: gameTask.taskDrawToCenter, isPlayer1: global.isPlayer1, delay:500},
            { id: gameTask.taskDrawToCenter, isPlayer1: global.isPlayer1, delay:500}
        ]);

        return this.handleTasks(game);
    }

    static handleTasks(game) {
        let task = game.tasks.splice(0, 1)[0];
        game.refresh= task ? true : false;
        let i =0;
        
        while (task && i < 100) {
            const player = task.isPlayer1 ? game.player1 : game.player2;

            if (task.id === gameTask.taskRefreshField)
                game.manager.refreshFieldAndHand(player);

            else if (task.id === gameTask.taskDrawToCenter){
                const card = global.spawn(player, null, global.locationDeck, global.locationHand);
                card.to = global.grid.center;
                global.game.lastCard = card;
            }

            else if (task.id === gameTask.taskDrawToHand){
                game.manager.refreshFieldAndHand(player);
            }

            else if (task.id === gameTask.taskShowTitle)
                game.showTitle = task.value;

            if(task.delay){
                game.wait = task.delay;
                return game;
            }

            task = game.tasks.splice(0, 1)[0];
            i++;
        }
        
        return game;
    }
}


export default gameManager;
