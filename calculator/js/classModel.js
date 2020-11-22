// 栈构造函数
function Stack() {
    let items = [];
    // 往栈顶添加元素
    this.push = function (ele) {
        items.push(ele)
    }
    // 移除栈顶元素，并返回被移除的元素
    this.pop = function () {
        return items.pop();
    }
    // 读取栈顶的元素，如果栈空返回-1
    this.peek = function () {
        if (this.isEmpty()) {
            return -1;
        }
        return items[items.length - 1];
    }
    // 返回栈中元素个数
    this.size = function () {
        return items.length;
    }
    // 判断栈是否为空
    this.isEmpty = function () {
        return items.length === 0;
    }
    // 清空栈中的元素
    this.clear = function () {
        items = [];
    }
    // 以数组形式返回栈中的所有元素
    this.getItems = function () {
        return items;
    }
}

// 运算符(+-*/%)构造函数
function Operator(basic, priority, quote, behavior) {
    let operator = [basic, priority, quote];
    this.basic = function () {
        return operator[0]
    }
    this.priority = function () {
        return operator[1]
    }
    this.quote = function () {
        return operator[2]
    }
    // 为实例绑定的函数
    this.action = behavior;
}

// 编辑符(ac、bs、等于)构造函数
function Editor(basic,quote,behavior){
    let name = basic;
    let showName = quote;
    // 返回该实例的basic值
    this.basic = function (){
        return name;
    }
    // 返回实例的quote值
    this.quote = function (){
        return showName;
    }
    // 为实例绑定的函数
    this.action = behavior;
}
// 括号构造函数
function Bracket(basic,quote,behavior){
    let name = basic;
    let showName = quote;
    let locationArr = [];// 记录的括号位置
    // 返回该实例的basic值
    this.basic = function (){
        return name;
    }
    // 返回该实例的quote值
    this.quote = function (){
        return showName;
    }
    // 添加括号，记录其位置
    this.add = function (index){
        console.log(this.basic()+'对象存入位置 '+index)
        locationArr.push(index)
    }
    // 移除括号，消除其位置记录
    this.remove = function () {
        console.log(this.basic()+'对象删除位置 '+locationArr)
        locationArr.pop()
    }
    // 初始化括号位置
    this.initialize = function (){
        locationArr = [];
    }
    // 返回括号个数
    this.count = function (){
        return locationArr.length;
    }
    // 返回元素中小于等于某个值(targetIndex)的元素个数，用于找到数组内某个索引之前的左/右括号数量
    this.indexOf = function (targetIndex){
        let record = 0;
        // for循环遍历，如果数组没有元素也能正常运行
        for (let i = 0;i<locationArr.length;i++){
            if (targetIndex >= locationArr[i]){
                record++;
            }else {
                break;
            }
        }
        console.log('bracket locationArr'+locationArr.join(' ')+' target:'+targetIndex+' record '+record)
        return record;
    }
    // 为实例绑定函数
    this.action = behavior;
}

// 输出
function logAll(arr, explain) {
    // 当explain参数，没有被定义，则被替换为logArr
    explain = (explain) ? explain : 'logArr '
    // 如果arr是一个数组
    if (Array.isArray(arr)){
        let temp = arr.map(returnBasic)
        if (arr.length === 0) {
            console.log(explain+ ': 空数组');
        } else {
            console.log(explain+temp);
        }
    } else {
        // 输入的不是数组，返回引用的basic或其本身
        console.log(explain+returnBasic(arr))
    }

    function returnBasic(item) {
        if (item instanceof Operator || item instanceof Editor || item instanceof Bracket) {
            return item.basic();
        } else {
            return item;
        }
    }
}
