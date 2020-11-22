
// 继承Stack类，构造一个寄存每次输入的数字项或运算符项
function ItemRegister() {
    let _this = this;
    let stack = new Stack();
    let typeIndex = 0;
    // let currTypes = ['initial', 'operator/bracket', 'float', 'int'];
    // 暂存的是运算符/括号
    let formatOperator = function (ele) {
        // console.log(this) this指向全局对象
        // 无论是否已经暂存了元素，都先清空，保证输入的运算符、括号只有一个
        _this.clear();
        stack.push(ele);
    }

    // 暂存的是小数或整数
    let formatNum = function (ele) {
        // 如果已经暂存了非num类型，则先清空
        if (typeIndex < 2) {
            console.log('itemRegister-formatNum 改存数字啦')
            _this.clear();
        }
        // if输入了小数点，else输入的是数字
        if (ele === '.') {
            // 未输入过小数点：栈空、栈不空但无小数点
            if (stack.isEmpty()) {
                stack.push('0');
            } else if (typeIndex === 2) {
                return; // 栈中已经添加过'.',不再添加
            }
            stack.push(ele);
            typeIndex = 2;
        } else {
            stack.push(ele)
        } // if'.'

    }

    // 重写Stack类的push方法
    this.push = function (ele) {
        // 限制输入最大长度为11个
        logAll(ele,'itemRegister-push receive ')

        // 当添加运算符数(整/小数/括号)后，标记typeIndex为对应的值
        if (ele instanceof Operator|| ele instanceof Bracket) {
            formatOperator(ele);
            typeIndex = 1;
        } else {
            // 防止输入的数字位数超过13位
            if (stack.size() > 12) {
                return;
            }
            formatNum(ele);
            typeIndex = (typeIndex === 2) ? 2 : 3;
        }
        logAll(stack.getItems(),'itemRegister-push content ')

    }
    this.pop = function () {
        logAll(stack.getItems(),'itemRegister-pop pop the last of ')
        if (stack.size() === 1) {
            // 如果删除的是最后一个元素，清空栈,返回true
            console.log('itemRegister-pop the last item is gone')
            this.clear();
            return true;
        } else if (stack.peek() === '.') {
            // 如果将pop的是小数点，修改typeIndex为3(int)
            typeIndex = 3;
        }
        stack.pop();
        return false;
    }
    this.isEmpty = function () {
        return stack.isEmpty();
    }
    this.clear = function () {
        logAll(stack.getItems(),'itemRegister-clear clearing：')
        stack.clear();
        typeIndex = 0;
    }
    // 打包返回栈中的元素，如果是运算符，则返回其地址；是数字返回转为float类型的数字
    this.package = function () {
        if (typeIndex < 2) {
            return stack.getItems()[0];
        } else {
            // 转为float类型，如果字符串末尾有小数点，头部有0，则被去掉
            return parseFloat(stack.getItems().join('')) || 0;
        }
    }
    // 运行前清空栈，再把参数拆分。如果是运算符/括号，直接存；是数字，先转为字符串数组，再依次放入栈
    this.unPackage = function (packet){
        this.clear();
        logAll(packet,'itemRegister-unPackage 接收：')
        // 如果是引用，直接带哦有push方法
        if(packet instanceof Operator || packet instanceof Bracket){
            this.push(packet)
        }else {
            // 如果是数字，先转为字符数组，再依次存入
            let tempArr = packet.toString().split('');
            for (let i =0 ;i<tempArr.length;i++){
                this.push(tempArr[i]);
            }
        }
        logAll(this.show().stackItems,'itemRegister-unPackage处理后的寄存器：')
    }
    this.show = function () {
        return {
            'stackItems': stack.getItems(),
            'typeIndex': typeIndex
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
