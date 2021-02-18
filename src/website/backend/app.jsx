const React = require('react')
const Container = require('../component/container')

module.exports = function (reactData) {
    return (
        <Container 
            title={'服务端渲染'}
            list={reactData.list} 
            num={reactData.num} 
            addNum={() => {}} 
        />
    )
}