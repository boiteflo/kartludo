const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helperRouteJsonDal = require("./helper/helperRouteJsonDal");
const helperArray = require("./helper/helperArray");


const app = express();
app.use(cors());
app.use(bodyParser.json());

let cards = require("./data/cards");
app.use('/api/cards', helperRouteJsonDal.createDalRoute('cards', cards))

if(process.env.NODE_ENV === 'production'){
}
app.use(express.static(__dirname + '/public/'));
app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));


