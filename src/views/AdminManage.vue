<template>
    <div class="adminBox">
        <div id="addUserBox" class="adminPanel">
            <div class="adminHead">
                添加用户
            </div>

            <div class="adminBody">
                <div class="inputContainer">
                    <label for="id_l">身份证号:</label>
                    <input v-model="id_l" type="text" id="id_l" placeholder="请输入身份证号" />
                </div>

                <div class="inputContainer">
                    <label for="name_l">姓名:</label>
                    <input v-model="name_l" type="text" id="name_l" placeholder="请输入姓名" />
                </div>

                <div class="inputContainer">
                    <label for="nickname_l">用户名:</label>
                    <input v-model="nickname_l" type="text" id="nickname_l" placeholder="请输入用户名(可选)" />
                </div>

                <div class="inputContainer">
                    <label for="phone_l">电话号码:</label>
                    <input v-model="phone_number_l" type="tel" id="phone_l" placeholder="请输入电话号码(可选)" />
                </div>

                <div class="inputContainer">
                    <label for="balance_l">余额:</label>
                    <input v-model="balance_l" type="number" id="balance_l" placeholder="请输入余额" />
                </div>

                <div class="inputContainer">
                    <label for="password_l">密码:</label>
                    <input v-model="password_l" type="text" id="password_l" placeholder="请输入密码" />
                </div>

                <div class="inputContainer">
                    <label for="email_l">邮箱:</label>
                    <input v-model="email_l" type="email" id="email_l" placeholder="请输入邮箱(可选)" />
                </div>

            </div>
            <button class="btn" @click="submit">提交</button>
        </div>

        <div id="ManageUserBox" class="adminPanel">
            <div class="adminHead">
                管理用户信息
            </div>

            <div class="adminBody">
                <div class="inputContainer">
                    <label for="id_r">身份证号:</label>
                    <input v-model="id_r" type="text" id="id_r" placeholder="请输入身份证号" />
                </div>

                <div class="inputContainer">
                    <label for="name_r">姓名:</label>
                    <input v-model="name_r" type="text" id="name_r" placeholder="请输入姓名" />
                </div>

                <div class="inputContainer">
                    <label for="nickname_r">用户名:</label>
                    <input v-model="nickname_r" type="text" id="nickname_r" placeholder="请输入用户名(可选)" />
                </div>

                <div class="inputContainer">
                    <label for="phone_r">电话号码:</label>
                    <input v-model="phone_number_r" type="tel" id="phone_r" placeholder="请输入电话号码(可选)" />
                </div>

                <div class="inputContainer">
                    <label for="balance_r">余额:</label>
                    <input v-model="balance_r" type="number" id="balance_r" placeholder="请输入余额" />
                </div>

                <div class="inputContainer">
                    <label for="password_r">密码:</label>
                    <input v-model="password_r" type="text" id="password_r" placeholder="请输入密码" />
                </div>

                <div class="inputContainer">
                    <label for="email_r">邮箱:</label>
                    <input v-model="email_r" type="email" id="email_r" placeholder="请输入邮箱(可选)" />
                </div>
            </div>

            <div class="btnBox">
                <button class="btn" @click="update">修改</button>
                <button class="btn" @click="query">查询</button>
                <button class="btn" @click="drop">删除</button>
            </div>
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
            id_l: null,
            name_l: null,
            nickname_l: null,
            phone_number_l: null,
            balance_l: null,
            password_l: null,
            email_l: null,

            id_r: null,
            name_r: null,
            nickname_r: null,
            phone_number_r: null,
            balance_r: null,
            password_r: null,
            email_r: null,
        }
    },
    computed: {
        computeUser_l() {
            const user_l = {
                op_id: this.$store.state.currentUser.id,
                id: this.id_l,
                name: this.name_l,
                nickname: this.nickname_l,
                phone_number: this.phone_number_l,
                balance: this.balance_l,
                password: this.password_l,
                email: this.email_l
            }
            return user_l
        },

        computeUser_r() {
            const user_r = {
                op_id: this.$store.state.currentUser.id,
                id: this.id_r,
                name: this.name_r,
                nickname: this.nickname_r,
                phone_number: this.phone_number_r,
                balance: this.balance_r,
                password: this.password_r,
                email: this.email_r
            }
            return user_r
        }
    },
    methods: {
        submit() {
            const userData = this.computeUser_l
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
        },

        update() {
            const userData = this.computeUser_r
            axios.post('http://localhost:11001/UpdateUser', userData)
        },

        query() {
            const userData = this.computeUser_r
            axios.post('http://localhost:11001/QueryUser', userData)
                .then(response => {
                    const data = response.data.UserData
                    this.id_r = data.id,
                        this.name_r = data.name,
                        this.nickname_r = data.nickname,
                        this.phone_number_r = data.phone_number,
                        this.balance_r = data.balance,
                        this.password_r = data.password,
                        this.email_r = data.email
                    console.log('查询账户信息成功')
                    alert('查询账户信息成功')
                }).catch(error => {
                    console.error('查询账户信息失败: ', error.response.data.error)
                    alert('查询账户信息失败')
                })
        },

        drop() {
            const userData = this.computeUser_r
            axios.post('http://localhost:11001/DropUser', userData)
                .then(response => {
                    const message = response.data.message
                    console.log('删除用户成功，已退出删除进程')
                    alert(message)
                }).catch(error => {
                    const err = error.response.data.error
                    console.error('删除用户失败，已退出删除进程: ', error)
                    alert(err)
                })
        }
    }
}
</script>

<style>
.adminBox {
    display: flex;
}

.adminPanel {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.adminHead {
    color: blue;
    margin-bottom: 20px;
    font-size: 20px;
    font-family: 'Cascadia Code';
    text-align: center;
    font-weight: bold;
    width: 120px;
    height: 25px;
    background-color: #f2f2f2;
    /* 添加背景颜色 */
    padding: 10px;
    /* 调整内边距 */
    border: 1px solid #ccc;
    /* 添加边框 */
    border-radius: 4px;
    /* 设置边框圆角 */
}

.adminBody {
    color: #666;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
}

.inputContainer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    width: 300px;
}

.inputContainer label {
    margin-right: 10px;
    min-width: 100px;
}

.inputContainer input {
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
    flex-grow: 1;
}

.btnBox {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}

.btnBox button {
    margin-left: 30px;
}
</style>