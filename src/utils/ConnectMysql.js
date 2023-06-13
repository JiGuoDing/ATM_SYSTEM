const express = require('express')
const mysql = require('mysql')
const cors = require('cors');

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
                // 先查询转账方日限额
                const queryDayLimit = 'select day_limit from account where id = ?'
                pool.query(queryDayLimit, [op_id], (error, result) => {
                    if (error) {
                        //查询日限额失败
                        console.error('查询日限额失败')
                        res.status(500).json({ error: '查询日限额失败' })
                    } else {
                        const day_limit = result[0].day_limit
                        if (amount > day_limit) {
                            // 日上限小于转账数额
                            console.error('日上限不足')
                            res.status(500).json({ error: '日上限不足' })
                        } else {
                            // 日上限足够
                            console.log('日上限足够，还剩￥', day_limit)
                            // 再查询转账方的余额
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
                                        // 减金额和日上限
                                        const deductBalance = 'update account set balance = balance - ?, day_limit = day_limit - ? where id = ?'
                                        pool.query(deductBalance, [amount, amount, op_id], (error) => {
                                            if (error) {
                                                console.error('出现了一些错误，但未扣除您的金额: ', error)
                                                res.status(500).json({ error: '减钱失败' })
                                            } else {
                                                // 减钱成功
                                                console.log('已扣除您账户的金额并扣除了日上限')
                                                const addBalance = 'update account set balance = balance + ? where id = ?'
                                                pool.query(addBalance, [amount, aim_id], (error) => {
                                                    if (error) {
                                                        // 收款方收钱失败
                                                        const rollbackBalance = 'update account set balance = balance + ? where id = ?'
                                                        pool.query(rollbackBalance, [amount, op_id], (error) => {
                                                            if (error) {
                                                                console.error('出现严重错误，你的账户发生了问题!')
                                                                const addBadRcd = 'insert into op_rcd (op_user_id, aim_user_id, op_type, op_amount) values(?, ?, ?, ?)'
                                                                pool.query(addBadRcd, [op_id, aim_id, '异常操作(转账时)', amount], (error) => {
                                                                    if (error) {
                                                                        console.error('异常操作记录失败，请管理员及时查看日志！！！')
                                                                        res.status(500).json({ error: '异常操作记录失败' })
                                                                    } else {
                                                                        console.log('异常操作记录成功，请管理员及时查看日志！！！')
                                                                        res.status(500).json({ error: '存在异常操作，并已记录' })
                                                                    }
                                                                })
                                                                res.status(500).json({ error: '严重错误' })
                                                            } else {
                                                                console.error('转账时发生了一些错误，您的金额已复原')
                                                                res.status(500).json({ error: '转账时发生了一些错误，但不用担心，您的金额已恢复' })
                                                            }
                                                        })
                                                    } else {
                                                        // 加钱成功
                                                        console.log('金额已到对方账户')
                                                        const addRcd = 'insert into op_rcd (op_user_id, aim_user_id, op_type, op_amount) values(?, ?, ?, ?)'
                                                        pool.query(addRcd, [op_id, aim_id, '转账', amount], (error) => {
                                                            if (error) {
                                                                // 添加转账记录失败
                                                                const rollbackBalance = 'update account set balance = balance + ? where id = ?'
                                                                pool.query(rollbackBalance, [amount, op_id], (error) => {
                                                                    if (error) {
                                                                        console.error('出现严重错误，你的账户发生了问题!')
                                                                        const addBadRcd = 'insert into op_rcd (op_user_id, aim_user_id, op_type, op_amount) values(?, ?, ?, ?)'
                                                                        pool.query(addBadRcd, [op_id, aim_id, '异常操作(添加转账记录时)', amount], (error) => {
                                                                            if (error) {
                                                                                console.error('异常操作记录失败，请管理员及时查看日志！！！')
                                                                                res.status(500).json({ error: '异常操作记录失败' })
                                                                            } else {
                                                                                console.log('异常操作记录成功，请管理员及时查看日志！！！')
                                                                                res.status(500).json({ error: '存在异常操作，并已记录' })
                                                                            }
                                                                        })
                                                                        res.status(500).json({ error: '严重错误' })
                                                                    } else {
                                                                        console.error('添加转账记录时发生了一些错误，您的金额已复原')
                                                                        res.status(500).json({ error: '添加转账记录时发生了一些错误，但不用担心，您的金额已恢复' })
                                                                    }
                                                                })
                                                            } else {
                                                                // 添加操作记录成功
                                                                console.log('添加操作记录成功')
                                                                console.log('转账完成')
                                                                const newBalance = balance - amount
                                                                const newDayLimit = day_limit - amount
                                                                console.log('更新余额: ', newBalance)
                                                                console.log('更新日上限: ', newDayLimit)
                                                                res.status(200).json({ message: '转账成功', newBalance: newBalance, newDayLimit: newDayLimit })
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
            }
        }
    })
})

// 修改密码
app.post('/UpdatePsd', (req, res) => {
    const data = req.body
    const id = data.id, currentPassword = data.currentPassword, newPassword = data.newPassword

    // 检查当前密码输入是否正确
    const checkCurrentPsd = 'select * from account where id = ? and password = ?'
    pool.query(checkCurrentPsd, [id, currentPassword], (error, result) => {
        if (error) {
            //数据库查询失败
            console.error('检查当前密码是否正确时数据库查询失败: ', error)
            res.status(500).json({ error: '检查当前密码是否正确时数据库查询失败' })
        } else {
            if (!result.length) {
                // 查询到的数据为空，说明当前密码输入错误
                console.error('当前密码输入错误')
                res.status(500).json({ error: '当前密码输入错误' })
            } else {
                // 查询到了结果，说明当前密码输入无误
                console.log('当前密码输入正确，进行密码修改...')
                const UpdatePsd = 'update account set password = ? where id = ?'
                pool.query(UpdatePsd, [newPassword, id], (error, result) => {
                    if (error) {
                        console.error('修改密码时查询数据库失败')
                        res.status(500).json({ error: '修改密码时查询数据库失败' })
                    } else {
                        console.log('修改密码成功!')
                        res.status(200).json({ message: '修改密码成功' })
                    }
                })
            }
        }
    })
})


//修改用户信息
app.post('/UpdateUser', (req, res) => {
    const userData = req.body
})

// 查询用户信息
app.post('/QueryUser', (req, res) => {
    const userData = req.body
    const id = userData.id, op_id = userData.op_id
    const checkExistence = 'select * from account where id = ?'
    pool.query(checkExistence, [id], (error, result) => {
        if (error) {
            console.error('数据库处理失败', error)
            res.status(500).json({ error: '数据库处理失败' })
        } else {
            if (result.length <= 0) {
                // 未找到该条记录
                console.error('该用户不存在')
                res.status(404).json({ error: '该用户不存在' })
            } else {
                // 找到了该条记录
                console.log('该用户存在')
                // 记录查询操作
                const addRcd = 'insert into op_rcd (op_user_id, aim_user_id, op_type) values(?, ?, ?)'
                pool.query(addRcd, [op_id, id, '查询账户'], (error) => {
                    if (error) {
                        // 操作记录失败
                        console.error('记录操作失败', error)
                        res.status(500).json({ error: '记录操作时数据库处理失败' })
                    } else {
                        // 操作记录成功
                        console.log('操作记录成功')
                        const result0 = result[0]
                        if (result0.account_type === 'admin')
                            result0.id += '(管理员账户)'
                        else
                            result0.id += '(普通账户)'
                        // 查询任务成功
                        console.log('用户信息: ', result0)
                        console.log('查询账户成功，操作已被记录')
                        res.status(200).json({ message: '账户查询完成', UserData: result0 })
                    }
                })


            }
        }
    })
})

// 删除用户
app.post('/DropUser', (req, res) => {
    const userData = req.body
    const id = userData.id, op_id = userData.op_id
    const checkAccountType = 'select account_type from account where id = ?'
    pool.query(checkAccountType, [id], (error, result) => {
        if (error) {
            // 数据库查询失败
            console.error('查询数据库失败')
            res.status(500).json({ error: '查询数据库失败' })
        } else {
            // 数据库查询成功
            if (result.length <= 0) {
                // 账户不存在
                res.status(500).json({ error: '该账户不存在' })
            } else {
                // 账户存在
                const result0 = result[0]
                if (result0.account_type === 'admin') {
                    // 要删除的是管理员账户
                    console.error('您不能删除管理员账户')
                    res.status(500).json({ error: '您不能删除管理员账户' })
                } else {
                    // 要删除的账户非管理员
                    const dropUser = 'delete from account where id = ?'
                    pool.query(dropUser, [id], (error, result) => {
                        if (error) {
                            // 数据库查询失败
                            console.error('查询数据库失败')
                            res.status(500).json({ error: '查询数据库失败' })
                        } else {
                            // 数据库查询成功
                            if (result.affectRows <= 0) {
                                // 没有该条记录
                                console.error('删除用户失败, 该用户不存在: ', error)
                                res.status(500).json({ error: '用户不存在' })
                            } else {
                                // 有该条记录并进行删除
                                // 进行操作记录
                                const addRcd = 'insert into op_rcd (op_user_id, aim_user_id, op_type) values(?, ?, ?)'
                                pool.query(addRcd, [op_id, '删除账户', id], (error) => {
                                    if (error) {
                                        console.error('记录操作失败', error)
                                        res.status(500).json({ error: '记录操作时数据库处理失败' })
                                    } else {
                                        // 记录操作成功
                                        console.log('删除用户成功，操作已被记录')
                                        res.status(200).json({ message: '删除用户成功，操作已被记录' })
                                    }
                                })
                            }
                        }
                    })
                }
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
