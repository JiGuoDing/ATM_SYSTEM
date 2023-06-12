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

// 更新存款
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

// 存款
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

// 取款
app.post('/Withdraw', (req, res) => {
    const data = req.body
    const id = data.id, amount = data.amount
    const queryBalance = 'select balance, day_limit from account where id = ?'
    pool.query(queryBalance, [id], (error, result) => {
        if (error) {
            console.error('账户数据库查询失败')
            res.status(500).json({ error: '账户数据库查询失败' })
        } else {
            const day_limit = result[0].day_limit
            if (amount > day_limit) {
                console.error('所取金额超过今日剩余取款上限')
                res.status(500).json({ error: '今日取款上限不足' })
            } else {
                const balance = result[0].balance
                if (amount > balance) {
                    console.error('余额不足')
                    res.status(500).json({ error: '余额不足' })
                } else {
                    const updateBalance = 'update account set balance = balance - ? where id = ?'
                    pool.query(updateBalance, [amount, id], (error) => {
                        if (error) {
                            console.error('更新余额失败: ', error)
                            res.status(500).json({ error: '更新余额失败' })
                        } else {
                            console.log('更新余额成功')
                            const newBalance = balance - amount
                            const updateDayLimit = 'update account set day_limit = day_limit - ? where id = ?'
                            pool.query(updateDayLimit, [amount, id], (error, result) => {
                                if (error) {
                                    console.error('更新日上限失败')
                                    res.status(500).json({ error: '更新日上限失败' })
                                } else {
                                    if (result.affectRows <= 0) {
                                        console.error('未更新日上限')
                                        res.status(500).json({ error: '未更新日上限' })
                                    } else {
                                        const newDayLimit = day_limit - amount
                                        const addRcd = 'insert into op_rcd (op_user_id, op_type, op_amount) values(?, ?, ?)'
                                        pool.query(addRcd, [id, '取款', amount], (error, result) => {
                                            if (error) {
                                                console.error('添加取款记录失败')
                                                res.status(500).json({ error: '添加记录失败' })
                                            } else {
                                                console.log(result)
                                                console.log('取款及更新日上限及添加记录成功')
                                                res.status(200).json({ message: '取款成功', newDayLimit: newDayLimit, newBalance: newBalance })
                                            }
                                        })
                                    }
                                }
                            })
                        }
                    })
                }
            }
        }
    })
})

// 转账（要保证安全性，故使用Transaction）
app.post('/Transfer', (req, res) => {
    const data = req.body
    const op_id = data.op_id, aim_id = data.aim_id, amount = data.amount
    // 先查询目标账户是否存在
    const checkAimExistence = 'select * from account where id = ?'
    pool.query(checkAimExistence, [aim_id], (error, result) => {
        if (error) {
            console.error('查询数据库失败: ', error)
            res.status(500).json({ error: '查询数据库失败' })
        } else {
            if (!result.length) {
                console.error('目标账户不存在: ', error)
                res.status(500).json({ error: '目标账户不存在' })
            } else {
                //目标用户存在
                // 先查询转账方的钱
                const queryBalance = 'select balance from account where id = ?'
                pool.query(queryBalance, [op_id], (error, result) => {
                    if (error) {
                        console.error('余额查询失败', error)
                        res.status(500).json({ error: '余额查询失败' })
                    } else {
                        console.log('余额查询成功')
                        const balance = result[0].balance
                        if (amount > balance) {
                            res.status(500).json({ error: '余额不足' })
                            console.error('余额不足: ', error)
                        } else {
                            // 余额足够
                            const deductBalance = 'update account set balance = balance - ? where id = ?'
                            pool.query(deductBalance, [amount, op_id], (error) => {
                                if (error) {
                                    console.error('出现了一些错误，但未扣除您的金额: ', error)
                                    res.status(500).json({ error: '减钱失败' })
                                } else {
                                    // 减钱成功
                                    console.log('已扣除您账户的金额')
                                    const newBalance = balance - amount
                                    const addBalance = 'update account set balance = balance + ? where id = ?'
                                    pool.query(addBalance, [amount, aim_id], (error, result) => {
                                        if (error) {
                                            console.error('查询数据库失败, 数据已回滚，您的金额已恢复: ', error)
                                            res.status(500).json({ error: '查询数据库失败' })
                                        } else {
                                            // 加钱成功
                                            console.log('金额已到对方账户')
                                            const addRcd = 'insert into op_rcd (op_user_id, aim_user_id, op_type, op_amount) values(?, ?, ?, ?)'
                                            pool.query(addRcd, [op_id, aim_id, '转账', amount], (error, result) => {
                                                if (error) {
                                                    console.error('查询数据库失败, 数据已回滚，您的金额已恢复')
                                                    res.status(500).json({ error: '查询数据库失败' })
                                                } else {
                                                    // 添加操作记录成功
                                                    console.log('添加操作记录成功')
                                                    console.log('转账完成')
                                                    res.status(200).json({ message: '转账成功', newBalance: newBalance })
                                                }
                                            })
                                        }
                                    })
                                }
                            })
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
