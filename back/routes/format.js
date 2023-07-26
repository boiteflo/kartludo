const managerFormat = require("../manager/managerFormat");

var express = require('express'),
router = express.Router();

router.get('/', async (req, res) => {
    managerFormat.getAll(res);  
});
 
router.get('/:id', async (req, res) => {
    managerFormat.get(req.params.id, res);      
});

router.post('/', async (req, res) => {
    managerFormat.insert(req.body, res);   
});

module.exports = router;