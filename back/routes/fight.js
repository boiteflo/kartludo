const managerFight = require("../manager/managerFight");

var express = require('express'),
router = express.Router();

router.get('/', async (req, res) => {
    res.send(await managerFight.getFights());
});

router.post('/', async (req, res) => {
    res.send(await managerFight.executeCommand(req.body));
});

module.exports = router;