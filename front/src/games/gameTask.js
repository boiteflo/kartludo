class gameTask {

    static task = {
        refreshHand: 0,
        refreshField: 1
    };

    static addTasks(list, tasks){
        tasks.forEach(task => {
           if(!this.alreadyInclude(list, task)) 
                list.push(task);
        });
    }

    static alreadyInclude(list, task){
        return list.find(x=> this.isEqual(x, task));
    }
    static isEqual(task1, task2){
        return task1.task === task2.task && task1.isPlayer1 === task1.isPlayer1;
    }

    static refreshHand(isPlayer1=true) {return {'task':this.task.refreshHand, 'isPlayer1': isPlayer1}; }
    static refreshField(isPlayer1=true) {return {'task':this.task.refreshField, 'isPlayer1': isPlayer1}; }
}


export default gameTask;
