const helperGoogleApi = require("../helper/helperGoogleApi");
const helperJsonFile = require("../helper/helperJsonFile");
const helperArray = require("../helper/helperArray");
const cardNotFound = `Cette carte n'a pas été trouvée :`;

class refreshCards {
    
    static refresh= (sheetData, sheets, spreedSheetId) => {
        let errors=[];
        let cards = require("../data/cards");
        console.log('cards'+cards.length);
        // Bonus
        if(sheetData.Bonus && sheetData.Bonus.length > 0){
            sheetData.Bonus.forEach(cardArray=> {
                cards.push({
                "IdName": cardArray[0].cleanup(),
                "NameEn":cardArray[0],
                "NameFr":cardArray[1],
                "Image":cardArray[2]
                });
            });
        }          

        cards.forEach(card => card.Limit = '');

        // Limit0
        for(let i =0 ; i< sheetData.Limit0.length; i++)
        {
            let idName = sheetData.Limit0[i][0].cleanup();
            let card = cards.find(x=> x.IdName === idName);
            if(card) {
                card.Limit = '0';
                card.OrderIndex = i;
            }
            else {
                errors.push({Index: i, From:'Limit0', Errors: cardNotFound + ' ' +  sheetData.Limit0[i][0]});
                helperGoogleApi.updateSheet(sheets, spreedSheetId, 'Limit0!A' + (i+2), cardNotFound);
            }
        }

        // Limit1
        for(let i =0 ; i< sheetData.Limit1.length; i++)
        {
            let idName = sheetData.Limit1[i][0].cleanup();
            let card = cards.find(x=> x.IdName === idName);
            if(card) {
                card.Limit = '1';
                card.OrderIndex = i;
                
                let limitFriends = sheetData.Limit1[i][1];
                if(limitFriends){
                    limitFriends = limitFriends.split(',');
                }
            }
            else {
                errors.push({Index: i, From:'Limit1', Errors: cardNotFound + ' ' +  sheetData.Limit1[i][0] });
                helperGoogleApi.updateSheet(sheets, spreedSheetId, 'Limit1!A' + (i+2), cardNotFound);
            }
        }

        // Joker
        for(let i =0 ; i< sheetData.Joker.length; i++)
        {
            let idName = sheetData.Joker[i][0].cleanup();
            let card = cards.find(x=> x.IdName === idName);
            if(card) {
                card.Limit = 'K';
                card.OrderIndex = i;
            }
            else {
                errors.push({Index: i, From:'Joker', Errors: cardNotFound + ' ' +  sheetData.Joker[i][0] });
                helperGoogleApi.updateSheet(sheets, spreedSheetId, 'Joker!A' + (i+2), cardNotFound);
            }
        }

        cards = helperArray.removeDuplicates(cards, 'IdName');
        
        helperJsonFile.savePath('./cards.json', cards);
        return {cards: cards, errors: errors };
    }
}
 
module.exports = refreshCards;
