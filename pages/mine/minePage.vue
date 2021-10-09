<template>
	<view>
		<view class="content">
			<!--
		<view class="content0">
			<u-image class="pod" height="200rpx" width="200rpx" shape="circle" src="/static/Userimg.jpg"></u-image>
			<u-line color="#000000" margin="50rpx"></u-line>
		</view>
		-->
			<!--头像裁剪-->
			<view class="wrap">
				<view class="u-avatar-wrap">
					<image class="u-avatar-demo" :src="avatar_url" mode="aspectFill"></image>
				</view>
				<u-button class='btn' @tap="chooseAvatar">更换头像</u-button>
			</view>
			<!--个人资料-->
			<view>
				<view class="content1">
					<u-line color="#fff" margin="10rpx"></u-line>
				</view>
				<view class="text-title">姓名：&#160&#160&#160&#160&#160&#160&#160&#160{{userInfo.name}}</view>
				<view class="content1">
					<u-line color="#9C9EA1" margin="20rpx"></u-line>
				</view>
				<view class="text-title">部门：&#160&#160&#160&#160&#160&#160&#160&#160{{userInfo.department}}</view>
				<view class="content1">
					<u-line color="#9C9EA1" margin="20rpx"></u-line>
				</view>
				<view class="text-title">职位：&#160&#160&#160&#160&#160&#160&#160&#160{{userInfo.job}}</view>
				<view class="content1">
					<u-line color="#9C9EA1" margin="20rpx"></u-line>
				</view>
				<view class="text-title">工号：&#160&#160&#160&#160&#160&#160&#160&#160{{userInfo.username}}</view>
			</view>
			<view class="content1">
				<u-line color="#9C9EA1" margin="30rpx"></u-line>
			</view>

		</view>
		<view class="box">
			<u-cell-group>
				<u-cell-item icon="account" title="人脸注册" style="color: #333333" :arrow="true"
					hover-class="cell-hover-class" iconSize="42rpx" @click="goTo('../setting/faceEnroll')">
				</u-cell-item>
				<u-cell-item icon="lock" title="修改密码" style="color: #333333" :arrow="true"
					hover-class="cell-hover-class" iconSize="42rpx" @click="goTo('../setting/changePwd1')">
				</u-cell-item>
				<!-- 				<u-cell-item icon="share" title="关于我们" style="color: #333333" :arrow="true"
					hover-class="cell-hover-class" iconSize="42rpx" @click="goTo('../setting/aboutUs')">
				</u-cell-item> -->
			</u-cell-group>
			<u-gap height="80"></u-gap>
			<!-- 
		<u-button @click="goTo('../login/login')">退出登录</u-button>
		-->
			<u-action-sheet :list="list" v-model="show" @click="click"></u-action-sheet>
			<u-button @click="show = true">退出登录</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: {},
				token: "",
				avatar_url: "",
				list: [{
					text: '退出登录',
				}],
				show: false
			}
		},
		onLoad() {
			this.token = uni.getStorageSync('token')
			if (uni.getStorageSync('userInfo') == '') {
				uni.reLaunch({
					url: '../login/login'
				})
			} else {
				this.userInfo = uni.getStorageSync('userInfo')
				if (this.userInfo.status == 1) {
					this.userType = 1
				} else {
					this.userInfo = uni.getStorageSync('userInfo')
					this.userType = 0
				}
			}
			this.userInfo = uni.getStorageSync('userInfo')
			this.avatar_url = "http://1.14.94.7/" + this.userInfo.avatar_url
			// console.log(this.avatar_url)
			//把数据赋值给相应的展示组件
			// console.log(222)
		},
		methods: {
			getAvator() {
				var that = this
				// console.log('getavatar')
				return new Promise((resolve, reject) => {
					uni.request({
						url: 'http://1.14.94.7/api/user/search/' + this.userInfo.username,
						method:"GET",
						header: {
							"Authorization": "bearer " + that.token
						},
						success: (res) => {
							//1.请的结果是在respones中
							// console.log(res)
							// console.log("http://1.14.94.7/" + res.data[0].avatar_url)
							//2.通过resolve传递respones的结果
							resolve("http://1.14.94.7/" + res.data[0].avatar_url);
						}
					});
				})
			},
			chooseAvatar() {
				// 此为uView的跳转方法，详见"文档-JS"部分，也可以用uni的uni.navigateTo
				this.$u.route({
					// 关于此路径，请见下方"注意事项"
					//换路径
					url: '/uview-ui/components/u-avatar-cropper/u-avatar-cropper',
					// 内部已设置以下默认参数值，可不传这些参数
					params: {
						// 输出图片宽度，高等于宽，单位px
						destWidth: 300,
						// 裁剪框宽度，高等于宽，单位px
						rectWidth: 200,
						// 输出的图片类型，如果'png'类型发现裁剪的图片太大，改成"jpg"即可
						fileType: 'jpeg',
					}
				})
			},
			goTo(url) {
				uni.navigateTo({
					url: url
				})
			},
			click(index) {
				// console.log(index)
				if (index === 0) {
					uni.removeStorageSync('userInfo')
					uni.removeStorageSync("token")
					uni.redirectTo({
						url: '../login/login'
					});
				}
			}
		},
		created() {
			var that = this
			// 监听从裁剪页发布的事件，获得裁剪结果
			uni.$on('uAvatarCropper', path => {
				this.avatar_url = path;
				// 可以在此上传到服务端
				uni.uploadFile({
					url: 'http://1.14.94.7/api/user/change-avatar/' + this.userInfo.username,
					filePath: path,
					//Content-Type: 'multipart/form-data',
					name: 'file',
					method:"POST",
					header: {
						"Authorization": "bearer " + this.token
					},
					complete: (res) => {
									// console.log(this.token)
						// console.log(res);
						var res = JSON.parse(res.data)
						// console.log("http://1.14.94.7/" + res.data.avatar_url);
						this.userInfo.avatar_url = res.data.avatar_url
						this.$store.commit('userInfo/updateuserInfo', this.userInfo)
					}
				});
			})
		}
	}
</script>

<style scoped lang="scss">
	.content0 {
		align-items: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin-top: 70rpx;
	}

	.content1 {
		align-items: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.text-title {
		display: flex;
		flex-direction: column;
		font-size: 40rpx;
		align-items: left;
		margin-bottom: 0rpx;
		margin-left: 50rpx;
		// font-weight: bold;
	}

	.text-area {
		display: flex;
		justify-content: left;
		font-size: 40rpx;
	}

	//头像裁剪
	.wrap {
		width: 750rpx;
		height: 500rpx;
		padding-bottom: 100rpx;
		padding-top: 80rpx;
		background-image: -webkit-linear-gradient(top, #0c67f5, #027cfe, #0194fe);
		border-bottom-left-radius: 30rpx;
		border-bottom-right-radius: 30rpx;

	}

	.u-avatar-wrap {
		overflow: hidden;
		margin-bottom: 80rpx;
		text-align: center;

	}

	.btn {
		width: 300rpx;
		transition-duration: 0.4s;
		cursor: pointer;
		solid: #19BE6B;
	}

	.btn:hover {
		background-color: #19BE6B;
		color: white;
	}

	.btn:active {
		background-color: #19BE6B;
		box-shadow: 0 2px #007AFF;
		transform: translateY(2px);
	}

	.u-avatar-demo {
		width: 200rpx;
		height: 200rpx;
		border-radius: 100rpx;
	}

	.cell {
		left: 20rpx;
		font-weight: bold;
	}

	.cell-hover-class {
		background-color: #9C9EA1;
		opacity: 0.5;
	}

	.btn2 {
		width: 400rpx;
		transition-duration: 0.4s;
		cursor: pointer;
		solid: #19BE6B;
		margin-left: 180rpx;
		font-family: laihu;
	}

	.btn2:hover {
		background-color: red;
		color: white;
	}

	.btn2:active {
		background-color: red;
		box-shadow: 0 2px #007AFF;
		transform: translateY(2px);
	}
</style>
