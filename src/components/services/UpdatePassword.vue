<template>
    <div class="update-password-component">
        <h3>修改密码</h3>
        <label for="current-password">当前密码:</label>
        <input v-model="currentPassword" type="password" id="current-password" placeholder="请输入当前密码" />
        <label for="new-password">新密码:</label>
        <input v-model="newPassword" type="password" id="new-password" placeholder="请输入新密码" />
        <label for="confirm-password">确认密码:</label>
        <input v-model="confirmPassword" type="password" id="confirm-password" placeholder="请确认新密码" />
        <button @click="confirmUpdate">确认</button>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'UpdatePasswordComponent',
    data() {
        return {
            currentPassword: null,
            newPassword: null,
            confirmPassword: null,
        };
    },
    methods: {
        confirmUpdate() {
            if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
                alert('请输入完整信息');
            } else if (this.newPassword !== this.confirmPassword) {
                alert('新密码和确认密码不一致');
            } else {
                const data = {
                    id: this.$store.state.currentUser.id,
                    currentPassword: this.currentPassword,
                    newPassword: this.newPassword,
                }

                axios.post('http://localhost:11001/UpdatePsd', data)
                    .then(response => {
                        alert(response.data.message)
                        this.$store.dispatch('updatePsd', this.newPassword)
                    }).catch(error => {
                        console.error('error occurred: ', error)
                        if (error.response.data.error === '当前密码输入错误')
                            alert(error.response.data.error)
                        else if (error.response.data.error === '检查当前密码是否正确时数据库查询失败')
                            alert(error.response.data.error)
                        else if (error.response.data.error === '修改密码时查询数据库失败')
                            alert(error.response.data.error)
                    })
                this.closeUpdatePasswordPopup();
            }

        },
        closeUpdatePasswordPopup() {
            this.$emit('close');
        },
    },
};
</script>

<style scoped>
.update-password-component {
    padding: 10px;
    background-color: #f2f2f2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    border-radius: 8px;
}

.update-password-component h3 {
    margin-bottom: 10px;
}

.update-password-component label {
    display: flex;
    margin-bottom: 5px;
}

.update-password-component input {
    width: 100px;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 10px;
}

.update-password-component button {
    padding: 5px 10px;
    background-color: #4caf50;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    /* 光标为一只手*/
}
</style>
