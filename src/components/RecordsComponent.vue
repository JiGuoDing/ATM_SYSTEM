<template>
    <div>
        <table>
            <thead>
                <tr class="myTr">
                    <th>记录ID</th>
                    <th>操作用户ID</th>
                    <th> 目标用户ID </th>
                    <th> 操作类型 </th>
                    <th>操作金额(单位:元)</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="record in this.op_Records" :key="record.rcd_id" class="myTr">
                    <td>{{ record.rcd_id }}</td>
                    <td>{{ record.op_user_id }}</td>
                    <td>{{ record.aim_user_id }}</td>
                    <td>{{ record.op_type }}</td>
                    <td>{{ record.op_amount }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'RecordsComponent',
    components: {},
    data() {
        return {
            op_Records: [],
        };
    },
    mounted() {
        this.fetchRecords()
        setInterval(this.fetchRecords, 2000)
    },
    methods: {
        fetchRecords() {
            axios.post('http://localhost:11001/FetchRecords')
                .then(response => {
                    this.op_Records = response.data.data
                }).catch(error => {
                    console.error('获取操作记录失败: ', error)
                    alert(error.response.data.error)
                })
        },
    },
};
</script>

<style>
.myTr td {
    padding: 0 15px;
    /*
    第一个参数表示上下内边距
    第二个参数标识左右内边距
    */
    height: auto;
    width: auto;
    text-overflow: ellipsis;
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
