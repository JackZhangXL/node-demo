const React = require('react')
const Item = require('./item.jsx')
const { Button } = require('antd')

module.exports = class Container extends React.Component {
    render() {
        const { title, list, num, addNum } = this.props
        return (
            <div className="container">
                <p>{title}</p>
                {list.map((item, index) => {
                    return <Item item={item} key={index} />
                })}
                <Button size="large" onClick={addNum}>+</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                <span>{num}</span>
            </div>
        )
    }
}
