const managerDemoSheet = require("../manager/managerDemoSheet");

var express = require('express'),
router = express.Router();

router.get('/', async (req, res) => {
    const result = await managerDemoSheet.getDataMultipleTimes();
    res.send(result);
});

module.exports = router;