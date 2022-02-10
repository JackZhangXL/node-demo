// http://nodejs.cn/api/vm.html
const vm = require('vm')
const fs = require('fs')

// Example 1 - basic
let contextObject = {
    data: {
        animal: 'cat',
        count: 2
    }
}
vm.runInNewContext('data.count += 1; data.name = "kitty"', contextObject)
console.log('Example 1:', contextObject)  // { data: { animal: 'cat', count: 3, name: 'kitty' } }


// // Example 2 - render html
let ret = vm.runInNewContext('`<h2>动物:${data.animal}</h2>`', contextObject)
console.log('Example 2:', ret) // <h2>动物:cat</h2>


// Example 3 - template
let templateMap = {
    'a.tpl': fs.readFileSync('./a.tpl', 'utf-8'),
    'b.tpl': fs.readFileSync('./b.tpl', 'utf-8')
}

contextObject = {
    data: {
        animal: 'cat',
        count: 2
    },
    encodeData: (d) => d,     // 自定义encode方法，下面xss用到，先无视
    include: (tplName) => {   // 自定义模板的include方法
        return templateMap[tplName]()
    },
}

Object.keys(templateMap).forEach(key => {
    const temp = templateMap[key]
    // console.log('temp: ', temp)
    templateMap[key]= vm.runInNewContext(`
      (function() {
        return \`${temp}\`
      });
    `, contextObject)
})
// console.log('templateMap: ', templateMap)
ret = templateMap['a.tpl']()
console.log('Example 3:', ret)


// Example 4 - xss
contextObject.data.animal = '<script>alert(1)</script>'
ret = templateMap['a.tpl']()
console.log('Example 4 - NG:', ret)  // <p>动物:<script>alert(1)</script></p>

templateMap = {
    'a.tpl': fs.readFileSync('./a.tpl', 'utf-8'),
    'b.tpl': fs.readFileSync('./b.tpl', 'utf-8')
}

contextObject = {
    data: {
        animal: '<script>alert(1)</script>',
        count: 2
    },
    include: (tplName) => {   // 自定义模板的include方法
        return templateMap[tplName]()
    },
    encodeData: function(markup) {   // 自定义方法，防止xss
        if (!markup) return ''
        return String(markup)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/'/g, '&#39;')
          .replace(/"/g, '&quot;')
    } 
}

Object.keys(templateMap).forEach(key => {
    const temp = templateMap[key]
    // console.log('temp: ', temp)
    templateMap[key]= vm.runInNewContext(`
      (function() {
        return \`${temp}\`
      });
    `, contextObject)
})

ret = templateMap['a.tpl']()
console.log('Example 4 - OK:', ret) // <p>动物:<script>alert(1)</script></p>
