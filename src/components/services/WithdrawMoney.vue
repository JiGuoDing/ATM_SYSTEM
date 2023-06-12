<template>
    <div class="withdraw-component">
        <h3>取款</h3>
        <label for="withdraw-amount">取款金额:</label>
        <input v-model="amount" type="number" id="withdraw-amount" placeholder="请输入取款金额" />
        <button @click="confirmWithdraw">确认</button>
    </div>
</template>

<script>
export default {
    name: 'WithdrawComponent',
    data() {
        return {
            amount: null,
        };
    },
    methods: {
        confirmWithdraw() {
            if (!this.amount) {
                alert('请输入取款金额');
                return;
            }
            // 在这里执行取款操作，可以将取款金额发送给后端进行处理
            alert(`成功取款 ${this.amount} 元`);
            // 取款操作完成后，可以关闭弹窗或执行其他操作
            this.closeWithdrawPopup();
        },
        closeWithdrawPopup() {
            this.$emit('close');
        },
    },
};
</script>

<style scoped>
.withdraw-component {
    padding: 10px;
    background-color: #f2f2f2;
    border-radius: 8px;
}

.withdraw-component h3 {
    margin-bottom: 10px;
}

.withdraw-component label {
    display: block;
    margin-bottom: 5px;
}

.withdraw-component input {
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 10px;
}

.withdraw-component button {
    padding: 5px 10px;
    background-color: #4caf50;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}
</style>
