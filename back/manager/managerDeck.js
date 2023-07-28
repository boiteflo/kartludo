const helperGoogleApi = require("../helper/helperGoogleApi");
const helperJsonFile = require("../helper/helperJsonFile");
const helperArray = require("../helper/helperArray");
const cardsNotFound = `Les cartes suivantes n'ont pas été trouvées : `;
let spreedSheetId= '1tRkMQB_w_rb0mubb-7PEWsepUfCGroLjHZDO_KewBd4';

class managerDeck {

    static async read(){
        return await helperJsonFile.readPath('./back/data/decks.json');
    }

    static async save(decks){
        helperJsonFile.save('./back/data/decks', decks);
    }

    static async getAll(res){     
        let result =await this.read();
        result = result.filter(x=> !x.IdTournament);   
        res.send(result);
    }

    static async get(id, res){        
        let data = await this.read();
        res.send(data.find(x=> x.Id === id));    
    }

    static async insertOrUpdate(deck, res){
        if(!deck.Id) this.insert(deck, res);
        else this.update(deck, res);
    }

    static async insert(deck, res){        
        let cards = await helperJsonFile.read('./back/data/cards');
        let cardsIdName = cards.map(x=> x.IdName);
      
        let missingCards = deck.DeckListCards.filter(x=> !cardsIdName.includes(x.Card.IdName)).map(x=> x.Card.NameEn);
        let errorMessage = missingCards.length < 1 ? '' : `Les cartes suivantes n'ont pas été trouvées :` + missingCards.join(",");
        
        let deckCards = this.sort(deck.DeckListCards);
        let deckList = deckCards
            .filter(x=> cardsIdName.includes(x.Card.IdName))
            .map(x=> x.Card.NameEn + (x.Quantity === '2' ? ' x2' : ''))
            .join(', ');

        let mainCardImage = cards.find(x=> x.IdName === deck.MainCard?.cleanup())?.ImageMDM;
        
        deck = {
            Id: "".guid(),
            Format: deck.Format,
			Rank: deck.Rank ? deck.Rank.Id : 3,
			Title: deck.Title,
            IsDraft: true,
			Date: new Date().toLocaleDateString("fr"),
			Author: deck.Author,
			MainCard: deck.MainCard,
			MainCardImage: mainCardImage,
			Themes: deck.ThemesId ? deck.ThemesId.join(',') : deck.Themes ?? 'autre',
			DeckList: deckList,
			DeckLength: deck.DeckLength,
			Errors: deck.Errors,
            IdTournament : deck.IdTournament
        };

        this.saveDeck(deck, errorMessage);

        let decks = await this.read();
        decks.push(deck);
        this.save(decks);
      
        res.status(201).send(deck.Id);
    }

    static async update(deck, res){        
        let cards = await helperJsonFile.read('./back/data/cards');
        let cardsIdName = cards.map(x=> x.IdName);
      
        let missingCards = deck.DeckListCards.filter(x=> !cardsIdName.includes(x.Card.IdName)).map(x=> x.Card.NameEn);
        let errorMessage = missingCards.length < 1 ? '' : `Les cartes suivantes n'ont pas été trouvées :` + missingCards.join(",");
        
        let deckCards = this.sort(deck.DeckListCards);
        let deckList = deckCards
            .filter(x=> cardsIdName.includes(x.Card.IdName))
            .map(x=> x.Card.NameEn + (x.Quantity === '2' ? ' x2' : ''))
            .join(', ');

        let mainCardImage = cards.find(x=> x.IdName === deck.MainCard?.cleanup())?.ImageMDM;
        deck = {
            Id: deck.Id,
            Format: deck.Format,
			Rank: deck.Rank ? deck.Rank.Id : 3,
			Title: deck.Title,
            IsDraft: deck.IsDraft,
			Date: new Date().toLocaleDateString("fr"),
			Author: deck.Author,
			MainCard: deck.MainCard,
			MainCardImage: mainCardImage,
			Themes: deck.ThemesId ? deck.ThemesId.join(',') : '',
			DeckList: deckList,
			DeckLength: deck.DeckLength,
			Errors: deck.Errors,
            IdTournament : deck.IdTournament
        };

        this.saveDeck(deck, errorMessage, deck.Id);

        let decks = await this.read();
        decks = decks.filter(x=> x.Id !== deck.Id).concat([deck]);
        this.save(decks);
      
        res.status(201).send(deck.Id);
    }

    static async duplicate(deck, res){
        deck = {
            Id: "".guid(),
            Format: '',
			Rank: 3,
			Title: 'Copie de ' + deck.Title,
            IsDraft: true,
			Date: new Date().toLocaleDateString("fr"),
			Author: '',
			MainCard: deck.MainCard,
			MainCardImage: deck.MainCardImage,
			Themes: deck.Themes,
			DeckList: deck.DeckList,
			DeckLength: deck.DeckLength,
			Errors: deck.Errors,
            IdTournament : ''
        };

        this.saveDeck(deck, '');

        let decks = await this.read();
        decks.push(deck);
        this.save(decks);
      
        res.status(201).send(deck.Id);
    }

    static async saveDeck(deck, errorMessage, id){
        const helperGoogleApi = require("../helper/helperGoogleApi");
        const { sheets } = await helperGoogleApi.authSheets();
        let requestsPages = ['Decks!B2:I'];  
        const sheetData = await helperGoogleApi.getSheetMultipleContent(sheets,spreedSheetId, requestsPages);

        let sheetLine = sheetData.Decks ? sheetData.Decks.length+2 : 2;
        if(id){
            let row = sheetData.Decks
                .map((x, index)=> {return {"Id": x[0], "Index":index};})
                .find(x=> x.Id === id);
            if(!row) return;
            sheetLine = row.Index+2;
        }
        let updateSheet = [];
        deck.Themes = deck.Themes ?? '';
        if (typeof deck.Themes === 'object')
            deck.Themes= deck.Themes.join(', ');

        if(!deck.Rank)
        deck.Rank = '3';
        
        updateSheet.push({range: 'Decks!A' + sheetLine, value:errorMessage ?? ''});
        updateSheet.push({range: 'Decks!B' + sheetLine, value:deck.Id});
        updateSheet.push({range: 'Decks!C' + sheetLine, value:deck.Format});
        updateSheet.push({range: 'Decks!D' + sheetLine, value:deck.Rank});
        updateSheet.push({range: 'Decks!E' + sheetLine, value:deck.Title});
        updateSheet.push({range: 'Decks!F' + sheetLine, value:deck.IsDraft ?'1' : '0'});
        updateSheet.push({range: 'Decks!G' + sheetLine, value:deck.Date});
        updateSheet.push({range: 'Decks!H' + sheetLine, value:deck.Author});
        updateSheet.push({range: 'Decks!I' + sheetLine, value:deck.MainCard});
        updateSheet.push({range: 'Decks!J' + sheetLine, value:deck.Themes});
        updateSheet.push({range: 'Decks!K' + sheetLine, value:deck.DeckList});
        updateSheet.push({range: 'Decks!L' + sheetLine, value:deck.Errors ?? ''});
        updateSheet.push({range: 'Decks!M' + sheetLine, value:deck.IdTournament ?? ''});
        
        helperGoogleApi.updateSheetMultiple(sheets, spreedSheetId, updateSheet);
    }

    static getSheetRanges(){return ["Decks!B2:M"];}
    
    static refresh= (sheetData, cards, formats, sheets, spreedSheetId) => {
        let errors=[];
        let updateSheet = [];
        let decks = this.rebuildDecks(sheetData.Decks, errors, 'Decks', cards, formats, updateSheet);
        
        this.save(decks);
        helperGoogleApi.updateSheetMultiple(sheets, spreedSheetId, updateSheet);
        return errors;
    }

    static rebuildDecks(deckData, errors, page, cards, formats, updateSheet){
        if(!deckData)
            return [];

        let decks = deckData.map(x=> {
            return {
                "Id": x[0], 
                "Format":x[1], 
                "Rank": x[2], 
                "Title": x[3], 
                "IsDraft": x[4], 
                "Date": x[5], 
                "Author": x[6], 
                "MainCard": x[7], 
                "Themes": x[8], 
                "DeckList": x[9] , 
                "IdTournament": x[11] 
            };
        });

        for(let deckIndex =0 ; deckIndex< decks.length; deckIndex++)
        {
            let deck = decks[deckIndex];            
            let errorsCards = [];
            let sheetLine = deckIndex+2;
            deck.Rank = deck.Rank ?? 3;
            deck.IsDraft = deck.IsDraft === "1";

            if(!deck.Id || deck.Id.length < 8){
                deck.Id = "".guid();
                updateSheet.push({range: page + '!B' + sheetLine, value:deck.Id});
            }

            // MainCard
            deck.MainCardImage = cards.find(x=> x.IdName == deck.MainCard.cleanup())?.ImageMDM;
            if(!deck.MainCardImage)
                errorsCards.push(deck.MainCard);

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

            deckCards = this.sort(deckCards);
            deck.DeckList = deckCards
                .map(x=> x.Card.NameEn + (x.Quantity === '2' ? ' x2' : ''))
                .join(', ');
            
            deck.Errors = this.getErrors(deck, deckCards, formats);
            if(deck.Errors && deck.Errors.length > 0)
                deck.IsDraft=true;
            updateSheet.push({range: page + '!L' + sheetLine, value:deck.Errors ?? ''});
                
            let errorMessage = '';
            if(errorsCards.length > 0){
                if(errorsCards.length > 0)
                    errorMessage = cardsNotFound + errorsCards.join(', ');
                errors.push({Index: deckIndex, From:page, Errors: deck.Title + ' ' + errorMessage });
            }
            
            updateSheet.push({range: page + '!A' + sheetLine, value:errorMessage});
        } 

        return decks;
    }

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

    static getErrors(deck, deckCards, formats){
        let errors = [];
        let matchs= [];
        let deckCardsMatchs = [];
        let cardIdNames = deckCards.map(x=> x.Card.IdName);
        let format = deck.Format ? formats.find(x=>x.Id === deck.Format) : null;
        if(!format) format = formats[formats.length-2];

        if(format.Limit0 && format.Limit0.length > 0){
            matchs = helperArray.getMatch(format.Limit0.split(',').map(x=> x.cleanup()), cardIdNames);
            deckCardsMatchs = deckCards.filter(x=> matchs.includes(x.Card.IdName));
            if(deckCardsMatchs.length > 0)
                errors.push('Il y a des carte interdites : ' + deckCardsMatchs.map(x=> x.Card.NameEn).join(', '));
        }
        
        if(format.Limit1 && format.Limit1.length > 0){
            matchs = helperArray.getMatch(format.Limit1.split(',').map(x=> x.cleanup()), cardIdNames);
            deckCardsMatchs = deckCards.filter(x=> matchs.includes(x.Card.IdName) && x.Quantity === '2');
            if(deckCardsMatchs.length > 0)
                errors.push('Il y a des carte limitées en doublon : ' + deckCardsMatchs.map(x=> x.Card.NameEn).join(', '));
        }

        matchs= [];
        if(format.Joker && format.Joker.length > 0){
            matchs = helperArray.getMatch(format.Joker.split(',').map(x=> x.cleanup()), cardIdNames);
        }
        deck.DeckLength = 0;
        let jokerLength = 0;
        let x2Length = 0;
        let errorJokerQuantityx2 = [];
        deckCards.forEach(cardObj => {
            let quantity = cardObj.Quantity === '2' ? 2 : 1;
            
            if(cardObj.Quantity === '2')
                x2Length++;

            if(matchs.includes(cardObj.Card.IdName))
            {
                jokerLength += quantity;
                if(cardObj.Quantity === '2')
                    errorJokerQuantityx2.push(cardObj.Card.NameEn);
            }
            
            if(!cardObj.Card.ToExtraDeck)
                deck.DeckLength+= quantity;
        });

        if(jokerLength > 3)
            errors.push('Il y a trop de jokers : ' + jokerLength);

        if(x2Length > 3)
            errors.push('Il y a trop de doublons : ' + x2Length);

        if(errorJokerQuantityx2.length > 0)
            errors.push('Les cartes jokers sont limitées à un seul exemplaire. Cartes a corriger :' + errorJokerQuantityx2.join(', '));
        
        if(format.Limit1Groups && format.Limit1Groups.length > 0){
            format.Limit1Groups.split('|').forEach(group => {
                let groupCards = group.split(',').map(x=> x.cleanup());
                matchs = helperArray.getMatch(groupCards, cardIdNames);
                if(matchs.length > 2)
                    errors.push('Ce groupe de limitation n est pas respecté : ' + group);
            })
        }

        if(deck.DeckLength < 40)
            errors.push('Pas assez de cartes : ' + deck.DeckLength);

        return errors.length < 1 ? null : errors.join('. ');
    }
}
 
module.exports = managerDeck;
