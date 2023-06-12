const express = require('express')
const mysql = require('mysql')
const cors = require('cors')

// 创建Express应用
const app = express()

app.use(express.json());

// 使用 cors 中间件
app.use(cors());

// 创建mysql连接池
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'hotelSystemDB'
})

// 连接数据库
pool.getConnection((err, connection) => {
    if (err) {
        // 连接失败
        console.log('error happened when connecting: ', err)
    } else {
        // 连接成功
        console.log('connected to DB :)')
        conn = connection
    }
})


// 检查登录信息
app.post('/login', (req, res) => {
    const data = req.body
    const queryAccountExistence = "select * from account where id = ?"
    pool.query(queryAccountExistence, [data.id], (error, result0) => {
        if (error) {
            console.error('DB query error!', error)
            res.status(500).json({ error: 'Internal server error' })
        } else {
            if (result0.length <= 0) {
                console.log('该账户不存在')
                res.status(500).json({ error: '用户不存在' })
            } else {
                const queryAccountAccuracy = "select * from account where id = ? and password = ?"
                pool.query(queryAccountAccuracy, [data.id, data.password], (error, result1) => {
                    if (error) {
                        console.error('DB query error!', error)
                    } else {
                        if (result1.length > 0) {
                            const user = result1[0]
                            res.status(200).json({ message: '登录成功', user })
                            console.log('登录成功 :)')
                        } else {
                            console.log('密码错误 :(')
                            res.status(500).json({ error: '密码错误' })
                        }
                    }
                })
            }
        }
    })
})

// 释放数据库连接
app.get('/releaseConnexion', () => {
    if (conn) {
        conn.release()
        console.log('db connection released')
    }
})

app.listen(11001, () => {
    console.log('mysql server is running on port 11001')
})
