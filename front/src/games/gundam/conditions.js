class conditions {
    static isEffectMatchConditions(game, task, player, opponent) {
        return this.isConditionsRespected(game, task, player, opponent, task.effect.conditions);
    }

    static isConditionsAfterRespected(game, task, player, opponent) {
        return this.isConditionsRespected(game, task, player, opponent, task.effect.conditionsAfter);
    }

    static isConditionsRespected(game, task, player, opponent, conditions) {
        if (!conditions || conditions.length < 1)
            return true;

        let result = true;
        conditions.forEach(condition => {
            if (!result)
                return result;

            if (condition.id === 'unitHas')
                result = result && this.hasEffect(task.card2, condition.value);

            else if (condition.id === 'isInHand')
                result = result && task.card2.location === this.locationHand;

            else if (condition.id === 'isInField')
                result = result && task.card2.location === this.locationField;

            else if (condition.id === 'isPlayerTurn')
                result = result && game.isPlayer1 === player.isPlayer1;

            else if (condition.id === 'pilotLevelMin')
                result = result && task.cardPilot && task.cardPilot.level >= condition.value;

            else if (condition.id === 'minimumXUnitsWithAttribute')
                result = result && player.field.filter(card => this.isCardUnit(card) && this.hasAttribute(card, condition.attribute)).length >= condition.value;

            else if (condition.id === 'minimumXCommandInTrash')
                result = result && player.trash.filter(card => this.isCardCommand(card)).length >= condition.value;

            else if (condition.id === 'minimumXCardsOpponentHand')
                result = result && opponent.hand.length >= condition.value;

            else if (condition.id === 'pilotHasAttribute')
                result = result && task.cardPilot && this.hasAttribute(task.cardPilot, condition.value);

            else if (condition.id === 'maximumXUnitsOnField')
                result = result && player.field.length <= condition.value;

        });

        return result;
    }
}


export default conditions;
