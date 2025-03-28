import global from '../global';
import gameTask from '../gameTask';
import effects from './effects';

class cardPlay {
    static playFromHand(player, card1, card2, zone, regularPlay) {
        const isSamePlayer = zone.isPlayer1 == player.isPlayer1;
        const wrongCost = regularPlay && player.resourcesAvailable < card1.cost;

        if (!isSamePlayer || zone.location == global.locationHand || wrongCost)
            return { sendBack: true };

        return this.playCard(player, card1, card2, zone, regularPlay);
    }

    static playCard(player, card1, card2, zone, playCost) {
        let isPilot = global.isCardPilot(card1);
        let isCommand = global.isCardCommand(card1);

        const pilotOrCommand = this.askPilotOrCommand(card1, card2);
        isPilot = pilotOrCommand ? pilotOrCommand.isPilot : isPilot;
        isCommand = pilotOrCommand ? pilotOrCommand.isCommand : isCommand;
        if (pilotOrCommand && pilotOrCommand.stop)
            return pilotOrCommand;

        global.spawnIfNot(card1);

        const effectResult = effects.handleEffects(player, card1, card2, effects.onplay);
        if (effectResult.stop)
            return effectResult;

        if (global.isCardUnit(card1) && player.field.length < 6) {
            card1.canAttack = false;
            if (playCost)
                this.playCardCost(player, card1);
            global.move(player, card1, card1.location, player.positions.field.location);
            return;
        }

        if (global.isCardBase(card1)) {
            if (player.base.length > 0)
                gameTask.addTasks(global.game.tasks, [{ id: gameTask.taskMove.name, card1: player.base[0], to: global.locationTrash, isPlayer1: card1.isPlayer1 }]);

            global.move(player, card1, card1.location, global.locationBase);
            card1.selectable = false;
            return;
        }

        if (isPilot && card2 && global.isCardUnit(card2)) {
            if (card1.pair || card2.pair || card1.isPaired || card2.isPaired) {
                this.sendCardBackToSquareOne(card1);
                return;
            }

            if (playCost)
                this.playCardCost(player, card1);
            gameTask.addTasks(global.game.tasks, [{ id: gameTask.taskPairCard.name, card1, card2 }]);
            return;
        }

        if (isCommand) {
            if (playCost)
                this.playCardCost(player, card1);
            gameTask.addTasks(global.game.tasks, [{ id: gameTask.taskApplyEffect.name, card1, card2, trigger: effects.command }]);
            global.move(player, card1, card1.location, global.locationTrash);
            return;
        }

        this.sendCardBackToSquareOne(card1);
    }

    static sendCardBackToSquareOne(card) {
        const rotation = card.active ? 0 : 90;
        card.to = { ...global.clone(card.position), rotation };
        card.position = { ...card.position, ...card.positionDrag };
        global.game.refresh = true;
        return global.game;
    }

    static playCardCost(player, card) {
        if (player.resourcesEx > 0)
            player.resourcesEx = Math.max(0, player.resourcesEx - card.cost);
        player.resourcesAvailable -= card.cost;
    }

    static askPilotOrCommand(card1, card2) {
        if (!card2 || !global.isCardPilot(card1) || !global.isCardCommand(card1))
            return;

        if (!global.game.choice) {
            global.game.tasks = [{
                id: gameTask.taskPopup.name,
                text: 'Do you want to play as pilot or command ?',
                choices: [{ text: 'Pilot' }, { text: 'Command' }]
            }].concat(global.game.tasks);
            return { stop: true }
        } else {
            const isPilot = global.game.choice.text === 'Pilot';
            const isCommand = global.game.choice.text === 'Command';
            global.deletePopup();
            return { isPilot, isCommand };
        }
    }
}


export default cardPlay;
