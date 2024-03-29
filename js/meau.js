window.addEventListener('load', function windowFirstLoad() {
    const meau = document.querySelector('.meau');
    const itemHeads = meau.querySelectorAll('.item-head');
    const itemBodys = meau.querySelectorAll('.item-body');

    let eventType;
    let EvenIns;
    if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
        eventType = 'touchend';
    } else {
        eventType = 'click';
    }
    EvenIns = new Event(eventType);
    // 为每个选项头添加点击事件，相应的选项体会展开
    for (let i = 0; i < itemHeads.length; i++) {
        itemHeads[i].addEventListener(eventType, function () {

            // 如果点击的是最后一个收起选项，则不打开任何选项体
            if (i === itemHeads.length - 1 || itemBodys[i].getAttribute('flod') === '1') {
                flodAll(itemBodys)
                return;
            } else {
                flodAll(itemBodys)
                unflod(itemBodys[i])
            }
        })
    }

    itemHeads[0].dispatchEvent(EvenIns);
    window.removeEventListener('load', windowFirstLoad)

    // 把传入的所有元素调用一次flod函数
    function flodAll(eles) {
        for (let i = 0; i < eles.length; i++) {
            flod(eles[i])
        }
    }

    // 设置元素的flod属性为1，通过css属性选择器，把它的max-height设置为100rem
    function unflod(ele) {
        ele.setAttribute('flod', '1')
    }

    // 设置元素的flod属性为0，通过css属性选择器，把它的max-height设置为0rem
    function flod(ele) {
        ele.setAttribute('flod', '0')
    }
})

// 获取视口高度，乘以1%得到一个vh单位的值
let vh = window.innerHeight * 0.01;
// 将`--vh`自定义属性中的值设置为文档的根目录一个属性
document.documentElement.style.setProperty('--vh', vh + 'px');