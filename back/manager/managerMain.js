const managerCard = require("./managerCard");
const managerDeck = require("./managerDeck");
const managerTheme = require("./managerTheme");

const helperGoogleApi = require("../helper/helperGoogleApi");

let spreedSheetId= '1tRkMQB_w_rb0mubb-7PEWsepUfCGroLjHZDO_KewBd4';

class managerMain {
  static async refresh(req, res){
    let errors = [];
  
    const { sheets } = await helperGoogleApi.authSheets();
    let requestsPages = ['Bonus!B2:D','Limit0!B2:B', 'Limit1!B2:C', 'Joker!B2:B', 'Decks!B2:I', 'Decks2!B2:I', 'Themes!B2:E'];    
    const sheetData = await helperGoogleApi.getSheetMultipleContent(sheets,spreedSheetId, requestsPages);
    
    let cardsResult = await managerCard.refresh(sheetData, sheets, spreedSheetId);
    let cards = cardsResult.cards;
    errors = errors.concat(cardsResult.errors);
  
    let deckErrrors = managerDeck.refresh(sheetData, cards, sheets, spreedSheetId);
    errors = errors.concat(deckErrrors);    
  
    let themeErrrors = managerTheme.refresh(sheetData, cards, sheets, spreedSheetId);
    errors = errors.concat(themeErrrors);
  
    res.send(errors.length < 1 ? 'Importation réussie' : 'Des erreurs sont survenues : ' + errors
      .map(x=> `${x.From}!Ligne${x.Index+2} ${x.Errors}`).join('..................'));  
  }
}
 
module.exports = managerMain;
