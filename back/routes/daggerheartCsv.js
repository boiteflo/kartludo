const helperJsonFile = require("../helper/helperJsonFile");
const path = require('path');

var express = require('express'),
    router = express.Router();

const templates = [
    {
        name: "Ancestry",
        template: "Template Ancestry\ntext font-weight:bold font-size:30px top:190px left:40px text-transform:uppercase\ntext color:black font-size:11px top:235px left:15px right:15px\nimage top:2px left:2px right:2px background-position:'0px -5px'",
    },
    {
        name: "Community",
        template: "Template Community\ntext font-weight:bold font-size:20px top:245px left:40px text-transform:uppercase\ntext color:black font-size:12px top:275px left:15px right:15px\nimage top:2px left:2px right:2px background-position:'0px -5px'",
    },
    {
        name: "Class",
        template: "Template Class\ntext font-weight:bold font-size:14px top:172px left:120px right:120px text-align:center color:white text-transform:uppercase\ntext color:black font-size:10px top:198px left:15px right:15px\ntext top:455px font-size:10px text-align:center left:15px right:15px\nimage top:2px left:2px right:2px background-position:'0px -20px'\nimage top:0px left:20px width:70px height:118px",
    },
    {
        name: "SousClasse",
        template: "Template SousClass\ntext font-weight:bold font-size:14px top:200px left:120px right:120px text-align:center color:white text-transform:uppercase\ntext font-weight:bold font-size:20px top:220px left:15px right:15px text-transform:uppercase text-align:center\ntext color:black font-size:10px top:250px left:15px right:15px\ntext bottom:5px font-size:11px text-align:center left:15px right:15px font-weight:bold\nimage top:2px left:2px right:2px background-position:'0px -20px'\nimage top:0px left:20px width:70px height:118px",
    },
    {
        name: "Domain",
        template: "Template Domain\ntext font-weight:bold font-size:14px top:228px left:120px right:120px text-align:center color:white text-transform:uppercase\ntext font-weight:bold font-size:20px top:250px text-align:center  text-transform:uppercase right:20px left:20px\ntext color:black font-size:30px top:15px color:white left:45px font-weight:bold\ntext font-weight:bold font-size:18px top:23px right:36px color:white\ntext font-size:11px top:275px left:15px right:15px\ntext top:455px font-size:10px text-align:right right:15px\nimage top:2px left:2px right:2px background-position:'0px -10px'\nimage top:2px left:20px width:70px height:118px\nimage top:20px right:20px width:35px height:35px",
    }
];

router.get('/', async (req, res) => {
    const filePath = path.join(__dirname, '../data/daggerheart', 'Ancestries.zip');
    res.download(filePath, 'Ancestries.zip', (err) => {
        if (err) {
            console.error('Erreur lors du téléchargement du fichier :', err);
            res.status(500).send('Erreur lors du téléchargement du fichier');
        }
    });
    /*
    const csv = [];
    
    // Ancestries
    const ancestries = await helperJsonFile.readPath('./back/data/daggerheart/ancestry.json');
    csv.push(`template\t${templates[0].name}\t"${templates[0].template}"`);
    ancestries.forEach(x => csv.push(`${x.name}\t${x.description}\t@CardAncestry.png\t@${x.id}.jpg`));
    */
    // Communties
    /*
    const communities = await helperJsonFile.readPath('./back/data/daggerheart/communaute.json');
    csv.push("template|" + templates[1].name + '|"' + templates[1].template + '"');
    communities.forEach(x => csv.push(`${x.name}\t${x.description}\t${x.id}`));*/

    /*let fs = require('fs');
    fs.readFile('../data/daggerheart/Ancestries.zip', "utf8", (err, jsonString) => {
        resolve(JSON.parse(jsonString));
    });*/
    /*
        const csvContent = csv.join('\n'); //.replaceAll("|", '\t');
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="daggerheartCsv.csv"');
        res.status(201).send(csvContent);
        */

});

module.exports = router;