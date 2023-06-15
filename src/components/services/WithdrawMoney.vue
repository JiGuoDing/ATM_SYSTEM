<template>
    <div class="withdraw-component">
        <h3>取款</h3>
        <h2>
            今日取款限额还剩:{{ this.$store.state.currentUser.day_limit }}元
        </h2>
        <label for="inputContainer">取款金额:</label>
        <div class="inputContainer">
            <div class="container">
                <input type="radio" id="option-500" value="500" v-model="selectedAmount">
                <label for="option-500">500元</label>
            </div>

            <div class="container">
                <input type="radio" id="option-1000" value="1000" v-model="selectedAmount">
                <label for="option-1000">1000元</label>
            </div>

            <div class="container">
                <input type="radio" id="option-1500" value="1500" v-model="selectedAmount">
                <label for="option-1500">1500元</label>
            </div>
            <div class="container">
                <input type="radio" id="option-custom" value="custom" v-model="selectedAmount">
                <label for="option-custom">其他金额</label>
            </div>
            <input v-if="selectedAmount === 'custom'" v-model.number="customAmount" type="number"
                id="withdraw-custom-amount" placeholder="请输入取款金额" />
        </div>
        <button @click="confirmWithdraw">确认</button>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'WithdrawComponent',
    data() {
        return {
            selectedAmount: '1000',
            customAmount: null
        };
    },
    methods: {
        confirmWithdraw() {
            let amount;
            if (this.selectedAmount === 'custom') {
                amount = this.customAmount;
            } else {
                amount = this.selectedAmount;
            }
            if (amount <= 0)
                alert('取款数额需大于0')
            else {
                const isConfirmed = confirm(`确认取款${amount}元?`)
                if (isConfirmed) {
                    const data = {
                        id: this.$store.state.currentUser.id,
                        amount: amount
                    }
                    axios.post('http://localhost:11001/Withdraw', data)
                        .then(response => {
                            console.log(response)
                            alert(`取款${amount}元成功`)
                            const newDayLimit = response.data.newDayLimit
                            const newBalance = response.data.newBalance
                            this.$store.dispatch('refreshBalance', newBalance)
                            this.$store.dispatch('refreshDayLimit', newDayLimit)
                        }).catch(error => {
                            console.error('取款失败: ', error)
                            alert(error.response.data.error)
                        })
                } else {
                    alert('您已取消取款')
                }
            }
        },
    }
};
</script>

<style scoped>
.withdraw-component {
    padding: 10px;
    background-color: #f2f2f2;
    border-radius: 8px;
    width: 70vh;
    height: 65vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.withdraw-component:hover {
    background-color: antiquewhite;
}

.withdraw-component h3 {
    margin-bottom: 10px;
    font-size: 3vh;
}

.withdraw-component h2 {
    color: green;
}

.withdraw-component label {
    font-size: 20px;
}

.withdraw-component button {
    padding: 5px 10px;
    background-color: #4caf50;
    color: #fff;
    border: none;
    border-radius: 15px;
    cursor: pointer;
    margin-top: 1vh;
    width: 10vh;
    height: 5vh;
    font-size: 2vh;
    text-align: center;
}

.withdraw-component button:hover {
    background-color: green;
}

.inputContainer {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
}

.container {
    display: flex;
    flex-direction: row;
    margin-top: 1vh;
    margin-bottom: 1vh;
    align-items: center;
}

.container input[type="radio"] {
    width: auto;
}
</style>
