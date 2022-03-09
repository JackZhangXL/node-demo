// http://nodejs.cn/api/net.html
const net = require('net')
const fs = require('fs')
const { checkComplete, encode, decode } = require('../lib/encryption')
const protobuf = require('protocol-buffers')
const proto = protobuf(fs.readFileSync(`${__dirname}/demo.proto`))

const server = net.createServer((socket) => {   // 创建tcp服务器
    socket.on('data', (buffer) => {    
        let packageLen = 0
        while (packageLen = checkComplete(buffer)) {
            const package = buffer.slice(0, packageLen)
            console.log('package', package)
            buffer = buffer.slice(packageLen)
            const request = decode(package)
            console.log('request', request)

            const timeout = Math.floor(Math.random() * 300)
            console.log('处理耗时:', timeout)
            setTimeout(() => {   // 模拟服务器处理业务一段时间后返回数据
                socket.write(encode({ 
                    seq: request.seq,
                    body: proto.Person.encode({
                        name: 'Sarah',
                        id: 123
                    })
                }))
            }, timeout)
        }
    })
})

server.listen(4000)
