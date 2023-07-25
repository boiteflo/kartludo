import helperString from '../helpers/helperString';

class ServiceFormat {
    static setFormat(format, cards){
        if(!format) return;

        cards.forEach(x=> {x.Limit = ''; x.LimitFriends = ''; delete x.OrderIndex });
    
        format.Limit0Cards = !format.Limit0 || format.Limit0.length <2? [] : format.Limit0.split(',').map(x=> helperString.cleanup(x));
        format.Limit1Cards = !format.Limit1 || format.Limit1.length <2 ? [] : format.Limit1.split(',').map(x=> helperString.cleanup(x));
        format.JokerCards = !format.Joker || format.Joker.length <2 ? [] : format.Joker.split(',').map(x=> helperString.cleanup(x));
        format.BonusCards = !format.Bonus || format.Bonus.length <2 ? [] : format.Bonus.split(',').map(x=> helperString.cleanup(x));

        this.handleCardsLimit(format.Limit0Cards, cards, '0');
        this.handleCardsLimit(format.Limit1Cards, cards, '1');
        this.handleCardsLimit(format.JokerCards, cards, 'K');
        
        let limit1Groups = format.Limit1Groups.split('|');
        let limit1GroupsCards = format.Limit1Groups.split('|').join(',').split(',').map(x=> helperString.cleanup(x));
        for(let i=0; i< limit1GroupsCards.length; i++)
        {
          let idName = limit1GroupsCards[0];
          let card = cards.find(x=> x.IdName === idName);
          if(card) {
            card.LimitFriends = limit1Groups.find(x=> x.includes(x.IdName));
            card.OrderIndex = i;
          }
        }
    
        cards
          .filter(x=> x.Bonus && !format.BonusCards.includes(x.IdName))
          .forEach(x=> x.Limit='0');
    
        return {cards: cards, format: format};
      } 
      
    static handleCardsLimit(cardIds, cards, limit){
      for(let i=0; i< cardIds.length; i++)
      {
        let idName = cardIds[i];
        let card = cards.find(x=> x.IdName === idName);
        if(card) {
          card.Limit = limit;
          card.OrderIndex = i;
        }
      }
  } 
}


export default ServiceFormat;


