class gameTask {

    static taskRefreshField = 'RefreshField';
    static taskShowTitle = 'ShowTitle';
    static taskDrawToCenter = 'DrawToCenter';
    static taskDrawToHand = 'DrawToHand';
    static taskEndAnimation = 'EndAnimation';
    static taskCardToMiniCenter = 'CardToMiniCenter';
    static taskCardToMiniCenter2 = 'CardToMiniCenter2';
    static taskTextToMiniCenter2 = 'TextToMiniCenter2';
    static taskTextToTrash = 'TextToTrash';
    static taskDeleteText = 'DeleteText';
    static taskCardToCenter = 'CardToCenter';
    static taskCardToTrash = 'CardToTrash';
    static taskDeleteCard = 'DeleteCard';
    static taskAttack = 'Attack';
    static taskSelectCards = 'SelectCards';
    static taskPlayCard = 'PlayCard';
    static taskPlayCardWithEffect = 'PlayCardWithEffect';
    static taskApplyEffect = 'ApplyEffect';
    static taskCardToHand = 'CardToHand';
    static taskPairCard = 'PairCard';
    static taskPairCardWithEffect = 'PairCardWithEffect';

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
