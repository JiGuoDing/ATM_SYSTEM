import { createApp } from 'vue'
import App from '../App.vue'
import router from '../router'
import store from './store';

createApp(App)
    .use(router) // 使用路由
    .use(store)
    .mount('#app')
