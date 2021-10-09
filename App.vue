<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "uview-ui/index.scss";
	.cell-hover-class {
		background-color: rgb(25, 237, 238);
	}
	.uni-picker-container,.uni-picker-container .uni-picker-custom {
		z-index: 9999999 !important;
	}
</style>
