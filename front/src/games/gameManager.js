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
        return game.manager.playCard(game, card1, card2, zone);
    }

    static handleTasks(game) {
        let task = game.tasks.splice(0, 1)[0];
        game.refresh = task ? true : false;
        let i = 0;

        while (task && i < 100) {
            const player = task.isPlayer1 ? game.player1 : game.player2;
            // const opponent = task.isPlayer1 ? game.player2 : game.player1;

            if (task.id === gameTask.taskRefreshField) {
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

            else if (task.id === gameTask.taskShowTitle) {
                game.showTitle = task.value;
            }
            
            else if (task.id === gameTask.taskEndAnimation) {
                this.endAnimation(game);
            }

            else if (task.id === gameTask.taskDeleteCard) {
                global.game.cards = global.removeByIndex(global.game.cards, task.card);
                if (task.removeBase) {
                    global.getPlayer(task.card.isPlayer1).base = [];
                }
                if(task.card.pair){
                    global.game.cards = global.removeByIndex(global.game.cards, task.card.pair);
                    delete(task.card.pair);
                }
            }

            else if (task.id === gameTask.taskCardToMiniCenter) {
                task.card.to = global.grid.centerMini.card1;
                task.card.zindex = 11;
            }

            else if (task.id === gameTask.taskCardToMiniCenter2) {
                if (task.card) {
                    task.card.to = global.grid.centerMini.card2;
                    task.card.zindex = 11;
                }
            }

            else if (task.id === gameTask.taskCardToCenter) {
                task.card.to = global.grid.center;
                task.card.zindex = 11;
            }

            else if (task.id === gameTask.taskCardToTrash) {  
                const cardPlayer = global.getPlayer(task.card.isPlayer1);              
                game.manager.refreshFieldAndHand(cardPlayer);
                task.card.to = global.clone(cardPlayer.positions.trash);
                if(task.card.pair){
                    task.card.pair.to = task.card.to;
                    global.move(cardPlayer, task.card.pair, task.card.pair.location, global.locationTrash, true);
                }
                task.card.hidestat = true;
                task.card.to.height = 0;
            }

            else if (task.id === gameTask.taskAttack) {
                game.manager.attack(task.player, task.opponent, task.attacker, task.target);
            }

            else if (task.id === gameTask.taskTextToMiniCenter2) {
                game.textEffect = {
                    text: task.text,
                    position: global.clone(global.grid.centerMini.card2)
                };
                game.textEffect.to = global.clone(game.textEffect.position);
                game.textEffect.position.height = 0;
            }

            else if (task.id === gameTask.taskTextToTrash) {
                game.textEffect.position.height = global.grid.centerMini.card2.height;
                game.textEffect.to = { ...global.clone(game.textEffect.position), height: 0 };
            }

            else if (task.id === gameTask.taskDeleteText) {
                delete (game.textEffect);
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
