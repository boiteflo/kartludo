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
            <img style="width:340px" v-for="(image, index) in images.sousClasses" :key="'communaute' + index"
                :src="image" />
        </div>
        <h1></h1>
        <h2>Les Domaines</h2>
        <div class="flex flex-wrap">
            <img style="width:340px" v-for="(image, index) in images.domaines" :key="'communaute' + index"
                :src="image" />
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

  export default {
  name: 'pageDaggerheartCards',
  components: {menuBarDaggerheart},
  data: () => ({
    images: null,
  }),
  mounted(){
    const ascendences = serviceDaggerheart.ascendences.map(x=> require('@/assets/Daggerheart/Cartes/Ascendances/' + x +'.png'));
    const communautes = serviceDaggerheart.communautes.map(x=> require('@/assets/Daggerheart/Cartes/Communautes/' + x +'.png'));    
    let classes = [];
    serviceDaggerheart.classesNames.forEach(x => {
        classes.push(require('@/assets/Daggerheart/Cartes/ClassesExplications/' + x +'.png'));
        classes.push(require('@/assets/Daggerheart/Cartes/Classes/' + x +'.png'));
    });
    const sousClasses = serviceDaggerheart.sousClasses.map(x=> require('@/assets/Daggerheart/Cartes/SousClasses/' + x +'.png'));
    const domaines = serviceDaggerheart.domaines.map(x=> require('@/assets/Daggerheart/Cartes/Domaines/' + x +'.png'));

    const others = serviceDaggerheart.others.map(x=> require('@/assets/Daggerheart/' + x ));
    
    this.images = {ascendences, communautes, classes, sousClasses, domaines, others };
  },
  methods: {
    AddCards(){alert("Ce service n'est pas encore disponible.");}
  }
  };
  </script>