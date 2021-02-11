const user = { 
    name: 'Jack', 
    scrpit: '<script />' 
}
const templateMap = {
    templateA: '`<h2>${include("templateB")}</h2>`',
    templateB: '`<p>111</p>`'  // 这里正常是fs.readFileSync读取出的模板内容
}

// 自定义模板渲染引擎，将字符串到沙箱里用js引擎运行一下
const vm = require('vm')
vm.runInNewContext('`<h2>${user.name}</h2>`', { user })
// console.log(vm.runInNewContext('`<h2>${user.name}</h2>`', { user }))  // <h2>Jack</h2>

const context = {
    user,
    helper: function () {},         // 模板的helper函数
    include: function (name) {      // 模板的include函数
        return templateMap[name]()
    },
    _: function(markup) {           // 如果有<srcipt>会执行，所以需要处理xss攻击
      if (!markup) return ''
      return String(markup)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/'/g, '&#39;')
        .replace(/"/g, '&quot;')
    } 
}

vm.runInNewContext('`<h2>${_(user.scrpit)}</h2>`', context)
// console.log(vm.runInNewContext('`<h2>${_(user.scrpit)}</h2>`', context))    // <h2>&lt;script /&gt;</h2>

Object.keys(templateMap).forEach(key => {   // 将map里每个模板都转成沙盒内执行的函数
    const temp = templateMap[key]           // 防止循环引用
    templateMap[key]= vm.runInNewContext(`
      (function() {
        return ${temp}
      });
    `, context)
})
// console.log(templateMap['templateA']()) // <h2><p>111</p></h2>