const EventEmitter = require('events').EventEmitter

class News extends EventEmitter {
    constructor() {
        super()
        
        setInterval(() => {
            this.emit('news', {
                content: '大新闻'
            })
        }, 1000)
    }
}

module.exports = new News