class turn {
    static getPlayerTurn() { return this.getPlayer(this.game.isPlayer1); }
    static getPlayer(isPlayer1) { return isPlayer1 ? this.game.player1 : this.game.player2; }
    static getPlayerTurnOpponent() { return this.getOpponent(this.game.isPlayer1); }
    static getOpponent(isPlayer1) { return isPlayer1 ? global.game.player2 : global.game.player1; }

    static turnIndex=0;

    static nextTurn(game, task, player) {
        let isExisting = !task.effectsEndAlreadyDone
            ? this.lunchEffectTrigger(player.field, this.effectsEnd)
            : false;
        if (isExisting) {
            task.effectsEndAlreadyDone = true;
            return { stop: true };
        }

        game.isPlayer1 = !game.isPlayer1;
        const newPlayer = this.getPlayerTurn();
        const playerId = game.isPlayer1 ? '1' : '2';

        this.addTasks([
            { id: this.showTitle.name, value: 'New turn for player ' + playerId, isPlayer1: game.isPlayer1, delay: true },
            { id: this.taskMoveAndShowCenter.name, isPlayer1: game.isPlayer1, from: this.locationDeck, to: this.locationHand }
        ]);

        this.removeOneTurnEffect(game.cards);

        if (newPlayer.resourcesMax < 1)
            newPlayer.resourcesMax = 1;
        else if (newPlayer.resourcesMax < 10)
            newPlayer.resourcesMax += 1;

        newPlayer.resourcesAvailable = newPlayer.resourcesMax + newPlayer.resourcesEx;

        this.setSelectableFalse();

        newPlayer.field.forEach(x => {
            x.active = true;
            x.canAttack = true;
        });

        const baseText = newPlayer.base.length > 0 ? newPlayer.base[0].hp + 'hp ' : '-';
        this.turnIndex++;
        this.log(`-- Turn ${this.turnIndex}, player ${playerId}, ${newPlayer.resourcesAvailable}re, ${newPlayer.shield.length}sh, ${baseText}ba`);
    }
}


export default turn;
