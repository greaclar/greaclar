// 获取页面元素
const box = document.querySelector('.con');
const show = document.querySelector('.show');
const formula = document.querySelector('.formula');
const result = document.querySelector('.result');
const keyEnter = document.querySelector('.keyEnter');

// 渲染页面
let keySet = [
    {basic: 'pop', quote: '⇤', type: 'editor'},
    {basic: 'ac', quote: '清空', type: 'editor'},
    {basic: '%', quote: '取模', type: 'operator'},
    {basic: '/', quote: '÷', type: 'operator'},
    {basic: '7', quote: '7', type: 'num'},
    {basic: '8', quote: '8', type: 'num'},
    {basic: '9', quote: '9', type: 'num'},
    {basic: '*', quote: '×', type: 'operator'},
    {basic: '4', quote: '4', type: 'num'},
    {basic: '5', quote: '5', type: 'num'},
    {basic: '6', quote: '6', type: 'num'},
    {basic: '-', quote: '-', type: 'operator'},
    {basic: '1', quote: '1', type: 'num'},
    {basic: '2', quote: '2', type: 'num'},
    {basic: '3', quote: '3', type: 'num'},
    {basic: '+', quote: '+', type: 'operator'},
    {basic: '(', quote: '(', type: 'l'},
    {basic: ')', quote: ')', type: 'r'},
    {basic: '0', quote: '0', type: 'num'},
    {basic: '.', quote: '.', type: 'num'},
    {basic: 'equal', quote: '=', type: 'editor'}
];

const keyBar = document.createElement('ul');
for (let i = 0; i < keySet.length; i++) {
    let keyItem = document.createElement('li');
    initKeyItem(keyItem, keySet[i]);
    keyBar.appendChild(keyItem);
}
keyEnter.appendChild(keyBar);

// 设置每个按键的自定义属性以及显示的值
function initKeyItem(keyItem, keyObj) {
    keyItem.setAttribute('data-basic', keyObj.basic);
    keyItem.innerHTML = '<span>' + keyObj.quote + ' </span>';
    keyItem.setAttribute('data-type', keyObj.type);
}

// 禁止文本被选中
document.addEventListener('selectstart', function (evt) {
    evt.preventDefault();
})

// 通过事件委托获取用户具体点击的li
keyBar.addEventListener('click', getKey);

function getKey(evt) {
    let keyEle = evt.target; // 事件源
    let tagName = keyEle.nodeName.toLowerCase(); // 事件源的标签类型
    // 只有点击到li标签才继续执行代码，若事件源是li中的span，把事件源给回li
    switch (tagName) {
        case 'li':
            break;
        case 'span':
            keyEle = keyEle.parentNode;
            break;
        default:
            return false;
    }

    // 每次点击输入键盘，调用input函数，把被点击的名称和类型传递进去
    input(keyEle.dataset.basic, keyEle.dataset.type);

    console.log('main点击的键 ' + keyEle.dataset.basic);
    console.log('main运算数组 ' + pieceArr);
}

let registerObj = new ItemRegister();
let pieceArr = [];// 字符串数组
let bracket = {
    l: [],
    r: [],
    differ: function () {
        return this.l.length - this.r.length;
    },
    clear: function (){
        this.l=[];
        this.r=[];
    }
};// 字符串数组中的括号记录
let frontResult = '0';// 上一次的计算结果，初始是零

// 页面加载结果显示零
showTxt(result);

function input(keyBasic, keyType) {
    // 寄存器为初始状态：['initial', 'operator', 'float', 'int','(',')', 'num']
    // 寄存器为数字、操作符状态'()'：前一次输入了对应字符
    let frontType = registerObj.show().currType;
    if (keyType === 'operator') { // 当输入了操作符
        // +-*/%
        // 前：数、')'
        // if寄存器为初始状态，把frontResult放到计算数组中，再放入寄存器
        // // // 寄存器为初始状态,计算公式不为空，？？？？？？？？？？目前不存在这种情况
        // else 寄存器为数字状态、')'，把数字、')'取出放到计算数组中，初始化栈*******，把运算符放入寄存器
        // else 寄存器为操作符状态，直接放入寄存器（自动替换之前的）
        // else 寄存器为'(',把'('和一个零放到计算数组中，把'('放入寄存器
        if (frontType === 'initial') {
            pieceArr.push(frontResult);
            registerObj.push(keyBasic)
        } else if (frontType === 'num') {
            pieceArr.push(registerObj.package());
            registerObj.push(keyBasic);
        } else if (frontType === 'operator') {
            registerObj.push(keyBasic)
        } else if (frontType === 'r') {
            pieceArr.push(registerObj.package());
            bracket.r.push(pieceArr.length - 1)
            registerObj.push(keyBasic);
        } else if (frontType === 'l') {
            pieceArr.push(registerObj.package(), '0');
            bracket.l.push(pieceArr.length - 2)
            registerObj.push(keyBasic);
        }
    } else if (keyType === 'num') { // 输入的是数字&小数点
        // 前：运算符、'('
        // if寄存器为初始状态、数字状态，直接放入寄存器
        // else寄存器为运算符状态、'('，把运算符把运算符取出放到计算数组中，记录'('的位置，把数字放入寄存器
        // else寄存器为')',禁止输入
        if (frontType === 'initial' || frontType === 'num') {
            registerObj.push(keyBasic)
        } else if (frontType === 'operator') {
            pieceArr.push(registerObj.package())
            registerObj.push(keyBasic)
        } else if (frontType === 'l') {
            pieceArr.push(registerObj.package())
            bracket.l.push(pieceArr.length - 1)
            registerObj.push(keyBasic)
        } else if (frontType === 'r') {
            alert('右括号后面不能直接加数字')
        }
    } else if (keyType === 'l') {
        // (  前符、(
        // // if寄存器为初始状态，直接放入寄存器
        // // else 寄存器为运算符状态、'('，从寄存器中清出运算符、'('到计算数组中，把‘(’放入寄存器
        // // else 寄存器为数字状态、‘)’，禁止输入
        // 记录左括号
        // 每当计算数组存入一个'('（输入为数字、'('、加零后的运算符，会把寄存器中的'('放计算数组中），记录计算数组的length-1
        if (frontType === 'initial') {
            registerObj.push(keyBasic)
        } else if (frontType === 'operator') {
            pieceArr.push(registerObj.package())
            registerObj.push(keyBasic)
        } else if (frontType === 'l') {
            pieceArr.push(registerObj.package())
            bracket.l.push(pieceArr.length - 1)
            registerObj.push(keyBasic)
        } else if (frontType === 'r' || frontType === 'num') {
            alert('右括号、数字后面不能直接加左括号')
        }
    } else if (keyType === 'r') {
        // )  前：数、')' ; 后：符、)
        // // if寄存器为初始状态，禁止输入
        // // else 寄存器为运算符状态、‘(’、，禁止输入
        // // else 寄存器为数字状态、')'，从操作符中清出操作符到计算数组中，再把‘)’放入寄存器
        // 禁止过量右括号，左括号'('数量少于右括号')'
        // 消除冗余右括号
        // 每当计算数组存入一个')'（输入为运算符、')'、=时，会把寄存器中的')'放计算数组中），记录计算数组的位置length-1，
        //×// 查找最后一个输入的'('位置,if最后一个'('的位置和第一个')'位置之差≤2，从计算数组消除着两个位置的括号，消除这两个括号的记录
        if (bracket.differ() === 0) {
            alert('不能输入多余右括号')
        } else if (frontType === 'initial') {
            alert('右括号要跟在左括号之前哟')
        } else if (frontType === 'operator') {
            alert('运算符后面不能加右括号')
        } else if (frontType === 'l') {
            alert('何必多此一举呢，括号里面要有东西')
        } else if (frontType === 'num') {
            pieceArr.push(registerObj.package())
            registerObj.push(keyBasic)
        } else if (frontType === 'r') {
            pieceArr.push(registerObj.package());
            bracket.r.push(pieceArr.length - 1)
            registerObj.push(keyBasic);
        }
    } else if (keyType === 'editor') {// 输入的是删除、等于
        // 删除一个
        // // if寄存为初始状态，返回false
        // // 寄存器为数字状态、运算符状态、(、)，直接pop，如果pop返回false，寄存器已清空，被初始化******
        // // // 如果计算数组有元素，把计算数组最后一个元素读入寄存器
        // // // 如果计算数组无元素，保留寄存器初始，计算数组为空状态********
        // 删除全部
        // // if寄存为初始状态，返回false
        // // 寄存器有状态，清空计算数组，初始寄存器******
        // 等于
        // // 寄存器为初始状态，返回false
        // // 寄存器为数字状态、')'，把数字、')'从寄存器取出到计算数组，计算结果，初始化寄存器，并赋值给frontResult，清空计算数组***********==========
        // // 寄存器为运算符状态、'('，计算结果，初始运寄存器，并赋值给frontResult***********============
        // // 计算结果前，若右括号不足，自动补全
        if (keyBasic === 'pop') {
            if (frontType === 'initial' && frontResult == 0) {
                alert('没有可删除的元素');
                // return;
            }else {
                let isLast = registerObj.pop();
                if (isLast && (pieceArr.length > 0)) {
                    console.log('计算数组即将被返回一个到寄存器：'+pieceArr)
                    let popItem = pieceArr.pop()
                    registerObj.unPackage(popItem);
                    switch (popItem){
                        case ')':
                            bracket.r.pop();
                            console.log('pop r '+popItem)
                            break;
                        case '(':
                            console.log('pop l '+popItem)
                            bracket.l.pop();
                            break;
                        default:
                            console.log('pop else')
                    }
                } else {
                    // alert('删完了呀');
                    console.log('我还能删')
                }
            }
            // 删除寄存器中最后一个元素，并记录返回值

        } else if (keyBasic === 'ac') {
            pieceArr = [];
            registerObj.clear();
            bracket.clear();
        } else if (keyBasic === 'equal') {
            if (frontType === 'initial') {
                alert('没有可计算的元素');
                // return;
            }else if (frontType === 'num') {
                pieceArr.push(registerObj.package());
            } else if (frontType === 'r') {
                pieceArr.push(registerObj.package());
                bracket.r.push(pieceArr.length - 1);
            } else if (frontType === 'l') {
                // 特殊情况+（（（（（（
                while (pieceArr[pieceArr.length - 1] === '(' || isNaN(pieceArr[pieceArr.length - 1])) {
                    pieceArr.pop();
                }// while
            } else {
                // 暂存区是运算符，不处理
            }
            // 欠几个右括号补几个，右括号前面可能是num、右括号
            let lessNum = bracket.differ()
            for (let i = 0; i < lessNum; i++) {
                pieceArr.push(')');
            }
            console.log('将被计算的数组：'+pieceArr)
            frontResult = compute(pieceArr);
            let showArr = pieceArr.slice(0);
            showArr.push('=');
            showTxt(formula,showArr)
            showTxt(result,frontResult)
            pieceArr=[]
            registerObj.clear()
            bracket.clear()
            return ;
        }
    }// editor
    showTxt(formula,pieceArr);
    showTxt(result,registerObj.show().stackItems.join(''))
}

function showTxt(obj, text) {
    // 若text没有定义，则为零
    if (!text){
        obj.innerHTML = '0';
        return ;
    }
    // 数组对象即使是空也是真
    if (Array.isArray(text)) {
        // 深拷贝原数组，防止以下代表修改实参本身
        text = text.slice(0)
        for (let i = 0; i < text.length; i++) {
            text[i]=toCn(text[i]);
        }
        obj.innerHTML = text.join(' ');
    } else {
        obj.innerHTML = toCn(text);
    }
}

function toCn(str) {
    switch (str) {
        case '+':
            return '加';
        case '-':
            return '减';
        case '*' :
            return '乘';
        case '/':
            return '除';
        case '%':
            return '模';
        case '=':
            return '等于'
        default:
            return str;
    }
}