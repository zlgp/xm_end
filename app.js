const express = require('express')
const app = express()

// 引入路径模块
const path = require('path')

// 引入路由模块
const router = require('./router')

// 引入中间件
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
// 配置跨域
var cors = require('cors')
app.use(cors())

// 加个中间件,打印日志

var myLogger = function (req, res, next) {
    // 打印请求方法等
    console.log(`${new Date()}--${req.method}--${req.url}--${req.headers['user-agent']}--${Date.now()}`);

    next()
}

app.use(myLogger)


app.use(router)


app.listen(5000, () => {
    console.log("5000 is running.....");

})