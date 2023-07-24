
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
        let errorJokerQuantityx2 = [];
        deckCards.forEach(cardObj => {
            let quantity = cardObj.Quantity === '2' ? 2 : 1;
            
            if(cardObj.Quantity === '2')
                x2Length++;
            if(cardObj.Card.Limit == 'K')
                jokerLength += quantity;
            if(cardObj.Card.Limit == 'K' && cardObj.Quantity === '2')
                errorJokerQuantityx2.push(cardObj.Card.NameEn);
            
            deck.DeckLength+= quantity;
        });

        if(jokerLength > 3)
            errors.push('Il y a trop de jokers : ' + jokerLength);

        if(x2Length > 3)
            errors.push('Il y a trop de doublons : ' + x2Length);

        if(errorJokerQuantityx2.length > 0)
            errors.push('Les cartes jokers sont limité à un seul exemplaire. Cartes a corriger :' + errorJokerQuantityx2.join(', '));
        
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
