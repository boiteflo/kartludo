import gameTask from './gameTask';
import grid from './grid';

class gameManager {

    static createGame(manager, width, height) {
        const result = manager.createGame(width, height);
        manager.tasks = [];
        manager.popup = null;
        gameTask.addTasks(manager.tasks, [gameTask.refreshHand(true), gameTask.refreshHand(false)]);
        this.nextTurn();

        result.grid = grid.setup(width, height);

        return result;
    }

    static nextTurn() {
        console.log('test');
    }
}


export default gameManager;
