import 'styles/index';
import 'core-js/es6/promise';
import Vue from 'vue';
import Vuex from 'vuex';
import Toolbar from 'components/Toolbar';
import LoadingBar from 'components/LoadingBar';
import EventMap from 'components/EventMap';

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    events: {},
    zipcodes: [],
    loading: true,
    count: 1
  },
  mutations: {
    increment (state) {
      state.count++
    },
    decrement (state) {
      state.count--
    },
    loaded (state) {
      state.loading = false
    }
  }
})

let toolbar = Toolbar(store);
let loadingBar = LoadingBar(store);
let eventMap = EventMap(store);

// export default new Vue({
//   name: 'app',
//   el: '#app',
//   props: ['state','actions'],
//   data: function() {
//     return {
//       loading: true,
//       events: [],
//       codes: {},
//       loaded: () => {
//         this.loading = false;
//       },
//       updateEvents: (events) => {
//         this.events = events;
//       },
//       updateCodes: (codes) => {
//         this.codes = codes;
//       }
//     }
//   },
//   components: {
//     'toolbar': Toolbar,
//     'loading-screen': LoadingScreen,
//     //FIXME: Async load EventMap... this is just proof of concept of code splitting
//     //and async component loading. Can refactor after we better decide on real component
//     //layout.
//     'event-map': () => import('components/EventMap'),
//   }
// })
//
if (module.hot) {
  module.hot.accept();
}
