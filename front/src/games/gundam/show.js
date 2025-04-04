class title {

    static showTitle(game, task) {
        game.showTitle = task.value;
    }

    static taskTextShow(game, task) {
        game.textEffect = {
            text: task.text,
            position: this.clone(game.grid.textZone)
        };
        game.textEffect.to = this.clone(game.grid.textZone);
        game.textEffect.position.height = 0;
    }

    static showCards(game, task) {
        if (!task.card1 || this.cardHighlight.find(x=> x.index === task.card1.index)){
            task.delay = null;
            return;
        }

        this.spawnIfNot(task.card1);
        this.cardHighlight.push(task.card1);
        const destination = task.card2 ? game.grid.highlightCardLeft : game.grid.highlightCardCenter;
        task.card1.to = this.clone(destination);
        task.card1.to.rotation = 0;
        task.card1.zindex = 11;
        task.card1.verso = task.verso;

        if (task.card2) {
            this.spawnIfNot(task.card2);
            this.cardHighlight.push(task.card2);
            task.card2.to = this.clone(game.grid.highlightCardRight);
            task.card2.to.rotation = 0;
            task.card2.zindex = 11;
            task.card2.verso = task.verso;
        }

        if (task.text)
            this.taskTextShow(game, task);
    }

    static taskMoveAndShowCenter(game, task, player) {
        task.card1 = this.spawnOrMove(game, task, player);
        task.delay = true;
        this.showCards(game, task);
    }
}


export default title;
