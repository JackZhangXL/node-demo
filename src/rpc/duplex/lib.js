/**
 * 检查一段buffer是不是一个完整的数据包。
 * 具体逻辑是：判断header的bodyLength字段，看看这段buffer是不是长于header和body的总长
 * 如果是，意味着这个请求包是完整的，则返回这个包长。
 * 如果不是，则返回0，意味着包还没接收完
 */
function checkComplete(buffer) {
    if (buffer.length < 6) {
        return 0
    }
    const bodyLength = buffer.readInt32BE(2)
    return 6 + bodyLength
}

function decode(buffer) {
    const header = buffer.slice(0, 6)
    const seq = header.readInt16BE()
    const body = buffer.slice(6)

    return {
        seq,
        data: body
    }
}

module.exports = {
    checkComplete,
    decode
}