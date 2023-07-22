var express = require('express'),
router = express.Router();

const helperJsonFile = require("../helper/helperJsonFile");
let spreedSheetId= '1tRkMQB_w_rb0mubb-7PEWsepUfCGroLjHZDO_KewBd4';

router.get('/', async (req, res) => {
  helperJsonFile.readPath('./decks.json').then(data => res.send(data));
});
 
router.get('/:id', async (req, res) => {
  helperJsonFile.readPath('./decks.json').then(data => {
    let deck= data.Decks.find(x=> x.Id === req.params.id);
    if(!deck)
      deck= data.DecksCommunity.find(x=> x.Id === req.params.id);
    res.send(deck);
  });          
});

router.post('/', async (req, res) => {
  let deck = req.body;
  
  let cards = await helperJsonFile.read('cards');
  let cardsIdName = cards.map(x=> x.IdName);

  let missingCards = deck.DeckListCards.filter(x=> !cardsIdName.includes(x.Card.IdName)).map(x=> x.Card.NameEn);
  let errorMessage = missingCards.length < 1 ? '' : `Les cartes suivantes n'ont pas été trouvées :` + missingCards.join(",");

  let deckList = [deck.DeckListCards.filter(x=> cardsIdName.includes(x.Card.IdName)).map(x=> x.Card.NameEn.onlyAlphaNumericAndSpace() + (x.Quantity==='2' ? ' x2' : ''))];
  let mainCards = deck.MainCards.slice(0,3).map(x=> x.NameEn.onlyAlphaNumericAndSpace()).join(', ');
  
  const helperGoogleApi = require("../helper/helperGoogleApi");
  const { sheets } = await helperGoogleApi.authSheets();
  let requestsPages = ['Decks2!B2:I'];  
  const sheetData = await helperGoogleApi.getSheetMultipleContent(sheets,spreedSheetId, requestsPages);
  const lastRow = sheetData.Decks2 ? sheetData.Decks2.length+2 : 2;
  helperGoogleApi.updateSheet(sheets, spreedSheetId, 'Decks2!A' + lastRow, errorMessage);
  helperGoogleApi.updateSheet(sheets, spreedSheetId, 'Decks2!B' + lastRow, deck.Title.cleanup());
  helperGoogleApi.updateSheet(sheets, spreedSheetId, 'Decks2!C' + lastRow, deck.Rank);
  helperGoogleApi.updateSheet(sheets, spreedSheetId, 'Decks2!D' + lastRow, deck.Title);
  helperGoogleApi.updateSheet(sheets, spreedSheetId, 'Decks2!E' + lastRow, new Date().toLocaleDateString("fr"));
  helperGoogleApi.updateSheet(sheets, spreedSheetId, 'Decks2!F' + lastRow, deck.Author);
  helperGoogleApi.updateSheet(sheets, spreedSheetId, 'Decks2!G' + lastRow, mainCards);
  helperGoogleApi.updateSheet(sheets, spreedSheetId, 'Decks2!H' + lastRow, deck.ThemesId.join(','));//Combo
  helperGoogleApi.updateSheet(sheets, spreedSheetId, 'Decks2!I' + lastRow, deckList.join(', '));

  res.status(201).send();
});
module.exports = router;