import 'styles/index';
import 'core-js/es6/promise'
import Vue from 'vue';
import App from 'components/App';

//Just a quick dummy app to make sure vue is working
export default new Vue({
  el: '#app',
  template: '<app></app>',
  components: {
    App
  }
})
