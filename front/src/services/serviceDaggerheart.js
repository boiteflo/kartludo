import ServiceBack from './serviceBack';

class ServiceDaggerheart {
    static async loadCards() {
        let result = {};
        result.Class = await ServiceBack.get('daggerheart', 'class');
        result.Ancestry = await ServiceBack.get('daggerheart', 'ancestry');
        result.Community = await ServiceBack.get('daggerheart', 'communaute');
        result.Domain = await ServiceBack.get('daggerheart', 'domains');
        result.Domain = result.Domain.sort((a,b) => a.domaine - b.domaine);
        return result;
    }

    static completeClass(classobj, result){
        if(classobj.type2 != "Class") 
            return;
        
        classobj.SousClass = result.filter(y=> y.type?.includes(classobj.name));
        const str = classobj.flavor.substring(classobj.flavor.indexOf("Esquive ("));
        const numbers= this.getAllStringBetween(str, '(', ')');
        classobj.evasion = numbers[0];
        classobj.seuilMajeur = numbers[1];
        classobj.seuilSevere = numbers[2];
        classobj.domains = classobj.flavor.substring(18, classobj.flavor.indexOf("Traits")-17);
    }

    static getAllStringBetween(string, begin, end){
        let result = [];
        let str = string;
        while(str.indexOf(begin) > 0){
            str = str.substring(str.indexOf(begin));
            result.push(str.substring(1, str.indexOf(end)));
            str = str.substring(str.indexOf(end)+1);
        }
        return result;
    }
}


export default ServiceDaggerheart;
