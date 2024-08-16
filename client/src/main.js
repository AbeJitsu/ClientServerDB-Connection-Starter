import Vue from 'vue';
import { createPinia, PiniaVuePlugin } from 'pinia';

import App from './App.vue';
import router from './router';

import './assets/main.css';

// Install Pinia as a Vue plugin
Vue.use(PiniaVuePlugin);

// Create a Pinia instance
const pinia = createPinia();

// Initialize the Vue instance with Pinia
new Vue({
  router,
  pinia,
  render: (h) => h(App),
}).$mount('#app');
