function Stack() {
    let items = [];
    // 往栈顶添加元素
    this.push = function(ele) {
        items.push(ele)
    }
    // 移除栈顶元素，并返回被移除的元素
    this.pop = function() {
        return items.pop();
    }
    // 读取栈顶的元素，如果栈空返回-1
    this.peek = function() {
        if (this.isEmpty()) {
            return -1;
        }
        return items[items.length - 1];
    }
    // 返回栈中元素个数
    this.size = function() {
        return items.length;
    }
    // 判断栈是否为空
    this.isEmpty = function() {
        return items.length === 0;
    }
    // 清空栈中的元素
    this.clear = function() {
        items = [];
    }
    // 以一串字符串形式返回栈中的元素
    this.show = function() {
        return items.toString();
    }
    // 以数组形式返回栈中的所有元素
    this.getItems = function() {
        return items;
    }
}
// 加减乘除取模
function add(a, b) {
    a = parseFloat(a);
    b = parseFloat(b);
    return fixDecimal(a + b);
}

function minus(a, b) {
    return fixDecimal(a - b);
}

function multiply(a, b) {
    return fixDecimal(a * b);
}

function divide(a, b) {
    return fixDecimal(a / b);
}

function mod(a, b) {
    return fixDecimal(a % b);
}
// 修复精度问题
function fixDecimal(a, len) {
    len = len || 12;
    return Number(a.toFixed(len))
}
// 运算符转为与其优先级对应的数字
function toSortNum(a){
    switch (a){
        case '+':
            return 1;
        case '-':
            return 1;
        case '*':
            return 2;
        case '/':
            return 2;
        case '%':
            return 2;
        default:
            console.log('运算符无法匹配！')
            return -1
    }
}

// 中缀表达式转为后缀表达式
function toSuffix(arr) {
    // 1.申请两个栈，一个暂存运算符，一个方后缀表达式
    console.log('toSuffix***************begin')
    let operator = new Stack();// 操作符
    let outPut = [];// 操作数
    // 2.遍历中缀表达式数组的元素
    for (let i = 0; i < arr.length; i++) {
        let item = arr[i];
        console.log('toSuffix将被处理的item:'+item);
        if (isNaN(item)) {// 如果是操作符
            // 如果是‘)’,将‘(’之后的操作符出栈放入后缀表达式中，最后把‘(’出栈
            if (item === ')') {
                while (operator.peek() !== '(') {
                    outPut.push(operator.pop());
                }
                operator.pop();
            } else if (item === '(') {
                // 如果是’(‘,直接入后缀栈
                operator.push(item)
            } else {
                // 不满足直接入栈的情况，就把栈顶元素出栈，并放到后缀栈，直到满足条件不再执行
                while (!(operator.isEmpty() || operator.peek() === '(' || toSortNum(operator.peek()) < toSortNum(item))) {
                    outPut.push(operator.pop())
                }
                // 满足入栈条件，item入操作符栈
                operator.push(item)
            }
        } else {// 操作数直接入后缀栈
            outPut.push(item);
        }
        console.log('toSuffix处理后操作符栈：'+operator.show()+' | 处理后输出栈：'+outPut.toString())

    }// for
    // 3.清空操作符栈内剩余元素，放到后缀栈中
    operator.show()// 显示剩余元素
    while (!operator.isEmpty()) {
        outPut.push(operator.pop());
    }
    console.log('toSuffix转前'+arr.toString())
    console.log('toSuffix转后'+outPut.toString())

    // 4.返回后缀表达式结果
    return outPut
}

// 求后缀表达式的结果
function toResult(arr){
    let tempArr = [];
    for (let item of arr){
        if(isNaN(item)){
            console.log('toResult运算符:'+item)
            let temp;// 暂存每次结果
            // 连续取出末尾两个元素，注意位置，最后一个元素是被运算的
            let b = tempArr.pop();
            let a = tempArr.pop();
            switch (item){
                case '+':
                    temp = add(a,b);
                    break;
                case '-':
                    temp = minus(a,b);
                    break;
                case '*':
                    temp = multiply(a,b);
                    break;
                case '/':
                    temp = divide(a,b);
                    break;
                case '%':
                    temp = mod(a,b);
                    break;
                default:
                    console.log('运算符无法匹配！')
                    return -1
            }
            tempArr.push(temp);
            console.log(tempArr);
        }else {
            tempArr.push(item)
            console.log('toResult数字：'+item + ' | 数组：'+tempArr)

        }// if else
    }// for
    console.log('toResult结果:'+tempArr);
    return tempArr[0];// 最后仅剩一个元素
}

// 计算输入的数组(中缀)，先调用转为后缀表达式函数，再计算结果
function compute(arr){
    // 把末尾的多余运算符号删除
    if(isNaN(arr[arr.length-1]) && arr[arr.length-1] !== ')' ){
        arr.pop()
    }
    arr = toSuffix(arr)
    return toResult(arr)
}
// let str = '10 - 2 / ( 3 ) + ( 4 * ( 5 + 6 ) ) * 7'
// compute(str.split(' '))


