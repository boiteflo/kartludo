class aiStrategy {
    static handleStrategy(game, player, cardsAvailable) {
        let result = null;

        const base = player.base.length > 0 ? player.base[0] : null;
        if (base && base.active) {
            result = this.handleStrategyCard(game, player, cardsAvailable, base);
            if (result.stop || result.taskAdded)
                return result;
        }

        result = cardsAvailable.filter(x => x.strategy && x.strategy == "playAsap");
        if (result.length > 0)
            return { unit: result[0] };

        result = cardsAvailable.filter(x => x.strategy && x.strategy == "playIfOpponentUnits");
        if (result.length > 0 && game.player2.field.length > 0)
            return { unit: result[0] };

        result = cardsAvailable.filter(x => x.strategy && x.strategy == "playIfOpponentUnitsRested");
        if (result.length > 0 && game.player2.field.filter(x => !x.active).length > 0)
            return { unit: result[0] };

        return {};
    }

    static handleStrategyCard(game, player, cardsAvailable, card) {
        let lunchMainEffectCard = false;

        if (card.id === 'GD01-124'){ // Side 7
            const hasActiveUnitThatNeedRepair = player.field.find(x => x.hp < x.hpMax);
            lunchMainEffectCard = hasActiveUnitThatNeedRepair;
        }

        else if (card.id === 'ST01-016') { // Asticassia School of Technology, Earth House
            lunchMainEffectCard = true;
        }

        else if (card.id === 'ST01-015' && player.resourcesAvailable > 1){  // White base            
            lunchMainEffectCard = true;
        }

        else if (card.id === 'ST04-015'){ // Archangel
            const hasInactiveBlocker = player.field.find(x => !x.active && this.hasEffect(x, 'blocker'));
            lunchMainEffectCard = player.resourcesAvailable > 1 && hasInactiveBlocker;
        } 

        if (lunchMainEffectCard) {
            this.addTaskFirst({ id: this.lunchMainEffectCard.name, cardChoice: card });
            return { taskAdded: true };
        }

        return {};
    }
}


export default aiStrategy;
