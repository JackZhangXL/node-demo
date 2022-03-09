const fs = require('fs')
const vm = require('vm')
const path = require('path')

const templateMap = {
    'index.html': fs.readFileSync(path.resolve(__dirname, '../source/index.html'), 'utf-8'),
}

const contextObject = {
    data: {},
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

const createTemplateMap = function(data) {
    contextObject.data = { ...data }
    Object.keys(templateMap).forEach(key => {
        const temp = templateMap[key]
        templateMap[key]= vm.runInNewContext(`
          (function() {
            return \`${temp}\`
          });
        `, contextObject)
    })
    return templateMap
}

module.exports = createTemplateMap
