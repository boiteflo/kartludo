class managerTemp {

    static async handleJson(){        
        const helperJsonFile = require("./helper/helperJsonFile");
        const file = "communaute";
        helperJsonFile.readPath('./back/data/daggerheart/' + file + '.old.json').then(items=> {
            const result = items.items.map(x=> {return {
                name:x.name,        
                description:x.system.props.description,
                /*
                niveau:x.system.props.niveau,
                rappel:x.system.props.rappel,
                active:x.system.props.active,
                description:x.system.props.description,
                flavor:x.system.props.flavor,
                type:x.system.props.type,
                cout:x.system.props.cout,
                domaine:x.system.props.domaine,
                protection:x.system.props.protection,
                active:x.system.props.active,
                capacites:x.system.props.capacites,
                flavor:x.system.props.flavor,
                type:x.system.props.type,
                typedegats:x.system.props.typedegats,
                bonusatt:x.system.props.bonusatt,
                portee:x.system.props.portee,
                mains:x.system.props.mains,
                niveau:x.system.props.niveau,
                active:x.system.props.active,
                primaire:x.system.props.primairesecondaire == "primaire",
                trait:x.system.props.trait,
                valeur:x.system.props.valeur,
                bonus:x.system.props.bonus,
                capacites: x.system.props.capacites*/
            };});
            helperJsonFile.save('./back/data/daggerheart/' + file, result);
        });
    }
}
 
module.exports = managerTemp;