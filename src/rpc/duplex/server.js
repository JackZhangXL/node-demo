const net = require('net');
const { checkComplete/*, encode*/, decode } = require('./lib.js')

const category = {
    1: "烧烤店",
    2: "日料店",
    3: "火锅店",
    4: "西餐厅",
    5: "中餐厅"
}
function encode(seq, data) {
    // 正常情况下，这里应该是使用 protobuf 来encode一段代表业务数据的数据包
    // 为了不要混淆重点，这个例子比较简单，就直接把课程标题转buffer返回
    const body = Buffer.from(data)

    // 一般来说，一个rpc调用的数据包会分为定长的包头和不定长的包体两部分
    // 包头的作用就是用来记载包的序号和包的长度，以实现全双工通信
    const header = Buffer.alloc(6);
    header.writeInt16BE(seq)
    header.writeInt32BE(body.length, 2);

    return Buffer.concat([header, body])
}

const server = net.createServer((socket) => {
    let oldBuffer = null
    socket.on('data', function (buffer) {
        if (oldBuffer) {    // 把上一次data事件使用残余的buffer接上来
            buffer = Buffer.concat([oldBuffer, buffer])
        }

        let packageLength = 0
        while (packageLength = checkComplete(buffer)) {     // 只要还存在可以解成完整包的包长
            const package = buffer.slice(0, packageLength)
            buffer = buffer.slice(packageLength)

            const result = decode(package) // 把这个包解成seq和数据
            socket.write(encode(result.seq, category[result.data.readInt32BE()]))
        }

        oldBuffer = buffer  // 把残余的buffer记下来
    })
})

server.listen(4000)
