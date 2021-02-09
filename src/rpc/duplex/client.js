const net = require('net')
const { checkComplete, decode } = require('./lib.js')

const socket = new net.Socket({})

socket.connect({
    host: '127.0.0.1',
    port: 4000
})

const categoryIds = [
    "1",
    "2",
    "3",
    "4",
    "5"
]

function encode(data) {
    // 正常情况下，这里应该是使用 protobuf 来encode一段代表业务数据的数据包
    // 为了不要混淆重点，就直接把课程id转buffer发送
    const body = Buffer.alloc(4)
    body.writeInt32BE(categoryIds[data.id])

    // 一般来说，一个rpc调用的数据包会分为定长的包头和不定长的包体两部分
    // 包头的作用就是用来记载包的序号和包的长度，以实现全双工通信
    const header = Buffer.alloc(6)
    header.writeInt16BE(seq)
    header.writeInt32BE(body.length, 2)

    // 包头和包体拼起来发送
    const buffer = Buffer.concat([header, body])

    console.log(`包${seq}传输的类目id为${categoryIds[data.id]}`)
    seq++
    return buffer
}

let seq = 0
let id = Math.floor(Math.random() * categoryIds.length)

let oldBuffer = null
socket.on('data', (buffer) => {
    if (oldBuffer) {    // 把上一次data事件使用残余的buffer接上来
        buffer = Buffer.concat([oldBuffer, buffer])
    }

    let completeLength = 0
    while (completeLength = checkComplete(buffer)) {     // 只要还存在可以解成完整包的包长
        const package = buffer.slice(0, completeLength)
        buffer = buffer.slice(completeLength)

        const result = decode(package) // 把这个包解成seq和数据
        console.log(`包${result.seq}，返回值是${result.data.toString()}`)
    }

    oldBuffer = buffer  // 把残余的buffer记下来
})

for (let k = 0; k < 100; k++) {     // 模拟100次请求，会合并成一个包，服务端需要拆分粘包，返回100个响应
    id = Math.floor(Math.random() * categoryIds.length)
    socket.write(encode({ id }))
}
