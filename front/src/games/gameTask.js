class gameTask {

    static taskRefreshField = 'RefreshField';
    static taskTitleShow = 'TitleShow';
    static taskTextShow = 'TextShow';
    static taskTextHide = 'TextHide';
    static taskTextDelete = 'TextDelete';
    static taskCardToMiniCenter = 'CardToMiniCenter';
    static taskCardToMiniCenter2 = 'CardToMiniCenter2';
    static taskCardToCenter = 'CardToCenter';
    static taskMove = 'Move';
    static taskAttack = 'Attack';    
    static taskPopup = 'Popup';    
    static taskPlayCard = 'PlayCard';   
    static taskPairCard = 'PairCard';

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
