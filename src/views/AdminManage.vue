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
                    <input class="account_type" type="text" placeholder="单位:元" readonly />
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

        <div id="extensionBox">
            <p>所有操作记录</p>
            <component :is=this.recordsComponent class="dataComponent"></component>
            <p>所有用户信息</p>
            <component :is=this.usersComponent class="dataComponent"></component>
            <button id="refreshDayLimit" @click="refreshDayLimit">
                重置所有账户日取款额度
            </button>
        </div>

        <div id="ManageUserBox" class="adminPanel">
            <div class="adminHead">
                管理用户信息
            </div>

            <div class="adminBody">
                <div class="inputContainer">
                    <label for="id_r">身份证号:</label>
                    <input v-model="id_r" type="text" id="id_r" placeholder="请输入身份证号" />
                    <input v-model="account_type" class="account_type" type="text" placeholder="账户身份" readonly />
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
                    <input class="account_type" type="text" placeholder="单位:元" readonly />
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
                <button v-if="updatePermission" class="btn" @click="update">修改</button>
                <button class="btn" @click="query">查询</button>
                <button class="btn" id="drop" @click="drop">删除</button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import RecordsComponent from '@/components/RecordsComponent.vue'
import UsersComponent from '@/components/UsersComponent.vue';
export default {
    name: 'AdminManage',
    components: { RecordsComponent, UsersComponent },
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

            account_type: null,

            // 用来判断修改按钮是否显现
            updatePermission: false,

            // 显示记录的组件
            recordsComponent: RecordsComponent,
            usersComponent: UsersComponent
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
            if (userData.id === null || userData.name === null || userData.balance === null || userData.password === null)
                alert('请输入完整的数据')
            else {
                axios.post('http://localhost:11001/addUser', userData)
                    .then(response => {
                        console.log(response)
                        alert('账户创建成功')
                    }).catch(error => {
                        console.log(this.$store.state.currentUser.id)
                        console.log(error)
                        alert(error.response.data.error)
                    })
            }
        },

        update() {
            if (this.id_r === null) {
                alert('请输入用户的身份证号')
            } else {
                const userData = this.computeUser_r
                axios.post('http://localhost:11001/UpdateUser', userData)
                    .then(response => {
                        console.log(response)
                        alert(response.data.message)
                        this.updatePermission = false
                    }).catch(error => {
                        console.error('修改账户信息失败: ', error)
                        alert(error.response.data.error)
                    })
            }

        },

        query() {
            if (this.id_r === null) {
                alert('请输入用户的身份证号')
            } else {
                const userData = this.computeUser_r
                axios.post('http://localhost:11001/QueryUser', userData)
                    .then(response => {
                        const data = response.data.UserData
                        this.id_r = data.id
                        this.name_r = data.name
                        this.nickname_r = data.nickname
                        this.phone_number_r = data.phone_number
                        this.balance_r = data.balance
                        this.password_r = data.password
                        this.email_r = data.email
                        if (data.account_type === 'admin')
                            this.account_type = '管理员'
                        else
                            this.account_type = '普通账户'
                        console.log('查询账户信息成功')
                        alert('查询账户信息成功')
                        this.updatePermission = true
                    }).catch(error => {
                        console.error('查询账户信息失败: ', error.response.data.error)
                        alert(error.response.data.error)
                    })
            }

        },

        drop() {
            if (this.id_r === null) {
                alert('请输入用户的身份证号')
            } else {
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

        },

        refreshDayLimit() {
            const isConfirmed = confirm('确认重置?')
            if (isConfirmed) {
                const userData = {
                    op_id: this.$store.state.currentUser.id
                }
                axios.post('http://localhost:11001/RefreshDayLimit', userData)
                    .then(response => {
                        const message = response.data.message
                        console.log('重置日额度成功')
                        alert(message)
                    }).catch(error => {
                        const err = error.response.data.error
                        console.error('重置日额度失败: ', error)
                        alert(err)
                    })
            } else {
                alert('您已取消重置')
            }

        },
    }
}
</script>

<style>
.adminBox {
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: row;
}

.adminPanel {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 50px;
}

.adminHead {
    color: black;
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
    justify-content: space-around;
    margin-bottom: 20px;
    width: 55vh;
    height: 60vh;
    border: solid 2px blue;
}

.inputContainer {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
    width: 40vh;
}

.inputContainer label {
    margin-right: 10px;
    min-width: 100px;
}

.inputContainer input {
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 10px;
    flex-grow: 1;
}

.btnBox {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}

.account_type {
    color: green;
    text-align: center;
    font-size: 10px;
    margin-left: 10px;
    width: 50px;
    height: 8px;
}

#extensionBox {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: solid 2px green;
    height: 80vh;
}

#showRecentRecord {
    margin-bottom: 20px;
}

#refreshDayLimit {
    margin-top: 20px;
}

.dataComponent {
    overflow: auto;
    height: 400px;
}

#extensionBox p {
    width: 100%;
    color: blue;
    background-color: gray;
}

.btnBox {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    width: 45vh;
}

.btn {
    padding: 8px 16px;
    background-color: #4caf50;
    color: #fff;
    border: none;
    border-radius: 15px;
    cursor: pointer;
    width: 10vh;
    height: 5vh;
    font-size: 20px;
    margin-top: 2vh;
}

.btn:hover {
    background-color: green;
}

#refreshDayLimit {
    padding: 8px 16px;
    background-color: #4caf50;
    color: #fff;
    border: none;
    border-radius: 15px;
    cursor: pointer;
    width: 12vh;
    height: 7vh;
    font-size: 20px;
    margin-top: 2vh;
}

#refreshDayLimit:hover {
    background-color: green;
}

#drop {
    background-color: orange;
}

#drop:hover {
    background-color: red;
}
</style>