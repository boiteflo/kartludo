class array {   
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
}


export default array;
