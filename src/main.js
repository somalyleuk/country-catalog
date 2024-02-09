import { createApp } from 'vue'
import App from './App.vue'
import router from "./router";
import './index.css';
import { createStore } from 'vuex';

const store = createStore();


createApp(App)
  .use(router)
  .use(store)
  .mount('#app')