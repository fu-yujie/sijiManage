<template>
	<div class="InformationAskList beifen" id="InformationAskList">
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
			<mt-field placeholder="请输入工单类型" v-if='isOther' v-model="Other"
					  style='margin-top: 10px;padding-top: 18px;box-sizing: border-box;'></mt-field>
		</div>
		<div class="content">
			<p class="speLine"></p>
			<mt-field label="标题" id='titleInp' @input="titleInp" placeholder="请输入标题" v-model="Title"></mt-field>
			<mt-field label="内容" id='conInp' @input="entrytext" placeholder="请输入正文内容" type="textarea"
					  :attr="{maxlength: 1000}" rows="4" v-model="introduction"></mt-field>
			<div class='countNum'>{{entrylength}}/1000</div>
		</div>
		<div class="upload">
			<div class="tit">上传图片 <span>图片大小不超过4M</span></div>
			<UploadImg @changeImg="getImg" class="up"></UploadImg>
			<div class='imgshow'>
				<div v-for='(item, index) in imgUrl' :key="index">
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
		<mt-popup :closeOnClickModal="false" id="orderSub" style="width:100%;font-size:0" v-model="popupVisible" popup-transition="popup-fade"
				  position="bottom">
			<div class="head"
				 style="height:40px;display:flex;justify-content: space-between;background:#FBF9FE;border-bottom:1px solid #DFDFDF;">
				<div class="popButton" style="margin-left:15px;" @click="close">取消</div>
				<div class="popButton" style="color:#333333">请选择问题反馈部门</div>
				<div class="popButton" style="margin-right:15px;" @click="tru">确定</div>
			</div>
			<mt-navbar v-model="selected">
				<mt-tab-item id="1" v-show="tab1Show">{{tab1}}</mt-tab-item>
				<mt-tab-item id="2" v-show="tab2Show">{{tab2}}</mt-tab-item>
				<mt-tab-item id="3" v-show="tab3Show">{{tab3}}</mt-tab-item>
			</mt-navbar>
			<mt-tab-container v-model="selected">
				<mt-tab-container-item id="1">
					<!--<mt-picker :slots="slots" @change="onValuesChange"></mt-picker>-->
					<mt-radio
						style="border:none"
						align="right"
						title=""
						v-model="levelValue"
						:options="slots[0].values">
					</mt-radio>
				</mt-tab-container-item>
				<mt-tab-container-item id="2">
					<!--<mt-picker :slots="slots1" @change="onValuesChange1"></mt-picker>-->
					<mt-radio
						align="right"
						title=""
						v-model="rangeValue"
						:options="slots2[0].values">
					</mt-radio>
				</mt-tab-container-item>
				<mt-tab-container-item id="3">
					<!--<mt-picker :slots="slots1" @change="onValuesChange1"></mt-picker>-->
					<mt-radio
						align="right"
						title=""
						v-model="bumenValue"
						:options="slots1[0].values">
					</mt-radio>
				</mt-tab-container-item>
			</mt-tab-container>

		</mt-popup>
		<div id="order">
			<mt-popup style="width:100%" v-model="popupShow" popup-transition="popup-fade" position="bottom">
				<div class="head"
					 style="height:40px;display:flex;justify-content: space-between;background:#FBF9FE;border-bottom:1px solid #DFDFDF;">
					<div class="popButton" style="margin-left:15px;" @click="orderClose">取消</div>
					<div class="popButton" style="color:#333333">请选择工单反馈类型</div>
					<div class="popButton" style="margin-right:15px;" @click="orderTrue">确定</div>
				</div>
				<mt-picker :slots="slotsOrder" @change="onValuesChangeOrder"
						   style="width:100%; text-align:center;"></mt-picker>
				<!--<mt-picker :slots="slots1" @change="onValuesChange1"></mt-picker>-->
			</mt-popup>
		</div>
	</div>

</template>

<script>
	import util from '../../../src/util/util.js'
	import UploadImg from "@/components/common/UploadImg.vue";
	import {Toast, Indicator} from 'mint-ui';
	import {AddWorkOrder, GetWorkOrderDepartmentScope, GetWorkOrderLevelScope,GetDepartmentByPovertyAlleviation, GetOrderType} from '../../api'

	export default {
		name: 'InformationAskList',
		data() {
			return {
				levelValue: '',//反馈级别文字显示
				rangeValue: '',//扶贫领域文字显示
				bumenValue: '',//部门文字显示
				selected: '1',
				footState: true,
				isDisable: false,
				Department_text: '选择问题反馈部门',
				OrderType_text: '工单反馈类型',
				Department: '请选择',
				OrderType: '请选择',
				tab1: '行政级别',
				tab2: '扶贫领域',
				tab3: '反馈部门',
				OrderType_Bridge: '',
				CodeTypes: ['EnumWorkOrderType'],
				popupShow: false,
				AcceptPersonnel: '1',
				DepartmentId: '0',
				Title: '',
				OperatorID: '',
				introduction: '',
				imgUrl: [],
				entrylength: 0,
				popupVisible: false,
				//选项卡是否显示
				tab1Show: false,
				tab2Show: false,
				tab3Show: false,
				levelCode: '',//级别code
				bumenCode: '',//部门code
				rangeCode: '',//领域code
				AcceptPersonnel: '',//点击确定时取级别的code
				DepartmentId: '',//点击确定时取部门的code
				PovertyAlleviation:'',
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
				slots1: [{
					flex: 1,
					values: [],
					className: 'slot1',
					textAlign: 'center',

				}],
				slots2: [{
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
		created() {
		},
		mounted() {
			let t = this;
			let OperatorID = util.getlocal('OperatorID');
			this.OperatorID = OperatorID.OperatorID;
			this.GetWorkOrderLevelScope();
			this.GetOrderType();
			this.GetOrderRange();
			let winHei = document.body.clientHeight;
			document.getElementById("InformationAskList").style.minHeight = winHei + "px";

			$('#titleInp input').focus(function () {
				t.footState = false;
			}).blur(function () {
				t.footState = true;
			})
			$('#conInp textarea').focus(function () {
				t.footState = false;
			}).blur(function () {
				t.footState = true;
			})
		},
		watch: {
			selected: 'selectedNav',
			levelValue: 'watchValue',
			rangeValue: 'watchValue1',
			bumenValue: 'watchValue2',
		},
		methods: {
			//获取市县级别
			async GetWorkOrderLevelScope() {
				var obj = {};
				obj.OperatorID = this.OperatorID;
				var res = await GetWorkOrderLevelScope(obj);
				if (res.data.StatusCode == 0) {
					//						console.log(res.data.Data)
					var name = res.data.Data;
					var i = name.length;
					var arr = [];
					var code = [];
					for (var j = 0; j < i; j++) {
						arr.push(name[j].Code);
						code.push(name[j].CodeValue)
					}
					this.slots[0].values = arr;
					this.slots[0].values1 = code;

				}
			},
			//获取部门
			/*async GetWorkOrderDepartmentScope() {
				var obj = {};
				obj.OperatorID = this.OperatorID;
				obj.AcceptPersonnel = this.levelCode;
				var res = await GetWorkOrderDepartmentScope(obj);
				//				console.log(res);
				if (res.data.StatusCode == 0) {

					this.slots1[0].values = res.data.Data;
					var name = res.data.Data;
					var i = name.length;
					var arr = [];
					var code = [];
					for (var j = 0; j < i; j++) {
						arr.push(name[j].Name);
						code.push(name[j].Id);
					}
					//						console.log(arr);
					this.slots1[0].values = arr;
					this.slots1[0].values1 = code;

					if (res.data.Data.length == 0) {
						this.selected = '1';
						this.levelValue = '';
						this.tab1Show = false;
						this.tab2Show = false;
						this.tab3Show = false;
						setTimeout(() => {
							Toast('没有可以发布的部门');
							this.popupVisible = false;
							/!*this.value = '';
							this.tab1 = '请选择'*!/
						}, 200)

					}
				}

			},*/

			//根据扶贫领域获取所有相关工单受理人员部门
			async GetDepartmentByPovertyAlleviation() {
				var obj = {};
				obj.OperatorID = this.OperatorID;
				obj.AcceptPersonnel = this.levelCode;
				obj.PovertyAlleviation=this.rangeCode;
				var res = await GetDepartmentByPovertyAlleviation(obj);
				//console.log(res);
				if (res.data.StatusCode == 0) {

					this.slots1[0].values = res.data.Data;
					var name = res.data.Data;
					var i = name.length;
					var arr = [];
					var code = [];
					for (var j = 0; j < i; j++) {
						arr.push(name[j].DepartmentName);
						code.push(name[j].DepartmentId);
					}
					//						console.log(arr);
					this.slots1[0].values = arr;
					this.slots1[0].values1 = code;

					if (res.data.Data.length == 0) {
						this.selected = '2';
					/*	this.levelValue = '';*/
						/*this.tab1Show = false;
						this.tab2Show = false;*/
						this.tab3Show = false;
						setTimeout(() => {
							Toast('没有可以发布的部门');
							/*this.popupVisible = false;*/
							/*this.value = '';
							this.tab1 = '请选择'*/
						}, 200)

					}
				}

			},

			//获取扶贫领域
			async GetOrderRange() {
				var obj = {};
				obj.CodeTypes = ['EnumGovInfoTag'];
				obj.OrderBy = '';
				var res = await GetOrderType(obj);
				if (res.data.StatusCode == 0) {
					//					console.log(res.data.Data);

					/*if(res.data.Data != 0) {*/
					this.slots2[0].values = res.data.Data;
					var name = res.data.Data;
					var i = name.length;
					var arr = [];
					var code = [];
					for (var j = 0; j < i; j++) {
						arr.push(name[j].Description);
						code.push(name[j].CodeValue);
					}

					this.slots2[0].values = arr;
					this.slots2[0].values1 = code;
					console.log(6666);
					console.log(this.slots2[0].values);

				}
			},
			//监听value
			watchValue() {
				if (this.levelValue) {
					this.tab1 = this.levelValue;
					this.tab1Show = true;
					//value重新选择
					this.tab2 = '扶贫领域';
					this.rangeValue = '';
					var len = this.slots[0].values.length;
					for (var i = 0; i < len; i++) {
						if (this.slots[0].values[i] == this.levelValue) {
							this.levelCode = this.slots[0].values1[i];
							//console.log(this.levelCode);
						}
					}
					/*this.bumenValue=''*/
					/*this.GetWorkOrderDepartmentScope();*/
					this.selected = '2';
					this.tab2Show = true;
					this.tab3Show = false;
				}
			},
			//监听value1
			watchValue1() {
				if (this.rangeValue) {
					this.tab2 = this.rangeValue;
					this.tab3 = '反馈部门';
					this.bumenValue = '';
					var len = this.slots2[0].values.length;
					for (var i = 0; i < len; i++) {
						if (this.slots2[0].values[i] == this.rangeValue) {
							this.rangeCode = this.slots2[0].values1[i];
						}
					}
					this.GetDepartmentByPovertyAlleviation()
					this.selected = '3';
					this.tab3Show = true;
				}
			},
			//监听value2
			watchValue2() {
				if (this.bumenValue) {
					/*	this.selected='3';*/
					this.tab3 = this.bumenValue;


					var len = this.slots1[0].values.length;
					for (var i = 0; i < len; i++) {
						if (this.slots1[0].values[i] == this.bumenValue) {
							this.bumenCode = this.slots1[0].values1[i];
							// alert(this.bumenCode)
						}
					}
				}
			},
			selectedNav() {
				/*if(this.selected==2){
					this.tab1=this.level
				}else if(this.selected==2){

				}*/
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
				if (res.data.StatusCode == 0) {
					//						console.log(res.data.Data)
					var name = res.data.Data;
					console.log(name)
					var i = name.length;
					var arr = [];
					var CodeValue = [];
					for (var j = 0; j < i; j++) {
						arr.push(name[j].Description);
						CodeValue.push(name[j].CodeValue);
					}
					this.slotsOrder[0].values = arr;
					this.slotsOrder[0].values1 = CodeValue;
					this.levels = this.slotsOrder[0].values[0];
					var len = this.slotsOrder[0].values.length;
					for (var i = 0; i < len; i++) {
						if (this.slotsOrder[0].values[i] == this.levels) {
							this.levelCodes = this.slotsOrder[0].values1[i];
							this.OrderType = this.slotsOrder[0].values[i];
							this.OrderType_Bridge = this.slotsOrder[0].values[i];
							this.orderVal = this.slotsOrder[0].values[i];
							console.log(this.levels);
						}
					}
				}
			},
			select() {
				this.popupVisible = true;
				/*if(this.bumenValue){
					this.selected = '3';
				}else{
					this.selected = '1';
				}*/
				/*this.levelValue = ''*/
				/*this.tab1Show = false;
				this.tab2Show = false;
				this.tab3Show = false;*/
			},
			//放大图片
			enlarge(index) {
				console.log(index);
				$(`.img${index}`).toggleClass('enlargeimg');
			},
			selectType() {
				this.popupShow = true;
			},
			onValuesChange1(picker, values) {
				var _this = this;
				this.bumen = values[0];
				var len = this.slots1[0].values.length;
				for (var i = 0; i < len; i++) {
					if (this.slots1[0].values[i] == this.bumen) {
						this.bumenCode = this.slots1[0].values1[i];
					}
				}
			},
			onValuesChange(picker, values) {
				if (values[0] > values[1]) {
					picker.setSlotValue(1, values[0]);
				}
				//				console.log(values);
				this.level = values[0];
				var len = this.slots[0].values.length;
				if (len.length != 0) {
					for (var i = 0; i < len; i++) {
						if (this.slots[0].values[i] == this.level) {
							this.levelCode = this.slots[0].values1[i];
							//console.log(this.levelCode);
						}
					}
					if (this.popupVisible) {
						this.GetWorkOrderDepartmentScope()
					}
				}

			},
			//工单类型选择
			onValuesChangeOrder(picker, values) {
				console.log("values[0]:" + values[0]);
				console.log("values[1]:" + values[1]);
				if (values[0] > values[1]) {
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
				if (len.length != 0) {
					for (var i = 0; i < len; i++) {
						if (this.slotsOrder[0].values[i] == this.levels) {
							this.levelCodes = this.slotsOrder[0].values1[i];
							// this.OrderType = this.slotsOrder[0].values[i];
							this.orderVal = this.slotsOrder[0].values[i];
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
				if(this.tab3Show){
				this.AcceptPersonnel = this.levelCode;
				this.DepartmentId = this.bumenCode;
				this.PovertyAlleviation=this.rangeCode;
				}
				/*this.popupVisible = false;*/
				if (this.bumenValue == '') {
					Toast('请选择部门');
				} else {
					this.popupVisible = false;
				}


				if(!this.popupVisible&&this.tab3Show){
					this.Department = this.levelValue + "-" + this.bumenValue;
				}

				// if (this.levelValue != '' && this.bumenValue != '') {
				// 	this.Department = this.levelValue + "-" + this.bumenValue;
				// }

			},
			orderClose() {
				this.popupShow = false;
			},
			orderTrue() {
				if (this.orderVal != '') {
					this.OrderType = this.orderVal;
					if (this.OrderType === '其他') {
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
				if (this.imgUrl.length < 5) {
					this.imgUrl.push(base64)
					console.log(this.imgUrl)
				} else {
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
				//去掉表情符号
				let abc = util.noFace( this.introduction );
				// this.introduction = abc.replace(/\s+/g, "");
				this.introduction = abc;
			},
			titleInp(){
				//this.Title
				//去掉表情符号
				let abc = util.noFace( this.Title );
				// this.Title = abc.replace(/\s+/g, "");
				this.Title = abc;
			},
			async OrderSub() {
				if (this.levelValue == '') {
					Toast('请选择反馈部门');
					return;
				}
				if (this.DepartmentId == '') {
					Toast('请选择反馈部门');
					return;
				}
				if (this.Title == '') {
					Toast('标题不能为空');
					return;
				}
				if (this.introduction == '') {
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
				obj.PovertyAlleviation=this.PovertyAlleviation
				obj.WorkOrderType = this.levelCodes;
				obj.OtherContent = this.Other;
				this.isDisable = true;
				Indicator.open();
				let res = await AddWorkOrder(obj);
				Indicator.close();
				if (res.data.StatusCode != 0) {

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

	.enlargeimg {
		position: fixed;
		top: 0;
		left: 0;
		margin-left: 0px;
		z-index: 1000;
		width: 400px;
	}

	.play-newStyle {
		// position: relative !important;
		// margin-top: 20px;
	}

	.speLine {

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
		padding-bottom: 150px;
		box-sizing: border-box;
		position: relative;
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
			.icon {
				float: right;
				margin-right: 70px;
				width: 340px;
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
						background: url('../../../static/img/delet.png') no-repeat center;
						top: -6%;
						right: -6%;
						//border-radius: 50%;
					}
				}
			}
		}
		.play {
			// position: fixed;
			position: absolute;
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
