let spreedSheetId = '1tRkMQB_w_rb0mubb-7PEWsepUfCGroLjHZDO_KewBd4';

class managerDemoSheet {
    static data = [];
    static delay=1000;
    static refreskKeyWord = "Actualisé le ";

    static async getDataMultipleTimes() {
        this.data = await this.refreshDemoSheet();
        if(this.delay >= 900)
            setTimeout(() => this.refreshDemoSheetLoop(), 3 * 1000);
        this.delay = 3;
        return 'Actualisation du fichier demo en cours';
    }

    static async refreshDemoSheetLoop() {
        const newData = await this.refreshDemoSheet();
        const haveDifferences = this.haveDifferences(this.data, newData);
        this.delay = haveDifferences ? 5 : this.delay * 2;
        this.data = newData;

        console.log(`haveDifferences=${JSON.stringify(haveDifferences)}, delay=${this.delay}`);

        if (this.delay < 900) // 900 seconds = 15 minutes
            setTimeout(() => this.refreshDemoSheetLoop(), this.delay * 1000);

        return newData;
    }

    static async refreshDemoSheet() {
        const helperGoogleApi = require("../helper/helperGoogleApi");
        const { sheets } = await helperGoogleApi.authSheets();
        let requestsPages = ['Demo!A:F'];
        const sheetData = await helperGoogleApi.getSheetMultipleContent(sheets, spreedSheetId, requestsPages);
        const settingLine = sheetData.Demo.splice(1, 1);
        const data = this.checkHoliday(sheetData);

        let updateSheet = [];
        data.forEach(obj => {
            const value = obj.errors ? 'errors: ' + obj.errors
                : !obj.congesConflict ? 'ok'
                    : `warnings: conges en conflit avec : ${obj.congesConflict.join(', ')}`;
            updateSheet.push({ range: 'Demo!A' + (obj.index + 3), value });
        });

        updateSheet.push({ range: 'Demo!A2', value: this.refreskKeyWord + this.formatDateFr(new Date()) });
        helperGoogleApi.updateSheetMultiple(sheets, spreedSheetId, updateSheet);

        return data;
    }

    static checkHoliday(sheetData) {
        const data = this.arrayToObject(sheetData.Demo);
        const agences = this.getUniqueAgencies(data).map(id => { return { id, conges: [] }; });

        data.forEach(obj => {
            obj.name = `${obj.nom} ${obj.prenom}`;
            obj.congesPeriods = this.formatPeriod(obj.index, obj.conges);
        });

        data.forEach(obj => {
            if (!obj.congesPeriods || obj.congesPeriods.length < 1) {
                obj.errors = 'Pas de congès';
                return;
            }

            obj.agences.split(',').forEach(agenceId => {
                const agence = agences.find(x => x.id === agenceId.trim().toLowerCase());
                obj.congesPeriods.forEach(period => {
                    agence.conges.filter(x => this.isPeriodColide(x, period)).forEach(x => {
                        const obj2 = data.find(y => y.index === x.employee);
                        obj.congesConflict = !obj.congesConflict ? [obj2.name] : obj.congesConflict.concat(obj2.name);
                        obj2.congesConflict = !obj2.congesConflict ? [obj.name] : obj2.congesConflict.concat(obj.name);
                    });
                    agence.conges.push(period);
                });
            });
        })

        return data;
    }

    static isPeriodColide(period1, period2) {
        return period1.begin <= period2.end && period2.begin <= period1.end;
    }

    static getUniqueAgencies(employees) {
        const agenciesSet = new Set();

        employees.forEach(emp => {
            if (emp.agences) {
                emp.agences.split(",").map(a => a.trim()).forEach(agency => agenciesSet.add(agency.trim().toLowerCase()));
            }
        });

        return [...agenciesSet];
    }

    static formatPeriod(index, conges) {
        const result = [];
        conges?.split(',').forEach(str => {
            const dates = str.toLowerCase().split("au");
            result.push({ employee: index, begin: this.convertToDate(dates[0]), end: this.convertToDate(dates[1]) });
        });
        return result;
    }

    static convertToDate(dateStr) {
        const [day, month] = dateStr.split("/").map(num => parseInt(num.trim(), 10));
        const year = new Date().getFullYear();
        return new Date(Date.UTC(year, month - 1, day));
    }

    static arrayToObject(data) {
        const keys = data.splice(0, 1)[0];
        return data.map((x, index) => { return { index, ...this.getObj(keys, x) }; });
    }

    static haveDifferences(array1, array2) {
        if (!array1 || !array2)
            return true;

        if (array1.length !== array2.length)
            return true;

        return array1.find((obj1, index) => {
            if (index === 0)
                return false;
            const obj2 = array2[index];
            return JSON.stringify(obj1) !== JSON.stringify(obj2);
        });
    }

    static transformArrayToObject(arr) {
        return arr.reduce((acc, item) => {
            acc[`id${item.index}`] = item.nom + ' ' + item.prenom;
            return acc;
        }, {});
    }

    static getObj(keys, array) {
        let obj = {};
        for (let i = 0; i < keys.length; i++)
            obj[keys[i].toLowerCase()] = array[i];
        return obj;
    }

    static formatDateFr(date) {
        return date.toLocaleString("fr-FR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        }).replace(",", "");
    }
}

module.exports = managerDemoSheet;
