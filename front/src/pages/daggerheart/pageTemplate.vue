<template>
  <div class="">
    <menu-bar-daggerheart>
    </menu-bar-daggerheart>
    <hierarchy class="bg" :items="hierarchyArray" @select="selectHierarchy"></hierarchy>
    <!-- Create One or multiple cards -->
    <div v-if="choice == 0">
      <div class="flex flex-responsive flex-space-around">

        <button-big text="Créer une seule carte" @click="selectChoice(1)"
          :image="require('@/assets/Daggerheart/other/singleCard.png')"></button-big>
        <button-big text="Créer une multitude de carte" @click="selectChoice(3)"
          :image="require('@/assets/Daggerheart/other/multipleCards.png')"></button-big>

      </div>
    </div>

    <!-- Create Multiple cards -->
    <div v-if="choice == 3">
      <h4>Créer une multitude de cartes</h4>
      <p class="m10px">Le bouton suivant permet de télécharger cette archive : Ancestries.zip. Elle contient un fichier
        daggerheart.csv et des images. Aprés avoir dézippé le fichier, il faut insérer les images puis le fichier csv.</p>
      <div class="flex flex-wrap">

        <a href="/api/daggerheartCsv">
          <v-btn class="m5px bg">
            Télécharger Ancestries.zip
          </v-btn>
        </a>
        <a href="/api/daggerheartCsv/csv">
          <v-btn class="m5px bg">
            Télécharger uniquement le CSV
          </v-btn>
        </a>
      </div>


      <div class="flex">
        <div>
          <h4>Données CSV</h4>
          <input class="m5px" type="file" @change="uploadCsv" accept=".csv" />
        </div>
        <div class="w100p">
          <h4>Images</h4>
          <div class="m5px">

            <input type="file" multiple @change="uploadImages" accept="image/*">
            <div v-if="csvImages">
              <div class="flex flex-wrap">
                <div v-for="(obj, index) in csvImages" :key="index" class="image-preview">
                  <img :src="obj.value" alt="Image preview" style="width: 20px; height: auto; margin:2px;" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <v-progress-linear :value="loadingCard"></v-progress-linear>

      <div class="bg" v-if="templatesCardImages && templatesCardImages.length > 0">
        <div class="flex flex-wrap">

          <img style="width:340px; object-fit:cover" v-for="(image, index) in templatesCardImages"
            :key="'templatesCardImages' + index" :src="image" />
        </div>
      </div>
      <div style="position:fixed; bottom:-10px; z-index: -1;" :key="refreshCdvCards" class="flex flex-wrap">
        <div v-for="(obj, index) in csv" :key="'cardTemplate' + index" ref="CardTemplateMultiple">
          <card-template :template="obj.template" :values="obj.values"></card-template>
        </div>
      </div>

    </div>

    <!-- Select a template -->
    <div v-if="choice == 1">
      <h4>Choisir un template</h4>
      <div class="flex flex-wrap">
        <button-big v-for="(template, index) in templateImages" :key="'templateImg' + index" :text="template.name"
          @click="selectTemplate(template.name, index)" :image="template.value">
        </button-big>
      </div>
    </div>

    <!-- Create one card -->
    <div v-if="choice == 2">
      <div class="flex flex-responsive">
        <div class="w100p">
          <h4>Créer une carte</h4>

          <!-- Set Template-->
          <div>
            <v-expand-transition>
              <div v-if="setTemplate">
                <p class="m5px">Voici le modèle permettant de définir la carte. La première ligne est dédiée à indiquer
                  le nom du modèle. Ensuite, chaque ligne correspond à un texte ou une image, avec la possibilité de
                  spécifier des paramètres CSS pour personnaliser leur apparence.</p>
                <v-textarea filled label="Template" auto-grow v-model="templateText"></v-textarea>
                <div class="flex flex-reverse">
                  <v-btn class="bg2 s40 m5px" @click="setTemplate = false">
                    <v-icon> mdi-close</v-icon> Fermer la modification de modèle
                  </v-btn>
                </div>
              </div>
            </v-expand-transition>
          </div>
          <div class="flex flex-reverse">
            <v-btn v-if="!setTemplate" class="bg2 s40 m5px" @click="setTemplate = true">
              <v-icon> mdi-edit</v-icon> Modifier le modèle de la carte
            </v-btn>
          </div>

          <!-- Texts -->
          <p style="margin-left:5px; margin-top:-25px">Voici les textes utilisées sur la carte</p>
          <div v-for="index in texts.length" :key="'TextAdd' + index">
            <text-quill class="w100p" :text="texts[index - 1]" @change="setText(index, $event)" :textarea="true">
            </text-quill>
          </div>
          <br>
          <br>

          <!-- Images -->
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
            <div ref="CardTemplate" class="containerCard" v-for="template in getTemplate()"
              :key="'Template' + template.name">

              <div v-for="(image, index) in template.images" :key="'TemplateImage' + index" class="overlay-image"
                :style="image.style"></div>

              <div class="background-image" :style="template.backgroundStyle">

                <div v-for="(text, index) in template.texts" :key="'TemplateText' + index" class="text"
                  :style="text.style" v-html="getText(index)"></div>

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

.containerCard {
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
  position: relative;
  z-index: 2;
}

.overlay-image {
  position: absolute;
  background-size: cover;
  background-position: center;
  width: 336px;
  height: 244px;
  z-index: 1;
}

.quill-editor {
  min-height: 200px;
  background-color: white;
}

p {
  margin-bottom: 0px !important;
}

.text p {
  margin-bottom: 0px !important;
}
</style>

<script>
  import html2canvas from 'html2canvas';
  import ServiceTemplate from '../../services/serviceTemplate';
  import serviceDaggerheart from '../../services/serviceDaggerheart';
  
  import menuBarDaggerheart from '../../components/menuBarDaggerheart';
  import hierarchy from '../../components/hierarchy';
  import buttonBig from '../../components/buttonBig';
  import textQuill from '../../components/textQuill';
  import cardTemplate from '../../components/cards/cardTemplate';
  
  export default {
  name: 'pageTemplate',
  components: {menuBarDaggerheart, hierarchy, buttonBig, textQuill, cardTemplate},
  data: () => ({
    choice:0,
    templateImages: null,
    refreshCard:0,
    hierarchyArray: [{Id:0, Text:'Création'}],
    templates: null,
    templateText: "",
    images: [],
    texts: [],
    setTemplate: false,
    templateImage: null,
    csvFile:null,
    csv:null,
    csvImages: [],
    templatesCardImages : null,
    refreshCdvCards:0,
    loadingCard:0
  }),
  async mounted(){    
    this.templates = serviceDaggerheart.templates;
    this.templateImages = [
      {name:"Ascendance", value:"Ascendances/elfe"},
      {name:"Communauté", value:"Communautes/cotiere"},
      {name:"Classe", value:"Classes/magicien"},
      {name:"Sous Classe", value:"SousClasses/DruideGardienDesElements"},
      {name:"Domaine", value:"Domaines/LameRiposte"}
    ].map(x=> { return {name:x.name, value:require('@/assets/Daggerheart/Cartes/' + x.value +'.png')};});
  },
  methods: {
    selectHierarchy(item){
      this.hierarchyArray = this.hierarchyArray.filter(x=> x.Id <= item.Id);
      if(item.Id == 0) this.selectChoice(0);
      if(item.Id == 1) this.selectChoice(1);
    },
    selectChoice(value){
      this.choice = value;
      if(value==0) this.hierarchyArray = [{Id:0, Text:'Création'}];
      if(value==1) this.hierarchyArray = [{Id:0, Text:'Création'}, {Id:1, Text:'Choix du Modèle'}];
    },
    selectTemplate(name, templateIndex){
      const template = this.templates[templateIndex];
      this.templateText=template.template;
      this.texts= [...template.texts, "<p> </p>"];
      this.images= template.images;
      this.choice = 2;
      this.hierarchyArray = [{Id:0, Text:'Création'}, {Id:1, Text:'Choix du Modèle'}, {Id:2, Text:'Template ' + name}];
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
      let result = ServiceTemplate.create(this.templateText, this.images);
      setTimeout(() => this.generateTemplateCard(), 1);
      this.removeUselessText();
      return [result];
    },
    getText(index){return this.texts[index].replaceAll("<p>", "<p class='mp0px'>");},
    setText(index,value){
      this.texts[index-1]=value;
      this.refreshCard++;
    },
    removeUselessText(){
      while(this.isEmptyText(this.texts[this.texts.length-2]))
        this.texts =  [...this.texts.slice(0, this.texts.length-2), ...this.images.slice(this.texts.length-1)];
      if(this.texts[this.texts.length-1] != "<p> </p>")
        this.texts.push("<p> </p>");
    },
    isEmptyText(text){
      return !text || text.replaceAll("<p>", "").replaceAll("</p>", "").replaceAll("undefined","").replaceAll("<br>", "").trim().length < 1;
    },
    async generateTemplateCard(){
      const canvas = await html2canvas(this.$refs.CardTemplate[0]);
      const dataURL = canvas.toDataURL('image/png');
      this.templateImage = dataURL;
    },
    uploadCsv(event){
      const file = event.target.files[0]; 
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => this.refreshMultipleCards(e.target.result)
        reader.readAsText(file);
      }
    },
    async uploadImages(event) {
      /*const images = [];
      Array.from(event.target.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = e => {
          images.push(e.target.result);
        };
        reader.readAsDataURL(file);
      });
      this.csvImages= images;
      setTimeout(() => {
        this.refreshMultipleCards();  
      }, 1000);*/
      this.csvImages = await Promise.all(Array.from(event.target.files).map(file => this.readFileAsDataURL(file)));
      this.refreshMultipleCards();  
      
    },
    readFileAsDataURL(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => {
          resolve({key:file.name, value:e.target.result});
        } 
        reader.readAsDataURL(file); 
      });
    },
    refreshMultipleCards(csv){
      if(csv)
        this.csvFile = csv;
      this.csv = ServiceTemplate.parseCSV(this.csvFile, this.csvImages);
      this.refreshCdvCards++;
      setTimeout(() => this.convertMultipleCardToImages(), 1000);
      
    },
    async convertMultipleCardToImages(){      
        const images = [];
        if(!this.$refs.CardTemplateMultiple || this.$refs.CardTemplateMultiple.length <0)
            return;
        
            const max = this.$refs.CardTemplateMultiple.length;
        for(let i=0; i< max; i++){          
          const image = await this.turnDivToImage(this.$refs.CardTemplateMultiple[i]);
          images.push(image);
          this.loadingCard = (i+1)*100/max;
        }
        
        this.templatesCardImages = images;
    },
    async turnDivToImage(div){
        const canvas = await html2canvas(div);
        const dataURL = canvas.toDataURL('image/png');
        return dataURL;
    }
  }
  };
  </script>