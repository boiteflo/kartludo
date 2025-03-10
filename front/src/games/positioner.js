import global from './global';

class positioner {

    static createGrid(width, height) {
        const grid = {};
        grid.width = width - 15;
        grid.height = height;
        grid.border = 5;
        const divide = 16;
        grid.widthB = grid.width - (grid.border * (divide + 1));
        grid.heightB = grid.height - grid.border * (divide + 1);

        grid.center = { height: grid.heightB - 2 * grid.border, y: grid.border };
        grid.center.width = grid.center.height * 107 / 150;
        grid.center.x = grid.widthB / 2 - grid.center.width / 2;

        grid.box = { height: grid.heightB / divide };
        grid.box.width = grid.widthB / divide;
        grid.boxbig = { height: 2 * grid.box.height + grid.border, width: 2 * grid.box.width + grid.border };
        grid.hand = { width: (grid.box.width + grid.border) * divide - grid.border, height: 4 * (grid.box.height + grid.border) - grid.border };
        grid.field = { width: grid.hand.width - grid.box.width - grid.border, height: grid.hand.height };

        grid.card = { height: height / 5 };
        grid.card.width = grid.card.height * 107 / 150;

        for (let i = 0; i < divide; i++) {
            grid['x' + i] = 5 + (i * (grid.box.width + 5));
            grid['y' + i] = 5 + (i * (grid.box.height + 5));
        }

        return grid;
    }


    static getPositions(grid, isPlayer1) {
        const shield = isPlayer1 ? { x: grid.x15, y: grid.y8, width: grid.box.width, height: grid.box.height, name: 'shield' }
            : { x: grid.x0, y: grid.y7, width: grid.box.width, height: grid.box.height, name: 'shield' };

        const deck = isPlayer1 ? { x: grid.x15, y: grid.y9, width: grid.box.width, height: grid.box.height, name: 'deck' }
            : { x: grid.x0, y: grid.y6, width: grid.box.width, height: grid.box.height, name: 'deck' };

        const trash = isPlayer1 ? { x: grid.x15, y: grid.y10, width: grid.box.width, height: grid.box.height, name: 'trash' }
            : { x: grid.x0, y: grid.y5, width: grid.box.width, height: grid.box.height, name: 'trash' };

        const resource = isPlayer1 ? { x: grid.x15, y: grid.y11, width: grid.box.width, height: grid.box.height, name: 'resource' }
            : { x: grid.x0, y: grid.y4, width: grid.box.width, height: grid.box.height, name: 'resource' };

        const hand = isPlayer1 ? { x: grid.x0, y: grid.y12, width: grid.hand.width, height: grid.hand.height, name: 'hand' }
            : { x: grid.x0, y: grid.y0, width: grid.hand.width, height: grid.hand.height, name: 'hand' };

        const field = isPlayer1 ? { x: grid.x0, y: grid.y8, width: grid.field.width, height: grid.field.height, name: 'field' }
            : { x: grid.x1, y: grid.y4, width: grid.field.width, height: grid.field.height, name: 'field' };

        return { deck, shield, hand, resource, field, trash };
    }

    static createField(p1, p2) {
        let result = [p1.deck, p1.trash, p1.shield, p1.resource, p1.hand, p1.field]
            .concat([p2.deck, p2.trash, p2.shield, p2.resource, p2.hand, p2.field]);
        // result = result.concat({ x: global.grid.center.x, y: global.grid.center.y, width: global.grid.center.width, height: global.grid.center.height, name: 'center' });
        return result;
    }

    static refresh(player, cards, location) {
        if (location !== global.locationHand && location !== global.locationField)
            return;

        const isHand = location === global.locationHand;
        cards.forEach((card, index) => {
            card.position = isHand ? this.getPositionHand(player, index, cards.length) : this.getPositionField(player, index, cards.length);
            card.to = isHand ? this.getPositionHand(player, index, cards.length) : this.getPositionField(player, index, cards.length);
        });
    }

    static getPositionHand(player, index, total) {
        const half = total/2;
        const playerSens = player.isPlayer1 ? 1 : -1;
        const degree = (-75*playerSens) / half;
        const rotation = (half - index) * degree;
        const alignDown = player.isPlayer1 ? 0 : player.positions.hand.height *0.15;
        player.positions.hand.name = player.positions.hand.width / total;
        return {
            x: player.positions.hand.x + this.getXCenter(player.positions.hand.width, global.grid.card.width, total, index),
            y: alignDown + player.positions.hand.y + playerSens * Math.abs(rotation)*1,
            width: global.grid.card.width,
            height: global.grid.card.height,
            rotation
        };
    }

    static isPair(x){return x%2==0}

    static getPositionField(player, index, total) {
        return {
            x: player.positions.field.x + this.getXCenter(player.positions.field.width, global.grid.card.width, total, index),
            y: player.positions.field.y,
            width: global.grid.card.width,
            height: global.grid.card.height
        };
    }

    static getXCenter(totalWidth, elementWidth, total, index) {
        const sizeWidth = totalWidth / total;
        return sizeWidth / 2 + sizeWidth * index - elementWidth/2;
    }
}


export default positioner;
