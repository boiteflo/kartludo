const helperGoogleApi = require("../helper/helperGoogleApi");
const helperJsonFile = require("../helper/helperJsonFile");
const cardNotFound = `Cette carte n'a pas été trouvée :`;

class managerTheme {

    static rebuild(themeData, errors, cards, updateSheet){
        if(!themeData)
            return [];

        let data = themeData.map(x=> {
            return {
                "Group": x[0], "Id": x[1], "Title": x[2], "CardIdName": x[3].cleanup(),  "CardNameEn": x[3]
            };
        });

        for(let index =0 ; index< data.length; index++)
        {
            let theme = data[index];
            let sheetLine = index+2;
            let errorMessage = '';

            let card = cards.find(x=> x.IdName === theme.CardIdName);
            if(card)
                theme.CardImage= card.Image;
            else
            {
                errorMessage = cardNotFound;
                errors.push({Index: index, From:'Themes', Errors: cardNotFound + ' ' +  theme.CardNameEn}); 
            }
            
            updateSheet.push({range: 'Themes!A' + sheetLine, value:errorMessage});
        } 

        return data;
    }
    
    static refresh= (sheetData, cards, sheets, spreedSheetId) => {
        let errors=[];
        let updateSheet = [];
        let themes = this.rebuild(sheetData.Themes, errors, cards, updateSheet);
        helperJsonFile.save('themes', themes);
        helperGoogleApi.updateSheetMultiple(sheets, spreedSheetId, updateSheet);
        return errors;
    }
}
 
module.exports = managerTheme;
