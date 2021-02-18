const React = require('react')
const ReactDOM = require('react-dom')
const Container = require('../component/container.jsx')

class App extends React.Component {
    constructor() {
        super()
        this.state = {  // 初始值从服务端数据预取后挂到window对象中取
            list: window.reactInitData.list,
            num: window.reactInitData.num,
        }
    }

    render() {
        console.log('服务端数据预取：', window.reactInitData)
        return (
            <Container
                title={'客户端渲染'}
                list={this.state.list} 
                num={this.state.num} 
                addNum={() => {
                    this.setState({
                        num: this.state.num + 1
                    })
                }} 
            />
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('reactapp')
)
