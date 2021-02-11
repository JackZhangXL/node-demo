// const { buildSchema, graphql } = require('graphql')

// // 定义一个数据格式 schema，类似 protocol-buffers
// const schema = buildSchema(`
//     type Query {
//         hello: String
//     }
// `)

// // 服务端的取值函数
// const root = {
//     hello: () => 'Hello world!'
// }

// // 运行Graphql，第一个参数是数据格式，第二个参数是要取哪个数据，第三个参数是从哪里取这个数据
// graphql(schema, '{ hello }', root).then((responese) => {
//     console.log(responese)
// })

const koa = require('koa')
const graphqlHTTP = require('koa-graphql')
const app = new koa

app.use(
    // 给koa-graphql传一个graphql的协议文件，就会自动帮你生成graphql-api
    graphqlHTTP({
        schema: require('./schema')
    })
)

app.listen(3000)