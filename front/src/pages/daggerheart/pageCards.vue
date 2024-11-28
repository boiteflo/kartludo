<template>
    <div v-if="images">
        <menu-bar-daggerheart>
        </menu-bar-daggerheart>

        <h2>Les Ascendences</h2>
        <div class="flex flex-wrap">
            <img style="width:340px" v-for="(image, index) in images.ascendences" :key="'ascendance' + index"
                :src="image" />
        </div>

        <h1></h1>
        <h2>Les Communautés</h2>
        <div class="flex flex-wrap">
            <img style="width:340px" v-for="(image, index) in images.communautes" :key="'communaute' + index"
                :src="image" />
        </div>

        <h1></h1>
        <h2>Les Classes</h2>
        <div class="flex flex-wrap">
            <img style="width:340px" v-for="(image, index) in images.classes" :key="'classe' + index" :src="image" />
        </div>

        <h1></h1>
        <h2>Les Sous Classes</h2>
        <div class="flex flex-wrap">
            <img style="width:340px" v-for="(image, index) in images.sousClasses" :key="'classSubA' + index" :src="image" />
        </div>

        <h1></h1>
        <h2>Les Domaines</h2>
        <div class="flex flex-wrap">
            <img style="width:340px" v-for="(image, index) in images.domaines" :key="'domaines' + index" :src="image" />
        </div>
        <h1></h1>

        <h2>Autre</h2>
        <div class="flex flex-wrap bg2">
            <img style="width:150px; object-fit:cover" v-for="(image, index) in images.others" :key="'other' + index"
                :src="image" />
        </div>
    </div>
</template>
<script>
export default {
    name: 'StyledComponent'
}
</script>

<script>
  import serviceDaggerheart from '../../services/serviceDaggerheart'

  import menuBarDaggerheart from '../../components/menuBarDaggerheart';
  import cardClassSub from '../../components/cards/cardClassSub';
  import cardDomain from '../../components/cards/cardDomain';

  export default {
  name: 'pageDaggerheartCards',
  components: {menuBarDaggerheart, cardDomain, cardClassSub},
  data: () => ({
    images: {},
  }),
  async mounted(){
    let images = {};
    images.ascendences = serviceDaggerheart.ascendences.map(x=> {return require('@/assets/Daggerheart/Cartes/Ascendances/' + x +'.png');});
    images.communautes = serviceDaggerheart.communautes.map(x=> {return require('@/assets/Daggerheart/Cartes/Communautes/' + x +'.png');});
    images.classes = serviceDaggerheart.classesNames.map(x=> {return require('@/assets/Daggerheart/Cartes/Classes/' + x +'.png');});
    images.sousClasses = serviceDaggerheart.sousClasses.map(x=> {return require('@/assets/Daggerheart/Cartes/SousClasses3/' + x +'.png');});
    images.domaines = serviceDaggerheart.domaines.map(x=> {return require('@/assets/Daggerheart/Cartes/Domaines4/' + x +'.png');});
    images.others = serviceDaggerheart.others.map(x=> {return require('@/assets/Daggerheart/' + x );});
    this.images = images;
  },
  methods: {
  }
  };
  </script>