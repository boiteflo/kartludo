import global from './global';

/* eslint-disable no-unused-vars */
class gameTask {
    static addTasks(tasks) {
        global.needTaskEndRefresh = true;
        global.game.tasks = global.game.tasks.concat(tasks);
    }

    static addTasksFirst(tasks) {
        global.game.tasks = tasks.concat(global.game.tasks);
        return { stop: true };
    }

    static handleTasks(game) {
        if (game.end) {
            game.tasks = [];
            return game;
        }

        let task = game.tasks[0];
        game.refresh = task ? true : false;
        let i = 0;

        while (task && i < 100) {
            const isPlayer1 = task.isPlayer1 ? task.isPlayer1 : task.card1 && task.card1.isPlayer1 ? task.card1.isPlayer1 : task.isPlayer1;
            const player = isPlayer1 ? game.player1 : game.player2;

            let tasksString = game.tasks.map(x => x.id).join(', ');
            const result = this[task.id](game, task, player);
            tasksString = game.tasks.map(x => x.id).join(', ');

            if (result && result.stop)
                return game;

            if (task.delay) {
                game.wait = task.delay === true ? global.delay : task.delay;
                task = game.tasks.splice(0, 1)[0];
                return game;
            }

            task = game.tasks.splice(0, 1)[0];
            task = game.tasks[0];
            i++;
        }

        if (global.needTaskEndRefresh)
            this.taskEndRefresh(game);

        return game;
    }

    static taskEndRefresh(game) {
        game.manager.endRefresh();
        global.needTaskEndRefresh = false;
        global.cardHighlight = [];
        game.refreshOnlyTextEffect = false;
        delete (game.textEffect);
        game.manager.refreshFieldAndHand(game.player1);
        game.manager.refreshFieldAndHand(game.player2);
        game.refresh = true;
        game.taskAttack = null;
    }

    /* ----------------------------- Tasks  */

    static taskRefreshField(game, task, player) {
        game.manager.refreshFieldAndHand(player);
        this.taskTextHide(game, task, player);
    }

    static taskTitleShow(game, task, player) {
        game.showTitle = task.value;
    }

    static taskTextShow(game, task, player) {
        game.textEffect = {
            text: task.text,
            position: global.clone(global.grid.centerMini.text)
        };
        game.textEffect.to = global.clone(game.textEffect.position);
        game.textEffect.position.height = 0;
    }

    static taskTextHide(game, task, player) {
        game.refreshOnlyTextEffect = false;
        if (!game.textEffect)
            return;

        game.textEffect.position.height = global.grid.centerMini.text.height;
        game.textEffect.to = { ...global.clone(game.textEffect.position), height: 0 };
        game.refreshOnlyTextEffect = true;
    }

    static taskMove(game, task, player) {
        global.spawnOrMove(player, task.card1, task.from, task.to);
    }

    static taskAttackPlayerAnimation(game, task, player) {
        const opponent = global.getPlayer(!player.isPlayer1);
        const heartPosition = opponent.isPlayer1 ? global.grid.player1Heart : global.grid.player2Heart;
        task.card1.to = { ...task.card1.position, x: heartPosition.x, y: heartPosition.y };
    }

    static taskMoveAndShowCenter(game, task, player) {
        const card = global.spawnOrMove(player, task.card1, task.from, task.to);
        const taskCenter = { id: this.taskCardToCenter.name, card1: card, isPlayer1: task.isPlayer1, delay: true };
        global.game.tasks = global.addListInArrayAfterIndex(global.game.tasks, 1, [taskCenter]);
    }

    static taskCardsToMiniCenter(game, task, player) {
        if (!task.card1)
            return;

        global.spawnIfNot(task.card1);
        global.cardHighlight.push(task.card1);
        const destination = task.card2 ? global.grid.centerMini.card1 : global.grid.centerMini.card3;
        task.card1.to = global.clone(destination);
        task.card1.to.rotation = 0;
        task.card1.zindex = 11;

        if (task.card2) {
            global.spawnIfNot(task.card2);
            global.cardHighlight.push(task.card2);
            task.card2.to = global.clone(global.grid.centerMini.card2);
            task.card2.to.rotation = 0;
            task.card2.zindex = 11;
        }

        if (task.text) {
            this.taskTextShow(game, task, player);
        }
    }

    static taskCardToCenter(game, task, player) {
        if (!task.card1)
            return;

        global.spawnIfNot(task.card1);
        global.cardHighlight.push(task.card1);
        task.card1.to = global.clone(global.grid.center);
        task.card1.to.rotation = 0;
        task.card1.zindex = 11;
    }

    static taskAttack(game, task, player) {
        return game.manager.attack(task);
    }

    static taskPopup(game, task, player) {
        if (!game.cardChoice && !game.choice) {
            game.popup = task;
            return { stop: true };
        }
    }

    static taskPlayCard(game, task, player) {
        const cardPlayer = global.getPlayer(task.card1.isPlayer1);
        return game.manager.playCard(cardPlayer, task.card1, task.card2, task.zone, task.regularPlay);
    }

    static taskPairCard(game, task, player) {
        const cardPlayer = global.getPlayer(task.card1.isPlayer1);
        return game.manager.pair(cardPlayer, task.card1, task.card2);
    }

    static taskApplyEffect(game, task, player) {
        return game.manager.applyEffect(player, task.card1, task.card2, task.trigger);
    }
}


export default gameTask;
