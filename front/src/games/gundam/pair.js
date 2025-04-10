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
        cardPilot.pairedWith = cardUnit.index;
        cardPilot.location = this.locationPair;
        cardPilot.zindex = 1;
        cardUnit.zindex = 2;
        cardUnit.apOrigin += cardPilot.ap;
        cardUnit.hpOrigin += cardPilot.hp;
        cardUnit.hpMaxOrigin += cardPilot.hp;
        cardUnit.verso = false;
        cardPilot.verso = false;
        this.handleMainEffectsCard(game, cardPilot, true);

        if (isLink) {
            cardUnit.link = true;
            cardPilot.link = true;
            cardUnit.active = true;
            cardUnit.selectable = true;
            cardUnit.canAttack = true;
        }
    }
}


export default pair;
