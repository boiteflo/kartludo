const helperJsonFile = require("../helper/helperJsonFile");

var express = require('express'),
router = express.Router();

let history = "Fight Started\n\nTest";
if(!helperJsonFile.exists("fight")){
    helperJsonFile.save("fight", {message:history});
}

helperJsonFile.read("fight").then(data => history = data.message);

router.get('/', async (req, res) => {
    res.send(history);
});

router.get('/clear', async (req, res) => {
    history = "";
    helperJsonFile.save("fight", {message:history});
    res.send(history);
});

router.post('/', async (req, res) => {
    history += '\n' + req.body.message;
    helperJsonFile.save("fight", {message:history});
});

module.exports = router;