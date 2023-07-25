const helperGoogleApi = require("../helper/helperGoogleApi");
const helperJsonFile = require("../helper/helperJsonFile");
const helperArray = require("../helper/helperArray");
const cardNotFound = `Cette carte n'a pas été trouvée :`;

class managerTheme {

    static async read(){
        return await helperJsonFile.readPath('./formats.json');
    }
  
    static async save(data){
        helperJsonFile.save('formats', data);
    }

    static getSheetRanges(){return ["Formats!B2:J", 'Bonus!B2:B','Limit0!B2:B', 'Limit1!B2:C', 'Joker!B2:B'];}

    static refresh= (sheetData, cards, sheets, spreedSheetId) => {
        if(!sheetData)
            return [];

        let errors=[];
        let updateSheet =[];
        let data = sheetData.Formats.map(x=> {
            return {
                Id: x[0], Title: x[1], Date: x[2],  MainCard: x[3], Bonus: x[4], Limit0: x[5], Limit1: x[6], Limit1Groups: x[7], Joker: x[8]
            };
        });

        let formatTest = this.buildFormatTest(sheetData, errors, cards, updateSheet);
        data.push(formatTest.Format);
        errors = errors.concat(formatTest.Errors);

        this.save(data);

        helperGoogleApi.updateSheetMultiple(sheets, spreedSheetId, updateSheet);

        return {formats: data, errors : errors};
    }

    static buildFormatTest(sheetData, errors, cards, updateSheet){
        let format = {
            Id: "test", 
            Title: "Test", 
            Date:new Date().toLocaleDateString("fr"), 
            MainCard: "Dark King of the Abyss"
        };
        format.Bonus = this.handleCardList(sheetData.Bonus, cards, updateSheet, errors);
        
        format.Limit0 = this.handleCardList(sheetData.Limit0, cards, updateSheet, errors);
        
        format.Limit1 = this.handleCardList(sheetData.Limit1, cards, updateSheet, errors);
        
        format.Joker = this.handleCardList(sheetData.Joker, cards, updateSheet, errors);
        
        format.Limit1Groups = helperArray.removeDuplicates(sheetData.Limit1.filter(x=> x[1]).map(x=> x[1])).join("| ");

        return {Errors: errors, Format: format}
    }

    static handleCardList(data, cards, updateSheet, errors){
        let result = [];
        
        if(!data || data.length < 1)
            return "";        
        
        for(let i =0 ; i< data.length; i++)
        {
            let idName = data[i][0].cleanup();
            let card = cards.find(x=> x.IdName === idName);
            let errorOccur = false;
            if(card) result.push(card.NameEn);
            else {
                errorOccur=true;
                errors.push({Index: i, From:'Limit1', Errors: cardNotFound + ' ' +  data[i][0]});
            }
            updateSheet.push({range: 'Limit1!A' + (i+2), value:errorOccur ? cardNotFound : ''});
        }

        return result.join(", ");
    }
    
    

    static verifyOldFormats= (formats, cards, sheets, spreedSheetId) => {
        let errors=[];
        let cardsProperties = ["Limit0Cards", "Limit1Cards", "Joker", "Bonus"]

        for(let index =0 ; index< formats.length; index++)
        {
            let format = formats[index];
            let sheetLine = index+2;
            let missingCards= [];

            let mainCard = cards.find(x=> x.IdName === format.MainCard?.cleanup());
            if(mainCard) format.MainCardImage= mainCard.Image;
            else missingCards.push(format.MainCard);

            cardsProperties.forEach(property => {
                let cardsArray = format[property];
                if(cardsArray)
                    cardsArray.split(',').forEach(cardName => {
                        let card = cards.find(x=> x.IdName === cardName?.cleanup());
                        if(!card) missingCards.push(cardName);
                    });
            });
            
            let errorMessage = '';
            if(missingCards.length > 0)
            {
                errorMessage = cardNotFound + ' ' +  missingCards.join(', ');
                errors.push({Index: index, From:'Formats', Errors: errorMessage}); 
            }
            updateSheet.push({range: 'Formats!A' + sheetLine, value:errorMessage});
        } 

        helperGoogleApi.updateSheetMultiple(sheets, spreedSheetId, updateSheet);

        return errors;
    }
}
 
module.exports = managerTheme;
