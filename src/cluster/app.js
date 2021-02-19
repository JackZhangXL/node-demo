// 直接启动单核情况下，压测：ab -c50 -n400 http://localhost:3000/ 看下QPS

const http = require('http')
const fs = require('fs')

const memoryLeak = []
http.createServer(function(req, res) {
    res.writeHead(200, {'content-type': 'text/html'})

    setTimeout(function() {
        // // 守护一：模拟子进程出现“未捕获异常”
        // console.log(window.location.href)    // 在服务端访问window对象，又没有try-catch会导致服务崩溃

        // // 守护二：模拟子进程出现“内存泄露”
        // const result = fs.readFileSync(__dirname + '/index.html', 'utf-8')
        // memoryLeak.push(result)  // 模拟内存泄露，执行压测：ab -c 50 -t 15 http://127.0.0.1:3000/

        // // 守护三：模拟子进程出现“心跳无反应”
        // while(1) {}

        res.end(fs.readFileSync(__dirname + '/index.html', 'utf-8'))
    }, 50)
    // res.end(fs.readFileSync(__dirname + '/index.html', 'utf-8'))
}).listen(3000)