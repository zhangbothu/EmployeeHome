<template>
	<view>
		<view class="checkPwd">验证当前密码</view>
		<view class="swiper-item pwd-login">
			<u-form :model="model" ref="uForm" :errorType="form.errorType">
				<u-form-item class="user-pwd-input input-user" label="密码" prop="PASSWORD">
					<u-input v-model="model.PASSWORD" placeholder="请输入登录密码" type="password" @focus="pwdFocus"
						@blur="pwdBlur" />
					<view class="input-line" :style="{'width':pwdwidths+'%'}"></view>
				</u-form-item>
				<u-gap height="250"></u-gap>
				<view>
					<u-button class="btn" type="primary" @click="changePwd">下一步</u-button>
					<u-gap height="40"></u-gap>
					<u-button class="btn" type="warn" @click="goTo">忘记密码</u-button>
				</view>
			</u-form>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: {},
				cntPwd: "",
				token: "",
				username: "",
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
		async onLoad() {
			this.token = uni.getStorageSync('token')
			if (uni.getStorageSync('userInfo') == '') {
				uni.reLaunch({
					url:'../login/login'
				})
			}
			this.userInfo = uni.getStorageSync('userInfo')
			this.cntPwd = uni.getStorageSync('password')
			this.username = this.userInfo.username
		},
		mounted() {
			let that = this;
			//页面加载完成，获取本地存储的用户名及密码
			const userPsw = uni.getStorageSync('PASSWORD');
			if (userPsw) {
				that.model.PASSWORD = userPsw;
			} else {
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
				// console.log(this.current + '开始刷脸登录')
			},
			pwdLogin() {
				this.current = 0;
				// console.log(this.current + '开始密码登录')
			},
			userpwdlogin() {
				this.current = 0;
			},
			onReady() {
				this.$refs.uForm.setRules(this.rules);
			},
			getPwd(Username) {
				return new Promise((resolve, reject) => {
					uni.request({
						url: 'http://1.14.94.7/api/user/search/' + this.username,
						method:"GET",
						header: {
							"Authorization": "bearer " + this.token,
						},
						success: (res) => {
							//1.请的结果是在respones中
							// console.log(res)
							// console.log(res.data[0].password)
							//2.通过resolve传递respones的结果
							resolve(res.data[0].password);
						}
					});
				})
			},
			changePwd() {
				this.$refs.uForm.validate(valid => {
					if (valid == true && this.model.PASSWORD === this.cntPwd) {
						uni.showToast({
							title: '验证成功',
							icon: 'success'
						})
						// console.log('验证通过');
						uni.request()
						setTimeout(() => {
							uni.navigateTo({
								url: 'changePwd2'
							})
						}, 800);

					} else {
						uni.showToast({
							title: '密码错误',
							icon: 'none'
						})
						// console.log('验证失败');
					}
				});
			},
			goTo() {
				// console.log("156151")
				uni.navigateTo({
					url: "forgetPwd"
				})
			}
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
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
	
	.checkPwd {
		margin-top: 30rpx;
		font-size: 60rpx;
		text-align: center;
		font-weight: bold;
	}

	.top-banner {
		width: 100%;
		height: 590rpx;
		background-color: #404BD9;
		border-bottom-left-radius: 30rpx;
		border-bottom-right-radius: 30rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #fff;
		font-weight: bold;
		font-size: 60rpx;
		text-decoration: dotted;
	}

	.content-box {
		width: 640rpx;
		height: 740rpx;
		background-color: #fff;
		position: absolute;
		top: 420rpx;
		left: 50%;
		transform: translateX(-50%);
		border-radius: 15rpx;
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


	.user-pwd-input {
		width: 100%;
		height: 80rpx;
		/* background-color: red; */
		border-bottom: 1rpx solid #dedede;
		margin-top: 100rpx;
		position: relative;
		font-size: 35rpx;
	}


	.user-pwd-input input {
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		padding: 20rpx;
	}

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

	.btn {
		font-weight: bold;
		width: 600rpx;
	}

	.btn:hover {
		opacity: 0.5;
	}

	.btn:active {
		box-shadow: 0 2px #fff;
		transform: translateY(2px);
	}
</style>
