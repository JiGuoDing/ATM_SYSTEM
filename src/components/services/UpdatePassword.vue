<template>
    <div class="update-password-component">
        <h3>修改密码</h3>
        <div class="inputContainer">
            <div class="container">
                <label for="current-password">当前密码:</label>
                <input v-model="currentPassword" type="password" id="current-password" placeholder="请输入当前密码" />
            </div>
            <div class="container">
                <label for="new-password">新的密码:</label>
                <input v-model="newPassword" type="password" id="new-password" placeholder="请输入新密码" />
            </div>
            <div class="container">
                <label for="confirm-password">确认密码:</label>
                <input v-model="confirmPassword" type="password" id="confirm-password" placeholder="请确认新密码" />
            </div>
        </div>
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
                alert('请输入密码');
            } else if (this.newPassword !== this.confirmPassword) {
                alert('新密码和确认密码不一致');
            } else if (this.currentPassword === this.newPassword) {
                alert('新密码不能和当前密码一样')
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
                        alert(error.response.data.error)
                    })
            }
        },
    },
};
</script>

<style scoped>
.update-password-component {
    padding: 10px;
    background-color: #f2f2f2;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 70vh;
    height: 45vh;
}

.update-password-component:hover {
    background-color: antiquewhite;
}

.update-password-component h3 {
    font-size: 3vh;
}


.update-password-component button {
    padding: 8px 16px;
    background-color: #4caf50;
    color: #fff;
    border: none;
    border-radius: 15px;
    cursor: pointer;
    width: 10vh;
    height: 5vh;
    font-size: 2vh;
    margin-top: 2vh;
}

.update-password-component button:hover {
    background-color: green;
}

.inputContainer {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    align-items: center;
}

.container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 1vh;
    margin-bottom: 1vh;
}

.container input {
    border-radius: 10px;
}

.container label {
    font-size: 2vh;
}
</style>
