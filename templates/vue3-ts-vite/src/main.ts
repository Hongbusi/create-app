import { createApp } from 'vue';
import App from './App.vue';
import Router from './router';
import './index.css';

const app = createApp(App);

app.use(Router).mount('#app');
