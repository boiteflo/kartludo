<template>
  <header-yugioh>
    <div v-if="loading" class="flex-center">
      <v-progress-circular indeterminate :size="200" :width="20" style="margin-top:100px"></v-progress-circular>
    </div>
    <panel-cube-config v-else-if="seed && cube" :seed="seed" :deckobj="deck" :cube="cube" :boosters="boosters"
      @saveDeck="saveDeck">
    </panel-cube-config>
    <div v-else>
      Création d'un cube
    </div>
  </header-yugioh>
</template>


<script>
import { forkJoin } from 'rxjs';
import ServiceBack from '../../services/serviceBack'

import { store } from '../../data/store.js'
import headerYugioh from '../../components/headerYugioh';
import panelCubeConfig from '../../components/panelCubeConfig';

export default {
  name: 'pageDeck',
  components: { headerYugioh, panelCubeConfig },
  data: () => ({
    store: store,
    loading: true,
    isNew: false,
    id: null,
    seed: null,
    deckId: null,
    deck: null,
    cube: null,
    boosters: null,
  }),
  mounted() {
    let uri = window.location.href;
    let indexDeck = uri.indexOf("&deck=");

    let indexSeed = uri.indexOf("&seed=");
    if (indexSeed < 1) {
      window.location.href = window.location.href + '&seed=' + ((new Date().getTime() * 10000) + 621355968000000000);
      return;
    }
    this.seed = uri.substring(indexSeed + 6);
    if (indexDeck > 0)
      this.seed = this.seed.substring(0, indexDeck - indexSeed - 6);

    let i = uri.indexOf("id=");
    this.isNew = i < 1;
    this.id = uri.substring(i + 3).substring(0, indexSeed - i - 3);

    let calls = [
      ServiceBack.get('cube', this.id),
      ServiceBack.getAll('booster')
    ];
    if (indexDeck > 0) {
      this.deckId = uri.substring(indexDeck + 6);
      calls.push(ServiceBack.get('deck', this.deckId));
    }

    forkJoin(calls).subscribe(results => {
      this.deck = results.length > 2 ? results[2] : null;
      this.boosters = results[1];
      let boostersIds = this.id.split('+');
      let boostersFromIds = this.boosters.filter(x => boostersIds.includes(x.Ref));
      if (boostersFromIds && boostersFromIds.length > 0)
        this.cube = this.generateBoosterCube(boostersFromIds);
      else
        this.cube = results[0];
      this.loading = false;
    });
  },
  methods: {
    generateBoosterCube(boosters) {
      let ids = boosters.map(x => x.Ref).join('+');
      let keywordMulti = boosters.length > 1 ? 'Multi' : '';
      return {
        "Id": 'Cube ' + ids,
        "Title": keywordMulti + 'Cube ' + ids,
        "Steps": boosters.map(x => { return { "Booster": x.Ref, "Quantity": "25" } })
      }
    },
    saveDeck(deck) {
      this.loading = true;
      ServiceBack.insert('deck', deck)
        .then(res => window.location.href = window.location.href + (this.deckId ? '' : "&deck=" + res.data));
    },
  }
};
</script>
