const koa = require('koa')
const mount = require('koa-mount')
const static = require('koa-static')
const clientSocket = require('./lib/socket')
const createTemplateMap = require('./lib/template')

const app = new koa()

app.use(mount('/static', static(__dirname + '/source/static')))

app.use(
    mount('/home', async (ctx) => {
        const result = await new Promise((resolve, reject) => {
            clientSocket.write({
                id: 99
            }, function (err, data) {
                err ? reject(err) : resolve(data)
            })
        })

        console.log('rpc result', result)
        const templateMap = createTemplateMap(result)

        ctx.status = 200;
        ctx.body = templateMap['index.html']()
    })
)

app.listen(3000);