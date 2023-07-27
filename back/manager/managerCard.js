const helperGoogleApi = require("../helper/helperGoogleApi");
const helperJsonFile = require("../helper/helperJsonFile");
const helperArray = require("../helper/helperArray");
let spreedSheetId= '1tRkMQB_w_rb0mubb-7PEWsepUfCGroLjHZDO_KewBd4';

class managerCard {

    static async insertMDM(cards, res){       
        const { sheets } = await helperGoogleApi.authSheets();
        let requestsPages = ['Extra!B3:I'];  
        const sheetData = await helperGoogleApi.getSheetMultipleContent(sheets,spreedSheetId, requestsPages);

        let errorMessage = '';
        let sheetLine = sheetData.Extra ? sheetData.Extra.length+3 : 2;
        let updateSheet = [];
        
        for(let i = 0; i< cards.length; i++){
            const card = cards[i];
            updateSheet.push({range: 'Extra!A' + (sheetLine+i), value:errorMessage});
            updateSheet.push({range: 'Extra!B' + (sheetLine+i), value:card.NameEn.replaceMany(',','')});
            updateSheet.push({range: 'Extra!C' + (sheetLine+i), value:card.NameFr?.replaceMany(',','')});
            updateSheet.push({range: 'Extra!D' + (sheetLine+i), value:card.Type});
            updateSheet.push({range: 'Extra!E' + (sheetLine+i), value:card.TypeMonster});
            updateSheet.push({range: 'Extra!F' + (sheetLine+i), value:card.Level});
            updateSheet.push({range: 'Extra!G' + (sheetLine+i), value:card.Rarity});
            updateSheet.push({range: 'Extra!H' + (sheetLine+i), value:card.ImageMDM});
            updateSheet.push({range: 'Extra!I' + (sheetLine+i), value:card.Image});

            console.log((sheetLine+i) + card.NameEn);
        }
        
        helperGoogleApi.updateSheetMultiple(sheets, spreedSheetId, updateSheet);
      
        res.status(201).send('Les cartes ont été insérés dans la liste des cartes a ajouter.');
    }
    
    static getSheetRanges(){return ["Extra!B3:H"];}

    static refresh= (sheetData, sheets, spreedSheetId) => {
        let errors=[];
        let updateSheet = [];
        let cards = require("../data/cards.js");
        
        // Extra
        
        if(sheetData.Extra && sheetData.Extra.length > 0){
            sheetData.Extra.forEach(cardArray=>
                cards.push({
                    "IdName": cardArray[0].cleanup(),
                    "IdNameFr": cardArray[1].cleanup(),
                    "NameEn":cardArray[0].replaceMany(',',''),
                    "NameFr":cardArray[1].replaceMany(',',''),
                    "Type": cardArray[2] ?? "",
                    "TypeMonster": cardArray[3] ?? "",
                    "Level": cardArray[4] ?? "",
                    "Rarity": cardArray[5] ?? "",
                    "Image":cardArray[6] ?? "",
                    "ImageMDM":cardArray[6] ?? "",
                    "Bonus": true,
                })
            );
        }
        

        cards = helperArray.removeDuplicatesObjects(cards, 'IdName');

        cards = cards.map(x=> {return {
            IdName: x.IdName,
            IdNameFr: x.IdNameFr,
            NameEn: x.NameEn,
            NameFr: x.NameFr,
            Animation: x.Animation,
            Bonus : x.Bonus,
            ImageMDM:x.ImageMDM,
            Type:x.Type,
            TypeMonster:x.TypeMonster,
            ToExtraDeck:x.ToExtraDeck,
            Level:x.Level,
            Rarity:x.Rarity
        }});
        
        helperJsonFile.savePath('./back/data/cards.json', cards);
        helperGoogleApi.updateSheetMultiple(sheets, spreedSheetId, updateSheet);
        return {cards: cards, errors: errors };
    }
}
 
module.exports = managerCard;
