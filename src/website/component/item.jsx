const React = require('react')

module.exports = class Item extends React.Component {
    render() {
        const item = this.props.item
        return (
            <div className="item">
                <p>{item.name}</p>
                <p>{item.price}</p>
            </div>
        )
    }
}