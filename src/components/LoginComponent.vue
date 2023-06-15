<template>
    <div class="groundPage">
        <div id="loginBox">
            <div id="loginHead" :style="{ color: this.font_color }">
                <h3>ATM系统</h3>
            </div>
            <div id="loginBody">
                <input class="input" v-model="id" type="text" placeholder="请输入身份证号" />
                <input class="input" v-model="password" type="password" placeholder="请输入密码" />
            </div>
            <button class="bt" @click="lgn" @mouseenter="changeColor" @mouseleave="changeColor">登录</button>
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
            password: null,
            font_color: 'pink'
        }
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
                    const user = response.data.user
                    console.log(user)
                    this.$store.dispatch('login', user)
                    console.log(user.account_type)
                    if (user.account_type === 'admin')
                        this.$router.push('/InfoView')
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

        releaseConnxion() {
            axios.post('http://localhost:11001/releaseConnexion')
        },

        changeColor() {
            if (this.font_color === 'pink')
                this.font_color = 'blue'
            else
                this.font_color = 'pink'
        }

    }
}
</script>

<style>
.groundPage {
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
    height: 100vh;
}

.description {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url(/home/jiguoding/CODE/vue_repository/project_2023_06_12/src/assets/bkgd1.jpg);
    background-size: cover;
    background-repeat: no-repeat;
    height: 80vh;
}

#loginBox {
    color: aqua;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: auto;
    flex: 1;
    background-image: url('@/assets/ATM.jpg');
    background-size: cover;
    background-repeat: no-repeat;
}

#loginHead {
    color: whitesmoke;
    font-size: 10vh;
    font-family: Cascadia code;
    height: 10vh;
    display: flex;
    justify-content: center;
    flex-direction: column;
}

#loginHead h3 {
    margin-top: 0;
    margin-bottom: 20vh;
}

#loginBody {
    color: brown;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 50vh;
    height: 30vh;
}

.input {
    color: cadetblue;
    font-size: 2.5vh;
    margin-top: 20px;
    width: 30vh;
    height: 4vh;
    border-radius: 8px;
    border: solid 2px blueviolet;
}



.bt {
    width: 10vh;
    height: 6vh;
    font-size: 2vh;
    border-radius: 5px;
    cursor: pointer;
}

.bt:hover {
    background-color: gold;
}

/*
flex-direction：用于设置主轴的方向。默认值是 row，表示子元素在水平方向上从左到右排列，如果设置为 column，则表示子元素在垂直方向上从上到下排列。

justify-content：用于设置子元素在主轴上的对齐方式。它控制子元素沿主轴的水平方向上的对齐方式。常见的取值包括：
flex-start：子元素靠主轴起始位置对齐。
flex-end：子元素靠主轴结束位置对齐。
center：子元素在主轴上居中对齐。
space-between：子元素平均分布在主轴上，首尾子元素分别靠近主轴的起始和结束位置。
space-around：子元素平均分布在主轴上，子元素之间和首尾子元素与主轴的边距相等。

align-items：用于设置子元素在交叉轴上的对齐方式。它控制子元素沿交叉轴的垂直方向上的对齐方式。常见的取值包括：
flex-start：子元素靠交叉轴起始位置对齐。
flex-end：子元素靠交叉轴结束位置对齐。
center：子元素在交叉轴上居中对齐。
baseline：子元素按照它们的基线对齐。
stretch：子元素被拉伸以填充交叉轴的整个空间。

*/
</style>