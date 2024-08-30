<template>
    <div class="bg2 h100p">
        <menu-bar-daggerheart>
        </menu-bar-daggerheart>
        <hierarchy class="bg" :items="hierarchyArray" @select="selectHierarchy"></hierarchy>
        <h1>Créer un personnage</h1>
        <div v-if="!images">
            <v-progress-circular class="center w100p" indeterminate></v-progress-circular>
        </div>
        <div v-else>

            <!-- Ancestry -->
            <div v-if="step == 0">
                <h2>Choisir une Ascendence</h2>
                <div class="flex flex-wrap m5px">
                    <div v-for="(obj, index) in images.ascendences" :key="'Ancestry' + index">
                        <img style="width:340px" :src="obj.image" @click="selectAncestry(obj)">
                    </div>
                </div>
            </div>

            <!-- Community -->
            <div v-else-if="step == 1">
                <h2>Choisir une Communauté</h2>
                <div class="flex flex-wrap m5px">
                    <div v-for="(obj, index) in images.communautes" :key="'Community' + index">
                        <img style="width:340px" :src="obj.image" @click="selectCommunity(obj)">
                    </div>
                </div>
            </div>

            <!-- Class -->
            <div v-else-if="step == 2">
                <h2>Choisir une classe</h2>
                <div class="flex flex-wrap m5px">
                    <div v-for="(obj, index) in images.classes" :key="'Class' + index">
                        <img style="width:340px" :src="obj.basic" @click="selectClass(obj)">
                        <img style="width:340px" :src="obj.details" @click="selectClass(obj)">
                    </div>
                </div>
            </div>

            <!-- SubClass -->
            <div v-else-if="step == 3">
                <h2>Choisir une sous classe</h2>
                <div class="flex flex-wrap m5px">
                    <div v-for="(obj, index) in images.sousClasses.filter(x=> x.name.toLowerCase().startsWith(character.class.name.toLowerCase()))" :key="'SubClass' + index">
                        <img style="width:340px" :src="obj.image" @click="selectSubClass(obj)">
                    </div>
                </div>
            </div>

            <!-- Domains -->
            <div v-else-if="step == 4">
                <h2>Choisir deux cartes de domaines</h2>
                <div class="flex flex-wrap m5px">
                    <div v-for="(obj, index) in getDomains()" :key="'Domains' + index">
                        <img style="width:340px" :src="obj.image" @click="selectDomain(obj)">
                    </div>
                </div>
            </div>

            <!-- Armor -->
            <div v-else-if="step == 5">
                <h2>Mon Personnage</h2>
                <div class="flex flex-wrap m5px">
                    <img style="width:340px" :src="character.ancestry.image" @click="selectStep(0)">
                    <img style="width:340px" :src="character.community.image" @click="selectStep(1)">
                    <img style="width:340px" :src="character.class.details" @click="selectStep(2)">
                    <img style="width:340px" :src="character.subclass.image" @click="selectStep(3)">
                    <img style="width:340px" :src="character.domain.image" @click="selectStep(4)">
                </div>
                <!--
                <h2>Choisir une armure</h2>
                <div class="flex flex-wrap m5px">
                    <div v-for="(obj, index) in images.communautes" :key="'Armor' + index">
                        <img style="width:340px" :src="obj.image" @click="selectCommunity(obj)">
                    </div>
                </div>
                -->
            </div>

            <!-- Weapons -->
            <div v-else-if="step == 6">
                <h2>Choisir des armes</h2>
                <div class="flex flex-wrap m5px">
                    <div v-for="(obj, index) in images.communautes" :key="'Weapon' + index">
                        <img style="width:340px" :src="obj.image" @click="selectCommunity(obj.name)">
                    </div>
                </div>
            </div>
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
import hierarchy from '../../components/hierarchy';
import buttonBig from '../../components/buttonBig';

  export default {
  name: 'pageCharacter',
  components: {menuBarDaggerheart, hierarchy, buttonBig},
  data: () => ({ 
    step: 0,
    hierarchyArray: [{Id:0, Text:'Ascendence'}],
    images: null,
    class: null,
    character : {}
  }),
  async mounted(){
    const ascendences = serviceDaggerheart.ascendences.map(x=> {return {name:x, image:require('@/assets/Daggerheart/Cartes/Ascendances/' + x +'.png')};});
    const communautes = serviceDaggerheart.communautes.map(x=> {return {name:x, image:require('@/assets/Daggerheart/Cartes/Communautes/' + x +'.png')};});
    this.class = await serviceDaggerheart.getAllClass();
    let classes = this.class.map(x => {
        return { 
            ...x,
            basic: require('@/assets/Daggerheart/Cartes/ClassesExplications/' + x.name.toLowerCase() +'.png'),
            details: require('@/assets/Daggerheart/Cartes/Classes/' + x.name.toLowerCase() +'.png')
        };
    });
    const sousClasses = serviceDaggerheart.sousClasses.map(x=> {return {name:x, image:require('@/assets/Daggerheart/Cartes/SousClasses/' + x +'.png')};});
    const domaines = serviceDaggerheart.domaines.map(x=> {return {name:x, image:require('@/assets/Daggerheart/Cartes/Domaines/' + x +'.png')};});
    this.images = {ascendences, communautes, classes, sousClasses, domaines };
  },
  methods: {
    selectStep(step){
        this.step = step;
        const fullSteps = "ASCENDENCE,COMMUNAUTE,CLASSE,SOUS CLASSE,DOMAINS,ARMURE,ARMES,HISTOIRE"
            .split(',').map((x,index)=> {return {Id:index, Text:x};});
        this.hierarchyArray = fullSteps.slice(0, step);
    },
    selectHierarchy(item){
      this.selectStep(item.Id);
    },
    selectAncestry(obj){
        this.selectStep(1);
        this.character.ancestry = obj;
    },
    selectCommunity(obj){
        this.selectStep(2);
        this.character.community = obj;
    },
    selectClass(obj){
        this.selectStep(3);
        this.character.class = obj;
        this.character.allowedDomains = obj.domains.split(' et ');
    },
    selectSubClass(obj){
        this.selectStep(4);
        this.character.subclass = obj;
    },
    selectDomain(obj){
        this.selectStep(5);
        this.character.domain = obj;
    },
    getDomains(){
        return this.images.domaines.filter(x=> x.name.startsWith(this.character.allowedDomains[0]) || x.name.startsWith(this.character.allowedDomains[1]));
    }
   }
  };
  </script>