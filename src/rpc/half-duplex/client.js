const net = require('net')

const categoryIds = [
    "1",
    "2",
    "3",
    "4",
    "5"
]

// 创建socket
const socket = new net.Socket({})

// 连接服务器
socket.connect({
    host: '127.0.0.1',
    port: 4000
})
// socket.write('hello half-duplex')

let buffer = Buffer.alloc(4)
buffer.writeInt32BE(categoryIds[Math.floor(Math.random() * categoryIds.length)])    // 模拟随机发送给服务端类目id
socket.write(buffer)

socket.on('data', (buffer) => {     // 收到服务端相应后，再发送给服务端类目id
    console.log(buffer.toString())

    buffer = Buffer.alloc(4)
    buffer.writeInt32BE(categoryIds[Math.floor(Math.random() * categoryIds.length)])
    socket.write(buffer)
})