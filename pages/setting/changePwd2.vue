<template>
	<view>
		<view class="checkPwd">新密码</view>
		<view class="swiper-item pwd-login">
			<u-form :model="model" ref="uForm" :errorType="form.errorType">
				<u-form-item class="user-pwd-input input-user" label="密码" prop="FIRST_PWD">
					<u-input v-model="model.FIRST_PWD" placeholder="请输入新密码" type="password" @focus="pwdFocus"
						@blur="pwdBlur" />
					<view class="input-line" :style="{'width':pwdwidths+'%'}">
					</view>
				</u-form-item>
				<u-form-item class="user-pwd-input input-user" label="密码" prop="SECOND_PWD">
					<u-input v-model="model.SECOND_PWD" placeholder="请再次输入新密码" type="password" @focus="pwdFocus"
						@blur="pwdBlur" />
					<view class="input-line" :style="{'width':pwdwidths+'%'}">
					</view>
				</u-form-item>
				<u-gap height="250"></u-gap>
				<u-button class='btn' type="primary" @click="changePwd">确认修改</u-button>
			</u-form>
		</view>
	</view>
</template>

<script>
	import md5 from "../../common/md5.js";
	export default {
		data() {
			return {
				userInfo: {},
				cntPwd: "",
				token: "",
				current: 0,
				userwidths: 0,
				pwdwidths: 0,
				rememberPwd: false,
				// username:'',
				// password:'',
				model: {
					FIRST_PWD: '',
					SECOND_PWD: ''
				},
				form: {
					errorType: ["message"],
				},
				rules: {
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
			this.cntPwd = uni.getStorageSync("password")
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
			changePwd() {
				var that = this
				this.$refs.uForm.validate(valid => {
					if (valid == true && this.model.FIRST_PWD === this.model.SECOND_PWD) {
						uni.showToast({
							title: '验证成功',
							icon: 'success'
						});
						// console.log('验证通过');
						uni.removeStorageSync('password')
						uni.setStorageSync('password', this.model.FIRST_PWD)
						// console.log("request")
						uni.request({
							url: 'http://1.14.94.7/api/user/update/' + this.userInfo.username,
							data: {
								"user": {
									"password": md5.hex_md5(this.model.FIRST_PWD)
									
								},
								"notice_it":false
							},
							method: 'PUT',
							dataType: 'json',
							header: {
								"Authorization": "bearer " + that.token
							},
							success: (res) => {
								// console.log("新密码" + this.model.FIRST_PWD)
								// console.log(res)
							}
						})
						setTimeout(() => {
							uni.switchTab({
								url: '../mine/minePage'
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
		font-size: 35rpx;
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
