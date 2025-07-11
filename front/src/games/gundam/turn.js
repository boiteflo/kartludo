class turn {
    static getPlayerTurn() { return this.getPlayer(this.game.isPlayer1); }
    static getPlayer(isPlayer1) { return isPlayer1 ? this.game.player1 : this.game.player2; }
    static getPlayerTurnOpponent() { return this.getOpponent(this.game.isPlayer1); }
    static getOpponent(isPlayer1) { return isPlayer1 ? global.game.player2 : global.game.player1; }

    static turnIndex = 0;

    static nextTurn(game, task, player) {
        let isExisting = task.effectsAlreadyDone ? false
            : this.lunchEffectTriggerMultiple(player.field, this.trigger_end);
        task.effectsAlreadyDone = true;

        if (isExisting) {
            this.addTasks([{ id: this.refreshFieldAndHand.name, isPlayer1: true }, { id: this.refreshFieldAndHand.name, isPlayer1: false, delay: true }]);
            return { stop: true };
        }

        game.isPlayer1 = !game.isPlayer1;
        game.player = this.getPlayerTurn();
        const playerId = game.isPlayer1 ? '1' : '2';
        this.startTasks(game);

        const idTask = game.isPlayer1 ? this.taskMoveAndShowCenter.name : this.spawnOrMove.name;

        const tasks = [
            { id: this.showTitle.name, value: game.texts.newTurn + playerId, isPlayer1: game.isPlayer1, delay: true },
            { id: idTask, isPlayer1: game.isPlayer1, from: this.locationDeck, to: this.locationHand }
        ];

        this.addTasks(tasks);

        this.removeOneTurnEffect(game);

        if (game.player.resourcesMax < 1)
            game.player.resourcesMax = 1;
        else if (game.player.resourcesMax < 10)
            game.player.resourcesMax += 1;

        game.player.resourcesAvailable = game.player.resourcesMax + game.player.resourcesEx;
        game.resourcesMax = Math.max(game.player1.resourcesAvailable, game.player1.resourcesMax, game.player2.resourcesAvailable, game.player2.resourcesMax) + 1;

        game.player.field.concat(game.player.base)
            .forEach(x => this.setActive(game, x, true));

        this.setSelectableFalse();

        const baseText = game.player.base.length > 0 ? game.player.base[0].hp + 'hp ' : '-';
        this.turnIndex++;
        this.log(`-- Turn ${this.turnIndex} for player ${playerId}, ${game.player.resourcesAvailable} resources, ${game.player.shield.length} shield, ${baseText} base`);

        this.lunchEffectTriggerMultiple(game.player.field, this.trigger_turn);
    }
}


export default turn;
