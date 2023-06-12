import { createRouter, createWebHistory } from 'vue-router'
import Login from '/home/jiguoding/CODE/vue_repository/project_2023_06_12/router/index.js'

const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login
    },
    // 其他路由配置
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
