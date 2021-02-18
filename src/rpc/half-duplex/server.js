const net = require('net')

const server = net.createServer((socket) => {   // 创建tcp服务器
    socket.on('data', function(buffer) {
        const id = buffer.readInt32BE()

        setTimeout(()=> {   // 收到客户端请求的类目id后，模拟服务器处理业务500ms后返回给客户端类目名
            socket.write(Buffer.from(category[id])) 
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
