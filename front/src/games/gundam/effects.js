/* eslint-disable no-unused-vars */

class effects {
    static draw(game, task, player, opponent) {
        const value = task.effect.value ? task.effect.value : 1;
        const tasks = [];
        for (let i = 0; i < value; i++)
            tasks.push({
                id: this.taskMoveAndShowCenter.name,
                isPlayer1: player.isPlayer1,
                from: this.locationDeck,
                to: this.locationHand,
                verso: !player.isPlayer1,
                delay: true
            });

        this.addTasksFirst(tasks);
    }

    static setCost(game, task, player, opponent) {
        task.card2.costOrigin = task.card2.costOrigin ? task.card2.costOrigin : task.card2.cost;
        const reduceValue = task.isConditionsAfterRespected ? task.effect.value : 0;
        task.card2.cost = task.card2.costOrigin + reduceValue;
    }

    static playToken(game, task, player, opponent) {
        if (!task.effect.value)
            throw new Error('Missing effect.value :' + JSON.stringify(task));
        const isPlayer1 = player.isPlayer1;
        this.addTaskFirst({ id: this.spawnOrMove.name, card1: this.createCard(task.effect.value, isPlayer1), to: this.locationField, isPlayer1 });
    }

    static dealDamage(game, task, player, opponent) {
        task.card2.hp -= task.effect.value;
        this.log(`${task.card2.name} HP is reduced by ${task.effect.value}`);
        if (task.card2.hp < 1) {
            const tasks = this.destroyUnit(task.card2, false);
            this.addTasksPos2(tasks);
        }
    }

    static discard(game, task, player, opponent) {
        const card1 = task.cardChoice;
        if (!card1) {
            this.addTaskFirst({
                id: this.popup.name,
                isPlayer1: player.isPlayer1,
                task,
                text: 'Select a card to discard',
                cards: player.hand
            });
            return { stop: true }
        }

        this.log(`${card1.name} discarded`);
        this.addTaskPos2({ id: this.move.name, card1, to: this.locationTrash });
    }

    static pilotToHand(game, task, player, opponent) {
        if (!task.card2.pair)
            return;

        const card1 = task.card2.pair;
        delete (task.card2.pair);
        card1.isPaired = false;
        this.addTaskPos2({ id: this.move.name, card1, to: this.locationHand });
        this.log(`${card1.name} return to hand`);
    }

    static gainEffects(game, task, player, opponent) {
        task.card2.effects = task.card2.effects.concat(task.effect.effects);
        this.log(`${task.card2.name} gain these effects : ${task.effect.effects.map(x => x.id)}`);
    }

    static rest(game, task, player, opponent) {
        this.setActive(task.card2, false);
    }

    static repair(game, task, player, opponent) {
        if (task.card2.hp < task.card2.hpMax) {
            this.log(`${task.card2.name} HP is repaired by ${task.effect.value}`);
            task.card2.hp = Math.min(task.card2.hp + task.effect.value, task.card2.hpMax);
        }
    }

    static get1ShieldToHand(game, task, player, opponent) {
        if (player.shield.length < 1)
            return;

        const card1 = player.shield.splice(0, 1)[0];
        card1.location = player.positions.shield.location;
        this.addTaskPos2({ id: this.spawnOrMove.name, card1, to: this.locationHand });
        this.log(`One card is move from shield to hand`);
    }

    static top2DeckCard1Top1Bottom(game, task, player, opponent) {
        if (!task.cardChoice) {
            task.cards = [this.getAndRemoveFirst(player.deck), this.getAndRemoveFirst(player.deck)];
            this.addTaskFirst({
                id: this.popup.name,
                isPlayer1: player.isPlayer1,
                task,
                text: 'Select the card that will go to the top deck, the other one will go bottom deck',
                cards: task.cards
            });
            return { stop: true }
        }

        const bottomCard = task.cards.filter(card => card.index !== task.cardChoice.index);
        player.deck = [task.cardChoice].concat(player.deck).concat(bottomCard);
        this.log(`Deck order have been changed (top and bottom)`);
    }

    static protectionShieldLvXOrLower(game, task, player, opponent) {
        if (!task.taskAttack || !task.taskAttack.attacker)
            throw new Error('cant handle this effect : ' + JSON.stringify(task.effect));

        task.taskAttack.shieldProtection = task.taskAttack.attacker.level <= task.effect.value;
        if (task.taskAttack.shieldProtection)
            this.log(`Shield are protected`);
        else
            this.log(`Shield are not protected because attacker is level ${task.taskAttack.attacker.level}`);
    }

    static gainThisTurn(game, task, player, opponent) {
        const effect = this.clone(task.effect);
        delete effect.target;
        effect.id = effect.effect2;
        effect.oneTurn = true;
        this.log(`${task.card2.name} get ${task.effect.effect2} for this turn`);
        this.applyEffect(game, {
            id: this.applyEffect.name, card1: task.card2, effect
        }, player, opponent)
    }

    static incruise(game, task, player, opponent) {        
        const alreadyDone = this.alreadyDone(task.card2.incruise, task.isConditionsAfterRespected);
        if (alreadyDone) 
            return;

        task.card2.incruise = task.isConditionsAfterRespected;
        task.card2.apOrigin = task.card2.apOrigin ? task.card2.apOrigin : task.card2.ap;
        task.card2.hpOrigin = task.card2.hpOrigin ? task.card2.hpOrigin : task.card2.hp;
        task.card2.hpMaxOrigin = task.card2.hpMaxOrigin ? task.card2.hpMaxOrigin : task.card2.hpMax;
        const apIncruise = task.isConditionsAfterRespected ? task.effect.ap : 0;
        const hpIncruise = task.isConditionsAfterRespected ? task.effect.hp : 0;

        task.card2.ap = task.card2.apOrigin + apIncruise;
        task.card2.hp = task.card2.hpOrigin + hpIncruise;
        task.card2.hpMax = task.card2.hpMaxOrigin + hpIncruise;
        this.log(`${task.card2.name} have been incruised by AP ${apIncruise} and HP ${hpIncruise}`);
    }

    static sendToHand(game, task, player, opponent) {
        this.log(`${task.card2.name} is send to hand`);
        this.addTaskPos2({ id: this.move.name, card1: task.card2, to: this.locationHand });
    }

    static unrestResource(game, task, player, opponent) {
        const value = task.effect.value ? task.effect.value : 1;
        if (player.resourcesAvailable < player.resourcesMax)
            player.resourcesAvailable += value;
    }

    static placeExResource(game, task, player, opponent) {
        player.resourcesEx += task.effect.value;
        player.resourcesAvailable += task.effect.value;
        this.log(`${task.card2.name} deploy ${task.effect.value} ex resource(s)`);
    }

    static placeRestedResource(game, task, player, opponent) {
        player.resourcesMax += task.effect.value;
        this.log(`${task.card2.name} deploy ${task.effect.value} rested resource(s)`);
    }

    static breach(game, task, player, opponent) {
        if (!task.card2.breach || task.card2.breach < task.effect.value) {
            task.card2.breach = task.effect.value;
            this.log(`${task.card2.name} has breach ${task.effect.value}`);
        }
    }

    static blocker(game, task, player, opponent) {
        const alreadyDone = this.alreadyDone(task.card2.blocker, task.isConditionsAfterRespected);
        if (alreadyDone) 
            return;
        
        task.card2.blocker = task.isConditionsAfterRespected;
        const text = task.isConditionsAfterRespected ? 'has blocker' : 'don t has blocker';
        this.log(`${task.card2.name} ${text}`);
    }

    static highManeuver(game, task, player, opponent) {
        if (!task.card2.highManeuver) {
            task.card2.highManeuver = true;
            this.log(`${task.card2.name} has highManeuver`);
        }
    }

    static deploy(game, task, player, opponent) {
        let card1 = task.card2;
        card1.selectable = false;
        card1.canAttack = false;
        const cardPlayer = this.getPlayer(card1.isPlayer1);
        this.log(`${card1.name} is deployed`);
        this.addTask({ id: this.play.name, card1, zone: cardPlayer.positions.field, regularPlay: false });
    }

    static attackActiveEnnemy(game, task, player, opponent) {
        if (!task.card2.attackActiveEnnemy || task.card2.attackActiveEnnemy < task.effect.value) {
            task.card2.attackActiveEnnemy = task.effect.value;
            this.log(`${task.card2.name} can now attack unit with AP < ${task.effect.value}`);
        }
    }

    static immune(game, task, player, opponent) {
        if (!task.card2.immuneAp || task.card2.immuneAp < task.effect.value) {
            task.card2.immuneAp = task.effect.value;
            this.log(`${task.card2.name} is now immune to AP < ${task.effect.value}`);
        }
    }
}


export default effects;
