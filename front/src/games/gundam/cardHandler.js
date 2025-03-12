import global from '../global';

class cardHandler {
    static nextTurn(player) {
        player.field.forEach(x => x.canAttack = true);
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
        if (card1.location === global.locationHand)
            this.playFromHand(player, card1, card2, zone);
        else (card1.location === global.locationField)
        this.attack(player, card1);
    }

    static playFromHand(player, card1) { //, card2, zone
        if (this.isCardUnit(card1))
            card1.canAttack = false;

        player.resourcesAvailable -= card1.cost;
        global.move(player, card1, card1.location, player.positions.field.location);
    }

    static attack(player, card1) { //player, card1, card2, zone
        const opponent = global.getPlayerTurnOpponent();
        if(opponent.shield < 1 && opponent.base.length < 1)
            return this.end(opponent);
        
        if(opponent.base.length > 0){
            const target = opponent.base[0];
            this.attackCard(player, opponent, card1, target);
        }

    }

    static attackCard(player, opponent, attacker, target){
        let damage = attacker.ap;
        target.hp-=damage;

        damage = target.ap;
        attacker.hp-=damage;

        if(attacker.hp < 1){
            global.move(player, attacker, attacker.location, player.positions.trash.location);
        }
        if(target.hp < 1){
            global.move(player, opponent, opponent.location, opponent.positions.trash.location);
        }
    }

    static end(opponent){
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
