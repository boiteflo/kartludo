class global {
    static game = null;
    static grid;
    static index = 1;
    static isPlayer1Turn;

    static phase = 0;
    static phaseStart = 0;
    static phaseDraw = 1;
    static phaseResource = 2;
    static phaseMain = 3;
    static phaseAttack = 4;
    static phaseBlock = 5;
    static phaseAction = 6;
    static phaseDamage = 7;
    static phaseEnd = 8;

    static locationDeck = 0;
    static locationShield = 1;
    static locationHand = 2;
    static locationField = 3;
    static locationBase = 4;
    static locationTrash = 5;
    static locationResource = 6;

    static getLocationArrayProperty(location){
        if(location == this.locationDeck) return 'deck';
        else if(location == this.locationShield) return 'shield';
        else if(location == this.locationHand) return 'hand';
        else if(location == this.locationField) return 'field';
        else if(location == this.locationBase) return 'base';
        else if(location == this.locationResource) return 'resource';
        return 'trash';
    }

    static getNextIndex(){
        this.index++;
        return this.index;
    }

    static removeByIndex(array, card){
        return array.filter(x=> x.index !== card.index);
    }

    static addIn(array, card){
        if(array && !array.includes(x=> x.index === card.index))
            return array.concat([card]);
    }

    static sortRandom(cards) { return cards.sort(() => Math.random() - 0.5); }

    static log(text) { this.world.logs = text + '<br>' + this.world.logs; }

    static clone(obj) { return Object.assign({}, obj); }
}


export default global;
