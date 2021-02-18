const app = new (require('koa'))
const mount = require('koa-mount')
const static = require('koa-static')
const ReactDOMServer = require('react-dom/server')
require('babel-register')({
    presets: ['react']
})

const App = require('./app.jsx')
const getData = require('./get-data')
const template = require('./template')(__dirname + '/index.htm')    // react只渲染一个大的div，head等部分还是需要模板引擎来渲染

app.use(mount('/static', static(__dirname + '/source')))

app.use(mount('/data', async (ctx) => {
    ctx.body = await getData(+(ctx.query.num || 0))
}))

app.use(async (ctx) => {
    ctx.status = 200
    const reactData = await getData(+(ctx.query.num || 0))
    // console.log(ReactDOMServer.renderToString(App(reactData)));
    // 在index.htm里有下面这段，转成./app.jsx同构组件，进行服务端渲染
    // <div id="reactapp">
    //    ${reactString}
    // </div>
    ctx.body = template({
        reactString: ReactDOMServer.renderToString(
            App(reactData)
        ),
        reactData
    })
})

app.listen(3000)
