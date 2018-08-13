export default {
	//数据为空自定义过滤器
	noData(value, text = "暂无") {
		return(value == "" || value == null || value == "string") ? text : value;
	},
	//金三位三位小数点金额处理
	money(value, isExact = false, digits = 2) {
		if(parseFloat(value) === 0) {
			return 0
		} else if(!value || isNaN(parseFloat(value))) {
			return ''
		}
        let num=value.toString().split(".");  // 分隔小数点
        var arr=num[0].split("").reverse();  // 转换成字符数组并且倒序排列
        var res=[];
        for(var i=0,len=arr.length;i<len;i++){
            if(i%3===0&&i!==0){
                res.push(",");   // 添加分隔符
            }
            res.push(arr[i]);
        }
        res.reverse(); // 再次倒序成为正确的顺序
        if(num[1]){  // 如果有小数的话添加小数部分
            res=res.join("").concat("."+num[1]);
        }else{
            res=res.join("");
        }
        return res+'.00';

	},
	// 终端类型
	State(type) {
		let map = {
			1: '未处理',
			2: '处理中',
			3: '已完成',
			4: '已关闭'
		}
		return map[type] || type
	}
   
}
