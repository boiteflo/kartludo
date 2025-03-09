import gameTask from './gameTask';

class gameManager {

    static createGame(manager, width, height) {
        const result = manager.createGame(width, height);
        manager.tasks = [];
        manager.popup = null;
        gameTask.addTasks(manager.tasks, [gameTask.refreshHand(true), gameTask.refreshHand(false)]);
        this.nextTurn();

        return result;
    }

    static nextTurn() {
        console.log('test');
    }
}


export default gameManager;
