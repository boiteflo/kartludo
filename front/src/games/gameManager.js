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
            { id: gameTask.taskShowTitle, value: 'New turn for player ' + playerId, isPlayer1: global.isPlayer1, delay: 1200 },
            { id: gameTask.taskDrawToCenter, isPlayer1: global.isPlayer1, delay: 500 },
            { id: gameTask.taskDrawToCenter, isPlayer1: global.isPlayer1, delay: 500 }
        ]);

        game.manager.nextTurn();

        return this.handleTasks(game);
    }

    static continue(game) {
        this.endAnimation(game);
        return this.handleTasks(game);
    }

    static endAnimation(game) {
        game.cards.forEach(card => {
            if (card.positionDrag) card.position = {...card.position, x:card.positionDrag.x, y:card.positionDrag.y};
            if (card.to) card.position = card.to;
            delete (card.to);
            delete (card.positionOld);
            delete (card.positionDrag);
        });
        delete (game.wait);
        delete (game.showTitle);
        game.refresh = true;
    }

    static playCard(game, card1, card2, zone) {
        return game.manager.playCard(game, card1, card2, zone);
    }

    static handleTasks(game) {
        let task = game.tasks.splice(0, 1)[0];
        game.refresh = task ? true : false;
        let i = 0;

        while (task && i < 100) {
            const player = task.isPlayer1 ? game.player1 : game.player2;
            const opponent = task.isPlayer1 ? game.player2 : game.player1;

            if (task.id === gameTask.taskRefreshField){
                // this.endAnimation(game);
                game.manager.refreshFieldAndHand(player);
            }

            else if (task.id === gameTask.taskDrawToCenter) {
                const card = global.spawn(player, null, global.locationDeck, global.locationHand);
                card.to = global.grid.center;
                global.game.lastCard = card;
            }

            else if (task.id === gameTask.taskDrawToHand) {
                game.manager.refreshFieldAndHand(player);
            }

            else if (task.id === gameTask.taskShowTitle)
                game.showTitle = task.value;

            else if(task.id === gameTask.taskEndAnimation)
                this.endAnimation(game);

            else if(task.id === gameTask.taskDeleteCard){
                global.game.cards = global.removeByIndex(global.game.cards, task.card);
                if(task.removeBase){
                    global.getPlayer(task.card.isPlayer1).base=[];
                }
            }

            else if(task.id === gameTask.taskCardToCenter){
                task.card.to = global.grid.center;
                task.card.zindex=11;
            }

            else if(task.id === gameTask.taskCardToTrash){
                game.manager.refreshFieldAndHand(player);
                game.manager.refreshFieldAndHand(opponent);
                task.card.to = global.clone(global.getPlayer(task.card.isPlayer1).positions.trash);
                task.card.hidestat=true;
                task.card.to.height=0;
            }

            if (task.delay) {
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
