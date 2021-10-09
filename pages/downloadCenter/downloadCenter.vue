<template>
	<view class="main">
		<view class="container">
			<u-sticky :enable="enable">
				<!-- 只能有一个根元素 -->
				<view class="sticky">
					<u-search :show-action="true" :animation="true" placeholder='请输入搜索的文件名' action-text="搜索"
						bg-color='#F2F2F2' margin='18rpx' v-model='searchBoxValue' @custom="searchclick"
						@search="searchclick"></u-search>
				</view>
			</u-sticky>
		</view>

		<view v-if="userInfo.status==1">
			<!-- 模板中使用 -->
			<Drag @dragClick="addFile" creatTop="700" creatLeft="280" image="../../static/jia.png" imageWidth="84%">
			</Drag>
			<view class="document-card" v-for="(item,index) in documentList" :key='index' @click.stop="operator(item)">
				<view class='textPart'>
					<view class='commontxt'>标题：{{item.title}}</view>
					<view class="commontxt">创建时间：{{item.create_time}}</view>
					<view class='commontxt'>创建人：{{item.username}}</view>
					<view class='commontxt'>描述：{{item.remark}}</view>
				</view>
				<view class='operation'>
				</view>
			</view>
		</view>

		<view v-if="userInfo.status==2">
			<!-- 模板中使用 -->
			<view class="document-card" v-for="(item,index) in documentList" :key='index'>
				<view class='textPart'>
					<view class='commontxt'>标题：{{item.title}}</view>
					<view class="commontxt">创建时间：{{item.create_time}}</view>
					<view class='commontxt'>创建人：{{item.username}}</view>
					<view class='commontxt'>描述：{{item.remark}}</view>
				</view>
				<view class='operation'>
					<button type="primary" size='mini' @click='goToDetail2(item)'>详情</button>
				</view>
			</view>
		</view>
	</view>

</template>

<script>
	import { mapGetters } from 'vuex'
	import Drag from '../../components/beyondGod-drag/beyoundGod-drag.vue'
	export default {
		data() {
			return {
				flag:'',
				token:'',
				userInfo: {},
				enable: true,
				searchBoxValue: '',
				documentList: [],
				page: 1,
				totalPages: 1,
				clickedItem: {},
				localPath: '',
				logo: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fbpic.588ku.com%2Felement_origin_min_pic%2F00%2F00%2F07%2F155788a6d8a5c42.jpg&refer=http%3A%2F%2Fbpic.588ku.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1619847627&t=2da40b583002205c204d980b54b35040',
			}
		},
		components: {
			Drag
		},

		//重启页面和下拉刷新都是要更新数据
		//访问http://xxx/custumer/index 时如果不传参数，那就只会返回第一页的数据
		onLoad() {
			this.token = uni.getStorageSync('token')
			if (uni.getStorageSync('userInfo') == '') {
				uni.reLaunch({
					url:'../login/login'
				})
			}
			this.userInfo = uni.getStorageSync('userInfo')
			this.refresh()
		},

		onShow() {
			this.enable = true
			this.hasKeep = false
			if(uni.getStorageSync('flag')==false){
				this.refresh()
				this.$store.commit('userInfo/updateflag', true)
			}
		},

		onHide() {
			this.enable = false;
		},

		onPullDownRefresh() {
			this.refresh()
		},

		onReachBottom() {
			uni.showToast({
				title: '已到达最后一页',
				icon: 'none'
			})
			return;
		},

		methods: {
			operator(item) {
				var that = this;
				that.clickedItem = item
				uni.showActionSheet({
					itemList: ['修改', "删除", "详情"],
					success: function(res) {
						if (res.tapIndex == 0) {
							that.modify()
						} else if (res.tapIndex == 1) {
							that.remove()
						} else if (res.tapIndex == 2) {
							that.goToDetail1()
						}
					},
				})
			},
			
			goToDetail(){
				
			},
			
			//根据关键词搜索数据并分页获取
			getsearchRes(keywords) {
				if (keywords.trim() == '') {
					this.refresh();
					return;
				}
				var that = this;
				uni.showNavigationBarLoading();
				uni.showLoading({
					mask: true,
					title: '请稍后...'
				});

				uni.request({
					//获取每一页的数据然后做拼接
					url: 'http://1.14.94.7/api/document/get/' + keywords,
					header:{
						"Authorization":"Bearer "+that.token,  
					},
					method: 'GET',
					success: res => {
						// console.log(res)
						if (res.statusCode == "200") {
							that.documentList = res.data
						}
					},
					complete: () => {
						uni.hideLoading();
						uni.stopPullDownRefresh();
						uni.hideNavigationBarLoading()
					}
				});
			},

			searchclick() {
				this.documentList = [];
				this.getsearchRes(this.searchBoxValue);
			},

			modify() {
				var item = this.clickedItem
				uni.setStorageSync('oldDocument', item)
				this.$store.commit('userInfo/updateflag', false)
				uni.navigateTo({
					url: "../modifyDocument/modifyDocument"
				});
			},

			remove() {
				// console.log("我是删除操作")
				// console.log(this.clickedItem)
				var that = this
				uni.request({
					// 删除接口,传递title参数
					url: 'http://1.14.94.7/api/document/remove/' + that.clickedItem.title,
					header:{
						"Authorization":"Bearer "+that.token,  
					},
					method: 'DELETE',
					success: res => {
						if (res.statusCode == "200") {
							uni.showToast({
								title: '删除成功',
								icon: 'none'
							})
						}
						setTimeout(function() {
							that.refresh()
						}, 500);
						// that.refresh()
					},
				});
			},

			goToDetail1() {
				var item = this.clickedItem
				uni.setStorageSync('oldDocument', item)
				uni.navigateTo({
					url: "../goToDetail/goToDetail"
				});
			},
			
			goToDetail2(item) {
				uni.setStorageSync('oldDocument', item)
				uni.navigateTo({
					url: "../goToDetail/goToDetail"
				});
			},
			
			addFile() {
				uni.navigateTo({
					url: "../addDocument/addDocument"
				});
				this.$store.commit('userInfo/updateflag', false)
			},

			refresh() {
				var that = this
				that.searchBoxValue = ''
				uni.showNavigationBarLoading()
				uni.showLoading({
						mask: true,
						title: '请稍后...'
					}),
					uni.request({
						url: 'http://1.14.94.7/api/document/get-all',
						method: 'GET',
						header:{
							"Authorization":"Bearer "+that.token,  
						},
						data: {},
						success: res => {
							if (res.statusCode == "200") {
								that.documentList = res.data;
							}
						},
						complete: () => {
							uni.hideLoading();
							uni.stopPullDownRefresh();
							uni.hideNavigationBarLoading()
						}
					});
			}
		}
	}
</script>

<style lang="scss">
	.main {
		background-color: white;
		font-size: 33rpx;
		font-weight: bold;
	}
	.container{
		background-color: white;
		font-size: 40rpx;
		font-weight: lighter;
	}
	
	.document-card {
		background-color: #eef5fe;
		border: 1rpx solid transparent;
		border-radius: 15rpx;
		padding: 20rpx;
		margin-bottom: 20rpx;
		position: relative;
		display: flex;
		flex-direction: row;
		justify-content: center;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.textPart {
		width: 80%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding-left: 30rpx;
		font-size: 35rpx;
		// font-weight: bold;
	}

	.commontxt {
		word-break: break-all;
		font-size: 35rpx;
		margin-top: 10rpx;
	}

	.operation {
		width: 20%;
		height: 80%;
		margin-top: 80rpx;
	}

	.container {
		margin-bottom: 10rpx;
		width: 100%;
	}

	.sticky {
		width: 750rpx;
		color: #fff;
		background-color: white;
		padding: 22rpx;
	}

	.upload {
		position: fixed;
		width: 130rpx;
		height: 130rpx;
		z-index: 10000;
		bottom: 100rpx;
		right: 50rpx
	}
</style>
