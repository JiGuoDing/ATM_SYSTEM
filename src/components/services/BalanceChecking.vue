<template>
    <div class="balance-component">
        <h3>余额查询</h3>
        <p>您的余额是 {{ balance }} 元</p>
        <button @click="refreshBalance">刷新余额</button>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'BalanceComponent',
    data() {
        return {
            balance: this.$store.state.currentUser.balance,
        };
    },
    methods: {
        refreshBalance() {
            const user = this.$store.state.currentUser
            // 获取最新的余额
            axios.post('http://localhost:11001/refreshBalance', user)
                .then(response => {
                    console.log(response)
                    const newBalance = response.data.result0.balance
                    this.balance = newBalance
                    this.$store.dispatch('refreshBalance', newBalance)
                }).catch(error => {
                    console.error('error occured when refreshing: ', error.response.data.error)
                    alert('刷新失败')
                })
        },
    },
};
</script>

<style scoped>
.balance-component {
    padding: 20px;
    background-color: #f2f2f2;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.balance-component h3 {
    font-size: 20px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
}

.balance-component p {
    font-size: 16px;
    color: rebeccapurple;
    margin-bottom: 20px;
}

.balance-component button {
    padding: 8px 16px;
    background-color: #4caf50;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.balance-component button:hover {
    background-color: #4caf50;
}
</style>
