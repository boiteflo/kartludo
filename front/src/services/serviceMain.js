class ServiceMain {
    static filterCard(cards, format, filter) {
        if(filter == null)
            return [];

        let result = cards.filter(x=> !(x.Bonus && x.Limit==='0'));

        let search = filter.search.toLowerCase();        
        if(search && search.length > 1)
            result = result.filter(x=> x.IdName.includes(search)
                || x.NameEn.toLowerCase().includes(search)
                || x.NameFr.toLowerCase().includes(search)
                || x.IdNameFr.toLowerCase().includes(search)
            );

        if(filter.type && filter.type.length>0) {
            result = result.filter(x=> x.Type && x.Type.includes(filter.type));
        }

        if(filter.magicTrapType && filter.magicTrapType.length>0) {
            result = result.filter(x=> x.Race && x.Race.includes(filter.magicTrapType));
        }

        if(filter.monsterType && filter.monsterType.length>0) {
            result = result.filter(x=> x.TypeMonster && x.TypeMonster.includes(filter.monsterType));
        }

        if(filter.attribute && filter.attribute.length>0) {
            result = result.filter(x=> x.Attribute && x.Attribute.includes(filter.attribute));
        }

        if(filter.race && filter.race.length>0) {            
            result = result.filter(x=> x.Race && x.Race === filter.race);
        }

        if(filter.limitation && filter.limitation.length>0){
            const limitArrayProperty = filter.limitation === '0' ? 'Limit0Cards' : filter.limitation === '1' ? 'Limit1Cards' : 'JokerCards';
            const limitArray = format[limitArrayProperty].filter(x=> x);
            result = result.filter(x=> limitArray.includes(x.IdName));
        }
        
        filter.length = result.length;
        
        return result;
    }    
}


export default ServiceMain;
