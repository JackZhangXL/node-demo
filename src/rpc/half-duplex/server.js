const net = require('net')

const server = net.createServer((socket) => {   // 创建tcp服务器
    socket.on('data', function(buffer) {
        const seqBuffer = buffer.slice(0, 2)    // 服务端不需要处理客户端传来的seq，只需要无脑处理完返回相同的seq即可
        const id = buffer.readInt32BE(2)

        setTimeout(()=> {   // 收到客户端请求的类目id后，模拟服务器处理业务500ms后返回给客户端类目名
            const buffer = Buffer.concat([seqBuffer, Buffer.from(category[id])]) // 无脑将客户端传来的seq拼在结果前
            socket.write(buffer) 
        }, 500)
    })
});
server.listen(4000);

const category = {
    1: "烧烤店",
    2: "日料店",
    3: "火锅店",
    4: "西餐厅",
    5: "中餐厅"
}
