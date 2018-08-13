<template>
    <div class="helpPoorNotice">
		<div  class="helpPoorSearch">
			<input type="search" placeholder="请输入关键字" v-model="KeywordsVal" @input="policyGuide">
			<span v-on:click="popShow" >筛选</span>
		</div>
        <div class="helpPoorTab">
			<ul>
				<li v-bind:class="curVal === 1 ? 'cur' : '' "  v-on:click="tabChange(1)">
					<span>
						政策指南
					</span>
				</li>
				<li v-bind:class="curVal === 2 ? 'cur':'' "  v-on:click="tabChange(2)">
					<span>
						常见问题
					</span>
				</li>
			</ul>
    	</div>
		<div class="helpPoorList">
			<ul>
				<li v-for="(item,index) in helpPoorList" :key="index" @click="artLi(index)">
					<p>
						<span>
							{{item.MainHeading}}
							<em>
								{{item.InfoTagName}}
							</em>
						</span>

					</p>
					<i></i>
				</li>
			</ul>
			<div class="noData" v-if="noData" >
				暂无数据
			</div>

			<div class="helpPoorLine" v-show="phoneShow">
				<div>
					<span>
					</span>
					<p>
						<em>
							医保扶贫服务专线：
						</em>
						<a href="tel:0316-5550802">0316-5900201</a>
					</p>
					<a class="phoIcon" href="tel:0316-5550802"></a>
				</div>
			</div>
		</div>

		<mt-popup
			v-model="popupVisible"
			position="right"
			style="position:absolute; right:1rem; top:17.25rem; width:9.375rem; background:transparent;"
		>
			<p  class="selectPopArr"></p>
			<ul class="selectPop">
				<li v-for="(item,index) in selectPopData" :key="index" v-on:click="InfoTagValChange(index)">
					{{item}}
				</li>
			</ul>
		</mt-popup>

    </div>
</template>

<script>
import {
	GetOrderType,policyGuide //政策指南；
} from "../api.js";
import { Toast, Indicator } from 'mint-ui';
import util from '../util/util';

export default {
	name: "helpPoorNotice",
	data() {
		return {
			//个人id
			OperatorID: "",
			//必传 1政策指南，2常见问题
			ContentTypeVal: 1,
			//InfoTag 默认0为全部 政策指南标签 1就业脱贫、2危房改造脱贫、3教育脱贫、4产业脱贫、5助残脱贫、6社保兜底脱贫、7健康脱贫
			InfoTagVal:0,
			//检索关键字
			KeywordsVal:"",
			//分页页码
			PageIndexVal:1,
			//每页条数
			PageSizeVal:50,
			//总条数
			TotalItemCountVal:"",
			//总页数
			TotalPageCountVal:"",
			//文章列表盒子
			helpPoorList:[],
			//cur
			curVal:1,
			//暂无数据
			noData:false,
			//筛选的弹窗
			popupVisible:false,
			selectPopData:["全部","医保扶贫","就业脱贫","危房改造脱贫","教育脱贫","产业脱贫","助残脱贫","社保兜底脱贫","健康脱贫"],
			selectPopCode:[],
			//文章id
			articleId:0,
			routerId:this.$route.query.routerId,
			phoneShow:false,
		};
	},
	mounted() {
		let OperatorID = util.getlocal('OperatorID');
		this.OperatorID = OperatorID.OperatorID;
		// this.policyGuide();
		this.tabShow();
		this.GetOrderRange()
	},
	created() {},
	methods: {

		//获取扶贫领域
		async GetOrderRange() {
			var obj = {};
			obj.CodeTypes = ['EnumGovInfoTag'];
			obj.OrderBy = '';
			var res = await GetOrderType(obj);
			if (res.data.StatusCode == 0) {
				/*this.selectPopData=res.data.Data*/
				var name = res.data.Data;
				var i = name.length;
				var arr = ['全部'];
				var code = [];
				for (var j = 0; j < i; j++) {
					arr.push(name[j].Description);
					code.push(name[j].CodeValue);
				}
				this.selectPopData=arr;
				this.selectPopCode=code



			}
		},
		//获取文章列表；
		async policyGuide(){
			Indicator.open();
			let pars = {
				ContentType:this.ContentTypeVal,
				InfoTag:this.InfoTagVal,
				OperatorID:this.OperatorID,
				Keywords:this.KeywordsVal,
				OrderBy:'',
				PageIndex:this.PageIndexVal,
				PageSize:this.PageSizeVal,
				ID:this.articleId,
			}
			try{
				let res = await policyGuide(pars);
				let resCode = res.data.StatusCode;
				let resInfo = res.data.Info;
				if(resCode===0){
					this.helpPoorList = res.data.Data.List;
					this.TotalItemCountVal = res.data.Data.TotalItemCount;
					this.TotalPageCountVal = res.data.Data.TotalPageCount;
					console.log( this.helpPoorList );
					if( this.helpPoorList.length <= 0 ){
						this.noData = true;
					}else{
						this.noData = false;
					}
				}else{
					Toast({
						message: resInfo,
						position: 'bottom',
						duration: 5000
					});
				}
			}
			catch(error){
				console.log(error);
			}
			finally{
				Indicator.close();
			}
		},
		//政策指南和常见问题的切换
		tabChange(val){
            this.InfoTagVal='';
			this.curVal = val;
			this.ContentTypeVal = val;
			util.setlocal("ContentTypeVal",val)
			console.log("this.ContentTypeVal:"+this.ContentTypeVal)
			this.policyGuide();
			this.showPhone();
		},
		//进入页面的时候判断显示哪个tab；
		tabShow(){
			let ContentTypeValShow = util.getlocal("ContentTypeVal");
			if( ContentTypeValShow !=="" ){
				ContentTypeValShow = ContentTypeValShow*1;
				this.curVal = ContentTypeValShow;
				this.ContentTypeVal = ContentTypeValShow;
				console.log("this.ContentTypeVal:"+this.ContentTypeVal)
				this.policyGuide();
			}else{
				console.log("ContentTypeValShow:"+ContentTypeValShow);
				this.curVal = 1;
				this.ContentTypeVal = 1;
				console.log("this.ContentTypeVal:"+this.ContentTypeVal)
				this.policyGuide();
			}
			this.showPhone();
		},
		//唤醒弹窗
		popShow(){
			this.popupVisible = true;
		},
		//筛选li的点击事件
		InfoTagValChange(liIndex){
			this.InfoTagVal = liIndex;
			this.policyGuide();
			this.popupVisible = false;
		},
		//文章列表li的点击事件
		artLi(liIndex){
			this.$router.push({
				name:"helpPoorNoticeDet",
				query:{
					id: this.helpPoorList[liIndex].Id
				}
			})
		},
		//文章搜索
		/* artSear(){

		}, */
		/* 是否显示拨打电话 */
		showPhone(){
			// alert("this.routerId:" + this.routerId)
			if( this.routerId*1 === 1 ){
				console.log("从四级管理进来的")
				this.phoneShow = false;
			}else{
				if( this.ContentTypeVal === 2 ){
					console.log("从医保大厅进来的，并且是常见问题")
					this.phoneShow = true;
				}else{
					console.log("从医保大厅进来的，并且是政策指南")
					this.phoneShow = false;
				}
			}
		},
	}
};
</script>


<style lang="scss" scoped>
.helpPoorNotice {
	overflow: hidden;
	.helpPoorSearch {
		width: 100%;
		height: 88px;
		overflow: hidden;
		box-sizing: border-box;
		padding: 16px 30px;
		background: #00ae66;
		position: fixed;
		left: 0;
		top: 0;
		input {
		float: left;
		width: calc(100% - 102px - 30px);
		height: 56px;
		border: none;
		font-size: 26px;
		box-sizing: border-box;
		padding-left: 52px;
		border-radius: 10px;
		background: url("../assets/img/searchIcon.png") #009557 no-repeat left
			20px center;
		background-size: 25px;
		color: #fff;
		-webkit-appearance: none;
		&::-webkit-input-placeholder {
			color: #fff;
			font-size: 26px;
		}
		&::-webkit-search-cancel-button {
			position: relative;
			right: 10px;
			height: 40px;
			width: 40px;
			border-radius: 50%;
			background: url("../assets/img/icon_cha.png") #009557 no-repeat center
			center;
			background-size: 40px;
			-webkit-appearance: none;
		}
		&::-webkit-search-cancel-button:after {
			position: absolute;
			height: 30px;
			width: 30px;
			left: 0;
			top: 0;
		}
		}
		span {
		width: 102px;
		font-size: 28px;
		float: right;
		color: #fff;
		background: url("../assets/img/selectIcon.png") no-repeat left center;
		box-sizing: border-box;
		padding-left: 38px;
		background-size: 28px;
		margin: 8px 0;
		text-align: right;
		}
	}
	.helpPoorTab {
		overflow: hidden;
		width: 100%;
		background: #fff;
		position: fixed;
		left: 0;
		top: 88px;
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
			padding: 0 14px;
			font-size: 28px;
			}
			&.cur span {
			border-bottom: 3px solid #00ae66;
			color: #00ae66;
			}
		}
		}
	}
	.helpPoorList {
		width: 100%;
		overflow: hidden;
		box-sizing: border-box;
		padding-left: 30px;
		margin-top: 203px;
		background: #fff;
		border-bottom: 1px solid #e5e5e5;
		ul {
		width: 100%;
		li {
			border-bottom: 1px solid #e5e5e5;
			background: url("../assets/img/viewDetIcon.png") no-repeat right 30px
			center;
			background-size: 16px 26px;
			padding: 22px 0;
			&:last-child {
			border-bottom: none;
			}
			p {
			width: calc(100% - 60px);
			}
			span {
			display: inline-block;
			font-size: 32px;
			color: #333;
			line-height: 45px;
			}
			em {
			display: inline-block;
			font-size: 20px;
			line-height: 24px;
			color: #00ae66;
			padding: 4px 11px;
			border: 1px solid #00ae66;
			border-radius: 6px;
			margin-left: 10px;
			}
		}
		}
		.noData{
			text-align: center;
			height: 100px;
			line-height: 100px;
		}
	}
	.selectPop{
		width: 300px;
		text-align: center;
		border-radius: 10px;
		overflow: hidden;
		background: #fff;
			li{
				width: 100%;
				height: 70px;
				line-height: 70px;
				font-size: 28px;
				color: #333;
				border-bottom: 1px solid #d1d1d1;
			}
	}
	.selectPopArr{
		width: 0;
		height: 0;
		border-left: 16px solid transparent;
		border-bottom: 16px solid #fff;
		border-right: 16px solid transparent;
		border-top: 16px solid transparent;
		background: transparent;
		position: absolute;
		right:30px;
		top:-32px
	}	overflow: hidden;
	.helpPoorSearch {
		width: 100%;
		height: 88px;
		overflow: hidden;
		box-sizing: border-box;
		padding: 16px 30px;
		background: #00ae66;
		position: fixed;
		left: 0;
		top: 0;
		input {
		float: left;
		width: calc(100% - 102px - 30px);
		height: 56px;
		border: none;
		font-size: 26px;
		box-sizing: border-box;
		padding-left: 52px;
		border-radius: 10px;
		background: url("../assets/img/searchIcon.png") #009557 no-repeat left
			20px center;
		background-size: 25px;
		color: #fff;
		-webkit-appearance: none;
		&::-webkit-input-placeholder {
			color: #fff;
			font-size: 26px;
		}
		&::-webkit-search-cancel-button {
			position: relative;
			right: 10px;
			height: 40px;
			width: 40px;
			border-radius: 50%;
			background: url("../assets/img/icon_cha.png") #009557 no-repeat center
			center;
			background-size: 40px;
			-webkit-appearance: none;
		}
		&::-webkit-search-cancel-button:after {
			position: absolute;
			height: 30px;
			width: 30px;
			left: 0;
			top: 0;
		}
		}
		span {
		width: 102px;
		font-size: 28px;
		float: right;
		color: #fff;
		background: url("../assets/img/selectIcon.png") no-repeat left center;
		box-sizing: border-box;
		padding-left: 38px;
		background-size: 28px;
		margin: 8px 0;
		text-align: right;
		}
	}
	.helpPoorTab {
		overflow: hidden;
		width: 100%;
		background: #fff;
		position: fixed;
		left: 0;
		top: 88px;
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
			padding: 0 14px;
			font-size: 28px;
			}
			&.cur span {
			border-bottom: 3px solid #00ae66;
			color: #00ae66;
			}
		}
		}
	}
	.helpPoorList {
		width: 100%;
		overflow: hidden;
		box-sizing: border-box;
		padding-left: 30px;
		margin-top: 203px;
		background: #fff;
		border-bottom: 1px solid #e5e5e5;
		ul {
		width: 100%;
		li {
			border-bottom: 1px solid #e5e5e5;
			background: url("../assets/img/viewDetIcon.png") no-repeat right 30px
			center;
			background-size: 16px 26px;
			padding: 22px 0;
			&:last-child {
			border-bottom: none;
			}
			p {
			width: calc(100% - 60px);
			}
			span {
			display: inline-block;
			font-size: 32px;
			color: #333;
			line-height: 45px;
			}
			em {
			display: inline-block;
			font-size: 20px;
			line-height: 24px;
			color: #00ae66;
			padding: 4px 11px;
			border: 1px solid #00ae66;
			border-radius: 6px;
			margin-left: 10px;
			}
		}
		}
		.noData{
			text-align: center;
			height: 100px;
			line-height: 100px;
		}
	}
	.selectPop{
		width: 300px;
		text-align: center;
		border-radius: 10px;
		overflow: hidden;
		background: #fff;
			li{
				width: 100%;
				height: 70px;
				line-height: 70px;
				font-size: 28px;
				color: #333;
				border-bottom: 1px solid #d1d1d1;
			}
	}
	.selectPopArr{
		width: 0;
		height: 0;
		border-left: 16px solid transparent;
		border-bottom: 16px solid #fff;
		border-right: 16px solid transparent;
		border-top: 16px solid transparent;
		background: transparent;
		position: absolute;
		right:30px;
		top:-32px
	}
	.helpPoorLine{
		width: 100%;
		height: 130px;
		background: #00ae66;
		box-sizing: border-box;
		color: #fff;
		position: fixed;
		bottom: 0;
		left: 0;
		padding: 24px 30px;
		div{
			height: 100%;
    		overflow: hidden;
			span{
				display: block;
				padding-left: 80px;
				height: 80px;
				width: 80px;
				background: url(../assets/img/helpPoorLine.png) no-repeat left center;
				background-size: 80px;
				float: left;
				box-sizing: border-box;
			}
			p{
				float: left;
				margin-left: 16px;
				width: calc(100% - 120px - 66px);
				height: 80px;
				em,a{
					float: left;
					color: #fff;
					font-size: 28px;
					display: block;
					width: 100%;
					line-height: 36px;
				}
				em{
					margin-top: 10px;
				}
			}
			a.phoIcon {
				float: right;
				width: 66px;
				height: 66px;
				background: url(../assets/img/helpPoorLinePho.png) no-repeat left center;
				background-size: 66px;
				margin-top: 8px;
				display: block;
			}
		}
	}
}
</style>
