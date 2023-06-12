<template>
    <div id="loginBox">
        <div id="loginHead">
            ATM系统
        </div>
        <div id="loginBody">
            <input class="input" v-model="id" type="text" placeholder="请输入身份证号" />
            <input class="input" v-model="password" type="password" placeholder="请输入密码" />
        </div>
        <div id="btn">
            <button id="lgn" @click="lgn">登录</button>
            <button id="sgu" @click="sgu">注册</button>
        </div>
    </div>
</template>

<script>
const axios = require('axios')
export default {
    name: 'LoginComponent',
    components: {},
    data() {
        return {
            id: null,
            password: null
        }

    },
    // beforeUnmount() {
    //     this.releaseConnxion()
    // },
    methods: {
        lgn() {
            //向数据库查询用户输入的信息
            const LoginData = {
                id: this.id,
                password: this.password
            }

            axios.post('http://localhost:11001/login', LoginData)
                .then((response) => {
                    const user = response.data.user
                    console.log(user.account_type)
                    if (user.account_type === 'admin')
                        this.$router.push('/AdminManage')
                    else
                        this.$router.push('/ServiceView')
                }).catch((error) => {
                    console.log(error.response.data.error)
                    if (error.response.data.error === '密码错误')
                        alert('密码错误')
                    else if (error.response.data.error === '用户不存在')
                        alert('用户名不存在')
                })
        },

        sgu() {
            this.$router.push('/SignUp')
        },

        releaseConnxion() {
            axios.post('http://localhost:11001/releaseConnexion')
        }

    }
}
</script>

<style>
#loginBox {
    color: aqua;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

#loginHead {
    color: blue;
    margin-bottom: 20px;
    font-size: 30px;
    font-family: Cascadia code;
}

#loginBody {
    color: brown;
    display: flex;
    flex-direction: column;
}

.input {
    color: cadetblue;
    margin-top: 20px;
}

#btn {
    margin-top: 20px;
    display: flex
}

#lgn {
    margin-right: 15px;
}

#sgu {
    margin-left: 15px;
}
</style>