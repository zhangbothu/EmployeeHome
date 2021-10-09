<template>
	<view class='box'>
		<view>
			<u-field v-model="documentInfo.title" label="文档标题:" placeholder="请输入文档标题" required clearable>
			</u-field>
			<u-line color="grey" />
			<u-field v-model="documentInfo.remark" label="文档描述:" placeholder="请输入文档描述" required clearable
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
				<view class='icon' @click="removefile(index)">
					<icon type='cancel' size='40rpx'></icon>
				</view>
			</view>
		</view>
		<u-line color="grey" length='100%' />
		<text>\n</text>
		<text>\n</text>
		<view>
			<u-button type='primary' @click='onUpload'>添加文件</u-button>
			<text>\n</text>
			<u-gap height='30rpx'></u-gap>
			<u-button type='success' @click="saveClick">保存</u-button>
			<text>\n</text>
			<!-- <u-gap height='30rpx'></u-gap>
			<!-- <u-button type='warning' @click="reset">重置</u-button> -->
		</view>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	export default {
		data() {
			return {
					token:'',
				documentInfo: {
					title: '',
					remark: '',
					creatTime: '',
					user_id: '',
					filenames: [],
					file_urls: [],
					ifOnShow: false,
					hasKeep: false,
				}, //新文档信息
				oldDocumentInfo: {},
				logo: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fbpic.588ku.com%2Felement_origin_min_pic%2F00%2F00%2F07%2F155788a6d8a5c42.jpg&refer=http%3A%2F%2Fbpic.588ku.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1619847627&t=2da40b583002205c204d980b54b35040',
				localPath: '',
				userInfo: {}
			}
		},

		onLoad() {
			this.token = uni.getStorageSync('token')
			if (uni.getStorageSync('userInfo') == '') {
				uni.reLaunch({
					url:'../login/login'
				})
			}
			this.userInfo = uni.getStorageSync('userInfo')
			this.oldDocumentInfo = uni.getStorageSync('oldDocument')
		},

		onShow() {
			this.hasKeep = false;
		},

		// onBackPress(options) {
		// 	var that = this
		// 	console.log(this.hasKeep)
		// 	if (!this.hasKeep&&this.documentInfo.title!='') {
		// 		uni.request({
		// 			url: 'http://1.14.94.7/api/document/remove/' + that.documentInfo.title,
		// 			method: 'DELETE',
		// 			success: res => {
		// 				console.log("文档未保存")
		// 			},
		// 		});
		// 	}
		// },
		
		onUnload() {
			var that = this
			if (!that.hasKeep&&that.documentInfo.title!='') {
				uni.request({
					url: 'http://1.14.94.7/api/document/remove/' + that.documentInfo.title,
					header:{
						"Authorization":"Bearer "+that.token,  
					},
					method: 'DELETE',
					success: res => {
					},
				});
			}
			uni.removeStorageSync('oldDocument')
		},

		methods: {
			onUpload() {
				if (this.documentInfo.title == '') {
					uni.showToast({
						title: '请先填写文档标题',
						icon: 'none'
					})
					return;
				}
				var that = this
				uni.chooseFile({
					count: 10,
					success(res) {
						var that1 = that
						// console.log(res)
						const tempFilePaths = res.tempFilePaths;
						for (let i = 0; i < tempFilePaths.length; i++) {
							uni.uploadFile({
								url: 'http://1.14.94.7/api/document/add',
								filePath: tempFilePaths[i],
								header:{
									"Authorization":"Bearer "+that.token,  
								},
								name: 'files',
								formData: {
									'username': that.userInfo.username,
									'title': that.documentInfo.title,
									'remark': that.documentInfo.remark
								},
								success: (res) => {
									var that2 = that
									res = JSON.parse(res.data)
									var filename = res.filename[0]
									var fileurl = "http://1.14.94.7/" + res.file_urls[0]
									// console.log(fileurl)
									that2.documentInfo.filenames.push(filename)
									that2.documentInfo.file_urls.push(fileurl)
								}
							});
						}

					}
				})
			},

			removefile(index) {
				var that = this
				uni.request({
					url: 'http://1.14.94.7/api/document/remove/' + that.documentInfo.title + "?filename=" + that
						.documentInfo.filenames[index],
					method: 'DELETE',
					header:{
						"Authorization":"Bearer "+this.token,  
					},
					success: res => {
						if (res.statusCode == 200) {
							that.documentInfo.filenames.splice(index, 1)
							that.documentInfo.file_urls.splice(index, 1)
						}
					},
				});
			},

			saveClick() {
				if (this.documentInfo.title.trim() == '') {
					uni.showToast({
						title: '请填写文档的标题',
						icon: 'none'
					})
					return;
				} else if (this.documentInfo.filenames.length < 1) {
					uni.showToast({
						title: '请添加附件',
						icon: 'none'
					})
					return;
				}
				this.hasKeep = true
				uni.showToast({
					title: '保存成功',
					icon: 'success'
				})
				setTimeout(function() {
					uni.switchTab({
						url: '../downloadCenter/downloadCenter'
					})
				}, 1000);
			},
			reset() {

				this.documentInfo.title = ''
				this.documentInfo.remark = ''
				this.documentInfo.filenames = []
				this.documentInfo.file_urls = []
			}
		}
	}
</script>

<style>
	.box {
		margin-left: 13rpx;
		margin-right: 13rpx;
		font-family: shusong;
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
		width: 100%;
	}

	.icon {
		margin-bottom: 50rpx;
		margin-left: 19rpx;
		margin-top: -6rpx
	}
</style>
