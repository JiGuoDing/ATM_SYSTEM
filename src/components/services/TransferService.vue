<template>
    <div class="transfer-component">
        <h3>转账</h3>
        <label for="transfer-amount">转账金额:</label>
        <input v-model="amount" type="number" id="transfer-amount" placeholder="请输入转账金额" />
        <label for="transfer-account">收款账号:</label>
        <input v-model="account" type="text" id="transfer-account" placeholder="请输入收款账号" />
        <button @click="confirmTransfer">确认</button>
    </div>
</template>

<script>
export default {
    name: 'TransferComponent',
    data() {
        return {
            amount: null,
            account: null,
        };
    },
    methods: {
        confirmTransfer() {
            if (!this.amount || !this.account) {
                alert('请输入转账金额和收款账号');
                return;
            }
            // 在这里执行转账操作，可以将转账金额和收款账号发送给后端进行处理
            alert(`成功向账号 ${this.account} 转账 ${this.amount} 元`);
            // 转账操作完成后，可以关闭弹窗或执行其他操作
            this.closeTransferPopup();
        },
        closeTransferPopup() {
            this.$emit('close');
        },
    },
};
</script>

<style scoped>
.transfer-component {
    padding: 10px;
    background-color: #f2f2f2;
    border-radius: 8px;
}

.transfer-component h3 {
    margin-bottom: 10px;
}

.transfer-component label {
    display: block;
    margin-bottom: 5px;
}

.transfer-component input {
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 10px;
}

.transfer-component button {
    padding: 5px 10px;
    background-color: #4caf50;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}
</style>
