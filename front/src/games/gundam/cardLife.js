class cardLife {

    static isCardUnit(card) { return card.type?.includes(0); }
    static isCardPilot(card) { return card.type?.includes(1); }
    static isCardCommand(card) { return card.type?.includes(2); }
    static isCardCommandPilot(card) { return this.isCardPilot(card) && this.isCardCommand(card); }
    static isCardBase(card) { return card.type?.includes(3); }
    static isCardToken(card) { return card.type?.includes(4); }
    static isCardResource(card) { return card.type?.includes(5); }

    static createCard(id, isPlayer1, location) {
        const card = this.clone(this.cards.find(x => x.id === id));
        card.index = this.getNextIndex();
        card.hpMax = card.hp;
        card.apOrigin = card.ap;
        card.hpOrigin = card.hp;
        card.hpMaxOrigin = card.hpMax;
        card.active = true;
        card.isPlayer1 = isPlayer1;
        card.location = location ? location : this.locationDeck;
        card.effects = !card.effects ? [] : card.effects.map(fx => this.clone(fx));
        card.incruises = [];
        return card;
    }

    static getNextIndex() {
        this.index++;
        return this.index;
    }

    static setActive(game, card, active) {
        card.active = active;
        card.selectable = false;
        card.canAttack = active;
        const degree = card.active ? 0 : 90;
        if (!card.to)
            card.to = this.clone(card.position);
        card.to.rotation = degree;
        this.handleMainEffectsCard(game, card, active);
    }

    static destroyUnit(card1, delay = true) {
        card1.dead = true;
        return [
            { id: this.applyEffectCard.name, card1, trigger: this.trigger_ondestroyed },
            { id: this.move.name, delay, card1, to: this.locationTrash }
        ];
    }

    static hasLinkEffect(card) {
        return card && card.effects && card.effects.find(x => x.trigger === this.trigger_onlink) ? true : false;
    }

    static hadBlocker(card) {
        return this.hasEffect(card, 'blocker');
    }

    static hasEffect(card, effect) {
        const hasProperty = card[effect];
        const hasEffect = card.effects.find(fx => fx.id === effect);
        return hasProperty || hasEffect;
    }

    static hasAttribute(card, attribute) {
        if (attribute.includes('['))
            return attribute.includes(card.name);
        else {
            const targetStr = attribute.replace('(', '').replace(')', '').trim();
            if (!targetStr && targetStr.length < 1)
                return false;
            return card.attribute?.includes(targetStr);
        }
    }

    static isLink(cardUnit, cardPilot) {
        return this.hasAttribute(cardPilot, cardUnit.link);
    }

    static recalculateApHp(game, player, card) {
        let ap = 0;
        let hp = 0;
        const incruises = game.incruises.concat(player.incruises).concat(card.incruises);

        incruises.forEach(incruise => {
            ap += incruise.ap;
            hp += incruise.hp;
        });

        card.ap = card.apOrigin + ap;
        card.hp = card.hpOrigin + hp;
        card.hpMax = card.hpMaxOrigin + hp;
    }
}


export default cardLife;
