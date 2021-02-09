const http = require('http')
const url = require('url')
const queryString = require('querystring')
const fs = require('fs')

http.createServer(function(req, res) {
    const parseUrl = url.parse(req.url)

    if(parseUrl.pathname == '/favicon.ico') {
        res.writeHead(200)
        res.end()
        return
    }

    // 访问 http://localhost:3000/location?city=shanghai
    if(parseUrl.pathname == '/location') {
        const queryParams = queryString.parse(parseUrl.query)
        // console.log(queryParams) // { city: 'shanghai' }
        res.writeHead(200)
        res.end(`chengshi：${queryParams.city}`)
        return
    }

    // 访问 http://localhost:3000/
    if(parseUrl.pathname == '/') {
        res.writeHead(200)
        fs.createReadStream(__dirname + '/index.html').pipe(res)
        return
    }
}).listen(3000)