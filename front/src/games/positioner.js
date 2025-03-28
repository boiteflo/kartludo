import global from './global';

class positioner {

    static createGrid(width, height) {
        const grid = {};
        grid.width = width;
        grid.height = height - 0;
        grid.border = 5;
        grid.border2 = grid.border * 2;
        const divide = 16;
        grid.widthB = grid.width - (grid.border * (divide + 1));
        grid.heightB = grid.height - grid.border * (divide + 1);

        grid.box = { height: grid.heightB / divide };
        grid.box.width = grid.widthB / divide;
        grid.boxbig = { height: 2 * grid.box.height + grid.border, width: 2 * grid.box.width + grid.border };
        grid.hand = { width: (grid.box.width + grid.border) * divide - grid.border, height: 3 * (grid.box.height + grid.border) - grid.border };
        grid.field = { width: grid.hand.width - grid.box.width - grid.border, height: grid.hand.height + 2 * (grid.box.height + grid.border) };

        grid.hand.card = this.getCardSize(grid.hand.width, grid.hand.height, 6);
        // grid.field.cardHeightPercent = 0.54;
        grid.field.card = this.getCardSize(grid.field.width, grid.field.height, 6, grid.field.cardHeightPercent);

        grid.card6 = this.getCardSize(grid.width, grid.height, 6);

        for (let i = 0; i < divide; i++) {
            grid['x' + i] = 5 + (i * (grid.box.width + 5));
            grid['y' + i] = 5 + (i * (grid.box.height + 5));
        }

        grid.center = this.getCardSize(grid.width - grid.border2, grid.height - grid.border2, 1);
        grid.centerMini = { width, height, location: 0, zone: 'centerMini1' };
        grid.centerMini.card1 = this.getCardSize(grid.centerMini.width, grid.centerMini.height, 2);
        grid.centerMini.x = (width - (grid.centerMini.card1.width * 2)) / 2;
        grid.centerMini.y = 5; // (height - (grid.centerMini.card1.height * 1)) / 2;
        grid.centerMini.card1.x = grid.centerMini.x;
        grid.centerMini.card1.y = grid.centerMini.y;
        grid.centerMini.card2 = global.clone(grid.centerMini.card1);
        grid.centerMini.card2.x += grid.centerMini.card1.width;
        grid.centerMini.card3 = { ...grid.centerMini.card1, x: grid.centerMini.card1.x + (grid.centerMini.card1.width / 2) };
        grid.centerMini.text = { x: grid.centerMini.x, y: grid.centerMini.y + grid.centerMini.card1.height, width: grid.centerMini.card1.width * 2 };
        grid.centerMini.text.height = height - grid.centerMini.text.y - grid.border;
        grid.centerMini.text.height = Math.min(grid.centerMini.text.height, 150);

        return grid;
    }


    static getPositions(grid, isPlayer1) {
        let result = {};
        if (grid.box.width > 50)
            result = {
                base: this.createZone(isPlayer1, grid.x15, grid.y8, grid.x0, grid.y7, grid.box.width, grid.box.height, 'base', global.locationBase),
                shield: this.createZone(isPlayer1, grid.x15, grid.y9, grid.x0, grid.y6, grid.box.width, grid.box.height, 'shield', global.locationShield),
                deck: this.createZone(isPlayer1, grid.x15, grid.y10, grid.x0, grid.y5, grid.box.width, grid.box.height, 'deck', global.locationDeck),
                trash: this.createZone(isPlayer1, grid.x15, grid.y11, grid.x0, grid.y4, grid.box.width, grid.box.height, 'trash', global.locationTrash),
                resource: this.createZone(isPlayer1, grid.x15, grid.y12, grid.x0, grid.y3, grid.box.width, grid.box.height, 'res', global.locationResource),
                hand: this.createZone(isPlayer1, grid.x0, grid.y13, grid.x1, grid.y0, grid.hand.width, grid.hand.height, 'hand', global.locationHand),
                field: this.createZone(isPlayer1, grid.x0, grid.y8, grid.x1, grid.y3, grid.field.width, grid.field.height, 'field', global.locationField)
            };
        else
            result = {
                base: this.createZone(isPlayer1, grid.x14, grid.y8, grid.x0, grid.y7, grid.box.width * 2, grid.box.height, 'base', global.locationBase),
                shield: this.createZone(isPlayer1, grid.x14, grid.y9, grid.x0, grid.y6, grid.box.width * 2, grid.box.height, 'shield', global.locationShield),
                deck: this.createZone(isPlayer1, grid.x14, grid.y10, grid.x0, grid.y5, grid.box.width * 2, grid.box.height, 'deck', global.locationDeck),
                trash: this.createZone(isPlayer1, grid.x14, grid.y11, grid.x0, grid.y4, grid.box.width * 2, grid.box.height, 'trash', global.locationTrash),
                resource: this.createZone(isPlayer1, grid.x14, grid.y12, grid.x0, grid.y3, grid.box.width * 2, grid.box.height, 'res', global.locationResource),
                hand: this.createZone(isPlayer1, grid.x0, grid.y13, grid.x2, grid.y0, grid.hand.width, grid.hand.height, 'hand', global.locationHand),
                field: this.createZone(isPlayer1, grid.x0, grid.y8, grid.x2, grid.y3, grid.field.width - 5 - grid.box.width, grid.field.height, 'field', global.locationField)
            };

        result.field.cardHeightPercent = global.grid.field.cardHeightPercent;

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
            .concat([global.game.grid.centerMini]);
        return result;
    }

    static refresh(cards, position, useZoneSize, wrapCut) {
        let zoneHeight = position.height;
        if (position.location == global.locationField)
            zoneHeight *= 0.75;

        const cardSize = useZoneSize ? position : this.getCardSize(position.width, zoneHeight, cards.length, position.cardHeightPercent);
        cards.forEach((card, index) => {
            const degree = card.active ? 0 : 90;
            card.bgposition = '0 0';
            card.to = this.getWrapPosition(position, cardSize, cards.length, index, degree, wrapCut);
            card.location = position.location;

            if (!global.cardHighlight.find(x => x.index === card.index))
                card.zindex = card.pair ? 2 : 1;

            if (position.location == global.locationField && card.pair)
                card.pair.to = this.getPairPosition(card.to);
        });
    }

    static getPairPosition(position) {
        const result = global.clone(position);
        result.y += result.height * 0.25;
        result.rotation = 0;
        return result;
    }

    static getCardSize(width, height, count, cardHeightPercent) {
        let desiredWidth = width / (count + 0.25);
        let desiredHeight = desiredWidth * 150 / 107;
        if (cardHeightPercent)
            desiredHeight *= cardHeightPercent;

        if (desiredHeight > height) {
            desiredHeight = height;
            desiredWidth = desiredHeight * 107 / 150;
            if (cardHeightPercent)
                desiredWidth = desiredWidth * (1 + (1 - cardHeightPercent));
        }

        const x = (width - desiredWidth) / 2;
        const y = (height - desiredHeight) / 2;
        return { x, y, width: desiredWidth, height: desiredHeight };
    }

    static getPositionHandWithRotation(player, card, index, total) {
        const cardWidth = global.grid.card.width * 0.75;
        const cardWidthHalf = cardWidth / 2;
        const sens = index < total / 2 ? -1 : 1;
        let factorRotation = 0;
        let mid = total / 2;
        let x = 0;

        if (this.isPair(total)) {
            const midX = global.grid.hand.width / 2 - cardWidthHalf + (cardWidthHalf * sens);
            mid = index < total / 2 ? Math.floor(total / 2) - 1 : Math.ceil(total / 2);
            x = midX + (Math.abs(mid - index) * cardWidth * sens);
        } else {
            const midX = global.grid.hand.width / 2 - cardWidthHalf;
            x = midX + (Math.abs(mid - index) * cardWidth * sens);
        }

        const playerSens = player.isPlayer1 ? 1 : -1;
        factorRotation = index - mid;
        const rotation = playerSens * Math.round(20 * (factorRotation / mid));
        const heightIncruise = playerSens * (cardWidth / 4) * Math.abs(mid - index);

        card.ap = index;
        card.hp = mid;

        const result = {
            x: player.positions.hand.x + x,
            y: player.positions.hand.y + heightIncruise + 20,
            width: global.grid.card.width,
            height: global.grid.card.height,
            rotation
        };
        return result;
    }

    static isPair(x) { return x % 2 == 0 }

    static getCenter(totalWidth, elementWidth, total, index) {
        const halfWidth = totalWidth / 2;
        const half = total / 2;
        const indexCenter = half - index;
        return halfWidth - indexCenter * elementWidth;
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

        const marginHorizontal = (width - (3*margin) - (maxSize.width * maxSize.wrapCut)) / (maxSize.wrapCut-1); 
        //let originXCenter = originX + ((width - (maxSize.width * maxSize.wrapCut))/2);
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
