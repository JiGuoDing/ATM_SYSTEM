import { createApp } from 'vue'
import App from '../App.vue'
import router from '../router'

createApp(App)
    .use(router) // 使用路由
    .mount('#app')
