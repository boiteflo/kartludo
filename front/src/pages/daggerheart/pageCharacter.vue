<template>
    <div class="bg2 h100p">
        <menu-bar-daggerheart>
        </menu-bar-daggerheart>
        <h1>Créer un personnage</h1>
        <div v-if="!images">
            <v-progress-circular class="center w100p" indeterminate></v-progress-circular>
        </div>
        <div v-else>

            <v-tabs v-model="tab" background-color="transparent" class="bgWhite" grow>
                <v-tab v-for="item in tabs" :key="item">
                    {{ item }}
                </v-tab>
            </v-tabs>

            <v-tabs-items v-model="tab">
                <v-tab-item>
                    <!-- Ancestry -->
                    <div>
                        <h2>Choisir une Ascendence</h2>
                        <div class="flex flex-wrap m5px">
                            <div v-for="(obj, index) in images.ascendences" :key="'Ancestry' + index">
                                <img class="cursorPointer w340" :src="obj.image" @click="selectAncestry(obj)">
                            </div>
                        </div>
                    </div>
                </v-tab-item>

                <v-tab-item>
                    <!-- Community -->
                    <div>
                        <h2>Choisir une Communauté</h2>
                        <div class="flex flex-wrap m5px">
                            <div v-for="(obj, index) in images.communautes" :key="'Community' + index">
                                <img class="cursorPointer w340" :src="obj.image" @click="selectCommunity(obj)">
                            </div>
                        </div>
                    </div>
                </v-tab-item>

                <v-tab-item>
                    <!-- Class -->
                    <div>
                        <h2>Choisir une classe</h2>
                        <div class="flex flex-wrap m5px">
                            <div v-for="(obj, index) in images.classes" :key="'Class' + index">
                                <img class="cursorPointer w340" :src="obj.basic" @click="selectClass(obj)">
                                <img class="cursorPointer w340" :src="obj.details" @click="selectClass(obj)">
                            </div>
                        </div>
                    </div>
                </v-tab-item>

                <v-tab-item>
                    <!-- SubClass -->
                    <div>
                        <h2>Choisir une sous classe</h2>
                        <div class="flex flex-wrap m5px">
                            <div v-for="(obj, index) in images.sousClasses.filter(x => x.name.toLowerCase().startsWith(character.class.name.toLowerCase()))"
                                :key="'SubClass' + index">
                                <img class="cursorPointer w340" :src="obj.image" @click="selectSubClass(obj)">
                            </div>
                        </div>
                    </div>
                </v-tab-item>

                <v-tab-item>
                    <!-- Domains -->
                    <div>
                        <h2>Choisir deux cartes de domaines</h2>
                        <div class="flex flex-wrap m5px">
                            <div v-for="(obj, index) in getDomains()" :key="'Domains' + index"
                                class="wCard hCard cursorPointer bgImage"
                                :style="{ 'background-image': 'url(' + obj.image + ')' }" @click="selectDomain(obj)">
                                <div class="w100p h100p"
                                    :class="{ yellowGradient: getCharacterDomains().includes(obj.name) }">
                                </div>
                            </div>
                        </div>
                    </div>
                </v-tab-item>

                <!-- Armor -->
                <v-tab-item>
                    <div>
                        <h2>Choisir une armure</h2>
                        <div class="flex-wrap">
                            <card-small v-for="(obj, index) in armors" :key="'Armor' + index"
                                :background="require('@/assets/Daggerheart/template/CardArmor.png')"
                                :image="require('@/assets/Daggerheart/other/armor.png')" class="cursorPointer"
                                @click="selectArmor(obj)">
                                <div class="text textCenter rl5px" style="top:155px"><b>{{ obj.name }}</b></div>
                                <div class="text textCenter rl5px colorWhite" style="top:125px"><b>{{ obj.armor }}</b>
                                </div>
                                <div class="text rl5px" style="top:175px; font-size:12px" v-html="obj.feature"></div>
                            </card-small>
                        </div>
                    </div>
                </v-tab-item>

                <v-tab-item>
                    <!-- Weapons -->
                    <div>
                        <h2>Choisir des armes</h2>

                        <div class="flex-wrap">
                            <card-small v-for="(obj, index) in weapons" :key="'Weapon' + index"
                                :background="require('@/assets/Daggerheart/template/CardWeapon.png')"
                                :image="require('@/assets/Daggerheart/other/weapon.png')" class="cursorPointer"
                                @click="selectWeapon(obj)">
                                <div class="overlay-image"
                                    :style="{ top: '5px', right: '5px', width: '25px', height: '30px', 'background-image': 'url(' + require('@/assets/Daggerheart/other/hand.png') + ')' }">
                                    <div class="colorBlack" style="margin-top:5px; margin-left:5px"><b>{{ obj.hands
                                            }}</b></div>
                                </div>
                                <div class="text textCenter rl5px" style="top:130px"><b>{{ obj.nom }}</b></div>
                                <div class="text rl5px" style="top:150px; font-size:12px"><b>Trait : </b> {{ obj.trait
                                    }}, <b>Dégâts :</b> {{ obj.degats }}, <b>Type : </b> {{ obj.type_de_degats }},
                                    <b>Portée :</b> {{ obj.portee }} <div style="font-size:10px"
                                        v-html="obj.caracteristique"></div>
                                </div>
                            </card-small>
                        </div>
                    </div>
                </v-tab-item>

                <v-tab-item>
                    <h2>Mon Personnage</h2>
                    <div class="flex flex-wrap m5px" v-if="tab > 6">
                        <img class="cursorPointer w340" :src="character.ancestry.image" @click="selectStep(0)">
                        <img class="cursorPointer w340" :src="character.community.image" @click="selectStep(1)">
                        <img class="cursorPointer w340" :src="character.class.details" @click="selectStep(2)">
                        <img class="cursorPointer w340" :src="character.subclass.image" @click="selectStep(3)">
                        <div v-for="(obj, index) in character.domains" :key="'CharacterDomains' + index">
                            <img class="cursorPointer w340" :src="obj.image" @click="selectStep(4)">
                        </div>
                    </div>
                </v-tab-item>
            </v-tabs-items>







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
import buttonBig from '../../components/buttonBig';
import cardSmall from '../../components/cardSmall';

  export default {
  name: 'pageCharacter',
  components: {menuBarDaggerheart, buttonBig, cardSmall},
  data: () => ({
    tab: null,
    tabs: "ASCENDENCE,COMMUNAUTE,CLASSE,SOUS CLASSE,DOMAINS,ARMURE,ARMES,HISTOIRE".split(','),
    images: null,
    class: null,
    armors: null,
    weapons:null,
    character : {class:{name:''}, domains:[], weapons:[], allowedDomains:["",""]}
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
    this.armors = serviceDaggerheart.getArmors();
    this.weapons = serviceDaggerheart.getWeapons();
  },
  methods: {
    selectStep(step){
        this.tab = step;
        const fullSteps = "ASCENDENCE,COMMUNAUTE,CLASSE,SOUS CLASSE,DOMAINS,ARMURE,ARMES,HISTOIRE"
            .split(',').map((x,index)=> {return {Id:index, Text:x};});
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
        obj.selected = !obj.selected;
        if(obj.selected)
            this.character.domains.push(obj);
        else
            this.character.domains = this.character.domains.filter(x=> x.name !== obj.name);
        if(this.character.domains.length > 1)
            this.selectStep(5);
    },
    getDomains(){
        return this.images.domaines.filter(x=> x.name.startsWith(this.character.allowedDomains[0]) || x.name.startsWith(this.character.allowedDomains[1]));
    },
    getCharacterDomains(){return this.character.domains.map(x=> x.name);},
    selectArmor(obj){
        this.character.armor = obj;
        this.selectStep(6);
    },
    selectWeapon(obj){
        obj.selected = !obj.selected;
        if(obj.selected)
            this.character.weapons.push(obj);
        else
            this.character.weapons = this.character.weapons.filter(x=> x.name !== obj.name);
        if(this.character.weapons.length > 1)
            this.selectStep(7);
    }
   }
  };
  </script>