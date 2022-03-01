// http://nodejs.cn/api/net.html
const net = require('net')

const server = net.createServer((socket) => {   // 创建tcp服务器
    socket.on('data', (buf) => {
        console.log(Buffer.from(`收到了${buf.toString()}，时间：${Date.now()}`).toString())
        const timeout = Math.floor(Math.random() * 1000)
        console.log('处理耗时:', timeout)
        setTimeout(() => {   // 模拟服务器处理业务一段时间后返回数据
            socket.write(Buffer.from(`响应${buf.toString()}`)) 
        }, timeout)
    })
})
server.listen(4000)
