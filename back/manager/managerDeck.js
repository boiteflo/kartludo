const helperGoogleApi = require("../helper/helperGoogleApi");
const helperJsonFile = require("../helper/helperJsonFile");
const helperArray = require("../helper/helperArray");
const cardsNotFound = `Les cartes suivantes n'ont pas été trouvées : `;
let spreedSheetId= '1tRkMQB_w_rb0mubb-7PEWsepUfCGroLjHZDO_KewBd4';

class managerDeck {

    static rebuildDecks(deckData, errors, page, cards, updateSheet){
        if(!deckData)
            return [];

        let decks = deckData.map(x=> {
            return {
            "Id": x[0], "Rank": x[1], "Title": x[2], "Date": x[3], "Author": x[4], "MainCards": x[5], "Themes": x[6], "DeckList": x[7] 
            };
        });

        for(let deckIndex =0 ; deckIndex< decks.length; deckIndex++)
        {
            let deck = decks[deckIndex];            
            let errorsCards = [];
            let sheetLine = deckIndex+2;
            deck.Rank = deck.Rank ?? 3;

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
            let deckCards = [];
            for(let cardIndex =0 ; cardIndex< deckList.length; cardIndex++)
            {
                const cardNameEn = deckList[cardIndex];
                let quantity = cardNameEn.includesX2() ? '2' : '1';
                let cardIdName = cardNameEn.cleanup().removeX2();
                const card = cards.find(x=> x.IdName === cardIdName);
                if(!card)
                    errorsCards.push(cardNameEn);
                else
                    deckCards.push({Card: card, Quantity: quantity});
            }
            
            deck.Errors = this.getErrors(deck, deckCards);
                
            let errorMessage = '';
            if(errorsCards.length > 0 || deck.Errors){
                if(errorsCards.length > 0)
                    errorMessage = cardsNotFound + errorsCards.join(', ');
                if(deck.Errors)
                    errorMessage += ' ' + deck.Errors;
                errors.push({Index: deckIndex, From:page, Errors: deck.Title + ' ' + errorMessage });
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

    static async getAll(res){        
        helperJsonFile.readPath('./decks.json').then(data => res.send(data));
    }

    static async get(id, res){        
        let data = await helperJsonFile.readPath('./decks.json');
        let deck= data.Decks.find(x=> x.Id === id);
        if(!deck)
            deck= data.DecksCommunity.find(x=> x.Id === id);
        res.send(deck);    
    }

    static getErrors(deck, deckCards){
        let errors = [];
        let forbiddenCards = deckCards.filter(x=> x.Card.Limit === '0');
        if(forbiddenCards.length > 0)
            errors.push('carte interdites : ' + forbiddenCards.map(x=> x.Card.NameEn).join(', '));
        
        forbiddenCards = deckCards.filter(x=> x.Card.Limit == '1' && x.Quantity === '2');
        if(forbiddenCards.length > 0)
            errors.push('carte limitées : ' + forbiddenCards.map(x=> x.Card.NameEn).join(', '));

        deck.DeckLength = 0;
        let jokerLength = 0;
        deckCards.forEach(deckObj => {
            let quantity = deckObj.Quantity === '2' ? 2 : 1;
            if(deckObj.Card.Limit == 'K')
                jokerLength += quantity;
            deck.DeckLength+= quantity;
        });

        if(jokerLength > 3)
            errors.push('Il y a trop de jokers : ' + jokerLength);
        
        let limitFriends = helperArray.removeDuplicates(deckCards.filter(x=> x.Card.LimitFriends).map(x=> x.Card.LimitFriends));
        limitFriends.forEach(group => {
            let groupCardIdNames = group.split(',');
            let groupCards = deckCards.filter(x=> groupCardIdNames.includes(x.Card.IdName));
            if(groupCards.length > 1)
                errors.push('Ce groupe de limitation n est pas respecté : ' + group);
        });

        if(deck.DeckLength < 40)
            errors.push('Pas asser de cartes : ' + deck.DeckLength);

        return errors.length < 1 ? null : errors.join(', ');
    }

    static async insert(deck, res){        
        let cards = await helperJsonFile.read('cards');
        let cardsIdName = cards.map(x=> x.IdName);
      
        let missingCards = deck.DeckListCards.filter(x=> !cardsIdName.includes(x.Card.IdName)).map(x=> x.Card.NameEn);
        let errorMessage = missingCards.length < 1 ? '' : `Les cartes suivantes n'ont pas été trouvées :` + missingCards.join(",");
      
        let deckList = [deck.DeckListCards.filter(x=> cardsIdName.includes(x.Card.IdName)).map(x=> x.Card.NameEn.onlyAlphaNumericAndSpace() + (x.Quantity==='2' ? ' x2' : ''))];
        let mainCards = deck.MainCards.slice(0,3).map(x=> x.NameEn.onlyAlphaNumericAndSpace()).join(', ');
        
        deck.Rank = deck.Rank.Id;

        const helperGoogleApi = require("../helper/helperGoogleApi");
        const { sheets } = await helperGoogleApi.authSheets();
        let requestsPages = ['Decks2!B2:I'];  
        const sheetData = await helperGoogleApi.getSheetMultipleContent(sheets,spreedSheetId, requestsPages);

        const sheetLine = sheetData.Decks2 ? sheetData.Decks2.length+2 : 2;
        let updateSheet = [];
        updateSheet.push({range: 'Decks2!A' + sheetLine, value:errorMessage});
        updateSheet.push({range: 'Decks2!B' + sheetLine, value:"".guid()});
        updateSheet.push({range: 'Decks2!C' + sheetLine, value:deck.Rank});
        updateSheet.push({range: 'Decks2!D' + sheetLine, value:deck.Title});
        updateSheet.push({range: 'Decks2!E' + sheetLine, value:new Date().toLocaleDateString("fr")});
        updateSheet.push({range: 'Decks2!F' + sheetLine, value:deck.Author});
        updateSheet.push({range: 'Decks2!G' + sheetLine, value:mainCards});
        updateSheet.push({range: 'Decks2!H' + sheetLine, value:deck.ThemesId.join(',')});
        updateSheet.push({range: 'Decks2!I' + sheetLine, value:deckList.join(', ')});
        
        helperGoogleApi.updateSheetMultiple(sheets, spreedSheetId, updateSheet);
      
        res.status(201).send();
    }
}
 
module.exports = managerDeck;
