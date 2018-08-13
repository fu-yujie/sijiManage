<template>
<div class="paperworkInfo">
	<div class="form">
		<div class="item" style="border-bottom:1px solid #E5E5E5">
			<div class="left">姓名</div>
			<span class="right">{{memInfo.Name}}</span>
		</div>
		<!-- <div class="item">
			<div class="left">身份证号</div>
			<span class="right">{{memInfo.IDCardNumber}}</span>
		</div> -->
	</div>


	<ul class="uploadImg" v-if="isLeader">
		<li class="image1" v-if="isAdult">
			<div class="title">身份证人像面</div>
			<!--<div class="cover" v-if="image1.length==0">
                <img src="../../static/img/upload.png" alt=""><div>点此上传</div>
            </div>
            <input type="file" accept="image/*" class="file1" v-on:change="inputFile" ref="avatarInput">
            <img :src="image1" alt="" class="img">-->
			<div style="display:flex;justify-content: space-between">
				<upload  @upimg="upimg1" :srcFromParent="toChild1" style="display:inline-block;width:48%;"></upload>
				<div class="example">
					<img src="../../../static/img/idcard_example1.png" alt="" class="idcard_example">
					<div class="mask" @click="click_enlarge1">
						<img src="../../../static/img/enlarge.png" alt="">
						<div>示例</div>
					</div>

				</div>
			</div>
		</li>
		<li class="image2" v-if="isAdult">
			<div class="title">身份证国徽面</div>
			<div style="display:flex;justify-content: space-between">
				<upload @upimg="upimg2"  :srcFromParent="toChild2" style="display:inline-block;width:48%;"></upload>
				<div class="example">
					<img src="../../../static/img/idcard_example2.png" alt="" class="idcard_example">
					<div class="mask" @click="click_enlarge2">
						<img src="../../../static/img/enlarge.png" alt="">
						<div>示例</div>
					</div>

				</div>
			</div>

		</li>
		<li>
			<div class="prompt" @click="toAccount" v-if="isLeader&&isAdult">
				<img class="img_left" src="../../../static/img/prompt.png" alt="">
				<span>未成年人可点击此处上传户口本本人信息页</span>
				<img class="img_right" src="../../../static/img/arrow_right.png" alt="">
			</div>
		</li>
		<li class="image3" v-if="!isAdult">
			<div class="title">户口本本人信息页</div>

			<div style="display:flex;justify-content: space-between">
				<upload  @upimg="upimg3"   :srcFromParent="toChild3" style="display:inline-block;width:48%;"></upload>
				<div class="example">
					<img src="../../../static/img/account.png" alt="" class="idcard_example">
					<div class="mask" @click="click_enlarge3">
						<img src="../../../static/img/enlarge.png" alt="">
						<div>示例</div>
					</div>

				</div>
			</div>
		</li>


		<li>
			<div class="prompt" @click="toIdcard" v-if="isLeader&&!isAdult">
				<img class="img_left" src="../../../static/img/prompt.png" alt="">
				<span>点击此处返回身份证信息上传页</span>
				<img  class="img_right" src="../../../static/img/arrow_right.png" alt="">
			</div>
		</li>
	</ul>


	<ul class="uploadImg" v-if="!isLeader">
		<li class="image1" v-if="toChild1">
			<div class="title">身份证人像面</div>
			<!--<div class="cover" v-if="image1.length==0">
                <img src="../../static/img/upload.png" alt=""><div>点此上传</div>
            </div>
            <input type="file" accept="image/*" class="file1" v-on:change="inputFile" ref="avatarInput">
            <img :src="image1" alt="" class="img">-->
			<div style="display:flex;justify-content: space-between">
				<img :src="toChild1" @click="noleaderImg(toChild1)" alt="" class="noleaderImg">
				<div class="example">
					<img src="../../../static/img/idcard_example1.png" alt="" class="idcard_example">
					<div class="mask" @click="click_enlarge1">
						<img src="../../../static/img/enlarge.png" alt="">
						<div>示例</div>
					</div>

				</div>
			</div>
		</li>
		<li class="image2" v-if="toChild2">
			<div class="title">身份证国徽面</div>
			<!--<div class="cover" v-if="image2.length==0">
                <img src="../../static/img/upload.png" alt=""><div>点此上传</div>
            </div>
            <input type="file" accept="image/*" class="file1" v-on:change="inputFile1" ref="avatarInput1">
            <img :src="image2" alt="" class="img">-->
			<div style="display:flex;justify-content: space-between">
				<img :src="toChild2" @click="noleaderImg(toChild2)" alt="" class="noleaderImg">
				<div class="example">
					<img src="../../../static/img/idcard_example2.png" alt="" class="idcard_example">
					<div class="mask" @click="click_enlarge2">
						<img src="../../../static/img/enlarge.png" alt="">
						<div>示例</div>
					</div>

				</div>
			</div>
		</li>


		<li class="image3" v-if="toChild3">
			<div class="title">户口本本人信息页</div>
			<!--<div class="cover" v-if="image2.length==0">
                <img src="../../static/img/upload.png" alt=""><div>点此上传</div>
            </div>
            <input type="file" accept="image/*" class="file1" v-on:change="inputFile1" ref="avatarInput1">
            <img :src="image2" alt="" class="img">-->
			<div style="display:flex;justify-content: space-between">
				<img :src="toChild3" alt="" @click="noleaderImg(toChild3)" class="noleaderImg">
				<div class="example">
					<img src="../../../static/img/account.png" alt="" class="idcard_example">
					<div class="mask" @click="click_enlarge3">
						<img src="../../../static/img/enlarge.png" alt="">
						<div>示例</div>
					</div>

				</div>
			</div>
		</li>
	</ul>





	<div @click="save" class="saveButton" v-if="isLeader">保存</div>
	<div @click="goBack" class="saveButton" v-if="!isLeader">返回</div>

	<mt-popup
		v-model="popupVisible"
		position=''>
		<div class="popup">
		<div class="popupTop">
			<div class="title">确认保存</div>
			<div class="content">请输入贫困人员身份证号码，此信息
				将作为信息校验依据，请谨慎填写！</div>
			<div class="form">
			<input type="text" v-model="realName" placeholder="请输入贫困人员姓名">
			<input type="text" v-model="idCard" placeholder="请输入18位身份证号">
			</div>

		</div>
		<div class="popupBottom">
			<div class="cancelClick" @click="cancelClick">取消</div>
			<div class="sureClick" @click.prevent="sureClick">确认</div>
		</div>
		</div>
	</mt-popup>
	<mt-popup
		v-model="popupVisible1"
		position=''>
		<img class="enlargeImg" src="../../../static/img/idcard1_big.png" alt="" v-if="isIdcard1">
		<img class="enlargeImg" src="../../../static/img/idcard2_big.png" alt="" v-if="isIdcard2">
		<img class="enlargeImg" src="../../../static/img/account_big.png" alt="" v-if="isIdcard3">
	</mt-popup>
	<mt-popup
		v-model="popupVisible2"
		position=''>
		<img class="enlargeImg" :src="noLeader_big" alt="" >

	</mt-popup>

	<mt-popup
		v-model="popupVisible3"
		position=''>
		<div class="popup">
			<div class="popupTop">
				<div class="title">提示</div>
				<div class="content">您已成功保存贫困人员证件信息，点击“确定”按钮可返回家庭成员页面。</div>

			</div>
			<div class="popupBottom">
				<div style="width:100%" class="sureClick" @click.prevent="gobackSure">确认</div>
			</div>
		</div>
	</mt-popup>


</div>
</template>

<script>
	import util from '../../../src/util/util.js'
	import {UploadIDCardImages,UploadCensusRegisterImages,GetCardInfoById} from '../../api'
	import upload from '../../components/common/upload'
	import {Toast, Indicator,MessageBox} from 'mint-ui';
    export default {
		components:{
			upload
		},
        name: "paperwork-info",
		data(){
			return{
				popupVisible3:false,
				popupVisible2:false,
				noLeader_big:'',
				GetImgType:'',
				toChild1:"",
				toChild2:"",
				toChild3:'',
				isIdcard1:false,
				isIdcard2:false,
				isIdcard3:false,
				isAdult:true,
				popupVisible:false,
				popupVisible1:false,
				idCard:'',
				realName:'',
				OperatorID:'',
				id:'',//家庭成员id
				isLeader:'',//帮扶干部
				memInfo:{},
				IDCardImgFront:'',
				IDCardImgReverse:'',
				CensusRegisterImg:''//户口本照片
			}
		},
		mounted(){
			this.GetImgType=1;
			let OperatorID = util.getlocal('OperatorID');
			this.OperatorID = OperatorID.PeopleGuid;
			this.isLeader =   OperatorID.IsHelpleader;
			this.id=this.$route.query.id;
			this.GetCardInfoById();
			this.GetAccountInfoById()
		},
		methods:{
			//获取成员信息
			async GetCardInfoById(){
				Indicator.open();
				var obj={};
				obj.Id=this.id;
				obj.GetImgType=1;
				obj.OperatorId=this.OperatorID;
				/*obj.IDCardImgFront=this.IDCardImgFront;
				obj.IDCardImgReverse=this.IDCardImgReverse*/
				try{
					let res=await GetCardInfoById(obj);
					Indicator.close();
					this.memInfo=res.data.Data;
						this.toChild1=this.memInfo.IDCardImgFront;
						this.toChild2=this.memInfo.IDCardImgReverse;
						/*if(this.toChild1==''||this.toChild2==''){
							this.GetAccountInfoById()
						}*/

				}catch (error) {
					console.log(error);
				}

			},

			async GetAccountInfoById(){
				Indicator.open();
				var obj={};
				obj.Id=this.id;
				obj.GetImgType=3;
				obj.OperatorId=this.OperatorID;
				/*obj.IDCardImgFront=this.IDCardImgFront;
				obj.IDCardImgReverse=this.IDCardImgReverse*/
				try{
					let res=await GetCardInfoById(obj);
					Indicator.close();
					this.memInfo=res.data.Data;
					/*this.toChild1=this.memInfo.IDCardImgFront;
					this.toChild2=this.memInfo.IDCardImgReverse;*/
					this.toChild3=this.memInfo.CensusRegisterImg;

				}catch (error) {
					console.log(error);
				}

			},
			//上传户口本
			async UploadCensusRegisterImages(){
				var obj={};
				obj.Id=this.id;
				obj.OperatorId=this.OperatorID;
				obj.CensusRegisterImg=this.CensusRegisterImg||this.toChild3;
				obj.UploadCardImgName=this.realName;
				obj.UploadCardImgIDNum=this.idCard;
				try {
					let res=await UploadCensusRegisterImages(obj);
					Indicator.close();
					if(res.data.StatusCode==0){
						this.popupVisible=false;
						this.popupVisible3=true;
						/*MessageBox.alert('您已成功保存贫困人员证件信息，点击“确定”按钮可返回家庭成员页面。').then(action => {
							this.popupVisible=false;
							this.$router.go(-1)
						});*/
					}else{
						let instance = Toast(res.data.Info);
						setTimeout(() => {
							instance.close();
						}, 1000);
					}
				}catch (error) {
					console.log(error);
				}
			},
			//上传信息身份证
			async UploadIDCardImages(){
				var obj={};
				obj.Id=this.id;
				obj.OperatorId=this.OperatorID;
				obj.IDCardImgFront=this.IDCardImgFront||this.toChild1;
				obj.IDCardImgReverse=this.IDCardImgReverse||this.toChild2;
				obj.UploadCardImgName=this.realName;
				obj.UploadCardImgIDNum=this.idCard;
				try {
					let res=await UploadIDCardImages(obj);
					Indicator.close();
					if(res.data.StatusCode==0){
						this.popupVisible=false;
						this.popupVisible3=true;
						/*MessageBox.alert('您已成功保存贫困人员证件信息，点击“确定”按钮可返回家庭成员页面。').then(action => {
							this.popupVisible=false;
							this.$router.go(-1)
						});*/

					}else{
						let instance = Toast(res.data.Info);
						setTimeout(() => {
							instance.close();
						}, 1000);
					}
				}catch (error) {
					console.log(error);
				}
			},
			//返回家庭成员页
			gobackSure(){
				this.$router.go(-1)
			},
			upimg1(data){
				//this.IDCardImgFront=data;
				this.toChild1=data;

			},
			upimg2(data){
				//this.IDCardImgReverse=data;
				this.toChild2=data;
			},
			//上传户口本本人信息页
			upimg3(data){
				/*this.CensusRegisterImg=data;*/
				this.toChild3=data;
			},
			//切换至上传户口本
			toAccount(){
				this.isAdult=false;
				this.GetImgType=3;
				/*this.GetAccountInfoById()*/
			},
			toIdcard(){
				this.isAdult=true;
				this.GetImgType=1;
				/*this.GetAccountInfoById()*/
			},
			click_enlarge1(){
				this.isIdcard1=true;
				this.isIdcard2=false;
				this.isIdcard3=false;
				this.popupVisible1=true;
			},
			click_enlarge2(){
				this.isIdcard1=false;
				this.isIdcard2=true;
				this.isIdcard3=false;
				this.popupVisible1=true;
			},
			click_enlarge3(){
				this.isIdcard1=false;
				this.isIdcard2=false;
				this.isIdcard3=true;
				this.popupVisible1=true;
			},
			//点击保存
			save(){
				this.popupVisible=true;
			},
			//弹窗确认
			sureClick(){
				//验证身份证人像面是否上传

				if(this.isAdult){
				if(this.IDCardImgFront==''&&this.toChild1==''){
					let instance = Toast('请上传身份证人像面');
					setTimeout(() => {
						instance.close();
					}, 1000);
					return false;
				}
				//验证身份证国徽面是否上传
				if(this.IDCardImgReverse==''&&this.toChild2==''){
					let instance = Toast('请上传身份证国徽面');
					setTimeout(() => {
						instance.close();
					}, 1000);
					return false;
				}
				}else{
					if(this.CensusRegisterImg==''&&this.toChild3==''){
						let instance = Toast('请上传户口本本人信息页');
						setTimeout(() => {
							instance.close();
						}, 1000);
						return false;
					}
				}
				//验证姓名是否为空
				if(this.realName==''){
					let instance = Toast('姓名不能为空');
					setTimeout(() => {
						instance.close();
					}, 1000);
					return false;
				}
				//验证身份证号是否为空
				if(this.idCard==''){
					let instance = Toast('身份证号码不能为空');
					setTimeout(() => {
						instance.close();
					}, 1000);
					return false;
				}
				//验证身份证号
				var c = this.idCard;
				//var reg=/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
				//var reg=/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
				//var reg=/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/
                this.idenNum(c);
				if(this.idenNum(c)){
					Indicator.open();
					if(this.isAdult){
						this.UploadIDCardImages()
					}else{
						this.UploadCensusRegisterImages()
					}
				}




			},

			idenNum ( idenVal) {
				//城市
				var vcity = {
					11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古",
					21: "辽宁", 22: "吉林", 23: "黑龙江", 31: "上海", 32: "江苏",
					33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南",
					42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆",
					51: "四川", 52: "贵州", 53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃",
					63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外"
				};
				//检查号码是否符合规范，包括长度，类型
				function isCardNo (card) {
					//身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
					var reg = /(^\d{15}$)|(^\d{17}([\d|X])$)/;  //(?i:x)
					if (reg.test(card) === false) {
						return false;
					}
					return true;
				};
				//取身份证前两位,校验省份
				function checkProvince (card) {
					var province = card.substr(0, 2);
					if (vcity[province] == undefined) {
						return false;
					}
					return true;
				};
				////检查生日是否正确
				function checkBirthday (card) {
					var len = card.length;
					//身份证15位时，次序为省（3位）市（3位）年（2位）月（2位）日（2位）校验位（3位），皆为数字
					if (len == '15') {
						var re_fifteen = /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/;
						var arr_data = card.match(re_fifteen);
						var year = arr_data[2];
						var month = arr_data[3];
						var day = arr_data[4];
						var birthday = new Date('19' + year + '/' + month + '/' + day);
						return verifyBirthday('19' + year, month, day, birthday);
					}
					//身份证18位时，次序为省（3位）市（3位）年（4位）月（2位）日（2位）校验位（4位），校验位末尾可能为X
					if (len == '18') {
						var re_eighteen = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/;
						var arr_data = card.match(re_eighteen);
						var year = arr_data[2];
						var month = arr_data[3];
						var day = arr_data[4];
						var birthday = new Date(year + '/' + month + '/' + day);
						return verifyBirthday(year, month, day, birthday);
					}
					return false;
				};
				//校验日期
				function verifyBirthday (year, month, day, birthday) {
					var now = new Date();
					var now_year = now.getFullYear();
					//年月日是否合理
					if (birthday.getFullYear() == year && (birthday.getMonth() + 1) == month && birthday.getDate() == day) {
						//判断年份的范围（3岁到100岁之间)  //改成0-150岁之间
						var time = now_year - year;
						if (time >= 0 && time <= 150) {
							return true;
						}
						return false;
					}
					return false;
				};
				//校验位的检测
				function checkParity (card) {
					//15位转18位
					card = changeFivteenToEighteen(card);
					var len = card.length;
					if (len == '18') {
						var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
						var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
						var cardTemp = 0, i, valnum;
						for (i = 0; i < 17; i++) {
							cardTemp += card.substr(i, 1) * arrInt[i];
						}
						valnum = arrCh[cardTemp % 11];
						if (valnum == card.substr(17, 1)) {
							return true;
						}
						return false;
					}
					return false;
				};
				//15位转18位身份证号
				function changeFivteenToEighteen (card) {
					if (card.length == '15') {
						var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
						var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
						var cardTemp = 0, i;
						card = card.substr(0, 6) + '19' + card.substr(6, card.length - 6);
						for (i = 0; i < 17; i++) {
							cardTemp += card.substr(i, 1) * arrInt[i];
						}
						card += arrCh[cardTemp % 11];
						return card;
					}
					return card;
				};
				//调用之前全部判断函数；
				function checkCard()
				{
					var card1 = idenVal;
					var card = card1.replace('x', 'X');
					/*if(a=='x'){
						alert(22)
					}*/
					//校验长度，类型
					if( isCardNo(card) === false ||
						checkProvince(card) === false ||
						checkBirthday(card) === false ||
						checkParity(card) === false )
					{
						//alert('您输入的身份证号码不正确，请重新输入');
						let instance = Toast('您输入的身份证号码不正确，请重新输入');
						setTimeout(() => {
							instance.close();
						}, 1000);
						return false;
					}
					return true;
				};
				//checkCard();
				let abc = checkCard();
				return abc;
			},

			//户口本信息照片点击放大
			noleaderImg(img){
				this.popupVisible2=true;
				this.noLeader_big=img
			},

			//弹窗取消
			cancelClick(){
				this.popupVisible=false;
			},
			goBack(){
				this.$router.go(-1)
			}
		}
    }
</script>

<style scoped lang="scss">
	.paperworkInfo{
		background: #EFEFF4;
		padding-top:30px;
		padding-bottom:30px;
		/*.prompt{
			position: relative;
			div{
				display: inline-block;
				position: absolute;
				right: 0;
				top: 50%;
				transform: translateY(-50%);
				font-size: 26px;
				line-height:37px;
				color: #F5A623;
				img{

					!*margin-top:5px;*!
					margin-right:8px;
					height:26px;
					position: absolute;
					top: 50%;
					transform: translateY(-50%);
				}
				span{
					margin-left:34px;
				}

			}
		}*/
		.prompt{
			padding-left:30px;
			background:#FFF7EB;
			height:80px;
			line-height:80px;
			color: #F5A623;
			font-size: 26px;
			position:relative;
			.img_left{
				height:26px;
				position: absolute;
				top: 50%;
				transform: translateY(-50%);
			}
			span{
				margin-left:34px;
			}
			.img_right{
				height:26px;
				position: absolute;
				top: 50%;
				transform: translateY(-50%);
			}
		}
		.enlargeImg{
			width:100%
		}
		.form{
			font-size:32px;
			background:white;
			.item{
				margin-left:30px;
				text-align:left;
				height:87px;
				line-height:87px;
				.left{
					display: inline-block;
					width:180px;
				}
				.right{
					margin-left:20px;
				}
			}
		}
		.uploadImg{
			.image1,.image2,.image3{
				position:relative;
				background:white;
				margin-top:30px;
				padding:25px 30px;
				box-sizing:border-box;
				text-align:left;

				.title{
					position: relative;
					text-align:left;
					margin-bottom:25px;
					color:#333333;

				}
				.noleaderImg{
					width:48%;
					height:227px;
				}
				.example{
					display:inline-block;
					position:relative;
					/* margin-left:10px;
                     right:15px*/
					width:48%;
					height:227px;
					.idcard_example{
						width:100%;
						height:227px;

					}
					.mask{
						width:100%;
						/* box-sizing: border-box;*/
						position:absolute;
						top:0;
						background:rgba(0,0,0,0.40);
						/*height:114px;
                        width:165px;*/
						/* padding:20px 66px*/
						height:100%;
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
						div{
							color:white;
							font-size:32px;
						}
						img{
							width:52px;
						}

					}

				}

			}

		}
		.saveButton{
			width:670px;
			height:94px;
			line-height:94px;
			background: #00AE66;
			border: 2px solid rgba(5,5,5,0.08);
			border-radius: 10px;
			margin:auto;
			text-align:center;
			font-size: 36px;
			color: #FFFFFF;
			margin-top:50px;
		}
		.popup{
			.popupTop{
				padding:34px 30px 31px;
				.title{
					margin-bottom:18px;
					text-align: center;
					font-size: 36px;
					color: #333333;
				}
				.content{
					font-size: 30px;
					color: #666666;
				}
				input{
					box-sizing: border-box;
					padding-left:20px;
					margin-top:20px;
					height:85px;
					width:100%;
					border:0;
					background: #F4F4F4;
					border-radius: 8px;
				}
				input::placeholder{
					font-family: PingFangSC-Regular;
					font-size: 28px;
					color: #888888;
				}
			}
			.popupBottom{
				height:100px;
				line-height:100px;
				font-size:0;
				border-top:1px solid  #E5E5E5;
				div{
					box-sizing: border-box;
					display:inline-block;
					width:50%;
					font-size: 36px;
					text-align: center;
				}
				.cancelClick{
					color: #999999;
					border-right:1px solid  #E5E5E5;
				}
				.sureClick{
					color: #00AE66;
				}
			}
		}

	}


</style>
