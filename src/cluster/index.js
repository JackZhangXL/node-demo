// 启动cluster多核情况下，压测：ab -c50 -n400 http://localhost:3000/ 看下QPS

const cluster = require('cluster')
const os = require('os')

if (cluster.isMaster) { // 主进程走分发逻辑
    // 因为Node本来就要占据几个CPU去处理内置事件循环中的子线程，所以不要将CPU全占满，除2差不多。具体留多少CPU余量，要根据压测数据找个最佳比
    for (let i = 0; i < os.cpus().length / 2; i++) {  
        createWorker()
    }

    cluster.on('exit', function () {    // 当子进程崩溃退出后，主进程可以再创建个新的子进程
        // 如果子进程代码很容易崩溃，一崩溃马上创建新的子进程会不停崩溃不停新建，消耗大量CPU直至服务彻底崩溃，所以可以设置个5s超时
        setTimeout(() => {
            createWorker()
        }, 5000)
    })

    function createWorker() {
        // 创建子进程并进行心跳监控
        let worker = cluster.fork()

        let missed = 0      // 子进程没有回应的ping次数
        
        let timer = setInterval(function () {   // 每10s主进程向子进程发送一下心跳
            if (missed === 3) {
                clearInterval(timer)
                console.log(worker.process.pid + ' 没有心跳，疑似进入僵尸状态')
                process.kill(worker.process.pid)
                return
            }
            missed++
            worker.send('ping#' + worker.process.pid)
        }, 1000)

        worker.on('message', function (msg) {   // 主进程监听子进程的心跳回应
            if (msg === 'pong#' + worker.process.pid) {
                missed--
            }
        })

        worker.on('exit', function () {
            clearInterval(timer)
        })
    }
} else {    // 子进程走http服务逻辑
    process.on('uncaughtException', function (err) {    // 当子进程出现会崩溃的错误
        console.log(err)
        process.exit(1)
    })

    process.on('message', function (msg) {          // 子进程回应心跳信息
        if (msg === 'ping#' + process.pid) {
            process.send('pong#' + process.pid);
        }
    });

    if (process.memoryUsage().rss > 734003200) {    // 子进程里内存使用超过700m，认为发生了内存泄露，就退出子进程
        console.log('内存占用过多，疑似内存泄露')
        process.exit(1)
    }
    require('./app')
}