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

    static domaines = "ArcaneGardienRuni.png,ArcaneLibererLeChaos.png,ArcaneMarcheSurLesMurs.png,CodexLivreDava.png,CodexLivreDeTyfar.png,CodexLivreDIlliat.png,GraceEnchantement.png,GraceParolesInspirantes.png,GraceTrompeurHabile.png,LamePasAssezBon.png,LameRepresailles.png,LameTourbillon.png,ManoeuvreIntouchable.png,ManoeuvreJeLanticipe.png,ManoeuvreManoeuvreAdroites.png,NuitDeguisementInhabituel.png,NuitPriseEtExtraction.png,NuitPluieDeLames.png,SageEnchevetrementSauvage.png,SageLangueDeLaNature.png,SagePisteurDoue.png,SplendeurEclairDeLumiere.png,SplendeurReassurance.png,SplendeurToucherReparateur.png,ValeurJeSuisVotreBouclier.png,ValeurNueDecouverte.png,ValeurPousseeViolente.png"
        .split(',');

    static others = "template/CardAncestry.png,template/CardCommunity.png,template/CardClass.png,template/CardSousClass.png,template/CardDomain.png,other/cost.webp,ancestry/clank.jpg,ancestry/drakona.jpg,ancestry/dwarf.jpg,ancestry/elf.jpg,ancestry/faerie.jpg,ancestry/faun.jpg,ancestry/firbolg.jpg,ancestry/fungril.jpg,ancestry/galapa.jpg,ancestry/giant.jpg,ancestry/goblin.jpg,ancestry/halfling.jpg,ancestry/human.jpg,ancestry/inferis.jpg,ancestry/katari.jpg,ancestry/orc.jpg,ancestry/ribbet.jpg,ancestry/simiah.jpg,community/highborne.jpg,community/loreborne.jpg,community/orderborne.jpg,community/ridgeborne.jpg,community/seaborne.jpg,community/slyborne.jpg,community/underborne.jpg,community/wanderborne.jpg,community/wildborne.jpg,class/bard.jpg,class/druid.jpg,class/guardian.jpg,class/ranger.jpg,class/rogue.jpg,class/seraph.jpg,class/sorcerer.jpg,class/warrior.jpg,class/wizard.jpg,class/bard-banner.webp,class/druid-banner.webp,class/guardian-banner.webp,class/ranger-banner.webp,class/rogue-banner.webp,class/seraph-banner.webp,class/sorcerer-banner.webp,class/warrior-banner.webp,class/wizard-banner.webp,domain/banner-arcana.webp,domain/banner-blade.webp,domain/banner-bone.webp,domain/banner-codex.webp,domain/banner-grace.webp,domain/banner-midnight.webp,domain/banner-sage.webp,domain/banner-splendor.webp,domain/banner-valor.webp,domain/banner-empty.png,domain/logo-arcana.webp,domain/logo-blade.webp,domain/logo-bone.webp,domain/logo-codex.webp,domain/logo-grace.webp,domain/logo-midnight.webp,domain/logo-sage.webp,domain/logo-splendor.webp,domain/logo-valor.webp,domain/arcana.jpg,domain/blade.jpg,domain/bone.jpg,domain/codex.jpg,domain/grace.jpg,domain/midnight.jpg,domain/sage.jpg,domain/splendor.jpg,domain/valor.jpg"
        .split(',');

    static templates = [
        {
            name: "Ancestry",
            template: "Template Ancestry\ntext font-weight:bold font-size:30px top:190px left:40px text-transform:uppercase\ntext color:black font-size:11px top:235px left:15px right:15px\nimage top:2px left:2px right:2px background-position:'0px -5px'",
            texts: ["Elf", "<p><i>Les Elfes sont généralement des humanoïdes grands avec des oreilles pointues et des sens extrêmement aiguisés.</i></p><p><strong>Transe spirituelle :</strong> Pendant un repos, vous pouvez entrer en transe et effectuer une action supplémentaire de temps d'arrêt.</p><p><strong>Réactions Rapides :</strong> Vous pouvez marquer un Stress pour bénéficier d'un avantage sur un Jet de Réaction.</p>"],
            images: [require('@/assets/Daggerheart/template/CardAncestry.png'), require('@/assets/Daggerheart/ancestry/elf.jpg')]
        },
        {
            name: "Community",
            template: "Template Community\ntext font-weight:bold font-size:20px top:245px left:40px text-transform:uppercase\ntext color:black font-size:12px top:275px left:15px right:15px\nimage top:2px left:2px right:2px background-position:'0px -5px'",
            texts: ["Communauté côtière", "<p><i>Faire partie d'une communauté côtière signifie que vous avez vécu sur ou près d'une grande étendue d'eau.</i></p><p><strong>Connaissance de la Marée</strong> : Vous pouvez sentir le flux et le reflux de la vie. Lorsque vous lancez un jet avec la Peur, placez un jeton sur cette carte. Vous pouvez conserver un nombre de jetons égal à votre Niveau. Avant de faire un jet d'action, vous pouvez dépenser un ou plusieurs de ces jetons pour les ajouter comme modificateurs de +1 à votre jet. A la fin d'une session, défaussez tous les jetons non utilisés.</p>"],
            images: [require('@/assets/Daggerheart/template/CardCommunity.png'), require('@/assets/Daggerheart/community/seaborne.jpg')]
        },
        {
            name: "Class",
            template: "Template Class\ntext font-weight:bold font-size:14px top:172px left:120px right:120px text-align:center color:white text-transform:uppercase\ntext color:black font-size:10px top:198px left:15px right:15px\ntext top:455px font-size:10px text-align:center left:15px right:15px\nimage top:2px left:2px right:2px background-position:'0px -20px'\nimage top:0px left:20px width:70px height:118px",
            texts: ["Magicien", "<p><strong>Prestidigitation :</strong> Vous pouvez effectuer des effets magiques subtils et inoffensifs à volonté. Par exemple, vous pouvez changer la couleur d'un objet, créer une odeur, allumer une bougie, faire flotter un petit objet, éclairer une pièce ou réparer un petit objet.</p><p><strong>Schémas étranges :</strong> Choisissez un nombre entre 1 et 12. Chaque fois que vous obtenez ce nombre sur un dé de Dualité, gagnez un Espoir ou éliminez un Stress. Vous pouvez changer ce nombre lorsque vous terminez un long repos.</p><p><strong>Espoir de magicien :</strong> Dépensez trois points d'Espoir au lieu de marquer votre dernier point de vie.</p>", "<p><b>Évasion : </b> 10, <b>Seuil de dégâts : </b> Majeur 5 / Sévère 10</p>"],
            images: [require('@/assets/Daggerheart/template/CardClass.png'), require('@/assets/Daggerheart/class/wizard.jpg'), require('@/assets/Daggerheart/class/wizard-banner.webp')]
        },
        {
            name: "SousClasse",
            template: "Template SousClass\ntext font-weight:bold font-size:14px top:200px left:120px right:120px text-align:center color:white text-transform:uppercase\ntext font-weight:bold font-size:20px top:220px left:15px right:15px text-transform:uppercase text-align:center\ntext color:black font-size:10px top:250px left:15px right:15px\ntext bottom:5px font-size:11px text-align:center left:15px right:15px font-weight:bold\nimage top:2px left:2px right:2px background-position:'0px -20px'\nimage top:0px left:20px width:70px height:118px",
            texts: ["Druide", "Gardien des éléments", "<p style='text-align:center; margin-bottom:0px;'><strong style='text-align:center'>JET DE SORTS : </strong>INSTINCT</p><p><strong>Incarnation élémentaire : </strong>Marquez un Stress pour incarner un esprit élémentaire de la liste ci-dessous. L'incarnation dure jusqu'à ce que vous subissiez des dégâts Sévères ou jusqu'à votre prochain repos court. Cette capacité peut coexister avec la forme bestiale.</p><ol><li data-list='bullet'><span class='ql-ui' contenteditable='false'></span><strong>Feu : </strong>Lorsqu'un ennemi en mêlée vous inflige des dégâts, il subit 1d10 de dégâts magiques. </li><li data-list='bullet'><span class='ql-ui' contenteditable='false'></span><strong>Terre :</strong> Vous gagnez +1 à votre Protection. </li><li data-list='bullet'><span class='ql-ui' contenteditable='false'></span><strong>Eau : </strong>Lorsque vous infligez des dégâts à un ennemi en mêlée, tous les autres ennemis dans une portée Très Proche marquent un Stress. </li><li data-list='bullet'><span class='ql-ui' contenteditable='false'></span><strong>Air : </strong>Vous pouvez flotter, ce qui vous donne l'avantage sur les jets d'Agilité.</li></ol>", "Fondation"],
            images: [require('@/assets/Daggerheart/template/CardSousClass.png'), require('@/assets/Daggerheart/class/druid.jpg'), require('@/assets/Daggerheart/class/druid-banner.webp')]
        },
        {
            name: "Domain",
            template: "Template Domain\ntext font-weight:bold font-size:14px top:228px left:120px right:120px text-align:center color:white text-transform:uppercase\ntext font-weight:bold font-size:20px top:250px text-align:center  text-transform:uppercase right:20px left:20px\ntext color:black font-size:30px top:15px color:white left:45px font-weight:bold\ntext font-weight:bold font-size:18px top:23px right:36px color:white\ntext font-size:11px top:275px left:15px right:15px\ntext top:455px font-size:10px text-align:right right:15px\nimage top:2px left:2px right:2px background-position:'0px -10px'\nimage top:2px left:20px width:70px height:118px\nimage top:20px right:20px width:35px height:35px",
            texts: ["Habilité", "Riposte", "1", "2", "<p>Lorsque vous subissez des dégâts d'une créature en mêlée, vous pouvez marquer un Stress pour infliger immédiatement des dégâts d'arme à la créature à moitié de votre Maîtrise (arrondi à l'unité supérieure).</p>", "<b>Domaines : </b> Lame"],
            images: [require('@/assets/Daggerheart/template/CardDomain.png'), require('@/assets/Daggerheart/domain/blade.jpg'), require('@/assets/Daggerheart/domain/banner-blade.webp'), require('@/assets/Daggerheart/other/cost.webp')]
        }
    ];

    static async getAllClass() {
        return await ServiceBack.get('daggerheart', 'class');
    }

    static async get(data) {
        return await ServiceBack.get('daggerheart', data);
    }

    static getArmors() {
        return [
            { id: "gambeson", name: "Armure Gambeson", armor: "3", feature: "<p><b>Flexible :</b> +1 d'Evasion</p>", image: "armors/gambeson.png" },
            { id: "leather", name: "Armure de Cuir", armor: "4", feature: "", image: "armors/leather.png" },
            { id: "chainmail", name: "Cottes de Mailles", armor: "5", feature: "<p><b>Lourde :</b> -1 d'Evasion</p>", image: "armors/chainmail.png" },
            { id: "fullplate", name: "Armure de Plaque", armor: "6", feature: "<p><b>Trés Lourde :</b> -2 d'Evasion et -1 d'Agilité</p>", image: "armors/fullPlate.png" }
        ];
    }

    static getWeapons() {
        return weapons;
    }

    static async loadCards() {
        let result = {};
        result.Class = await ServiceBack.get('daggerheart', 'class');
        result.Ancestry = await ServiceBack.get('daggerheart', 'ancestry');
        result.Community = await ServiceBack.get('daggerheart', 'communaute');
        result.Domain = await ServiceBack.get('daggerheart', 'domains');
        result.Domain = result.Domain.sort((a, b) => a.domaine - b.domaine);
        return result;
    }

    static completeClass(classobj, result) {
        if (classobj.type2 != "Class")
            return;

        classobj.SousClass = result.filter(y => y.type?.includes(classobj.name));
        const str = classobj.flavor.substring(classobj.flavor.indexOf("Esquive ("));
        const numbers = this.getAllStringBetween(str, '(', ')');
        classobj.evasion = numbers[0];
        classobj.seuilMajeur = numbers[1];
        classobj.seuilSevere = numbers[2];
        classobj.domains = classobj.flavor.substring(18, classobj.flavor.indexOf("Traits") - 17);
    }

    static getAllStringBetween(string, begin, end) {
        let result = [];
        let str = string;
        while (str.indexOf(begin) > 0) {
            str = str.substring(str.indexOf(begin));
            result.push(str.substring(1, str.indexOf(end)));
            str = str.substring(str.indexOf(end) + 1);
        }
        return result;
    }
}


export default ServiceDaggerheart;
