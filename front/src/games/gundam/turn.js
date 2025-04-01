class turn {
    
    static nextTurn() { //game, task, player, opponent
        /*
        const cards = player.field.filter(x => x.effects && x.effects.find(y => y.trigger === this.effectsEnd));
        let tasks = [];
        cards.forEach(card => {
            tasks.push({
                id: 'this.applyEffect.name',
                card1: card,
                trigger: this.effectsEnd
            });
        });

        //tasks.push({ id: gameTask.taskRefreshField.name, isPlayer1: player.isPlayer1 });

        game.isPlayer1 = !game.isPlayer1;
        const playerId = global.isPlayer1 ? '1' : '2';
        const newPlayer = opponent;

        tasks = tasks.concat([
            { id: 'gameTask.taskTitleShow.name', value: 'New turn for player ' + playerId, isPlayer1: game.isPlayer1, delay: true },
            { id: 'gameTask.taskMoveAndShowCenter.name', isPlayer1: this.isPlayer1, from: this.locationDeck, to: this.locationHand }
        ]);

        //effects.removeOneTurnEffect(global.game.cards);
        if (newPlayer.resourcesMax < 10)
            newPlayer.resourcesMax += 1;

        newPlayer.resourcesAvailable = player.resourcesMax + player.resourcesEx;
        
        game.cards.forEach(card => card.selectable = false);

        newPlayer.field.forEach(x => {
            x.active = true;
            x.canAttack = true;
        });

        const baseText = newPlayer.base.length > 0 ? newPlayer.base[0].hp + 'hp ' : '-';
        global.log(`-- Turn player ${playerId}, ${newPlayer.resourcesAvailable}re, ${newPlayer.shield.length}sh, ${baseText}ba`);
        */
    }
}


export default turn;
