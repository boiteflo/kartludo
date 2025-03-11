import global from './global';

class positioner {

    static createGrid(width, height) {
        const grid = {};
        grid.width = width;
        grid.height = height;
        grid.border = 5;
        const divide = 16;
        grid.widthB = grid.width - (grid.border * (divide + 1));
        grid.heightB = grid.height - grid.border * (divide + 1);

        grid.center = { height: grid.heightB - 2 * grid.border, y: grid.border };
        grid.center.width = grid.center.height * 107 / 150;
        grid.center.x = grid.widthB / 2 - grid.center.width / 2;
        if (grid.center.width > grid.width - 10) {
            grid.center.width = grid.width - 10;
            grid.center.height = grid.center.width * 150 / 107;
            grid.center.x = 5;
        }

        grid.box = { height: grid.heightB / divide };
        grid.box.width = grid.widthB / divide;
        grid.boxbig = { height: 2 * grid.box.height + grid.border, width: 2 * grid.box.width + grid.border };
        grid.hand = { width: (grid.box.width + grid.border) * divide - grid.border, height: 3 * (grid.box.height + grid.border) - grid.border };
        grid.hand.cardWidth = grid.hand.width / 11;
        grid.hand.cardHeight = grid.hand.cardWidth * 150 / 107;
        grid.field = { width: grid.hand.width - grid.box.width - grid.border, height: grid.hand.height + 2 * (grid.box.height + grid.border) };
        grid.field.cardHeight = grid.field.height * 0.75;
        grid.field.cardWidth = grid.field.cardHeight * 150 / 107;
        if (grid.field.cardWidth > grid.field.width / 6) {
            grid.field.cardWidth = grid.field.width / 6;
            grid.field.cardHeight = grid.field.cardWidth * 150 / 107;
        }

        grid.card = { height: grid.field.height * 0.75 };
        grid.card.width = grid.card.height * 107 / 150;

        for (let i = 0; i < divide; i++) {
            grid['x' + i] = 5 + (i * (grid.box.width + 5));
            grid['y' + i] = 5 + (i * (grid.box.height + 5));
        }

        return grid;
    }


    static getPositions(grid, isPlayer1) {
        if (grid.box.width > 50)
            return {
                base: this.createPoint(isPlayer1, grid.x15, grid.y8, grid.x0, grid.y7, grid.box.width, grid.box.height, 'base', global.locationBase),
                shield: this.createPoint(isPlayer1, grid.x15, grid.y9, grid.x0, grid.y6, grid.box.width, grid.box.height, 'shield', global.locationShield),
                deck: this.createPoint(isPlayer1, grid.x15, grid.y10, grid.x0, grid.y5, grid.box.width, grid.box.height, 'deck', global.locationDeck),
                trash: this.createPoint(isPlayer1, grid.x15, grid.y11, grid.x0, grid.y4, grid.box.width, grid.box.height, 'trash', global.locationTrash),
                resource: this.createPoint(isPlayer1, grid.x15, grid.y12, grid.x0, grid.y3, grid.box.width, grid.box.height, 'res', global.locationResource),
                hand: this.createPoint(isPlayer1, grid.x0, grid.y13, grid.x0, grid.y0, grid.hand.width, grid.hand.height, 'hand', global.locationHand),
                field: this.createPoint(isPlayer1, grid.x0, grid.y8, grid.x1, grid.y3, grid.field.width, grid.field.height, 'field', global.locationField)
            };
        else
            return {
                base: this.createPoint(isPlayer1, grid.x14, grid.y8, grid.x0, grid.y7, grid.box.width * 2, grid.box.height, 'base', global.locationBase),
                shield: this.createPoint(isPlayer1, grid.x14, grid.y9, grid.x0, grid.y6, grid.box.width * 2, grid.box.height, 'shield', global.locationShield),
                deck: this.createPoint(isPlayer1, grid.x14, grid.y10, grid.x0, grid.y5, grid.box.width * 2, grid.box.height, 'deck', global.locationDeck),
                trash: this.createPoint(isPlayer1, grid.x14, grid.y11, grid.x0, grid.y4, grid.box.width * 2, grid.box.height, 'trash', global.locationTrash),
                resource: this.createPoint(isPlayer1, grid.x14, grid.y12, grid.x0, grid.y3, grid.box.width * 2, grid.box.height, 'res', global.locationResource),
                hand: this.createPoint(isPlayer1, grid.x0, grid.y13, grid.x0, grid.y0, grid.hand.width, grid.hand.height, 'hand', global.locationHand),
                field: this.createPoint(isPlayer1, grid.x0, grid.y8, grid.x2, grid.y3, grid.field.width - 5 - grid.box.width, grid.field.height, 'field', global.locationField)
            };
    }

    static createPoint(isPlayer1, x1, y1, x2, y2, width, height, zone, location) {
        const index = isPlayer1 ? '1' : '2';
        return {
            x: isPlayer1 ? x1 : x2,
            y: isPlayer1 ? y1 : y2,
            zone: zone + index,
            width, height, location
        };
    }

    static createField(p1, p2) {
        let result = [p1.deck, p1.trash, p1.shield, p1.resource, p1.hand, p1.field, p1.base]
            .concat([p2.deck, p2.trash, p2.shield, p2.resource, p2.hand, p2.field, p2.base]);
        return result;
    }

    static refresh(player, cards, location) {
        if (location !== global.locationHand && location !== global.locationField)
            return;

        const isHand = location === global.locationHand;
        const position = isHand ? global.clone(player.positions.hand) : global.clone(player.positions.field);
        if(!isHand) position.height*=0.75;
        const cardSize = this.getCardSize(position.width, position.height, cards.length);
        cards.forEach((card, index) => {
            card.position = isHand ? this.getPositionHand(player, index, cards.length, cardSize)
                : this.getPositionField(player, index, cards.length, cardSize);
            card.to = isHand ? this.getPositionHand(player, index, cards.length, cardSize)
                : this.getPositionField(player, index, cards.length, cardSize);
        });
    }

    static getCardSize(width, height, count) {
        let desiredWidth = width / (count+0.25);
        let desiredHeight = desiredWidth * 150 / 107;
        if (desiredHeight > height) {
            desiredHeight = height;
            desiredWidth = desiredHeight * 107 / 150;
        }
        return { width: desiredWidth, height: desiredHeight };
    }

    static getPositionHand(player, index, total, cardSize) {
        return {
            x: player.positions.hand.x + this.getXCenter(player.positions.hand.width, cardSize.width, total, index),
            y: player.positions.hand.y,
            width: cardSize.width,
            height: cardSize.height
        };
    }

    static getPositionField(player, index, total, cardSize) {
        return {
            x: player.positions.field.x + this.getXCenter(player.positions.field.width, cardSize.width, total, index),
            y: player.positions.field.y,
            width: cardSize.width,
            height: cardSize.height
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
