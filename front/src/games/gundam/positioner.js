class positioner {

    static locationEmpty = 'empty';
    static locationTrash = 'trash';
    static locationDeck = 'deck';
    static locationShield = 'shield';
    static locationHand = 'hand';
    static locationField = 'field';
    static locationBase = 'base';
    static locationResource = 'resource';
    static locationPair = 'pair';

    static createGrid(screenWidth, screenHeight) {
        const grid = {};

        grid.border = 5;
        grid.border2 = grid.border * 2;
        grid.width = screenWidth;
        grid.height = screenHeight;
        grid.widthMargin = grid.width - (grid.border * 2);
        grid.heightMargin = grid.height - (5 * grid.border);
        grid.boxHeight = (grid.height - (grid.border * 6)) / 5.5;
        grid.boxWidth = grid.boxHeight * 107 / 150;

        grid.isVertical = grid.height > grid.width;

        if(grid.boxWidth > grid.widthMargin / 7)
            grid.boxWidth = grid.widthMargin / 7;
        grid.card100 = { width: grid.boxWidth, height: grid.boxHeight };

        // Player2 - Hand
        let x = grid.border + grid.boxWidth, y = grid.border;
        let width = grid.widthMargin / 2 - grid.boxWidth, height = grid.boxHeight / 2;
        grid.player2Hand = { x, y, width, height, isPlayer1: false, location: this.locationHand };
        y += grid.border + height;

        // Player2 - Field
        width = grid.widthMargin - grid.border - grid.boxWidth;
        height = grid.boxHeight * 1.5;
        grid.player2Field = { x, y, width, height, isPlayer1: false, location: this.locationField };
        y += grid.border + height;

        // Center Zone
        x = grid.border;
        grid.centerZone = { x, y, width: grid.widthMargin, height: grid.boxHeight };
        y += grid.border + grid.boxHeight;
        grid.centerZoneP2= {...grid.centerZone, x:0, width: (grid.centerZone.width-100 )/2 + grid.border};

        // Player1 - Field
        grid.player1Field = { x, y, width, height, isPlayer1: true, location: this.locationField };
        y += grid.border + height;

        // Player1 - Hand
        height = grid.boxHeight;
        grid.player1Hand = { x, y, width, height, isPlayer1: true, location: this.locationHand };

        if(grid.isVertical)
            this.createVerticalGrid(grid);
        else
            this.createHorizontalGrid(grid);

        // Buttons
        x = grid.player1Deck.x;
        y = grid.player1Trash.y + grid.player1Trash.height + grid.border;
        height = (grid.height - grid.border2 - y) / 2;
        width = grid.isVertical ? grid.boxWidthVertical : grid.boxWidth;
        grid.buttonEffect = { x, y, width, height };
        y += height + grid.border;
        grid.buttonEndTurn = { x, y, width, height };

        width = 50;
        x = grid.widthMargin - width;
        y = grid.border;
        height = grid.player2Hand.height;
        grid.buttonLogs = { x, y, width, height };
        
        width = grid.boxHeight;
        height = grid.boxHeight;
        grid.resources = { x: (grid.width / 2) - (width / 2), y: grid.centerZone.y, width, height };

        grid.halfPlayer1 = { x: 0, y: grid.player1Field.y, width: grid.width, height: grid.height / 2 };
        grid.halfPlayer2 = { x: 0, y: 0, width: grid.width, height: grid.centerZone.y };

        grid.centerZone.heightQuarter = grid.centerZone.height / 5;

        // Highlight center cards
        grid.textZone = { ...grid.player2Hand, width: grid.width - grid.border2 };
        grid.logZone = { ...grid.player2Hand, x: grid.width / 2 + grid.border };
        grid.highlightCardCenter = { y: grid.player2Field.y, height: grid.height - grid.player2Field.y };
        grid.highlightCardLeft = { ...this.getCardSize(grid.width, grid.highlightCardCenter.height, 2, 1), y: grid.highlightCardCenter.y };
        grid.highlightCardRight = { ...grid.highlightCardLeft, x: grid.highlightCardLeft.x + grid.highlightCardLeft.width };
        grid.highlightCardCenter = { ...this.getCardSize(grid.width, grid.highlightCardCenter.height, 1, 1), y: grid.highlightCardCenter.y };

        // Drop Points
        width = grid.boxWidth;
        height = grid.boxHeight;
        grid.player1Field.drop = {
            x: grid.player1Field.x + (grid.player1Field.width / 2) - (width /2),
            y: grid.player1Field.y + (grid.player1Field.height / 2) - (height /2),
            width, height, text:'Play'
        }
        grid.player2Field.drop = {
            x: grid.player2Field.x + (grid.player2Field.width / 2) - (width /2),
            y: grid.player2Field.y + (grid.player2Field.height / 2) - (height /2),
            width, height, text:'Attack'
        }

        return grid;
    }

    static createVerticalGrid(grid){
        grid.boxWidthVertical = (grid.widthMargin - (8* grid.border)) / 6;
        grid.boxHeightVertical = grid.boxWidthVertical * 150/107;

        let x = grid.player1Field.x + grid.player1Field.width + grid.border;
        let y = grid.centerZone.y;
        let width = grid.boxWidthVertical;
        let height = grid.boxHeightVertical;

        // Player1 - Shield
        grid.player1Shield = { x, y, width, height, isPlayer1: true, location: this.locationShield };

        // Player1 - Base
        x = x - width - grid.border;
        grid.player1Base = { x, y, width, height, isPlayer1: true, location: this.locationBase };

        // Player1 - Deck
        x = grid.player1Shield.x;
        y += height + grid.border;
        grid.player1Deck = { x, y, width, height, isPlayer1: true, location: this.locationDeck };

        // Player1 - Trash
        y += height + grid.border;
        grid.player1Trash = { x, y, width, height, isPlayer1: true, location: this.locationTrash };
        y += height + grid.border;

        // Player2 - Shield
        y = grid.centerZone.y;
        x = grid.border;
        grid.player2Shield = { x, y, width, height, isPlayer1: true, location: this.locationShield };

        // Player2 - Base
        x = x + width + grid.border;
        grid.player2Base = { x, y, width, height, isPlayer1: true, location: this.locationBase };

        // Player2 - Deck
        x = grid.border;
        y = y - height - grid.border;
        grid.player2Deck = { x, y, width, height, isPlayer1: false, location: this.locationDeck };

        // Player2 - Trash
        y = y - height - grid.border;
        grid.player2Trash = { x, y, width, height, isPlayer1: true, location: this.locationTrash };
    }

    static createHorizontalGrid(grid){
        // Player1 - Deck
        let x = grid.player1Field.x + grid.player1Field.width + grid.border;
        let y = grid.centerZone.y;
        let width = grid.boxWidth;
        let height = grid.boxHeight;
        grid.player1Deck = { x, y, width, height, isPlayer1: true, location: this.locationDeck };
        y += height + grid.border;

        // Player1 - Trash
        grid.player1Trash = { x, y, width, height, isPlayer1: true, location: this.locationTrash };
        y += height + grid.border;

        // Player1 - Shield
        y = grid.centerZone.y;
        x = x - width - grid.border;
        width = grid.boxWidth;
        height = grid.boxHeight;
        grid.player1Shield = { x, y, width, height, isPlayer1: true, location: this.locationShield };

        // Player1 - Base
        x = x - width - grid.border;
        grid.player1Base = { x, y, width, height, isPlayer1: true, location: this.locationBase };

        // Player2 - Deck
        x = grid.border;
        y = grid.centerZone.y;
        grid.player2Deck = { x, y, width, height, isPlayer1: false, location: this.locationDeck };
        y -= height - grid.border;

        // Player2 - Trash
        grid.player2Trash = { x, y, width, height, isPlayer1: true, location: this.locationTrash };
        y -= height - grid.border;

        // Player2 - Shield
        y = grid.centerZone.y;
        x = x + width + grid.border;
        grid.player2Shield = { x, y, width, height, isPlayer1: true, location: this.locationShield };

        // Player2 - Base
        x = x + width + grid.border;
        grid.player2Base = { x, y, width, height, isPlayer1: true, location: this.locationBase };
    }

    static getPairPosition(position) {
        const result = this.clone(position);
        result.y += result.height * 0.25;
        result.rotation = 0;
        return result;
    }

    static getCardSize(width, height, count, cardHeightPercent) {
        let desiredWidth = width / (count + 0.15);
        let desiredHeight = desiredWidth * 150 / 107;
        if (cardHeightPercent)
            desiredHeight *= cardHeightPercent;

        if (desiredHeight > height) {
            desiredHeight = height;
            desiredWidth = desiredHeight * 107 / 150;
            if (cardHeightPercent)
                desiredWidth = desiredWidth * (1 + (1 - cardHeightPercent));
        }

        let x = (width - desiredWidth) / 2;
        let y = (height - desiredHeight) / 2;

        if (count > 1) {
            x = (width - (count * desiredWidth)) / 2;
        }

        return { x, y, width: desiredWidth, height: desiredHeight };
    }

    static getWrapPosition(position, cardSize, total, index, degree, wrapCut, centerEmptyZone) {
        const totalCards = centerEmptyZone ? total + 1 : total;
        const mid = Math.floor(totalCards / 2);
        const indexModified = centerEmptyZone && index >= mid ? index + 1 : index;
        if (totalCards < wrapCut || position.height < cardSize.height * 2)
            return this.getCardPositionXY(position, cardSize, totalCards, indexModified, degree);

        const indexLine = indexModified < mid ? indexModified : indexModified - mid;
        const totalLine = totalCards - mid;
        const cardSizeLine = this.getCardSize(position.width, position.height / 2, totalLine, position.cardHeightPercent);
        const positionLine = indexModified < mid ? position : { ...position, y: position.y + cardSizeLine.height };
        return this.getCardPositionXY(positionLine, cardSizeLine, totalLine, indexLine, degree);
    }

    static getCardPositionXY(position, cardSize, total, index, degree) {
        return {
            x: position.x + this.getXCenter(position.width, cardSize.width, total, index),
            y: position.y,
            width: cardSize.width,
            height: cardSize.height,
            rotation: degree
        };
    }

    static getXCenter(totalWidth, elementWidth, total, index) {
        const sizeWidth = totalWidth / total;
        return sizeWidth / 2 + sizeWidth * index - elementWidth / 2;
    }

    static getWrapMaxPositions(width, height, cards, ratio) {
        const margin = 10;
        let maxSize = { width: 0, height: 0 };
        for (let i = 2; i < 10; i++) {
            const size = this.getCardSizeWrap(width, height, cards, margin, ratio, i);
            if (maxSize.width < size.width)
                maxSize = size;
        }

        const marginHorizontal = (width - (3 * margin) - (maxSize.width * maxSize.wrapCut)) / (maxSize.wrapCut - 1);

        let x = margin;
        let y = margin;
        let lineIndex = 0;
        cards.forEach(card => {
            card.position = { x, y, width: maxSize.width, height: maxSize.height };
            lineIndex++;
            if (lineIndex < maxSize.wrapCut)
                x += marginHorizontal + maxSize.width;
            else {
                lineIndex = 0;
                y += margin + maxSize.height;
                x = margin;
            }
        })
    }

    static getCardSizeWrap(width, height, cards, margin, ratio, wrapCut) {
        const lineRequired = Math.ceil(cards.length / wrapCut);
        const widthMargin = width - ((wrapCut + 1) * margin);
        const heightMargin = height - ((lineRequired + 1) * margin);
        const ratioInverted = 1 + (1 - ratio);

        let heightDesired = heightMargin / lineRequired;
        let widthDesired = heightDesired * ratio;

        if (widthDesired > widthMargin / wrapCut) {
            widthDesired = widthMargin / wrapCut;
            heightDesired = widthDesired * ratioInverted;
        }

        return { width: widthDesired, height: heightDesired, wrapCut };
    }
}


export default positioner;
