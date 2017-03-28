import 'styles/index';
import 'core-js/es6/promise';
import Toolbar from 'components/Toolbar';
import LoadingBar from 'components/LoadingBar';
import EventMap from 'components/EventMap';
import EventList from 'components/EventList';
import store from 'src/store.js';

let toolbar = Toolbar(store);
let loadingBar = LoadingBar(store);
let eventMap = EventMap(store);
let eventList = EventList(store);

if (module.hot) {
  module.hot.accept();
}
