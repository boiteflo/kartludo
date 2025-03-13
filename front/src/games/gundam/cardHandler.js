import global from '../global';
import gameTask from '../gameTask';
import effects from './effects';

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
        const noDropZone = !card2 && !zone;
        if (noDropZone || card1.isPlayer1 !== player.isPlayer1 || !card1.selectable) {
            this.sendCardBackToSquareOne(card1);
            return;
        }

        if (card1.location === global.locationHand)
            this.playFromHand(player, card1, card2, zone);
        else if (card1.location === global.locationField)
            this.attack(player, card1, card2, zone);
    }

    static sendCardBackToSquareOne(card) {
        const rotation = card.active ? 0 : 90;
        card.to = { ...global.clone(card.position), rotation };
        card.position = { ...card.position, ...card.positionDrag };
        global.game.refresh = true;
        return global.game;
    }

    static playFromHand(player, card1, card2, zone) {
        const isSamePlayer = zone.isPlayer1 == player.isPlayer1;
        if (!isSamePlayer || zone.location == global.locationHand) {
            this.sendCardBackToSquareOne(card1);
            return;
        }
        
        const effectResult =effects.apply(effects.onplay, player, card1);
        if(effectResult.stop){
            return;
        }

        if (this.isCardUnit(card1)) {
            card1.canAttack = false;
            player.resourcesAvailable -= card1.cost;
            global.move(player, card1, card1.location, player.positions.field.location);
            return;
        }

        if (this.isCardPilot(card1) && card2 && this.isCardUnit(card2)) {
            if (card2.pair) {
                this.sendCardBackToSquareOne(card1);
                return;
            }

            player.resourcesAvailable -= card1.cost;
            global.pair(player, card2, card1);
            return;
        }

        if (this.isCardCommand(card1)) {
            const effectResult =effects.apply(effects.command, player, card1);
            if(effectResult.stop){
                return;
            }

            global.move(player, card1, card1.location, global.locationTrash);
            global.moveCardToMiniCenterWithTextThenDeleteIt(card1, 'giant effect');
            return;
        }

        this.sendCardBackToSquareOne(card1);
    }

    static attack(player, card1, card2, zone) {
        const isSamePlayer = zone.isPlayer1 == player.isPlayer1;
        if (isSamePlayer) {
            this.sendCardBackToSquareOne(card1);
            return;
        }

        const opponent = global.getPlayerTurnOpponent();
        if (card2 && card2.isPlayer1 === opponent.isPlayer1) {
            if (card2.active) {
                this.sendCardBackToSquareOne(card1);
                return;
            }

            global.startAttackAnimation(player, opponent, card1, card2);
            return;
        }

        if (opponent.shield < 1 && opponent.base.length < 1)
            return this.end(opponent);

        if (opponent.base.length > 0) {
            const target = opponent.base[0];
            global.startAttackAnimation(player, opponent, card1, target);
            return;
        } else {
            global.setActive(card1, false);
            
            let card = opponent.shield[0];
            const effectResult =effects.apply(effects.burst, opponent, card, card1);
            if(effectResult.stop){
                return;
            }
            
            global.spawn(opponent, card, global.locationShield, global.locationTrash);
            global.moveCardToCenterThenDeleteIt(card);
        }

        this.sendCardBackToSquareOne(card1);
    }

    static attackCard(player, opponent, attacker, target) {

        const effectResult =effects.apply(effects.battle, player, attacker);
        if(effectResult.stop){
            return;
        }

        const delay = 500;
        let damage = attacker.ap;
        target.hp -= damage;

        damage = target.ap;
        attacker.hp -= damage;

        global.setActive(attacker, false);
        const tasks = [];

        if (attacker.hp < 1) {
            global.move(player, attacker, attacker.location, player.positions.trash.location, true);
            attacker.dead = true;
            const delayForTarget = target.hp < 1 ? null : 500;
            tasks.push({ id: gameTask.taskCardToTrash, delay: delayForTarget, card: attacker, isPlayer1: attacker.isPlayer1 });
        } else
            tasks.push({ id: gameTask.taskRefreshField, isPlayer1: attacker.isPlayer1 });

        if (target.hp < 1) {
            global.move(opponent, target, target.location, opponent.positions.trash.location, true);
            target.dead = true;
            tasks.push({ id: gameTask.taskCardToTrash, delay, card: target, isPlayer1: target.isPlayer1 });
        } else
            tasks.push({ id: gameTask.taskRefreshField, isPlayer1: target.isPlayer1 });

        global.setActive(attacker, false);

        if (attacker.hp < 1) tasks.push({ id: gameTask.taskDeleteCard, delay, card: attacker, isPlayer1: attacker.isPlayer1 });
        if (target.hp < 1) tasks.push({ id: gameTask.taskDeleteCard, delay, card: target, isPlayer1: target.isPlayer1 });

        gameTask.addTasks(global.game.tasks, tasks);
        /*
                if (!breach && global.isCardUnit(target) && card.breach && target.hp < 1) {
                    result =this.attack(player, card, opponent.base ?? { text: 'shield' }, card.breach);
                }
        if (!breach) {
            attack = breach ?? target.ap;
            attack = card.immuneAp && card.immuneAp > attack ? 0 : attack;
            card.hp -= attack;
        }
                    */
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
