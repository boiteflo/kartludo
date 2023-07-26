class ServiceMain {
    static filterCard(cards, value, limit=50) {
        return !value || value.length < 3 
        ? []
        : cards.filter(x=> !(x.Bonus && x.Limit==='0') 
            && (
                x.IdName.includes(value.toLowerCase())
                || x.NameEn.toLowerCase().includes(value.toLowerCase())
                || x.NameFr.toLowerCase().includes(value.toLowerCase())
                || x.IdNameFr.toLowerCase().includes(value.toLowerCase())
            )
        ).slice(0, limit);
    }    
}


export default ServiceMain;
