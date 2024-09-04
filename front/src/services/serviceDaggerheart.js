import ServiceBack from './serviceBack';
import weapons from '../data/daggerheartWeapons.json';

class ServiceDaggerheart {
    
    static ascendences = "clank,croa,drakona,elfe,faune,firbolg,fungil,fée,galapa,geant,gobelin,halfelin,humain,infernis,katari,nain,orc,simia"
        .split(',');

    static communautes = "basFonds,cotiere,erudit,montagnarde,noble,nomade,ordre,sauvage,souterraine"
        .split(',');
    
    static classesNames = "barde,druide,gardien,guerrier,magicien,rodeur,roublard,seraphin,sorcier".split(",");
    
    static sousClasses = "BardeBeauParleur,BardeTroubadour,DruideGardienDesElements,DruideGardienDuRenouveau,GardienFidele,GardienVengeur,GuerrierBraveParmiLesBraves,GuerrierTueurDeMonstres,MagicienEcoleDeLaConnaissance,MagicienEcoleDeLaGuerre,RodeurMaitreDesBetes,RodeurPisteur,RoublardMarcheurDesOmbres,RoublardSyndicat,SeraphinPorteurDeFoi,SeraphinSentinelleAilee,SorcierOrigineElementaire,SorcierOriginePrimordiale"
        .split(',');

    static domaines = "ArcaneLibererLeChaos,ArcaneMarcheSurLesMurs,ArcaneRuneDeProtection,CodexLivreDAva,CodexLivreDIlliat,CodexLivreDTyfar,GraceDiscoursInspirant,GraceEnvoutement,GraceMenteurHabile,LamePerfectionniste,LameRiposte,LameTourbillon,ManoeuvreEvasion,ManoeuvreJeLeVoisVenir,ManoeuvreMouvementsHabiles,NuitDeguisementIncroyable,NuitPluieDeLames,NuitTireLaine,SagesseEnchevetrementSournois,SagesseLanguageDeLaNature,SagesseTraqueurExpert,SplendeurContactAppaisant,SplendeurLumiereFoudroyante,SplendeurSoutien,ValeurANu,ValeurJeSuisVotreBouclier,ValeurPoussePuissante"
        .split(',');

    static others = "template/CardAncestry.png,template/CardCommunity.png,template/CardClass.png,template/CardSousClass.png,template/CardDomain.png,other/cost.webp,ancestry/clank.jpg,ancestry/drakona.jpg,ancestry/dwarf.jpg,ancestry/elf.jpg,ancestry/faerie.jpg,ancestry/faun.jpg,ancestry/firbolg.jpg,ancestry/fungril.jpg,ancestry/galapa.jpg,ancestry/giant.jpg,ancestry/goblin.jpg,ancestry/halfling.jpg,ancestry/human.jpg,ancestry/inferis.jpg,ancestry/katari.jpg,ancestry/orc.jpg,ancestry/ribbet.jpg,ancestry/simiah.jpg,community/highborne.jpg,community/loreborne.jpg,community/orderborne.jpg,community/ridgeborne.jpg,community/seaborne.jpg,community/slyborne.jpg,community/underborne.jpg,community/wanderborne.jpg,community/wildborne.jpg,class/bard.jpg,class/druid.jpg,class/guardian.jpg,class/ranger.jpg,class/rogue.jpg,class/seraph.jpg,class/sorcerer.jpg,class/warrior.jpg,class/wizard.jpg,class/bard-banner.webp,class/druid-banner.webp,class/guardian-banner.webp,class/ranger-banner.webp,class/rogue-banner.webp,class/seraph-banner.webp,class/sorcerer-banner.webp,class/warrior-banner.webp,class/wizard-banner.webp,domain/banner-arcana.webp,domain/banner-blade.webp,domain/banner-bone.webp,domain/banner-codex.webp,domain/banner-grace.webp,domain/banner-midnight.webp,domain/banner-sage.webp,domain/banner-splendor.webp,domain/banner-valor.webp,domain/banner-empty.png,domain/logo-arcana.webp,domain/logo-blade.webp,domain/logo-bone.webp,domain/logo-codex.webp,domain/logo-grace.webp,domain/logo-midnight.webp,domain/logo-sage.webp,domain/logo-splendor.webp,domain/logo-valor.webp,domain/arcana.jpg,domain/blade.jpg,domain/bone.jpg,domain/codex.jpg,domain/grace.jpg,domain/midnight.jpg,domain/sage.jpg,domain/splendor.jpg,domain/valor.jpg"
        .split(',');

    static async getAllClass(){
        return await ServiceBack.get('daggerheart', 'class');
    }

    static getArmors(){
        return [
            {id:"gambeson", name:"Armure Gambeson", armor:"3", feature:"<p><b>Flexible :</b> +1 d'Evasion</p>", image:"armors/gambeson.png"},
            {id:"leather", name:"Armure de Cuir", armor:"4", feature:"", image:"armors/leather.png"},
            {id:"chainmail", name:"Cottes de Mailles", armor:"5", feature:"<p><b>Lourde :</b> -1 d'Evasion</p>", image:"armors/chainmail.png"},
            {id:"fullplate", name:"Armure de Plaque", armor:"6", feature:"<p><b>Trés Lourde :</b> -2 d'Evasion et -1 d'Agilité</p>", image:"armors/fullPlate.png"}
        ];
    }

    static getWeapons(){
        return weapons;
    }

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
