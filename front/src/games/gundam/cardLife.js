class cardLife {    

    static isCardUnit(card) { return card.type?.includes(0); }
    static isCardPilot(card) { return card.type?.includes(1); }
    static isCardCommand(card) { return card.type?.includes(2); }
    static isCardCommandPilot(card) { return this.isCardPilot(card) && this.isCardCommand(card); }
    static isCardBase(card) { return card.type?.includes(3); }
    static isCardToken(card) { return card.type?.includes(4); }
    static isCardResource(card) { return card.type?.includes(5); }

    static createCard(id, isPlayer1) {
        const card = this.clone(this.cards.find(x => x.id === id));
        card.index = this.getNextIndex();
        card.hpMax = card.hp;
        card.active=true;
        card.isPlayer1 = isPlayer1;
        card.location = this.locationDeck;
        card.effects = !card.effects ? [] : card.effects.map(fx => this.clone(fx));
        return card;
    }

    static getNextIndex() {
        this.index++;
        return this.index;
    }
    
    static setActive(card, active) {
        card.active = active;
        card.selectable = false;
        card.canAttack = active;
        const degree = card.active ? 0 : 90;
        if (!card.to)
            card.to = this.clone(card.position);
        card.to.rotation = degree;
    }

    static destroyUnit(card1, delay = true) {
        card1.dead = true;
        return [
            { id: 'gameTask.taskApplyEffect.name', card1, trigger: this.effectsOndestroyed },
            { id: 'gameTask.taskMove.name', delay, card1, to: this.locationTrash, isPlayer1: card1.isPlayer1 }
        ];
    }
}


export default cardLife;
