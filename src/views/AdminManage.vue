<template>
    <div id="adminBox">
        <div id="adminHead">
            管理用户
        </div>

        <div id="adminBody">
            <div class="inputContainer">
                <label for="id">身份证号:</label>
                <input v-model="id" type="text" id="id" placeholder="请输入身份证号" />
            </div>

            <div class="inputContainer">
                <label for="name">姓名:</label>
                <input v-model="name" type="text" id="name" placeholder="请输入姓名" />
            </div>

            <div class="inputContainer">
                <label for="nickname">用户名:</label>
                <input v-model="nickname" type="text" id="nickname" placeholder="请输入用户名(可选)" />
            </div>

            <div class="inputContainer">
                <label for="phone">电话号码:</label>
                <input v-model="phone_number" type="tel" id="phone" placeholder="请输入电话号码(可选)" />
            </div>

            <div class="inputContainer">
                <label for="balance">余额:</label>
                <input v-model="balance" type="number" id="balance" placeholder="请输入余额" />
            </div>

            <div class="inputContainer">
                <label for="password">密码:</label>
                <input v-model="password" type="password" id="password" placeholder="请输入密码" />
            </div>

            <div class="inputContainer">
                <label for="email">邮箱:</label>
                <input v-model="email" type="email" id="email" placeholder="请输入邮箱(可选)" />
            </div>
            <button class="btn" @click="submit">提交</button>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'AdminManage',
    components: {},
    data() {
        return {
            id: null,
            name: null,
            nickname: null,
            phone_number: null,
            balance: null,
            password: null,
            email: null,
        }
    },
    methods: {
        submit() {
            const userData = {
                id: this.id,
                name: this.name,
                nickname: this.nickname,
                phone_number: this.phone_number,
                balance: this.balance,
                password: this.password,
                email: this.email,
            }
            if (userData.balance < 0)
                alert('余额不能为负数')
            else {
                axios.post('http://localhost:11001/addUser', userData)
                    .then(response => {
                        console.log(response)
                        alert('账户创建成功')
                    }).catch(error => {
                        console.log(this.$store.state.currentUser.id)
                        console.log(error)
                        if (error.response.data.error === '该身份证已创建帐号')
                            alert('该身份证已创建账户')
                        else if (error.response.data.error === '数据库查询失败')
                            alert('数据库查询失败')
                        else if (error.response.data.error === '用户添加失败')
                            alert('您输入了不正确的数据')
                    })
            }
        }
    }
}
</script>

<style>
#adminBox {
    color: #333;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;

}

#adminHead {
    color: blue;
    margin-bottom: 20px;
    font-size: 30px;
    font-family: 'Cascadia code';
}

#adminBody {
    color: #666;
    display: flex;
    flex-direction: column;
}

.inputContainer {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    width: 300px;
    /* 设置容器的宽度 */
}

.inputContainer label {
    margin-right: 10px;
    min-width: 100px;
    /* 设置标签的最小宽度 */
}

.inputContainer input {
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
    flex-grow: 1;
    /* 让输入框填充剩余空间 */
}
</style>