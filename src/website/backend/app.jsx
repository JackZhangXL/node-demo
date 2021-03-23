const React = require('react')
const Container = require('../component/container')

module.exports = function (reactData) {
    return (
        <Container 
            title={'服务端渲染'}
            list={reactData.list} 
            num={reactData.num} 
            addNum={() => {}} // 交互留给客户端渲染时实现，服务端只需要实现首次渲染的数据即可
        />
    )
}