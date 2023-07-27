const managerCard = require("../manager/managerCard");

var express = require('express'),
router = express.Router();

router.get('/', async (req, res) => {
    managerCard.getAllMDM(res);  
});
 
router.get('/:id', async (req, res) => {
    managerCard.getMDM(req.params.id, res);      
});

router.post('/', async (req, res) => {
    managerCard.insertMDM(req.body, res);   
});

module.exports = router;