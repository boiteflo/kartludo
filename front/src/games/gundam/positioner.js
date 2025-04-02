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
        grid.boxHeight = (grid.height - (grid.border * 6)) / 6;

        let height = grid.boxHeight;
        grid.centerZone = {
            x: 0, y: (0.5 * grid.height) - (0.5 * height),
            width: grid.width, height: height
        };
        grid.centerZone.heightQuarter = grid.centerZone.height / 4;

        const textHeight = grid.border * 2;
        const iconHeight = grid.centerZone.heightQuarter * 2;
        const iconWidth = iconHeight * 107 / 150;
        const gundamHead = grid.width * 0.05; 
        const halfWidth = grid.width / 2 - gundamHead;

        this.createPlayer1Field(grid, halfWidth, iconWidth, iconHeight, textHeight);
        this.createPlayer2Field(grid, halfWidth, iconWidth, iconHeight, textHeight);

        // Buttons
        let width = ((grid.width) / 4) - grid.border2;
        height = grid.centerZone.heightQuarter - grid.border2;
        let y = grid.centerZone.y - textHeight;
        grid.rightButton = { width, height, y, x: grid.width - width - grid.border2 };
        grid.leftButton = { width, height, y: y, x: grid.rightButton.x - width - grid.border };

        // Highlight center cards
        grid.textZone = { ...grid.player2Hand, width: grid.width - grid.border2 };
        grid.logZone = { ...grid.player2Hand, x: grid.width / 2 + grid.border };
        grid.highlightCardCenter = { y: grid.player2Field.y, height: grid.height - grid.player2Field.y };
        grid.highlightCardLeft = { ...this.getCardSize(grid.width, grid.highlightCardCenter.height, 2, 1), y: grid.highlightCardCenter.y };
        grid.highlightCardRight = { ...grid.highlightCardLeft, x: grid.highlightCardLeft.x + grid.highlightCardLeft.width };
        grid.highlightCardCenter = { ...this.getCardSize(grid.width, grid.highlightCardCenter.height, 1, 1), y: grid.highlightCardCenter.y };

        return grid;
    }

    static createPlayer1Field(grid, halfWidth, width, iconHeight, textHeight) {
        const lineText = grid.centerZone.y + grid.centerZone.heightQuarter - grid.border - textHeight;
        const lineDeck = grid.centerZone.y + grid.centerZone.heightQuarter;   

        const properties = 'player1Base,player1Shield,player1Deck,player1Trash'.split(',');
        properties.forEach((property, index) => {
            const x = halfWidth + this.getXCenter(halfWidth, width, 4, (index+1));
            grid[property] = {
                x, y: lineDeck, width, height: iconHeight,
                text: { x, y: lineText, width, height: textHeight }
            };
        });

        let x = 0;
        width = grid.width;
        let height = grid.height / 2;
        grid.halfPlayer1 = { x, width, height, y: grid.height / 2 };

        grid.player1Hand = {
            x, y: grid.height - grid.border - grid.boxHeight,
            width: grid.width - grid.border2, height: grid.boxHeight
        }
        grid.player1Field = {
            x, y: grid.centerZone.y + grid.centerZone.height - grid.border2,
            width: grid.width - grid.border2, height: grid.boxHeight * 1.5,
            location: this.locationField
        }

        grid.player1Resource = {
            x:grid.border, y:grid.player1Hand.y - (grid.border*6),
            width: grid.width - grid.border2, height:grid.border*3
        }
    }

    static createPlayer2Field(grid, halfWidth, width, iconHeight, textHeight) {
        const lineText = grid.centerZone.y + (3 * grid.centerZone.heightQuarter) + grid.border;
        const lineDeck = grid.centerZone.y + (3 * grid.centerZone.heightQuarter) - iconHeight - grid.border;
        
        const properties = 'player2Trash,player2Deck,player2Shield,player2Base'.split(',');
        properties.forEach((property, index) => {
            const x = this.getXCenter(halfWidth, width, 4, index);
            grid[property] = {
                x, y: lineDeck, width, height: iconHeight,
                text: { x, y: lineText, width, height: textHeight }
            };
        });

        let x = 0;
        width = grid.width;
        let height = grid.height / 2;
        grid.halfPlayer2 = { x, width, height, y: 0 };

        grid.player2Hand = {
            x, y: grid.border,
            width: (grid.width / 2) - grid.border2, height: grid.boxHeight
        }
        grid.player2Field = {
            x, y: grid.player2Hand.y + grid.player2Hand.height + (5*grid.border),
            width: grid.width - grid.border2, height: grid.boxHeight * 1.5,
            location: this.locationField
        }
        grid.player2Resource = {
            x:grid.border, y:grid.player2Field.y - (4*grid.border),
            width: grid.width - grid.border2, height:grid.border*3
        }
    }

    static getDeckX(grid, width, index, isPlayer1) {
        const gundamSize = width > 500 ? 55 : 35;
        let value = gundamSize + (index * (width + grid.border));
        value = isPlayer1 ? value : -1 * value - width;
        return (grid.width / 2) + value;
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

    static getWrapPosition(position, cardSize, total, index, degree, wrapCut) {
        if (total < wrapCut || position.height < cardSize.height * 2)
            return this.getCardPositionXY(position, cardSize, total, index, degree);

        const mid = Math.floor(total / 2);
        const indexLine = index < mid ? index : index - mid;
        const totalLine = total - mid;
        const cardSizeLine = this.getCardSize(position.width, position.height / 2, totalLine, position.cardHeightPercent);
        const positionLine = index < mid ? position : { ...position, y: position.y + cardSizeLine.height };
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
