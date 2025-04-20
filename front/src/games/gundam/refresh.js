class refresh {

    static refreshFieldAndHand(game, task, player) {
        this.refreshPlayerArea(player.hand, player.positions.hand, false, 7, false);
        this.refreshPlayerArea(player.field, player.positions.field, false, 3, true);
        this.refreshPlayerArea(player.base, player.positions.base, true);

        const cardsToRemoveIndex = player.trash.filter(x => !x.to).map(x => x.index);
        game.cards = game.cards.filter(x => !cardsToRemoveIndex.includes(x.index));

        this.setSelectable(game, player);

        player.resource = player.resourcesAvailable + '/' + player.resourcesMax;
        player.baseIcon = 'deck6.png';
        player.shieldIcon = this.getIcon(player.shield.length);
        player.deckIcon = this.getIcon(player.deck.length);
        player.trashIcon = this.getIcon(player.trash.length);

        game.textEffect = task.textEffect;
    }

    static refreshPlayerArea(cards, position, useZoneSize, wrapCut, centerEmptyZone) {
        let zoneHeight = position.height;
        if (position.location == this.locationField)
            zoneHeight *= 0.75;
        const cardSize = useZoneSize ? position : this.getCardSize(position.width, zoneHeight, cards.length, position.cardHeightPercent);
        cards.forEach((card, index) => {
            const degree = card.active ? 0 : 90;
            card.bgposition = '0 0';
            card.fx = false;
            card.to = this.getWrapPosition(position, cardSize, cards.length, index, degree, wrapCut, centerEmptyZone);
            card.to = this.adjustRotationSize(card.to, card.active);
            card.location = position.location;
            if (position.location == this.locationField && card.pair)
                card.pair.to = this.getPairPosition(card.to);
        });
    }

    static adjustRotationSize(to, active, percent = 0.7) {
        if (active)
            return to.previous ? to.previous : to;

        if (to.previous)
            return to;

        const reverPercentHalf = (1 - percent) / 2;
        const loseX = to.width * reverPercentHalf;
        const loseY = to.height * reverPercentHalf;
        return { ...to, previous: to, x: to.x + loseX, y: to.y + loseY, width: to.width * percent, height: to.height * percent };
    }

    static getIcon(length) {
        return length < 1 ? 'deck6.png'
            : length < 2 ? 'deck5.png'
                : length < 7 ? 'deck4.png'
                    : length < 15 ? 'deck3.png'
                        : length < 35 ? 'deck2.png'
                            : 'deck1.png';
    }

    static endAnimation(game) {
        game.cards.forEach(card => {
            if (card.positionDrag) card.position = { ...card.position, x: card.positionDrag.x, y: card.positionDrag.y };
            if (card.to) card.position = card.to;
            delete (card.to);
            delete (card.positionOld);
            delete (card.positionDrag);
        });
        delete (game.wait);
        delete (game.showTitle);
        game.refresh = true;
    }

    static resetZIndex(game) {
        game.cards.forEach(card => {
            card.zindex = card.pairedWith ? 1 : 2;
        });
    }

    static taskEndRefresh(game) {
        if (!game.triggerRefreshAlreadyDone) {
            this.lunchEffectTriggerMultiple(game.cards, this.trigger_refresh);
            game.triggerRefreshAlreadyDone = true;
        }

        this.needTaskEndRefresh = false;
        game.refreshOnlyTextEffect = false;
        delete (game.textEffect);
        this.cardHighlight = [];

        const players = [game.player1, game.player2];
        players.forEach(player => {
            player.field.forEach(card => this.recalculateApHp(game, player, card));
            this.refreshFieldAndHand(game, {}, player);
        });

        game.cards.forEach(card => {
            card.fxRed = false;
        });

        this.refreshDragAndDrop(game);

        game.refresh = true;
        game.taskAttack = null;
    }

    static refreshDragAndDrop(game) {
        const drags = [];

        // Hand
        const unitWithoutPilots = game.player1.field.filter(x => !x.pair);
        game.player1.hand.forEach(card => {
            let drops = card.active ? [this.game.grid.player1Field.drop] : [];

            if (card.active) {
                let targets = [];

                if (this.isCardCommand(card))
                    targets = game.player1.field;
                else if (this.isCardPilot(card))
                    targets = unitWithoutPilots;

                drops = drops.concat(targets.map(unit => { return { ...this.getPos(unit), card: unit, text: 'Pair' }; }));
            }

            if (drops.length > 0)
                drags.push({ ...this.getPos(card), card, show: false, targets: drops });
        });

        // Field
        game.player1.field.forEach(attacker => {
            let drops = attacker.active ? [this.game.grid.player2Field.drop] : [];

            const ennemyTarget = game.player2.field.filter(x => this.isValidTarget(game.player2, attacker, x));
            if (attacker.active && ennemyTarget.length > 0) {
                drops = drops.concat(ennemyTarget.map(unit => { return { ...this.getPos(unit), card: unit, text: 'Attack' }; }));
            }

            if (drops.length > 0)
                drags.push({ ...this.getPos(attacker), card: attacker, show: false, targets: drops });
        });


        game.player1.drags = drags;
    }

    static getPos(card) { return card.to ? card.to : card.position; }
}


export default refresh;
