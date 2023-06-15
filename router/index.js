import { createRouter, createWebHistory } from 'vue-router'
import LoginComponent from '@/components/LoginComponent.vue'
import ServiceView from '@/views/ServiceView.vue'
import AdminManage from '@/views/AdminManage.vue'
import InfoView from '@/views/Info.vue'
const routes = [

    // 登陆界面
    {
        path: '/',
        name: 'Login',
        component: LoginComponent,
    },

    // 服务界面
    {
        path: '/ServiceView',
        name: 'ServiceView',
        component: ServiceView,
    },

    // 管理员管理界面
    {
        path: '/AdminManage',
        name: 'AdminManage',
        component: AdminManage
    },

    // 管理员查看所有信息界面
    {
        path: '/InfoView',
        name: 'InfoView',
        component: InfoView
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})


export default router
