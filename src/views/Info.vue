<template>
    <div class="groundPage">
        <div class="InfoBox">
            <div class="btns">
                <button class="btn" @click="back2Login">
                    返回登录界面
                </button>
                <button id="back" class="btn" @click="back">
                    管理用户信息
                </button>
            </div>
            <div id="extensionBox">
                <p>所有操作记录</p>
                <component :is=this.recordsComponent class="dataComponent"></component>
                <p>所有用户信息</p>
                <component :is=this.usersComponent class="dataComponent"></component>
                <div class="line"></div>
                <button id="refreshDayLimit" @click="refreshDayLimit">
                    重置所有账户日取款额度
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import RecordsComponent from '@/components/RecordsComponent.vue'
import UsersComponent from '@/components/UsersComponent.vue';
import axios from 'axios';
export default {
    name: "InfoView",
    components: {
        RecordsComponent, UsersComponent
    },
    data() {
        return {
            // 显示记录的组件
            recordsComponent: RecordsComponent,
            usersComponent: UsersComponent
        }
    },

    methods: {
        back() {
            this.$router.push('/AdminManage')
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

        back2Login() {
            this.$router.push('/')
        }
    }
}
</script>

<style>
.groundPage {
    display: flex;
    flex-direction: column;
    margin-top: 0;
}

.InfoBox {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 5vh;
}

.btns {
    display: flex;
    flex-direction: column;
    align-items: center;
}

#extensionBox {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: solid 2px green;
    border-radius: 15px;
    height: 85vh;
    flex: 10;
    overflow: auto;
    margin-right: 10vh;
}

#extensionBox p {
    width: 100%;
    color: blue;
    background-color: gray;
    height: 5vh;
    font-size: 2vh;
    text-align: center;
}

.btn {
    padding: 8px 16px;
    background-color: #4caf50;
    color: #fff;
    border: none;
    border-radius: 15px;
    cursor: pointer;
    width: 17vh;
    height: 6vh;
    font-size: 2vh;
}

.btn:hover {
    background-color: green;
}

#refreshDayLimit {
    background-color: #4caf50;
    color: #fff;
    border: none;
    border-radius: 15px;
    cursor: pointer;
    width: 24vh;
    height: 7vh;
    font-size: 2vh;
    text-align: center;
    margin-bottom: 3vh;
    margin-top: 0;
}

#refreshDayLimit:hover {
    background-color: green;
}

#back {
    margin-top: 10vh;
    margin-left: 3vh;
    margin-right: 3vh;
}

.line {
    height: 1px;
    width: 100%;
    border-top: 2px solid #ccc;
    margin: 20px 0;

}
</style>
