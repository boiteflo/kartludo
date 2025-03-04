class GameGundamGridAndSize {

    static size;

    static calculateGameSize(w, h) {
        const size = {};
        const width = w - 300;
        const height = h - 64;
        const desiredHeight = width * 9 / 16;
        const desiredWidth = (height * 16 / 9);
        size.gameWidth = desiredHeight < height ? width : desiredWidth;
        size.gameHeight = size.gameWidth * 9 / 16;

        size.fieldHeight = (size.gameHeight - 4 * 7) / 3;
        size.handHeight = size.fieldHeight / 2;
        size.boxHeight = (size.handHeight - 5) / 2;
        size.cardHeight = size.fieldHeight * 0.75;
        size.cardWidth = size.cardHeight * 107 / 150;
        size.boxWidth = size.cardWidth;
        size.handWidth = size.gameWidth - 10 - 10 - size.boxWidth;
        size.miniboxHeight = size.fieldHeight - size.cardHeight;
        
        size.boxSize = { width: size.boxWidth, height: size.boxHeight };
        size.cardSize = { width: size.cardWidth, height: size.cardHeight };

        size.centerX = (size.gameWidth - size.boxWidth) / 2;
        size.centerY = (size.gameHeight - size.cardHeight) / 2;
        size.center = { x: size.centerX, y: size.centerY };
        size.infoLineX1 = 5;
        size.infoLineX2 = 5 + size.boxWidth + 5;
        size.infoLineX3 = size.gameWidth - 10 - size.boxWidth;

        size.infoLineY01 = 7;
        size.infoLineY02 = size.infoLineY01 + 5 + size.boxHeight;
        size.infoLineY03 = size.infoLineY02 + 5 + size.boxHeight;
        size.infoLineY04 = size.infoLineY03 + 5 + size.boxHeight;
        size.infoLineY05 = size.infoLineY03 + 5 + size.fieldHeight;
        size.infoLineY07 = size.infoLineY05 + 5 + size.fieldHeight;
        size.infoLineY06 = size.infoLineY07 - 5 - size.boxHeight;
        size.infoLineY08 = size.infoLineY07 + 5 + size.boxHeight;
        size.infoLineY04bis = size.infoLineY05 - 5 - size.cardHeight;
        size.infoLineY06bis = size.infoLineY05 + size.cardHeight;

        size.fieldWidth = size.infoLineX3 - size.infoLineX2 - 10;
        this.size = size;
        return size;
    }

    static getPlayerPosition(isPlayer1) {
        return {
            deck: { 
                x: isPlayer1 ? this.size.infoLineX3 : this.size.infoLineX1, 
                y: isPlayer1 ? this.size.infoLineY06 - this.size.boxHeight -5 : this.size.infoLineY04, rotation: 0 },
            grave: { 
                x: isPlayer1 ?  this.size.infoLineX3 : this.size.infoLineX1, 
                y: isPlayer1 ? this.size.infoLineY06 : this.size.infoLineY03, rotation: 0 },
            hand: { 
                x: isPlayer1 ? this.size.infoLineX1 : this.size.infoLineX2, 
                y: isPlayer1 ? this.size.infoLineY07 : this.size.infoLineY01, rotation: 0 },
            base: { 
                x: isPlayer1 ? this.size.infoLineX1 : this.size.infoLineX3, 
                y: isPlayer1 ? this.size.infoLineY05 : this.size.infoLineY04bis, rotation: 0 },
            shield: { 
                x: isPlayer1 ? this.size.infoLineX1 : this.size.infoLineX3, 
                y: isPlayer1 ? this.size.infoLineY06bis : this.size.infoLineY03, rotation: 0 },
            field: { 
                x: isPlayer1 ? this.size.infoLineX2 : this.size.infoLineX2, 
                y: isPlayer1 ? this.size.infoLineY05 : this.size.infoLineY03, rotation: 0 },
            res: { 
                x: isPlayer1 ? this.size.infoLineX3: this.size.infoLineX1, 
                y: isPlayer1 ? this.size.infoLineY07 : this.size.infoLineY01, rotation: 0 },
        };
    }
}


export default GameGundamGridAndSize;