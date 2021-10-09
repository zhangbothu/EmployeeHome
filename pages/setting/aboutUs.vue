<template>
	<view>
		<view text-align="center">Copyright@</view>
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
</style>
