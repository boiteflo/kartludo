const helperGoogleApi = require("../helper/helperGoogleApi");
const helperJsonFile = require("../helper/helperJsonFile");
const helperArray = require("../helper/helperArray");
const cardNotFound = `Cette carte n'a pas été trouvée :`;

class managerCard {
    
    static refresh= (sheetData, sheets, spreedSheetId) => {
        let errors=[];
        let updateSheet = [];
        let cards = require("../data/cards");
        
        // Bonus
        if(sheetData.Bonus && sheetData.Bonus.length > 0){
            sheetData.Bonus.forEach(cardArray=> {
                let card = cards.find(x=> x.NameEn.cleanup() === cardArray[0].cleanup());
                if(card)
                    card.Bonus=true;
                else
                    cards.push({
                        "IdName": cardArray[0].cleanup(),
                        "NameEn":cardArray[0],
                        "NameFr":cardArray[1],
                        "Image":cardArray[2],
                        "Bonus":true
                    });
            });
        }     

        cards.forEach(card => {
            card.Limit = '';
            delete card.LimitFriendsCards;
            delete card.LimitFriendsImages;
            card.LimitFriends = '';
            card.IdName = card.NameEn.cleanup();
            card.IdNameFr = card.NameFr.cleanup();
        });

        // Limit0
        for(let i =0 ; i< sheetData.Limit0.length; i++)
        {
            let idName = sheetData.Limit0[i][0].cleanup();
            let card = cards.find(x=> x.IdName === idName);
            let errorOccur = false;
            if(card) {
                card.Limit = '0';
                card.OrderIndex = i;
            }
            else {
                errorOccur=true;
                errors.push({Index: i, From:'Limit0', Errors: cardNotFound + ' ' +  sheetData.Limit0[i][0]});
            }
            updateSheet.push({range: 'Limit0!A' + (i+2), value:errorOccur ? cardNotFound : ''});
        }

        // Limit1
        for(let i =0 ; i< sheetData.Limit1.length; i++)
        {
            let idName = sheetData.Limit1[i][0].cleanup();
            let card = cards.find(x=> x.IdName === idName);
            let errorOccur = false;

            if(card) {
                card.Limit = '1';
                card.OrderIndex = i;
                
                let limitFriends = sheetData.Limit1[i][1];
                if(limitFriends){
                    limitFriends = limitFriends.split(',').map(x=> x.cleanup());
                    let LimitFriendsCards = cards.filter(x=> limitFriends.includes(x.IdName));
                    card.LimitFriends = LimitFriendsCards.map(x=> x.IdName).join(',');
                }
            }
            else {
                errorOccur=true;
                errors.push({Index: i, From:'Limit1', Errors: cardNotFound + ' ' +  sheetData.Limit1[i][0] });
            }
            updateSheet.push({range: 'Limit1!A' + (i+2), value:errorOccur ? cardNotFound : ''});
        }

        // Joker
        for(let i =0 ; i< sheetData.Joker.length; i++)
        {
            let idName = sheetData.Joker[i][0].cleanup();
            let card = cards.find(x=> x.IdName === idName);
            let errorOccur = false;

            if(card) {
                card.Limit = 'K';
                card.OrderIndex = i;
            }
            else {
                errorOccur=true;
                errors.push({Index: i, From:'Joker', Errors: cardNotFound + ' ' +  sheetData.Joker[i][0] });
            }

            updateSheet.push({range: 'Joker!A' + (i+2), value:errorOccur ? cardNotFound : ''});
        }

        cards = helperArray.removeDuplicates(cards, 'IdName');
        
        helperJsonFile.savePath('./cards.json', cards);
        helperGoogleApi.updateSheetMultiple(sheets, spreedSheetId, updateSheet);
        return {cards: cards, errors: errors };
    }
}
 
module.exports = managerCard;
