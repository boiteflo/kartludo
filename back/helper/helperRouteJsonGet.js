const express = require('express');
const helperArray = require("./helperArray");
const helperJsonFile = require("./helperJsonFile");


class helperRouteJsonDal {
    static createDalRoute=(name, idProperty='id') => {
        const router = express.Router();
       
        router.get('/', async (req, res) => {
            console.log('get ' + name)
            helperJsonFile.readPath(`./${name}.json`)
                .then(data => res.send(data));
        });


        router.get('/:id', async (req, res) => {
            console.log('get ' + name + '/' + req.params.id)
            helperJsonFile.readPath(`./${name}.json`)
                .then(data => res.send(helperArray.getElementByProperty(data, req.params.id, idProperty)));            
        });


        return router;
    }
  }
 
  module.exports = helperRouteJsonDal;