(self["webpackChunkfront"]=self["webpackChunkfront"]||[]).push([[590],{8590:function(t,e,r){"use strict";r.r(e),r.d(e,{default:function(){return g}});var s=r(9582),o=r(4886),i=r(4324),n=r(5495),l=function(){var t=this,e=t._self._c;return e("div",{staticClass:"pageTop"},[e(n.Z,{attrs:{src:r(9117)}}),e("h1",[t._v("BANLIST")]),e("h2",[e(i.Z,{attrs:{color:"red"}},[t._v("mdi-cancel")]),t._v(" CARTES INTERDITES")],1),e("panel-cards",{attrs:{cards:t.filterLimit(t.store.cards,"0"),badgeoff:!0,center:!0,tooltip:"text"}}),e("h2",[e(i.Z,{attrs:{color:"red"}},[t._v("mdi-alert")]),t._v(" CARTES LIMITÉS")],1),e("panel-cards",{attrs:{cards:t.filterLimit(t.store.cards,"1"),badgeoff:!0,center:!0,tooltip:"text"}}),e("br"),e("div",{staticClass:"flex-wrap"},t._l(t.getLimitFriendsGroups(t.store.cards),(function(r){return e("div",{key:r.id,staticStyle:{position:"relative",border:"5px solid red",margin:"5px 5px 5px 20px"}},[t._m(0,!0),e("panel-cards",{attrs:{cards:r.cards,badgeoff:!0,center:!1,noflex:!0,tooltip:"text"}})],1)})),0),e("h2",[e(i.Z,{attrs:{color:"yellow"}},[t._v("mdi-star")]),t._v(" CARTES JOKER")],1),e("panel-cards",{attrs:{cards:t.filterLimit(t.store.cards,"K"),badgeoff:!0,center:!0,tooltip:"text"}}),e("h2",[e(i.Z,{attrs:{color:"yellow"}},[t._v("mdi-gift")]),t._v(" CARTES AJOUTÉES DANS LE FORMAT")],1),e("panel-cards",{attrs:{cards:t.store.cards.filter((t=>t.Bonus&&"0"!==t.Limit)),badgeoff:!1,center:!0,tooltip:"text"}}),e(s.Z,{staticClass:"bg"},[e(o.EB,[t._v("Remerciement")]),e(o.ZB,{staticClass:"bg"},[t._v("Ce format a été inventé par Zouloux (07/2023). Le Site Web a été créé par FlorentOutan. (Contactez moi sur discord). Avec la participation de Lockai, Aelle, Tenebros, Bludzee, Yan_Ue4. Utilisation de la base de données : https://db.ygoprodeck.com.")])],1)],1)},a=[function(){var t=this,e=t._self._c;return e("div",{staticStyle:{position:"absolute",top:"-15px",left:"-15px"}},[e("div",{staticClass:"s25",staticStyle:{color:"red","text-align":"center","font-style":"bold","border-radius":"15px",background:"black",outline:"5px solid red"}},[t._v(" 1 ")])])}],d=(r(7658),r(9092)),c=r(1673),u=r(9009),p=r.n(u),f={name:"pageDeck",components:{panelCards:c.Z},data:()=>({store:d.h}),methods:{filterLimit(t,e){let r=t.filter((t=>t.Limit===e&&(!t.LimitFriends||t.LimitFriends.length<1)));return p().sortInverse(r,"OrderIndex")},getLimitFriendsGroups(t){let e=t.filter((t=>t.LimitFriends||t.LimitFriends.length>=1)),r=[];for(let s=0;s<e.length;s++){let o=e[s],i=r.find((t=>t.id===o.LimitFriends));if(!i){let e=o.LimitFriends.split(","),s=t.filter((t=>e.includes(t.IdName)));r.push({id:o.LimitFriends,cards:s})}}return r}}},m=f,v=r(1001),h=(0,v.Z)(m,l,a,!1,null,null,null),g=h.exports},9582:function(t,e,r){"use strict";r.d(e,{Z:function(){return l}});var s=r(3434),o=r(401),i=r(8860),n=r(7678),l=(0,n.Z)(o.Z,i.Z,s.Z).extend({name:"v-card",props:{flat:Boolean,hover:Boolean,img:String,link:Boolean,loaderHeight:{type:[Number,String],default:4},raised:Boolean},computed:{classes(){return{"v-card":!0,...i.Z.options.computed.classes.call(this),"v-card--flat":this.flat,"v-card--hover":this.hover,"v-card--link":this.isClickable,"v-card--loading":this.loading,"v-card--disabled":this.disabled,"v-card--raised":this.raised,...s.Z.options.computed.classes.call(this)}},styles(){const t={...s.Z.options.computed.styles.call(this)};return this.img&&(t.background=`url("${this.img}") center center / cover no-repeat`),t}},methods:{genProgress(){const t=o.Z.options.methods.genProgress.call(this);return t?this.$createElement("div",{staticClass:"v-card__progress",key:"progress"},[t]):null}},render(t){const{tag:e,data:r}=this.generateRouteLink();return r.style=this.styles,this.isClickable&&(r.attrs=r.attrs||{},r.attrs.tabindex=0),t(e,this.setBackgroundColor(this.color,r),[this.genProgress(),this.$slots.default])}})},4886:function(t,e,r){"use strict";r.d(e,{EB:function(){return a},Qq:function(){return n},ZB:function(){return l}});var s=r(9582),o=r(5352);const i=(0,o.Ji)("v-card__actions"),n=(0,o.Ji)("v-card__subtitle"),l=(0,o.Ji)("v-card__text"),a=(0,o.Ji)("v-card__title");s.Z},9009:function(t,e,r){var s=r(4344)["default"];r(7658);class o{static move(t,e,r,s){if(null==t||!t.find((t=>t[e]===r[e])))return t;let o=[];for(let i=0;i<t.length;i++){let n=t[i],l=i===t.length-1?null:t[i+1];l&&l[e]==r[e]&&-1===s||l&&n[e]==r[e]&&1===s?(o.push(l),o.push(n),i++):o.push(n)}return o}}s(o,"initOrderIndex",(t=>{let e=t.filter((t=>t.orderIndex)),r=e.length<1?1:Math.max(...e.map((t=>t.orderIndex))),s=e.length<1?0:Math.min(...e.map((t=>t.orderIndex)));return t.forEach((t=>{t.orderIndex=t.orderIndex&&t.orderIndex>0?t.orderIndex-s:++r})),o.sortInteger(t,"orderIndex")})),s(o,"setId",(t=>{const e=[];let r=1;return!t||t.length<1?[]:(t.forEach((t=>{(void 0===t.id||t.id<1||e.includes(t.id))&&(t.id=r,r++),e.push(t.id)})),t)})),s(o,"sort",((t,e)=>t.sort(((t,r)=>r[e]-t[e])))),s(o,"sortInverse",((t,e)=>t.sort(((t,r)=>t[e]-r[e])))),s(o,"sortInteger",((t,e)=>t.sort(((t,r)=>parseInt(t[e])-parseInt(r[e]))))),s(o,"removeElement",((t,e)=>{t.splice(t.indexOf(e),1)})),s(o,"getElementByProperty",((t,e,r)=>t.find((t=>t[r]==e)))),s(o,"getElementsByProperty",((t,e,r)=>t.filter((t=>t[r]==e)))),s(o,"removeElementByProperty",((t,e,r)=>{let s=o.getElementByProperty(t,e,r);o.removeElement(t,s)})),s(o,"removeDuplicatesObjects",((t,e)=>{let r=[],s=[];return t.forEach((t=>{let o=t[e];s.includes(o)||(s.push(o),r.push(t))})),r})),s(o,"removeDuplicates",(t=>{let e=[];return t.forEach((t=>{e.includes(t)||e.push(t)})),e})),t.exports=o},9117:function(t,e,r){"use strict";t.exports=r.p+"img/RulesTopOnly.54ae2115.jpg"},4344:function(t,e,r){var s=r(1071);function o(t,e,r){return e=s(e),e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}t.exports=o,t.exports.__esModule=!0,t.exports["default"]=t.exports},671:function(t,e,r){var s=r(4614)["default"];function o(t,e){if("object"!==s(t)||null===t)return t;var r=t[Symbol.toPrimitive];if(void 0!==r){var o=r.call(t,e||"default");if("object"!==s(o))return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===e?String:Number)(t)}t.exports=o,t.exports.__esModule=!0,t.exports["default"]=t.exports},1071:function(t,e,r){var s=r(4614)["default"],o=r(671);function i(t){var e=o(t,"string");return"symbol"===s(e)?e:String(e)}t.exports=i,t.exports.__esModule=!0,t.exports["default"]=t.exports},4614:function(t){function e(r){return t.exports=e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},t.exports.__esModule=!0,t.exports["default"]=t.exports,e(r)}t.exports=e,t.exports.__esModule=!0,t.exports["default"]=t.exports}}]);
//# sourceMappingURL=590.b0e93632.js.map