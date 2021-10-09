<template>
	<view class='box'>
		<view>
			<u-field v-model="documentInfo.title" label="文档标题:" disabled>
			</u-field>
			<u-line color="grey" />
			<u-field v-model="documentInfo.remark" label="文档描述:" disabled
				type='textarea'>
			</u-field>
		</view>
		<u-line color="grey" length='100%' />
		<text>\n</text>
		<u-gap height='200rpx'></u-gap>
		<view calss='fileUpload'>
			<view>已添加的文件：</view>
			<!-- 一个文档中的附件数组，元素是对象，包括{filename,url} -->
			<view class='linkStyle' v-for="(item,index) in documentInfo.file_urls" :key='index'>
				<view class='link'>
					<u-link :href='"http://1.14.94.7/"+item' :under-line="true">{{documentInfo.filenames[index]}}</u-link>
				</view>
				<view class='icon'>
					<icon type='download' size='40rpx'></icon>
				</view>
			</view>
		</view>
		<u-line color="grey" length='100%' />
		<text>\n</text>
		<text>\n</text>
		<view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: {},
				documentInfo: {}, //被修改的文档信息
				localPath: '',
				logo: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fbpic.588ku.com%2Felement_origin_min_pic%2F00%2F00%2F07%2F155788a6d8a5c42.jpg&refer=http%3A%2F%2Fbpic.588ku.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1619847627&t=2da40b583002205c204d980b54b35040'
			}
		},
		onLoad() {
			if (uni.getStorageSync('userInfo') == '') {
				uni.reLaunch({
					url:'../login/login'
				})
			}
			this.documentInfo = uni.getStorageSync('oldDocument')
			this.userInfo = uni.getStorageSync('userInfo')
		},

		methods: {
			// download(index) {
			// 	let url = "http://1.14.94.7/" + this.documentInfo.file_urls[index]
			// 	let customName = this.documentInfo.filenames[index]
			// 	this.$refs.lFile.download({
			// 			url, //必填，附件网络地址
			// 			type: 'save', //选填，非save为临时下载
			// 			customName: '自定义文件名需要带后缀.jpg',
			// 			//...DownloadOptions直接写key:value 
			// 			// 例如：
			// 			method: 'GET'
			// 		})
			// 		.then(path => {
			// 			this.localPath = path;
			// 		});
			// },
		}
	}
</script>

<style>
	.box {
		margin-left: 13rpx;
		margin-right: 13rpx;
		background-color: white;
		font-size: 35rpx;
		font-weight: bold;
	}

	.fileUpload {
		position: relative;
	}

	.fileStyle {
		height: 30%;
		background-color: red;
	}

	.linkStyle {
		display: flex;
		justify-content: center;
	}

	.icon {
		margin-bottom: 50rpx;
		margin-left: 2rpx;
		margin-top: -6rpx
	}
</style>
