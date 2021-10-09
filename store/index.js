import Vue from 'vue'
import Vuex from 'vuex'
import userInfo from './modules/userInfo'
import getters from './getters'
// vue引入vuex数据状态管理
Vue.use(Vuex)
//  申明与构建数据仓库，引入需要被管理的模块以及获取数据源的getters对象
const store = new Vuex.Store({
	modules: {
		userInfo
	},
	getters
})
 
export default store