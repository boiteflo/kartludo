<template>
    <div class="bgWhite" :key="keyid + refreshComponent">    
      <table class="m5px" v-if="filterData">
        <tr>
          <td style="min-width:150px"><div class="m5px">Type de carte : </div></td>
          <td>
            <v-chip v-for="element in mainTypes"
              :key="keyid + element.Id" 
              :class="{m5px:true, bg2:filterData.type === element.Id, colorWhite:filterData.type === element.Id}"
              @click="selectType(element)">
              {{element.Name}}
            </v-chip>
          </td>
        </tr>
        <tr>
          <td><div class="m5px">Sous-Type : </div></td>
          <td>
            <v-chip v-for="element in subTypes"
              :key="keyid + element.Id" 
              :class="{m5px:true, bg2:filterData.subType === element.Id, colorWhite:filterData.subType === element.Id}"
              :disabled="!filterData.type || (filterData.type && !element.Parent.includes(filterData.type))"
              @click="selectSubType(element)">
              {{element.Name}}
            </v-chip>
          </td>
        </tr>
        <tr>
          <td><div class="m5px">Attributs: </div></td>
          <td>
            <v-chip v-for="element in attributes"
              :key="keyid + element.Id" 
              :class="{m5px:true, bg2:filterData.attribute === element.Id, colorWhite:filterData.attribute === element.Id}"
              :disabled="!filterData.type || (filterData.type && filterData.type !== 'Monster') || (currentSubType && !currentSubType.Parent.includes('Monster'))"
              @click="selectAttribute(element)">
              {{element.Name}}
            </v-chip>
          </td>
        </tr>
        <tr>
          <td><div class="m5px">Races: </div></td>
          <td>
            <v-chip v-for="element in races"
              :key="keyid + element.Id" 
              :class="{m5px:true, bg2:filterData.race === element.Id, colorWhite:filterData.race === element.Id}"
              :disabled="!filterData.type || (filterData.type && filterData.type !== 'Monster') || (currentSubType && !currentSubType.Parent.includes('Monster'))"
              @click="selectRace(element)">
              {{element.Name}}
            </v-chip>
          </td>
        </tr>
        <tr>
          <td><div class="m5px">Limitation: </div></td>
          <td>
            <v-chip v-for="element in limited"
              :key="keyid + element.Id" 
              :class="{m5px:true, bg2:filterData.limitation === element.Id, colorWhite:filterData.limitation === element.Id}"
              :disabled="element.Disabled"
              @click="selectLimitation(element)">
              {{element.Name}}
            </v-chip>
          </td>
        </tr>
        <tr v-if="false">
          <td><div class="m5px">Texte dans l'effet </div></td>
          <td>
            <v-text-field disabled v-model='searchEffect' label="Texte dans l'effet (en anglais)"></v-text-field>
          </td>
        </tr>
        <tr>
          <td><div class="m5px" style="margin-top:-10px !important">Cartes affichées </div></td>
          <td class="flex">
            <v-chip class="bg2 colorWhite">{{filterData.limit}}</v-chip>
            <v-slider :min="1" :max="3200" v-model="filterData.limit"></v-slider>
          </td>
        </tr>
        <tr>
          <td><div class="m5px" style="margin-top:-20px !important">Taille Images </div></td>
          <td class="flex">
            <v-chip class="bg2 colorWhite">{{filterData.imageWidth}}</v-chip>
            <v-slider :min="60" :max="650" v-model="filterData.imageWidth"></v-slider>
          </td>
        </tr>

        <tr>
          <td></td>
          <td>
            <v-btn class="m5px" @click="$emit('hide')">Annuler</v-btn>
            <v-btn class="m5px bg" @click="$emit('filter', getFilter())">Valider</v-btn>
          </td>
        </tr>
      </table>
    </div>
</template>

<script>
  export default {
    name: 'panel-card-filter',
    props: ['keyid', 'filter'],
    data: () => ({
        filterData: null,
        currentSubType: null,
        refreshComponent: 0,
        mainTypes : [{Id:'Monster', Name:'Monstre'},{Id:'Spell', Name:'Magie'},{Id:'Trap', Name:'Piège'}],
        subTypes : [
          {Id:'Counter', Name:'Contre', Parent:'Trap'},
          {Id:'Continuous', Name:'Continue', Parent:'Spell,Trap'},
          {Id:'Quick-Play', Name:'Jeu-Rapide', Parent:'Spell'},
          {Id:'Equip', Name:'Equipement', Parent:'Spell'},
          {Id:'Field', Name:'Terrain', Parent:'Spell'},
          {Id:'Normal', Name:'Normal', Parent:'Monster,Spell,Trap'},
          {Id:'Ritual', Name:'Rituel', Parent:'Monster, Spell'},
          {Id:'Effect', Name:'Effet', Parent:'Monster'},
          {Id:'Fusion', Name:'Fusion', Parent:'Monster'},
          {Id:'Flip', Name:'Flip', Parent:'Monster'},
          {Id:'Gemini', Name:'Gemini', Parent:'Monster'},
          {Id:'Union', Name:'Union', Parent:'Monster'},
          {Id:'Toon', Name:'Toon', Parent:'Monster'},
          {Id:'Spirit', Name:'Esprit', Parent:'Monster'},
        ],
        attributes: [
          {Id:'DARK', Name:'Ténèbres'},
          {Id:'LIGHT', Name:'Lumière'},
          {Id:'EARTH', Name:'Terre'},
          {Id:'WATER', Name:'Eau'},
          {Id:'FIRE', Name:'Feu'},
          {Id:'WIND', Name:'Vent'},
          {Id:'DIVINE', Name:'Divin'}
        ],
        races: [
          {Id:'Winged Beast', Name:'Bête Ailée'},
          {Id:'Aqua', Name:'Aqua'},
          {Id:'Plant', Name:'Plante'},
          {Id:'Rock', Name:'Rocher'},
          {Id:'Dragon', Name:'Dragon'},
          {Id:'Spellcaster', Name:'Magicien'},
          {Id:'Fiend', Name:'Démon'},
          {Id:'Thunder', Name:'Tonnerre'},
          {Id:'Divine-Beast', Name:'Bête Divine'},
          {Id:'Warrior', Name:'Guerrier'},
          {Id:'Dinosaur', Name:'Dinosaure'},
          {Id:'Fairy', Name:'Elfe'},
          {Id:'Machine', Name:'Machine'},
          {Id:'Zombie', Name:'Zombie'},
          {Id:'Beast', Name:'Bête'},
          {Id:'Pyro', Name:'Pyro'},
          {Id:'Fish', Name:'Poisson'},
          {Id:'Beast-Warrior', Name:'Bête-Guerrier'},
          {Id:'Reptile', Name:'Reptile'},
          {Id:'Sea Serpent', Name:'Serpent de Mer'},
          {Id:'Insect', Name:'Insecte'}
        ],
        limited: [
          {Id:'0', Name:'Bannie'},
          {Id:'1', Name:'Limitée'},
          {Id:'2', Name:'Semi-Limitée', Disabled:true},
          {Id:'K', Name:'Joker'},
        ]
    }),  
  mounted() {
    this.filterData = this.filter;
    this.currentSubType= !this.filter.subType ? null : this.subTypes.find(x=> x.Id=== this.filter.subType);
  },
    methods : {
      selectType(element){      
        if(element.Id ==this.filterData.type){
          this.filterData.type = null;
          return;
        }

        this.filterData.type = element.Id;

        if(this.currentSubType && !this.currentSubType.Parent.includes(this.filterData.type))
        {
          this.currentSubType = null;
          this.filterData.subType = null;
        }

        if(this.filterData.type.Id !== 'Monster'){
          this.filterData.attribute = null;
          this.filterData.race = null;
        }
      },
      selectSubType(element){
        if(element.Id ==this.filterData.subType){
          this.filterData.subType = null;
          this.currentSubType = null;
          return;
        }
        
        this.filterData.subType = element.Id;
        this.currentSubType = element;
        
        if(!this.currentSubType.Parent.includes('Monster')){
          this.filterData.attribute = null;
          this.filterData.race = null;
        }
      },
      selectAttribute(element){
        if(element.Id === this.filterData.attribute)
          this.filterData.attribute = null;
        else
          this.filterData.attribute = element.Id;
      },
      selectRace(element){
        if(element.Id === this.filterData.race)
          this.filterData.race = null;
        else
          this.filterData.race = element.Id;
      },
      selectLimitation(element){
        if(element.Id === this.filterData.limitation)
          this.filterData.limitation = null;
        else
          this.filterData.limitation = element.Id;
        this.refreshComponent++;
      },
      getFilter(){
        const isSubTypeMonster = this.filterData.type && this.filterData.type === 'Monster' && this.currentSubType;
        const isSubTypeSpellTrap = this.filterData.type && this.filterData.type !== 'Monster' && this.currentSubType;

        return {
          type : this.filterData.type ? this.filterData.type : null,
          magicTrapType:isSubTypeSpellTrap ? this.filterData.subType: null,
          monsterType : isSubTypeMonster ? this.filterData.subType : null,
          attribute: this.filterData.attribute ? this.filterData.attribute : null,
          race : this.filterData.race ? this.filterData.race : null,
          searchEffect: this.searchEffect,
          limit: this.filterData.limit,
          limitation:this.filterData.limitation,
          subType : this.filterData.subType,
          imageWidth: this.filterData.imageWidth
        }
      },
    }
  }
</script>
