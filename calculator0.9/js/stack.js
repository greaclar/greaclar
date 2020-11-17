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
