import effectsLuncher from './effectsLuncher';
import effectsTarget from './effectsTarget';
import mainEffects from './mainEffects';
import positioner from './positioner';
import selectable from './selectable';
import cardAction from './cardAction';
import conditions from './conditions';
import cardMove from './cardMove';
import cardLife from './cardLife';
import cardPlay from './cardPlay';
import refresh from './refresh';
import effects from './effects';
import attack from './attack';
import setup from './setup';
import popup from './popup';
import tasks from './tasks';
import utils from './utils';
import show from './show';
import turn from './turn';
import tuto from './tuto';
import pair from './pair';
import ai from './ai';
import aiCombos from './aiCombos';
import aiPlay from './aiPlay';
import aiStrategy from './aiStrategy';

/* eslint-disable no-unused-vars */
class game {
    static game = null;
    static index = 1;
    static delay = 500;
    static needTaskEndRefresh;
    static cardHighlight = [];
    static isStart;
    static quickstart;

    static setup(width, height, cards, decklistPlayer1, decklistPlayer2, quickstart, useTuto) {
        this.cards = cards.cards;
        this.quickstart = quickstart;
        this.game = {
            logs: '',
            cards: [],
            tasks: [{ id: 'setupGame' }],
            cardList: cards.cards,
            gundamCards: cards,
            decklistPlayer1, decklistPlayer2,
            incruises: [],
            effects: [],
            tuto:useTuto
        };

        const scripts = [
            tasks, utils, popup, setup, positioner, turn, refresh, selectable, show, mainEffects,
            cardLife, cardMove, cardPlay, cardAction, effectsLuncher, effectsTarget, conditions, effects, pair, attack,
            ai, aiCombos, aiPlay, aiStrategy
        ];
        if(useTuto)
            scripts.push(tuto); // = [tuto].concat(scripts);

        utils.addFunction(scripts, this, useTuto);
        this.game.grid = this.createGrid(width, height);
        this.continue(this.game);
        this.isStart = true;
        return this.game;
    }

    static continue(game) {
        if (this.isStart) {
            this.addTaskFirst({ id: this.mulligan.name }, { id: this.nextTurn.name });
            this.isStart = false;
        }
        this.endAnimation(game);
        let result = this.handleTasks(game);
        if (!game.refresh && !game.isPlayer1) {
            this.addTask({ id: this.newTurnForAI.name });
            result = this.continue(game);
        }

        return result;
    }

    static playCard(game, card1, card2, zone) {
        this.startTasks(game);
        this.addTask({ id: this.play.name, card1, card2, zone, regularPlay: true });
        return this.continue(game);
    }

    static useEffect(game) {
        this.startTasks(game);
        return this.lunchMainEffectCard(game);
    }

    static selectChoice(game, choice) {
        game.popup.task.choice = choice;
        return game;
    }

    static selectChoiceCard(game, card) {
        game.popup.task.cardChoice = card;
        return game;
    }

    static tutoNext(game, next=true){
        game.showTextTuto.next=next;
        this.continueTuto(game);
        return this.continue(game);
    }

    static showLocationCards(game, location, isPlayer1) {
        const player = this.getPlayer(isPlayer1);
        this.addTaskFirst({
            id: this.popup.name,
            cards: player[location],
            task: {},
            isPlayer1: true,
            text: `${location} of player ${player.index}`,
            choices: [{ text: 'ok' }]
        });
        return game;
    }

    static endTurn(game, card1, card2, drop) {
        this.startTasks(game);
        game.tasks.push({ id: this.nextTurn.name, isPlayer1: game.isPlayer1 });
        return game;
    }

    static end(isPlayer1) {
        this.game.end = true;
        this.game.isVictory = isPlayer1;
        const message = isPlayer1 ? 'Victory' : 'Defeat';
        return { end: true };
    }
}


export default game;
