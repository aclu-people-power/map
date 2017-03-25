import Vue from 'vue';
import App from './App.vue';

console.debug('starting vue');
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
