/* eslint-disable */
import gameTask from '../gameTask';
import global from '../global';

class GameGundamEffect {
    // trigger
    static onplay = 'onplay';
    static onpair = 'onpair';
    static onlink = 'onlink';
    static battle = 'battle';
    static burst = 'burst';
    static command = 'command';

    // target
    static self = 'self';
    static unit = 'unit';
    static pairUnit = 'pairUnit';

    // type
    static gainThisTurn = 'gainThisTurn';
    static gain = 'gain';
    static hand = 'hand';

    static apply(trigger, player, card1, card2) {
        const multiTriggers = [this.onpair, this.onlink];
        let effects = !card1.effect ? [] : card1.effect;
        if (multiTriggers.includes(trigger))
            effects = effects.concat(card2.effect);

        card1.effectsRemaining = effects.filter(effect => effect.trigger == trigger);
        let result = {};

        if (card1.effectsRemaining.length < 1)
            return { nothing: true };

        const toBeRemoved = [];
        card1.effectsRemaining.forEach((effect, index) => {
            if (result.stop)
                return;
            effect.index = index;
            result = { ...result, ...this.applyEffect(player, card1, card2, effect) };
            if (!result.stop)
                toBeRemoved.push(effect.index);
        });

        card1.effectsRemaining = card1.effectsRemaining.filter(x => !toBeRemoved.includes(x.index));

        return result;
    }

    static getEffectsRemaining(trigger, card1, card2) {
        const multiTriggers = [this.onpair, this.onlink];
        let effects = !card1.effect ? [] : card1.effect;
        if (multiTriggers.includes(trigger))
            effects = effects.concat(card2.effect);

        return effects.filter(effect => effect.trigger == trigger);
    }

    static applyEffect(player, card1, card2, effect) {
        if (effect.target && !card2) {
            if (effect.target === 'unit') {
                // global.showPopupSelectCard(card1, card1.CommandtargetAvailable);
                global.logEffect(effect, 'Can t handle this effect (because of target=unit) : ' + JSON.stringify(effect));
                return { stop: true }
            }
        }

        if (effect.effect === 'get1ShieldToHand') {
            if (player.shield.length < 1)
                return;
            const card = player.shield[0];
            const delay = global.delay;
            const text = 'Get one shield to hand';
            card.location = player.positions.shield.location;
            gameTask.addTasks(global.game.tasks,
                [
                    { id: gameTask.taskCardToHand, delay, card1: card, isPlayer1: card.isPlayer1 },
                    { id: gameTask.taskTextToTrash },
                    { id: gameTask.taskRefreshField, isPlayer1: card.isPlayer1 },
                    { id: gameTask.taskDeleteText },
                ]);
            global.logEffect(effect, text);
            return {};
        }

        else if (effect.effect === 'top2DeckCard1Top1Bottom') {
            if (!global.game.cardChoice) {
                const cards = [global.getAndRemoveFirst(player.deck), global.getAndRemoveFirst(player.deck)];
                global.game.tasks = [{
                    id: gameTask.taskSelectCards,
                    text: 'Select the card that will go to the top deck, the other one will go bottom deck',
                    cards,
                    select: 'top2DeckCard1Top1BottomSelect'
                }].concat(global.game.tasks);
                return { stop: true }
            }
            else {
                const bottomCard = global.game.popup.cards.filter(card => card.index !== global.game.cardChoice.index);
                player.deck = [global.game.cardChoice].concat(player.deck).concat(bottomCard);
                global.game.popup = null;
                return {};
            }
        }

        else if (effect.effect === 'top2DeckCard1Top1BottomSelect') {
            global.logEffect(effect, `With ${card1.name}, move top 2 deck cards Above or bellow`);
        }

        else if (effect.effect === 'protectionShieldLvXOrLower') {
            if (player.base || card2.index) return;
            const shield = player.shield[0];
            const cancel = shield.level < effect.value;
            if (cancel)
                global.logEffect(effect, `attack cancel because ${card1.name} has level < ${effect.value}`);
            return { cancel };
        }

        else if (effect.effect === 'gainThisTurn') {
            const effectClone = global.clone(effect);
            delete effectClone.target;
            effectClone.effect = effectClone.effect2;
            global.logEffect(effect, `${card1.name} give ${effect.effect2} to ${card2.name}`);
            this.applyEffect(player, card2, null, effectClone);
            card2.removeEndTurn = [effectClone];
            return { stop: true };
        }

        else if (effect.effect === 'incruise') {
            card1.ap += effect.ap;
            card1.hp += effect.hp;
            global.logEffect(effect, `${card1.name} have been incruised by AP ${effect.ap} and HP ${effect.hp}`);
        }

        else if (effect.effect === 'sendToHand') {
            global.spawnCard(player, card1, card1.location, global.locationHand);
            global.logEffect(effect, `${card1.name} is send to hand`);
            return { stop: true, cancel: true, refreshHandOpponent: true };
        }

        else if (effect.effect === 'sendToField') {
            global.move(player, card1, global.locationShield, global.locationField);
            global.logEffect(effect, `${card1.name} is send to hand`);
            return { stop: true, cancel: true, refreshHandOpponent: true };
        }

        else if (effect.effect === 'sendToBase') {
            card1.location = player.positions.shield.location;
            gameTask.addTasks(global.game.tasks, [{ id: gameTask.taskPlayCard, card1: card1, zone: player.positions.field }]);
            return { stop: true };
        }

        else if (effect.effect === 'placeExResource') {
            player.resourcesEx += effect.value;
            player.resourcesAvailable += effect.value;
            player.resAString = player.resourcesAvailable + '/' + player.resourcesMax;
            global.logEffect(effect, `${card1.name} deploy ${effect.value} ex resource`);
        }

        else if (effect.effect === 'placeRestedResource') {
            player.resourcesMax += effect.value;
            player.resAString = global.getRes(player);
            global.logEffect(effect, `${card1.name} deploy ${effect.value} rested resource`);
        }

        else if (effect.effect === 'breach') {
            if (!card1.breach || card1.breach < effect.value) {
                card1.breach = effect.value;
                global.logEffect(effect, `${card1.name} has breach ${effect.value}`);
            }
        }

        else if (effect.effect === 'deploy') {
            const targets = player.hand.filter(x => x.name.includes(effect.target) || x.attribute.includes(effect.target));
            if (targets.length < 1) return;
            const card = targets[0];
            card.selectable = false;
            card.canAttack = false;
            global.move(player, card, card.location, global.locationField);
            global.logEffect(effect, `${card1.name} deploy ${card.name}`);
            this.apply(GameGundamEffect.onplay, player, card, null);
        }

        else if (effect.effect === 'attackActiveEnnemyLvXOrLower') {
            if (!card1.attackActiveEnnemy || card1.attackActiveEnnemy < effect.value) {
                card1.attackActiveEnnemy = effect.value;
                global.logEffect(effect, `${card1.name} can attack unit with AP < ${effect.value}`);
            }
        }

        else if (effect.effect === 'immuneApXIfBreach') {
            if (card1.breach) {
                if (!card1.immuneAp || card1.immuneAp < effect.value) {
                    card1.immuneAp = effect.value;
                    global.logEffect(effect, `${card1.name} is now immune to AP < ${effect.value}`);
                }
            }
        }
    }

    static removeOneTurnEffect(cards) {
        cards.filter(x => x.removeEndTurn).forEach(card => {
            const lost = [];
            card.removeEndTurn.forEach(fx => {
                delete card[fx.effect];
                lost.push(fx.effect);
            })
            global.log(`${card.name} lost ${lost.join(', ')}`);
        });
    }
}

export default GameGundamEffect;