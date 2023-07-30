const helperGoogleApi = require("../helper/helperGoogleApi");
const helperJsonFile = require("../helper/helperJsonFile");
const deckNotFound = `Ce deck n'a pas été trouvé`;

class managerTournameent {

    static getSheetRanges(){return ["Tournaments!B2:F"];}

    static rebuild(sheetData, errors, decks, updateSheet){
        if(!sheetData)
            return [];

        let data = sheetData.map(x=> {
            return {
                "Id":x[0],
                "Date":x[1],
                "Organizer": x[2],
                "Title":x[3],
                "Actif":!x[4] || x[4].length < 1,
                "Results":x[4] ? x[4].replaceMany(',', ' ').replaceMany('\n',',') :''
            };
        });
        
        for(let index =0 ; index< data.length; index++)
        {
            let tournament = data[index];
            let sheetLine = index+2;
            let errorMessage = '';

            if(tournament.Results && tournament.Results.length > 0){
                let tournamentDecks = tournament.Results.split(',');
                let deckData = tournamentDecks[0].split(':');
                let deckId = deckData[1];
    
                let deck = decks.find(x=> x.Id === deckId);
                if(deck){
                    tournament.MainCard= deck.MainCard;
                    tournament.MainCardImage= deck.MainCardImage;
                }
                else
                {
                    errorMessage = deckNotFound;
                    errors.push({Index: index, From:'Tournaments', Errors: deckNotFound + ' ' +  deckId}); 
                }
    
                updateSheet.push({range: 'Tournaments!A' + sheetLine, value:errorMessage});
            }
            else{
                tournament.MainCard= 'Petit Dragon';
                tournament.MainCardImage= 'https://s3.duellinksmeta.com/cards/60c2b3aca0e24f2d54a530be_w420.webp';
            }      
        } 

        return data;
    }
    
    static refresh= (sheetData, decks, sheets, spreedSheetId) => {
        let errors=[];
        let updateSheet = [];
        let data = this.rebuild(sheetData.Tournaments, errors, decks, updateSheet);
        helperJsonFile.save('./back/data/tournaments', data);
        helperGoogleApi.updateSheetMultiple(sheets, spreedSheetId, updateSheet);
        return errors;
    }
}
 
module.exports = managerTournameent;
