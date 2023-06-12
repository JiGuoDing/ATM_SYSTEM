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

// 管理员添加用户
app.post('/addUser', (req, res) => {
    const data = req.body
    const checkExistence = 'select * from account where id = ?'
    pool.query(checkExistence, [data.id], (error, result) => {
        if (error) { // 查询数据库失败
            console.error('error occured when quering')
            res.status(500).json({ error: '数据库查询失败' })
        } else { // 查询数据库成功
            if (result.length > 0) { // 该用户已存在
                console.error('该身份证号已创建帐号')
                res.status(500).json({ error: '该身份证已创建帐号' })
            } else { // 可以创建账户
                const addUser = 'insert into account set ?'
                pool.query(addUser, data, (error, result) => {
                    if (error || data.name.length === 0 || data.password.length === 0 || data.id.length !== 18 || data.balance < 0) { // 创建账户失败
                        console.log('error occurs!', error)
                        res.status(500).json({ error: '用户添加失败' })
                    } else { // 创建账户成功
                        console.log('data inserted successfully', result)
                        res.status(200).json({ message: '用户添加成功', result })
                    }
                })
            }
        }
    })
})

app.post('/refreshBalance', (req, res) => {
    const data = req.body
    const queryBalance = 'select balance from account where id = ?'
    pool.query(queryBalance, [data.id], (error, result) => {
        if (error) {
            // 查询数据库失败
            res.status(500).json({ error: '查询数据库失败' })
            console.log(error)
        } else {
            console.log(result)
            const result0 = result[0]
            res.status(200).json({ message: '刷新成功', result0 })
        }
    })
})

app.post('/Deposit', (req, res) => {
    const data = req.body
    const id = data.id, amount = data.amount
    const executeDeposit = 'update account set balance = balance + ? where id = ?'
    pool.query(executeDeposit, [amount, id], (error, result) => {
        if (error) {
            console.error('查询账户数据库失败: ', error)
            res.status(500).json({ error: '查询账户数据库失败' })
        } else {
            console.log('存款成功')
            console.log(result)
            const addRcd = 'insert into op_rcd (op_user_id, op_type, op_amount) values(?, ?, ?)'
            pool.query(addRcd, [id, '存款', amount], (error, result) => {
                if (error) {
                    console.error('查询记录数据库失败', error)
                    res.status(500).json({ error: '查询记录数据库失败' })
                } else {
                    console.log('存款及操作记录成功')
                    console.log(result)
                    res.status(200).json({ message: '存款及操作记录成功' })
                }
            })
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
