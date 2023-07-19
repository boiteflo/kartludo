const helperGoogleApi = require("../helper/helperGoogleApi");
const helperJsonFile = require("../helper/helperJsonFile");
const cardsNotFound = `Les cartes suivantes n'ont pas été trouvées : `;

class refreshDecks {

    static rebuildDecks(deckData, errors, cards, sheets, spreedSheetId){
        if(!deckData)
            return [];

        let decks = deckData.map(x=> {
            return {
            "Id": x[0], "IdParent": x[1], "Title": x[2], "Date": x[3], "Autor": x[4], "MainCards": x[5], "Combo": x[6], "DeckList": x[7] 
            };
        });

        for(let deckIndex =0 ; deckIndex< decks.length; deckIndex++)
        {
            let deck = decks[deckIndex];
            let errorsCards = [];

            // MainCardsIds
            deck.MainCardsIds = deck.MainCards.split(',').map(x=> x.cleanup());
            let mainCardsImages = cards.filter(x=> deck.MainCardsIds.includes(x.IdName));
            deck.MainCardsImages=mainCardsImages.map(x=> x.Image);
            if(deck.MainCardsImages.length < deck.MainCards.length)
                errorsCards=deck.MainCards
                    .split(',')
                    .filter(x=> !mainCardsImages.find(y=> y.IdName===x.cleanup()));

            deck.DeckListCards = [];
            let deckList = deck.DeckList.split(',');
            for(let cardIndex =0 ; cardIndex< deckList.length; cardIndex++)
            {
                const cardNameEn = deckList[cardIndex];
                let quantity = cardNameEn.includesX2() ? '2' : '1';
                let cardIdName = cardNameEn.cleanup().removeX2();
                const card = cards.find(x=> x.IdName === cardIdName);
                if(card)
                    deck.DeckListCards.push({Order:cardIndex, Quantity: quantity, Card: card});
                else
                    errorsCards.push(cardNameEn);
            }
                
            if(errorsCards.length > 0){
                let errorMessage = cardsNotFound + errorsCards.join(', ');
                errors.push({Index: deckIndex, From:'Deck', Errors: cardsNotFound + ' ' + errorsCards.join(', ') });
                let sheetLine = deckIndex+2;
                helperGoogleApi.updateSheet(sheets, spreedSheetId, 'Decks!A' + sheetLine, errorMessage);
            }
        } 

        return decks;
    }
    
    static refresh= (sheetData, cards, sheets, spreedSheetId) => {
        let errors=[];
        let decks = this.rebuildDecks(sheetData.Decks, errors, cards, sheets, spreedSheetId);
        let decksCommunity = this.rebuildDecks(sheetData.Decks2, errors, cards, sheets, spreedSheetId);
        
        helperJsonFile.save('decks', {Decks: decks, DecksCommunity: decksCommunity});
        return errors;
    }
}
 
module.exports = refreshDecks;
