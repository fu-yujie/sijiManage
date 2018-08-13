<template>
	<div class="InformationAskList">
		<div class="header">您当前查看的是{{loca}}居民缴费进度</div>
		<div class="decbox">
			<div class="dec" v-for="(item,index) in lists" :key="index" @click="goDetail(index,item)">
				<div class="loca">{{item.Name}}</div>
				<mt-progress :value="item.Percent" class="pross">
					<div slot="end" class="shoupre">{{item.Percent}}%</div>
				</mt-progress>
				<div class="tongji">已有{{item.Payed}}人完成缴费,共计收款金额{{item.Payed*180}}元</div>
			</div>
		</div>

	</div>

</template>

<script>
	import util from '../../../src/util/util.js'
	import { MedicarePay } from '../../api'
	import { Indicator, InfiniteScroll, Toast } from 'mint-ui'
	export default {
		name: 'InformationAskList',
		data() {
			return {
				loca: '',
				Code: '',
				LevelCode: '',
				OperatorID: '',
				lists: [],
				Level: '',
				Codes: '',
				AreaName:''
			}
		},
		components: {},
		created() {},
		mounted() {
			let OperatorID = util.getlocal('OperatorID');
			this.OperatorID = OperatorID.OperatorID;
			this.Level = OperatorID.Level;
			this.Codes = OperatorID.Code;
			this.AreaName = OperatorID.AreaName;
			console.log(this.AreaName)
			this.loca = this.AreaName;
			Indicator.open();
			this.getMedicarePay();
		},
		methods: {
			async getMedicarePay() {
				var obj = {};
				obj.Level = this.Level;
				obj.AreaCode = this.Codes;
				var res = await MedicarePay(obj);
				if(res.data.StatusCode == 0) {
					Indicator.close();
					this.lists = res.data.Data;
					if(res.data.Data.length == 0) {
						Toast('暂无数据');
						setTimeout(() => {
							this.$router.push({
								'name': 'Home'
							});
						}, 2000);
					}
				} else {
					Indicator.close();
					Toast(res.data.Info);
				}
			},

			goDetail(index, item) {
				this.Code = item.Code;
				this.LevelCode = item.LevelCode;
				this.loca = item.Name;
				this.$router.push({
					'name': 'InformationAskCountyTown',
					params: {
						'Code': this.Code,
						'LevelCode': this.LevelCode,
						'loca': this.loca
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.InformationAskList {
		background-color: #EFEFF4;
		.header {
			z-index: 2;
			position: fixed;
			top: 0;
			left: 0;
			width: 750px;
			height: 90px;
			color: #EF6C37;
			text-align: center;
			font-size: 28px;
			line-height: 90px;
			background: #ffffff url(../../../static/img/提示.png) no-repeat 30px center;
			background-size: 38px 38px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		.decbox {
			padding-top: 90px;
			.dec {
				width: 710px;
				height: 230px;
				margin: 30px auto 0 auto;
				background: #ffffff;
				font-size: 12px;
				box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.04);
				border-radius: 8px;
				.loca {
					font-family: PingFangSC-Regular;
					font-size: 34px;
					color: #111111;
					text-align: left;
					padding: 34px 0 0 30px;
				}
				.pross {
					width: 559px;
					height: 17px;
					margin: 26px 0 0 30px;
					.mt-progress-progress {
						width: 100%;
						height: 7px;
						border-radius: 15px;
						background-color: #00AE66 !important;
					}
					.shoupre {
                        margin-left: 20px;
                        font-size: 28px;
					}
				}
				.tongji {
					font-family: PingFangSC-Regular;
					font-size: 28px;
					color: #666666;
					padding: 31px 0 0 30px;
				}
			}
		}
	}
</style>
