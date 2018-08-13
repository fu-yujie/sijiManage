<template>
	<div class="InformationAskList" id="InformationAskList">
		<div class="header" @click="select">
			{{Department_text}}
			<span class="icon">{{Department}}</span>
			<i></i>
		</div>
		<div class="headorder" @click="selectType">
			{{OrderType_text}}
			<span class="icon">{{OrderType}}</span>
			<i></i>
		</div>
		<div id="orderType">
			<mt-field placeholder="请输入工单类型" v-if='isOther' v-model="Other" style='margin-top: 10px;padding-top: 18px;box-sizing: border-box;'></mt-field>
		</div>
		<div class="content">
			<p class="speLine"></p>
			<mt-field label="标题" id='titleInp' placeholder="请输入标题" v-model="Title"></mt-field>
			<mt-field label="内容" id='conInp' @input="entrytext" placeholder="请输入正文内容" type="textarea" :attr="{maxlength: 1000}" rows="4" v-model="introduction"></mt-field>
			<div class='countNum'>{{entrylength}}/1000</div>
		</div>
		<div class="upload">
			<div class="tit">上传图片 <span>图片大小不超过4M</span></div>
			<UploadImg @changeImg="getImg" class="up"></UploadImg>
			<div class='imgshow'>
				<div v-for='(item, index) in imgUrl' :key="index" >
					<!--<a class="enlarge" @click="enlarge(index)"></a>-->
					<i @click='delImg(index)'></i>
					<img :src="item" alt="" :class="`img${index}`" @click="enlarge(index)">
				</div>
			</div>
		</div>
		<div class="play" :class="footState == true ? '' : 'play-newStyle' ">
			<mt-button type="default" class="cancel" @click="cancels()">取消</mt-button>
			<mt-button type="default" class="sub" @click="OrderSub()" :disabled="isDisable">提交</mt-button>
		</div>
		<mt-popup  id="orderSub" style="width:100%;font-size:0" v-model="popupVisible" popup-transition="popup-fade" position="bottom">
			<div class="head" style="height:40px;display:flex;justify-content: space-between;background:#FBF9FE;border-bottom:1px solid #DFDFDF;">
				<div class="popButton" style="margin-left:15px;" @click="close">取消</div>
				<div class="popButton" style="color:#333333">请选择问题反馈部门</div>
				<div class="popButton" style="margin-right:15px;" @click="tru">确定</div>
			</div>
			<ul class="searchTab">
				<li v-bind:class="curNum===1?'cur':''"
					@click="tabchange1"
				>
				<span>
					<!-- 区县 -->
					{{tab1Text}}
				</span>
				</li>
				<li v-bind:class="curNum===2?'cur':''"
					@click="tabchange2"
				>
				<span>
					<!-- 街道、乡、镇 -->
					{{tab2Text}}
				</span>
				</li>
				<li v-bind:class="curNum===3?'cur':''"
					@click="tabchange3"
				>
				<span>
					<!-- 村、社区 -->
					{{tab3Text}}
				</span>
				</li>
			</ul>
			<div>
				<mt-picker :slots="slots" @change="onValuesChange" v-show="curNum===1"></mt-picker>
				<mt-picker :slots="slots2" @change="onValuesChange2" v-show="curNum===2"></mt-picker>
				<mt-picker :slots="slots1" @change="onValuesChange1" v-show="curNum===3"></mt-picker>
			</div>
			<!--<mt-tab-container v-model="selected">
				<mt-tab-container-item id="1">
					<mt-picker :slots="slots" @change="onValuesChange"></mt-picker>
				</mt-tab-container-item>
				<mt-tab-container-item id="2">
					<mt-picker :slots="slots2" @change="onValuesChange2"></mt-picker>
				</mt-tab-container-item>
				<mt-tab-container-item id="3">
					<mt-picker :slots="slots1" @change="onValuesChange1"></mt-picker>
				</mt-tab-container-item>
			</mt-tab-container>-->

			<!--<mt-picker :slots="slots" @change="onValuesChange"></mt-picker>
			<mt-picker :slots="slots2" @change="onValuesChange2"></mt-picker>
			<mt-picker :slots="slots1" @change="onValuesChange1"></mt-picker>-->

		</mt-popup>
		<div id="order">
			<mt-popup style="width:100%" v-model="popupShow" popup-transition="popup-fade" position="bottom">
				<div class="head" style="height:40px;display:flex;justify-content: space-between;background:#FBF9FE;border-bottom:1px solid #DFDFDF;">
					<div class="popButton" style="margin-left:15px;" @click="orderClose">取消</div>
					<div class="popButton" style="color:#333333">请选择工单反馈类型</div>
					<div class="popButton" style="margin-right:15px;" @click="orderTrue">确定</div>
				</div>
				<mt-picker :slots="slotsOrder" @change="onValuesChangeOrder" style="width:100%; text-align:center;" ></mt-picker>
				<!--<mt-picker :slots="slots1" @change="onValuesChange1"></mt-picker>-->
			</mt-popup>
		</div>
	</div>

</template>

<script>
	import util from '../../../src/util/util.js'
	import UploadImg from "@/components/common/UploadImg.vue";
	import { Toast, Indicator } from 'mint-ui';
	import { AddWorkOrder, GetWorkOrderDepartmentScope, GetWorkOrderLevelScope,GetDepartmentByPovertyAlleviation, GetOrderType } from '../../api'
	export default {
		name: 'InformationAskList',
		data() {
			return {
				curNum: 1,
				selected:'1',
				footState: true,
				isDisable: false,
				Department_text:'选择问题反馈部门',
				OrderType_text:'工单反馈类型',
				Department: '请选择',
				OrderType: '请选择',
				OrderType_Bridge:'',
				CodeTypes: ['EnumWorkOrderType'],
				popupShow: false,
				/*AcceptPersonnel: '1',
				DepartmentId: '0',*/
				Title: '',
				OperatorID: '',
				introduction: '',
				imgUrl: [],
				entrylength: 0,
				popupVisible: false,
				tab1Text:'行政级别',
				tab2Text:'扶贫领域',
				tab3Text:'反馈部门',
				levelCode: '',//等级code
				bumenCode: '',//部门code
				rangeCode:'',//扶贫领域code
				AcceptPersonnel:'',//点击确定时取级别code
				DepartmentId:'',//点击确定时取部门code
				range:'',//扶贫领域
				level: '',
				bumen: '',
				orderVal: '',
				CodeValue: [],
				isOther: false,
				Other: '',
				slots: [{
					flex: 1,
					values: [],
					className: 'slot1',
					textAlign: 'center',
					defaultIndex: 1,
				}],
				slots2: [{
					flex: 1,
					values: [],
					className: 'slot1',
					textAlign: 'center',

				}],
				slots1: [{
					flex: 1,
					values: [],
					className: 'slot1',
					textAlign: 'center',

				}],
				slotsOrder: [{
					flex: 1,
					values: [],
					className: 'slot1',
					textAlign: 'center',
					defaultIndex: 1,
				}],
			}
		},
		components: {
			UploadImg
		},
		created() {},
		mounted() {
			let t = this;
			let OperatorID = util.getlocal('OperatorID');
			this.OperatorID = OperatorID.OperatorID;
			this.GetWorkOrderLevelScope();
			//获取扶贫领域
			this.GetOrderRange()
			this.GetOrderType();
			document.getElementById("InformationAskList").style.paddingBottom = "50px";
			document.getElementById("InformationAskList").style.height = "auto";
			$('#titleInp input').focus(function() {
				t.footState = false;
			}).blur(function() {
				t.footState = true;
			})
			$('#conInp textarea').focus(function() {
				t.footState = false;
			}).blur(function() {
				t.footState = true;
			})
		},
		methods: {
			//获取市县级别
			async GetWorkOrderLevelScope() {
				var obj = {};
				obj.OperatorID = this.OperatorID;
				var res = await GetWorkOrderLevelScope(obj);
				if(res.data.StatusCode == 0) {
					//						console.log(res.data.Data)
					var name = res.data.Data;
					var i = name.length;
					var arr = ['请选择'];
					var code = [''];
					for(var j = 0; j < i; j++) {
						arr.push(name[j].Code);
						code.push(name[j].CodeValue)
					}
					//                  console.log(arr);
					this.slots[0].values = arr;
					this.slots[0].values1 = code;
					this.level = this.slots[0].values[0];
					var len = this.slots[0].values.length;
					for(var i = 0; i < len; i++) {
						if(this.slots[0].values[i] == this.level) {
							this.levelCode = this.slots[0].values1[i];
							//								console.log(this.levelCode);
						}
					}
					/*this.GetWorkOrderDepartmentScope()*/
				}
			},
			//获取部门
			/*async GetWorkOrderDepartmentScope() {
				var obj = {};
				obj.OperatorID = this.OperatorID;
				obj.AcceptPersonnel = this.levelCode;
				var res = await GetWorkOrderDepartmentScope(obj);
				if(res.data.StatusCode == 0) {

					this.slots1[0].values = res.data.Data;
					var name = res.data.Data;
					var i = name.length;
					var arr = ['请选择'];
					var code = [''];
					for(var j = 0; j < i; j++) {
						arr.push(name[j].Name);
						code.push(name[j].Id);
					}
					//						console.log(arr);
					this.slots1[0].values = arr;
					this.slots1[0].values1 = code;

					if(res.data.Data.length == 0) {
						setTimeout(() => {
							Toast('没有可以发布的部门');
							this.popupVisible = false;
						}, 200)

					}
				}

			},*/



			//根据扶贫领域获取所有相关工单受理人员部门
			async GetDepartmentByPovertyAlleviation() {
				var obj = {};
				obj.OperatorID = this.OperatorID;
				obj.AcceptPersonnel = this.levelCode;
			/*	if(this.range=='请选择'){
					this.range='000'
				}*/
				obj.PovertyAlleviation=this.range;
				var res = await GetDepartmentByPovertyAlleviation(obj);
				if(res.data.StatusCode == 0) {

					this.slots1[0].values = res.data.Data;
					var name = res.data.Data;
					var i = name.length;
					var arr = ['请选择'];
					var code = [''];
					for(var j = 0; j < i; j++) {
						arr.push(name[j].DepartmentName);
						code.push(name[j].DepartmentId);
					}
					//						console.log(arr);
					this.slots1[0].values = arr;
					this.slots1[0].values1 = code;

					if(res.data.Data.length == 0) {
						setTimeout(() => {
							Toast('没有可以发布的部门');
							this.popupVisible = false;
						}, 200)

					}
				}

			},
			//tab切换
			tabchange1(){
				this.curNum=1
			},
			tabchange2(){
				if(this.level=='请选择'){
					Toast({
						message: "请先选择行政级别",
						time: 500
					});
				}else{

					this.curNum=2;
				}
			},
			tabchange3(){
				if(this.level=='请选择'){
					Toast({
						message: "请先选择行政级别",
						time: 500
					});
				}else if(this.range=='请选择'){
					Toast({
						message: "请先选择扶贫领域",
						time: 500
					});
				}else{
					this.curNum=3;
				}
			},
			footShow() {
				this.footState = true;
			},
			footHide() {
				this.footState = false;
			},

			async GetOrderType() {
				var obj = {};
				obj.CodeTypes = this.CodeTypes;
				obj.OrderBy = '';
				var res = await GetOrderType(obj);
				if(res.data.StatusCode == 0) {
					//						console.log(res.data.Data)
					var name = res.data.Data;
					console.log(name)
					var i = name.length;
					var arr = [];
					var CodeValue = [];
					for(var j = 0; j < i; j++) {
						arr.push(name[j].Description);
						CodeValue.push(name[j].CodeValue);
					}
					this.slotsOrder[0].values = arr;
					this.slotsOrder[0].values1 = CodeValue;
					this.levels = this.slotsOrder[0].values[0];
						var len = this.slotsOrder[0].values.length;
						for(var i = 0; i < len; i++) {
							if(this.slotsOrder[0].values[i] == this.levels) {
                                this.levelCodes = this.slotsOrder[0].values1[i];
                                this.OrderType = this.slotsOrder[0].values[i];
								this.OrderType_Bridge = this.slotsOrder[0].values[i];
								this.orderVal =  this.slotsOrder[0].values[i];
								console.log(this.levels);
							}
						}
				}
			},
			//获取扶贫领域
			async GetOrderRange(){
				var obj = {};
				obj.CodeTypes = ['EnumGovInfoTag'];
				obj.OrderBy = '';
					var res=await GetOrderType(obj);
					if(res.data.StatusCode == 0) {
						//					console.log(res.data.Data);

						/*if(res.data.Data != 0) {*/
						this.slots2[0].values = res.data.Data;
						var name = res.data.Data;
						var i = name.length;
						var arr = ['请选择'];
						var code = [''];
						for(var j = 0; j < i; j++) {
							arr.push(name[j].Description);
							code.push(name[j].CodeValue);
						}

						this.slots2[0].values = arr;
						this.slots2[0].values1 = code;
						console.log(6666);
						console.log(this.slots2[0].values);

				}
			},
			select() {
				this.popupVisible = true;
			},
			//放大图片
			enlarge(index){
			    console.log(index);
				$(`.img${index}`).toggleClass('enlargeimg');
			},
			selectType(){
				this.popupShow = true;
			},
			onValuesChange1(picker, values) {
				var _this = this;
				if (
					picker.getSlotValue(0) !== null &&
					picker.getSlotValue(0) !== undefined
				){
					this.bumen = values[0];
					if(this.bumen!='请选择'){
						this.tab3Text=this.bumen;
					}else{
						this.tab3Text='反馈部门';
					}
				}

				/*this.bumen = values[0];*/
				var len = this.slots1[0].values.length;
				for(var i = 0; i < len; i++) {
					if(this.slots1[0].values[i] == this.bumen) {
						this.bumenCode = this.slots1[0].values1[i];
					}
				}
			},
			//扶贫领域滑动事件
			onValuesChange2(picker, values) {
				var _this = this;

				if (
					picker.getSlotValue(0) !== null &&
					picker.getSlotValue(0) !== undefined
				){
					this.range = values[0];
					if(this.range!='请选择'){
						this.tab2Text=this.range;
						/*this.tab3Text='反馈部门';*/

					}else{
						this.tab2Text='扶贫领域';
					}
				}

			/*	this.range = values[0];*/
				var len = this.slots2[0].values.length;
				for(var i = 0; i < len; i++) {
					if(this.slots2[0].values[i] == this.range) {
						this.rangeCode = this.slots2[0].values1[i];
					}
				}
				if(this.popupVisible&&this.level!='请选择') {
					this.GetDepartmentByPovertyAlleviation()
				}
			},
			onValuesChange(picker, values) {
				if(values[0] > values[1]) {
					picker.setSlotValue(1, values[0]);
				}
				//				console.log(values);
				if (
					picker.getSlotValue(0) !== null &&
					picker.getSlotValue(0) !== undefined
				){
					this.level = values[0];
					if(this.level!='请选择'){
						this.tab1Text=this.level;
						/*this.tab2Text='扶贫领域'
						this.tab3Text='反馈部门'*/
					}else{
						this.tab1Text='行政级别';
					}
				}

				var len = this.slots[0].values.length;
				if(len.length != 0) {
					for(var i = 0; i < len; i++) {
						if(this.slots[0].values[i] == this.level) {
							this.levelCode = this.slots[0].values1[i];
							//console.log(this.levelCode);
						}
					}
				}

			},
			//工单类型选择
			onValuesChangeOrder(picker, values) {
				console.log("values[0]:" + values[0]);
				console.log("values[1]:" + values[1]);
				if(values[0] > values[1]) {
					picker.setSlotValue(1, values[0]);
				}
				console.log(values);
				this.orderVal = values[0];
				var len = this.slotsOrder[0].values.length;
				this.levels = values[0];
				/* if(this.levels === '其他') {
					this.isOther = true;
				} else {
					this.isOther = false;
				} */
				var len = this.slotsOrder[0].values.length;
				if(len.length != 0) {
					for(var i = 0; i < len; i++) {
						if(this.slotsOrder[0].values[i] == this.levels) {
                            this.levelCodes = this.slotsOrder[0].values1[i];
                            // this.OrderType = this.slotsOrder[0].values[i];
							this.orderVal =  this.slotsOrder[0].values[i];
                            // this.OrderType_Bridge = this.slotsOrder[0].values[i];
							console.log(this.orderVal);
						}
					}
				}
			},
			close() {
				this.popupVisible = false;
			},
			tru() {

				if(this.bumen == '请选择'||this.level=='请选择'||this.range=='请选择') {
					Toast('请选择部门');
				}else{
					this.AcceptPersonnel=this.levelCode;
					this.DepartmentId=this.bumenCode;
					this.popupVisible = false;
					this.Department = this.level + "-" + this.bumen;
				}
				/*if(this.level != '' && this.bumen != '') {
					this.Department = this.level + "-" + this.bumen;
				}*/


			},
			orderClose() {
				this.popupShow = false;
			},
			orderTrue() {
				if(this.orderVal != '') {
					this.OrderType = this.orderVal;
					if(this.OrderType === '其他') {
						this.isOther = true;
					} else {
						this.isOther = false;
					}
				} else {
					Toast('请选择工单类型');
				}
				this.popupShow = false;
			},
			cancels() {
				this.$router.push({
					'name': 'Home'
				});
			},
			getImg({
				base64,
				blob,
				imgFile
			}) {
				/* 获取压缩后的图片 base64格式 blob格式 和imgFile */
				/* 建议只使用blob格式上传图片 base64文件过大在某些手机上会上传失败 */
				// console.log(base64, blob, imgFile);
				/*console.log(base64);*/
				if(this.imgUrl.length < 5) {
					this.imgUrl.push(base64)
					console.log(this.imgUrl)
				}else{
					Toast('上传的照片不能多于5张');
					return;
				}
			},
			delImg(i) {
				this.imgUrl.splice(i, 1);
				/*console.log(this.imgUrl);*/
			},
			entrytext() {
				this.entrylength = this.introduction.length;
			},
			async OrderSub() {
				if(this.level == '') {
					Toast('请选择反馈部门');
					return;
				}
				if(this.bumen == '') {
					Toast('请选择反馈部门');
					return;
				}
				if(this.Title == '') {
					Toast('标题不能为空');
					return;
				}
				if(this.introduction == '') {
					Toast('内容不能为空');
					return;
				}
//				if(this.imgUrl.length == 0) {
//					Toast('请上传照片');
//					return;
//				}
				let obj = {};
				obj.Title = this.Title;
				obj.PovertyAlleviationImgs = this.imgUrl;
				obj.Content = this.introduction;
				obj.OperatorID = this.OperatorID;
				obj.AcceptPersonnel = this.AcceptPersonnel;
				obj.DepartmentId = this.DepartmentId;
				obj.WorkOrderType = this.levelCodes;
				obj.OtherContent = this.Other;
                this.isDisable = true;
                Indicator.open();
				let res = await AddWorkOrder(obj);
				Indicator.close();
				if(res.data.StatusCode != 0) {

					Toast(res.data.Info);
					this.isDisable = false;
					return;
				} else {
					Toast('发布成功');
					this.isDisable = false;
					setTimeout(() => {
						this.$router.push({
							'name': 'Home'
						});
					}, 1000);
				}

			}
		}
	}
</script>

<style lang="scss" scoped>
	.searchTab {
		overflow: hidden;
		display: flex;
		display: -webkit-flex;
		justify-content: space-between;
		li {
			text-align: center;
			width: 33.3%;
			box-sizing: border-box;
			font-size: 32px;
			span {
				display: inline-block;
				height: 88px;
				line-height: 88px;
				padding: 0 30px 0 10px;
				float: left;
				/*max-width: 90%;*/
				width:100%;
				box-sizing: border-box;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				text-align: center;
			}
			&.cur span {
				border-bottom: 4px solid #00ae66;
			}
			&:nth-child(1) {
				padding: 0 0 0 30px;
			}
			&:nth-child(3) {
				padding: 0 30px 0 0;
			}
		}
	}
	.enlargeimg{
		position: fixed;
		top: 0;
		left: 0;
		margin-left: 0px;
		z-index: 1000;
		width: 400px;
	}
    .play-newStyle{
        position: relative!important;
        margin-top:20px;
    }
	.speLine{
		width: calc(100% - 15px);
		height: 1px;
		border-bottom: 1px solid #efeff4;
		position: absolute;
		left: 15px;
		top: 94px;
		z-index: 1;
	}

	.InformationAskList {
		background-color: #EFEFF4;
		padding-top: 30px;
		padding-bottom: 100px;
		.popButton {
			display: inline-block;
			/* border-bottom: 1px solid #E5E5E5;*/
			/*width: 50%;*/
			font-size: 32px;
			height: 80px;
			line-height: 80px;
			color: #00AE66
		}
		.header,
		.headorder {
			width: 750px;
			height: 88px;
			// color: #EF6C37;
			// padding-left: 80px;
			text-align: left;
			font-size: 32px;
			line-height: 88px;
			background: #ffffff;
			/*background: #ffffff url('../../../static/img/问题反馈.png') no-repeat 30px center;*/
			text-indent: 20px;
			/*background-size: 38px 38px;*/
			position: relative;
			i {
				position: absolute;
				right: 30px;
				top: 30px;
				width: 16px;
				height: 26px;
				background: url('../../../static/img/Chevron.png') no-repeat center;
				background-size: contain;
				z-index: 99;
			}
			.icon{
				float: right;
                margin-right: 70px;
                width:340px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
				color: #707274;
			}
		}
		.headorder {
			margin-top: 20px;
		}
		.content {
			margin-top: 30px;
			position: relative;
			.countNum {
				background: #fff;
				padding: 10px 20px;
				text-align: right;
				color: #999;
			}
		}
		.upload {
			background: #ffffff;
			margin-top: 30px;
			width: 750px;
			// min-height: 322px;
			overflow: hidden;
			.tit {
				padding: 25px 0 0 30px;
				box-sizing: border-box;
				width: 100%;
				span {
					font-family: PingFangSC-Regular;
					font-size: 24px;
					color: #999999;
					letter-spacing: 0;
				}
			}
			.up {
				text-align: center;
			}
			.imgshow {
				padding: 30px;
				background: #fff;
				font-size: 0;
				// padding-bottom:150px;
				div {
					display: inline-block;
					padding: 10px;
					width: 22%;
					text-align: center;
					height: 150px;
					position: relative;
					img {
						width: 100%;
						height: 100%;
					}
					i {
						position: absolute;
						display: inline-block;
						width: 1.6rem;
						height: 1.6rem;
						background:url('../../../static/img/delet.png') no-repeat center;
						top: -6%;
						right: -6%;
						//border-radius: 50%;
					}
				}
			}
		}
		.play {
			position: fixed;
			bottom: 0;
			/*margin-top: 350px;*/
			height: 118px;
			width: 750px;
			background: #fff;
			.cancel {
				border: 2px solid #00AE66;
				border-radius: 10px;
				width: 301px;
				height: 70px;
				margin: 24px 0 0 45px;
				color: #00AE66;
				background: transparent;
			}
			.sub {
				background: #00AE66;
				border-radius: 10px;
				width: 301px;
				height: 70px;
				margin-left: 57px;
				color: #FFFFFF;
			}
		}
	}
</style>
