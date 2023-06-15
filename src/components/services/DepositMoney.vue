<template>
    <div class="deposit-component">
        <h3>存款</h3>
        <label for="deposit-amount">存款金额:</label>
        <input v-model="amount" type="number" id="deposit-amount" placeholder="请输入存款金额" />
        <button @click="confirmDeposit">确认</button>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'DepositComponent',
    data() {
        return {
            amount: null,
        };
    },
    methods: {
        confirmDeposit() {
            if (this.amount <= 0) {
                alert('存款数额需大于0元');
                return;
            } else {
                const isConfirmed = confirm(`确认存款${this.amount}元?`)
                if (isConfirmed) {
                    // 确认取款
                    const data = {
                        id: this.$store.state.currentUser.id,
                        amount: this.amount,
                    }
                    console.log(data)
                    axios.post('http://localhost:11001/Deposit', data)
                        .then((response) => {
                            // 存款成功且操作被记录
                            alert(response.data.message)
                            const newBalance = this.$store.state.currentUser.balance + this.amount
                            this.$store.dispatch('refreshBalance', newBalance)
                        }).catch(error => {
                            console.error('存款失败', error)
                        })
                } else {
                    // 取消取款
                    alert('您已取消存款')
                }
            }
        },
    },
};
</script>

<style scoped>
.deposit-component {
    padding: 10px;
    background-color: #f2f2f2;
    border-radius: 8px;
    width: 70vh;
    height: 45vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.deposit-component:hover {
    background-color: antiquewhite;
}

.deposit-component h3 {
    font-size: 30px;
}

.deposit-component label {
    display: block;
    margin-bottom: 2vh;
    font-size: 25px;
}

.deposit-component input {
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 10px;
    margin-bottom: 10px;
    width: 20vh;
    height: 3vh;
    font-size: 2vh;
}

.deposit-component button {
    padding: 5px 10px;
    background-color: #4caf50;
    color: #fff;
    border: none;
    border-radius: 15px;
    font-size: 1.5vh;
    margin-top: 2vh;
    width: 10vh;
    height: 5vh;
    cursor: pointer;
}

.deposit-component button:hover {
    background-color: green;
}
</style>
