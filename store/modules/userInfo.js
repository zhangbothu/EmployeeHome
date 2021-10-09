
//在当前模块下面那些数据需要被管理
const state = {
	userInfo:{},
	flag:true
}
 
//改变数据方法的集合(同步方式)
const mutations = {
		//修改某个数据的方法
		updateuserInfo(state, userInfo){
			state.userInfo = userInfo,
			uni.setStorage({
				 key: 'userInfo',
				 data: userInfo,
			})
		},
		updateflag(state, flag){
			state.flag = flag,
			uni.setStorage({
				 key: 'flag',
				 data: flag,
			})
		}
}
 
 
export default {
	namespaced: true,
	state,
	mutations
}