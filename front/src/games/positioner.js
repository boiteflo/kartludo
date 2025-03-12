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

        grid.center = this.getCardSize(grid.width - grid.border2, grid.height - grid.border2, 1);

        grid.box = { height: grid.heightB / divide };
        grid.box.width = grid.widthB / divide;
        grid.boxbig = { height: 2 * grid.box.height + grid.border, width: 2 * grid.box.width + grid.border };
        grid.hand = { width: (grid.box.width + grid.border) * divide - grid.border, height: 3 * (grid.box.height + grid.border) - grid.border };
        grid.field = { width: grid.hand.width - grid.box.width - grid.border, height: grid.hand.height + 2 * (grid.box.height + grid.border) };

        grid.hand.card = this.getCardSize(grid.hand.width, grid.hand.height, 6);
        grid.field.card = this.getCardSize(grid.field.width, grid.field.height, 6);

        for (let i = 0; i < divide; i++) {
            grid['x' + i] = 5 + (i * (grid.box.width + 5));
            grid['y' + i] = 5 + (i * (grid.box.height + 5));
        }

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
                hand: this.createZone(isPlayer1, grid.x0, grid.y13, grid.x0, grid.y0, grid.hand.width, grid.hand.height, 'hand', global.locationHand),
                field: this.createZone(isPlayer1, grid.x0, grid.y8, grid.x2, grid.y3, grid.field.width - 5 - grid.box.width, grid.field.height, 'field', global.locationField)
            };
        if (!isPlayer1)
            result.hand.width = result.hand.width -  grid.box.width - (2*grid.border2);
        return result;
    }

    static createZone(isPlayer1, x1, y1, x2, y2, width, height, zone, location) {
        const index = isPlayer1 ? '1' : '2';
        return {
            x: isPlayer1 ? x1 : x2,
            y: isPlayer1 ? y1 : y2,
            zone: zone + index,
            width, height, location, isPlayer1
        };
    }

    static createField(p1, p2) {
        let result = [p1.deck, p1.trash, p1.shield, p1.resource, p1.hand, p1.field, p1.base]
            .concat([p2.deck, p2.trash, p2.shield, p2.resource, p2.hand, p2.field, p2.base]);
        return result;
    }

    static refresh(cards, position, useZoneSize = false) {
        let zoneHeight = position.height;
        if (position.location == global.locationField)
            zoneHeight *= 0.75;

        const cardSize = useZoneSize ? position : this.getCardSize(position.width, zoneHeight, cards.length);
        cards.forEach((card, index) => {
            card.to = this.getCardPosition(index, cards.length, position, cardSize, card);
            card.location = position.location;
        });
    }

    static getCardSize(width, height, count) {
        let desiredWidth = width / (count + 0.25);
        let desiredHeight = desiredWidth * 150 / 107;
        if (desiredHeight > height) {
            desiredHeight = height;
            desiredWidth = desiredHeight * 107 / 150;
        }

        const x = (width - desiredWidth) / 2;
        const y = (height - desiredHeight) / 2;
        return { x, y, width: desiredWidth, height: desiredHeight };
    }

    static getCardPosition(index, total, position, cardSize, card) {
        const degree = card.active ? 0 : 90;
        return {
            x: position.x + this.getXCenter(position.width, cardSize.width, total, index),
            y: position.y,
            width: cardSize.width,
            height: cardSize.height,
            rotation: degree
        };
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

    static getXCenter(totalWidth, elementWidth, total, index) {
        const sizeWidth = totalWidth / total;
        return sizeWidth / 2 + sizeWidth * index - elementWidth / 2;
    }
}


export default positioner;
