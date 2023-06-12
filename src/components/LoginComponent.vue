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
    beforeUnmount() {
        this.releaseConnxion()
    },
    methods: {
        lgn() {
            //向数据库查询用户输入的信息
            const LoginData = {
                id: this.id,
                password: this.password
            }

            axios.post('http://localhost:11001/login', LoginData)
                .then((response) => {
                    //TODO 登录成功
                    console.log('登录成功', response)

                }).catch((error) => {
                    //登录失败
                    console.log('登陆失败: ', error)
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