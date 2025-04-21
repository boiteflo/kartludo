class tuto {
    static handStartLength = 0;
    static tutoFullScreen(game) { return { x: 0, y: 0, width: game.grid.width, height: game.grid.height };}
    static tutoHalfScreen(game) { return { x: 0, y: 0, width: game.grid.width, height: game.grid.centerZoneP2.y };}
    static tutoSmall(game) { return game.grid.resources;}
    static tutoEnnemyFieldPosition(game) {return game.player2.positions.field;}

    static mulligan(game, task) {
        game.player1.deck = [
            this.createCard('ST03-007', true, this.locationDeck)
        ].concat(game.player1.deck);

        if (!game.showTextTuto) {
            game.showTextTuto = {
                ...this.tutoFullScreen(game),
                text: 'Welcome to Gundam TCG.'
            };
            task.step=0;
            return { stop: true };
        }

        if (game.showTextTuto.next){
            task.step++;
            game.showTextTuto.next=false;
        }

        if(task.step ==1){
            game.showTextTuto = {
                ...this.tutoSmall(game),
                text: 'This button'
            };
            return { stop: true };
        }
    }
}


export default tuto;
