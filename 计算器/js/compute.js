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
    // len = len || 12;
    // return Number(a.toFixed(9))
    return a;
}

// 中缀表达式转为后缀表达式
function toSuffix(arr) {
    console.log('toSuffix***************begin')

    // 1.申请一个暂存运算符的栈，一个放后缀表达式的暂存数组
    let operator = new Stack();// 运算符
    let outPutArr = [];// 操作数
    // 2.遍历中缀表达式数组的元素
    for (let i = 0; i < arr.length; i++) {
        let item = arr[i];
        if (item instanceof Operator || item instanceof Bracket) {// 如果是操作符、括号
            console.log('toSuffix将被处理的item:' + item.basic())
            // 如果是‘)’,将‘(’之后的操作符出栈放入后缀表达式中，最后把‘(’出栈
            if (item === bracketRObj) {
                // 找到'('之前不断把栈顶的元素出栈，并放入输出数组中
                while (operator.peek() !== bracketLObj) {
                    outPutArr.push(operator.pop());
                }
                operator.pop();
            } else if (item === bracketLObj) {
                // 如果是’(‘,直接入后缀栈
                operator.push(item)
            } else {
                // 不满足直接入栈的情况，就把栈顶元素出栈，并放到输出数组，直到满足条件不再执行
                while (!(operator.isEmpty() || operator.peek() === bracketLObj || operator.peek().priority() < item.priority())) {
                    outPutArr.push(operator.pop())
                }
                // 满足入栈条件，item入操作符栈
                operator.push(item)
            }
        } else {// 操作数直接放入输出数组
            console.log('toSuffix将被处理的item:' + item)
            outPutArr.push(item);
        }
        logAll(operator.getItems(), 'toSuffix处理后操作符栈：')
        logAll(outPutArr, 'toSuffix处理后输出栈：')

    }// for
    // 3.清空操作符栈内剩余元素，放到后缀栈中
    logAll(operator.getItems(), 'toSuffix遍历后运算符栈剩余元素: ')
    // 取出剩余运算符元素到后缀表达式暂存数组中
    while (!operator.isEmpty()) {
        outPutArr.push(operator.pop());
    }
    logAll(arr, 'toSuffix转前: ')
    logAll(outPutArr, 'toSuffix转后: ')

    // 4.返回后缀表达式结果
    return outPutArr
}

// 求后缀表达式的结果
function toResult(arr) {
    let tempArr = [];
    // 从左到右遍历后缀表达式
    for (let item of arr) {
        // 如果遍历到的是运算符，取出暂存数组最后两个数字，进行运算
        if (item instanceof Operator) {
            // 连续取出末尾两个元素，注意位置，最后一个元素是被运算的z
            let b = tempArr.pop();
            let a = tempArr.pop();
            // 把运算结果放回暂存数组中
            tempArr.push(item.action(a, b));// 计算每次结果,并暂存到数组中
            console.log('toResult遍历到运算符：' + item.basic()+' 操作后的数组：'+tempArr)
        } else {
            // 如果被遍历到的是数字，直接暂存在数组里
            tempArr.push(item)
            console.log('toResult遍历到数字：' + item + ' 放入数组：' + tempArr)
        }// if else
    }// for
    console.log('toResult最终结果:' + tempArr);
    return parseFloat(tempArr[0].toFixed(12));// 最后仅剩一个元素,
}

// 计算输入的数组(中缀)，先调用转为后缀表达式函数，再计算结果
function compute(arr) {
    // 把接收到的中缀表达式转为后缀表达式
    arr = toSuffix(arr)
    // 返回后缀表达式的计算结果
    return toResult(arr)
}

// let str = '10 - 2 / ( 3 ) + ( 4 * ( 5 + 6 ) ) * 7'
// compute(str.split(' '))
// let aa = addObj
// let mm = minusObj
// let ll = bracketLObj
// let rr = bracketRObj
// let uu = multiplyObj
// let dd = divideObj
// let testArr = [10, mm, 2, dd, ll, 3, rr, aa, ll, 4, uu, ll, 5, aa, 6, rr, rr, uu, 7]
// console.log(testArr[1].priority())
// console.log(testArr[1] instanceof Operator)
// logArr(testArr)
// compute(testArr)

