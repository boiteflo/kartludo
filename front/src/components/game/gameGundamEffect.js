/* eslint-disable */
import GameGundamGlobal from './GameGundamGlobal';

class GameGundamEffect {
    // trigger
    static onplay = 'onplay';
    static main = 'main';
    static onpair = 'onpair';
    static onlink = 'onlink';
    static battle = 'battle';
    static burst = 'burst';
    /* 
        GameGundamEffect.apply(GameGundamEffect.passive, player, card);
        GameGundamEffect.apply(GameGundamEffect.main, player, card);
    */

    // effect
    static deploy = 'deploy';
    static get1ShieldToHand = 'get1ShieldToHand';
    static top2DeckCard1Top1Bottom = 'top2DeckCard1Top1Bottom';
    static protectionShieldLv4OrLower = 'protectionShieldLv4OrLower';
    static breach3 = 'breach3';
    static breach5 = 'breach5';
    static ap1hp1 = 'ap1hp1';
    static place1ExResource = 'place1ExResource';
    static attackActiveEnnemyLv4OrLower = 'attackActiveEnnemyLv4OrLower';
    static place1RestedResource = 'place1RestedResource';
    static immuneAp3IfBreach = 'immuneAp3IfBreach';

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

        let result = {};

        effects
            .filter(effect => effect.trigger == trigger)
            .forEach(effect => result = {...result, ...this.applyEffect(player, card1, card2, effect)});

        return result;
    }

    static applyEffect(player, card1, card2, effect) {
        if (effect.effect === 'get1ShieldToHand') {
            if (player.shield.length < 1) return;
            const card = player.shield.splice(0, 1)[0];
            GameGundamGlobal.spawnCard(player, card, GameGundamGlobal.locationHand);
            card.position = player.position.shield;
        }
        else if (effect.effect === 'top2DeckCard1Top1Bottom') {
            console.log('top2DeckCard1Top1Bottom');
        }
        else if (effect.effect === 'protectionShieldLv4OrLower') {
            if (player.base || card2.index) return;
            const shield = player.shield[0];
            return { cancel: shield.level < 5 };
        }
        else if (effect.effect === 'gainThisTurn') {
            // select a card
            return {};
        }
        else if (effect.effect === 'incruise') {
            card1.ap += card2.ap;
            card1.hp += card2.hp;
        }
        else if (effect.effect === 'sendToHand') {
            GameGundamGlobal.spawnCard(player, card1, GameGundamGlobal.locationHand);
            card1.position = player.position.shield;
        }
        else if (effect.effect === 'placeExResource') {
            player.resourcesEx += effect.value;
            player.resourcesAvailable += effect.value;
            player.resAString = GameGundamGlobal.getRes(player);
        }
        else if (effect.effect === 'placeRestedResource') {
            player.resourcesMax += effect.value;
            player.resAString = GameGundamGlobal.getRes(player);
        }
        else if (effect.effect === 'breach') {
            card1.breach = effect.value;
        }
        else if (effect.effect === 'deploy') {
            const targets = player.hand.filter(x => x.name.includes(effect.target) || x.attribute.includes(effect.target));
            if (targets.length < 1) return;
            const card = targets[0];
            card.selectable = false;
            card.height = GameGundamGlobal.size.cardSize.height;
            player.hand = GameGundamGlobal.removeObj(player.hand, card);
            player.field.push(card);
            GameGundamEffect.apply(GameGundamEffect.onplay, player, card, null);
        }
        else if (effect.effect === 'attackActiveEnnemyLvXOrLower') {
            card1.attackActiveEnnemy = effect.value;
        }
        else if (effect.effect === 'immuneApXIfBreach') {
            if (card1.breach)
                card1.immuneAp = effect.value;
        }
    }
}

/*
"effect":[{"command":true, "type":"gainThisTurn", "target":"unit", "effect":"breach3"}],
"effect":[{"trigger":"deploy", "effect":"place1ExResource"}],
"effect":[{"effect":"breach5"}, {"effect":"attackActiveEnnemyLv4OrLower"}],
"effect":[{"effect":"place1RestedResource"}],

"effect":[{"trigger":"passive", "target":"pairUnit", "effect":"immuneAp3IfBreach"}],
"effect":[{"trigger":"passive", "effect":"breach3"}],
"effect":[{"trigger":"onpair", "type":"gain", "target":"self", "effect":"breach3"}],
"effect":[{"trigger":"onplay", "type":"deploy", "target":"Maganac Corps", "targetLocation":"hand"}],
*/


export default GameGundamEffect;