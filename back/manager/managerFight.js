const helperGoogleApi = require("../helper/helperGoogleApi");
const serviceFight = require("./serviceFight");
let spreedSheetId= '1tRkMQB_w_rb0mubb-7PEWsepUfCGroLjHZDO_KewBd4';

class managerFight {

    static fights;

    static async getFights(){
        const { sheets } = await helperGoogleApi.authSheets();
        let requestsPages = ['Fight!C2:D'];  
        const sheetData = await helperGoogleApi.getSheetMultipleContent(sheets,spreedSheetId, requestsPages);
        
        this.fights = sheetData.Fight.map((x,i)=> {
            return {
                id:i, creatures: JSON.parse(x[0]), history: x[1]
            };
        });
        return this.fights;
    }

    static keepLast(str, length){
        return str.length <= length ? str : str.slice(-1 * length);
    }

    static async executeCommand(command){ 
        let errorMessage = "";
        const fight = this.fights[command.id];
        const result = serviceFight.handleAllCommand(command.commands, fight.creatures);
        fight.creatures = serviceFight.creatures;
        fight.history+= "\n" + new Date().toLocaleString() + " - " + result;

        let updateSheet = [];     
        const sheetLine = command.id+2;   
        updateSheet.push({range: 'Fight!A' + sheetLine, value:errorMessage ?? ''});
        updateSheet.push({range: 'Fight!C' + sheetLine, value:JSON.stringify(fight.creatures)});
        updateSheet.push({range: 'Fight!D' + sheetLine, value:this.keepLast(fight.history, 99999)});
        
        const { sheets } = await helperGoogleApi.authSheets();
        helperGoogleApi.updateSheetMultiple(sheets, spreedSheetId, updateSheet);
        return fight;
    }
}
 
module.exports = managerFight;
