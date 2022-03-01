
// 与HTTP相比：
// 1.省去了DNS域名解析时间
// 2.用二进制格式传输数据，更小的数据包体积 + 省去了系统加解码 = 更优的性能
//   Buffer模块处理数据：http://nodejs.cn/api/buffer.html

// Example1：Buffer模块
// 创建buffer
const buf1 = Buffer.alloc(5)
console.log('buf1', buf1)    // <Buffer 00 00 00 00 00> 默认用0填充

const buf2 = Buffer.alloc(5, 1)
console.log('buf2', buf2)    // <Buffer 01 01 01 01 01> 指定初始值用1填充

const buf3 = Buffer.from([1, 2, 3])
console.log('buf3', buf3)    // <Buffer 01 02 03>

const buf4 = Buffer.from('abcdefgh')
console.log('buf4', buf4)    // <Buffer 61 62 63 64 65 66 67 68>

// 写buffer
buf4.writeInt8(12, 1)
console.log('buf4', buf4)    // <Buffer 61 0c 63 64 65 66 67 68> 在第一byte位置写入12(0x0c)

// BE和LE在编程时的区别：https://www.jianshu.com/p/f1352a017f67/
buf4.writeInt16BE(512, 2)
console.log('buf4', buf4)    // <Buffer 61 0c 02 00 65 66 67 68> 在第二byte位置写入512（02 00），BE表示Big-Endian高位在前即（02 00）

buf4.writeInt16LE(512, 4)
console.log('buf4', buf4)    // <Buffer 61 0c 02 00 00 02 67 68> 在第四byte位置写入512（02 00），LE表示Little-Endian低位在前即（00 02）


// Example2：protocol-buffers，Google提供的能像写JSON一样写Buffer
// https://github.com/protocolbuffers/protobuf
// https://developers.google.com/protocol-buffers/docs/reference/javascript-generated
const fs = require('fs')
const protobuf = require('protocol-buffers')

const proto = protobuf(fs.readFileSync(`${__dirname}/demo.proto`));

const buf = proto.Person.encode({
    name: 'Sarah',
    id: 123,
    email: '123@abc.com',
    phone: [
        { number: '111-1111-1111', type: proto.Person.PhoneType.HOME}, 
        { number: '222-2222-2222', type: proto.Person.PhoneType.WORK}
    ]
})
console.log(buf)
// <Buffer 0a 05 53 61 72 61 68 10 7b 1a 0b 31 32 33 40 61 62 63 2e 63 6f 6d 22 11 0a 0d 31 31 31 2d 31 31 31 31 2d 31 31 31 31 10 01 22 11 0a 0d 32 32 32 2d 32 ... 10 more bytes>
console.log(proto.Person.decode(buf))  
// {
//   name: 'Sarah',
//   id: 123,
//   email: '123@abc.com',
//   phone: [
//     { number: '111-1111-1111', type: 1 },
//     { number: '222-2222-2222', type: 2 }
//   ]
// }

