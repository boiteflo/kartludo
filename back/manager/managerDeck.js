const helperGoogleApi = require("../helper/helperGoogleApi");
const helperJsonFile = require("../helper/helperJsonFile");
const cardsNotFound = `Les cartes suivantes n'ont pas été trouvées : `;

class managerDeck {

    static rebuildDecks(deckData, errors, page, cards, updateSheet){
        if(!deckData)
            return [];

        let decks = deckData.map(x=> {
            return {
            "Id": x[0], "IdParent": x[1], "Title": x[2], "Date": x[3], "Author": x[4], "MainCards": x[5], "Themes": x[6], "DeckList": x[7], "Rank": x[8] 
            };
        });

        for(let deckIndex =0 ; deckIndex< decks.length; deckIndex++)
        {
            let deck = decks[deckIndex];
            delete deck.Password;
            delete deck.DeckListCards;
            let errorsCards = [];
            let sheetLine = deckIndex+2;

            if(!deck.Id || deck.Id.length < 8){
                deck.Id = "".guid();
                updateSheet.push({range: page + '!B' + sheetLine, value:deck.Id});
            }

            // MainCardsIds
            deck.MainCardsIds = deck.MainCards.split(',').map(x=> x.cleanup());
            let mainCardsImages = cards.filter(x=> deck.MainCardsIds.includes(x.IdName));
            deck.MainCardsImages=mainCardsImages.map(x=> x.Image);
            if(deck.MainCardsImages.length < deck.MainCards.length)
                errorsCards=deck.MainCards
                    .split(',')
                    .filter(x=> !mainCardsImages.find(y=> y.IdName===x.cleanup()));

            // DeckList
            let deckList = deck.DeckList.split(',');
            for(let cardIndex =0 ; cardIndex< deckList.length; cardIndex++)
            {
                const cardNameEn = deckList[cardIndex];
                let cardIdName = cardNameEn.cleanup().removeX2();
                const card = cards.find(x=> x.IdName === cardIdName);
                if(!card)
                    errorsCards.push(cardNameEn);
            }
                
            let errorMessage = '';
            if(errorsCards.length > 0){
                errors.push({Index: deckIndex, From:'Deck', Errors: cardsNotFound + ' ' + errorsCards.join(', ') });
                errorMessage = cardsNotFound + errorsCards.join(', ');
            }
            
            updateSheet.push({range: page + '!A' + sheetLine, value:errorMessage});
        } 

        return decks;
    }
    
    static refresh= (sheetData, cards, sheets, spreedSheetId) => {
        let errors=[];
        let updateSheet = [];
        let decks = this.rebuildDecks(sheetData.Decks, errors, 'Decks', cards, updateSheet);
        let decksCommunity = this.rebuildDecks(sheetData.Decks2, errors, 'Decks2', cards, updateSheet);
        
        helperJsonFile.save('decks', {Decks: decks, DecksCommunity: decksCommunity});
        helperGoogleApi.updateSheetMultiple(sheets, spreedSheetId, updateSheet);
        return errors;
    }
}
 
module.exports = managerDeck;
