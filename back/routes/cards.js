var express = require('express'),
router = express.Router();

const helperJsonFile = require("../helper/helperJsonFile");

router
  .get('/', async (req, res) => {
    helperJsonFile.readPath('./cards.json').then(cards => res.send(cards));
  });
 
module.exports = router;