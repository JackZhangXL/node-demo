const listClient = require('./list-client')

module.exports = async function (num = 0) {
    // const data = await new Promise((resolve, reject) => {
    //     listClient.write({num}, function (err, res) {
    //         err ? reject(err) : resolve(res.list)
    //     })
    // })

    // return data
    return {
        list: [{
            name: "第一个item",
            price: 100
        }, {
            name: "第二个item",
            price: 200
        }, {
            name: "第三个item",
            price: 300
        }],
        num: 8
    }
}