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
        grid.width = screenWidth - grid.border2;
        grid.height = screenHeight - grid.border2;

        const boxHeight = (grid.height - (grid.border * 6)) / 6;
        grid.centerZone = {
            x: 0,
            y: (0.5 * grid.height) - (0.5 * boxHeight),
            width: grid.width - grid.border2,
            height: boxHeight,
            zone: 'center0',
            location: 'locationCenter',
            show: true
        };
        grid.centerZone.heightQuarter = grid.centerZone.height / 4;

        let width = (grid.width - 100 - (10 * grid.border)) / 8;
        const textHeight = grid.border * 4;
        const iconHeight = grid.centerZone.heightQuarter * 2 - textHeight;

        // Player 1
        const player1TextLine = grid.centerZone.y + grid.centerZone.heightQuarter + grid.border;
        const player1DeckLine = player1TextLine + (grid.border * 5);
        let x = this.getDeckX(grid, width, 0, true);
        grid.player1Base = {
            x, y: player1DeckLine, width, height: iconHeight,
            text: { x, y: player1TextLine, width, height: textHeight },
            location : this.locationBase
        };

        x = this.getDeckX(grid, width, 1, true);
        grid.player1Shield = {
            x, y: player1DeckLine, width, height: iconHeight,
            text: { x, y: player1TextLine, width, height: textHeight },
            location : this.locationShield
        };

        x = this.getDeckX(grid, width, 2, true);
        grid.player1Deck = {
            x, y: player1DeckLine, width, height: iconHeight,
            text: { x, y: player1TextLine, width, height: textHeight },
            location : this.locationDeck
        };

        x = this.getDeckX(grid, width, 3, true);
        grid.player1Trash = {
            x, y: player1DeckLine, width, height: iconHeight,
            text: { x, y: player1TextLine, width, height: textHeight },
            location : this.locationTrash
        };

        // Player 2
        const player2TextLine = grid.centerZone.y + grid.centerZone.height - grid.centerZone.heightQuarter - grid.border * 5;
        const player2DeckLine = player2TextLine - (grid.border * 3) - iconHeight;
        x = this.getDeckX(grid, width, 0, false);
        grid.player2Base = {
            x, y: player2DeckLine, width, height: iconHeight,
            text: { x, y: player2TextLine, width, height: textHeight },
            location : this.locationBase
        };

        x = this.getDeckX(grid, width, 1, false);
        grid.player2Shield = {
            x, y: player2DeckLine, width, height: iconHeight,
            text: { x, y: player2TextLine, width, height: textHeight },
            location : this.locationShield
        };

        x = this.getDeckX(grid, width, 2, false);
        grid.player2Deck = {
            x, y: player2DeckLine, width, height: iconHeight,
            text: { x, y: player2TextLine, width, height: textHeight },
            location : this.locationDeck
        };

        x = this.getDeckX(grid, width, 3, false);
        grid.player2Trash = {
            x, y: player2DeckLine, width, height: iconHeight,
            text: { x, y: player2TextLine, width, height: textHeight },
            location : this.locationTrash
        };

        // Buttons
        width = ((grid.width - 100) / 4) - (2 * grid.border2);
        let height = grid.centerZone.heightQuarter - grid.border2;
        let y = grid.centerZone.y + grid.border;
        grid.rightButton = {
            width, height, y, x: grid.width - width - grid.border2,
        };
        grid.leftButton = {
            width, height, y: y, x: grid.rightButton.x - width - grid.border
        };

        // Hand and Field
        x = 0;
        width = grid.width;
        height = grid.height / 2;
        grid.halfPlayer1 = { x, width, height, y: grid.height / 2 };
        grid.halfPlayer2 = { x, width, height, y: 0 };

        grid.player1Hand = {
            x: 0, y: grid.height - grid.border - boxHeight,
            width: grid.width - grid.border2, height: boxHeight,
            location: this.locationHand
        }
        grid.player1Field = {
            x: 0, y: grid.centerZone.y + grid.centerZone.height + grid.border,
            width: grid.width - grid.border2, height: boxHeight * 1.5,
            location: this.locationField
        }

        grid.player2Hand = {
            x: 0, y: grid.border,
            width: grid.width - grid.border2, height: boxHeight,
            location: this.locationHand
        }
        grid.player2Field = {
            x: 0, y: grid.player2Hand.y + grid.player2Hand.height + grid.border,
            width: grid.width - grid.border2, height: boxHeight * 1.5,
            location: this.locationHand
        }

        // Highlight center cards
        grid.textZone = { ...grid.player2Hand };
        grid.highlightCardCenter = { y: grid.player2Field.y, height: grid.height - grid.player2Field.y };
        grid.highlightCardLeft = { ...this.getCardSize(grid.width, grid.highlightCardCenter.height, 2, 1), y: grid.highlightCardCenter.y };
        grid.highlightCardRight = { ...grid.highlightCardLeft, x:grid.highlightCardLeft.x + grid.highlightCardLeft.width };
        grid.highlightCardCenter = { ...this.getCardSize(grid.width, grid.highlightCardCenter.height, 1, 1), y: grid.highlightCardCenter.y };

        return grid;
    }

    static getDeckX(grid, width, index, isPlayer1) {
        let value = 55 + (index * (width + grid.border));
        value = isPlayer1 ? value : -1 * value - width;
        return (grid.width / 2) + value;
    }

    static getPositions(grid, isPlayer1) {
        let result = {};
        if (grid.box.width > 50)
            result = {
                base: this.createZone(isPlayer1, grid.x15, grid.y8, grid.x0, grid.y7, grid.box.width, grid.box.height, 'base', this.locationBase),
                shield: this.createZone(isPlayer1, grid.x15, grid.y9, grid.x0, grid.y6, grid.box.width, grid.box.height, 'shield', this.locationShield),
                deck: this.createZone(isPlayer1, grid.x15, grid.y10, grid.x0, grid.y5, grid.box.width, grid.box.height, 'deck', this.locationDeck),
                trash: this.createZone(isPlayer1, grid.x15, grid.y11, grid.x0, grid.y4, grid.box.width, grid.box.height, 'trash', this.locationTrash),
                resource: this.createZone(isPlayer1, grid.x15, grid.y12, grid.x0, grid.y3, grid.box.width, grid.box.height, 'res', this.locationResource),
                hand: this.createZone(isPlayer1, grid.x0, grid.y13, grid.x1, grid.y0, grid.hand.width, grid.hand.height, 'hand', this.locationHand),
                field: this.createZone(isPlayer1, grid.x0, grid.y8, grid.x1, grid.y3, grid.field.width, grid.field.height, 'field', this.locationField)
            };
        else
            result = {
                base: this.createZone(isPlayer1, grid.x14, grid.y8, grid.x0, grid.y7, grid.box.width * 2, grid.box.height, 'base', this.locationBase),
                shield: this.createZone(isPlayer1, grid.x14, grid.y9, grid.x0, grid.y6, grid.box.width * 2, grid.box.height, 'shield', this.locationShield),
                deck: this.createZone(isPlayer1, grid.x14, grid.y10, grid.x0, grid.y5, grid.box.width * 2, grid.box.height, 'deck', this.locationDeck),
                trash: this.createZone(isPlayer1, grid.x14, grid.y11, grid.x0, grid.y4, grid.box.width * 2, grid.box.height, 'trash', this.locationTrash),
                resource: this.createZone(isPlayer1, grid.x14, grid.y12, grid.x0, grid.y3, grid.box.width * 2, grid.box.height, 'res', this.locationResource),
                hand: this.createZone(isPlayer1, grid.x0, grid.y13, grid.x2, grid.y0, grid.hand.width, grid.hand.height, 'hand', this.locationHand),
                field: this.createZone(isPlayer1, grid.x0, grid.y8, grid.x2, grid.y3, grid.field.width - 5 - grid.box.width, grid.field.height, 'field', this.locationField)
            };

        result.field.cardHeightPercent = this.grid.field.cardHeightPercent;

        if (!isPlayer1)
            result.hand.width = result.hand.width - grid.box.width - (3 * grid.border2);
        return result;
    }

    static createZone(isPlayer1, x1, y1, x2, y2, width, height, zone, location,) {
        const index = isPlayer1 ? '1' : '2';
        return {
            x: isPlayer1 ? x1 : x2,
            y: isPlayer1 ? y1 : y2,
            zone: zone + index,
            width, height, location, isPlayer1, show: true
        };
    }

    static createField(p1, p2) {
        let result = [p1.deck, p1.trash, p1.shield, p1.resource, p1.hand, p1.field, p1.base]
            .concat([p2.deck, p2.trash, p2.shield, p2.resource, p2.hand, p2.field, p2.base])
            .concat([this.grid.centerMini]);
        return result;
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

        if(count > 1){
            x= (width - (count * desiredWidth)) /2;
        }

        return { x, y, width: desiredWidth, height: desiredHeight };
    }

    static isPair(x) { return x % 2 == 0 }

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
