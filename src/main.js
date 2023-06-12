import { createApp } from 'vue'
import App from '../App.vue'
import router from '../router'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

createApp(App)
    .use(router) // 使用路由
    .use(ElementPlus) // 使用ElementPlus
    .mount('#app')
