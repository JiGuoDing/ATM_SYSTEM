import { createRouter, createWebHistory } from 'vue-router'
import { LoginComponent } from '/home/jiguoding/CODE/vue_repository/project_2023_06_12/src/components/LoginComponent.vue'
import SignUpComponent from '/home/jiguoding/CODE/vue_repository/project_2023_06_12/src/components/SignUpComponent.vue'
const routes = [

    // 登陆界面
    {
        path: '/Login',
        name: 'Login',
        component: LoginComponent

    },

    // 注册界面
    {
        path: '/SignUp',
        name: 'SignUp',
        component: SignUpComponent
    }
    // 其他路由配置
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
