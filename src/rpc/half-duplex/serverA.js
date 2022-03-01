// http://nodejs.cn/api/net.html
const net = require('net')

const socket = new net.Socket({})

socket.connect({
    host: '127.0.0.1',
    port: 4000
})

// good case
let num = 0;
socket.write(Buffer.from(`A请求${num.toString()}`))

socket.on('data', (buf) => {     // 收到服务端response后，再发下一个request
    console.log(`收到了${buf.toString()}，时间：${Date.now()}`)
    if (num < 3) {
        num++;
        socket.write(Buffer.from(`A请求${num.toString()}`))
    }
})

// 局限1：验证半双工的无序性
// let num = 0;
// setInterval(() => {
//     if (num < 3) {
//         num++
//         socket.write(Buffer.from(`A请求${num.toString()}`))
//     }
// }, 50)

// socket.on('data', (buf) => {     // 收到服务端response后，再发下一个request
//     console.log(`收到了${buf.toString()}，时间：${Date.now()}`)
// })

// 局限2：粘包
// for (let i = 0; i < 5; i++) {
//     socket.write(Buffer.from(`A请求${i.toString()}`))
// }

// socket.on('data', (buf) => {     // 收到服务端response后，再发下一个request
//     console.log(`收到了${buf.toString()}，时间：${Date.now()}`)
// })