let registerObj = new ItemRegister();// 寄存器
let infixArr = [];// 中缀表达式数组
let frontResult = 0;// 上一次的计算结果，初始是零
let frontFormula =[];// 上一次的计算式子
// 括号
let bracketLObj = new Bracket('(','(')
let bracketRObj = new Bracket(')',')')
// 加减乘除模
let addObj = new Operator('+', 1, '加', add)
let minusObj = new Operator('-', 1, '减', minus)
let multiplyObj = new Operator('*', 2, '乘', multiply)
let divideObj = new Operator('/', 2, '除以')
let modObj = new Operator('%', 2, '模', mod)
// 编辑（bs、ac、equal）
let acObj = new Editor('ac')
let popObj = new Editor('pop')
let equalObj = new Editor('=','等于')

let objsArr = [bracketLObj,bracketRObj,addObj,minusObj,multiplyObj,divideObj,modObj,acObj,popObj,equalObj]

