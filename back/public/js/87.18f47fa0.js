"use strict";(self["webpackChunkfront"]=self["webpackChunkfront"]||[]).push([[87],{11797:function(e,t,s){s.d(t,{Z:function(){return p}});var a=s(79582),r=s(77394),i=s(4324),l=s(92648),n=function(){var e=this,t=e._self._c;return t("div",[t(a.Z,{staticClass:"flex m5px p5px",on:{click:function(t){e.show=!e.show}}},[e.icon?t(i.Z,[e._v(e._s(e.icon))]):e._e(),t("span",[e._v(e._s(e.title))])],1),t(r.Fx,[t("div",{directives:[{name:"show",rawName:"v-show",value:e.show,expression:"show"}]},[t(l.Z,{staticClass:"m5px",attrs:{value:e.text,readonly:""}})],1)])],1)},o=[],c={name:"text-spoiler",props:["title","icon","text"],data:()=>({show:!1})},u=c,d=s(1001),h=(0,d.Z)(u,n,o,!1,null,null,null),p=h.exports},62159:function(e,t,s){s.r(t),s.d(t,{default:function(){return w}});var a=s(64562),r=s(17808),i=s(92648),l=function(){var e=this,t=e._self._c;return t("header-yugioh",[t("h1",[e._v("CHERCHER UNE CARTE")]),t("h2",[e._v("PAR LISTE DE NOM")]),t("p",{staticClass:"bg p5px"},[e._v("Parfois il peut être utile de vérifier si des cartes existent ou non dans le format MDOS. Pour cela, il vous suffit de renseigner le nom (en anglais) des cartes dans le champ ci-dessous séparés par un retour a la ligne.")]),t("div",{staticClass:"flex flex-wrap"},[t("div",{staticClass:"m5px"},[e._v("Dans la liste de carte ci-dessous, la seule information qui compte est le nom de la carte en anglais. Parfois il arrive que les sites ajoutent d'autres informations. Par exemple yugioh.fandom.com indique le nom de la carte en anglais puis le caractère '|' puis le nom en japonnais. Le champ ci-dessous permet d'indiquer la liste des caractères a partir desquelles on considère la phrase comme terminé.")]),t(r.Z,{staticClass:"m5px",attrs:{label:"Ignorer la suite de la phrase"},model:{value:e.ignoreChars,callback:function(t){e.ignoreChars=t},expression:"ignoreChars"}})],1),t("div",{staticClass:"flex flew-wrap"},[t(i.Z,{staticClass:"flex-grow m5px",attrs:{label:"Chercher les cartes :"},model:{value:e.text,callback:function(t){e.text=t},expression:"text"}}),t("div",{staticClass:"flex-grow"},e._l(e.result,(function(e){return t("text-spoiler",{key:e.title,attrs:{title:e.title,text:e.text}})})),1)],1),t("div",{staticClass:"flex flex-center flex-wrap"},[t(a.Z,{class:{m5px:!0,bg:"mdos"===e.lastCall},on:{click:function(t){return e.searchCards(e.store.cards,"mdos")}}},[e._v("Les cartes MDOS")]),t(a.Z,{class:{m5px:!0,bg:"ygo"===e.lastCall},on:{click:function(t){return e.searchCards(e.allCards,"ygo")}}},[e._v("Les cartes Master Duel")]),t(a.Z,{class:{m5px:!0,bg:"ygo-mods"===e.lastCall},on:{click:function(t){return e.searchCards(e.allCards,"ygo-mods")}}},[e._v("Les cartes Master Duel non MDOS")])],1),e.cards&&e.cards.length>0?t("panel-cards",{attrs:{keyid:e.lastCall,size:150,tooltip:"text",cards:e.cards}}):e._e(),t("h2",[e._v("Liens utiles")]),t("div",{staticClass:"p5px bg"},[t("p",{staticClass:"m5px"},[e._v('Le lien ci-dessous vont conduit sur un site dédié à Yu-Gi-Oh!. Depuis cette page, on peux retrouver la liste de toutes les cartes qui ont un effet spécifique, ensuite on peux utiliser l\'outil ci-dessus pour savoir si oui ou non elles font parties du format MDOS. Par exemple : "Changes battle positions", dans cette liste, on va retrouver des cartes comme "Destiny HERO - Dasher" ou "Guardian Sphinx".')]),t("a",{staticClass:"m5px",attrs:{href:"https://yugioh.fandom.com/wiki/Category:Cards_by_effect_properties"}},[e._v(" Lien vers yugioh.fandom.com ")]),t("p",{staticClass:"m5px"},[e._v("La procédure a suivre est simple, on va sur la page wiki, on suit un lien vers une catégorie d'effet, on copie le contenu des tableaux dans un tableur (Libre Office par exemple), puis on copie la colonne A du tableur que l'on colle dans le champ ci-dessus. Ne reste plus qu'a appuyer sur le bouton : \"Chercher dans les cartes MDOS\" et voila...")]),t("p",{staticClass:"m5px"},[e._v("Remarque : Pour certaines catégories d'effet, il y a tellement de carte que le contenu des tableaux est tronqué. Pour cela il faut cliquer sur \"... further results (xxx more)\" puis dans la nouvelle page, on peux sélectionner le bouton blanc : 500 afin qu'il affiche 500 elements. Ensuite, on utilise le bouton \"Previous\" afin qu'il affiche les résultats de 1 à 500. Enfin on peux appuyer sur le bouton CSV afin d'obtenir le tableur.")])]),t("h2",{staticStyle:{"padding-bottom":"4px"}},[e._v("CHERCHER DANS MASTER DUEL")]),t("div",{staticClass:"flex flex-wrap"},[t("div",{staticClass:"flex-grow"},[t(r.Z,{staticClass:"flex-grow p5px",attrs:{"hide-details":"",label:"Chercher une carte (EN)"},on:{input:e.search},model:{value:e.searchString,callback:function(t){e.searchString=t},expression:"searchString"}}),e.cardsFiltered&&e.cardsFiltered.length>0?t("panel-cards",{attrs:{keyid:"search",size:100,cards:e.cardsFiltered,tooltip:"text"},on:{hover:e.showCard,select:e.selectCard}}):e._e()],1),t("div",{staticStyle:{width:"310px",height:"440px"}},[e.cardHover?t("card-image",{attrs:{card:e.cardHover,badgeoff:!0,size:300}}):e._e()],1)]),t("h1",[e._v("CREER UN DECK")]),t(a.Z,{staticClass:"m5px",on:{click:function(t){return e.createDeckByImage()}}},[e._v("A partir d'une image")])],1)},n=[],o=(s(57658),s(69092)),c=s(69043),u=s(97142),d=s.n(u),h=s(67499),p=s(22518),g=s(22948),m=s(11797),f={name:"pageTool",components:{headerYugioh:h.Z,panelCards:p.Z,cardImage:g.Z,textSpoiler:m.Z},data:()=>({store:o.h,text:"Blue-Eyes Shining Dragon\nBlue-Eyes Chaos MAX Dragon|平仮名x\nMaiden with Eyes of Blue\tEffect Monster",cards:[],allCards:[],ignoreChars:"\t|",lastCall:"",searchString:"",cardsFiltered:null,cardHover:null,notfinded:"",result:[]}),async mounted(){c.Z.getAll("cardMDM").then((e=>{this.allCards=e,this.searchCards(this.allCards,"ygo")}))},methods:{search(e){let t=e.toLowerCase();this.cardsFiltered=!t||t.length<2?[]:this.allCards.filter((e=>e.IdName.includes()||e.NameEn.toLowerCase().includes(t))).slice(0,50)},showCard(e){this.cardHover=e},selectCard(){},searchCards(e,t){let s=d().replaceAll(this.text,",","").split("\n").filter((e=>e&&e.trim().length>0)).map((e=>d().cut(e,this.ignoreChars)));s=[...new Set(s)].map((e=>({id:d().cleanup(e),name:e})));let a=[],r=[],i=[];s.forEach((s=>{let l=e.find((e=>e.IdName===s.id&&e.Rarity));if(l||(l=e.find((e=>e.IdName===s.id))),l){if("ygo-mods"===t){let e=this.store.cards.find((e=>e.IdName===s.id));if(e)return;i.push(s.name)}a.push(l)}else r.push(s.name)})),this.lastCall=t,this.cards=a,this.notfinded=r.join("\n"),this.result=[],r.length>0&&this.result.push({title:`❌ Carte non trouvées ${r.length}/${s.length}`,text:r.join("\n")}),i.length>0&&this.result.push({title:`❔ Carte non MODS ${i.length}/${s.length}`,text:i.join("\n")}),a.length>0&&this.result.push({title:`✔️ Carte trouvées ${a.length}/${s.length}`,text:a.map((e=>e.NameEn)).join("\n")})},createDeckByImage(){alert("test")}}},v=f,x=s(1001),C=(0,x.Z)(v,l,n,!1,null,null,null),w=C.exports},79582:function(e,t,s){s.d(t,{Z:function(){return n}});var a=s(83434),r=s(49603),i=s(58860),l=s(67678),n=(0,l.Z)(r.Z,i.Z,a.Z).extend({name:"v-card",props:{flat:Boolean,hover:Boolean,img:String,link:Boolean,loaderHeight:{type:[Number,String],default:4},raised:Boolean},computed:{classes(){return{"v-card":!0,...i.Z.options.computed.classes.call(this),"v-card--flat":this.flat,"v-card--hover":this.hover,"v-card--link":this.isClickable,"v-card--loading":this.loading,"v-card--disabled":this.disabled,"v-card--raised":this.raised,...a.Z.options.computed.classes.call(this)}},styles(){const e={...a.Z.options.computed.styles.call(this)};return this.img&&(e.background=`url("${this.img}") center center / cover no-repeat`),e}},methods:{genProgress(){const e=r.Z.options.methods.genProgress.call(this);return e?this.$createElement("div",{staticClass:"v-card__progress",key:"progress"},[e]):null}},render(e){const{tag:t,data:s}=this.generateRouteLink();return s.style=this.styles,this.isClickable&&(s.attrs=s.attrs||{},s.attrs.tabindex=0),e(t,this.setBackgroundColor(this.color,s),[this.genProgress(),this.$slots.default])}})},92648:function(e,t,s){s.d(t,{Z:function(){return l}});var a=s(17808),r=s(67678);const i=(0,r.Z)(a.Z);var l=i.extend({name:"v-textarea",props:{autoGrow:Boolean,noResize:Boolean,rowHeight:{type:[Number,String],default:24,validator:e=>!isNaN(parseFloat(e))},rows:{type:[Number,String],default:5,validator:e=>!isNaN(parseInt(e,10))}},computed:{classes(){return{"v-textarea":!0,"v-textarea--auto-grow":this.autoGrow,"v-textarea--no-resize":this.noResizeHandle,...a.Z.options.computed.classes.call(this)}},noResizeHandle(){return this.noResize||this.autoGrow}},watch:{autoGrow(e){this.$nextTick((()=>{var t;e?this.calculateInputHeight():null===(t=this.$refs.input)||void 0===t||t.style.removeProperty("height")}))},lazyValue(){this.autoGrow&&this.$nextTick(this.calculateInputHeight)},rowHeight(){this.autoGrow&&this.$nextTick(this.calculateInputHeight)}},mounted(){setTimeout((()=>{this.autoGrow&&this.calculateInputHeight()}),0)},methods:{calculateInputHeight(){const e=this.$refs.input;if(!e)return;e.style.height="0";const t=e.scrollHeight,s=parseInt(this.rows,10)*parseFloat(this.rowHeight);e.style.height=Math.max(s,t)+"px"},genInput(){const e=a.Z.options.methods.genInput.call(this);return e.tag="textarea",delete e.data.attrs.type,e.data.attrs.rows=this.rows,e},onInput(e){a.Z.options.methods.onInput.call(this,e),this.autoGrow&&this.calculateInputHeight()},onKeyDown(e){this.isFocused&&13===e.keyCode&&e.stopPropagation(),this.$emit("keydown",e)}}})}}]);
//# sourceMappingURL=87.18f47fa0.js.map