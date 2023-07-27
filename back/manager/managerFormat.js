const helperGoogleApi = require("../helper/helperGoogleApi");
const helperJsonFile = require("../helper/helperJsonFile");
const helperArray = require("../helper/helperArray");
const cardNotFound = `Cette carte n'a pas été trouvée :`;
let spreedSheetId= '1tRkMQB_w_rb0mubb-7PEWsepUfCGroLjHZDO_KewBd4';

class managerTheme {

    static async read(){
        return await helperJsonFile.readPath('./back/data/formats.json');
    }
  
    static async save(data){
        helperJsonFile.save('./back/data/formats', data);
    }

    static async getAll(res){        
        res.send(await this.read());
    }

    static async get(id, res){        
        let data = await this.read();
        res.send(data.find(x=> x.Id === id));    
    }

    static async insert(format, res){
        format = {
            Id: format.Title.cleanup(), 
            Title:  format.Title, 
            Author:  format.Author, 
            Date:new Date().toLocaleDateString("fr"), 
            MainCard:  format.MainCard,
            Bonus: format.Bonus,
            Limit0: format.Limit0,
            Limit1: format.Limit1,
            Limit1Groups: format.Limit1Groups,
            Joker: format.Joker
        };

        const helperGoogleApi = require("../helper/helperGoogleApi");
        const { sheets } = await helperGoogleApi.authSheets();
        let requestsPages = ['Formats!B2:K'];  
        const sheetData = await helperGoogleApi.getSheetMultipleContent(sheets,spreedSheetId, requestsPages);

        const sheetLine = sheetData.Formats ? sheetData.Formats.length+2 : 2;
        let updateSheet = [];
        
        updateSheet.push({range: 'Formats!A' + sheetLine, value:''});
        updateSheet.push({range: 'Formats!B' + sheetLine, value:format.Id});
        updateSheet.push({range: 'Formats!C' + sheetLine, value:format.Title});
        updateSheet.push({range: 'Formats!D' + sheetLine, value:format.Date});
        updateSheet.push({range: 'Formats!E' + sheetLine, value:format.Author});
        updateSheet.push({range: 'Formats!F' + sheetLine, value:format.MainCard});
        updateSheet.push({range: 'Formats!G' + sheetLine, value:format.Bonus});
        updateSheet.push({range: 'Formats!H' + sheetLine, value:format.Limit0});
        updateSheet.push({range: 'Formats!I' + sheetLine, value:format.Limit1});
        updateSheet.push({range: 'Formats!J' + sheetLine, value:format.Limit1Groups});
        updateSheet.push({range: 'Formats!K' + sheetLine, value:format.Joker});
        
        helperGoogleApi.updateSheetMultiple(sheets, spreedSheetId, updateSheet);

        let data = await this.read();
        data.push(format);
        this.save(data);
      
        res.status(201).send(format.Id);
    }

    static getSheetRanges(){return ["Formats!B2:K", 'Bonus!B2:B','Limit0!B2:B', 'Limit1!B2:C', 'Joker!B2:B'];}

    static refresh= (sheetData, cards, sheets, spreedSheetId) => {
        if(!sheetData)
            return [];

        let errors=[];
        let updateSheet =[];
        let data = sheetData.Formats.map(x=> {
            return {
                Id: x[0], Title: x[1], Date: x[2], Author: x[3],  MainCard: x[4], Bonus: x[5], Limit0: x[6], Limit1: x[7], Limit1Groups: x[8], Joker: x[9]
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
            MainCard: ""
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
