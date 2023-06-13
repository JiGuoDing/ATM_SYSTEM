<template>
    <div class="transfer-component">
        <h3>转账</h3>
        <label for="transfer-amount">转账金额:</label>
        <input v-model="amount" type="number" id="transfer-amount" placeholder="请输入转账金额" />
        <label for="transfer-id">收款账号:</label>
        <input v-model="id" type="text" id="transfer-id" placeholder="请输入收款账号" />
        <button @click="confirmTransfer">确认</button>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'TransferComponent',
    data() {
        return {
            amount: null,
            id: null,
        };
    },
    methods: {
        confirmTransfer() {
            if (isNaN(this.amount)) {
                alert('请输入数字!')
                this.amount = 0
                this.id = 0
            } else {
                const data = {
                    op_id: this.$store.state.currentUser.id,
                    aim_id: this.id,
                    amount: this.amount
                }
                console.log(data)

                axios.post('http://localhost:11001/Transfer', data)
                    .then(response => {
                        alert(`转账${this.amount}元成功!`)
                        const newBalance = response.data.newBalance
                        const newDayLimit = response.data.newDayLimit
                        this.$store.dispatch('refreshBalance', newBalance)
                        this.$store.dispatch('refreshDayLimit', newDayLimit)
                    }).catch(error => {
                        alert('转账失败!')
                        console.error('error occurred: ', error)
                    })
            }
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
