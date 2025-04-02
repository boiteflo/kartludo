class pair {
    static pair(player, card1, card2) {
        const cardUnit = this.isCardUnit(card1) ? card1 : card2;
        const cardPilot = this.isCardPilot(card1) ? card1 : card2;
        const isLink = this.isLink(cardUnit, cardPilot);
        const trigger = isLink ? effects.onlink : effects.onpair;
        const effectResult = effects.handleEffects(player, cardUnit, cardPilot, trigger);
        if (effectResult.stop)
            return effectResult;

        const from = cardPilot.location;
        player[from] = global.removeByIndex(player[from], cardPilot);
        cardUnit.pair = cardPilot;
        cardPilot.selectable = false;
        cardPilot.isPaired = true;
        cardPilot.location = global.locationPair;
        cardPilot.zindex = 1;
        cardUnit.zindex = 2;
        cardUnit.ap += cardPilot.ap;
        cardUnit.hp += cardPilot.hp;

        if (this.isLink(cardUnit, cardPilot)) {
            cardUnit.link = true;
            cardPilot.link = true;
            cardUnit.active = true;
            cardUnit.selectable = true;
            cardUnit.canAttack = true;
        }
    }

    static isLink(cardUnit, cardPilot) {
        if (cardUnit.link.includes('['))
            return cardUnit.link.includes(cardPilot.name);
        else {
            const targetStr = cardUnit.link.replace('(', '').replace(')', '');
            return cardPilot.attribute.includes(targetStr);
        }
    }
}


export default pair;
