/* eslint-disable no-unused-vars */

class aiCombos {
    static getAiCombos(game, task, player, cardsAvailable) {
        const units = cardsAvailable.filter(card => this.isCardUnit(card));
        const pilots = cardsAvailable.filter(card => this.isCardPilot(card));

        return {
            pilotLinkUnits: this.getAiCombosPilotLinkUnit(game, task, player, units, pilots),
            pilotLinkUnitsOnFieldWithEffects: this.getAiCombosPilotLinkUnitFieldWithEffects(game, task, player, pilots)
        };
    }

    static getAiCombosPilotLinkUnit(game, task, player, units, pilots) {
        if (pilots.length < 1)
            return [];

        let result = [];
        units.forEach(unit => {
            const costRemaining = player.resourcesAvailable - unit.cost;
            const pilot = pilots.find(pilot => this.isLink(unit, pilot) && pilot.cost <= costRemaining);
            if (pilot) {
                unit.AiUsed = pilot.index;
                pilot.AiUsed = unit.index;
                const value = unit.level + pilot.level;
                result.push({ unit, pilot, value, id: `${unit.name}-${pilot.name}-${value}` });
            }
        });

        result = result.sort((a, b) => b.value - a.value);
        return result;
    }

    static getAiCombosPilotLinkUnitFieldWithEffects(game, task, player, pilots) {
        if (pilots.length < 1)
            return [];

        let result = [];
        player.field.filter(unit => !unit.pair).forEach(unit => {
            const unitHasEffect = this.hasLinkEffect(unit);
            const pilot = pilots.find(pilot => !pilot.AiUsed && this.isLink(unit, pilot) && (unitHasEffect || this.hasLinkEffect(pilot)));
            if (pilot) {
                pilot.AiUsed = unit.index;
                const value = unit.level + pilot.level;
                result.push({ unit, pilot, value, id: `${unit.name}-${pilot.name}-${value}` });
            }
        });

        result = result.sort((a, b) => b.value - a.value);
        return result;
    }
}


export default aiCombos;
