const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helperRouteJsonDal = require("./helper/helperRouteJsonDal");

String.prototype.cleanup = function() {
    return this.toLowerCase().replace(/[^a-zA-Z0-9]+/g,'');
}
String.prototype.removeX2 = function() {
    if(this.toLowerCase().startsWith("x2"))
        return this.substring(2);
    else if(this.toLowerCase().endsWith("x2"))
        return this.substring(0, this.length-2);
    else
        return this.substring(0);
}
String.prototype.includesX2 = function() {
    return this.toLowerCase().startsWith("x2") || this.toLowerCase().endsWith("x2");
}

const app = express();
app.use(cors());
app.use(bodyParser.json());

//let cards = require("./data/cards");
//app.use('/api/cards', helperRouteJsonDal.createDalRoute('cards', cards))
//app.use('/api/decks', helperRouteJsonDal.createDalRoute('decks', []))

var refreshRoute = require('./routes/refresh');
app.use('/api/refresh', refreshRoute)

var refreshCards = require('./routes/cards');
app.use('/api/cards', refreshCards)

var refreshDecks = require('./routes/decks');
app.use('/api/decks', refreshDecks)

if(process.env.NODE_ENV === 'production'){
}
app.use(express.static(__dirname + '/public/'));
app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));


