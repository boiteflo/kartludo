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
        /*
        if(sheetData.Extra && sheetData.Extra.length > 0){
            sheetData.Extra.forEach(cardArray=>
                cards.push({
                    "IdName": cardArray[0].cleanup(),
                    "IdNameFr": cardArray[1].cleanup(),
                    "NameEn":cardArray[0].replaceMany(',',''),
                    "NameFr":cardArray[1].replaceMany(',',''),
                    "Image":cardArray[2],
                    "Bonus": true
                })
            );
        }
        */

        cards = helperArray.removeDuplicatesObjects(cards, 'IdName');

        cards = cards.map(x=> {return {
            IdName: x.IdName,
            IdNameFr: x.IdNameFr,
            NameEn: x.NameEn,
            NameFr: x.NameFr,
            Image: x.Image,
            Animation: x.Animation,
            Bonus : x.Bonus,
            ImageMDM:x.ImageMDM,
            Type:x.Type,
            TypeMonster:x.TypeMonster,
            ToExtraDeck:x.ToExtraDeck,
            KonamiID:x.KonamiID,
            Level:x.Level,
            Scale:x.Scale,
            Race:x.Race,
            Attribute:x.Attribute,
            Atk:x.Atk,
            Def:x.Def,
            Rarity:x.Rarity,
            TcgRelease:x.TcgRelease
        }});
        
        helperJsonFile.savePath('./cards.json', cards);
        helperGoogleApi.updateSheetMultiple(sheets, spreedSheetId, updateSheet);
        return {cards: cards, errors: errors };
    }
}
 
module.exports = managerCard;
