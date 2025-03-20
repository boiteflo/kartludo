import global from './global';

/* eslint-disable no-unused-vars */
class gameTask {
    static addTasks(list, tasks) {
        global.needTaskEndRefresh = true;
        tasks.forEach(task => list.push(task));
    }

    static alreadyInclude(list, task) {
        return list.find(x => this.isEqual(x, task));
    }

    static isEqual(task1, task2) {
        const result = task1.id === task2.id
            && task1.isPlayer1 === task2.isPlayer1
            && task1.value === task2.value;
        if (result === false) return false;
        if (task1.card && !task2.card) return false;
        else if (!task1.card && task2.card) return false;
        else if (task1.card && task2.card && task1.card.index === task2.card.index) return false;
        return result;
    }

    static removeDelay(list, taskid) {
        const task = [...list].reverse().find(t => t.id === taskid && t.delay);
        if (task)
            delete (task.delay);
    }

    static handleTasks(game) {
        let task = game.tasks[0];
        game.refresh = task ? true : false;
        let i = 0;

        while (task && i < 100) {
            const isPlayer1 = task.isPlayer1 ? task.isPlayer1 : task.card1 && task.card1.isPlayer1 ? task.card1.isPlayer1 : task.isPlayer1;
            const player = isPlayer1 ? game.player1 : game.player2;

            const result = this[task.id](game, task, player);
            if (result && result.stop)
                return game;

            if (task.delay) {
                game.wait = task.delay;
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
        global.needTaskEndRefresh = false;
        global.cardHighlight = [];
        game.manager.refreshFieldAndHand(game.player1);
        game.manager.refreshFieldAndHand(game.player2);
        game.refresh = true;
    }

    static taskRefreshField(game, task, player) {
        game.manager.refreshFieldAndHand(player);
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
        if (!game.textEffect)
            return;

        game.textEffect.position.height = global.grid.centerMini.text.height;
        game.textEffect.to = { ...global.clone(game.textEffect.position), height: 0 };
        game.refreshOnlyTextEffect = true;
    }

    static taskTextDelete(game, task, player) {
        game.refreshOnlyTextEffect = false;
        delete (game.textEffect);
    }

    static taskMove(game, task, player) {
        global.spawnOrMove(player, task.card1, task.from, task.to, task.ignoreRefresh);
    }

    static taskMoveAndShowCenter(game, task, player) {
        const card = global.spawnOrMove(player, task.card1, task.from, task.to, task.ignoreRefresh);
        const taskCenter = { id: this.taskCardToCenter.name, card1: card, isPlayer1: task.isPlayer1, delay: global.delay };
        global.game.tasks = global.addListInArrayAfterIndex(global.game.tasks, 1, [taskCenter]);
    }

    static taskCardToMiniCenter(game, task, player) {
        if (!task.card1)
            return;

        global.spawnIfNot(task.card1);
        global.cardHighlight.push(task.card1);
        task.card1.to = global.clone(global.grid.centerMini.card1);
        task.card1.to.rotation = 0;
        task.card1.zindex = 11;
    }

    static taskCardToMiniCenter2(game, task, player) {
        if (!task.card1)
            return;

        global.spawnIfNot(task.card1);
        global.cardHighlight.push(task.card1);
        task.card1.to = global.clone(global.grid.centerMini.card2);
        task.card1.to.rotation = 0;
        task.card1.zindex = 11;
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
        return game.manager.attack(task.player, task.opponent, task.attacker, task.target, task.zone, task.breach);
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
}


export default gameTask;
