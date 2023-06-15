<template>
    <div class="tableContainer">
        <table class="UserTable">
            <thead>
                <tr class="myTr">
                    <th>用户ID</th>
                    <th>用户名</th>
                    <th> 余额(单位:元) </th>
                    <th> 邮箱 </th>
                    <th>当日额度(单位:元)</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in this.users" :key="user.id" class="myTr">
                    <td>{{ user.id }}</td>
                    <td>{{ user.name }}</td>
                    <td>{{ user.balance }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ user.day_limit }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'UsersComponent',
    components: {},
    data() {
        return {
            users: [],
        };
    },
    mounted() {
        this.fetchUsers()
        setInterval(this.fetchUsers, 2000)
    },
    methods: {
        fetchUsers() {
            axios.post('http://localhost:11001/FetchUsers')
                .then(response => {
                    this.users = response.data.data
                }).catch(error => {
                    console.error('获取用户失败: ', error)
                    alert(error.response.data.error)
                })
        },
    },
};
</script>

<style>
.tableContainer {
    height: 300px;
    overflow: auto;
    border: 2px solid rebeccapurple;
    border-radius: 8px;
}

.UserTable {
    border-collapse: collapse;
    width: 125vh;
}

.myTr td {
    padding: 0 15px;
    /*
    第一个参数表示上下内边距
    第二个参数标识左右内边距
    */
    height: auto;
    width: auto;
    text-overflow: ellipsis;
    font-size: 17px;
    border: solid 1px lightgrey;
}

.myTr th {
    padding: 0 10px;
    /*
    第一个参数表示上下内边距
    第二个参数标识左右内边距
    */
    height: auto;
    width: auto;
    text-overflow: ellipsis;
}
</style>
