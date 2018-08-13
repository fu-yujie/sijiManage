<template>
<div class="paySearch">
	<div class="paySearchTab">
		<ul>
			<li v-bind:class="curVal === 2 ? 'cur' : '' "  v-on:click="tabChange(2)">
					<span>
						住院
					</span>
			</li>
			<li v-bind:class="curVal === 1 ? 'cur':'' "  v-on:click="tabChange(1)">
					<span>
						门诊
					</span>
			</li>
		</ul>
	</div>
	<ul class="paySearchList" id="paySearchList" v-if="hasData">
		<li class="item" v-for="(item,index) in dataList" :key="index">
			<div class="content"><span class="left">医院名称</span><span class="right">{{item.HospitalName}}</span></div>
			<div class="content"><span class="left">住院科室</span><span class="right">{{item.DepartmentName}}</span></div>
			<div class="content"><span class="left">出院诊断疾病名称</span><span class="right">{{item.Diagnose}}</span></div>
			<div class="content"><span class="left">医疗类别</span><span class="right">{{item.MedTypeStr}}</span></div>
			<div class="content"><span class="left">结算日期</span><span class="right">{{item.SettlementTime}}</span></div>
			<div class="content"><span class="left">医疗费总额(元)</span><span class="right">{{item.TotalCost}}</span></div>
			<div class="content"><span class="left">统筹支出(元)</span><span class="right">{{item.TongchouZhichu}}</span></div>
			<div class="content"><span class="left">贫困救助金额(元)</span><span class="right">{{item.PinkunJiuzhu}}</span></div>
			<div class="content"><span class="left">大病支付(元)</span><span class="right">{{item.DabingZhifu}}</span></div>
			<div class="content"><span class="left">个人现金支付(元)</span><span class="right">{{item.GerenXianjin}}</span></div>
			<div class="content"><span class="left">自费项目之和(元)</span><span class="right">{{item.ZifeiZhihe}}</span></div>
			<div class="content"><span class="left">范围内报销比例</span><span class="right">{{item.FanweineiBili*100 | getInt}}%</span></div>
		</li>
	</ul>
	<div class="paySearchList noData" v-if="!hasData">暂无数据</div>
</div>
</template>

<script>
	import util from '../../../src/util/util.js'
	import vueUtil from '../../../src/util/vueUtil'
	import { Toast, Indicator } from 'mint-ui'
	import { GetMedCostsListByIDCardNo } from '../../api'
    export default {
        name: "paysearch-list",
		data(){
        	return{
				hasData:true,//是否有数据
				curVal:2,
				dataList:[],
				state:true,
				PageIndex:1,
				MedType:2,
				userInfo:'',//用户信息
			}
		},
		mounted(){

			let OperatorID = util.getlocal('OperatorID');
			this.userInfo = OperatorID;
        	this.GetMedCostsListByIDCardNo(1);
			var contentOne = document.getElementsByClassName('paySearchList')[0];
			contentOne.addEventListener("scroll", () => {
				var scrollheight = contentOne.scrollHeight;
				var clientheight = contentOne.clientHeight;
				var top = contentOne.scrollTop;
				if (scrollheight == ( clientheight + top)) {
					if (this.state) {
						this.state = false;
						this.GetMedCostsListByIDCardNo()
					}
				}
			});
		},
		methods:{
        	async GetMedCostsListByIDCardNo(PageIndex){
        		try{
					if(PageIndex){
						this.PageIndex = PageIndex;
						document.getElementsByClassName('paySearchList')[0].scrollTop = 0;
						this.state = false;
					}
					Indicator.open();
					let result = await GetMedCostsListByIDCardNo({
						OrderBy:'',
						IDCardNumber:this.$route.query.id,
						MedType:this.MedType,
						PageIndex: this.PageIndex,
						PageSize: 10,
						OperatorID: this.userInfo.PeopleGuid

					});
					Indicator.close();
					if (result.data.StatusCode != 0) {
						let info = Toast({ message: result.data.Info, iconClass: '', time: 500 });
						return;
					}
					if (result.data.Data.List.length == 0) {
						/*this.hasData=false;*/
						if(PageIndex==1){
							this.hasData=false;
							/*this.dataList = result.data.Data.List;*/
							/*if(this.PageIndex==1){
								this.hasData=false;
							}*/
						}else{
							let info = Toast({ message: "没有更多数据了", iconClass: '', time: 500 });
						}
						return;
					}else{
						this.hasData=true;
						this.state = true;
					}
					if(this.PageIndex == 1){
						this.dataList = result.data.Data.List;

					}else{
						this.dataList = this.dataList.concat(result.data.Data.List);
					}
					this.PageIndex ++;
				} catch (error) {
					console.log(error);
				}
			},
			tabChange(val){
				this.PageIndex=1;
				this.curVal = val;
				this.MedType=val;
				this.GetMedCostsListByIDCardNo(1)
			}
		}
    }
</script>

<style scoped lang="scss">
	.paySearch{
		/*height:100%;*/
		.paySearchTab {
			overflow: hidden;
			width: 100%;
			background: #fff;
			left: 0;
			ul {
				overflow: hidden;
				height: 94px;
				li {
					width: 50%;
					float: left;
					box-sizing: border-box;
					height: 94px;
					line-height: 94px;
					font-size: 14px;
					text-align: center;
					span {
						color: #333;
						display: inline-block;
						height: 100%;
						box-sizing: border-box;
					/*	padding: 0 14px;*/
						font-size: 28px;
					}
					&.cur span {
						width:170px;
						border-bottom: 3px solid #00ae66;
						color: #00ae66;
					}
				}
			}
		}
			.paySearchList{
				position: absolute;
				/* padding-bottom: 50px; */
				top: 100px;
				left: 0;
				right: 0;
				bottom: 0;
				overflow-y: scroll;
				.item{
					background:#fff;
					margin-top:30px;
					padding:30px 40px;
						.content{
							overflow: hidden;
							/* display: flex;
                             justify-content: space-between;*/
							color: #333333;
							margin-bottom: 20px;
							&:last-child{
								margin-bottom: 0;
							}
							span{
								font-family: PingFangSC-Regular;
								font-size: 28px;
								color: #888888;
								line-height: 42px;
							}
							.left{
								float:left;
							}
							.right{
								color: #333333;
								text-align:right;
								float:right;
								width: calc( 100% - 240px )
							}
						}

				}
			}
		.noData{
			text-align:center;
			margin-top:30px;
			height:calc( 100% - 130px );
			background:#fff;
			padding-top:50px;
			box-sizing: border-box;
		}

	}

</style>
