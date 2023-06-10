(function flexible(window, document) {
    // 获取html标签元素
    var docEl = document.documentElement
    // 获取显示物理像素比
    var dpr = window.devicePixelRatio || 1

    // adjust body font size  设置body标签的字体大小
    function setBodyFontSize() {
        // 如果找到页面中body标签，立即设置body的字体大小
        if (document.body) {
            
            document.body.style.fontSize = (12 * dpr) + 'px';
        } else {
            // 如果页面中未加载好body标签，则等待DOM元素加载完毕再去触发一次本次函数
            document.addEventListener('DOMContentLoaded', setBodyFontSize)
        }
    }

    setBodyFontSize();

    // set 1rem = viewWidth / 10 ：设置html标签的文字大小为可视区域的十分之一
    function setRemUnit() {
        var rem = docEl.clientWidth / 10
        rem = (rem <= 32) ? 32 : rem;

        if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
        } else {
            rem = (rem >= 80) ? 80 : rem;
        }

        docEl.style.fontSize = rem + 'px';
        // document.body.style.height = window.innerHeight + 'px';
        // // 获取视口高度，乘以1%得到一个vh单位的值
        // let vh = window.innerHeight * 0.01;
        // // 将`--vh`自定义属性中的值设置为文档的根目录一个属性
        // document.documentElement.style.setProperty('--vh', vh + 'px');
    }

    setRemUnit()

    // reset rem unit on page resize  当页面尺寸大小发生变化，重新设置html标签文字大小
    window.addEventListener('resize', setRemUnit)
    // pageshow事件在重新加载页面触发
    window.addEventListener('pageshow', function (e) {
        // e.persisted 若返回的是true，代表这个页面是从缓存取过来的页面，同样重新设置html标签文字大小
        if (e.persisted) {
            setRemUnit()
        }
    })

    // detect 0.5px supports ：有些移动端的浏览器不支持0.5像素的写法
    if (dpr >= 2) {
        var fakeBody = document.createElement('body')
        var testElement = document.createElement('div')
        testElement.style.border = '.5px solid transparent'
        fakeBody.appendChild(testElement)
        docEl.appendChild(fakeBody)
        if (testElement.offsetHeight === 1) {
            docEl.classList.add('hairlines')
        }
        docEl.removeChild(fakeBody)
    }
}(window, document))

// 只有当电脑打开，.con的宽度为10rem
if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
} else {
    document.querySelector('.con').style.width = '10rem';
    console.log(document.documentElement.offsetWidth)
    if (document.documentElement.offsetWidth > 700) {
        document.querySelector('.tips').style.fontSize = '0.3rem'
        document.querySelector('.tips1').style.fontSize = '0.3rem'
        document.querySelector('.tips2').style.fontSize = '0.3rem'
        document.querySelector('.formula').style.fontSize = '0.3rem'
    }
}

