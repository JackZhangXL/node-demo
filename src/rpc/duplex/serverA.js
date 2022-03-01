// http://nodejs.cn/api/net.html
const net = require('net')
const fs = require('fs')
const { checkComplete, encode, decode } = require('./lib.js')
const protobuf = require('protocol-buffers')
const proto = protobuf(fs.readFileSync(`${__dirname}/demo.proto`))

const socket = new net.Socket({})

socket.connect({
    host: '127.0.0.1',
    port: 4000
})

for (let i = 0; i < 5; i++) {
    socket.write(encode({ 
        seq: i,
        body: Buffer.alloc(2, i)
    }))
}

socket.on('data', (buffer) => {
    let packageLen = 0
    while (packageLen = checkComplete(buffer)) {
        const package = buffer.slice(0, packageLen)
        console.log('package', package)
        buffer = buffer.slice(packageLen)
        const response = decode(package)
        console.log('seq', response.seq)
        console.log('body', proto.Person.decode(response.body))
    }
})
