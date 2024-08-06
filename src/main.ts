import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import WaxPlugin from './plugins/wax';
import router from './router/router';
import { createPinia } from 'pinia';

const pinia = createPinia();
const app = createApp(App).use(WaxPlugin).use(router).use(pinia);

app.mount('#app');
