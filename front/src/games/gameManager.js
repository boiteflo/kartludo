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

        const player = global.isPlayer1 ? game.player1 : game.player2;
        const card = player.deck[0];
        const delay = global.delay;
        gameTask.addTasks(game.tasks, [
            { id: gameTask.taskRefreshField, isPlayer1: true },
            { id: gameTask.taskRefreshField, isPlayer1: false },
            { id: gameTask.taskTitleShow, value: 'New turn for player ' + playerId, isPlayer1: global.isPlayer1, delay: 1200 },
            { id: gameTask.taskMove, isPlayer1: global.isPlayer1, card1: card, from: global.locationDeck, to: global.locationHand, ignoreRefresh: true },
            { id: gameTask.taskCardToCenter, isPlayer1: global.isPlayer1, card1: card, delay },
            { id: gameTask.taskRefreshField, isPlayer1: global.isPlayer1, delay }
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
        gameTask.addTasks(game.tasks, [{id:gameTask.taskPlayCard,card1, card2, zone}]);
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

    static handleTasks(game) {
        let task = game.tasks[0];// .splice(0, 1)[0];
        game.refresh = task ? true : false;
        let i = 0;

        while (task && i < 100) {
            const player = task.isPlayer1 ? game.player1 : game.player2;

            if (task.id === gameTask.taskRefreshField) {
                game.manager.refreshFieldAndHand(player);
            }

            else if (task.id === gameTask.taskTitleShow) {
                game.showTitle = task.value;
            }

            else if (task.id === gameTask.taskTextShow) {
                game.textEffect = {
                    text: task.text,
                    position: global.clone(global.grid.centerMini.text)
                };
                game.textEffect.to = global.clone(game.textEffect.position);
                game.textEffect.position.height = 0;
            }

            else if (task.id === gameTask.taskTextHide) {
                if (game.textEffect) {
                    game.textEffect.position.height = global.grid.centerMini.text.height;
                    game.textEffect.to = { ...global.clone(game.textEffect.position), height: 0 };
                    game.refreshOnlyTextEffect = true;
                }
            }

            else if (task.id === gameTask.taskTextDelete) {
                game.refreshOnlyTextEffect = false;
                delete (game.textEffect);
            }

            else if (task.id === gameTask.taskMove) {
                global.spawnOrMove(player, task.card1, task.from, task.to, task.ignoreRefresh);
            }

            else if (task.id === gameTask.taskCardToMiniCenter) {
                if (task.card1) {
                    global.spawnIfNot(task.card1);
                    global.cardHighlight.push(task.card1);
                    task.card1.to = global.clone(global.grid.centerMini.card1);
                    task.card1.to.rotation = 0;
                    task.card1.zindex = 11;
                }
            }

            else if (task.id === gameTask.taskCardToMiniCenter2) {
                if (task.card1) {
                    global.spawnIfNot(task.card1);
                    global.cardHighlight.push(task.card1);
                    task.card1.to = global.clone(global.grid.centerMini.card2);
                    task.card1.to.rotation = 0;
                    task.card1.zindex = 11;
                }
            }

            else if (task.id === gameTask.taskCardToCenter) {
                if (task.card1) {
                    global.spawnIfNot(task.card1);
                    global.cardHighlight.push(task.card1);
                    task.card1.to = global.clone(global.grid.center);
                    task.card1.to.rotation = 0;
                    task.card1.zindex = 11;
                }
            }

            else if (task.id === gameTask.taskAttack) {
                const result =game.manager.attack(task.player, task.opponent, task.attacker, task.target, task.zone, task.breach);
                if(result && result.stop)
                    return game;
            }

            else if (task.id === gameTask.taskPopup) {
                if (!game.cardChoice && !game.choice) {
                    game.popup = task;
                    return game;
                }
            }

            else if (task.id === gameTask.taskPlayCard) {
                const cardPlayer = global.getPlayer(task.card1.isPlayer1);
                const result = game.manager.playCard(cardPlayer, task.card1, task.card2, task.zone);
                if (result && result.stop && !result.destroy)
                    return game;
            }

            else if (task.id === gameTask.taskPairCard) {
                const cardPlayer = global.getPlayer(task.card1.isPlayer1);
                const result = game.manager.pair(cardPlayer, task.card1, task.card2);
                if (result && result.stop && !result.destroy)
                    return game;
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
