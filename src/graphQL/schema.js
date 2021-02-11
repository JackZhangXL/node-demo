const fs = require('fs')
const { buildSchema } = require('graphql')

//  使用 buildSchema 方法，把一个文本格式的 graphql 协议转换成 GraphqlSchema 实例
//  很像 protocol-buffers 编译.proto文件的过程
const schema = buildSchema(fs.readFileSync(__dirname + '/person.gql', 'utf-8'))

schema.getQueryType().getFields().person.resolve = () => {
    return [{
        id: 1,
        name: "zhang"
    }]
}

module.exports = schema