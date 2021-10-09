const baseUrl = 'http://1.14.94.7/api/';
const imgUrl = 'http://store.boyaokj.cn/';
const domeUrl = 'https://fc.boyaokj.cn/attachment/';
/* 封装ajax函数
 * @param {string}opt.type http连接的方式，包括POST和GET两种方式
 * @param {string}opt.url 发送请求的url
 * @param {boolean}opt.async 是否为异步请求，true为异步的，false为同步的
 * @param {object}opt.data 发送的参数，格式为对象类型
 * @param {function}opt.success ajax发送并接收成功调用的回调函数
 */

function getHeader() { //header头部
	return {
		"Accept": "application/json",
		'Content-Type': 'application/json; charset=utf-8', // app header头
		// 　　　　'Content-Type': 'application/x-www-form-urlencoded', // h5 header头
		// 　　　　'ACCESS_TOKEN': `${token}`,
	};
}

const ajax = function(opt) {
	
	return new Promise((resolve,reject)=>{
		opt = opt || {};
		opt.method = (opt.method && opt.method.toUpperCase()) || 'POST';
		opt.url = baseUrl + opt.url || '';
		opt.async = opt.async || true;
		opt.data = opt.data || null;
		// opt.success = opt.success || function() {};
		// opt.fail = opt.fail || function() {};
		// opt.complete = opt.complete || function() {};
		uni.request({
			method: opt.method,
			dataType: 'json',
			url: opt.url,
			data: opt.data,
			header: {
				...getHeader(),
				...opt.header
			},
			success: (res) => {
				resolve(res.data);
				// opt.success(res);
			},
			fail: (res) => {
				uni.showToast({
					title:"服务器异常，请求有误！",
					icon:'none'
				})
				reject(res.data);
				// opt.fail(res);
			},
			complete: (res) => {
				// opt.complete(res);
			},
		})
		
	});
	
	
	// var xmlHttp = null;
	// if (XMLHttpRequest) {
	// 	xmlHttp = new XMLHttpRequest();
	// } else {
	// 	xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
	// }
	// var params = [];
	// if (opt.data && !opt.data.i) {
	// 	opt.url = opt.url + '&' + 'i=2'
	// }

	// for (var key in opt.data) {
	// 	opt.url = opt.url + '&' + key + '=' + opt.data[key]
	// 	// params.push(key + '=' + opt.data[key]);
	// }
	// var postData = params.join('&');
	// if (opt.method.toUpperCase() === 'POST') {
	// 	xmlHttp.open(opt.method, opt.url, opt.async);
	// 	xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
	// 	xmlHttp.send(postData);
	// } else if (opt.method.toUpperCase() === 'GET') {
	// 	xmlHttp.open(opt.method, opt.url + '?' + postData, opt.async);
	// 	xmlHttp.send(null);
	// }
	// xmlHttp.onreadystatechange = function() {
	// 	if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
	// 		opt.success(xmlHttp.responseText);
	// 	}
	// };
}

const checkLogin = function() {
	if (uni.getStorageSync('members')) {
		let userInfo = uni.getStorageSync('members')
		if (!userInfo.token) {
			uni.showToast({
				title: '登录已过期，请重新登录',
				icon: 'none'
			})
			uni.clearStorageSync()
			setTimeout(() => {
				uni.redirectTo({
					url: '/pages/login/register'
				})
			}, 1000);
		} else {
			ajax({
				url: 'app',
				data: {
					op: 'checkLogin',
					user_id: userInfo.id,
					token: userInfo.token
				},
				method: 'GET',
				success: function(res) {
					if (res.data.errno != 0) {
						uni.showToast({
							title: '您的账号已在其他终端登录',
							icon: 'none'
						})
						uni.clearStorageSync()
						setTimeout(() => {
							uni.redirectTo({
								url: '/pages/login/register'
							})
						}, 1000);
					}
				},
			});
		}
	}
}

export default {
	baseUrl,
	imgUrl,
	domeUrl,
	ajax,
	checkLogin
}
