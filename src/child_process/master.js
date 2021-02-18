const cp = require('child_process')

const child_process = cp.fork(__dirname + '/child.js')     // 创建子进程

child_process.send('i am master')
child_process.on('message', str => {      // 子进程处理完会通知主进程，这里监听下
    console.log(str)
})
