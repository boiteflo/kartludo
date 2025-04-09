class aiStrategy {
    static handleStrategy(game, player, cardsAvailable) {
        let result =null;
        
        result = cardsAvailable.filter(x => x.strategy && x.strategy == "playAsap");
        if (result.length > 0)
            return { unit: result[0] };

        result = cardsAvailable.filter(x => x.strategy && x.strategy == "playIfOpponentUnits");
        if (result.length > 0 && game.player2.field.length > 0)
            return { unit: result[0] };

        result = cardsAvailable.filter(x => x.strategy && x.strategy == "playIfOpponentUnitsRested");
        if (result.length > 0 && game.player2.field.filter(x=> !x.active).length > 0)
            return { unit: result[0] };
    }
}


export default aiStrategy;
