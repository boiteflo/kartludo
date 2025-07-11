class cardMove {

    static spawnOrMove(game, task, player) {
        const cardSpawn = this.moveCard(game, player, task.card1, task.from, task.to);
        this.spawnIfNot(cardSpawn);
        return cardSpawn;
    }

    static move(game, task, player) {
        return this.moveCard(game, player, task.card1, task.from, task.to);
    }

    static spawnIfNot(card) {
        if (!card)
            return;

        if (!this.game.cards.find(x => x.index === card.index))
            this.game.cards = this.addIn(this.game.cards, card);

        const player = card.isPlayer1 ? this.game.player1 : this.game.player2;
        if (!card.position)
            card.position = this.clone(player.positions.deck);
        card.zindex = 11;
        return card;
    }

    static moveCard(game, player, card, locationFrom, locationTo) {
        if (!locationFrom && card && card.location)
            locationFrom = card.location;

        let from = locationFrom ? locationFrom : card?.location;
        from = from == "pair" ? null : from;
        const to = locationTo;

        if (!card)
            card = player[from].splice(0, 1)[0];
        else if (from)
            player[from] = this.removeByIndex(player[from], card);

        if (!card && locationFrom === this.locationDeck)
            this.end(player.isPlayer1);

        if (!card)
            return;

        const onField = [this.locationField, this.locationBase];
        if (!card.isTemporaryCard)
            player[to] = this.addIn(player[to], card);
        else {
            if (onField.includes(locationTo))
                player[to] = this.addIn(player[to], card);
            else
                card.fadeOut = true;
        }

        if (from)
            card.position = card.position ? card.position : this.clone(player.positions[from]);

        card.isPlayer1 = player.isPlayer1;
        card.active = true;
        card.location = locationTo;
        card.hidestat = !onField.includes(card.location);
        card.verso = card.location === this.locationHand && !card.isPlayer1 && !card.pairedWith && !card.pair;

        this.handleMainEffectsCard(game, card, onField.includes(card.location));

        if (card.pair) {
            card.pair.pairedWith = null;
            card.pair.link = false;
            this.moveCard(game, player, card.pair, locationFrom, this.locationTrash);
            delete (card.pair);
            card.link = false;
        }

        const needToRefreshAllField = [this.locationHand, this.locationField].includes(locationTo);
        if (!needToRefreshAllField) {
            card.to = this.clone(player.positions[to]);
            if (locationTo === this.locationTrash) {
                card.to.height = 0;
                card.hidestat = true;
            }
        }

        return card;
    }
}


export default cardMove;
