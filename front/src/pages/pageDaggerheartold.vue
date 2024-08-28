<template>
  <div>
    <h1>Daggerheart</h1>
    <div v-if="showOrigin">

      <!-- Ancestry -->
      <!--
      <div class="flex flex-wrap m5px">
        <div v-for="card in cards.Ancestry" :key="'Ancestry' + card.name">
          <div ref="cardRef" class="container">
            <img class="overlay-image" :src="require('@/assets/Daggerheart/ancestry/' + card.id + '.jpg')" style="top: -5px;" />
            <div class="background-image cardAncestry">
              <div class="text text-bold-left" :style="{ top: '190px', left:'30px', 'font-size': '30px' }">{{ card.name }}
              </div>
              <div class="text text-normal" :style="{ top: '235px' }" v-html="card.description"></div>
            </div>
          </div>
        </div>
      </div>
      -->

      <!-- Community -->
      <!--
      <div class="flex flex-wrap m5px">
        <div v-for="community in cards.Community" :key="'Community' + community.name">
          <div ref="cardRef" class="container">
            <img class="overlay-image" :src="require('@/assets/Daggerheart/community/' + community.id + '.jpg')" />
            <div class="background-image cardCommunity">
              <div class="text text-bold" :style="{ top: '245px', 'font-size': '20px' }">{{ community.name }}</div>
              <div class="text text-normal" :style="{ top: '275px' }" v-html="community.description"></div>
            </div>
          </div>
        </div>
      </div>
      -->

      <!-- Classes-->
      <!--
      <div class="flex flex-wrap m5px">
        <div v-for="cardClass in cards.Class" :key="'Class' + cardClass.name">
          <div ref="cardRef" class="container">
            <img class="overlay-image" :src="require('@/assets/Daggerheart/class/' + cardClass.id + '.jpg')"
              style="top:-20px" />
            <div class="background-image cardClass">
              <div class="text text-bold-up" :style="{ top: '173px', 'font-size': '14px' }">{{ cardClass.name }}</div>
              <div class="text text-normal" :style="{ top: '198px', 'font-size': '10px' }"
                v-html="cardClass.description">
              </div>
              <div class="text text-bas"><b>Evasion</b> : {{ cardClass.evasion }} - <b>Seuils Dégâts</b> : Majeur {{
                cardClass.seuilMajeur }} / Sévere {{ cardClass.seuilSevere }}</div>
            </div>
            <img class="ruban" :src="require('@/assets/Daggerheart/class/' + cardClass.id + '-banner.webp')" />
          </div>
        </div>
      </div>
      -->

      <!-- Classes Basics-->
      
      <div class="flex flex-wrap m5px">
        <div v-for="card in cards.Class" :key="'Class' + card.name">
          <div ref="cardRef" class="container">
            <img class="overlay-image" :src="require('@/assets/Daggerheart/class/' + card.id + '.jpg')"
              style="top:-2px" />
            <div class="background-image cardDomain">
              <div class="text text-bold-up" :style="{ top: '228px', 'font-size': '14px' }">{{ card.name }}</div>
              <div class="text text-normal" :style="{ top: '255px', 'font-size': '11px' }"><i>{{ card.explication }}</i></div>
              <div class="text text-bas" :style="{ top: '455px' }"><b>Evasion</b> : {{ card.evasion }} - <b>Seuils Dégâts</b> : Majeur {{
                card.seuilMajeur }} / Sévere {{ card.seuilSevere }}</div>
            </div>
            <div class="bgDomain" :style="{ 'background-color': 'black' }"></div>
            <img class="ruban" :src="require('@/assets/Daggerheart/class/' + card.id + '-banner.webp')" />
          </div>
        </div>
      </div>
      

      <!-- Sous Classes-->
      <!--
      <div class="flex flex-wrap m5px">
        <div v-for="cardClass in cards.Class" :key="'Class' + cardClass.name" style="display:inline">
          <div v-for="cardSousClass in cardClass.SousClass" :key="'SousClass' + cardSousClass.name"
            style="display:inline">
            <div ref="cardRef" class="container">
              <img class="overlay-image" :src="require('@/assets/Daggerheart/class/' + cardClass.id + '.jpg')" />
              <div class="background-image cardSousClass">
                <div class="text text-bold-up" :style="{ top: '200px', 'font-size': '14px' }">{{ cardClass.name }}
                </div>
                <div class="text text-bold" :style="{ top: '220px', 'font-size': '14px' }">{{ cardSousClass.name }}
                </div>
                <div class="text text-normal" :style="{ top: '240px', 'font-size': '11px' }"
                  v-html="cardSousClass.description"></div>
                <div class="text text-bas"><b>Fondation</b></div>
              </div>
              <img class="ruban" :src="require('@/assets/Daggerheart/class/' + cardClass.id + '-banner.webp')" />
            </div>
          </div>F
        </div>
      </div>
      -->

      <!-- Domain -->
      <!--
      <div class="flex flex-wrap m5px">
        <div v-for="card in cards.Domain" :key="'Domain' + card.name">
          <div ref="cardRef" class="container">
            <img class="overlay-image" :src="require('@/assets/Daggerheart/domain/' + card.domain.toLowerCase() + '.jpg')"
              style="top:-8px" />
            <div class="background-image cardDomain">
              <div class="text text-bold-up" :style="{ top: '228px', 'font-size': '14px' }">{{ card.type }}</div>
              <div class="text text-bold" :style="{ top: '250px', 'font-size': '20px' }">{{ card.name }}</div>
              <div class="text text-normal" :style="{ top: '275px', 'font-size': '11px' }" v-html="card.description"></div>
              <div class="text text-normal" :style="{ top: '455px', 'text-align':'right', 'font-size': '11px' }" ><b>Domaine : </b>{{ card.domaine }}</div>
            </div>
            <img class="ruban"
              :src="require('@/assets/Daggerheart/domain/banner-' + card.domain.toLowerCase() + '.webp')" />
            <img class="cost" :src="require('@/assets/Daggerheart/other/cost.webp')" />
            <div class="bgDomain" :style="{ 'background-color': getDomainColor(card.domain) }"></div>
            <div class="text"
              :style="{ top: '15px', left: '45px', 'font-size': '30px', color: card.domain === 'Bone' ? 'black' : 'white', 'z-index': 2, 'font-weight': 'bold' }">
              {{ card.niveau }}</div>
            <div class="text"
              :style="{ top: '20px', right: '36px', 'font-size': '21px', color: 'white', 'z-index': 2 }">
              {{ card.cost }}
            </div>
          </div>
        </div>
      </div>
      -->
    </div>
    <div v-else>
      <h1>Les Images</h1>
      <h2>Les Ascendences</h2>
      <div class="flex flex-wrap">
        <img style="width:340px" v-for="(image, index) in images" :key="'image' + index" :src="image" />
      </div>
      <h1></h1>
      <h2>Les Classes</h2>
      <br>
      <h1></h1>
      <h2>Les Sous Classes</h2>
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
  width: 100%;
  height: 100%;
  background-size: cover;
  position: relative;
  z-index: 2;
}

.overlay-image {
  position: absolute;
  background-size: cover;
  top: 2px;
  left: 2px;
  width: 336px;
  height: 244px;
  color: black;
  z-index: 1;
}

.text-bold {
  right: 15px;
  left: 15px;
  font-weight: bold;
  text-align: center;
  text-transform: uppercase;
}

.text-bold-left {
  left: 40px;
  font-weight: bold;
  text-transform: uppercase;
  right: 40px;
}

.text-bold-up {
  right: 120px;
  left: 120px;
  color: white;
  font-weight: bold;
  text-align: center;
  text-transform: uppercase;
}

.text-normal {
  top: 250px;
  left: 15px;
  right: 15px;
  font-size: 12px;
}

.text-bas {
  top: 452px;
  left: 15px;
  right: 15px;
  font-size: 10px;
  text-align: center;
}

.ruban {
  position: absolute;
  background-size: cover;
  top: 2px;
  left: 20px;
  width: 70px;
  height: 118px;
  color: black;
  z-index: 2;
}

.cost {
  position: absolute;
  background-size: cover;
  top: 20px;
  right: 20px;
  width: 35px;
  height: 35px;
  color: black;
  z-index: 2;
}

.bgDomain {
  width: 93px;
  height: 25px;
  position: absolute;
  top: 232px;
  left: 125px;
  z-index: 1;
}

.cardAncestry {
  background: url('@/assets/Daggerheart/template/CardAncestry.png');
}

.cardCommunity {
  background: url('@/assets/Daggerheart/template/CardCommunity.png');
}

.cardClass {
  background: url('@/assets/Daggerheart/template/CardClass.png');
}

.cardDomain {
  background: url('@/assets/Daggerheart/template/CardDomain.png');
}

.cardSousClass {
  background: url('@/assets/Daggerheart/template/CardSousClass.png');
}
</style>

<script>
import ServiceDaggerheart from '../services/serviceDaggerheart';
import html2canvas from 'html2canvas';

export default {
name: 'pageDaggerheart',
components: {},
data: () => ({
  cards : null,
  images: [],
  capturedImage : null,
  showOrigin: true,
  elf : "<p><i>Les Elfes sont des grand humanoides avec les oreilles pointues et des sens aigisés.</i><br><strong>Transe spirituelle :</strong> Pendant un repos, vous pouvez entrer en transe et effectuer une action supplémentaire de temps d'arrêt.<br><strong>Réactions Rapides :</strong> Vous pouvez marquer un Stress pour bénéficier d'un avantage sur un Jet de Réaction.</p>"
}),
async mounted(){
  this.cards = await ServiceDaggerheart.loadCards();
  setTimeout(() => this.getImages(), 1);
},
methods: {
  getDomainLevelColor(domain) {return domain == "Bone" ? 'black' : 'white';},
  getDomainColor(domain){
    const colors = [
      {key:"arcana", value:"#79498E"},{key:"blade", value:"#952922"},{key:"bone", value:"#B4BCC0"},{key:"codex", value:"#214F84"},
      {key:"grace", value:"#BE4285"},{key:"midnight", value:"#323435"},{key:"sage", value:"#0B6E3A"},{key:"splendor", value:"#E0C123"},
      {key:"valor", value:"#C7651D"}
    ];
    return colors.find(x=> x.key == domain.toLowerCase())?.value ?? "red";
  },
  async getImages(){
    await this.$refs.cardRef.forEach(div => this.getImage(div));
    this.showOrigin=false;
  },
  async getImage(divClass){
    const canvas = await html2canvas(divClass);
    const dataURL = canvas.toDataURL('image/png');
    this.images.push(dataURL);
  },
  async captureAndDownload() {
    const element = this.$refs.captureArea; // Référence à la div à capturer
    try {
      const canvas = await html2canvas(element); // Capture la div
      const dataURL = canvas.toDataURL('image/png'); // Convertit en URL de données PNG
      this.capturedImage = dataURL; // Met à jour l'image capturée
      //this.downloadImage(dataURL); // Télécharge l'image
    } catch (error) {
      console.error('Erreur lors de la capture de la div :', error);
    }
  },
  downloadImage(dataURL) {
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'capture.png'; // Nom du fichier image téléchargé
    link.click(); // Déclenche le téléchargement
  },
  handleCanvasClick(event, item) {
    const canvas = event.target;
    this.drawCanvas(canvas, item);
  },
  loadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Échec du chargement de l'image à l'URL : ${url}`));
    });
  },
  drawCanvas(canvas, classObj) {
    //const canvas = this.$refs[classObj.name];
    const ctx = canvas.getContext('2d');

    // Charger toutes les images en utilisant des promesses
    const imagePromises = [
      require('@/assets/Daggerheart/template/CardClass.png'),
      require('@/assets/Daggerheart/class/' + classObj.id + '.jpg')
    ].map(url => this.loadImage(url));

    // Attendre que toutes les images soient chargées
    Promise.all(imagePromises).then(images => {
      ctx.drawImage(images[1], 2, 2, 336, 244);
      ctx.drawImage(images[0], 0, 0, 340, 476);
      
      this.writeText(ctx, classObj.name, 300, 15, 15, 275, 'bold 30px system-ui', 'black');
      this.writeText(ctx, classObj.description, 930, 15, 15, 300, '12px yrsa', 'black');
      
      //drawText(ctx, classObj.description2, { x: 15, y: 160, width: 302, height: 300, vAlign:top,	fontSize: 12, justify: true});
      
    });
    /*
    // Charger l'image
    const image = new Image();
    image.src = require('@/assets/Daggerheart/template/CardAncestry.png');
    image.onload = () => {
      // Dessiner l'image sur le canevas
      ctx.drawImage(image, 0, 0, 340, 476);
    };*/   
  },
  writeText(ctx, text, maxWidth, lineHeight, x, y, font, color) {
    const words = text.split(' ');
    let line = '';
    const lines = [];

    words.forEach(word => {
      const testLine = line + word + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && line !== '') {
        lines.push(line);
        line = word + ' ';
      } else {
        line = testLine;
      }
    });

    lines.push(line);
    
    ctx.font = font;
    ctx.fillStyle = color;
    lines.forEach((line, index) => {
      ctx.fillText(line, x, y + index * lineHeight);
    });
  }
}
};
</script>