const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helperRouteJsonGet = require("./helper/helperRouteJsonGet");

String.prototype.guid = function() {
    var d = new Date().getTime();//Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if(d > 0){//Use timestamp until depleted
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}
String.prototype.includesX2 = function() {
    return this.toLowerCase().startsWith("x2") || this.toLowerCase().endsWith("x2");
}
String.prototype.cleanup = function() {
    let result = this;
    let groups = ["e|éèêë", "o|ôò", "a|àâ", "i|îïíì", "c|ç", "oe|œ", "u|ûúùü"];
    groups.forEach(group => {
        let array = group.split('|');
        let key = array[0].split('')[0];
        array[1].split('').forEach(character=> result = result.replaceAll(character, key));
    });
    
    result = result.toLowerCase().replace(/[^a-zA-Z0-9]+/g,'');
    return result;
}
String.prototype.onlyAlphaNumericAndSpace = function() {
    return this.toLowerCase().replace(/[^a-zA-Z0-9 ]+/g,'');
}
String.prototype.removeX2 = function() {
    if(this.toLowerCase().startsWith("x2"))
        return this.substring(2);
    else if(this.toLowerCase().endsWith("x2"))
        return this.substring(0, this.length-2);
    else
        return this.substring(0);
}


const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/cards', helperRouteJsonGet.createDalRoute('cards', 'IdName'))
app.use('/api/extensions', helperRouteJsonGet.createDalRoute('extensions', 'set_code'))
app.use('/api/themes', helperRouteJsonGet.createDalRoute('themes', 'set_code'))
app.use('/api/data', helperRouteJsonGet.createDalRoute('data', 'Id'))

var refreshRoute = require('./routes/refresh');
app.use('/api/refresh', refreshRoute)

var routeDecks = require('./routes/decks');
app.use('/api/decks', routeDecks)

app.use(express.static(__dirname + '/public/'));
app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));


