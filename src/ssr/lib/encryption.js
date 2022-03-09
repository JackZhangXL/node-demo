/**
 * 一个rpc的数据包会分为【定长的包头】和【不定长的包体】两部分
 * 【定长的包头】用来记录序号seq和包长度bodyLen
 */
function encode(data) {
    const { seq, body } = data;

    const header = Buffer.alloc(6)
    header.writeInt16BE(seq)
    header.writeInt32BE(body.length, 2)

    return Buffer.concat([header, body])    // 【定长的包头】和【不定长的包体】连起来
}

function decode(buffer) {
    const header = buffer.slice(0, 6)
    return {
        seq: header.readInt16BE(),
        body: buffer.slice(6)
    }
}

/**
 * 检查一段buffer是不是一个完整的数据包。
 * 具体逻辑是：
 * 1.buffer长度 <【定长的包头】长度，说明不完整
 * 2.buffer长度 <【定长的包头】长度 +【定长的包头】里bodyLen长度，说明不完整
 */
 function checkComplete(buffer) {
    if (buffer.length < 6) return 0
    const len = 6 + buffer.readInt32BE(2)
    return buffer.length < len ? 0 : len
}

module.exports = {
    encode,
    decode,
    checkComplete,
}