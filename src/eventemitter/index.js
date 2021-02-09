const news = require('./news')

news.on('news', ({ content }) => {
    console.log('receive news: ', content)
})

setTimeout(() => {
    // EventEmitter如果添加了过多的监听器，Node.js觉得你有内存泄漏嫌疑，会抛出一个warning
    // 例如下面添加了100个监听器
    for (let i = 0; i < 100; i++) {
        news.on('news', ({ content }) => {
            console.log('receive news: ', content)
        })
    }
    // 可以放开下面这句话消除这个警告
    // news.setMaxListeners(200);
}, 3000)