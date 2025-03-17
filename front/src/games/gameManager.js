import gameTask from './gameTask';
import global from './global';
import setup from './setup';

class gameManager {

    static createGame(manager, width, height) {
        setup.createGame(manager, width, height);
        global.game.manager = manager;
        manager.setup(global.game);
        global.delay = manager.getAnimDuration();
        return this.nextTurn(global.game);
    }

    static nextTurn(game) {
        global.isPlayer1 = !global.isPlayer1;
        game.isPlayer1 = global.isPlayer1;
        const playerId = global.isPlayer1 ? '1' : '2';

        gameTask.addTasks(game.tasks, [
            { id: gameTask.taskRefreshField, isPlayer1: true },
            { id: gameTask.taskRefreshField, isPlayer1: false },
            { id: gameTask.taskShowTitle, value: 'New turn for player ' + playerId, isPlayer1: global.isPlayer1, delay: 1200 },
            { id: gameTask.taskDrawToCenter, isPlayer1: global.isPlayer1, delay: global.delay }
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
        game.manager.playCard(global.getPlayerTurn(), card1, card2, zone);
        return game;
    }

    static selectChoiceCard(game, card) {
        game.manager.selectChoiceCard(game, card);
        return game;
    }

    static handleTasks(game) {
        let task = game.tasks[0];// .splice(0, 1)[0];
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
                global.game.cards = global.removeByIndex(global.game.cards, task.card1);
                if (task.removeBase) {
                    global.getPlayer(task.card1.isPlayer1).base = [];
                }
                if (task.card1.pair) {
                    global.game.cards = global.removeByIndex(global.game.cards, task.card1.pair);
                    delete (task.card1.pair);
                }
            }

            else if (task.id === gameTask.taskCardToMiniCenter) {
                task.card1.to = global.grid.centerMini.card1;
                task.card1.zindex = 11;
            }

            else if (task.id === gameTask.taskCardToMiniCenter2) {
                if (task.card1) {
                    task.card1.to = global.clone(global.grid.centerMini.card2);
                    task.card1.zindex = 11;
                }
            }

            else if (task.id === gameTask.taskCardToCenter) {
                task.card1.to = global.grid.center;
                task.card1.zindex = 11;
            }

            else if (task.id === gameTask.taskCardToTrash) {
                const cardPlayer = global.getPlayer(task.card1.isPlayer1);
                game.manager.refreshFieldAndHand(cardPlayer);
                if (task.card1.location !== global.locationTrash)
                    global.move(cardPlayer, task.card1, task.card1.location, global.locationTrash, true);
                task.card1.to = global.clone(cardPlayer.positions.trash);
                if (task.card1.pair) {
                    task.card1.pair.to = task.card1.to;
                    global.move(cardPlayer, task.card1.pair, task.card1.pair.location, global.locationTrash, true);
                }
                task.card1.hidestat = true;
                task.card1.to.height = 0;
            }

            else if (task.id === gameTask.taskAttack) {
                game.manager.attack(task.player, task.opponent, task.attacker, task.target, task.zone);
            }

            else if (task.id === gameTask.taskTextToMiniCenter2) {
                game.textEffect = {
                    text: task.text,
                    position: global.clone(global.grid.centerMini.text)
                };
                game.textEffect.to = global.clone(game.textEffect.position);
                game.textEffect.position.height = 0;
            }

            else if (task.id === gameTask.taskTextToTrash) {
                if (game.textEffect) {
                    game.textEffect.position.height = global.grid.centerMini.text.height;
                    game.textEffect.to = { ...global.clone(game.textEffect.position), height: 0 };
                    game.refreshOnlyTextEffect = true;
                }
            }

            else if (task.id === gameTask.taskDeleteText) {
                game.refreshOnlyTextEffect = false;
                delete (game.textEffect);
            }

            else if (task.id === gameTask.taskSelectCards) {
                if (!game.cardChoice) {
                    game.popup = task;
                    return game;
                }
            }

            else if (task.id === gameTask.taskCardToHand) {
                global.spawn(player, task.card1, task.card1.location, global.locationHand);
            }

            else if (task.id === gameTask.taskPlayCard) {
                const cardPlayer = global.getPlayer(task.card1.isPlayer1);
                const result = game.manager.playCard(cardPlayer, task.card1, task.card2, task.zone);
                if (result && result.stop)
                    return game;
            }

            else if (task.id === gameTask.taskPlayCardWithEffect) {
                const cardPlayer = global.getPlayer(task.card1.isPlayer1);
                const result = game.manager.playCard(cardPlayer, task.card1, task.card2, task.zone, true);
                if (result && result.stop)
                    return game;
            }

            else if(task.id === gameTask.taskPairCard) {
                const cardPlayer = global.getPlayer(task.card1.isPlayer1);
                game.manager.pair(cardPlayer, task.card1, task.card2);
            }

            else if(task.id === gameTask.taskPairCardWithEffect) {
                const cardPlayer = global.getPlayer(task.card1.isPlayer1);
                game.manager.pair(cardPlayer, task.card1, task.card2, true);
            }

            else if(task.id === gameTask.taskMove){                
                global.spawnOrMove(player, task.card1, task.card1.location, global.locationHand);
            }

            if (task.delay) {
                game.wait = task.delay;
                task = game.tasks.splice(0, 1)[0];
                return game;
            }

            task = game.tasks.splice(0, 1)[0];
            task = game.tasks[0];
            i++;
        }

        return game;
    }
}


export default gameManager;
