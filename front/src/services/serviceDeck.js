
import helperArray from '../helpers/helperArray'
import helperString from '../helpers/helperString'

class ServiceDeck {   

    static sort(deckCards)
    {
        let result = [];
        deckCards.forEach(x=> {x.Level = x.Card.Level; x.NameEn = x.Card.NameEn});

        let normal = deckCards.filter(x=> x.Card.Type === 'Monster' && x.Card.TypeMonster.includes("Normal") && !x.Card.ToExtraDeck);
        normal = helperArray.sortIntegerDesc(normal, 'Level');
        result = result.concat(normal);

        let rituel = deckCards.filter(x=> x.Card.Type === 'Monster' && x.Card.TypeMonster.includes("Ritual"));
        rituel = helperArray.sortIntegerDesc(rituel, 'Level');
        result = result.concat(rituel);
        
        let effect = deckCards.filter(x=> x.Card.Type === 'Monster' && !x.Card.TypeMonster.includes("Normal") && !x.Card.ToExtraDeck && !x.Card.TypeMonster.includes("Ritual"));
        effect = helperArray.sortIntegerDesc(effect, 'Level');
        result = result.concat(effect);
        
        let spell = deckCards.filter(x=> x.Card.Type === 'Spell');
        spell = helperArray.sort(spell, 'NameEn');
        result = result.concat(spell);
        
        let trap = deckCards.filter(x=> x.Card.Type === 'Trap');
        trap = helperArray.sort(trap, 'NameEn');
        result = result.concat(trap);

        let extra = deckCards.filter(x=> x.Card.ToExtraDeck);
        extra = helperArray.sortIntegerDesc(extra, 'Level');
        result = result.concat(extra);

        return result;
    }

    static getErrors(deck, deckCards, formats, formatSelected){
        let errors = [];
        let cardIdNames = deckCards.map(x=> x.Card.IdName);
        if(cardIdNames.length <1)
            return "Il n'y a pas de cartes dans ce deck";
        if(formatSelected)
            deck.Format = formatSelected;
        
        let format = {Limit0:'', Limit1:'', Joker:'', Limit1Groups:''};
        if(formats && formats.length > 1)
            format = deck.Format ? formats.find(x=>x.Id === deck.Format) : formats[formats.length-2];

        let matchs = helperArray.getMatch(format.Limit0.split(',').map(x=> helperString.cleanup(x)), cardIdNames);
        let deckCardsMatchs = deckCards.filter(x=> matchs.includes(x.Card.IdName));
        if(deckCardsMatchs.length > 0)
            errors.push('Il y a des carte interdites : ' + deckCardsMatchs.map(x=> x.Card.NameEn).join(', '));
        
        matchs = helperArray.getMatch(format.Limit1.split(',').map(x=> helperString.cleanup(x)), cardIdNames);
        deckCardsMatchs = deckCards.filter(x=> matchs.includes(x.Card.IdName) && x.Quantity === '2');
        if(deckCardsMatchs.length > 0)
            errors.push('Il y a des carte limitées en doublon : ' + deckCardsMatchs.map(x=> x.Card.NameEn).join(', '));

        matchs = helperArray.getMatch(format.Joker.split(',').map(x=> helperString.cleanup(x)), cardIdNames);
        deck.DeckLength = 0;
        deck.MonsterLength = 0;
        deck.SpellLength = 0;
        deck.TrapLength = 0;
        deck.ExtraLength = 0;
        let jokerLength = 0;
        let x2Length = 0;
        let errorJokerQuantityx2 = [];
        deckCards.forEach(cardObj => {
            let quantity = cardObj.Quantity === '3' ? 3 
                : cardObj.Quantity === '2' ? 2 
                : 1;
            
            if(quantity === 2)
                x2Length++;

            if(matchs.includes(cardObj.Card.IdName))
            {
                jokerLength += quantity;
                if(quantity !== 1)
                    errorJokerQuantityx2.push(cardObj.Card.NameEn);
            }
            
            if(!cardObj.Card.ToExtraDeck){
                deck.DeckLength+= quantity;
                if(cardObj.Card.Type === 'Monster') deck.MonsterLength+= quantity;
                else if(cardObj.Card.Type === 'Spell') deck.SpellLength+= quantity;
                else if(cardObj.Card.Type === 'Trap') deck.TrapLength+= quantity;
            }
            else
                deck.ExtraLength+=quantity;
        });

        if(jokerLength > 3)
            errors.push('Il y a trop de jokers : ' + jokerLength);

        if(x2Length > 3)
            errors.push('Il y a trop de doublons : ' + x2Length);

        if(errorJokerQuantityx2.length > 0)
            errors.push('Les cartes jokers sont limitées à un seul exemplaire. Cartes a corriger :' + errorJokerQuantityx2.join(', '));
        
        format.Limit1Groups.split('|').forEach(group => {
            let groupCards = group.split(',').map(x=> helperString.cleanup(x));
            matchs = helperArray.getMatch(groupCards, cardIdNames);
            if(matchs.length > 1)
                errors.push('Ce groupe de limitation n est pas respecté : ' + group);
        })

        if(deck.DeckLength < 40)
            errors.push('Pas assez de cartes : ' + deck.DeckLength);

        return errors.length < 1 ? null : errors.join('. ');
    }

    static getCards(deckList, cards){
        let result = [];
        let deckListName = deckList.split(',');
        for(let cardIndex =0 ; cardIndex< deckListName.length; cardIndex++)
        {
            const cardNameEn = deckListName[cardIndex];
            let quantity = helperString.includesX3(cardNameEn) ? '3' 
                : helperString.includesX2(cardNameEn) ? '2' : '1';
            let cardIdName = helperString.removeX3(
                             helperString.removeX2(
                             helperString.cleanup(cardNameEn)));
            const card = cards.find(x=> x.IdName === cardIdName);
            if(card)
                result.push({Order:cardIndex, Quantity: quantity, Card: card});
        }

        return result;
    }
}


export default ServiceDeck;
