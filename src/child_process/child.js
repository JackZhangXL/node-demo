process.on('message', str => {
    console.log(str)
    process.send('i am child')    // 处理完通知主进程
})