<template>
  <div>
    <hierarchy class="bg" :items="hierarchyArray" @select="selectHierarchy"></hierarchy>
    <!-- Create One or multiple cards -->
    <div v-if="choice == 0">
      <div class="flex flex-row">
        <v-btn style="height:500px; width:40%; margin:20px;" @click="selectChoice(1)">
          <p>Créer une seule carte</p>
          <v-icon dark>
            mdi-plus
          </v-icon>
        </v-btn>
        <v-btn style="height:500px; width:40%; margin:20px;" @click="selectChoice(3)">
          <p>Créer une multitude de carte</p>
          <v-icon dark>
            mdi-plus
          </v-icon>
        </v-btn>
      </div>
    </div>

    <!-- Select a template -->
    <div v-if="choice == 1">
      <h4>Choisir un template</h4>
      <img v-for="(image, index) in templateImages" :key="'templateImg' + index" :src="image"
        @click="selectTemplate(index)" class="m5px" style="width:340px; margin:10px" />
    </div>

    <!-- Create one card -->
    <div v-if="choice == 2">
      <div class="flex flex-responsive">
        <div class="w100p">
          <h4>Créer une carte</h4>
          <p class="m5px">Voici le modèle permettant de définir la carte. La première ligne est dédiée à indiquer le nom
            du modèle. Ensuite, chaque ligne correspond à un texte ou une image, avec la possibilité de spécifier des
            paramètres CSS pour personnaliser leur apparence.</p>
          <v-textarea filled label="Template" auto-grow v-model="templateText"></v-textarea>

          <p class="m5px">Les textes de la carte doivent être indiqués ci-dessous séparés par ";"</p>
          <v-textarea filled label="Données  fictives pour tester le template" auto-grow
            v-model="templateValue"></v-textarea>

          <p class="m5px">Voici les images utilisées sur la carte</p>
          <div class="flex flex-wrap">
            <div v-for="index in images.length + 1" :key="'ImageAdd' + index">
              <div class="flex" style="border:1px black solid; width:278px;margin:5px; overflow: hidden;">
                <img style="width:80px; height: 80px; object-fit: cover; background:#F0F0F0; padding:5px"
                  :src="images[index - 1]">
                <div>
                  <input style="width:238px;" type="file" @change="uploadImage($event, index - 1)" />
                  <v-btn v-if="images.length > index - 1" class="s40 m5px" @click="removeImage(index - 1)">
                    <v-icon> mdi-close</v-icon> Supprimer
                  </v-btn>
                </div>
              </div>
            </div>
          </div>

        </div>
        <div>
          <!-- Div Card-->
          <h4 style="height:70px" v-if="$vuetify.breakpoint.width > 800"></h4>
          <p class="m5px text-center">L'image au format html</p>
          <div :key="refreshCard">
            <div ref="CardTemplate" style="width:350px" class="container" v-for="template in getTemplate()"
              :key="'Template' + template.name">

              <img v-for="(image, index) in template.images" :key="'TemplateImage' + index" class="overlay-image"
                :src="image.image" :style="image.style" />

              <div class="background-image" :style="template.backgroundStyle">

                <div v-for="(text, index) in template.texts" :key="'TemplateText' + index" class="text"
                  :style="text.style" v-html="template.values[index]"></div>

              </div>
            </div>
          </div>

          <!-- Image Card-->
          <p class="m5px text-center">L'image au format png</p>
          <img v-if="templateImage" style="width:340px" :src="templateImage" />
          <v-progress-circular class="center w100p" v-else indeterminate></v-progress-circular>

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

<style scoped>
.text {
  position: absolute;
  font-family: system-ui;
  color: black;
  text-align: left;
}

p {
  margin-bottom: 0px !important;
}

.container {
  width: 340px;
  height: 476px;
  position: relative;
  padding: 0px;
  overflow: hidden;
}

.background-image {
  width: 340px;
  height: 100%;
  background-size: cover;
  object-fit: cover;
  position: relative;
  z-index: 2;
}

.overlay-image {
  position: absolute;
  object-fit: cover;
  background-size: cover;
  width: 336px;
  height: 244px;
  z-index: 1;
}
</style>

<script>
  import ServiceTemplate from '../services/serviceTemplate'
  import html2canvas from 'html2canvas';
  import hierarchy from '../components/hierarchy';
  
  export default {
  name: 'pageTemplate',
  components: {hierarchy},
  data: () => ({
    choice:0,
    templateImages: null,
    refreshCard:0,
    hierarchyArray: [{Id:0, Text:'Création'}],
    templates: [
      {
        name:"Ancestry", 
        template:"Template Ancestry\ntext font-family:system-ui font-weight:bold font-size:30px top:190px left:40px text-transform:uppercase\ntext color:black font-size:11px top:235px left:15px\nimage top:2px left:2px right:2px",
        values:"Elf;<p><i>Les Elfes sont généralement des humanoïdes grands avec des oreilles pointues et des sens extrêmement aiguisés.</i><br><br><strong>Transe spirituelle :</strong> Pendant un repos, vous pouvez entrer en transe et effectuer une action supplémentaire de temps d'arrêt.<br><br><strong>Réactions Rapides :</strong> Vous pouvez marquer un Stress pour bénéficier d'un avantage sur un Jet de Réaction.</p>",
        images:[require('@/assets/Daggerheart/template/CardAncestry.png'), require('@/assets/Daggerheart/ancestry/elf.jpg')]
      },
      {
        name:"Community", 
        template:"Template Community\ntext font-family:system-ui font-weight:bold font-size:20px top:245px left:40px text-transform:uppercase\ntext color:black font-size:12px top:275px left:15px\nimage top:2px left:2px right:2px",
        values:"Communauté côtière;<p><i>Faire partie d'une communauté côtière signifie que vous avez vécu sur ou près d'une grande étendue d'eau.</i><br><br><strong>Connaissance de la Marée</strong> : Vous pouvez sentir le flux et le reflux de la vie. Lorsque vous lancez un jet avec la Peur, placez un jeton sur cette carte. Vous pouvez conserver un nombre de jetons égal à votre Niveau. Avant de faire un jet d'action, vous pouvez dépenser un ou plusieurs de ces jetons pour les ajouter comme modificateurs de +1 à votre jet. &Agrave; la fin d'une session, défaussez tous les jetons non utilisés.</p>",
        images:[require('@/assets/Daggerheart/template/CardCommunity.png'), require('@/assets/Daggerheart/community/seaborne.jpg')]
      },
      {
        name:"Class", 
        template:"Template Class\ntext font-family:system-ui font-weight:bold font-size:14px top:173px left:120px right:120px text-align:center color:white text-transform:uppercase\ntext color:black font-size:10px top:198px left:15px\ntext top:455px font-size:10px text-align:center left:15px right:15px\nimage top:-20px left:2px right:2px\nimage top:2px left:20px width:70px height:118px",
        values:"Magicien;<p><strong>Prestidigitation :</strong> Vous pouvez effectuer des effets magiques subtils et inoffensifs à volonté. Par exemple, vous pouvez changer la couleur d'un objet, créer une odeur, allumer une bougie, faire flotter un petit objet, éclairer une pièce ou réparer un petit objet.<br><strong>Schémas étranges :</strong> Choisissez un nombre entre 1 et 12. Chaque fois que vous obtenez ce nombre sur un dé de Dualité, gagnez un Espoir ou éliminez un Stress. Vous pouvez changer ce nombre lorsque vous terminez un long repos.<br><strong>Espoir de magicien :</strong> Dépensez trois points d'Espoir au lieu de marquer votre dernier point de vie.</p>;<p><b>Évasion : </b> 10, <b>Seuil de dégâts : </b> Majeur 5 / Sévère 10</p>",
        images:[require('@/assets/Daggerheart/template/CardClass.png'), require('@/assets/Daggerheart/class/wizard.jpg'), require('@/assets/Daggerheart/class/wizard-banner.webp')]
      },
      {
        name:"Domain", 
        template:"Template Domain\ntext font-weight:bold font-size:14px top:228px left:120px right:120px text-align:center color:white text-transform:uppercase\ntext font-weight:bold font-size:20px top:250px text-align:center  text-transform:uppercase right:20px left:20px\ntext color:black font-size:30px top:15px color:white left:45px font-weight:bold\ntext font-weight:bold font-size:21px top:20px right:26px color:white\ntext font-size:11px top:275px left:15px right:15px\ntext top:455px font-size:10px text-align:right right:15px\nimage top:2px left:2px right:2px\nimage top:2px left:20px width:70px height:118px\nimage top:20px right:20px width:35px height:35px",
        values:"Habilité;Riposte;1;2;<p>Lorsque vous subissez des dégâts d'une créature en mêlée, vous pouvez marquer un Stress pour infliger immédiatement des dégâts d'arme à la créature à moitié de votre Maîtrise (arrondi à l'unité supérieure).</p>;<b>Domaines : </b> Lame",
        images:[require('@/assets/Daggerheart/template/CardDomain.png'), require('@/assets/Daggerheart/domain/blade.jpg'), require('@/assets/Daggerheart/domain/banner-blade.webp'), require('@/assets/Daggerheart/other/cost.webp')]
      }
    ],
    templateText: "",
    templateValue : "",
    images: [],
    showOrigin: true,
    templateImage: null
  }),
  async mounted(){    
    this.templateImages = "Ascendances/elfe,Communautes/cotiere,Classes/magicien,Domaines/LameRiposte"
      .split(",").map(x=> require('@/assets/Daggerheart/Cartes/' + x +'.png'));
  },
  methods: {
    selectHierarchy(item){
      this.hierarchyArray = this.hierarchyArray.filter(x=> x.Id <= item.Id);
      if(item.Id <1) this.selectChoice(0);
      if(item.Id <2) this.selectChoice(1);
    },
    selectChoice(value){
      this.choice = value;
      if(value==0) this.hierarchyArray = [{Id:0, Text:'Création'}];
      if(value==1) this.hierarchyArray = [{Id:0, Text:'Création'}, {Id:1, Text:'Choix du template'}];
      if(value==3) {
        alert("Cette fonctionnalité n'est pas encore disponible");
        this.choice = 0;
      }
    },
    selectTemplate(templateIndex){
      const template = this.templates[templateIndex];
      this.templateText=template.template;
      this.templateValue=template.values;
      this.images= template.images;
      this.choice = 2;
      this.hierarchyArray = [{Id:0, Text:'Création'}, {Id:1, Text:'Choix du template'}, {Id:2, Text:'Template ' + template.name}];
    },
    uploadImage(e, index) {
      const file = e.target.files[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if(this.images.length > index){
            this.images[index] = event.target.result;
            this.refreshCard++;
          } else if(this.images.length == index)
            this.images.push(event.target.result);
        };
        reader.readAsDataURL(file);
      }
    },
    removeImage(index){
      this.images =  [...this.images.slice(0, index), ...this.images.slice(index + 1)];
    },
    getTemplate(){
      let result = ServiceTemplate.create(this.templateText, this.templateValue, this.images);
      setTimeout(() => this.generateTemplateCard(), 1);      
      return [result];
    },
    async generateTemplateCard(){
      const canvas = await html2canvas(this.$refs.CardTemplate[0]);
      const dataURL = canvas.toDataURL('image/png');
      this.templateImage = dataURL;
    }
  }
  };
  </script>