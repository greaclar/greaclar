// 获取tips元素,用来提示非法输入
const tips = document.querySelector('.tips');

// 顶部显示tips的函数
function showTips(str, level) {
    // type && tips.setAttribute('type',type);
    let beforeLevel = parseInt(tips.getAttribute('level'))
    let timer = null;
    // level值比之前的大、相同、或者重置为0，则直接改变
    if (level >= beforeLevel || level === 0) {
        const tips1 = document.querySelector('.tips1')
        tips1.style.width = '0';
        tips1.style.opacity = '0';
        tips1.innerText = str;
        tips.setAttribute('level', level);
        // 当不是初始化（清空tips）
        if (level !== 0) {
            // 有延迟，产生过渡效果
            if (timer){
                clearTimeout(timer)
            }
            timer = setTimeout(function () {
                // innerText 放在外边，当是第一次输入且为不合法的输入，赋值会被重置为空字符串，包括level属性
                tips1.innerText = str;
                tips.setAttribute('level', level);
                tips1.style.width = '9.5rem';
                tips1.style.opacity = '0.8';
            }, (level - beforeLevel)*200)
        }
    } else {
        const tips2 = document.querySelector('.tips2');
        tips2.innerHTML = str;
        tips2.style.width = '9.5rem';
        if (timer){
            clearTimeout(timer)
        }
        timer = setTimeout(function () {
            tips2.style.width = '0';
        }, 1800)
    }
}

// 把中缀表达式的末尾的运算符和左括号都清除；右括号不足自动补全，然后后计算结果
function previousResult(trimArr, notClone, addition) {
    // 初始化tips
    // if (tips.getAttribute('level') !== '1'){
        showTips('', 0);
    // }
    // 不克隆要trim的数组，直接修改传入的实参原数组对象，按下等于键使用
    if (notClone) {
        console.log('notClone')
    } else {
        console.log('Clone')
        // 深复制传入的实参原数组对象(中缀表达式)
        trimArr = trimArr.slice(0)
        // 当传入了addition，（0也会识别为false）把addition追加到深复制的数组里（键入数字，得出预览结果使用）
        if(arguments.length===3){
            trimArr.push(addition)
        }
        // addition &&
    }
    // 如果中缀表达式中末尾是左括号或运算符，清除掉，直到碰到数字和右括号，停止清除  // 特殊情况+（（（（（（
    while ((trimArr[trimArr.length - 1] === bracketLObj) || (trimArr[trimArr.length - 1] instanceof Operator)) {
        trimArr.pop();
    }// while
    logAll(trimArr, 'previousResult++++++++++++删除末尾左括号和运算符后的数组：')

    // 找到剔除多余左符号后实际左括号的数量，减去右括号的数量，得到欠缺右边括号的数量
    let bracketNeed = bracketLObj.indexOf(trimArr.length - 1) - bracketRObj.count()
    for (let i = 0; i < bracketNeed; i++) {
        trimArr.push(bracketRObj)
    }
    logAll(trimArr, 'previousResult++++++++++++补充右括号后的数组：')
    return compute(trimArr)
}

// 除号实例绑定的行为函数，先判断被除数是否为零，如果为零，进行提示
divideObj.action = function (a, b) {
    if (b === 0) {
        showTips('不能除以零，除以零部分不会被计算', 3)
        return 0;
    }
    return divide(a, b);
}
modObj.action = function (a,b){
    if (b === 0) {
        showTips('不能对零求余，求余部分的结果不会被计算', 3)
        return 0;
    }
    return mod(a, b);
}

// 左括号实例绑定的行为函数，只用来判断输入合法行，决定键入的括号能否进入寄存器、寄存器中已存内容的处理
function bracketL() {
    // 如果寄存器为空（第一位），直接放入寄存器
    if (registerObj.isEmpty()) {
        registerObj.push(this);
        return;
    } else if (registerObj.package() === bracketRObj || !isNaN(registerObj.package())) {
        // alert('右括号、数字后面不能直接加左括号')
        showTips('右括号、数字后面不能直接加左括号', 2)
        return;
    } else if (registerObj.package() === this) {
        // 如果寄存器中是左括号，记录寄存器中的左括号将要插入数组中的位置
        this.add(infixArr.length)
    }
    // 寄存器中是运算符、左括号
    infixArr.push(registerObj.package())
    registerObj.push(this)
}

bracketLObj.action = bracketL;

// 右括号实例绑定的行为函数，只用来判断输入合法行，决定键入的括号能否进入寄存器、寄存器中已存内容的处理
function bracketR() {
    if (bracketRObj.count() - bracketLObj.count() === 0) {
        showTips('禁止输入多余右括号', 2)
        return;
    } else if (registerObj.isEmpty()) {
        alert('够了')
        showTips('右括号不能放在开头', 2);
        return;
    } else if (registerObj.package() instanceof Operator) {
        showTips('运算符后面不能加右括号', 2);
        return;
    } else if (registerObj.package() === bracketLObj) {
        showTips('括号里面要有运算', 2);
        return;
    } else if (registerObj.package() === bracketRObj) {
        // 防止中缀表达式中是(1+2，然后连续输入两个)),导致中缀保存了(1+2)，而另一个进入了寄存器
        if (bracketRObj.count() - bracketLObj.count() === -1) {
            showTips('右括号够了，不能再输入', 2);
            return;
        }
        // 如果寄存器中是右括号，记录右括号的位置
        bracketRObj.add(infixArr.length);
    }
    // 寄存器中是数字或右括号
    infixArr.push(registerObj.package())
    registerObj.push(bracketRObj)
}

bracketRObj.action = bracketR;

// 编辑符 全清实例的绑定函数，把所有变量初始化
function ac() {
    infixArr = [];
    registerObj.clear();
    bracketLObj.initialize();
    bracketRObj.initialize();
    frontResult = 0;
    frontFormula = [];
}

acObj.action = ac;

// 编辑符 退格键实例的绑定函数，删除寄存器最后一位元素，如果寄存器没东西，则从infixArr中取出最后一个元素到寄存器中
function bs() {
    // 当寄存器为空，且上一次无计算结果（或结果为零）
    if (registerObj.isEmpty() && frontResult === 0) {
        // showTips('没有可删除的元素', 2);
    } else {
        let isLast = registerObj.pop();
        if (isLast && (infixArr.length > 0)) {
            console.log('bs 计算数组即将被返回一个到寄存器：' + logAll(infixArr))
            let popItem = infixArr.pop()
            // 如果删除的是括号元素，删除括号所在位置
            if (popItem instanceof Bracket) {
                popItem.remove()
            }
            registerObj.unPackage(popItem);
        } else {
            logAll(registerObj.show().stackItems, 'bs 寄存器还剩下: ')
        }
    }
}

popObj.action = bs;

// 编辑符 等于号实例的行为函数
function equal() {
    if (registerObj.isEmpty()) {// 寄存器为空,首先判断，让!isNaN(registerObj.package())条件只剩数字
        showTips('没有可计算的元素', 2);
        return;
    } else if (!isNaN(registerObj.package())) {// 寄存器保存着数字
        infixArr.push(registerObj.package());
    } else if (registerObj.package() === bracketRObj) {// 寄存器还保留着右边括号
        bracketRObj.add(infixArr.length);
        infixArr.push(registerObj.package());
    } else if (registerObj.package() === bracketLObj) {// 寄存器还保留左括号
        // 不处理，留在寄存器等待被清空
    } else {
        // 暂存区是运算符，不处理，留在寄存器等待被清空
    }

    logAll(infixArr, '将被计算的数组：')
    frontResult = previousResult(infixArr, true);
    logAll(frontResult, '结果：')
    // 拼接显示的公式
    frontFormula = infixArr;
    logAll(infixArr, '历史式子数组：')

    return;
}

equalObj.action = equal

// 键入数字的处理函数
function enterNum(basic) {
    if (registerObj.isEmpty() || !isNaN(registerObj.package())) {
        // 想进入的寄存器中是空的、含有数字
    } else if (registerObj.package() instanceof Operator) {// 想进入的寄存器中是运算符
        infixArr.push(registerObj.package());
    } else if (registerObj.package() === bracketLObj) {// 想进入的寄存器中是左括号
        bracketLObj.add(infixArr.length);
        infixArr.push(registerObj.package());
    } else if (registerObj.package() === bracketRObj) {// 想进入的寄存器中是右括号
        showTips('右括号后面不能直接加数字', 2)
        return;
    }
    registerObj.push(basic);

}

// 键入运算符的处理函数
function enterOperator(basic) {
    console.log('enterOperator---begin')
    if (registerObj.isEmpty()) {// 想进入的寄存器中是空的

        // 寄存器为空的情况下输入运算符，先把前面的计算结果放入中缀数组中
        infixArr.push(frontResult);
        registerObj.push(basic)
    } else if (!isNaN(registerObj.package())) {// 想进入的寄存器是数字
        infixArr.push(registerObj.package());
        registerObj.push(basic);
    } else if (registerObj.package() instanceof Operator) {// 想进入的寄存器是运算符

        registerObj.push(basic)
    } else if (registerObj.package() === bracketRObj) {// 想进入的寄存器是右括号

        bracketRObj.add(infixArr.length)
        infixArr.push(registerObj.package());
        registerObj.push(basic);
    } else if (registerObj.package() === bracketLObj) {// 想进入的寄存器是左括号

        bracketLObj.add(infixArr.length)
        infixArr.push(registerObj.package(), '0');
        registerObj.push(basic);
    }
}