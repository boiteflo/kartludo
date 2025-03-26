const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helperRouteJsonGet = require("./helper/helperRouteJsonGet");
const helperRouteJsonGetFolder = require("./helper/helperRouteJsonGetFolder");

String.prototype.stringify = function(obj) {
    return JSON.stringify(obj, null, "\t");
}
String.prototype.replaceMany = function(searchTxt, replaceTxt) {
    const regex = new RegExp(searchTxt, 'g');
    return this.replace(regex, replaceTxt) ;
}
String.prototype.replaceAll = function(search, replace) {
    let result = '';
  
    for (let i = 0; i < this.length - search.length; i++) {
      if (this.substr(i, search.length) === search) {
        result += replace;
        i += search.length - 1; 
      } else {
        result += this[i];
      }
    }
    
    return result;
}
String.prototype.includesX2 = function() {
    return this.toLowerCase().startsWith("x2") || this.toLowerCase().endsWith("x2");
}
String.prototype.includesX3 = function() {
    return this.toLowerCase().startsWith("x3") || this.toLowerCase().endsWith("x3");
}
String.prototype.cleanup = function() {
    let result = this || '';
    let groups = ["e|éèêë", "o|ôò", "a|àâ", "i|îïíì", "c|ç", "oe|œ", "u|ûúùü"];
    groups.forEach(group => {
        let array = group.split('|');
        let key = array[0].split('')[0];
        array[1].split('').forEach(character=> result = result.replaceMany(character, key));
    });
    
    result = result.toLowerCase().replace(/[^a-zA-Z0-9]+/g,'');
    return result;
}
String.prototype.onlyAlphaNumericAndSpace = function() {
    return this.toLowerCase().replace(/[^a-zA-Z0-9 ]+/g,'');
}
String.prototype.removeX2 = function() {
    return this.removeStringStartOrEnd('x2');
}
String.prototype.removeX3 = function() {
    return this.removeStringStartOrEnd('x3');
}
String.prototype.removeStringStartOrEnd = function(str) {
    if(this.toLowerCase().startsWith(str.toLowerCase()))
        return this.substring(str.length);
    else if(this.toLowerCase().endsWith(str.toLowerCase()))
        return this.substring(0, this.length-str.length);
    else
        return this.substring(0);
}
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

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/data', helperRouteJsonGet.createDalRoute('back/data/data', 'Id'))
app.use('/api/cube', helperRouteJsonGet.createDalRoute('back/data/cubes', 'Id'))
app.use('/api/theme', helperRouteJsonGet.createDalRoute('back/data/themes', 'Id'))
app.use('/api/card', helperRouteJsonGet.createDalRoute('back/data/cards', 'IdName'))
app.use('/api/booster', helperRouteJsonGet.createDalRoute('back/data/boosters', 'Ref'))
app.use('/api/cardMDM', helperRouteJsonGet.createDalRoute('back/data/cardsAll', 'IdName'))
app.use('/api/extension', helperRouteJsonGet.createDalRoute('back/data/extensions', 'set_code'))
app.use('/api/tournament', helperRouteJsonGet.createDalRoute('back/data/tournaments', 'Id'))

app.use('/api/daggerheart', helperRouteJsonGetFolder.createDalRoute('back/data/daggerheart'))

var routeDaggerheartCsv = require('./routes/daggerheartCsv');
app.use('/api/daggerheartcsv', routeDaggerheartCsv)

var refreshRoute = require('./routes/refresh');
app.use('/api/refresh', refreshRoute)

var routeDecks = require('./routes/deck');
app.use('/api/deck', routeDecks)

var routeFormats = require('./routes/format');
app.use('/api/format', routeFormats)

var routeCardsMDM = require('./routes/cardToAdd');
app.use('/api/cardToAdd', routeCardsMDM)

var routeFight = require('./routes/fight');
app.use('/api/fight', routeFight)

var routeDemoSheet = require('./routes/demoSheet');
app.use('/api/demoSheet', routeDemoSheet )

app.use(express.static(__dirname + '/public/'));
app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));
const port = process.env.PORT || 5000;

const axios = require('axios');
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);


io.on('connection', (socket) => {
    console.log('a user connected');
  });

const managerMain = require("./manager/managerMain");
const helperJsonFile = require('./helper/helperJsonFile');



// Temp : Create CSV file of daggerheart domains
/*
function getValue(obj, index, property){
    const value = obj[property];
    if(index == 5) return "<b>Domaines:</b>" + value;
    if(index == 6) return "@" + value + ".jpg";
    if(index == 7) return "@banner-" + value + ".webp";
    if(index == 8) return "@cost.webp";
    return value;
}
const helperFile = require('./helper/helperFile');
helperJsonFile.readPath('./back/data/daggerheart/domaines.json').then(json => {
    const properties = "type,nom,niveau,cout,effet,domaine,domain,domain,domain".split(',');
    const content = json.map(x=> properties.map((prop,index)=> getValue(x, index, prop)).join('\t')).join('\n')
    helperFile.save("test.csv", content);
});*/

server.listen(port, () => {
    managerMain.refresh();
    console.log(`Server started on port ${port}`);
    
    if (process.env.NODE_ENV === 'production') {
        setInterval(()=> axios.get('https://mdos.onrender.com/api/data/ranks'), 60000*12);
    }
});


