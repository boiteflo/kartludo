import gameTask from './gameTask';
import global from './global';
import setup from './setup';

class gameManager {

    static createGame(manager, width, height, decklistPlayer1, decklistPlayer2) {
        setup.createGame(manager, width, height, decklistPlayer1, decklistPlayer2);
        global.game.manager = manager;
        global.delay = manager.getAnimDuration();
        manager.setup(global.game);
        return this.nextTurn(global.game);
    }

    static nextTurn(game) {
        global.isPlayer1 = !global.isPlayer1;
        game.isPlayer1 = global.isPlayer1;
        const playerId = global.isPlayer1 ? '1' : '2';

        gameTask.addTasks(game.tasks, [
            { id: gameTask.taskTitleShow.name, value: 'New turn for player ' + playerId, isPlayer1: global.isPlayer1, delay: 1200 },
            { id: gameTask.taskMoveAndShowCenter.name, isPlayer1: global.isPlayer1, from: global.locationDeck, to: global.locationHand }
        ]);

        game.manager.nextTurn();

        return gameTask.handleTasks(game);
    }

    static continue(game) {
        this.endAnimation(game);
        return gameTask.handleTasks(game);
    }

    static endAnimation(game) {
        game.cards.forEach(card => {
            if (card.positionDrag) card.position = { ...card.position, x: card.positionDrag.x, y: card.positionDrag.y };
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
        global.needTaskEndRefresh=true;
        gameTask.addTasks(game.tasks, [{id:gameTask.taskPlayCard.name,card1, card2, zone, regularPlay:true}]);
        return game;
    }

    static selectChoiceCard(game, card) {
        game.manager.selectChoiceCard(game, card);
        return game;
    }

    static selectChoice(game, choice){
        game.manager.selectChoice(game, choice);
        return game;
    }
}


export default gameManager;
