<template>
    <div class="bg2 h100p">
        <menu-bar-daggerheart>
        </menu-bar-daggerheart>
        <div v-if="!images">
            <v-progress-circular class="center w100p" indeterminate></v-progress-circular>
        </div>
        <div v-else>
            <tabs-responsive :tabs="tabs" :tab="tab" @click="selectStep"></tabs-responsive>

            <v-tabs-items v-model="tab">
                <v-tab-item>
                    <!-- Ancestry -->
                    <div>
                        <h2>Choisir une Ascendence</h2>
                        <div class="flex flex-wrap m5px">
                            <cardImageButton v-for="(obj, index) in images.ascendences" :key="'Ancestry' + index"
                                :image="obj.image" :selected="character.ancestry?.name == obj.name"
                                @click="selectAncestry(obj)">
                            </cardImageButton>
                        </div>
                    </div>
                </v-tab-item>

                <v-tab-item>
                    <!-- Community -->
                    <div>
                        <h2>Choisir une Communauté</h2>
                        <div class="flex flex-wrap m5px">
                            <cardImageButton v-for="(obj, index) in images.communautes" :key="'Community' + index"
                                :image="obj.image" :selected="character.community?.name == obj.name"
                                @click="selectCommunity(obj)">
                            </cardImageButton>
                        </div>
                    </div>
                </v-tab-item>

                <v-tab-item>
                    <!-- Class -->
                    <div>
                        <h2>Choisir une classe</h2>
                        <div class="flex flex-wrap m5px">
                            <div v-for="(obj, index) in images.classes" :key="'Class' + index">
                                <!--
                                    <div class="wCard hCard cursorPointer bgImage"
                                        :style="{ 'background-image': 'url(' + obj.basic + ')' }" @click="selectClass(obj)">
                                        <div class="w100p h100p"
                                            :class="{ yellowGradient: character.class.name == obj.name }">
                                        </div>
                                    </div>
                                -->
                                <cardImageButton :image="obj.details" :selected="character.class?.name == obj.name"
                                    @click="selectClass(obj)">
                                </cardImageButton>
                            </div>
                        </div>
                    </div>
                </v-tab-item>

                <v-tab-item>
                    <!-- SubClass -->
                    <div>
                        <h2>Choisir une sous classe</h2>
                        <div class="flex flex-wrap m5px">
                            <cardImageButton
                                v-for="(obj, index) in images.sousClasses.filter(x => x.name.toLowerCase().startsWith(character.class?.name.toLowerCase()))"
                                :key="'SubClass' + index" :image="obj.image"
                                :selected="character.subclass?.name == obj.name" @click="selectSubClass(obj)">
                            </cardImageButton>
                        </div>
                    </div>
                </v-tab-item>

                <v-tab-item>
                    <!-- Traits -->
                    <div>
                        <h2>Choisir les caractéristiques</h2>
                        <p style="color:gray" class="p10px">Vous devez répartir les six valeurs suivantes : -1, 0, 0, 1,
                            1, 2
                        </p>
                        <div class="flex flex-responsive flex-space-around colorBlack">
                            <div>
                                <v-text-field label="Agilité" hide-details v-model="character.agilite"
                                    class="m5px"></v-text-field>
                                <p>Sprint, Saut, Manoeuvre</p>
                            </div>
                            <div>
                                <v-text-field label="Force" hide-details v-model="character.force"
                                    class="m5px"></v-text-field>
                                <p>Soulever, Écraser, Agripper</p>
                            </div>
                            <div>
                                <v-text-field label="Finesse" hide-details v-model="character.finesse"
                                    class="m5px"></v-text-field>
                                <p>Contrôler, Cacher, Bricoler</p>
                            </div>
                            <div>
                                <v-text-field label="Instinct" hide-details v-model="character.instinct"
                                    class="m5px"></v-text-field>
                                <p>Percevoir, Sentir, Naviguer</p>
                            </div>
                            <div>
                                <v-text-field label="Présence" hide-details v-model="character.presence"
                                    class="m5px"></v-text-field>
                                <p>Charmer, Performer, Tromper</p>
                            </div>
                            <div>
                                <v-text-field label="Savoir" hide-details v-model="character.savoir"
                                    class="m5px"></v-text-field>
                                <p>Se souvenir, Analyser, Comprendre</p>
                            </div>
                        </div>
                        <v-btn class="m10px w100p bg" @click="nextStep">
                            Suivant
                        </v-btn>
                    </div>
                </v-tab-item>

                <v-tab-item>
                    <!-- Domains -->
                    <div>
                        <h2>Choisir deux cartes de domaines</h2>
                        <div class="flex flex-wrap m5px">
                            <cardImageButton v-for="(obj, index) in getDomains()" :key="'Domains' + index"
                                :image="obj.image" :selected="getCharacterDomains().includes(obj.name)"
                                @click="selectDomain(obj)">
                            </cardImageButton>
                        </div>
                    </div>
                </v-tab-item>

                <!-- Armor -->
                <v-tab-item>
                    <div>
                        <h2>Choisir une armure</h2>
                        <div class="flex-wrap">
                            <card-armor v-for="(obj, index) in armors" :key="'Armor' + index" :armor="obj"
                                :highlight="character.class?.armure_suggeree == obj.id"
                                :selected="character.armor?.id == obj.id" @click="selectArmor(obj)">
                            </card-armor>
                        </div>
                    </div>
                </v-tab-item>

                <v-tab-item>
                    <!-- Weapons -->
                    <div v-if="weapons">
                        <h2>Choisir deux armes</h2>
                        <data-table-selection title="Armes Principales Physique" :items="weapons.primaryPhy"
                            :headers="headers" :highlights="getSuggestedWeapons()" @onSelectionChange="selectWeapons"
                            dense class="m10px">
                        </data-table-selection>
                        <data-table-selection title="Armes Principales Magique" :items="weapons.primaryMag"
                            :headers="headers" :highlights="getSuggestedWeapons()" @onSelectionChange="selectWeapons"
                            dense class="m10px">
                        </data-table-selection>
                        <data-table-selection title="Armes Secondaires" :items="weapons.secondary" :headers="headers"
                            :highlights="getSuggestedWeapons()" @onSelectionChange="selectWeapons" dense class="m10px">
                        </data-table-selection>
                    </div>
                </v-tab-item>

                <!-- Histoire -->
                <v-tab-item>
                    <div class="colorBlack">
                        <h2>Définir son histoire</h2>
                        <div>
                            <div class="m10px pd10px colorBlack w100p">
                                <v-text-field v-model="character.name" label="Nom" class="m5px"></v-text-field>
                                <div v-for="index in 2" :key="'Expérience' + index">
                                    <v-text-field v-model="character['experience' + index]"
                                        :label="'Expérience ' + index" class="m5px"></v-text-field>
                                </div>
                            </div>
                        </div>
                        <v-btn class="bg m10px" style="width:100%" @click="finish">
                            Terminé
                        </v-btn>
                    </div>
                </v-tab-item>

                <!-- Mon Personnage-->
                <v-tab-item>
                    <div class="flex flex-wrap m5px" v-if="tab > 6">
                        <img class="cursorPointer w340" :src="character.ancestry.image">
                        <img class="cursorPointer w340" :src="character.community.image">
                        <img class="cursorPointer w340" :src="character.class.details">
                        <img class="cursorPointer w340" :src="character.subclass.image">
                        <div v-for="(obj, index) in character.domains" :key="'CharacterDomains' + index">
                            <img class="cursorPointer w340" :src="obj.image">
                        </div>

                        <div>
                            <card-weapon v-for="(obj, index) in character.weapons" :key="'CharacterWeapon' + index"
                                :weapon="obj">
                            </card-weapon>
                        </div>

                        <card-armor :armor="character.armor"></card-armor>
                    </div>

                    <div class="center w100p"><a :href="character.url">Lien de {{ character.name }}</a></div>

                    <div class="m5px colorBlack">
                        <text-quill class="w100p" :text="character.resume">
                        </text-quill>
                    </div>

                    <div class="flex flex-responsive bg">

                        <div class="p10px colorBlack bgWhite">
                            <!--<v-text-field v-model="character.pronouns" label="Pronoms" class="m5px"></v-text-field>-->
                            <button-image :image="character.image" @change="setImage"></button-image>
                            <v-text-field v-model="character.image_position" label="Position de l'image" class="m5px"
                                @change="refreshCard"></v-text-field>
                        </div>
                        <div ref="CardTemplate" class="bg">
                            <card-character :character="character"
                                :image_position="character.image_position"></card-character>
                        </div>
                        <img v-if="templateImage" style="width:340px" :src="templateImage" />
                        <v-progress-circular v-else indeterminate></v-progress-circular>
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
import html2canvas from 'html2canvas';
import serviceBack from '../../services/serviceBack'
import serviceDaggerheart from '../../services/serviceDaggerheart'

import menuBarDaggerheart from '../../components/menuBarDaggerheart';
import dataTableSelection from '../../components/dataTableSelection';
import cardImageButton from '../../components/cards/cardImageButton';
import cardCharacter from '../../components/cards/cardCharacter';
import tabsResponsive from '../../components/tabsResponsive';
import cardWeapon from '../../components/cards/cardWeapon';
import cardArmor from '../../components/cards/cardArmor';
import buttonBig from '../../components/buttonBig';
import cardSmall from '../../components/cards/cardSmall';
import buttonImage from '../../components/buttonImage';
import textQuill from '../../components/textQuill';

  export default {
  name: 'pageCharacter',
  components: {menuBarDaggerheart, tabsResponsive, buttonBig, cardSmall, dataTableSelection, buttonImage, textQuill, cardImageButton, cardArmor, cardWeapon, cardCharacter},
  data: () => ({
    tab: 0,
    tabs: "ASCENDENCE,COMMUNAUTE,CLASSE,SOUS CLASSE,CARACTERISTIQUES,DOMAINS,ARMURE,ARMES,HISTOIRE,PERSONNAGE".split(','),
    images: null,
    class: null,
    armors: null,
    weapons:null,
    character : {url:'', image_position:'0px 0px', class:{name:''}, domains:[], weapons:[], allowedDomains:["",""], image:require('@/assets/Daggerheart/other/character.png')},
    headers: [
          { text: 'Arme', value: 'nom' },
          { text: 'Trait', value: 'trait' },
          { text: 'Portée', value: 'portee' },
          { text: 'Dégâts', value: 'degats' },
          { text: 'Type', value: 'type_de_degats' },
          { text: 'Mains', value: 'hands' },
          { text: 'Caractéristiques', value: 'caracteristique', isHtml:true }
    ],
    selected: [],
    templateImage: null
  }),
  async mounted(){
    const ascendences = serviceDaggerheart.ascendences.map(x=> {return {name:x, image:require('@/assets/Daggerheart/Cartes/Ascendances/' + x +'.png')};});
    const communautes = serviceDaggerheart.communautes.map(x=> {return {name:x, image:require('@/assets/Daggerheart/Cartes/Communautes/' + x +'.png')};});
    this.class = await serviceDaggerheart.getAllClass();
    this.class.forEach(x=> {
        x.basic= require('@/assets/Daggerheart/Cartes/ClassesExplications/' + x.name.toLowerCase() +'.png');
        x.details= require('@/assets/Daggerheart/Cartes/Classes/' + x.name.toLowerCase() +'.png');
    });
    let classes = this.class;
    const sousClasses = serviceDaggerheart.sousClasses.map(x=> {return {name:x, image:require('@/assets/Daggerheart/Cartes/SousClasses/' + x +'.png')};});
    const domaines = serviceDaggerheart.domaines.map(x=> {return {name:x, image:require('@/assets/Daggerheart/Cartes/Domaines3/' + x )};});
    this.images = {ascendences, communautes, classes, sousClasses, domaines };
    this.armors = serviceDaggerheart.getArmors();
    this.weapons = {all : serviceDaggerheart.getWeapons()};
    this.weapons.primaryPhy = this.weapons.all.filter(x=> x.primary && x.type_de_degats == "Phy");
    this.weapons.primaryMag = this.weapons.all.filter(x=> x.primary && x.type_de_degats == "Mag");
    this.weapons.secondary = this.weapons.all.filter(x=> !x.primary);
    this.loadFromUrl();
  },
  methods: {
    nextStep(){
        this.selectStep(this.tab+1);    
    },
    selectStep(step){
        if(step > 2 && !this.character.class.name){
            return;
        }
        if(step == this.tabs.length-1){
            this.refreshUrl();
            this.character.resume = `<p>${serviceBack.getUrlFront()}${this.character.url}</p><p></p><p><b>${this.camelCase(this.character.name)}</b> Niveau 1</p><p><b>Agilité:</b>${this.character.agilite} <b>Force:</b>${this.character.force} <b>Finesse:</b>${this.character.finesse} <b>Instinct:</b>${this.character.instinct} <b>Présence:</b>${this.character.presence} <b>Savoir:</b>${this.character.savoir}</p><p><b>Experiences : </b>${this.character.experience1}, ${this.character.experience2}</p><p></p><p>Questions pour l'histoire du personnage :</p>`;
            
            this.character.class.questions_de_fond.forEach((obj, index) => this.character.resume+= `<p>${obj}</p>`);
            this.character.class.connexions.forEach((obj, index) => this.character.resume+= `<p>${obj}</p>`);
            this.refreshCard();
        }
        this.tab = step;
        window.scrollTo(0,0);
        this.refreshUrl();
    },
    refreshUrl(){
        const properties = [
            {name:"ancestry", properties:"ancestry.name"},
            {name:"community", properties:"community.name"},
            {name:"community", properties:"class.id"},
            {name:"subclass", properties:"subclass.name"},
            {name:"traits", properties:"traits"},
            {name:"domains", properties:"domains.map.name"},
            {name:"armor", properties:"armor.id"},
            {name:"weapons", properties:"weapons.map.id"},
            {name:"name", properties:"name"},
            {name:"xp1", properties:"experience1"},
            {name:"xp2", properties:"experience2"}
        ];
        this.character.url= 'character?' + properties.map(x=> x.name + '=' + this.getProperty(x.properties.split('.'))).join('&');
    },
    loadFromUrl(){
        let uri = window.location.href;
        uri = uri.substring(uri.indexOf('?')+1);
        const properties = uri.split('&');
        let traits = '';
        if(properties.length < 2)
            return;
        for (let i = 0; i < properties.length; i++) {
            const data = properties[i].split('=');
            const value=data[1];
            if(value && value!= '_'){
                if(i==0) this.character.ancestry = this.images.ascendences.find(x=> x.name == value);
                else if(i==1) this.character.community = this.images.communautes.find(x=> x.name == value);
                else if(i==2) {
                    this.character.class = this.class.find(x=> x.id == value); 
                    this.character.allowedDomains = this.character.class.domains.split(' et ');
                }
                else if(i==3) this.character.subclass = this.images.sousClasses.find(x=> x.name == value);
                else if(i==4) traits = value;
                else if(i==5) this.character.domains = this.images.domaines.filter(x=> value.split('_').includes(x.name));
                else if(i==6) this.character.armor = this.armors.find(x=> x.id == value);
                else if(i==7) this.character.weapons = this.weapons.all.filter(x=> value.split('_').includes(x.id));
                else if(i==8) this.character.name = value.replaceAll("%20"," ");
                else if(i==9) this.character.experience1 = value.replaceAll("%20"," ");
                else if(i==10) this.character.experience2 = value.replaceAll("%20"," ");
            }
        }
        if(traits)
            'agilite,force,finesse,instinct,presence,savoir'.split(',').forEach((x,index)=> this.character[x]=traits[index].replace("3","-1"));
        const tab = [
            this.character.ancestry, this.character.community, this.character.class.id, this.character.subclass, 
            traits, this.character.domains, this.character.armor, this.character.weapons, this.character.name
        ].filter(x=> x).length;
        this.selectStep(tab);
    },
    getProperty(properties){
        if(properties=='traits')
            return 'agilite,force,finesse,instinct,presence,savoir'.split(',').map(x=> this.getTraitValue(this.character[x])).join('');
        
        let result = this.character;
        while(properties.length > 0 && result){
            let property = properties.shift();
            if(property == 'map'){
                property = properties.shift();
                return result.map(x=> x[property]).join('_')
            }
            result = result[property];
        }
        return result ?? '_';
    },
    getTraitValue(result){return result ==-1 ? 3 : result;},
    selectAncestry(obj){
        this.character.ancestry = obj;
        this.nextStep();
    },
    selectCommunity(obj){
        this.character.community = obj;
        this.nextStep();
    },
    selectClass(obj){
        this.character.class = obj;
        this.character.allowedDomains = obj.domains.split(' et ');
        const caracs = "agilite,force,finesse,instinct,presence,savoir"
            .split(',')
            .forEach((x, i) => this.character[x]=parseInt(obj.caracteristique[i].replace("3","-1")));
        this.nextStep();
    },
    selectSubClass(obj){
        this.character.subclass = obj;
        this.nextStep();
    },
    selectDomain(obj){
        obj.selected = !obj.selected;
        if(obj.selected)
            this.character.domains.push(obj);
        else
            this.character.domains = this.character.domains.filter(x=> x.name !== obj.name);
        if(this.character.domains.length > 1)
            this.nextStep();
    },
    getDomains(){
        return this.images.domaines.filter(x=> x.name.startsWith(this.character.allowedDomains[0].substring(0,4)) || x.name.startsWith(this.character.allowedDomains[1].substring(0,4)));
    },
    getCharacterDomains(){return this.character.domains.map(x=> x.name);},
    selectArmor(obj){
        this.character.armor = obj;
        this.nextStep();
    },
    selectWeapons(obj){
        if(!this.character.weapons.map(x=> x.id).includes(obj.item.id))
            this.character.weapons.push(obj.item);
        else
            this.character.weapons = this.character.weapons.filter(x=> x.id !== obj.item.id);
        if(this.character.weapons.length > 1)
            this.nextStep();
    },
    getSuggestedWeapons(){ return this.character.class && this.character.class.arme_suggeree && this.character.class.arme_suggeree.split(',');},
    setImage(image){
        this.character.image = image;
        this.refreshCard();
    },
    finish(){
        this.refreshUrl();
        window.location.href = this.character.url;
    },
    camelCase(text){return text[0].toUpperCase() + text.substring(1)},
    async refreshCard(){   
        this.templateImage = null;    
        await new Promise(resolve => setTimeout(resolve, 1000)); 
        if(!this.$refs.CardTemplate)
            return;
        const canvas = await html2canvas(this.$refs.CardTemplate);
        const dataURL = canvas.toDataURL('image/png');
        this.templateImage = dataURL;
    }
   }
  };
  </script>