<template>
    <div v-if="images">
        <menu-bar-daggerheart>
        </menu-bar-daggerheart>


        <div class="bg2" v-if="refImages.length > 0">
            <div>Résultat</div>
            <div v-for="(image, index) in refImages" :key="'refImages' + index" style="display:inline">
                <a :href="image.img" :download="image.id"><img style="width:340px; object-fit:cover" :src="image.img" /></a>
            </div>
        </div>

        <div v-else class="flex flex-wrap">
            <div ref="CardTemplate" v-for="(obj, index) in domaines.slice(0, 0)" :key="'classSub' + index"
                :id="obj.image">
                <card-domain :obj="obj">
                </card-domain>
            </div>
        </div>

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
            <img style="width:340px" v-for="(obj, index) in classsub" :key="'classSubA' + index" :src="obj.img" />
        </div>
        <h1></h1>
        <h2>Les Domaines</h2>
        <div class="flex flex-wrap">
            <img style="width:340px" v-for="(image, index) in domaines" :key="'domaines' + index" :src="image.img" />
        </div>
        <h1></h1>
        <h2>Autre</h2>
        <div class="flex flex-wrap bg2">
            <img style="width:150px; object-fit:cover" v-for="(image, index) in images.others" :key="'other' + index"
                :src="image" />
        </div>
        <h1></h1>
        <h2>Sous classe et Domaines</h2>
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
  import html2canvas from 'html2canvas';

  export default {
  name: 'pageDaggerheartCards',
  components: {menuBarDaggerheart, cardDomain, cardClassSub},
  data: () => ({
    images: null,
    classsub: null,
    domaines: null,
    refImages: [],
    showCards:true
  }),
  async mounted(){
    const ascendences = serviceDaggerheart.ascendences.map(x=> require('@/assets/Daggerheart/Cartes/Ascendances/' + x +'.png'));
    const communautes = serviceDaggerheart.communautes.map(x=> require('@/assets/Daggerheart/Cartes/Communautes/' + x +'.png'));    
    let classes = [];
    serviceDaggerheart.classesNames.forEach(x => {
        classes.push(require('@/assets/Daggerheart/Cartes/ClassesExplications/' + x +'.png'));
        classes.push(require('@/assets/Daggerheart/Cartes/Classes/' + x +'.png'));
    });
    this.domaines = await serviceDaggerheart.get('domaines');
    this.domaines.forEach(x=> x.img= require('@/assets/Daggerheart/Cartes/Domaines3/' + x.image + '.png'));
    this.domaines = this.domaines.sort((a, b) =>  a.domaine.localeCompare(b.domaine) || a.niveau - b.niveau);

    const others = serviceDaggerheart.others.map(x=> require('@/assets/Daggerheart/' + x ));
    
    this.images = {ascendences, communautes, classes, others };

    this.classsub = await serviceDaggerheart.get('classsub');
    this.classsub.forEach(x=> x.img= require('@/assets/Daggerheart/Cartes/SousClasses2/' + x.image +'.png'));
    this.classsub = this.classsub.sort((a, b) =>  a.image.localeCompare(b.image));
    this.turnDivsToImages();
  },
  methods: {
    AddCards(){alert("Ce service n'est pas encore disponible.");},
    async turnDivsToImages(){
        await new Promise(resolve => setTimeout(resolve, 1000)); 
        if(!this.$refs.CardTemplate || this.$refs.CardTemplate.length < 1)
            return;
        for(let i=0; i< this.$refs.CardTemplate.length; i++)
            this.turnDivToImage(this.$refs.CardTemplate[i]);
    },
    async turnDivToImage(div){   
        const canvas = await html2canvas(div);
        const dataURL = canvas.toDataURL('image/png');
        this.refImages.push({id:div.id, img:dataURL});
    }
  }
  };
  </script>