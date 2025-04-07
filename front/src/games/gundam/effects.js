/* eslint-disable no-unused-vars */

class effects {
    static draw(game, task, player, opponent){
        this.addTaskFirst({ id: this.taskMoveAndShowCenter.name, isPlayer1: player.isPlayer1, from: this.locationDeck, to: this.locationHand, verso:!player.isPlayer1, delay:true });
    }

    static playToken(game, task, player, opponent){
        if(!task.effect.value)
            throw new Error('Missing effect.value :' + JSON.stringify(task));
        const isPlayer1 = player.isPlayer1;
        this.addTaskFirst( { id: this.spawnOrMove.name, card1: this.createCard(task.effect.value, isPlayer1), to: this.locationField, isPlayer1 });
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
        if (!task.card1.pair)
            return;

        const card1 = task.card1.pair;
        delete (task.card1.pair);
        card1.isPaired = false;
        this.addTaskPos2({ id: this.move.name, card1, to: this.locationHand });
        this.log(`${card1.name} return to hand`);
    }

    static gainEffects(game, task, player, opponent) {
        task.card1.effects = task.card1.effects.concat(task.effect.effects);
        this.log(`${task.card1.name} gain these effects : ${task.effect.effects.map(x => x.id)}`);
    }

    static rest(game, task, player, opponent) {
        this.setActive(task.card2, false);
    }

    static repair(game, task, player, opponent) {
        const card = task.card2 ? task.card2 : task.card1;
        if (card.hp < card.hpMax) {
            this.log(`${task.card2.name} HP is repaired by ${task.effect.value}`);
            card.hp = Math.min(card.hp + task.effect.value, card.hpMax);
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
        if (!task.card2)
            task.card2 = task.card1;

        const effect = this.clone(task.effect);
        delete effect.target;
        effect.id = effect.effect2;
        effect.oneTurn = true;
        this.log(`${task.card1.name} give ${task.effect.effect2} to ${task.card2.name} for this turn`);
        this.applyEffect(game, {
            id: this.applyEffect.name, card1: task.card2, effect
        }, player, opponent)
    }

    static incruise(game, task, player, opponent) {
        task.card2.ap += task.effect.ap;
        task.card2.hp += task.effect.hp;
        task.card2.hpMax += task.effect.hp;
        this.log(`${task.card2.name} have been incruised by AP ${task.effect.ap} and HP ${task.effect.hp}`);
    }

    static sendToHand(game, task, player, opponent) {
        this.log(`${task.card2.name} is send to hand`);
        this.addTaskPos2({ id: this.move.name, card1: task.card2, to: this.locationHand });
    }

    static sendToField(game, task, player, opponent) {
        this.log(`${task.card1.name} is send to field`);
        this.addTaskPos2({ id: this.play.name, card1: task.card1, to: this.locationField });
    }

    static sendToBase(game, task, player, opponent) {
        task.card1.location = this.locationShield;
        this.log(`${task.card1.name} is send to base`);
        this.addTasksPos2([{ id: this.play.name, card1: task.card1, zone: player.positions.field }]);
        return {};
    }

    static placeExResource(game, task, player, opponent) {
        player.resourcesEx += task.effect.value;
        player.resourcesAvailable += task.effect.value;
        this.log(`${task.card1.name} deploy ${task.effect.value} ex resource(s)`);
    }

    static placeRestedResource(game, task, player, opponent) {
        player.resourcesMax += task.effect.value;
        this.log(`${task.card1.name} deploy ${task.effect.value} rested resource(s)`);
    }

    static breach(game, task, player, opponent) {
        if (!task.card1.breach || task.card1.breach < task.effect.value) {
            task.card1.breach = task.effect.value;
            this.log(`${task.card1.name} has breach ${task.effect.value}`);
        }
    }

    static blocker(game, task, player, opponent) {
        if (!task.card1.blocker) {
            task.card1.blocker = true;
            this.log(`${task.card1.name} has blocker`);
        }
    }

    static highManeuver(game, task, player, opponent) {
        if (!task.card1.highManeuver) {
            task.card1.highManeuver = true;
            this.log(`${task.card1.name} has highManeuver`);
        }
    }

    static deploy(game, task, player, opponent) {
        const targets = player.hand.filter(x => x.name.includes(task.effect.attribute) || x.attribute.includes(task.effect.attribute));
        if (targets.length < 1) {
            this.log(`${task.card1.name} can't deploy anything because no targat available`);
            return;
        }

        const card1 = targets[0];
        card1.selectable = false;
        card1.canAttack = false;
        this.log(`${task.card1.name} deploy ${card1.name}`);
        this.addTask({ id: this.play.name, card1, zone: player.positions.field, regularPlay: false });
    }

    static attackActiveEnnemy(game, task, player, opponent) {
        if (!task.card1.attackActiveEnnemy || task.card1.attackActiveEnnemy < task.effect.value) {
            task.card1.attackActiveEnnemy = task.effect.value;
            this.log(`${task.card1.name} can now attack unit with AP < ${task.effect.value}`);
        }
    }

    static immuneApIfBreach(game, task, player, opponent) {
        if (task.card1.breach) {
            if (!task.card1.immuneAp || task.card1.immuneAp < task.effect.value) {
                task.card1.immuneAp = task.effect.value;
                this.log(`${task.card1.name} is now immune to AP < ${task.effect.value}`);
            }
        }
    }
}


export default effects;
