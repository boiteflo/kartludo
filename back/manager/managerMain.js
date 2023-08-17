const managerCard = require("./managerCard");
const managerDeck = require("./managerDeck");
const managerTheme = require("./managerTheme");
const managerFormat = require("./managerFormat");
const managerTournament = require("./managerTournament");

const helperJsonFile = require("../helper/helperJsonFile");
const helperGoogleApi = require("../helper/helperGoogleApi");

let spreedSheetId= '1tRkMQB_w_rb0mubb-7PEWsepUfCGroLjHZDO_KewBd4';

class managerMain {
  static async refresh(req, res){
    console.log('refresh');
    let errors = [];
    
    const { sheets } = await helperGoogleApi.authSheets();
    let requestsPages = ['Data!B2:D']
      .concat(managerFormat.getSheetRanges())
      .concat(managerDeck.getSheetRanges())
      .concat(managerCard.getSheetRanges())
      .concat(managerTheme.getSheetRanges())
      .concat(managerTournament.getSheetRanges());   
    const sheetData = await helperGoogleApi.getSheetMultipleContent(sheets,spreedSheetId, requestsPages);
    
    let cardsResult = await managerCard.refresh(sheetData, sheets, spreedSheetId);
    let cards = cardsResult.cards;
    errors = errors.concat(cardsResult.errors);
  
    let formatResult =managerFormat.refresh(sheetData, cards, sheets, spreedSheetId);
    let formats = formatResult.formats;
    errors = errors.concat(formatResult.errors);
  
    let themeErrors = managerTheme.refresh(sheetData, cards, sheets, spreedSheetId);
    errors = errors.concat(themeErrors);
  
    let deckResult =managerDeck.refresh(sheetData, cards, formats, sheets, spreedSheetId);
    let decks = deckResult.data;
    errors = errors.concat(deckResult.errors);
  
    let tournamentErrors = managerTournament.refresh(sheetData, decks, sheets, spreedSheetId);
    errors = errors.concat(tournamentErrors);

    let data = sheetData.Data.map(x=> {return {"Id": x[0], "Title": x[1], "Value": x[2]};});
    helperJsonFile.save('./back/data/data', data);
  
    if(res){
      res.send(errors.length < 1 ? 'Importation réussie' : 'Des erreurs sont survenues : <br/>' + errors
        .map(x=> `${x.From}!Ligne${x.Index+2} ${x.Errors}`).join('<br/>'));  
    }
  }
}
 
module.exports = managerMain;
