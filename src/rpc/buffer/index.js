const fs = require('fs');
const protobuf = require('protocol-buffers');

// 实际写web服务器的时候，这个操作可以直接在进程启动就做，否则在http处理过程里做的话，是一次不必要的性能消耗
const shop = protobuf(fs.readFileSync(`${__dirname}/test.proto`));

const buffer = shop.Shop.encode({
    id: 4,
    name: '烧烤店',
    deals: [
        { id: 5, price: 10}, 
        { id: 6, price: 12}
    ]
})

console.log(buffer);    // <Buffer 0d 00 00 80 40 12 09 e7 83 a7 e7 83 a4 e5 ba 97 1a 0a 0d 00 00 a0 40 15 00 00 20 41 1a 0a 0d 00 00 c0 40 15 00 00 40 41>
console.log(shop.Shop.decode(buffer));     // { id: 4, name: '烧烤店', deals: [ { id: 5, price: 10 }, { id: 6, price: 12 } ] }