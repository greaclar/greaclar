
// 继承Stack类，构造一个寄存每次输入的数字项或运算符项
function ItemRegister() {
    let _this = this;
    let stack = new Stack();
    let typeIndex = 0;
    let currTypes = ['initial', 'operator', 'l', 'r', 'float', 'int', 'num'];
    // 暂存的是运算符
    let formatOperator = function (ele) {
        // console.log(this) this指向全局对象
        // 无论是否已经暂存了元素，都先清空，保证输入的运算符只有一个
        _this.clear();
        stack.push(ele);
    }

    // 暂存的是小数或整数
    let formatNum = function (ele) {
        // 如果已经暂存了非num类型，则先清空
        if (typeIndex <= 3) {
            console.log('改存数字啦')
            _this.clear();
        }
        // if输入了小数点，else输入的是数字
        if (ele === '.') {
            // 未输入过小数点：栈空、栈不空但无小数点
            if (stack.isEmpty()) {
                stack.push('0');
            } else if (typeIndex === 4) {
                return; // 栈中已经添加过'.',不再添加
            }
            stack.push(ele);
            typeIndex = 4;
        } else {
            stack.push(ele)
        } // if'.'

    }

    // 往栈添加元素
    this.push = function (ele) {
        console.log('will push ' + ele + ' to ' + stack.getItems())
        // 当添加运算符数(整/小数/括号)后，标记typeIndex为对应的值
        if (isNaN(ele) && ele !== '.') {
            formatOperator(ele);
            switch (ele) {
                case '(':
                    typeIndex = 2;
                    break;
                case ')':
                    typeIndex = 3;
                    break;
                default:
                    typeIndex = 1;
            }
        } else {
            // 阻止输入的数字位数多于13个
            if (stack.size() > 12) {
                console.log('输入过多');
                return false;
            }
            formatNum(ele);
            // 小数是4，整数是5
            typeIndex = (typeIndex === 4) ? 4 : 5;
        }
    }
    // 删除栈顶元素
    this.pop = function () {
        // 如果删除的是最后一个元素，清空栈
        console.log('poping ' + stack.getItems() + ' size:' + stack.size())
        if (stack.size() === 1) {
            console.log('poping last item')
            this.clear();
            return true;
        } else if (stack.peek() === '.') {
            // 如果将pop的是小数点，修改typeIndex为5(int)
            typeIndex = 5;
        }
        stack.pop();
        return false;
    }
    // 判断栈是否为空
    this.isEmpty = function () {
        return stack.isEmpty();
    }
    // 重置所有变量（栈、记录现存类型的typeIndex变量）
    this.clear = function () {
        console.log('clearing：' + stack.getItems())
        stack.clear();
        typeIndex = 0;
    }
    // 打包栈中的内容，返回（运算符返回运算符字符串，数字返回数值类型）
    this.package = function () {
        if (typeIndex <= 3) {
            return stack.getItems()[0];
        } else {
            // 输出为float类型，如果字符串末尾有小数点，头部有0，则被去掉
            return parseFloat(stack.getItems().join('')) || 0;
        }

    }
    // 拆分输入内容(多位数的数值、运算符字符串)，并依次放入栈中
    this.unPackage = function (str){
        this.clear();
        console.log('被删除的类型：'+typeof str + ': '+str)
        let tempArr = str.toString().split('');
        for (let i =0 ;i<tempArr.length;i++){
            this.push(tempArr[i]);
        }
        console.log(str+' 已被输入寄存器：'+this.show().stackItems)
    }
    // 返回目前栈和现存类型的情况
    this.show = function () {
        let i = typeIndex;
        if (i >= 4) {
            i = 6;
        }
        return {
            'stackItems': stack.getItems(),
            'currType': currTypes[i]
        }
    }
}

// pop方法，当栈中无元素，未定义如何去处理(只有一个元素可清时，清除后会返回false)
function test() {
    let t = new ItemRegister();
    t.push('0')
    t.push('1')
    console.log('现存种类：' + t.show().currType + ' 内部元素:' + t.show().stackItems + ' 空：' + t.isEmpty());
    t.push('.')
    t.push('2')
    t.push('.')
    console.log('package:' + t.package());
    console.log('现存种类：' + t.show().currType + ' 内部元素:' + t.show().stackItems + ' 空：' + t.isEmpty());
    console.log(t.pop())
    console.log('现存种类：' + t.show().currType + ' 内部元素:' + t.show().stackItems + ' 空：' + t.isEmpty());
    console.log(t.pop())
    console.log('现存种类：' + t.show().currType + ' 内部元素:' + t.show().stackItems + ' 空：' + t.isEmpty());
    console.log(t.pop())
    console.log('现存种类：' + t.show().currType + ' 内部元素:' + t.show().stackItems + ' 空：' + t.isEmpty());
    t.clear()
    console.log('现存种类：' + t.show().currType + ' 内部元素:' + t.show().stackItems + ' 空：' + t.isEmpty());
    t.push('+')
    console.log('现存种类：' + t.show().currType + ' 内部元素:' + t.show().stackItems + ' 空：' + t.isEmpty());

    t.push('-')
    console.log('package:' + t.package());

    t.push('(')
    console.log('现存种类：' + t.show().currType + ' 内部元素:' + t.show().stackItems + ' 空：' + t.isEmpty());
    t.push('1')
    console.log('package:' + t.package());
    console.log('现存种类：' + t.show().currType + ' 内部元素:' + t.show().stackItems + ' 空：' + t.isEmpty());

    t.push(')')
    // t.pop()
    console.log('现存种类：' + t.show().currType + ' 内部元素:' + t.show().stackItems + ' 空：' + t.isEmpty());
}
// test()
// let te = new ItemRegister();
// te.push('+')
// console.log('新创建的Stack中的arr '+te.show().currType);
// te.unPackage('66666')
// console.log('现存种类：' + te.show().currType + ' 内部元素:' + te.show().stackItems + ' 空：' + te.isEmpty());
//
// console.log(te.pop())
// console.log(te.pop())
// console.log(te.pop())
// console.log(te.pop())
// console.log(te.pop())
// console.log(te.pop())
