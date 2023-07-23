
import helperArray from '../helpers/helperArray'

class ServiceDeck {
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
        let x2Length = 0;
        deckCards.forEach(deckObj => {
            let quantity = deckObj.Quantity === '2' ? 2 : 1;
            if(deckObj.Quantity === '2')
                x2Length++;
            if(deckObj.Card.Limit == 'K')
                jokerLength += quantity;
            deck.DeckLength+= quantity;
        });

        if(jokerLength > 3)
            errors.push('Il y a trop de jokers : ' + jokerLength);

        if(x2Length > 3)
            errors.push('Il y a trop de doublons : ' + x2Length);
        
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
}


export default ServiceDeck;
