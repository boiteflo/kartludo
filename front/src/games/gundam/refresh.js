class refresh {

    static refreshFieldAndHand(game, player) {
        this.refresh(player.hand, player.positions.hand, false, 7);
        this.refresh(player.field, player.positions.field, false, 3);
        this.refresh(player.base, player.positions.base, true);
        
        /*
        const cardsToRemoveIndex = player.trash.filter(x => !x.to).map(x => x.index);
        global.game.cards = global.game.cards.filter(x => !cardsToRemoveIndex.includes(x.index));
        */

        // this.setSelectable(player);

        player.resource = player.resourcesAvailable + '/' + player.resourcesMax;
        player.baseIcon = player.base.length > 0 ? 'cards/' + player.base[0].id + '.webp' : 'deck6.png';
        player.shieldIcon = this.getIcon(player.shield.length);
        player.deckIcon = this.getIcon(player.deck.length);
        player.trashIcon = this.getIcon(player.trash.length);
    }
    
    static refresh(cards, position, useZoneSize, wrapCut) {
        let zoneHeight = position.height;
        if (position.location == this.locationField)
            zoneHeight *= 0.75;
        const cardSize = useZoneSize ? position : this.getCardSize(position.width, zoneHeight, cards.length, position.cardHeightPercent);
        cards.forEach((card, index) => {
            const degree = card.active ? 0 : 90;
            card.bgposition = '0 0';
            card.to = this.getWrapPosition(position, cardSize, cards.length, index, degree, wrapCut);
            card.location = position.location;

            if (!this.cardHighlight.find(x => x.index === card.index))
                card.zindex = card.pair ? 2 : 1;

            if (position.location == this.locationField && card.pair)
                card.pair.to = this.getPairPosition(card.to);
        });
    }

    static getIcon(length){
        return length < 1 ? 'deck6.png'
            : length < 2 ? 'deck5.png'
            : length < 6 ? 'deck4.png'
            : length < 15 ? 'deck3.png'
            : length < 40 ? 'deck2.png'
            : 'deck1.png';
    }
}


export default refresh;
