import { createApp } from 'vue'
import App from './App.vue'
import router from '../router' // 导入路由配置文件

createApp(App)
    .use(router) // 使用路由
    .mount('#app')
