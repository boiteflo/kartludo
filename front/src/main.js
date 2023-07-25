import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'

Vue.config.productionTip = false

String.prototype.includesX2 = function() {
  return this.toLowerCase().startsWith("x2") || this.toLowerCase().endsWith("x2");
}
String.prototype.cleanup = function() {
  return this.toLowerCase().replace(/[^a-zA-Z0-9]+/g,'');
}

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')