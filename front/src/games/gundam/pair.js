class pair {
    static pair(game, task, player) {
        const cardUnit = this.isCardUnit(task.card1) ? task.card1 : task.card2;
        const cardPilot = this.isCardPilot(task.card1) ? task.card1 : task.card2;
        const isLink = this.isLink(cardUnit, cardPilot);

        const isExistingPairEffects = task.effectsAlreadyDonePair ? false
            : this.lunchEffectTriggerForTwoCard(cardUnit, cardPilot, this.trigger_onpair);
        task.effectsAlreadyDonePair = true;
        if (isExistingPairEffects)
            return { stop: true };

        if (isLink) {
            const isExistingLinkEffects = task.effectsAlreadyDoneLink ? false
                : this.lunchEffectTriggerForTwoCard(cardUnit, cardPilot, this.trigger_onlink);
            task.effectsAlreadyDoneLink = true;
            if (isExistingLinkEffects)
                return { stop: true };
        }

        const from = cardPilot.location;
        player[from] = this.removeByIndex(player[from], cardPilot);
        cardUnit.pair = cardPilot;
        cardPilot.selectable = false;
        cardPilot.isPaired = true;
        cardPilot.location = this.locationPair;
        cardPilot.zindex = 1;
        cardUnit.zindex = 2;
        cardUnit.ap += cardPilot.ap;
        cardUnit.hp += cardPilot.hp;

        if (isLink) {
            cardUnit.link = true;
            cardPilot.link = true;
            cardUnit.active = true;
            cardUnit.selectable = true;
            cardUnit.canAttack = true;
        }
    }

    static isLink(cardUnit, cardPilot) {
        if (cardUnit.link?.includes('['))
            return cardUnit.link.includes(cardPilot.name);
        else {
            const targetStr = cardUnit.link.replace('(', '').replace(')', '');
            return cardPilot.attribute?.includes(targetStr);
        }
    }
}


export default pair;
