import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import WaxPlugin from './plugins/wax';
import { createPinia } from 'pinia';

const pinia = createPinia();
const app = createApp(App).use(WaxPlugin).use(pinia);

app.mount('#app');
