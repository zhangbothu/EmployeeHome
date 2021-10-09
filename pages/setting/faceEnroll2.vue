<template>
	<view>
		<view class="top-banner">
			<text>员 工 之 家</text>
		</view>
		<view class="content-box">
			<swiper :indicator-dots="false" class="swiper-login" :disable-touch="true">
				<swiper-item>
					<view class="swiper-item cv-login">
						<text class="cv-Login">人脸注册</text>
						<image src='../../static/face.png' class="face"></image>
						<u-gap height="380"></u-gap>
						<u-button @click="choosePhoto" type="primary">开始注册</u-button>
					</view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				token: '',
				userInfo: {}
			}
		},
		onLoad() {
			this.token = uni.getStorageSync('token')
			if (uni.getStorageSync('userInfo') == '') {
				uni.reLaunch({
					url: '../login/login'
				})
			}
			this.userInfo = uni.getStorageSync('userInfo')
		},
		mounted() {

		},
		methods: {
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
			title:'正在注册...',
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
					url: 'http://1.14.94.7/api/login/face-register?username=' + this.userInfo.username,
					header:{
						"Authorization":"Bearer "+this.token,  
					},
					filePath: dataURL,
					name: 'file',
					file: blob,
					success: (res) => {
						console.log(res)
						if (res.statusCode == 200) {
							uni.showToast({
								title: '注册成功',
								icon: 'success',
							})
							setTimeout(() => {
								uni.switchTab({
									url: '../mine/minePage'
								})
							}, 700);
						} else {
							uni.showToast({
								title: '注册失败，请重新尝试',
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
		font-weight: bold;
	}

	.swiper-login {
		width: 100%;
		height: 100%;
		position: relative;
	}

	.cv-login {
		width: 100%;
		height: 100%;
		padding: 45rpx 50rpx;

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
