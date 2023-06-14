<template>
    <div class="balance-component">
        <h2>余额查询</h2>
        <p>您的余额是 {{ balance }} 元</p>
        <button @click="refreshBalance">刷新</button>
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
    padding: 10px;
    background-color: #f2f2f2;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    width: 70vh;
    height: 45vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.balance-component h2 {
    font-size: 30px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
}

.balance-component p {
    font-size: 26px;
    color: rebeccapurple;
    margin-bottom: 20px;
    padding: 1vh 1vh;
    border: solid 2px green;
}

.balance-component:hover {
    background-color: antiquewhite;
}

.balance-component button {
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

.balance-component button:hover {
    background-color: green;
}
</style>
