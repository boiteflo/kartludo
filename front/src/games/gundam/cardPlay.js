class cardPlay {
    static play(game, task, player) {
        let result = {};

        if (!task.card2 && !task.zone)
            result.sendBack = true;

        else if (task.card1.location === this.locationHand)
            result = this.playFromHand(player, task);

        else if (task.card1.location === this.locationField)
            result = this.prepareAttack(player, task);

        else
            result = this.playThisCard(player, task, false);

        if (result && result.sendBack)
            this.sendCardBackToSquareOne(task.card1);

        return result;
    }

    static prepareAttack(player, card1, card2, zone, breach) {
        const isSamePlayer = zone.isPlayer1 == player.isPlayer1;
        if (isSamePlayer || !card1.canAttack) {
            return { sendBack: true };
        }

        const opponent = this.getPlayer(!player.isPlayer1);
        this.addTasks([{ id: 'this.attack.name', player, opponent, attacker: card1, target: card2, zone, breach }]);
    }

    static playFromHand(player, task) {
        const isSamePlayer = task.zone.isPlayer1 == player.isPlayer1;
        const wrongCost = task.regularPlay && player.resourcesAvailable < task.card1.cost;

        if (!isSamePlayer || task.zone.location == this.locationHand || wrongCost)
            return { sendBack: true };

        return this.playThisCard(player, task, task.regularPlay);
    }

    static sendCardBackToSquareOne(card) {
        const rotation = card.active ? 0 : 90;
        card.to = { ...this.clone(card.position), rotation };
        card.position = { ...card.position, ...card.positionDrag };
        this.game.refresh = true;
        return {};
    }

    static playThisCard(player, task, playCost) {
        let isPilot = this.isCardPilot(task.card1);
        let isCommand = this.isCardCommand(task.card1);

        const pilotOrCommand = this.askPilotOrCommand(task);
        isPilot = pilotOrCommand ? pilotOrCommand.isPilot : isPilot;
        isCommand = pilotOrCommand ? pilotOrCommand.isCommand : isCommand;
        if (pilotOrCommand && pilotOrCommand.stop)
            return pilotOrCommand;

        this.spawnIfNot(task.card1);
        
        let isExisting = task.effectsAlreadyDone ? false
            : this.lunchEffectTriggerForOneCard(task.card1, task.card2, this.trigger_onplay);
        if (isExisting) {
            task.effectsAlreadyDone = true;
            return { stop: true };
        }

        if (this.isCardUnit(task.card1) && player.field.length < 6) {
            task.card1.canAttack = false;
            if (playCost)
                this.playCardCost(player, task.card1);
            this.addTask({ id: this.move.name, card1: task.card1, to: this.locationField, isPlayer1: true });
            return;
        }

        if (this.isCardBase(task.card1)) {
            if (player.base.length > 0)
                this.addTask({ id: this.move.name, card1: player.base[0], to: this.locationTrash });

            this.addTask({ id: this.move.name, card1: task.card1, to: this.locationBase });
            task.card1.selectable = false;
            return;
        }

        if (isPilot && task.card2 && this.isCardUnit(task.card2)) {
            if (task.card1.pair || task.card2.pair || task.card1.isPaired || task.card2.isPaired) {
                this.sendCardBackToSquareOne(task.card1);
                return;
            }

            if (playCost)
                this.playCardCost(player, task.card1);
            this.addTask({ id: this.pair.name, card1: task.card1, card2: task.card2 });
            return;
        }

        if (isCommand) {
            if (playCost)
                this.playCardCost(player, task.card1);
            
            this.addTasks([
                { id: this.applyEffectCard.name, card1: task.card1, card2:task.card2, trigger: this.trigger_command },
                { id: this.move.name, card1: task.card1, to: this.locationTrash }
            ]);
            return;
        }

        this.sendCardBackToSquareOne(task.card1);
    }

    static playCardCost(player, card) {
        if (player.resourcesEx > 0)
            player.resourcesEx = Math.max(0, player.resourcesEx - card.cost);
        player.resourcesAvailable -= card.cost;
    }

    static askPilotOrCommand(task) {
        if (!task.card2 || !this.isCardPilot(task.card1) || !this.isCardCommand(task.card1))
            return;

        if (task.choice) 
            task.pilotOrCommand = task.choice.text;

        if (task.pilotOrCommand) {
            const isPilot = task.pilotOrCommand === 'Pilot';
            const isCommand = task.pilotOrCommand === 'Command';
            return { isPilot, isCommand };
        }

        this.addTaskFirst({
            id: this.popup.name,
            text: 'Do you want to play as pilot or command ?',
            choices: [{ text: 'Pilot' }, { text: 'Command' }],
            task
        });
        return { stop: true }
    }
}


export default cardPlay;
