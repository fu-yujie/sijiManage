<template>
	<div class="guideList">
		<ul>
			<li @click="goDet( 'sysLogin' )">
				<img src="../../assets/img/guideList1.png" alt="">
				<p>
					系统登录
				</p>
			</li>
			<li @click="goDet( 'mainPage' )">
				<img src="../../assets/img/guideList2.png" alt="">
				<p>
					主界面
				</p>
			</li>
			<li @click="goDet( 'addOrder' )">
				<img src="../../assets/img/guideList3.png" alt="">
				<p>
					新建工单
				</p>
			</li>
			<li @click="goDet( 'order' )">
				<img src="../../assets/img/guideList4.png" alt="">
				<p>
					反馈工单
				</p>
			</li>
			<li @click="goDet( 'notice' )">
				<img src="../../assets/img/guideList5.png" alt="">
				<p>
					通知管理
				</p>
			</li>
			<li @click="goDet( 'noticeGonggao' )">
				<img src="../../assets/img/guideList6.png" alt="">
				<p>
					通知公告
				</p>
			</li>
			<li @click="goDet( 'zhuanlan' )">
				<img src="../../assets/img/guideList7.png" alt="">
				<p>
					扶贫政策专栏
				</p>
			</li>
			<li @click="goToast">
				<img src="../../assets/img/guideList8.png" alt="">
				<p>
					建档立卡就医费用查询
				</p>
			</li>
			<li  @click="goToast">
				<img src="../../assets/img/guideList9.png" alt="">
				<p>
					建档立卡脱贫动态管理
				</p>
			</li>
		</ul>
	</div>
</template>

<script>
	import { Toast } from 'mint-ui';
    export default {
		name: "zhuanlan",
		methods:{
			goDet( compName ){
				this.$router.push({
					name: compName,
				})
			},
			goToast(){
				Toast({
					message: '功能建设中',
					time: 500
				});
			},
		},
		
    }
</script>

<style scoped lang="scss">
	.guideList{
		overflow: hidden;
		padding-top: 30px;
		ul{
			overflow: hidden;
			background: #fff;
			width: 100%;
			box-sizing: border-box;
			li{
				width: calc(100% / 3);
				height: 172px;
				box-sizing: border-box;
				float: left;
				border-bottom: 1px solid #E5E5E5;
				border-right: 1px solid #E5E5E5;
				text-align: center;
				img{
					display: inline-block;
				}
				p{
					font-size: 28px;
					line-height: 40px;
					color: #333;
					margin-bottom: 20px;
					box-sizing: border-box;
					padding: 0 34px;
				}
				&:nth-child(3n){
					border-right: none;
				}
				&:nth-child(1){
					img{
						width: 43px;
						margin-top: 52px;
						margin-bottom: 10px;   //减去4像素，以为img的行内块格式导致
					}
				}
				&:nth-child(2){
					img{
						width: 48px;
						margin-top: 50px;
						margin-bottom: 8px;   //减去4像素，以为img的行内块格式导致
					}
				}
				&:nth-child(3){
					img{
						width: 38px;
						margin-top: 53px;
						margin-bottom: 10px;   //减去4像素，以为img的行内块格式导致
					}
				}
				&:nth-child(4){
					img{
						width: 37px;
						margin-top: 47px;
						margin-bottom: 15px;   //减去4像素，以为img的行内块格式导致
					}
				}
				&:nth-child(5){
					img{
						width: 40px;
						margin-top: 47px;
						margin-bottom: 24px;   //减去4像素，以为img的行内块格式导致
					}
				}
				&:nth-child(6){
					img{
						width: 48px;
						margin-top: 47px;
						margin-bottom: 16px;   //减去4像素，以为img的行内块格式导致
					}
				}
				&:nth-child(7){
					height: 206px;
					img{
						width: 35px;
						margin-top: 44px;
						margin-bottom: 7px;   //减去4像素，以为img的行内块格式导致
					}
				}
				&:nth-child(8){
					height: 206px;
					img{
						width: 42px;
						margin-top: 48px;
						margin-bottom: 10px;   //减去4像素，以为img的行内块格式导致
					}
				}
				&:nth-child(9){
					height: 206px;
					img{
						width: 36px;
						margin-top: 45px;
						margin-bottom: 8px;   //减去4像素，以为img的行内块格式导致
					}
				}
			}
		}
	}
</style>
