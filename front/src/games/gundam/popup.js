class popup {

    static popup(game, task) {
        if(!task.task)
            throw new Error('Il faut préciser la task de la popup !');
        
        if (!game.popup || !game.popup.task || (!game.popup.task.cardChoice && !game.popup.task.choice)) {
            game.popup = task;
            return { stop: true };
        } 
        
        this.deletePopup();
    }

    static deletePopup() {
        delete (this.game.popup);
        delete (this.game.choice);
        delete (this.game.cardChoice);
        delete (this.game.actionPlayer);
        delete (this.game.actionOpponent);
    }
}


export default popup;