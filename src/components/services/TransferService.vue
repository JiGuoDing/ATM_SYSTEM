<template>
    <div class="transfer-component">
        <div class="inputContainer">
            <h3>转账</h3>
            <div class="container">
                <label for="transfer-amount">转账金额:</label>
                <input v-model="amount" type="number" id="transfer-amount" placeholder="请输入转账金额" />
            </div>
            <div class="container">
                <label for="transfer-id">收款账号:</label>
                <input v-model="id" type="text" id="transfer-id" placeholder="请输入收款账号" />
            </div>
        </div>

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
                if (this.amount < 0) {
                    alert('转账数额不能为负!')
                } else {
                    if (this.id === null) {
                        alert('请输入对方的身份证号')
                    } else {
                        if (this.id.length != 18) {
                            alert('请输入正确的身份证号')
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
                                    alert(error.response.data.error)
                                    console.error('error occurred: ', error)
                                })
                        }
                    }
                }
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
    width: 70vh;
    height: 45vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.transfer-component:hover {
    background-color: antiquewhite;
}

.transfer-component button {
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

.transfer-component button:hover {
    background-color: green;
}

.inputContainer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.inputContainer h3 {
    margin-bottom: 10px;
    font-size: 3vh;
}

.container {
    margin-top: 2vh;
    margin-bottom: 2vh;
}

.container label {
    font-size: 2vh;
    margin-bottom: 2vh;
}

.container input {
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 10px;
    height: 2.5vh;
}
</style>
