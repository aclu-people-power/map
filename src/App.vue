
<template>
  <div id="app">
    <app-header/>
    <events-map/>
  </events-map/>
  </div>
</template>

<script>
import EventsMap from './components/EventsMap';
import AppHeader from './components/AppHeader';

export default {
  name: 'app',
  components: {
    AppHeader,
    EventsMap
  }
}
</script>

<style lang="scss">
@import "~normalize.css";
@import "~styles/fonts";
@import "~styles/icons";

body {
  font-family: "Freight Sans CMP";
  font-size: 16px;
}

#app {
  padding: 25px;
}
</style>
