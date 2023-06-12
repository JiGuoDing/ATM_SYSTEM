const express = require('express')
const mysql = require('mysql')

// 创建Express应用
const app = express()

// 创建mysql连接池
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'hotelSystemDB'
})

pool.getConnection((err, connection) => {
    if (err) {
        console.log('error happened when connecting: ', err)
    } else {
        console.log('connected to DB :)')
        connection.release()
    }
})

app.get()

app.listen(11001, () => {
    console.log('mysql server is running on port 11001')
})
