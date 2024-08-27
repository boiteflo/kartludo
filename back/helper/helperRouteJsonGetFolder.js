const express = require('express');
const helperJsonFile = require("./helperJsonFile");


class helperRouteJsonDalFolder {
    static createDalRoute=(folder) => {
        const router = express.Router();
       
        router.get('/:id', async (req, res) => {
            console.log('get ' + folder + '/' + req.params.id)
            helperJsonFile.readPath(`./${folder}/${req.params.id}.json`)
                .then(data => res.send(data));     
        });

        return router;
    }
  }
 
  module.exports = helperRouteJsonDalFolder;