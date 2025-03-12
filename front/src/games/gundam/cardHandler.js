import global from '../global';
import gameTask from '../gameTask';

class cardHandler {
    static nextTurn(player) {
        global.game.cards.forEach(card => card.selectable = false);

        player.field.forEach(x => {
            x.active = true;
            x.canAttack = true;
        });
    }

    static setSelectable(player) {
        player.hand.forEach(card => {
            const resourcesMax = Math.max(player.resourcesMax, player.resourcesAvailable);
            const isCostAvailable = card.level <= resourcesMax && card.cost <= player.resourcesAvailable;

            card.selectable = isCostAvailable;
        });

        player.field.forEach(card => {
            card.selectable = card.canAttack;
        });
    }

    static play(player, card1, card2, zone) {
        if (card1.isPlayer1 !== player.isPlayer1 || !card1.selectable)
            this.sendCardBackToSquareOne(card1);

        if (card1.location === global.locationHand)
            this.playFromHand(player, card1, card2, zone);
        else if (card1.location === global.locationField)
            this.attack(player, card1, card2, zone);
    }

    static sendCardBackToSquareOne(card) {
        card.to = global.clone(card.position);
        card.position = { ...card.position, ...card.positionDrag };
        global.game.refresh = true;
        return global.game;
    }

    static playFromHand(player, card1, card2, zone) {
        const isSamePlayer = zone.isPlayer1 == player.isPlayer1;
        if (!isSamePlayer) {
            this.sendCardBackToSquareOne(card1);
            return;
        }

        if (this.isCardUnit(card1))
            card1.canAttack = true;

        player.resourcesAvailable -= card1.cost;
        global.move(player, card1, card1.location, player.positions.field.location);
    }

    static attack(player, card1, card2, zone) {
        const isSamePlayer = zone.isPlayer1 == player.isPlayer1;
        if (isSamePlayer) {
            this.sendCardBackToSquareOne(card1);
            return;
        }

        const opponent = global.getPlayerTurnOpponent();
        if (opponent.shield < 1 && opponent.base.length < 1)
            return this.end(opponent);

        if (opponent.base.length > 0) {
            const target = opponent.base[0];
            this.attackCard(player, opponent, card1, target);
        } else {
            const card = global.getAndRemoveFirst(opponent.shield);
            global.spawn(opponent, card, global.locationShield, global.locationTrash);
            this.moveCardToCenterThenDeleteIt(card);
        }

        this.sendCardBackToSquareOne(card1);
        global.setActive(card1, false);
    }

    static attackCard(player, opponent, attacker, target) {
        let damage = attacker.ap;
        target.hp -= damage;

        damage = target.ap;
        attacker.hp -= damage;

        if (attacker.hp < 1) {
            global.move(player, attacker, attacker.location, player.positions.trash.location);
            this.moveCardToCenterThenDeleteIt(attacker);
        }
        if (target.hp < 1) {
            global.move(opponent, target, opponent.location, opponent.positions.trash.location);
            this.moveCardToCenterThenDeleteIt(target);
        }
    }

    static moveCardToCenterThenDeleteIt(card) {
        const delay = 500;
        gameTask.addTasks(global.game.tasks,
            [{ id: gameTask.taskCardToCenter, delay, card },
            { id: gameTask.taskCardToTrash, delay, card },
            { id: gameTask.taskDeleteCard, card, removeBase:true }
        ]);
    }

    static end(opponent) {
        const message = opponent.isPlayer1 ? 'Defeat' : 'Victory';
        alert(message);
    }

    static isCardUnit(card) { return card.type?.includes(0); }
    static isCardPilot(card) { return card.type?.includes(1); }
    static isCardCommand(card) { return card.type?.includes(2); }
    static isCardCommandPilot(card) { return this.isCardPilot(card) && this.isCardCommand(card); }
    static isCardBase(card) { return card.type?.includes(3); }
}


export default cardHandler;
