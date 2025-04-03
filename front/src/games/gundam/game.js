import effectsLuncher from './effectsLuncher';
import positioner from './positioner';
import selectable from './selectable';
import cardMove from './cardMove';
import cardLife from './cardLife';
import cardPlay from './cardPlay';
import refresh from './refresh';
import effects from './effects';
import setup from './setup';
import popup from './popup';
import tasks from './tasks';
import utils from './utils';
import show from './show';
import turn from './turn';
import pair from './pair';

/* eslint-disable no-unused-vars */
class game {
    static game = null;
    static index = 1;
    static delay = 500;
    static needTaskEndRefresh;
    static cardHighlight = [];
    static isStart;

    static setup(width, height, cards, decklistPlayer1, decklistPlayer2) {
        this.cards = cards.cards;
        this.game = { logs:'', cards: [], tasks: [{ id: 'setupGame' }], cardList: cards.cards, gundamCards:cards, decklistPlayer1, decklistPlayer2 };
        utils.addFunction([tasks, utils, popup, setup, positioner, turn, refresh, cardMove, cardLife, cardPlay, selectable, show, effectsLuncher, effects, pair], this);
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
        return this.handleTasks(game);
    }

    static playCard(game, card1, card2, zone) {
        this.addTask({ id: this.play.name, card1, card2, zone, regularPlay:true });
        return this.continue(game);
    }

    static selectChoice(game, choice) {
        game.popup.task.choice = choice;
        return game;
    }

    static selectChoiceCard(game, card) {
        game.popup.task.cardChoice = card;
        return game;
    }

    static endTurn(game, card1, card2, drop) {
        game.tasks.push({ id: this.nextTurn.name, isPlayer1: game.isPlayer1 });
        return game;
    }

    static end(isPlayer1) {
        this.game.end = true;
        const message = isPlayer1 ? 'Victory' : 'Defeat';
        alert(message);
        return { end: true };
    }
}


export default game;
