const managerDeck = require("../manager/managerDeck");

var express = require('express'),
router = express.Router();

router.get('/', async (req, res) => {
  managerDeck.getAll(res);  
});
 
router.get('/:id', async (req, res) => {
  managerDeck.get(req.params.id, res);      
});

router.post('/', async (req, res) => {
  managerDeck.insert(req.body, res);   
});

module.exports = router;