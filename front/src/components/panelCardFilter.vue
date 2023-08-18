<template>
    <div class="bgWhite">    
      <table class="m5px" v-if="filterData">
        <tr>
          <td style="min-width:170px"><div class="m5px">Nom de la carte</div></td>
          <td>
            <v-text-field class="flex-grow"
                          v-model="filterData.search"
                          label="Chercher une carte (FR ou EN)">
            </v-text-field>
          </td>
        </tr>
        <tr>
          <td style="min-width:150px"><div class="m5px">Texte dans l'effet (EN)</div></td>
          <td>
            <v-text-field class="flex-grow"
                          v-model="filterData.searchEffect"
                          label="Chercher une carte (FR ou EN)">
            </v-text-field>
          </td>
        </tr>
        <tr>
          <td style="min-width:150px"><div class="m5px">Type de carte : </div></td>
          <td>
            <v-chip 
              :class="{m5px:true, bg2:filterData.showAll, colorWhite:filterData.showAll}"
              @click="setShowAll()">
              Tous
            </v-chip>
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
              :disabled="!filterData.type || (filterData.type && filterData.type !== 'Monster')"
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
              :disabled="!filterData.type || (filterData.type && filterData.type !== 'Monster')"
              @click="selectRace(element)">
              {{element.Name}}
            </v-chip>
          </td>
        </tr>
        <tr>
          <td><div class="m5px" style="margin-top:-20px !important">Niveau </div></td>
          <td class="flex">
            <v-slider :disabled="!filterData.type || (filterData.type && filterData.type !== 'Monster')"
              :min="1" 
              :max="Math.min(12,filterData.levelmax)" 
              v-model="filterData.levelmin">
            </v-slider>
            <v-chip class="bg2 colorWhite">{{filterData.levelmin}} - {{filterData.levelmax}}</v-chip>
            <v-slider :disabled="!filterData.type || (filterData.type && filterData.type !== 'Monster')"
              :min="Math.max(1,filterData.levelmin)" 
              :max="12" 
              v-model="filterData.levelmax">
            </v-slider>
          </td>
        </tr>
        <tr :key="refreshLimitation">
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
        <tr>
          <td><div class="m5px">Tri des cartes</div></td>
          <td>
            <v-chip v-for="element in sorts"
              :key="keyid + element.Id" 
              :class="{m5px:true, 
                bg2:filterData.sort.includes(element.Id),
                colorWhite:filterData.sort.includes(element.Id)
              }"
              @click="selectSort(element)">
              <v-icon v-if="filterData.sort.includes('>' +element.Id)" color="white">mdi-sort-ascending</v-icon> 
              <v-icon v-else-if="filterData.sort.includes('<' +element.Id)" color="blue">mdi-sort-descending</v-icon> 
              <v-icon v-else>mdi-sort-variant-off</v-icon>
              {{element.Name}}
            </v-chip>
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
            <v-btn class="m5px" @click="$emit('reset')">Réinitialiser les filtres</v-btn>
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
        refreshLimitation: 0,
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
        ],
        sorts : [
          {Id:'Type', Name:'Type', Order:'1'},
          {Id:'MonTyp', Name:'Type de Monstre', Order:'2'},
          {Id:'Level', Name:'Niveau', Parent:'Monster', Order:'3'},
          {Id:'Atk', Name:'ATK', Parent:'Monster', Order:'4'},
          {Id:'Def', Name:'DEF', Parent:'Monster', Order:'5'},
          {Id:'TcgRelease', Name:'Date', Order:'6'},
          {Id:'IdName', Name:'Nom', Order:'7'},
        ]
    }),  
  mounted() {
    this.filterData = this.filter;
    this.currentSubType= !this.filter.subType ? null : this.subTypes.find(x=> x.Id=== this.filter.subType);
  },
    methods : {
      setShowAll(){
          this.filterData.showAll = !this.filterData.showAll;
          this.selectType(null);
      },
      selectType(element){      
        if(!element || element.Id ==this.filterData.type){
          this.filterData.type = null;
          this.currentSubType = null;
          this.filterData.subType = null;
          this.filterData.attribute = null;
          this.filterData.race = null;
          return;
        }

        this.filterData.type = element.Id;
        this.filterData.showAll = false;

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
        this.refreshLimitation++;
      },
      selectSort(element){
        let array = this.filterData.sort.split(',');
        let alreadyExist = array.map(x=> x.substring(1)).indexOf(element.Id);
        if(alreadyExist < 0)
          array.push('>' + element.Id);
        else {
          if(array[alreadyExist].startsWith('>'))
            array[alreadyExist] = array[alreadyExist].replace('>','<');
          else if(array[alreadyExist] === '<IdName')
            array[alreadyExist] = array[alreadyExist].replace('<','>');
          else
            array = array.filter(x=> x.substring(1) !== element.Id);
        }

        let match = this.sorts
          .map(x=> {return {...x, sort:array.find(y=> y.substring(1) === x.Id)?.substring(0,1)};})
          .filter(x=> x.sort);
        this.filterData.sort = match.map(x=> x.sort + x.Id).join(',');
      },
      getFilter(){
        const isSubTypeMonster = this.filterData.type && this.filterData.type === 'Monster' && this.currentSubType;
        const isSubTypeSpellTrap = this.filterData.type && this.filterData.type !== 'Monster' && this.currentSubType;

        let result = { 
          ...this.filterData,
          magicTrapType:isSubTypeSpellTrap ? this.filterData.subType: null,
          monsterType : isSubTypeMonster ? this.filterData.subType : null
        };

        result.isActive =  (result.search && result.search.length > 0)
          || (result.searchEffect && result.searchEffect.length > 0)
          || (result.type && result.type.length > 0)
          || (result.limitation && result.limitation.length > 0)
          || result.showAll;

        return result;
      },
    }
  }
</script>
