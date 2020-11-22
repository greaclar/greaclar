// 获取页面元素
const formula = document.querySelector('.formula');
const result = document.querySelector('.result');
const keyEnter = document.querySelector('.keyEnter');

// 渲染页面
let keySet = [
    {basic: 'pop', quote: '⇤', type: '8'},
    {basic: 'ac', quote: '清空', type: '7'},
    {basic: '%', quote: '取模', type: '6'},
    {basic: '/', quote: '÷', type: '5'},
    {basic: '7', quote: '7', type: '10'},
    {basic: '8', quote: '8', type: '10'},
    {basic: '9', quote: '9', type: '10'},
    {basic: '*', quote: '×', type: '4'},
    {basic: '4', quote: '4', type: '10'},
    {basic: '5', quote: '5', type: '10'},
    {basic: '6', quote: '6', type: '10'},
    {basic: '-', quote: '-', type: '3'},
    {basic: '1', quote: '1', type: '10'},
    {basic: '2', quote: '2', type: '10'},
    {basic: '3', quote: '3', type: '10'},
    {basic: '+', quote: '+', type: '2'},
    {basic: '(', quote: '(', type: '0'},
    {basic: ')', quote: ')', type: '1'},
    {basic: '0', quote: '0', type: '10'},
    {basic: '.', quote: '.', type: '10'},
    {basic: 'equal', quote: '=', type: '9'}
];

// 渲染数字键盘
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
    let index = parseInt(keyEle.dataset.type);
    // 每次点击输入键盘，调用input函数
    console.log('main点击的键 ' + keyEle.dataset.basic);
    if (index === 10) {
        // 当点击的是数值，直接把按键的basic属性值(数字值的字符型)直接作为参数
        input2(keyEle.dataset.basic);
        showTips(previousResult(infixArr,false,registerObj.package()),1)
    } else {
        // 当点击的为非数值，则把根据type找到相应类型的实例对象地址作为参数
        input2(objsArr[index]);
        if (index === 9){// 如果按下等于号
            frontFormula.push(equalObj)
            formula.innerText = joinText(frontFormula,' ')
            result.innerText = frontResult;
            // 每次按下等于号清空，上面变量的赋值，让其字面量留在页面
            ac();
            return ;
        } else if (index === 7 || registerObj.isEmpty()) {// 按下清空键
            showTips('',0)
        }else if(index === 8){// 如果按下退格键
            showTips(previousResult(infixArr,false,registerObj.package()),1)
        }
    }

    logAll(infixArr, 'main运算数组 ');
    formula.innerText = joinText(infixArr,' ')
    result.innerText = joinText(registerObj.show().stackItems,'') || 0;
}

function input2(basic) {
    if (basic instanceof Bracket || basic instanceof Editor) {
        console.log('main-input2: 括号、编辑');
        basic.action();
    } else if (basic instanceof Operator) {// 点击的是运算符
        console.log('main-input2：运算符')
        enterOperator(basic);
    } else {// 其他情况只剩下数字
        console.log('main-input2：数字')
        enterNum(basic);
    }
}

// 如果第一个参数是一个数组，返回用第二个参数拼接各元素的字符串；如果一个参数不是数组，返回其本身
function joinText(text, str) {
    // 如果text是一个数组
    if (Array.isArray(text)) {
        // 数组不为空
        let temp = text.map(returnQuote)
        return temp.join(str)
    } else {
        // 输入的不是数组，返回引用的basic或其本身
        return returnQuote(text);
    }

    // 返回运算符、编辑符、括号的quote属性
    function returnQuote(item) {
        if (item instanceof Operator || item instanceof Editor || item instanceof Bracket) {
            return item.quote();
        } else {
            return item;
        }
    }
}

// function input(enterKeyBasic, enterKeyIndex) {
//     // 寄存器为数字、操作符状态'()'：前一次输入了对应字符
//     let frontKeyType = registerObj.show().currType;
//     if (enterKeyBasic === typesArr[1]) { // 当输入了运算符
//         // +-*/%
//         // 前：数、')'
//         // if寄存器为初始状态，把frontResult放到计算数组中，再放入寄存器
//         // // // 寄存器为初始状态,计算公式不为空，？？？？？？？？？？目前不存在这种情况
//         // else 寄存器为数字状态、')'，把数字、')'取出放到计算数组中，初始化栈*******，把运算符放入寄存器
//         // else 寄存器为操作符状态，直接放入寄存器（自动替换之前的）
//         // else 寄存器为'(',把'('和一个零放到计算数组中，把'('放入寄存器
//     } else if (enterKeyIndex === 10) { // 输入的是数字&小数点
//         // 前：运算符、'('
//         // if寄存器为初始状态、数字状态，直接放入寄存器
//         // else寄存器为运算符状态、'('，把运算符把运算符取出放到计算数组中，记录'('的位置，把数字放入寄存器
//         // else寄存器为')',禁止输入
//     } else if (enterKeyIndex === 0) {
//         // (  前符、(
//         // // if寄存器为初始状态，直接放入寄存器
//         // // else 寄存器为运算符状态、'('，从寄存器中清出运算符、'('到计算数组中，把‘(’放入寄存器
//         // // else 寄存器为数字状态、‘)’，禁止输入
//         // 记录左括号
//         // 每当计算数组存入一个'('（输入为数字、'('、加零后的运算符，会把寄存器中的'('放计算数组中），记录计算数组的length-1
//     } else if (enterKeyIndex === 1) {
//         // )  前：数、')' ; 后：符、)
//         // // if寄存器为初始状态，禁止输入
//         // // else 寄存器为运算符状态、‘(’、，禁止输入
//         // // else 寄存器为数字状态、')'，从操作符中清出操作符到计算数组中，再把‘)’放入寄存器
//         // 禁止过量右括号，左括号'('数量少于右括号')'
//         // 消除冗余右括号
//         // 每当计算数组存入一个')'（输入为运算符、')'、=时，会把寄存器中的')'放计算数组中），记录计算数组的位置length-1，
//         //×// 查找最后一个输入的'('位置,if最后一个'('的位置和第一个')'位置之差≤2，从计算数组消除着两个位置的括号，消除这两个括号的记录
//     } else if (enterKeyIndex === typesArr[7]) {// 输入的是删除、等于
//         // 删除一个
//         // // if寄存为初始状态，返回false
//         // // 寄存器为数字状态、运算符状态、(、)，直接pop，如果pop返回false，寄存器已清空，被初始化******
//         // // // 如果计算数组有元素，把计算数组最后一个元素读入寄存器
//         // // // 如果计算数组无元素，保留寄存器初始，计算数组为空状态********
//         // 删除全部
//         // // if寄存为初始状态，返回false
//         // // 寄存器有状态，清空计算数组，初始寄存器******
//         // 等于
//         // // 寄存器为初始状态，返回false
//         // // 寄存器为数字状态、')'，把数字、')'从寄存器取出到计算数组，计算结果，初始化寄存器，并赋值给frontResult，清空计算数组***********==========
//         // // 寄存器为运算符状态、'('，计算结果，初始运寄存器，并赋值给frontResult***********============
//         // // 计算结果前，若右括号不足，自动补全
//         } else if (enterKeyBasic === 'ac') {
//         } else if (enterKeyBasic === 'equal') {
//         }
//     }// editor
// // 显示结果到页面上
// }




