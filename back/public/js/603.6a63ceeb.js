"use strict";(self["webpackChunkfront"]=self["webpackChunkfront"]||[]).push([[603],{3603:function(e,a,s){s.r(a),s.d(a,{default:function(){return C}});var t=s(4562),r=s(7808),d=function(){var e=this,a=e._self._c;return a("div",[a("div",{staticClass:"flex flex-responsive"},[a("div",{staticClass:"bgWhite",staticStyle:{"flex-grow":"3","flex-basis":"0"}},[a("h1",{staticStyle:{"padding-bottom":"4px"}},[e._v("AJOUTER UNE CARTE")]),a(r.Z,{staticClass:"flex-grow p5px",attrs:{"hide-details":"",label:"Chercher une carte (EN)"},on:{input:e.search},model:{value:e.searchString,callback:function(a){e.searchString=a},expression:"searchString"}}),e.cardsFiltered&&e.cardsFiltered.length>0?a("panel-cards",{key:"",attrs:{size:100,cards:e.cardsFiltered},on:{hover:e.showCard,select:e.selectCard}}):e._e()],1),a("div",{staticStyle:{"flex-grow":"1","flex-basis":"0"}},[a("div",{staticClass:"bg2"},[a("h3",{staticClass:"p5px colorWhite"},[e._v("Les cartes séléctionnées")]),e.cardsSelected&&e.cardsSelected.length>0?a("panel-cards",{attrs:{size:50,cards:e.cardsSelected},on:{hover:e.showCard,select:e.unselectCard}}):e._e(),a(t.Z,{staticClass:"m5px bg w100p colorWhite",attrs:{disabled:e.cardsSelected.length<1},on:{click:e.addCards}},[e._v(" Ajouter dans l'onglet EXTRA ")])],1),e.cardHover?a("card-image",{attrs:{card:e.cardHover,badgeoff:!0,size:300}}):e._e()],1)])])},c=[],l=(s(7658),s(9043)),i=s(9092),n=s(2518),o=s(2948),h={name:"pageDeck",components:{panelCards:n.Z,cardImage:o.Z},data:()=>({cards:null,cardsFiltered:null,cardHover:null,cardsSelected:[],searchString:""}),async mounted(){let e=i.h.cards.map((e=>e.IdName));l.Z.getAll("cardMDM").then((a=>{this.cards=a.filter((a=>!e.includes(a.IdName)))}))},methods:{search(e){let a=e.toLowerCase();this.cardsFiltered=!a||a.length<2?[]:this.cards.filter((e=>e.IdName.includes()||e.NameEn.toLowerCase().includes(a))).slice(0,50)},selectCard(e){this.cardsSelected.push(e)},unselectCard(e){this.cardsSelected=this.cardsSelected.filter((a=>a.IdName!==e.IdName))},showCard(e){this.cardHover=e},addCards(){l.Z.insert("cardToAdd",this.cardsSelected).then((e=>{alert(e.data),window.location.reload()}))}}},u=h,f=s(1001),p=(0,f.Z)(u,d,c,!1,null,null,null),C=p.exports}}]);
//# sourceMappingURL=603.6a63ceeb.js.map