(self["webpackChunkfront"]=self["webpackChunkfront"]||[]).push([[611],{4182:function(e,t,s){"use strict";s.r(t),s.d(t,{default:function(){return B}});var r=s(1653),a=function(){var e=this,t=e._self._c;return t("div",[e.loading?t("div",[e._v(" Chargement ")]):t("div",[e.deck&&e.deck.IdTournament?t(r.Z,{staticClass:"m5px",attrs:{type:"warning"}},[e._v(" Notez bien l'url de cette page quelque part car ce deck n'est pas public. Vous ne serez plus capable d'y retourner par la suite. ")]):e._e(),e.isNew||e.deck.IsDraft?t("div",[t("panel-create-deck",{attrs:{deck:e.deck,themes:e.themes,staples:e.staples,tournaments:e.tournaments},on:{save:e.saveDeck}})],1):e.deck?t("div",[t("panel-deck",{attrs:{deck:e.deck}})],1):e._e()],1)])},i=[],n=(s(7658),s(7925)),c=s(7142),d=s.n(c),l=s(9043),o=s(1442),h=s(9092),u=s(9983),k=s(6190),p=s(5639),f=s(7808),m=function(){var e=this,t=e._self._c;return e.selectMainCard?t("div",[t("panel-deck-cards",{attrs:{cards:e.deckObj.DeckListCards,size:100},on:{select:e.selectFav}})],1):e.selectThemes&&e.deckObj?t("div",{key:e.refreshThemes},[t("h1",[e._v("Thèmes sélectionnable")]),t("div",{staticClass:"flex-wrap bg2"},e._l(e.themes.filter((t=>t&&"tous"!==t.Id&&!e.deckObj.ThemesId.includes(t.Id))),(function(s){return t("icon-theme-mini",{key:s.Id,attrs:{text:s.Title,image:s.CardImage},on:{select:function(t){return e.selectTheme(s)}}})})),1),t("h1",[e._v("Thèmes sélectionné pour le deck")]),t("div",{staticClass:"flex-wrap bg2"},e._l(e.themes.filter((t=>t&&e.deckObj.ThemesId.includes(t.Id))),(function(s){return t("icon-theme-mini",{key:s.Id,attrs:{text:s.Title,image:s.CardImage},on:{select:function(t){return e.unselectTheme(s)}}})})),1),t(k.Z,{staticClass:"m5px bg",staticStyle:{width:"100%",height:"30px",position:"static"},on:{click:function(t){e.selectThemes=!1}}},[e._v(" Valider ")])],1):t("div",{staticClass:"bgWhite"},[e.deckObj?[t("h2",[e._v("Modifier un deck")]),t("div",[t("div",{staticClass:"flex-wrap flex-center"},[t(f.Z,{staticClass:"m5px",attrs:{label:"Nom du deck","hide-details":""},model:{value:e.deckObj.Title,callback:function(t){e.$set(e.deckObj,"Title",t)},expression:"deckObj.Title"}}),t(f.Z,{staticClass:"m5px",attrs:{label:"Auteur","hide-details":""},model:{value:e.deckObj.Author,callback:function(t){e.$set(e.deckObj,"Author",t)},expression:"deckObj.Author"}})],1),e.deckObj?[e.deckObj.Errors?t(r.Z,{staticClass:"m5px w100p",attrs:{type:"error"}},[e._v(" Ce deck ne respecte pas le format : "+e._s(e.deckObj.Format&&e.deckObj.Format.length>0?e.deckObj.Format:"Test")+" pour les raisons suivantes : "+e._s(e.deckObj.Errors)+" ")]):t(r.Z,{staticClass:"m5px w100p",attrs:{type:"success"}},[e._v(" Ce deck respecte bien le format : "+e._s(e.deckObj.Format&&e.deckObj.Format.length>0?e.deckObj.Format:"Test")+" ")])]:e._e(),e.$vuetify.breakpoint.width>=930?t("div",{staticClass:"flex"},[t("div",{key:e.refreshCards,staticClass:"bg",staticStyle:{"flex-grow":"2","flex-basis":"0"}},[t("panel-deck-cards",{attrs:{cards:e.getCards(!1),keyid:"deckMain",size:75},on:{select:e.selectCardFromDeck,hover:e.showCard}}),t("panel-deck-cards",{attrs:{cards:e.getCards(!0),keyid:"deckExtra",size:75},on:{select:e.selectCardFromDeck,hover:e.showCard}})],1),e.deckObj?t("div",{staticClass:"bg2",staticStyle:{width:"310px"}},[t(r.Z,{staticClass:"m5px",staticStyle:{background:"#212A3C !important"},attrs:{type:"info"}},[e._v(" Nombre de carte du deck : "+e._s(e.deckObj.DeckLength)+" ")]),t("h3",{staticClass:"m5px",staticStyle:{color:"white"}},[e._v("Ajouter des Staples")]),t("div",{staticClass:"flex flex-space-around"},[t(k.Z,{on:{click:function(t){return e.showStaples("stapleMonster")}}},[e._v(" Monstre ")]),t(k.Z,{on:{click:function(t){return e.showStaples("stapleSpell")}}},[e._v(" Magie ")]),t(k.Z,{on:{click:function(t){return e.showStaples("stapleTrap")}}},[e._v(" Piège ")])],1),e.cardHover?t("card-image",{attrs:{card:e.cardHover,badgeoff:!0,showname:!0,size:300}}):t("div",{staticClass:"bg2 w100p",staticStyle:{height:"437px"}}),t("br")],1):e._e(),t("div",{staticStyle:{"flex-grow":"1","max-width":"357px","flex-basis":"0"}},[t(f.Z,{staticClass:"m5px",attrs:{solo:"","hide-details":"",label:"Chercher une carte (FR ou EN)",color:"#212A3C","append-inner-icon":"mdi-magnify"},on:{input:e.search},model:{value:e.searchString,callback:function(t){e.searchString=t},expression:"searchString"}}),e.selectedCards&&e.selectedCards.length>0?t("panel-cards",{attrs:{keyid:"searchCards",size:75,cards:e.selectedCards},on:{select:e.selectCard,hover:e.showCard}}):e._e()],1)]):t("div",[t("div",{staticClass:"bg"},[t("h3",{staticClass:"m5px",staticStyle:{color:"white"}},[e._v("Ajouter des Staples")]),t("div",{staticClass:"flex flex-space-around"},[t(k.Z,{on:{click:function(t){return e.showStaples("stapleMonster")}}},[e._v(" Monstre ")]),t(k.Z,{on:{click:function(t){return e.showStaples("stapleSpell")}}},[e._v(" Magie ")]),t(k.Z,{on:{click:function(t){return e.showStaples("stapleTrap")}}},[e._v(" Piège ")])],1),t(f.Z,{staticClass:"m5px",attrs:{solo:"","hide-details":"",label:"Chercher une carte (FR ou EN)",color:"#212A3C","append-inner-icon":"mdi-magnify"},on:{input:e.search},model:{value:e.searchString,callback:function(t){e.searchString=t},expression:"searchString"}}),e.selectedCards&&e.selectedCards.length>0?t("panel-cards",{attrs:{size:50,cards:e.selectedCards},on:{select:e.selectCard}}):e._e()],1),t("panel-deck-cards",{key:e.refreshCards,attrs:{cards:e.getCards(!1),keyid:"vdeckMain",size:50},on:{select:e.selectCardFromDeck}}),t("panel-deck-cards",{key:e.refreshCards,attrs:{cards:e.getCards(!0),keyid:"vdeckExtra",size:50},on:{select:e.selectCardFromDeck}})],1),t("h1",[e._v("Tournoi")]),t(p.Z,{staticClass:"m5px w100p",attrs:{label:"Tournoi",items:e.tournaments,"item-text":"Title","hide-details":""},model:{value:e.deckObj.Tournament,callback:function(t){e.$set(e.deckObj,"Tournament",t)},expression:"deckObj.Tournament"}}),t(r.Z,{attrs:{type:"info"}},[e._v("Si vous sélectionnez un tournoi dans la liste déroulante ci-dessus, votre deck ne sera pas visible par la communauté. A l'exception des organisateurs de tournoi, vous serez le seul a pouvoir le consulter si vous prenez soin de noter l'url du deck une fois l'enregistrement terminé.")]),e.isValidForSave()?e._e():t(r.Z,{attrs:{type:"warning"}},[e._v(" Pour sauvegarder un deck, il faut qu'il y ait au moins 1 carte dans le deck, une carte principale définie, un thème minimum, un titre et un auteur. ")]),e.isValidForSave()&&e.deckObj.Errors&&e.deckObj.Errors.length>0?t(r.Z,{attrs:{type:"warning"}},[e._v(" Pour valider un deck, il faut que le format sélectionné soit respecté. ")]):e._e(),t("div",{staticClass:"flex-wrap flex-reverse"},[t(k.Z,{staticClass:"m5px bg",attrs:{disabled:!e.isValidForSave()||e.deckObj.Errors&&e.deckObj.Errors.length>0},on:{click:e.validate}},[e._v(" Valider (ne sera plus modifiable) ")]),t(k.Z,{staticClass:"m5px bg2 colorWhite",attrs:{disabled:!e.isValidForSave()},on:{click:e.save}},[e._v(" Sauvegarder ")]),t(k.Z,{staticClass:"m5px bg2 colorWhite",on:{click:function(t){e.selectMainCard=!0}}},[e._v(" Sélectionner la carte principale ")]),t(k.Z,{staticClass:"m5px bg2 colorWhite",on:{click:function(t){e.selectThemes=!0}}},[e._v(" Sélectionner les thèmes ")])],1)],2)]:e._e()],2)},b=[],v=s(144),g=s(2895),C=s(5254),j=s(3002),O=s(9548),T=function(){var e=this,t=e._self._c;return t("div",[t("div",{staticClass:"m5px",staticStyle:{width:"80px",height:"85px",position:"relative",overflow:"hidden"}},[t("img",{staticStyle:{cursor:"pointer",width:"110px","object-fit":"cover","object-position":"-12px -28px"},attrs:{src:e.image},on:{click:function(t){return e.$emit("select")}}})]),t("div",{on:{click:function(t){return e.$emit("select")}}},[t("div",{staticClass:"w100p",style:{"font-size":"10px","text-align":"center",color:e.color??"white"}},[e._v(e._s(e.text))])])])},x=[],y={name:"icon-theme",props:["image","text","color"]},w=y,_=s(1001),I=(0,_.Z)(w,T,x,!1,null,null,null),S=I.exports,D=s(6719);let Z=s(2568);var A={name:"panel-create-deck",props:["deck","themes","staples","tournaments"],components:{cardImage:j.Z,panelCards:O.Z,panelDeckCards:D.Z,iconThemeMini:S},data:()=>({store:h.h,deckObj:null,searchString:"",selectedCards:[],refreshCards:0,refreshThemes:0,selectMainCard:!1,selectThemes:!1,cardHover:null}),mounted(){this.deckObj=this.deck??{DeckListCards:[],MainCards:[],Themes:[],ThemesId:[],Rank:null,Format:h.h.formatSelected.Title},this.deckObj.Rank=3,this.deckObj.ThemesId=this.deckObj.Themes&&this.deckObj.Themes.length>0?this.themes.filter((e=>e&&this.deckObj.Themes.split(",").includes(e.Id))).map((e=>e.Id)):[],this.deckObj.Tournament=this.deckObj.IdTournament&&this.deckObj.IdTournament.length>0?this.tournaments.find((e=>e&&e.Id===this.deckObj.IdTournament))?.Id:"",this.deckObj.Errors=C.Z.getErrors(this.deckObj,this.deckObj.DeckListCards,h.h.formats,h.h.formatSelected.Id),(0,v.YP)(h.h,(()=>{this.refreshCardsDeck()}))},methods:{refreshCardsDeck(){this.deckObj.DeckListCards=C.Z.sort(this.deckObj.DeckListCards),this.deckObj.Errors=C.Z.getErrors(this.deckObj,this.deckObj.DeckListCards,h.h.formats,h.h.formatSelected.Id),this.refreshCards++},getCards(e){return this.deckObj&&this.deckObj.DeckListCards?this.deckObj.DeckListCards.filter((t=>t.Card.ToExtraDeck===e)):[]},search(e){this.selectedCards=g.Z.filterCard(h.h.cards,e)},selectCard(e){let t=this.deckObj.DeckListCards.find((t=>t.Card.IdName==e.IdName));t?t.Quantity="2":this.deckObj.DeckListCards.push({Id:e.IdName,Card:e}),this.refreshCardsDeck()},selectCardFromDeck(e){let t=this.deckObj.DeckListCards.find((t=>t.Card.IdName===e.IdName));if(t){if("2"===t.Quantity)return t.Quantity=null,void this.refreshCardsDeck();this.deckObj.DeckListCards=this.deckObj.DeckListCards.filter((e=>e.Card.IdName!==t.Card.IdName)),this.refreshCardsDeck()}},selectFav(e){this.deckObj.MainCard=e.NameEn,this.selectMainCard=!1},cryptPassword(){this.deckObj.Password=Z(this.deckObj.PasswordApparent)},selectTheme(e){let t=this.deckObj.ThemesId.find((t=>t===e.id));t||(this.deckObj.ThemesId.push(e.Id),this.refreshThemes++)},unselectTheme(e){this.deckObj.ThemesId=this.deckObj.ThemesId.filter((t=>t!==e.Id)),this.refreshThemes++},showCard(e){this.cardHover=e},showStaples(e){let t=this.staples[e].Value.split(",").map((e=>d().cleanup(e)));this.searchString=this.staples[e].Title,this.selectedCards=h.h.cards.filter((e=>t.includes(e.IdName))).slice(0,50)},save(){this.deckObj.Rank=3,this.deckObj.IdTournament=this.deckObj.Tournament?this.deckObj.Tournament.Id:"",this.deckObj.Themes=this.deckObj.ThemesId?this.deckObj.ThemesId.join(", "):"",delete this.deckObj.Tournament,this.$emit("save",this.deckObj)},validate(){this.deckObj.IsDraft=!1,this.save()},isValidForSave(){return this.deckObj.Title&&this.deckObj.Title.length>0&&this.deckObj.Author&&this.deckObj.Author.length>0&&this.deckObj.DeckListCards&&this.deckObj.DeckListCards.length>0&&this.deckObj.MainCard&&this.deckObj.MainCard.length>0&&this.deckObj.ThemesId&&this.deckObj.ThemesId.length>0}}},F=A,M=(0,_.Z)(F,m,b,!1,null,null,null),N=M.exports,L={name:"pageDeck",components:{panelCreateDeck:N,panelDeck:u.Z},data:()=>({loading:!0,ranks:null,tournaments:null,staples:null,themes:null,isNew:!1,id:null,deck:null}),mounted(){let e=window.location.href,t=e.indexOf("id=");this.isNew=t<1;let s=[l.Z.getAll("data"),l.Z.getAll("theme"),l.Z.getAll("deck"),l.Z.getAll("tournament")];this.isNew||(this.id=e.substring(t+3),s.push(l.Z.get("deck",this.id))),(0,n.D)(s).subscribe((e=>{this.staples={stapleMonster:e[0].find((e=>"stapleMonster"===e.Id)),stapleSpell:e[0].find((e=>"stapleSpell"===e.Id)),stapleTrap:e[0].find((e=>"stapleTrap"===e.Id))},this.ranks=JSON.parse(e[0].find((e=>"ranks"===e.Id)).Value),this.themes=e[1].concat([this.themeAll]),this.decks=e[2],this.tournaments=e[3],e.length>4&&this.showDeck(e[4]),this.loading=!1}))},methods:{showDeck(e){if(e||(window.location.href="/error/text=Ce%20deck%20n%20existe%20pas"),e.IsDraft&&e.Format){let t=h.h.formats.find((t=>t.Id===e.Format));if(t){let e=o.Z.setFormat(t,h.h.cards);h.h.cards=e.cards,h.h.formatSelected=e.format}}e.DeckListCards=[];let t=e.DeckList.split(",");for(let s=0;s<t.length;s++){const r=t[s];let a=d().includesX2(r)?"2":"1",i=d().removeX2(d().cleanup(r));const n=h.h.cards.find((e=>e.IdName===i));n&&e.DeckListCards.push({Order:s,Quantity:a,Card:n})}this.deck=e},saveDeck(e){this.loading=!0,l.Z.insert("deck",e).then((e=>this.move("/deck/id="+e.data)))},move(e){window.location.href===e?window.location.reload():window.location.href=e}}},E=L,z=(0,_.Z)(E,a,i,!1,null,null,null),B=z.exports},487:function(e){var t={utf8:{stringToBytes:function(e){return t.bin.stringToBytes(unescape(encodeURIComponent(e)))},bytesToString:function(e){return decodeURIComponent(escape(t.bin.bytesToString(e)))}},bin:{stringToBytes:function(e){for(var t=[],s=0;s<e.length;s++)t.push(255&e.charCodeAt(s));return t},bytesToString:function(e){for(var t=[],s=0;s<e.length;s++)t.push(String.fromCharCode(e[s]));return t.join("")}}};e.exports=t},1012:function(e){(function(){var t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",s={rotl:function(e,t){return e<<t|e>>>32-t},rotr:function(e,t){return e<<32-t|e>>>t},endian:function(e){if(e.constructor==Number)return 16711935&s.rotl(e,8)|4278255360&s.rotl(e,24);for(var t=0;t<e.length;t++)e[t]=s.endian(e[t]);return e},randomBytes:function(e){for(var t=[];e>0;e--)t.push(Math.floor(256*Math.random()));return t},bytesToWords:function(e){for(var t=[],s=0,r=0;s<e.length;s++,r+=8)t[r>>>5]|=e[s]<<24-r%32;return t},wordsToBytes:function(e){for(var t=[],s=0;s<32*e.length;s+=8)t.push(e[s>>>5]>>>24-s%32&255);return t},bytesToHex:function(e){for(var t=[],s=0;s<e.length;s++)t.push((e[s]>>>4).toString(16)),t.push((15&e[s]).toString(16));return t.join("")},hexToBytes:function(e){for(var t=[],s=0;s<e.length;s+=2)t.push(parseInt(e.substr(s,2),16));return t},bytesToBase64:function(e){for(var s=[],r=0;r<e.length;r+=3)for(var a=e[r]<<16|e[r+1]<<8|e[r+2],i=0;i<4;i++)8*r+6*i<=8*e.length?s.push(t.charAt(a>>>6*(3-i)&63)):s.push("=");return s.join("")},base64ToBytes:function(e){e=e.replace(/[^A-Z0-9+\/]/gi,"");for(var s=[],r=0,a=0;r<e.length;a=++r%4)0!=a&&s.push((t.indexOf(e.charAt(r-1))&Math.pow(2,-2*a+8)-1)<<2*a|t.indexOf(e.charAt(r))>>>6-2*a);return s}};e.exports=s})()},8738:function(e){function t(e){return!!e.constructor&&"function"===typeof e.constructor.isBuffer&&e.constructor.isBuffer(e)}function s(e){return"function"===typeof e.readFloatLE&&"function"===typeof e.slice&&t(e.slice(0,0))}
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
e.exports=function(e){return null!=e&&(t(e)||s(e)||!!e._isBuffer)}},2568:function(e,t,s){(function(){var t=s(1012),r=s(487).utf8,a=s(8738),i=s(487).bin,n=function(e,s){e.constructor==String?e=s&&"binary"===s.encoding?i.stringToBytes(e):r.stringToBytes(e):a(e)?e=Array.prototype.slice.call(e,0):Array.isArray(e)||e.constructor===Uint8Array||(e=e.toString());for(var c=t.bytesToWords(e),d=8*e.length,l=1732584193,o=-271733879,h=-1732584194,u=271733878,k=0;k<c.length;k++)c[k]=16711935&(c[k]<<8|c[k]>>>24)|4278255360&(c[k]<<24|c[k]>>>8);c[d>>>5]|=128<<d%32,c[14+(d+64>>>9<<4)]=d;var p=n._ff,f=n._gg,m=n._hh,b=n._ii;for(k=0;k<c.length;k+=16){var v=l,g=o,C=h,j=u;l=p(l,o,h,u,c[k+0],7,-680876936),u=p(u,l,o,h,c[k+1],12,-389564586),h=p(h,u,l,o,c[k+2],17,606105819),o=p(o,h,u,l,c[k+3],22,-1044525330),l=p(l,o,h,u,c[k+4],7,-176418897),u=p(u,l,o,h,c[k+5],12,1200080426),h=p(h,u,l,o,c[k+6],17,-1473231341),o=p(o,h,u,l,c[k+7],22,-45705983),l=p(l,o,h,u,c[k+8],7,1770035416),u=p(u,l,o,h,c[k+9],12,-1958414417),h=p(h,u,l,o,c[k+10],17,-42063),o=p(o,h,u,l,c[k+11],22,-1990404162),l=p(l,o,h,u,c[k+12],7,1804603682),u=p(u,l,o,h,c[k+13],12,-40341101),h=p(h,u,l,o,c[k+14],17,-1502002290),o=p(o,h,u,l,c[k+15],22,1236535329),l=f(l,o,h,u,c[k+1],5,-165796510),u=f(u,l,o,h,c[k+6],9,-1069501632),h=f(h,u,l,o,c[k+11],14,643717713),o=f(o,h,u,l,c[k+0],20,-373897302),l=f(l,o,h,u,c[k+5],5,-701558691),u=f(u,l,o,h,c[k+10],9,38016083),h=f(h,u,l,o,c[k+15],14,-660478335),o=f(o,h,u,l,c[k+4],20,-405537848),l=f(l,o,h,u,c[k+9],5,568446438),u=f(u,l,o,h,c[k+14],9,-1019803690),h=f(h,u,l,o,c[k+3],14,-187363961),o=f(o,h,u,l,c[k+8],20,1163531501),l=f(l,o,h,u,c[k+13],5,-1444681467),u=f(u,l,o,h,c[k+2],9,-51403784),h=f(h,u,l,o,c[k+7],14,1735328473),o=f(o,h,u,l,c[k+12],20,-1926607734),l=m(l,o,h,u,c[k+5],4,-378558),u=m(u,l,o,h,c[k+8],11,-2022574463),h=m(h,u,l,o,c[k+11],16,1839030562),o=m(o,h,u,l,c[k+14],23,-35309556),l=m(l,o,h,u,c[k+1],4,-1530992060),u=m(u,l,o,h,c[k+4],11,1272893353),h=m(h,u,l,o,c[k+7],16,-155497632),o=m(o,h,u,l,c[k+10],23,-1094730640),l=m(l,o,h,u,c[k+13],4,681279174),u=m(u,l,o,h,c[k+0],11,-358537222),h=m(h,u,l,o,c[k+3],16,-722521979),o=m(o,h,u,l,c[k+6],23,76029189),l=m(l,o,h,u,c[k+9],4,-640364487),u=m(u,l,o,h,c[k+12],11,-421815835),h=m(h,u,l,o,c[k+15],16,530742520),o=m(o,h,u,l,c[k+2],23,-995338651),l=b(l,o,h,u,c[k+0],6,-198630844),u=b(u,l,o,h,c[k+7],10,1126891415),h=b(h,u,l,o,c[k+14],15,-1416354905),o=b(o,h,u,l,c[k+5],21,-57434055),l=b(l,o,h,u,c[k+12],6,1700485571),u=b(u,l,o,h,c[k+3],10,-1894986606),h=b(h,u,l,o,c[k+10],15,-1051523),o=b(o,h,u,l,c[k+1],21,-2054922799),l=b(l,o,h,u,c[k+8],6,1873313359),u=b(u,l,o,h,c[k+15],10,-30611744),h=b(h,u,l,o,c[k+6],15,-1560198380),o=b(o,h,u,l,c[k+13],21,1309151649),l=b(l,o,h,u,c[k+4],6,-145523070),u=b(u,l,o,h,c[k+11],10,-1120210379),h=b(h,u,l,o,c[k+2],15,718787259),o=b(o,h,u,l,c[k+9],21,-343485551),l=l+v>>>0,o=o+g>>>0,h=h+C>>>0,u=u+j>>>0}return t.endian([l,o,h,u])};n._ff=function(e,t,s,r,a,i,n){var c=e+(t&s|~t&r)+(a>>>0)+n;return(c<<i|c>>>32-i)+t},n._gg=function(e,t,s,r,a,i,n){var c=e+(t&r|s&~r)+(a>>>0)+n;return(c<<i|c>>>32-i)+t},n._hh=function(e,t,s,r,a,i,n){var c=e+(t^s^r)+(a>>>0)+n;return(c<<i|c>>>32-i)+t},n._ii=function(e,t,s,r,a,i,n){var c=e+(s^(t|~r))+(a>>>0)+n;return(c<<i|c>>>32-i)+t},n._blocksize=16,n._digestsize=16,e.exports=function(e,s){if(void 0===e||null===e)throw new Error("Illegal argument "+e);var r=t.wordsToBytes(n(e,s));return s&&s.asBytes?r:s&&s.asString?i.bytesToString(r):t.bytesToHex(r)}})()}}]);
//# sourceMappingURL=611.6a05e79a.js.map