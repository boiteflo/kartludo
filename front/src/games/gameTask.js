class gameTask {

    static taskRefreshField = 1;
    static taskShowTitle = 2;
    static taskDrawToCenter = 3;
    static taskDrawToHand = 4;
    static taskEndAnimation = 5;
    static taskCardToMiniCenter = 6;
    static taskCardToMiniCenter2 = 7;
    static taskTextToMiniCenter2 = 8;
    static taskTextToTrash = 9;
    static taskDeleteText = 10;
    static taskCardToCenter = 11;
    static taskCardToTrash = 12;
    static taskDeleteCard = 13;
    static taskAttack = 14;
    static taskSelectCards = 15;

    static addTasks(list, tasks) {
        tasks.forEach(task => {
            //if (!this.alreadyInclude(list, task))
            list.push(task);
        });
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

    static removeDelay(list, taskid){
        const task = [...list].reverse().find(t => t.id === taskid && t.delay);
        if(task)
            delete(task.delay);
    }
}


export default gameTask;
