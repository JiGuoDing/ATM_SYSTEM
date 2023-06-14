import { createRouter, createWebHistory } from 'vue-router'
import LoginComponent from '/home/jiguoding/CODE/vue_repository/project_2023_06_12/src/components/LoginComponent.vue'
import ServiceView from '/home/jiguoding/CODE/vue_repository/project_2023_06_12/src/views/ServiceView.vue'
import AdminManage from '/home/jiguoding/CODE/vue_repository/project_2023_06_12/src/views/AdminManage.vue'
const routes = [

    // 登陆界面
    {
        path: '/',
        name: 'Login',
        component: LoginComponent
    },

    // 服务界面
    {
        path: '/ServiceView',
        name: 'ServiceView',
        component: ServiceView
    },

    // 管理员管理界面
    {
        path: '/AdminManage',
        name: 'AdminManage',
        component: AdminManage
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
