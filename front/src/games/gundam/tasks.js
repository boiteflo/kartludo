

/* eslint-disable no-unused-vars */
class tasks {    

    static handleTasks(game) {
        if (game.end) {
            game.tasks = [];
            return game;
        }

        let task = game.tasks[0];
        game.refresh = task ? true : false;
        let i = 0;

        while (task && i < 100) {
            const isPlayer1 = task.isPlayer1 ? task.isPlayer1
                : task.card1 && task.card1.isPlayer1 ? task.card1.isPlayer1
                    : task.isPlayer1;
            const player = isPlayer1 ? game.player1 : game.player2;
            const opponent = isPlayer1 ? game.player2 : game.player1;

            let tasksString = game.tasks.map(x => x.id).join(', ');
            const result = {}; this[task.id](game, task, player, opponent);
            tasksString = game.tasks.map(x => x.id).join(', ');

            if (result && result.stop)
                return game;

            if (task.delay) {
                game.wait = task.delay === true ? this.delay : task.delay;
                task = game.tasks.splice(0, 1)[0];
                return game;
            }

            task = game.tasks.splice(0, 1)[0];
            task = game.tasks[0];
            i++;
        }

        if (this.needTaskEndRefresh)
            this.taskEndRefresh(game);

        return game;
    }
    
    static addTask(task) { return this.addTasks[task]; }
    static addTasks(tasks) {
        this.needTaskEndRefresh = true;
        this.game.tasks = this.game.tasks.concat(tasks);
        return {};
    }

    static addTaskFirst(task) { return this.addTasksFirst([task]); }
    static addTasksFirst(tasks) {
        this.game.tasks = tasks.concat(this.game.tasks);
        return { stop: true };
    }

    static taskEndRefresh(game) {
        //game.endRefresh();
        this.needTaskEndRefresh = false;
        game.refreshOnlyTextEffect = false;
        delete (game.textEffect);
        this.cardHighlight = [];

        this.refreshFieldAndHand(game.player1);
        this.refreshFieldAndHand(game.player2);
        game.refresh = true;
        game.taskAttack = null;
    }
}


export default tasks;
