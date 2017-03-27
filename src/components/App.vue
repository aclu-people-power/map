
<template>
  <div id="app">
    <toolbar/>
    <loading-screen v-if="this.loading"/>
    <event-map :loaded="this.loaded"/>
  </div>
</template>

<script>
import Vue from 'vue';
import Toolbar from 'components/Toolbar';
import LoadingScreen from 'components/LoadingScreen'

export default {
  name: 'app',
  data: function(){
    return {
      loading: true,
      loaded: () => {
        this.loading = false;
      }
    }
  },
  components: {
    'toolbar': Toolbar,
    'loading-screen': LoadingScreen,
    'event-map': () => import('components/EventMap'),
  }
}
</script>
