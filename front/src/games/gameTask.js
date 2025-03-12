class gameTask {

    static taskRefreshField = 1;
    static taskShowTitle = 2;
    static taskDrawToCenter = 3;
    static taskDrawToHand = 4;
    static taskEndAnimation = 5;
    static taskCardToCenter = 6;
    static taskCardToTrash = 7;
    static taskDeleteCard=8;

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
        const result = task1.id === task2.id 
            && task1.isPlayer1 === task2.isPlayer1
            && task1.value === task2.value;
        return result;
    }
}


export default gameTask;
