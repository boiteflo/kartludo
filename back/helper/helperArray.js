const { json } = require("body-parser");


class helperArray {
    static initOrderIndex= (array) => {
        let filterElement = array
            .filter(x=> x.orderIndex);        
           
        let max = filterElement.length < 1 ? 1
            : Math.max(...filterElement
                .map(x=> x.orderIndex));
               
        let min = filterElement.length < 1 ? 0
        : Math.min(...filterElement
            .map(x=> x.orderIndex));
       
        array.forEach(element => {
            element.orderIndex = element.orderIndex && element.orderIndex >0
                ? element.orderIndex - min
                : ++max;
        });


        return this.sortInteger(array, "orderIndex");
    };


    static setId= (array) => {
        const alreadyUsedId = [];
        let currentId = 1;        
        if(!array || array.length < 1)
            return [];


        array.forEach(x=> {
            if(x.id === undefined || x.id < 1 || alreadyUsedId.includes(x.id)){
                x.id = currentId;
                currentId++;
            }
            alreadyUsedId.push(x.id);
        });
        return array;
    }


    static sort= (array, property) => {
        return array.sort((a,b)=> b[property] - a[property])
    }


    static sortInteger= (array, property) => {
        return array.sort((a,b)=> parseInt(a[property]) - parseInt(b[property]))
    }


    static removeElement =(array, element) => {
        array.splice(array.indexOf(element), 1);
    }


    static getElementByProperty = (array, value, property) => {
        return array.find(x=> x[property] == value);
    }


    static getElementsByProperty = (array, value, property) => {
        return array.filter(x=> x[property] == value);
    }


    static removeElementByProperty =(array, value, property) => {
        let element = this.getElementByProperty(array, value, property);
        this.removeElement(array, element);
    }
  }
 
  module.exports = helperArray;
