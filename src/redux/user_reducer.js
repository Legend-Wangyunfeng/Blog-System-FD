const initState = {} //初始化状态
export default function countReducer(preState=initState,action){
	// console.log(preState);
	//从action对象中获取：type、data
	const {type,data} = action
	//根据type决定如何加工数据
	switch (type) {
		case 'login': //如果是加
			return data
		case 'logout': //若果是减
			return {}
		default:
			return preState
	}
}