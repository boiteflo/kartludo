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
    }
    
    static refreshPlayerArea(cards, position, useZoneSize, wrapCut, centerEmptyZone) {
        let zoneHeight = position.height;
        if (position.location == this.locationField)
            zoneHeight *= 0.75;
        const cardSize = useZoneSize ? position : this.getCardSize(position.width, zoneHeight, cards.length, position.cardHeightPercent);
        cards.forEach((card, index) => {
            const degree = card.active ? 0 : 90;
            card.bgposition = '0 0';
            card.fx=false;
            card.to = this.getWrapPosition(position, cardSize, cards.length, index, degree, wrapCut, centerEmptyZone);
            card.location = position.location;
            if (position.location == this.locationField && card.pair)
                card.pair.to = this.getPairPosition(card.to);
        });
    }

    static getIcon(length){
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

    static resetZIndex(game){
        game.cards.forEach(card=> {
            card.zindex = card.isPaired ? 1 : 2;
        });
    }
}


export default refresh;
