class turn {
    static getPlayerTurn() { return this.getPlayer(this.game.isPlayer1); }
    static getPlayer(isPlayer1) { return isPlayer1 ? this.game.player1 : this.game.player2; }
    static getPlayerTurnOpponent() {  return this.getOpponent(this.game.isPlayer1); }
    static getOpponent(isPlayer1) { return isPlayer1 ? global.game.player2 : global.game.player1; }

    static nextTurn(game, task, player, opponent) {
        this.lunchEffectTrigger(player.field, this.effectsEnd);

        //tasks.push({ id: gameTask.taskRefreshField.name, isPlayer1: player.isPlayer1 });

        game.isPlayer1 = !game.isPlayer1;
        const playerId = global.isPlayer1 ? '1' : '2';
        const newPlayer = opponent;

        this.addTasks([
            { id: this.showTitle.name, value: 'New turn for player ' + playerId, isPlayer1: game.isPlayer1, delay: true },
            //{ id: this.wait.name, delay:true}
            // { id: this.taskMoveAndShowCenter.name, isPlayer1: this.isPlayer1, from: this.locationDeck, to: this.locationHand }
        ]);

        //effects.removeOneTurnEffect(global.game.cards);
        if (newPlayer.resourcesMax < 10)
            newPlayer.resourcesMax += 1;

        newPlayer.resourcesAvailable = player.resourcesMax + player.resourcesEx;

        this.setSelectableFalse();

        newPlayer.field.forEach(x => {
            x.active = true;
            x.canAttack = true;
        });

        const baseText = newPlayer.base.length > 0 ? newPlayer.base[0].hp + 'hp ' : '-';
        this.log(`-- Turn player ${playerId}, ${newPlayer.resourcesAvailable}re, ${newPlayer.shield.length}sh, ${baseText}ba`);
    }

    /*static nextTurn() {
        const player = global.getPlayerTurn();
        effects.removeOneTurnEffect(global.game.cards);
        if (player.resourcesMax < 10)
            player.resourcesMax += 1;

        player.resourcesAvailable = player.resourcesMax + player.resourcesEx;
        cardHandler.nextTurn(player);

        const baseText = player.base.length > 0 ? player.base[0].hp + 'hp ' : '-';
        global.log(`-- Turn player ${player.number}, ${player.resourcesAvailable}re, ${player.shield.length}sh, ${baseText}ba`);
    }

    static endTurn() {
        const player = global.getPlayerTurn();
        const cards = player.field.filter(x => x.effects.find(y => y.trigger === effects.end));
        const tasks = [];
        cards.forEach(card => {
            tasks.push({
                id: gameTask.taskApplyEffect.name,
                card1: card,
                trigger: effects.end
            });
        });

        tasks.push({ id: gameTask.taskRefreshField.name, isPlayer1: player.isPlayer1 });

        gameTask.addTasks(tasks);
    }
    */
}


export default turn;
