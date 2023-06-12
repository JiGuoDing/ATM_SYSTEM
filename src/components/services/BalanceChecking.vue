<template>
    <div class="balance-component">
        <h3>余额查询</h3>
        <p>您的余额是 {{ balance }} 元</p>
        <button @click="refreshBalance">刷新余额</button>
    </div>
</template>

<script>
export default {
    name: 'BalanceComponent',
    data() {
        return {
            balance: 0,
        };
    },
    methods: {
        refreshBalance() {
            // 模拟异步请求获取最新余额
            setTimeout(() => {
                this.balance = Math.floor(Math.random() * 1000); // 随机生成一个余额值
            }, 1000);
        },
    },
};
</script>

<style scoped>
.balance-component {
    width: 300px;
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
    color: #666;
    margin-bottom: 20px;
}

.balance-component button {
    padding: 8px 16px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.balance-component button:hover {
    background-color: #0056b3;
}
</style>
