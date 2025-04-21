class array {

    static test(message) {
        alert(message);
    }

    static wait() { }

    static clone(obj) { return Object.assign({}, obj); }

    static addFunction(cla, obj, useTuto) {
        const ignore = ['length', 'name', 'prototype'];
        cla.forEach(c => {
            Object.getOwnPropertyNames(c).forEach(method => {
                if (!ignore.includes(method)) {
                    if (obj[method] && !useTuto) {
                        throw new Error(`cette fonction existe deja : ${c.name}.${method}`);
                    }
                    else {
                        obj[method] = c[method];
                    }
                }
            });
        });
    }

    // Log
    static log(text) { this.game.logs = text + '<br>' + this.game.logs; }

    // Utils
    static isPair(x) { return x % 2 == 0 }

    // Array
    static addListInArrayAfterIndex(array, index, list) {
        if (!array)
            return list;

        if (!list)
            return array;

        if (index >= array.length)
            return array.concat(list);

        if (index < 0 || index >= array.length)
            return list.concat(array);

        return [...array.slice(0, index), ...list, ...array.slice(index)];
    }

    static getAndRemoveFirst(array) {
        return array.splice(0, 1)[0];
    }

    static removeByIndex(array, card) {
        return array.filter(x => x.index !== card.index);
    }

    static addIn(array, card) {
        if (array && !array.includes(x => x.index === card.index))
            return array.concat([card]);
    }

    static alreadyDone(valueOld, valueNew) {
        if (valueOld === undefined && !valueNew)
            return true;
        return valueOld == valueNew;
    }
}


export default array;
