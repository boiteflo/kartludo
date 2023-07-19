var express = require('express'),
router = express.Router();

const refreshCards = require("./refreshCards");
const refreshDecks = require("./refreshDecks");

const helperGoogleApi = require("../helper/helperGoogleApi");

let spreedSheetId= '1tRkMQB_w_rb0mubb-7PEWsepUfCGroLjHZDO_KewBd4';

router
  .get('/', async (req, res) => {
    let errors = [];
  
    const { sheets } = await helperGoogleApi.authSheets();
    let requestsPages = ['Bonus!B2:D','Limit0!B2:B', 'Limit1!B2:C', 'Joker!B2:B', 'Decks!B2:I', 'Decks2!B2:I'];    
    const sheetData = await helperGoogleApi.getSheetMultipleContent(sheets,spreedSheetId, requestsPages);
    
    let cardsResult = await refreshCards.refresh(sheetData, sheets, spreedSheetId);
    let cards = cardsResult.cards;
    errors = errors.concat(cardsResult.errors);
  
    let deckErrrors = refreshDecks.refresh(sheetData, cards, sheets, spreedSheetId);
    errors = errors.concat(deckErrrors);
  
    res.send(errors.length < 1 ? 'Importation réussie' : 'Des erreurs sont survenues : ' + errors
      .map(x=> `${x.From}!Ligne${x.Index+2} ${x.Errors}`).join('..................')); 
  });
  
module.exports = router;