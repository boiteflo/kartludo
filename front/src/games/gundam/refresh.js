class refresh {

    static refreshFieldAndHand(player) {
        player.baseIcon = player.base.length > 0 ? 'cards/' + player.base[0].id + '.webp' : 'deck6.png';
        player.shieldIcon = this.getIcon(player.shield.length);
        player.deckIcon = this.getIcon(player.deck.length);
        player.trashIcon = this.getIcon(player.trash.length);
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
