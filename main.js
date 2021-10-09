import Vue from 'vue'
import App from './App'
import store  from "./store/index"
import Http from './common/http.js'
import http from '@/common/myhttp/http.js'
import uView from "uview-ui";
Vue.prototype.$myRequest = http.ajax;

Vue.use(uView);
Vue.prototype.$store = store
Vue.prototype.$api = Http;
Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue({
    ...App,
	store
})
app.$mount()
