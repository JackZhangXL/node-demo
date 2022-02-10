const app = new (require('koa'))
const ReactDOMServer = require('react-dom/server')
require('babel-register')({     // 服务端渲染，需要将jsx转成js再传给模板引擎
    presets: ['react']
})

// console.log(
//     ReactDOMServer.renderToString(
//         require(`${__dirname}/source/index.jsx`)
//     )
// )   // <div data-reactroot="">ssr</div>

const fs = require('fs')
const vm = require('vm')

let templateMap = {
    'index.html': fs.readFileSync(`${__dirname}/source/index.html`, 'utf-8'),
}

const contextObject = {
    data: {
        reactString: ReactDOMServer.renderToString(
            require(`${__dirname}/source/index.jsx`)
        ),
    },
    include: (tplName) => {   // 自定义模板的include方法
        return templateMap[tplName]()
    },
    encodeData: function(markup) {   // 自定义方法，防止xss
        if (!markup) return ''
        return String(markup)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/'/g, '&#39;')
          .replace(/"/g, '&quot;')
    } 
}

Object.keys(templateMap).forEach(key => {
    const temp = templateMap[key]
    templateMap[key]= vm.runInNewContext(`
      (function() {
        return \`${temp}\`
      });
    `, contextObject)
})

app.use(
    async (ctx, next) => {
        ctx.status = 200
        ctx.body = templateMap['index.html']()
        await next()
    }
)
app.listen(3000)
