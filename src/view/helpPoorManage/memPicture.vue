<template>
	<div class="paperworkInfo">
		<div class="form">
			<div class="item" style="border-bottom:1px solid #E5E5E5">
				<div class="left">姓名</div>
				<span class="right">{{memInfo.Name}}</span>
			</div>
			<div class="item">
				<div class="left">身份证号</div>
				<span class="right">{{memInfo.IDCardNumber}}</span>
			</div>
		</div>


		<ul class="uploadImg" v-if="isLeader">
			<li class="image1">
				<div class="title">贫困人员个人照片</div>
				<!--<div class="cover" v-if="image1.length==0">
                    <img src="../../static/img/upload.png" alt=""><div>点此上传</div>
                </div>
                <input type="file" accept="image/*" class="file1" v-on:change="inputFile" ref="avatarInput">
                <img :src="image1" alt="" class="img">-->
				<div style="display:flex;justify-content: space-between">
					<upload  @upimg="upimg1" :srcFromParent="toChild1" style="display:inline-block;width:48%;"></upload>
					<!--<img :src="toChild1" @click="noleaderImg(toChild1)" alt="" class="noleaderImg" v-else>-->
					<div class="example">
						<img src="../../../static/img/head.png" alt="" class="idcard_example">
						<div class="mask" @click="click_enlarge1">
							<img src="../../../static/img/enlarge.png" alt="">
							<div>示例</div>
						</div>

					</div>
				</div>
			</li>
		</ul>





		<ul class="uploadImg" v-if="!isLeader">
			<li class="image1" v-if="toChild1">
				<div class="title">贫困人员个人照片</div>
				<!--<div class="cover" v-if="image1.length==0">
                    <img src="../../static/img/upload.png" alt=""><div>点此上传</div>
                </div>
                <input type="file" accept="image/*" class="file1" v-on:change="inputFile" ref="avatarInput">
                <img :src="image1" alt="" class="img">-->
				<div style="display:flex;justify-content: space-between">
					<!--<upload v-if="isLeader" @upimg="upimg1" :srcFromParent="toChild1" style="display:inline-block;width:48%;"></upload>-->
					<img :src="toChild1" @click="noleaderImg(toChild1)" alt="" class="noleaderImg">
					<div class="example">
						<img src="../../../static/img/head.png" alt="" class="idcard_example">
						<div class="mask" @click="click_enlarge1">
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
			<img class="enlargeImg" src="../../../static/img/head_big.png" alt="">
		</mt-popup>
		<mt-popup
			v-model="popupVisible1"
			position=''>
			<img class="enlargeImg" :src="noLeader_big" alt="">
		</mt-popup>
	</div>
</template>

<script>
	import util from '../../../src/util/util.js'
	import {UploadPersonImage,GetCardInfoById} from '../../api'
	import {Toast, Indicator,MessageBox} from 'mint-ui';
	import upload from '../../components/common/upload'
	export default {
		components:{
			upload
		},
		name: "mem-picture",
		data(){
			return{
				noLeader_big:'',
				isBig:false,
				popupVisible:false,
				popupVisible1:false,
				OperatorID:'',
				id:'',
				isLeader:'',
				memInfo:{},
				toChild1:'',
				PersonImg:''
			}
		},
		mounted(){
			let OperatorID = util.getlocal('OperatorID');
			this.OperatorID = OperatorID.PeopleGuid;
			this.id=this.$route.query.id;
			this.isLeader =  OperatorID.IsHelpleader;
			this.GetCardInfoById()
		},
		methods:{
			async GetCardInfoById(){
				Indicator.open();
				var obj={};
				obj.Id=this.id;
				obj.GetImgType=2;
				obj.OperatorId=this.OperatorID;
				/*obj.IDCardImgFront=this.IDCardImgFront;
				obj.IDCardImgReverse=this.IDCardImgReverse*/
				try{
					let res=await GetCardInfoById(obj);
					Indicator.close();
					this.memInfo=res.data.Data;
					this.toChild1=this.memInfo.PersonImg;
				}catch (error) {
					console.log(error);
				}

			},
			//上传信息
			async UploadPersonImage(){
				var obj={};
				obj.Id=this.id;
				obj.OperatorId=this.OperatorID;
				obj.PersonImg=this.PersonImg||this.toChild1;
				try {
					let res=await UploadPersonImage(obj);
					if(res.data.StatusCode==0){
						Toast({
							message: '保存成功',
						});
						this.$router.go(-1)
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
			upimg1(data){

				this.PersonImg=data;
			},

			click_enlarge1(){
				this.popupVisible=true;
			},

			//点击保存
			save(){
				if(this.PersonImg==''&&this.toChild1==''){
					let instance = Toast('请上传个人免冠照');
					setTimeout(() => {
						instance.close();
					}, 1000);
					return false;
				}
				this.UploadPersonImage()
			},
			goBack(){
				this.$router.go(-1)
			},
			//点击放大个人免冠照
			noleaderImg(img){
				this.popupVisible1=true;
				this.noLeader_big=img
			}

		}
	}
</script>

<style scoped lang="scss">
	.paperworkInfo{
		padding-top:30px;
		.enlargeImg{
			width:100%;
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
					text-align:left;
					margin-bottom:25px;
					color:#333333;
					span{
						font-size: 26px;
						line-height:26px;
						color: #F5A623;
						margin-left:73px;
						img{
							/*margin-top:5px;*/
							margin-right:8px;
							height:26px;
						}
					}
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
			/*position: absolute;*/
		/*	left: 0;
			right: 0;*/
			/*bottom: 80px;*/
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
