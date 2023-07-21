const managerMain = require("../manager/managerMain");

var express = require('express'),
router = express.Router();

router
  .get('/', async (req, res) => {
    managerMain.refresh(req, res);
  });
  
module.exports = router;