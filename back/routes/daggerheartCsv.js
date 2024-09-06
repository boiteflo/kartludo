const helperJsonFile = require("../helper/helperJsonFile");
const path = require('path');

var express = require('express'),
    router = express.Router();


router.get('/', async (req, res) => {
    console.log("zip");
    const filePath = path.join(__dirname, '../data/daggerheart', 'Ancestries.zip');
    res.download(filePath, 'Ancestries.zip', (err) => {
        if (err) {
            console.error('Erreur lors du téléchargement du fichier :', err);
            res.status(500).send('Erreur lors du téléchargement du fichier');
        }
    });
});

router.get('/csv', async (req, res) => {
    const csv = [];
    const templates = await helperJsonFile.readPath('./back/data/daggerheart/templates.json');

    // Ancestries
    const ancestries = await helperJsonFile.readPath('./back/data/daggerheart/ancestry.json');
    csv.push(`template\t${templates[0].name}\t"${templates[0].template}"`);
    ancestries.forEach(x => csv.push(`${x.name}\t"${x.description.replaceAll("<br>", "\n<br>")}"\t@CardAncestry.png\t@${x.id}.jpg`));

    const csvContent = csv.join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="daggerheartCsv.csv"');
    res.status(201).send(csvContent);
});

module.exports = router;