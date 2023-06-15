<template>
    <div id="ServiceBox">
        <div class="ItemBox">
            <div class="serviceItem" @click="selectedService = 'balance'">
                <h2>余额查询</h2>
            </div>
            <div class="serviceItem" @click="selectedService = 'deposit'">
                <h2>存款</h2>
            </div>
            <div class="serviceItem" @click="selectedService = 'withdraw'">
                <h2>取款</h2>
            </div>
            <div class="serviceItem" @click="selectedService = 'transfer'">
                <h2>转账</h2>
            </div>
            <div class="serviceItem" @click="selectedService = 'updatePassword'">
                <h2>修改密码</h2>
            </div>
        </div>
        <div class="btnDiv" id="backBtn">
            <button class="btn" @click="back2Login">
                返回登录界面
            </button>
        </div>

        <div class="serviceComponent">
            <!-- 使用动态组件根据选中的服务项渲染相应的组件 -->
            <component :is="selectedServiceComponent"></component>
        </div>
    </div>
</template>

<script>
import BalanceChecking from '@/components/services/BalanceChecking.vue'
import TransferComponent from '@/components/services/TransferService.vue'
import WithdrawComponent from '@/components/services/WithdrawMoney.vue'
import DepositComponent from '@/components/services/DepositMoney.vue'
import UpdatePasswordComponent from '@/components/services/UpdatePassword.vue'
export default {
    name: 'ServiceView',
    components: {},
    data() {
        return {
            selectedService: null, // 存储选中的服务项
        }
    },
    computed: {
        // 根据选中的服务项返回相应的组件名称
        selectedServiceComponent() {
            switch (this.selectedService) {
                case 'balance':
                    return BalanceChecking;
                case 'deposit':
                    return DepositComponent;
                case 'withdraw':
                    return WithdrawComponent;
                case 'transfer':
                    return TransferComponent;
                case 'updatePassword':
                    return UpdatePasswordComponent;
                default:
                    return null;
            }
        },
    },

    methods: {
        back2Login() {
            this.$router.push('/')
        },
    },
}
</script>

<style>
#ServiceBox {
    display: flex;
    height: 100vh;
    overflow: auto;
}

.ItemBox {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: flex-start;
    overflow: auto;
    padding: 20px;
}

.serviceItem {
    width: 200px;
    height: 200px;
    margin: 20px;
    padding: 20px;
    border-radius: 100px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: background-color 0.3s ease;
    background-color: yellowgreen;
}

.serviceItem:hover {
    background-color: green;
}

.serviceItem h2 {
    font-size: 30px;
    font-weight: bold;
    color: #333;
    text-align: center;
}

.serviceComponent {
    flex: 7;
    padding: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: auto;
}

#backBtn {
    margin-left: 2vh;
    margin-right: 2vh;
}
</style>