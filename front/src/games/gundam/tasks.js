/* eslint-disable no-unused-vars */

class tasks {    
    static indexTask=1;

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
            if(!this[task.id])
                throw new Error(`Can't handle this tasks : ${JSON.stringify(task)}`);
            const result = this[task.id](game, task, player, opponent);
            tasksString = game.tasks.map(x => x.id).join(', ');

            if (result && result.stop)
                return game;

            game.tasks = game.tasks.filter(x=> x.index !== task.index);

            if (task.delay) {
                game.wait = task.delay === true ? this.delay : task.delay;
                return game;
            }

            task = game.tasks[0];
            i++;
        }

        if (this.needTaskEndRefresh)
            this.taskEndRefresh(game);

        return game;
    }

    static addTasksIndex(tasks){
        tasks.forEach(x=> {
            x.index = this.indexTask;
            this.indexTask++;
        });
    }
    
    static addTask(task) { return this.addTasks([task]); }
    static addTasks(tasks) {
        this.needTaskEndRefresh = true;
        this.addTasksIndex(tasks);
        this.game.tasks = this.game.tasks.concat(tasks);
        return {};
    }

    static addTaskFirst(task) { return this.addTasksFirst([task]); }
    static addTasksFirst(tasks) {
        this.game.tasks = tasks.concat(this.game.tasks);
        this.addTasksIndex(tasks);
        return { stop: true };
    }

    static addTaskPos2(task) { return this.addTasksPos2([task]); }
    static addTasksPos2(tasks) {
        const first = this.game.tasks.splice(0,1)[0];
        this.game.tasks = [first].concat(tasks).concat(this.game.tasks);
        this.addTasksIndex(tasks);
        return { stop: true };
    }

    static taskEndRefresh(game) {
        this.needTaskEndRefresh = false;
        game.refreshOnlyTextEffect = false;
        delete (game.textEffect);
        this.cardHighlight = [];

        this.refreshFieldAndHand(game, game.player1);
        this.refreshFieldAndHand(game, game.player2);
        game.refresh = true;
        game.taskAttack = null;
    }
}


export default tasks;
