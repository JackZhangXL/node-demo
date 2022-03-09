// https://www.npmjs.com/package/easy_sock
const EasySock = require('easy_sock')
const protobuf = require('protocol-buffers')
const fs = require('fs')
const path = require('path')
const proto = protobuf(fs.readFileSync(path.resolve(__dirname, '../rpc/demo.proto')))
const { checkComplete, encode, decode } = require('./encryption.js')

const easySock = new EasySock({ 
    ip: '127.0.0.1',
    port: 4000,
    timeout: 500,
    keepAlive: true
})

easySock.encode = function(data, seq) {
    return encode({
        seq,
        body: proto.PersonRequest.encode(data)
    })
}

easySock.decode = function(buffer) {
    const ret = decode(buffer)
    return {
        seq: ret.seq,
        result: proto.Person.decode(ret.body)
    }
}

easySock.isReceiveComplete = checkComplete

module.exports = easySock
