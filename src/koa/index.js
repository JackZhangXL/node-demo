const fs = require('fs');
const koa = require('koa');
const mount = require('koa-mount')

const app = new koa();

app.use(
    mount('/favicon.ico', function (ctx) {
        ctx.status = 200;
    })
)

const app2 = new koa();
app2.use(
    // 访问 http://localhost:3000/location?city=shanghai
    async function (ctx, next) {
        ctx.status = 200;
        ctx.body = `chengshi：${ctx.query.city}`
        // 使用 await 关键字等待后续中间件执行完成
        // await next();
    }
)

app.use(
    mount('/location', app2)  // koa实例里可以再挂koa实例
)
app.use(
    mount('/', function (ctx) {
        ctx.body = fs.readFileSync(__dirname + '/index.html', 'utf-8')
    })
)
app.listen(3000);