import gameTask from '../gameTask';
import global from '../global';

/* eslint-disable no-unused-vars */
class GameGundamEffect {
    // trigger
    static onplay = 'onplay';
    static onpair = 'onpair';
    static onlink = 'onlink';
    static battle = 'battle';
    static burst = 'burst';
    static command = 'command';
    static ondestroyed = 'ondestroyed';
    static end = 'end';

    static removeOneTurnEffect(cards) {
        cards.filter(x => x.removeEndTurn).forEach(card => {
            const lost = [];
            card.removeEndTurn.forEach(fx => {
                delete card[fx.id];
                lost.push(fx.id);
            })
            global.log(`${card.name} lost ${lost.join(', ')}`);
        });
    }

    static handleEffects(player, card1, card2, trigger) {
        const effectsRemainings = this.getEffectsRemaining(trigger, card1, card2);
        if (!effectsRemainings || effectsRemainings.length < 1)
            return {};

        const text = effectsRemainings.map(x => this.getEffectText(x)).join('<br>');
        const delay = global.delay;
        const isShowingEffect = global.cardHighlight.find(x => x.index === card1.index);

        if (!isShowingEffect) {
            global.game.tasks = [{ id: gameTask.taskCardsToMiniCenter.name, delay, card1, card2, text }]
                .concat(global.game.tasks);
            return { stop: true };
        } 
        // else gameTask.addTasks([{ id: gameTask.taskRefreshField.name, isPlayer1: card1.isPlayer1 }]);

        return this.apply(trigger, player, card1, card2);
    }

    static getEffectText(effect) {
        let result = [effect.id?.toString(), effect.value?.toString(), effect.target?.toString(), effect.effect2?.toString()];
        if (effect.ap)
            result.push('ap ' + effect.ap);

        if (effect.hp)
            result.push('hp ' + effect.ap);

        if (effect.effects)
            result = result.concat(effect.effects.map(x => this.getEffectText(x)).join(', '));

        return result.filter(x => x && x.length > 0).join(' ');
    }

    static apply(trigger, player, card1, card2) {
        card1.effectsRemaining = this.getEffectsRemaining(trigger, card1, card2);
        let result = {};
        global.effects = [];

        if (card1.effectsRemaining.length < 1)
            return { nothing: true };

        const toBeRemoved = [];
        card1.effectsRemaining.forEach((effect, index) => {
            if (result.stop)
                return;

            effect.index = index;
            result = { ...result, ...this.applyEffect(player, card1, card2, effect) };

            if (effect.oneTurn)
                card1.removeEndTurn = card1.removeEndTurn ? card1.removeEndTurn.concat([effect]) : [effect];

            if (!result.stop)
                toBeRemoved.push(effect.index);
        });

        card1.effectsRemaining = card1.effectsRemaining.filter(x => !toBeRemoved.includes(x.index));

        return result;
    }

    static getEffectsRemaining(trigger, card1, card2) {
        const multiTriggers = [this.onpair, this.onlink];
        let effects = !card1.effects ? [] : card1.effects;
        if (multiTriggers.includes(trigger))
            effects = effects.concat(card2.effects);

        let result = effects.filter(effect => effect.trigger == trigger);
        if (trigger === this.onlink)
            result = result.concat(this.getEffectsRemaining(this.onpair, card1, card2));
        return result;
    }

    static applyEffect(player, card1, card2, effect) {
        const opponent = global.getPlayer(!player.isPlayer1);
        const needNewCard2 = ['opponentUnitHpUnderValue', 'opponentUnitRested', 'playerUnitWithAttribute', 'playerUnit'];
        let card2Obj = effect.target && needNewCard2.includes(effect.target) ? null : card2;

        if (effect.target && !card2Obj) {
            if (effect.card2) {
                card2Obj = effect.card2;
            }
            else if (global.game.cardChoice) {
                card2Obj = global.game.cardChoice;
                effect.card2 = card2Obj;
                global.deletePopup();
                delete (global.game.cardChoice);
            }
            else {
                let cards = [];
                if (effect.target === 'opponentUnitHpUnderValue') {
                    cards = opponent.field.filter(x => global.isCardUnit(x) && x.hp < effect.value);
                }
                else if (effect.target === 'opponentUnitRested') {
                    cards = opponent.field.filter(x => global.isCardUnit(x) && !x.active);
                }
                else if (effect.target === 'playerUnit') {
                    cards = player.field.filter(x => global.isCardUnit(x));
                }
                else if(effect.target === 'playerUnitWithAttribute'){
                    cards = player.field.filter(x => global.isCardUnit(x) && x.attribute.includes(effect.targetAttribute));
                }
                else if (effect.target === 'unit') {
                    alert('cant do that');
                    global.logEffect(effect, 'Can t handle this effect (because of target=unit) : ' + JSON.stringify(effect));
                    return { stop: true }
                }

                if (cards.length < 1) {
                    console.log(`Can't play the effect of ${card1.name} (${effect.id}) because there is no target available`);
                    return {};
                }
                global.game.tasks = [{
                    id: gameTask.taskPopup.name,
                    text: 'Select available target',
                    cards
                }].concat(global.game.tasks);
                return { stop: true }
            }
        }

        return this[effect.id](player, card1, card2Obj, effect);
    }

    /*
    -------------------------------- Effects ------------------------------------
    */

    static dealDamage(player, card1, card2, effect) {
        card2.hp -= effect.value;
        if (card2.hp < 1) {
            const tasks = global.destroyUnit(card2);
            gameTask.addTasks(tasks);
        }
    }

    static discard(player, card1, card2, effect) {
        const card = global.game.cardChoice;
        if (!card) {
            global.game.tasks = [{
                id: gameTask.taskPopup.name,
                text: 'Select a card to discard',
                cards: player.hand
            }].concat(global.game.tasks);
            return { stop: true }
        }

        global.deletePopup();
        global.move(player, card, null, global.locationTrash);
    }

    static pilotToHand(player, card1, card2, effect) {
        if (!card1.pair)
            return;

        const card = card1.pair;
        delete (card1.pair);
        card.isPaired = false;
        global.move(player, card, null, global.locationHand);
    }

    static gainEffects(player, card1, card2, effect) {
        card1.effects = card1.effects.concat(effect.effects);
    }

    static rest(player, card1, card2, effect) {
        global.setActive(card2, false);
    }

    static repair(player, card1, card2, effect) {
        const card = card2 ? card2 : card1;
        card.hp = Math.min(card.hp + effect.value, card.hpMax);
    }

    static get1ShieldToHand(player, card1, card2, effect) {
        if (player.shield.length < 1)
            return;

        const card = player.shield.splice(0, 1)[0];
        const text = 'Get one shield to hand';
        card.location = player.positions.shield.location;
        gameTask.addTasks([{
            id: gameTask.taskMove.name,
            card1: card,
            to: global.locationHand,
            isPlayer1: player.isPlayer1
        }]);
        global.logEffect(effect, text);
    }

    static top2DeckCard1Top1Bottom(player, card1, card2, effect) {
        if (!global.game.cardChoice) {
            const cards = [global.getAndRemoveFirst(player.deck), global.getAndRemoveFirst(player.deck)];
            global.game.tasks = [{
                id: gameTask.taskPopup.name,
                text: 'Select the card that will go to the top deck, the other one will go bottom deck',
                cards,
                select: 'top2DeckCard1Top1BottomSelect'
            }].concat(global.game.tasks);
            return { stop: true }
        }
        else {
            const bottomCard = global.game.popup.cards.filter(card => card.index !== global.game.cardChoice.index);
            player.deck = [global.game.cardChoice].concat(player.deck).concat(bottomCard);
            global.deletePopup();
        }
    }

    static protectionShieldLvXOrLower(player, card1, card2, effect) {
        if (player.base || card2.index)
            return;

        const shield = player.shield[0];
        const stop = shield.level < effect.value;
        if (stop)
            global.logEffect(effect, `attack cancel because ${card1.name} has level < ${effect.value}`);
        return { stop };
    }

    static gainThisTurn(player, card1, card2, effect) {
        const effectClone = global.clone(effect);
        delete effectClone.target;
        effectClone.id = effectClone.effect2;
        global.logEffect(effect, `${card1.name} give ${effect.effect2} to ${card2.name}`);
        this.applyEffect(player, card2, null, effectClone);
        card2.removeEndTurn = [effectClone];
    }

    static incruise(player, card1, card2, effect) {
        card1.ap += effect.ap;
        card1.hp += effect.hp;
        card1.hpMax += effect.hp;
        global.logEffect(effect, `${card1.name} have been incruised by AP ${effect.ap} and HP ${effect.hp}`);
    }

    static sendToHand(player, card1, card2, effect) {
        global.move(player, card1, null, global.locationHand);
        global.logEffect(effect, `${card1.name} is send to hand`);
        return {};
    }

    static sendToField(player, card1, card2, effect) {
        global.move(player, card1, null, global.locationField);
        global.logEffect(effect, `${card1.name} is send to hand`);
        return {};
    }

    static sendToBase(player, card1, card2, effect) {
        //global.move(player, card1, null, global.locationHand);
        //global.logEffect(effect, `${card1.name} is send to hand`);
        card1.location = global.locationShield;
        gameTask.addTasks([{ id: gameTask.taskPlayCard.name, card1: card1, zone: player.positions.field }]);
        return {};
    }

    static placeExResource(player, card1, card2, effect) {
        player.resourcesEx += effect.value;
        player.resourcesAvailable += effect.value;
        player.resAString = player.resourcesAvailable + '/' + player.resourcesMax;
        global.logEffect(effect, `${card1.name} deploy ${effect.value} ex resource`);
    }

    static placeRestedResource(player, card1, card2, effect) {
        player.resourcesMax += effect.value;
        player.resAString = player.resourcesAvailable + '/' + player.resourcesMax;
        global.logEffect(effect, `${card1.name} deploy ${effect.value} rested resource`);
    }

    static breach(player, card1, card2, effect) {
        if (!card1.breach || card1.breach < effect.value) {
            card1.breach = effect.value;
            global.logEffect(effect, `${card1.name} has breach ${effect.value}`);
        }
    }

    static highManeuver(player, card1, card2, effect) {
        if (!card1.highManeuver) {
            card1.highManeuver = true;
            global.logEffect(effect, `${card1.name} has highManeuver`);
        }
    }

    static deploy(player, card1, card2, effect) {
        const targets = player.hand.filter(x => x.name.includes(effect.target) || x.attribute.includes(effect.target));
        if (targets.length < 1) return;
        const card = targets[0];
        card.selectable = false;
        card.canAttack = false;
        global.move(player, card, card.location, global.locationField);
        global.logEffect(effect, `${card1.name} deploy ${card.name}`);
        this.apply(GameGundamEffect.onplay, player, card, null);
    }

    static attackActiveEnnemy(player, card1, card2, effect) {
        if (!card1.attackActiveEnnemy || card1.attackActiveEnnemy < effect.value) {
            card1.attackActiveEnnemy = effect.value;
            global.logEffect(effect, `${card1.name} can attack unit with AP < ${effect.value}`);
        }
    }

    static immuneAp(player, card1, card2, effect) {
        if (card1.breach) {
            if (!card1.immuneAp || card1.immuneAp < effect.value) {
                card1.immuneAp = effect.value;
                global.logEffect(effect, `${card1.name} is now immune to AP < ${effect.value}`);
            }
        }
    }
}

export default GameGundamEffect;