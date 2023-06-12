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
                alert('请输入当前密码和新密码');
                return;
            }
            if (this.newPassword !== this.confirmPassword) {
                alert('新密码和确认密码不一致');
                return;
            }
            // 在这里执行密码修改操作，可以将当前密码和新密码发送给后端进行处理
            alert('密码修改成功');
            // 密码修改完成后，可以关闭弹窗或执行其他操作
            this.closeUpdatePasswordPopup();
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
    border-radius: 8px;
}

.update-password-component h3 {
    margin-bottom: 10px;
}

.update-password-component label {
    display: block;
    margin-bottom: 5px;
}

.update-password-component input {
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
}
</style>
