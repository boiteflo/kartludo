var express = require('express'),
router = express.Router();

const helperGoogleApi = require("../helper/helperGoogleApi");
const helperJsonFile = require("../helper/helperJsonFile");

let spreedSheetId= '1tRkMQB_w_rb0mubb-7PEWsepUfCGroLjHZDO_KewBd4';

const generateCards= async function(sheetData){
    let errors=[];
    let cards = await helperJsonFile.readPath('./cards.json');

    // Bonus
    if(sheetData.Bonus && sheetData.Bonus.length > 0){
      sheetData.Bonus.forEach(cardArray=> {
        cards.push({
          "IdName": cardArray[0].cleanup(),
          "NameEn":cardArray[0],
          "NameFr":cardArray[1],
          "Image":cardArray[2]
        });
      });
    }          

    // Limit
    const limit0 = sheetData.Limit0.map(x=> x[0].cleanup());
    const limit1 = sheetData.Limit1.map(x=> x[0].cleanup());
    const joker = sheetData.Joker.map(x=> x[0].cleanup());

    cards.forEach(card => {
        card.IdName= card.NameEn.cleanup();
        card.Limit = limit0.includes(card.IdName) ? '0'
          : limit1.includes(card.IdName) ? '1'
          : joker.includes(card.IdName) ? 'K'
          :'';
    });
    
    cards.filter(x=> x.LimitFriends).forEach(x => {
      let ids = x.LimitFriends.split(',').map(x=> x.cleanup());
      x.LimitFriendsCards = cards.filter(x=> ids.includes(x.Id)).map(x=> {return {IdName:x.IdName, Image:x.Image}});
    });
    
    helperJsonFile.savePath('./cards.json', cards);
    return {cards: cards, errors: errors };
}

const generateDecks= function(sheetData, cards, sheets){
  let errors=[];
  let decks = sheetData.Decks.map(x=> {
    return {
      "Id": x[0], "IdParent": x[1], "Title": x[2], "Date": x[3], "Autor": x[4], "MainCards": x[5], "Combo": x[6], "DeckList": x[7] 
    };
  });

  for(let deckIndex =0 ; deckIndex< decks.length; deckIndex++)
  {
    let deck = decks[deckIndex];
    let errorsCards = [];

    deck.MainCardsIds = deck.MainCards.split(',').map(x=> x.cleanup());
    let mainCardsImages = cards.filter(x=> deck.MainCardsIds.includes(x.IdName));
    deck.MainCardsImages=mainCardsImages.map(x=> x.Image);
    if(deck.MainCardsImages.length < deck.MainCards.length)
      errorsCards=deck.MainCards
        .split(',')
        .filter(x=> !mainCardsImages.find(y=> y.IdName===x.cleanup()));

      
    deck.DeckListImages = [];
    let deckList = deck.DeckList.split(',');
    for(let cardIndex =0 ; cardIndex< deckList.length; cardIndex++)
    {
      const cardNameEn = deckList[cardIndex];
      let quantity = cardNameEn.includesX2() ? '2' : '1';
      let cardIdName = cardNameEn.cleanup().removeX2();
      const card = cards.find(x=> x.IdName === cardIdName);
      if(card)
        deck.DeckListImages.push({Order:cardIndex, NameEn:card.NameEn, NameFr:card.NameFr, Image:card.Image, Quantity: quantity});
      else
        errorsCards.push(cardNameEn);
    }
        
    if(errorsCards.length > 0){
      let errorMessage = `Les cartes suivantes n'ont pas été trouvées : ` + errorsCards.join(', ');
      errors.push({Index: deckIndex, From:'Deck', Errors: errorsCards.join(', ') });
      let sheetLine = deckIndex+2;
      helperGoogleApi.updateSheet(sheets, spreedSheetId, 'Decks!A' + sheetLine, errorMessage);
    }
  } 
  
  helperJsonFile.save('decks', decks);
  return errors;
};

router
  .get('/', async (req, res) => {
    let errors = [];

    const { sheets } = await helperGoogleApi.authSheets();
    let requestsPages = ['Bonus!B2:D','Limit0!B2:B', 'Limit1!B2:C', 'Joker!B2:B', 'Decks!B2:I'];    
    const sheetData = await helperGoogleApi.getSheetMultipleContent(sheets,spreedSheetId, requestsPages);
    
    let cardsResult = await generateCards(sheetData);
    let cards = cardsResult.cards;
    errors = errors.concat(cardsResult.errors);

    let deckErrrors = generateDecks(sheetData, cards, sheets);
    errors = errors.concat(deckErrrors);

    res.send(errors.length < 1 ? 'Importation réussie' : 'Des erreurs sont survenues : ' + errors
      .map(x=> `${x.From}!Ligne${x.Index+2} : Les cartes suivantes n'ont pas été trouvées : ${x.Errors}`));  
    });
  
module.exports = router;