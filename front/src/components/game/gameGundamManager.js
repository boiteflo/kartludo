import GameGundamGlobal from './GameGundamGlobal';
import GameGundamSetup from './gameGundamSetup';
import GameGundamEffect from './gameGundamEffect';
import GameGundamGridAndSize from './gameGundamGridAndSize';

class GameGundamManager {

    static createGame(width, height) {
        const result = GameGundamSetup.createGame(width, height);
        this.nextTurn();
        result.player2.field.push();
        const opponent = GameGundamGlobal.getPlayerTurnOpponent();
        this.refreshHandPosition(opponent);

        return result;
    }

    static nextTurn() {
        GameGundamGlobal.isPlayer1Turn = !GameGundamGlobal.isPlayer1Turn;
        const player = GameGundamGlobal.getPlayerTurn();

        GameGundamGlobal.world.cards.forEach(card => card.selectable = false);
        player.field.forEach(card => GameGundamGlobal.setActive(card, true));
        player.resourcesMax += 1;
        player.resourcesAvailable = player.resourcesMax + player.resourcesEx;
        player.resources = player.resourcesMax;
        player.resAString = GameGundamGlobal.getRes(player);

        GameGundamGlobal.draw(player, 1);

        this.refreshHandPosition(player, false);
        player.field.forEach(card => {
            card.active = true;
            card.selectable = true;
        });

        return GameGundamGlobal.world;
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
        if (card.location === GameGundamGlobal.locationHand) {
            const resourcesMax = Math.max(player.resourcesMax, player.resourcesAvailable);
            const isCostAvailable = card.level <= resourcesMax && card.cost <= player.resourcesAvailable;
            if (!isCostAvailable)
                return false;
        }

        return GameGundamGlobal.getCardHandler(card).isSelectable(GameGundamGlobal.world, player, card);
    }

    static selectCard(card, choiceType, choiceCard) {
        const player = GameGundamGlobal.getPlayerTurn();

        if (GameGundamGlobal.awaitingCardChoice && !choiceCard)
            return this.selectChoiceCard(player, card);

        if (GameGundamGlobal.awaitingAttackTarget && !choiceCard)
            return this.selectAttackTarget(card);

        if (card.isPlayer1 != player.isPlayer1 || !card.selectable)
            return GameGundamGlobal.world;

        GameGundamGlobal.world.popup = null;
        let playParams = { refreshHand: true, refreshField: true };

        if (card.location === GameGundamGlobal.locationHand) {
            playParams = GameGundamGlobal.getCardHandler(card, choiceType).play(GameGundamGlobal.world, player, card, choiceCard);
            if (playParams.playCost)
                this.playCardCost(player, card);
        }
        else if (card.location === GameGundamGlobal.locationField) {
            if (GameGundamGlobal.isCardUnit(card) && card.active) {
                playParams = this.attack(player, card, choiceCard);
            }
        }

        GameGundamEffect.apply(GameGundamEffect.onplay, player,card, choiceCard);

        if (playParams.refreshHand) this.refreshHandPosition(player, false);
        if (playParams.refreshField) this.refreshFieldPosition(player, false);

        return GameGundamGlobal.world;
    }

    static selectChoiceType(choice) {
        if(GameGundamGlobal.awaitingAttackTarget)
            return this.selectAttackTarget(choice);

        GameGundamGlobal.lastChoiceType = choice;
        return this.selectCard(GameGundamGlobal.world.popup.card, choice, null);
    }

    static selectChoiceCard(player, choiceCard) {
        const card = GameGundamGlobal.world.popup.card;
        GameGundamGlobal.world.popup = null;

        if (card.index == choiceCard.index) {
            GameGundamGlobal.resetSelectable();
            return GameGundamGlobal.world;
        }

        const result = this.selectCard(card, GameGundamGlobal.lastChoiceType, choiceCard);
        GameGundamGlobal.awaitingCardChoice = false;
        return result;
    }

    static selectAttackTarget(choiceCard) {
        const card = GameGundamGlobal.world.popup.card;
        GameGundamGlobal.world.popup = null;

        if (card.index == choiceCard.index) {
            GameGundamGlobal.world.cards.forEach(card => {
                card.selectable = card.selectableOld;
                delete (card.selectableOld);
            });
            card.selectable = true;
            return GameGundamGlobal.world;
        }

        const result = this.selectCard(card, GameGundamGlobal.lastChoiceType, choiceCard);
        GameGundamGlobal.awaitingAttackTarget = false;
        GameGundamGlobal.resetSelectable();
        return result;
    }

    static attack(player, card, target) {
        const opponent = GameGundamGlobal.getPlayerTurnOpponent();
        card.selectable = false;

        let targets = opponent.field.filter(x => !x.active);
        if (opponent.base) targets.push(opponent.base);
        else targets.push({ text: 'Shield' });

        if (!target) {
            if (targets.length > 1) {
                GameGundamGlobal.showPopupSelectAttackTarget(card, targets, opponent.base);
                return { playCost: false, refreshHand: false, refreshField: false };
            } else if (opponent.base)
                target = opponent.base
            else
                target = {text: 'Shield' };
        }

        const effectResult = GameGundamEffect.apply(GameGundamEffect.battle, player, card, target);
        if(effectResult && effectResult.cancel){
            card.active = false;
            return { playCost: false, refreshHand: false, refreshField: false };
        }

        GameGundamGlobal.setActive(card, false);
        if(target && target.id)
            this.attackCard(player, opponent, card, target);

        if (opponent.base && opponent.base.index == target.index)
            opponent.base = null;
        else if (!target.index) {
            if (opponent.shield.length < 1)
                this.endFight();
            else {
                const shield = opponent.shield[0];
                const effectResult = GameGundamEffect.apply(GameGundamEffect.burst, player, card, target);
                if(effectResult && effectResult.cancel)
                    GameGundamGlobal.spawnCard(opponent, shield, GameGundamGlobal.locationShield);
            }
        }

        card.active = false;

        return { playCost: false, refreshHand: false, refreshField: false };
    }

    static attackCard(player, opponent, card, target) {
        card.hp -= target.ap;
        target.hp -= card.ap;

        if (card.hp < 1) {
            player.field = GameGundamGlobal.removeObj(player.field, card);
            if (card.pair)
                player.field = GameGundamGlobal.removeObj(player.field, card.pair);

            GameGundamGlobal.sendToGrave(player, card);
        }

        if (target.hp < 1) {
            opponent.field = GameGundamGlobal.removeObj(opponent.field, target);
            if (target.pair)
                opponent.field = GameGundamGlobal.removeObj(opponent.field, target.pair);

            GameGundamGlobal.sendToGrave(opponent, target);
        }
    }

    static endFight() {
        const message = GameGundamGlobal.isPlayer1Turn ? "Victory" : "Defeat";
        this.showPopup(null, message,[]);
    }

    // ------------------ Utilities
    static refreshGameSize(width, height) {
        GameGundamGlobal.size = GameGundamGridAndSize.calculateGameSize(width, height);
        return GameGundamGlobal.world;
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
        player.resAString = GameGundamGlobal.getRes(player);
    }

    static getHandPosition(player, index = -1) {
        const posIndex = index > -1 ? index : player.hand.length;
        return this.getCardPosition(player, posIndex, player.position.hand, player.hand.length, false, GameGundamGlobal.size.handWidth);
    }
    static getFieldPosition(player, card, index = -1) {
        const posIndex = index > -1 ? index : player.field.length;
        const result = this.getCardPosition(player, posIndex, player.position.field, player.field.length, true, GameGundamGlobal.size.fieldWidth);
        result.rotation = card.position?.rotation;
        return result;
    }
    static getCardPosition(player, index, position, cardsLength, useRotateWidth, widthAvailable) {
        const rotateWidth = !useRotateWidth ? 0 : (GameGundamGlobal.size.cardSize.height - GameGundamGlobal.size.cardSize.width) / 2;
        let cardWidth = GameGundamGlobal.size.cardSize.width + 5 + rotateWidth;
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
        GameGundamGlobal.world.cards.filter(x => x.show && x.to).forEach(card => {
            card.position = card.to;
            card.to = null;
        });
        GameGundamGlobal.world.cards = GameGundamGlobal.world.cards.filter(x => !x.explode);
        return GameGundamGlobal.world;
    }
}


export default GameGundamManager;
