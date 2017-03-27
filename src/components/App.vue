
<template>
  <div id="app">
    <toolbar/>
    <loading-screen v-if="this.loading"/>
    <event-map :loaded="this.loaded" :updateEvents="this.updateEvents" :events="this.events" :updateCodes="this.updateCodes" :codes="this.codes"/>
  </div>
</template>

<script>
import Vue from 'vue';
import Toolbar from 'components/Toolbar';
import LoadingScreen from 'components/LoadingScreen'

export default {
  name: 'app',
  props: ['state','actions'],
  data: function() {
    return {
      loading: true,
      events: [],
      codes: {},
      loaded: () => {
        this.loading = false;
      },
      updateEvents: (events) => {
        this.events = events;
      },
      updateCodes: (codes) => {
        this.codes = codes;
      }
    }
  },
  components: {
    'toolbar': Toolbar,
    'loading-screen': LoadingScreen,
    //FIXME: Async load EventMap... this is just proof of concept of code splitting
    //and async component loading. Can refactor after we better decide on real component
    //layout.
    'event-map': () => import('components/EventMap'),
  }
}
</script>
