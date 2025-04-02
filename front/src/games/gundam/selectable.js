class selectable {
    static setSelectable(game, player) {
        player.hand.forEach(card => {
            const resourcesMax = Math.max(player.resourcesMax, player.resourcesAvailable);
            const isCostAvailable = card.level <= resourcesMax && card.cost <= player.resourcesAvailable;
            const isTurnPlayer = game.isPlayer1 === card.isPlayer1;

            card.selectable = isCostAvailable && isTurnPlayer;
            if (this.isCardUnit(card) && player.field.length > 5)
                card.selectable = false;
        });

        player.field.forEach(card => {
            card.selectable = card.canAttack;
        });
    }


    static setSelectableFalse() {
        this.game.cards.forEach(card => card.selectable = false);
    }
}


export default selectable;
