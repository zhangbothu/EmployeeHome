<template>
	<view>
		<view class="top-banner">
			<view class="image-box" >
				<image src="../../static/tab/manage_2.png" style="margin: auto;width: 200rpx;height: 200rpx;" ></image>
			</view>
			<view class="text-box">
				<text>员 工 之 家</text>
			</view>
		</view>
		<view class="content-box">
			<swiper :indicator-dots="false" :current='current' class="swiper-login" :disable-touch="true">
				<swiper-item>

					<view class="swiper-item pwd-login">
						<u-form :model="model" ref="uForm" :errorType="form.errorType">
							<u-form-item label="帐号" prop="Loginname" class="user-pwd-input input-user">
								<u-input v-model="model.Loginname" placeholder="请输入您的账号" type="text" @focus="userFocus"
									@blur="userBlur" />
								<view class="input-line" :style="{'width':userwidths+'%'}">
								</view>
							</u-form-item>
							<u-form-item class="user-pwd-input input-user" label="密码" prop="PASSWORD">
								<u-input v-model="model.PASSWORD" placeholder="请输入登录密码" type="password"
									@focus="pwdFocus" @blur="pwdBlur" />
								<view class="input-line" :style="{'width':pwdwidths+'%'}">
								</view>
							</u-form-item>
							<u-gap height="25"></u-gap>
							<u-form-item label="记住密码" label-width="125rpx">
								<u-switch size='35' inactive-color='#EAEAEA' v-model="rememberPwd"></u-switch>
							</u-form-item>
							<!-- <u-gap height="55"></u-gap> -->
							<u-button type="primary" @click="submit">登 录</u-button>
							<view class="change-login-method" @click="cvLogin">
								<image src="../../static/next.png" mode=""></image>
							</view>
							<u-gap height="10"></u-gap>
							<h4 class='cv-notice'>刷脸登录</h4>
						</u-form>
					</view>

					<!-- <view class="swiper-item pwd-login">
						<view class="user-pwd-input input-user" v-model="username" >
							<input type="text" placeholder="请输入您的账号" value="" @focus="userFocus" @blur="userBlur"/>
							<view class="input-line" :style="{'width':userwidths+'%'}">
							</view>
						</view>
						<view class="user-pwd-input input-user" v-model="password" >
							<input type="text" placeholder="请输入您的密码" value="" @focus="pwdFocus" @blur="pwdBlur"/>
							<view class="input-line" :style="{'width':pwdwidths+'%'}">
							</view>
						</view>
						<view class="change-login-method">
							<image src="../../static/next.png" mode=""></image>
						</view>
					</view> -->
				</swiper-item>
				<swiper-item>
					<view class="swiper-item cv-login">
						<text class="cv-Login">人脸识别登陆</text>
						<image src='../../static/face.png' class="face"></image>
						<u-gap height="280"></u-gap>
						<u-button @click="choosePhoto" type="primary">开始识别</u-button>

						<u-gap height="38"></u-gap>
						<view class="change-login-method" @click="pwdLogin">
							<image src="../../static/before.png" mode=""></image>
						</view>
						<u-gap height="10"></u-gap>
						<h4 class='cv-notice'>密码登录</h4>
					</view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>
<script>
	import md5 from "../../common/md5.js";
	export default {
		data() {
			return {
				token: '',
				current: 0,
				userwidths: 0,
				pwdwidths: 0,
				rememberPwd: false,
				// username:'',
				// password:'',
				model: {
					Loginname: '',
					PASSWORD: '',
				},
				form: {
					errorType: ["message"],
				},
				rules: {
					Loginname: [{
						required: true,
						message: "请输入您的账号",
						trigger: ["change", "blur"],
					}, ],
					PASSWORD: [{
							required: true,
							message: "请输入密码",
							trigger: ["change", "blur"],
						},
						{
							min: 6,
							max: 20,
							message: "密码长度在6到20个字符",
							trigger: ["change", "blur"],
						},
						{
							pattern: /^[0-9a-zA-Z]*$/g,
							transform(value) {
								return String(value);
							},
							message: "密码为字母或数字",
							trigger: ["change", "blur"],
						},
					],
				},
			}
		},
		onLoad() {
			if (uni.getStorageSync('userInfo') != '') {
				uni.removeStorageSync('userInfo')
				uni.removeStorageSync('password')
				uni.removeStorageSync('token')
			}
		},
		mounted() {
			let that = this;
			//页面加载完成，获取本地存储的用户名及密码
			const userName = uni.getStorageSync('Loginname');
			const userPsw = uni.getStorageSync('PASSWORD');
			if (userName && userPsw) {
				that.model.Loginname = userName;
				that.model.PASSWORD = userPsw;
			} else {
				that.model.Loginname = "";
				that.model.PASSWORD = "";
			}
		},
		methods: {
			userFocus() {
				this.userwidths = 100;
			},
			userBlur() {
				this.userwidths = 0;
			},
			pwdFocus() {
				this.pwdwidths = 100;
			},
			pwdBlur() {
				this.pwdwidths = 0;
			},
			cvLogin() {
				this.current = 1;
			},
			pwdLogin() {
				this.current = 0;
			},
			userpwdlogin() {
				this.current = 0;
			},
			onReady() {
				this.$refs.uForm.setRules(this.rules);
			},
			submit() {
				const that = this;
				this.$refs.uForm.validate(valid => {
					if (valid) {
						uni.showLoading({
							title: '努力登录中...',
							mask: true
						});
						uni.request({
							url: 'http://1.14.94.7/api/login/passwd',
							method: 'POST',
							data: {
								username: this.model.Loginname,
								password: md5.hex_md5(this.model.PASSWORD)
							},
							header: {
								'content-type': 'application/x-www-form-urlencoded'
							},
							success: res => {
								if (res.statusCode == 200) {
									uni.setStorageSync('password', that.model.PASSWORD)
									uni.setStorageSync('token', res.data.access_token)
									this.$store.commit('userInfo/updateuserInfo', res.data.data)
									uni.showToast({
										title: '登录成功',
										icon: 'success'
									})
									setTimeout(() => {
										uni.switchTab({
											url: '../index/index'
										})
									}, 800);
									if (that.rememberPwd) {
										uni.setStorageSync('Loginname', that.model.Loginname)
										uni.setStorageSync('PASSWORD', that.model.PASSWORD)
									} else {
										uni.removeStorageSync('Loginname');
										uni.removeStorageSync('PASSWORD');
										that.model.Loginname = "";
										that.model.PASSWORD = "";
									}
								} else {
									uni.showToast({
										title: '用户名或密码错误',
										icon: 'none'
									})
								}
							},
							fail: () => {},
							complete: () => {}
						});
					} else {}
				});
			},
			choosePhoto() {
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['camera'], //从相册选择
					success: res => {
						// this.$refs.popup.close();
						// uni.previewImage({
						// 	urls: res.tempFilePaths,
						// });

						console.log('压缩前图片体积', res.tempFiles[0].size);
						let reader = new FileReader();
						reader.readAsDataURL(res.tempFiles[0]);
						let _this = this;
						reader.onload = function() {
							let content = this.result; //图片的src，base64格式
							let img = new Image();
							img.src = content;
							img.onload = function() { //图片加载完毕
								_this.compressEvent(img, (dataURL) => {
									_this.uploadImg(dataURL);
								})
							}
						};
					}
				});
			uni.showLoading({
				title:'正在登录...',
				mask:true}
			)
			},
			compressEvent(img, callback) {
				let canvasWidth = img.width //图片原始宽高
				let canvasHeight = img.height;
				//图片宽高比
				let base = canvasWidth / canvasHeight;
				//宽度最大设为1024
				if (canvasWidth > 1024) {
					canvasWidth = 1024;
					canvasHeight = Math.floor(canvasWidth / base);
				}
				//绘制图像到画布
				let canvas = document.createElement('canvas');
				let ctx = canvas.getContext("2d");
				canvas.width = canvasWidth;
				canvas.height = canvasHeight;
				ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
				//将画布转为base64，mimeType类型为image/jpeg，图片质量为0.3
				let dataURL = canvas.toDataURL("image/jpeg", 0.3);
				callback ? callback(dataURL) : null; //调用回调函数
			},
			dataURItoBlob(dataurl) { //dataurl是base64格式
				var arr = dataurl.split(','),
					mime = arr[0].match(/:(.*?);/)[1],
					bstr = atob(arr[1]),
					n = bstr.length,
					u8arr = new Uint8Array(n);
				while (n--) {
					u8arr[n] = bstr.charCodeAt(n);
				}
				return new Blob([u8arr], {
					type: mime
				});
			},
			uploadImg(dataURL) {
				//将base64转为blob对象
				let blob = this.dataURItoBlob(dataURL);
				console.log("blob size: ", blob.size);
				uni.uploadFile({
					//此处填文件上传的接口url
					// url: 'http://1.14.94.7/api/login/face-register?username=' + this.userInfo.username,
					url: 'http://1.14.94.7/api/login/face-recognition',
					header: {
						"Authorization": "Bearer " + this.token,
					},
					filePath: dataURL,
					name: 'file',
					file: blob,
					success: (res) => {
						if (res.statusCode == 200) {
							res = JSON.parse(res.data)
							uni.setStorageSync('token', res.access_token)
							this.$store.commit('userInfo/updateuserInfo', res.data)
							uni.showToast({
								title: '登录成功',
								icon: 'success'
							})
							setTimeout(() => {
								uni.switchTab({
									url: '../index/index'
								})
							}, 800);
						} else {
							uni.showToast({
								title: '登录失败，请重新尝试',
								icon: 'none'
							})
						}
					}
				});
			}
		}
	}
	
</script>
<style>
	page {
		background-color: #f1f1f1;
	}

	view {
		box-sizing: border-box;
	}

	.top-banner {
		width: 100%;
		height: 590rpx;
		background-color: #404BD9;
		border-bottom-left-radius: 30rpx;
		border-bottom-right-radius: 30rpx;
	}

	.text-box{
		display: flex;
		justify-content: center;
		align-items: center;
		color: #fff;
		font-weight: bold;
		font-size: 60rpx;
		text-decoration: dotted;
	}
	
	.image-box{
		text-align: center;
	}
	.content-box {
		width: 640rpx;
		height: 780rpx;
		background-color: #fff;
		position: absolute;
		top: 420rpx;
		left: 50%;
		transform: translateX(-50%);
		border-radius: 15rpx;
		font-weight: bold;
	}

	.swiper-login {
		width: 100%;
		height: 100%;
		position: relative;
	}

	.pwd-login {
		width: 100%;
		height: 100%;
		padding: 45rpx 35rpx;
	}

	/* .phone-user-title {
		font-size: 30rpx;
		color: #1f1f1f;
		font-weight: bold;
	} */

	.user-pwd-input {
		width: 100%;
		height: 80rpx;
		/* background-color: red; */
		border-bottom: 1rpx solid #dedede;
		margin-top: 40rpx;
		position: relative;
	}


	.user-pwd-input input {
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		padding: 20rpx;
	}

	/* .tips-user-box {
		padding: 0 40rpx;
		margin-top: 40rpx;
	} */

	.tips-user {
		font-size: 24rpx;
		color: #8c8c8c;
	}

	.change-login-method {
		width: 88rpx;
		height: 88rpx;
		margin: 100rpx auto 0 auto;
		background-color: #404BD9;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		box-shadow: 2rpx 2rpx 32rpx 8rpx #aeaeb7;
	}

	.change-login-method image {
		width: 80%;
		height: 80%;
	}

	.cv-login {
		width: 100%;
		height: 100%;
		padding: 45rpx 35rpx;

	}

	.cv-Login {
		font-size: 40rpx;
		font-weight: bold;
		display: flex;
		justify-content: center;

	}

	.cv-login-box-tips {
		font-size: 24rpx;
	}

	.cv-login-box {
		padding: 0 30rpx;
		color: #8c8c8c;
		margin-top: 30rpx;
	}

	.phone-user-code {
		width: 38%;
		margin-left: auto;
		margin-right: auto;
		letter-spacing: 20rpx;
		text-align: center;
	}

	.user-pwd-input.input-user .input-line {
		width: 100%;
		height: 2rpx;
		background-color: blue;
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translate(-50%);
		transition: all .3s;
	}

	.cv-notice {
		text-align: center;
	}

	.face {
		width: 100px;
		height: 100px;
		position: absolute;
		left: 35%;
		top: 70px;
	}
</style>
