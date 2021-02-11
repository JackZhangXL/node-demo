const fs = require('fs')
const { buildSchema } = require('graphql')

//  使用 buildSchema 方法，把一个文本格式的 graphql 协议转换成 GraphqlSchema 实例
//  很像 protocol-buffers 编译.proto文件的过程
const schema = buildSchema(fs.readFileSync(__dirname + '/person.gql', 'utf-8'))

const mockData = [{
    id: 1,
    name: "zhangsan",
    location: "shanghai"
},{
    id: 2,
    name: "lisi",
    location: "beijing"
}]

schema.getQueryType().getFields().person.resolve = () => {
    return mockData
}

schema.getMutationType().getFields().location.resolve = (args0, { id, location }) => {
    const idx = mockData.findIndex(item => {
        return item.id === id
    })
    mockData[idx].location = location
    return mockData[idx].location
}
module.exports = schema
