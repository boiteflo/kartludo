/* eslint-disable */
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
        let effects = card1.effect;
        if (multiTriggers.includes(trigger))
            effects = effects.concat(card2.effect);

        effects = effects.filter(effect => effect.trigger == trigger);
        let result = {};

        effects.forEach(effect => {
            if (result.stop) return;
            result = { ...result, ...this.applyEffect(player, card1, card2, effect) };
        });

        return result;
    }

    static applyEffect(player, card1, card2, effect) {
        if (effect.target && !card2) {
            if (effect.target === 'unit') {
                // global.showPopupSelectCard(card1, card1.CommandtargetAvailable);
                console.log('Can t handle this effect (because of target=unit) : ' + JSON.stringify(effect));
                return { stop: true }
            }
        }

        if (effect.effect === 'get1ShieldToHand') {
            if (player.shield.length < 1) return;
            global.spawn(player, null, global.locationShield, global.locationHand);
            global.moveCardToMiniCenterWithTextThenBackToSquareOne(card1, 'Get one shield to hand');
            return { stop: true }
        }

        else if (effect.effect === 'top2DeckCard1Top1Bottom') {
            /*let deckCards = [player.deck[0], player.deck[1]];
            if (!card2) {
                global.showPopupSelectHiddenCard(card1, "which should go at the top deck ?", deckCards);
                return { stop: true }
            }

            deckCards = player.deck.splice(0, 2);
            const bottomCard = deckCards.find(x => x.index !== card2.index);
            player.deck = [card2].concat(player.deck).concat([bottomCard]);*/

            global.log(`With ${card1.name}, move top 2 deck cards Above or bellow`);
        }

        else if (effect.effect === 'protectionShieldLvXOrLower') {
            if (player.base || card2.index) return;
            const shield = player.shield[0];
            const cancel = shield.level < effect.value;
            if (cancel)
                global.log(`attack cancel because ${card1.name} has level < ${effect.value}`);
            return { cancel };
        }

        else if (effect.effect === 'gainThisTurn') {
            const effectClone = global.clone(effect);
            delete effectClone.target;
            effectClone.effect = effectClone.effect2;
            global.log(`${card1.name} give ${effect.effect2} to ${card2.name}`);
            this.applyEffect(player, card2, null, effectClone);
            card2.removeEndTurn = [effectClone];
            return { stop: true };
        }

        else if (effect.effect === 'incruise') {
            card1.ap += effect.ap;
            card1.hp += effect.hp;
            global.log(`${card1.name} have been incruised by AP ${effect.ap} and HP ${effect.hp}`);
        }

        else if (effect.effect === 'sendToHand') {
            global.spawnCard(player, card1, card1.location, global.locationHand);
            global.log(`${card1.name} is send to hand`);
            return { stop:true, cancel: true, refreshHandOpponent: true };
        } 

        else if (effect.effect === 'sendToField') {
            global.move(player, card1, global.locationShield, global.locationField);
            global.log(`${card1.name} is send to hand`);
            return { stop:true, cancel: true, refreshHandOpponent: true };
        }

        else if (effect.effect === 'sendToBase') {            
            player.base = [];
            global.spawn(player, card1, global.locationShield, global.locationBase);
            //global.moveCardToCenterThenBackToSquareOne(card1);
            global.log(`${card1.name} is send to hand`);
            this.apply(GameGundamEffect.onplay, player, card1, null);
            return { stop:true, cancel: true, refreshHandOpponent: true };
        }

        else if (effect.effect === 'placeExResource') {
            player.resourcesEx += effect.value;
            player.resourcesAvailable += effect.value;
            player.resAString = player.resourcesAvailable + '/' + player.resourcesMax;
            global.log(`${card1.name} deploy ${effect.value} ex resource`);
        }

        else if (effect.effect === 'placeRestedResource') {
            player.resourcesMax += effect.value;
            player.resAString = global.getRes(player);
            global.log(`${card1.name} deploy ${effect.value} rested resource`);
        }

        else if (effect.effect === 'breach') {
            if (!card1.breach || card1.breach < effect.value) {
                card1.breach = effect.value;
                global.log(`${card1.name} has breach ${effect.value}`);
            }
        }

        else if (effect.effect === 'deploy') {
            const targets = player.hand.filter(x => x.name.includes(effect.target) || x.attribute.includes(effect.target));
            if (targets.length < 1) return;
            const card = targets[0];
            card.selectable = false;
            card.canAttack= false;
            global.move(player, card, card.location, global.locationField);
            global.log(`${card1.name} deploy ${card.name}`);
            this.apply(GameGundamEffect.onplay, player, card, null);
        }

        else if (effect.effect === 'attackActiveEnnemyLvXOrLower') {
            if (!card1.attackActiveEnnemy || card1.attackActiveEnnemy < effect.value) {
                card1.attackActiveEnnemy = effect.value;
                global.log(`${card1.name} can attack unit with AP < ${effect.value}`);
            }
        }

        else if (effect.effect === 'immuneApXIfBreach') {
            if (card1.breach) {
                if (!card1.immuneAp || card1.immuneAp < effect.value) {
                    card1.immuneAp = effect.value;
                    global.log(`${card1.name} is now immune to AP < ${effect.value}`);
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