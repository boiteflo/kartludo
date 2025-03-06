import global from './global';
import setup from './setup';
import effects from './effects';
import gridAndSize from './gridAndSize';

class manager {

    static createGame(width, height) {
        const result = setup.createGame(width, height);
        this.nextTurn();
        const opponent = global.getPlayerTurnOpponent();
        this.refreshHandPosition(opponent);

        return result;
    }

    static nextTurn() {
        global.isPlayer1Turn = !global.isPlayer1Turn;
        const player = global.getPlayerTurn();

        global.world.cards.forEach(card => card.selectable = false);
        player.field.forEach(card => global.setActive(card, true));
        player.resourcesMax += 1;
        player.resourcesAvailable = player.resourcesMax + player.resourcesEx;
        player.resources = player.resourcesMax;
        player.resAString = global.getRes(player);
        
        global.log(`-- New turn for player ${player.number}, ${player.resourcesAvailable} res.`);

        global.draw(player, 1);

        this.refreshHandPosition(player, false);
        player.field.forEach(card => {
            card.active = true;
            card.selectable = true;
        });

        return global.world;
    }

    static refreshHandPosition(player, setSelectableOff = true) {
        player.hand.forEach((card, index) => {
            card.to = this.getHandPosition(player, index);
            card.selectable = setSelectableOff ? false : this.isSelectable(player, card);
        });
    }

    static refreshFieldPosition(player) {
        player.field.forEach((card, index) => {
            card.to = card.to ?? this.getFieldPosition(player, card, index);
            if (card.pair && !card.pair.to)
                card.pair.to = { x: card.to.x, y: card.pair.position.y };
        });
    }

    static isSelectable(player, card) {
        if (card.location === global.locationHand) {
            const resourcesMax = Math.max(player.resourcesMax, player.resourcesAvailable);
            const isCostAvailable = card.level <= resourcesMax && card.cost <= player.resourcesAvailable;
            if (!isCostAvailable)
                return false;
        }

        return global.getCardHandler(card).isSelectable(global.world, player, card);
    }

    static selectCard(card, choiceType, choiceCard) {
        const player = global.getPlayerTurn();

        if (global.awaitingCardChoice && !choiceCard)
            return this.selectChoiceCard(player, card);

        if (global.awaitingAttackTarget && !choiceCard)
            return this.selectAttackTarget(card);

        if (card.isPlayer1 != player.isPlayer1 || !card.selectable)
            return global.world;

        global.world.popup = null;
        let playParams = { refreshHand: true, refreshField: true };

        if (card.location === global.locationHand)
            playParams = this.play(player, card, choiceType, choiceCard);
        else if (card.location === global.locationField && global.isCardUnit(card) && card.active)
            playParams = this.attack(player, card, choiceCard);

        if (playParams.refreshHand) this.refreshHandPosition(player, false);
        if (playParams.refreshField) this.refreshFieldPosition(player, false);

        return global.world;
    }

    static play(player, card, choiceType, choiceCard) {
        let playParams = global.getCardHandler(card, choiceType).play(global.world, player, card, choiceCard);
        if (playParams.playCost)
            this.playCardCost(player, card);

        effects.apply(effects.onplay, player, card, choiceCard);

        global.log(`For ${card.cost}, play ${card.name}`);

        return playParams;
    }

    static selectChoiceType(choice) {
        if (global.awaitingAttackTarget)
            return this.selectAttackTarget(choice);

        global.lastChoiceType = choice;
        return this.selectCard(global.world.popup.card, choice, null);
    }

    static selectChoiceCard(player, choiceCard) {
        const card = global.world.popup.card;
        global.world.popup = null;

        if (card.index == choiceCard.index) {
            global.resetSelectable();
            return global.world;
        }

        const result = this.selectCard(card, global.lastChoiceType, choiceCard);
        global.awaitingCardChoice = false;
        return result;
    }

    static selectAttackTarget(choiceCard) {
        const card = global.world.popup.card;
        global.world.popup = null;

        if (card.index == choiceCard.index) {
            global.world.cards.forEach(card => {
                card.selectable = card.selectableOld;
                delete (card.selectableOld);
            });
            card.selectable = true;
            return global.world;
        }

        const result = this.selectCard(card, global.lastChoiceType, choiceCard);
        global.awaitingAttackTarget = false;
        global.resetSelectable();
        return result;
    }

    static attack(player, card, target, breach = null) {
        const opponent = global.getPlayerTurnOpponent();
        let result = { playCost: false, refreshHand: false, refreshField: false };
        card.selectable = false;

        let targets = opponent.field.filter(x => !x.active);
        if (card.attackActiveEnnemy)
            targets = opponent.field.filter(x => !x.active || x.level < card.attackActiveEnnemy);

        if (opponent.base) targets.push(opponent.base);
        else targets.push({ text: 'Shield' });

        if (!target) {
            if (targets.length > 1) {
                global.showPopupSelectAttackTarget(card, targets, opponent.base);
                return { playCost: false, refreshHand: false, refreshField: false };
            } else if (opponent.base)
                target = opponent.base
            else
                target = { text: 'Shield' };
        }

        const effectResult = effects.apply(effects.battle, player, card, target);
        if (effectResult && effectResult.cancel) {
            card.active = false;
            return { playCost: false, refreshHand: false, refreshField: false };
        }

        global.setActive(card, false);
        if (target && target.id)
            this.attackCard(player, opponent, card, target, breach);

        if (opponent.base && opponent.base.index == target.index)
            opponent.base = null;
        else if (!target.index) {
            if (opponent.shield.length < 1)
                this.endFight();
            else {
                const shield = opponent.shield[0];
                const effectResult = effects.apply(effects.burst, opponent, shield, card);
                if(effectResult.refreshHandOpponent)
                    this.refreshHandPosition(opponent);
                
                if (!effectResult || !effectResult.cancel)
                    global.spawnCard(opponent, shield, global.locationShield);
            }
        }

        if (!breach && global.isCardUnit(target) && card.breach) {
            result =this.attack(player, card, opponent.base ?? { text: 'shield' }, card.breach);
        }

        card.active = false;

        return result;
    }

    static attackCard(player, opponent, card, target, breach) {
        let attack = 0;

        if (!breach) {
            attack = breach ?? target.ap;
            attack = card.immuneAp && card.immuneAp > attack ? 0 : attack;
            card.hp -= attack;
        }

        attack = card.ap;
        attack = target.immuneAp && target.immuneAp > attack ? 0 : attack;
        target.hp -= attack;

        if (card.hp < 1) {
            player.field = global.removeObj(player.field, card);
            if (card.pair)
                player.field = global.removeObj(player.field, card.pair);

            global.sendToGrave(player, card);
        }

        if (target.hp < 1) {
            opponent.field = global.removeObj(opponent.field, target);
            if (target.pair)
                opponent.field = global.removeObj(opponent.field, target.pair);

            global.sendToGrave(opponent, target);
        }
    }

    static endFight() {
        const message = global.isPlayer1Turn ? "Victory" : "Defeat";
        this.showPopup(null, message, []);
    }

    // ------------------ Utilities
    static refreshGameSize(width, height) {
        global.size = gridAndSize.calculateGameSize(width, height);
        return global.world;
    }

    static playCardCost(player, card) {
        const remainingCost = card.cost - player.resourcesEx;
        if (remainingCost <= 0) {
            player.resourcesEx -= card.cost;
        }
        else {
            player.resourcesEx = 0;
            player.resources -= remainingCost;
        }
        player.resourcesAvailable = player.resources + player.resourcesEx;
        player.resAString = global.getRes(player);
    }

    static getHandPosition(player, index = -1) {
        const posIndex = index > -1 ? index : player.hand.length;
        return this.getCardPosition(player, posIndex, player.position.hand, player.hand.length, false, global.size.handWidth);
    }
    static getFieldPosition(player, card, index = -1) {
        const posIndex = index > -1 ? index : player.field.length;
        const result = this.getCardPosition(player, posIndex, player.position.field, player.field.length, true, global.size.fieldWidth);
        result.rotation = card.position?.rotation;
        return result;
    }
    static getCardPosition(player, index, position, cardsLength, useRotateWidth, widthAvailable) {
        const rotateWidth = !useRotateWidth ? 0 : (global.size.cardSize.height - global.size.cardSize.width) / 2;
        let cardWidth = global.size.cardSize.width + 5 + rotateWidth;
        const result = this.getCenteredX(index, cardWidth, cardsLength, widthAvailable);
        return { x: position.x + result, y: position.y }; //(rotateWidth * direction) + position.x + (index * direction * cardWidth)
    }
    static getCenteredX(index, elementWidth, totalElements, zoneWidth) {
        if (totalElements == 1) return (zoneWidth - elementWidth) / 2;
        const marginCount = totalElements + 1;
        const zoneWidthAvailable = zoneWidth - (totalElements * elementWidth);
        const marginWidth = zoneWidthAvailable / marginCount;
        const result = (index + 1) * marginWidth + index * elementWidth;
        return result;
    }


    static endAnimation() {
        global.world.cards.filter(x => x.show && x.to).forEach(card => {
            card.position = card.to;
            card.to = null;
        });
        global.world.cards = global.world.cards.filter(x => !x.explode);
        return global.world;
    }
}


export default manager;
