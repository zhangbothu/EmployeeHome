<template>
	<view class="show">
		<view   style="font-size:32upx">
			请联系管理员找回密码，管理员邮箱为：20193575@cqu.edu.cn.
		</view>
	</view>

</template>

<script>
	export default{
		onLoad(){
			if (uni.getStorageSync('userInfo') == '') {
				uni.reLaunch({
					url:'../login/login'
				})
			}
		}
	}
</script>

<style>
	.show {
		height: 50rpx;
		margin: 25rpx 25rpx;
		font-size: 45rpx;
		line-height: 60rpx;
	
		button {
			width: 100%;
			margin-top: 40rpx;
			border-radius: 10rpx;
			font-size: 35rpx;
			font-family: shusong;
		}
	}
</style>
