const helperGoogleApi = require("../helper/helperGoogleApi");
const helperJsonFile = require("../helper/helperJsonFile");
const helperArray = require("../helper/helperArray");
const cardNotFound = `Cette carte n'a pas été trouvée :`;

class managerCard {
    
    static getSheetRanges(){return ["Extra!B2:D"];}

    static refresh= (sheetData, sheets, spreedSheetId) => {
        let errors=[];
        let updateSheet = [];
        let cards = require("../data/cards");
        
        // Extra
        if(sheetData.Extra && sheetData.Extra.length > 0){
            sheetData.Extra.forEach(cardArray=>
                cards.push({
                    "IdName": cardArray[0].cleanup(),
                    "IdNameFr": cardArray[1].cleanup(),
                    "NameEn":cardArray[0],
                    "NameFr":cardArray[1],
                    "Image":cardArray[2],
                    "Bonus": true
                })
            );
        }

        cards = helperArray.removeDuplicatesObjects(cards, 'IdName');

        cards = cards.map(x=> {return {
            IdName: x.IdName,
            IdNameFr: x.IdNameFr,
            NameEn: x.NameEn,
            NameFr: x.NameFr,
            Image: x.Image,
            Bonus : x.Bonus
        }});
        
        helperJsonFile.savePath('./cards.json', cards);
        helperGoogleApi.updateSheetMultiple(sheets, spreedSheetId, updateSheet);
        return {cards: cards, errors: errors };
    }
}
 
module.exports = managerCard;
