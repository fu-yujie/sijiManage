<template>
	<div class="familyDetailCon" id="familyDetailCon">
		<div class="familyDetailDes">
			<ul>
				<li>
					<span>
						家庭编号
					</span>
					<em>
						{{dataList.FamilyNo}}
					</em>
				</li>
				<li>
					<span>
						户主姓名
					</span>
					<em>
						{{dataList.Name}}
					</em>
				</li>
				<li>
					<span>
						致贫原因
					</span>
					<em>
						{{ dataList.PoorMainReason }}
					</em>
				</li>
				<li>
					<span>
						脱贫状态
					</span>
					<em>
						{{ dataList.TreatmentStatus }}
					</em>
				</li>
			</ul>
		</div>

		<div class="familyDetailInp">
			<ul>
				<li>
					<span>
						标题
					</span>
					<em>
						家庭情况
					</em>
				</li>
				<li>
					<span>
						内容
					</span>
					<em>
						<textarea placeholder="请输入正文内容"
							v-model="famiDetWord" @input="wordNum"
							maxlength="1000"
						></textarea>
						<p class="wordTot">
							<b>{{famiDetWordRema}}</b>/1000
						</p>
					</em>
				</li>
			</ul>

		</div>

		<div  class="familyDetailImg">
			<h4>
				<em>
					上传图片
				</em>
				<span>
					图片大小不超过4M，最多上传5张
				</span>
			</h4>
			<p class="tips">
				请上传完整真实的家庭情况，必须包含房屋外观及内部装修
			</p>
			<div class="upload">
				<div class='imgshow'>
					<div v-for='(item, index) in imgUrl' :key="index" class="imgshowCon">
						<i @click='delImg(index)'></i>
						<b class="bigImgIcon">
							<span  @click="showBigImg(index)" ></span>
						</b>
						<img :src="item" alt="" :class="`img${index}`" >

						<!-- 大图 -->
						<mt-popup
							v-model="popupVisible"
							id="imgBig"
						>
							<p @click="popupVisible = false">
								<img
									:src="imgUrl[imgIndex]"
								>
							</p>
						</mt-popup>
					</div>
				</div>
				<UploadImg @changeImg="getImg" class="up"></UploadImg>
			</div>
		</div>

		<div class="speBar"></div>
		<div class="btns" v-if="IsHelpleader===1">
			<input type="button" value="取消" @click="cancleInfo">
			<input type="button" value="保存" @click="AddPoorFamilyInfo">
		</div>

		<div class="noDate" v-if="!isShow">
			<div>暂无数据</div>
		</div>



	</div>
</template>


<script>
	import util from '../../../src/util/util.js';
	import {
				GetFamilyInfoByFamilyNo,//获取家庭情况
				AddPoorFamilyInfo, //提交家庭情况
			} from '../../api';
	import { Toast, Indicator,Field, Popup, MessageBox  } from 'mint-ui' ;
	import UploadImg from "@/components/common/UploadImg.vue";
	export default {
		data(){
			return{
				isShow:true,
				OperatorID:'',
				dataList:[],
				TreatmentStatusStr:"",
				//家庭情况内容
				famiDetWord:"",
				famiDetWordRema:0,
				//上传图片
				imgUrl: [],
				//显示大图
				popupVisible:false,
				//大图的链接地址
				bigImgSrc:"",
				//点击的那张图的index
				imgIndex:"",
				//是否是帮助干部
				IsHelpleader:"",
			}
		},
		components: {
			UploadImg
		},
		methods:{
			async GetFamilyInfoByFamilyNo(){
				Indicator.open();
				var obj={};
				obj.OperatorID=this.OperatorID;
				obj.FamilyId=this.$route.query.FamilyId;
				try{
					let res=await GetFamilyInfoByFamilyNo(obj);
					Indicator.close();
					let resCode = res.data.StatusCode;
					console.log( res )
					if( resCode === 0 ){
						this.dataList = res.data.Data;
						this.famiDetWord = this.dataList.DescriptionContent;
						// this.imgUrl = this.dataList.PovertyAlleviationImgs[0].ImageContent.split(' ');
						console.log(this.dataList.PovertyAlleviationImgs)
						this.dataList.PovertyAlleviationImgs.forEach(item => {
							this.imgUrl.push( item.ImageContent )
						});
					}
				}catch (error) {
					console.log(error);
				}
			},
			//提交家庭信息
			async AddPoorFamilyInfo(){
				if( this.famiDetWord.length <= 0 ){
					Toast( "家庭情况内容描述不得为空" );
					return false;
				}
				if( this.imgUrl.length <= 0 ){
					Toast( "上传图片不得少于1张" );
					return false;
				}
				Indicator.open();
				let par = {
					FamilyNo: this.dataList.FamilyNo,
					Title: "家庭情况",
					DescriptionContent: this.famiDetWord,
					OperatorID: this.OperatorID,
					PovertyAlleviationImgs: this.imgUrl,
				}
				try{
					let res = await AddPoorFamilyInfo( par );
					Indicator.close();
					console.log( res );
					let resCode = res.data.StatusCode;
					let resInfo = res.data.Info;
					if( resCode === 0 ){
						MessageBox({
							title: '保存成功',
							message: '您已成功提交家庭信息，点击"确认"按钮可返回家庭成员页面。',
							showCancelButton: false,
							confirmButtonText:"确认",
						}).then(action=>{
							this.$router.push({
								name:"PovReliefFamiList"
							})
						});
					}else{
						Toast( resInfo );
					}
				}
				catch(error){}
				finally{}
			},
			//取消家庭信息提价
			cancleInfo(){
				this.$router.push({
					name:"PovReliefFamiList"
				})
			},
			//字数统计
			wordNum(){
				let wordNumTot = this.famiDetWord.length;
				console.log(wordNumTot)
				this.famiDetWordRema = 1000 - wordNumTot;
				//去掉表情符号
				let abc = util.noFace( this.famiDetWord );
				this.famiDetWord = abc.replace(/\s+/g, "");
			},
			//上传图片
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
					this.imgUrl.push(base64);
					console.log( this.imgUrl )
				}else{
					Toast('上传的照片不能多于5张');
					return;
				}
			},
			delImg(i) {
				this.imgUrl.splice(i, 1);
				/*console.log(this.imgUrl);*/
			},
			//放大图片
			// enlarge(index){
			// 	$(`.img${index}`).toggleClass('enlargeimg');
			// },
			//显示大图
			showBigImg( liIndex ){
				this.popupVisible = true;
				this.imgIndex = liIndex;
				$("#imgBig p img" )[liIndex].onload = function(){
					let imgWid = $("#imgBig p img" )[liIndex].width;
					let imgHei = $("#imgBig p img" )[liIndex].height;
					console.log( imgWid )
					console.log( imgHei )

					if(imgWid > imgHei){
						$("#imgBig p img" ).css({
												"max-width":"100%",
												"max-height":"100%",
												"height":"auto",
												});

					}else{
						$("#imgBig p img" ).css({
												"max-width":"100%",
												"max-height":"100%",
												"width":"auto",
												"height":"auto",
												});

					}
				}
			},
		},
		mounted(){
			let OperatorID = util.getlocal('OperatorID');
			this.OperatorID = OperatorID.PeopleGuid;
			this.IsHelpleader = OperatorID.IsHelpleader;
			console.log(OperatorID)
			this.GetFamilyInfoByFamilyNo();
			let winHei = document.body.clientHeight;
			document.getElementById("app").style.height = "auto";
			document.getElementById("app").style.minHeight = "100%";
			document.getElementsByTagName("body")[0].style.background = "#EFEFF4";
			document.getElementById("familyDetailCon").style.minHeight = winHei + "px";
			//上传图片的样式调整；
			$("#UploadImg .content").css({"margin-top":"0"});
		},
		beforeDestroy(){
			//离开页面时候改变高度；
			document.getElementById("app").style.height = "";
			document.getElementsByTagName("body")[0].style.background = "";
		},
	}
</script>


<style lang="scss" scoped>
/* 家庭情况的大图查看 */
	#imgBig{
		width: 95%;
		height: auto;
		box-sizing: border-box;
		position: fixed;
		img{
			max-width: 100%;
    		height: auto;
			pointer-events: none;
		}
	}
	.speBar{
		width:100%;
		height:188px;
		background:#EFEFF4;
	}
	.enlargeimg{
		position: fixed;
		top: 0;
		left: 0;
		margin-left: 0px;
		z-index: 1000;
		width: 100%;
		// height: auto!important;
	}
	.familyDetailCon{
		overflow: auto;
		min-height: 100%;
		height: auto;
		position: relative;
		.familyDetailDes{
			overflow: hidden;
			-webkit-box-sizing: border-box;
			box-sizing: border-box;
			height: 288px;
			margin-top: 30px;
			ul{
				background: #fff;
				width: 100%;
				-webkit-box-sizing: border-box;
				box-sizing: border-box;
				overflow: hidden;
				padding: 30px 40px 10px;
				li{
					width: 100%;
					overflow: hidden;
					margin-bottom: 20px;
					font-size: 28px;
					span {
						width: 170px;
						height: 42px;
						line-height: 42px;
						float: left;
						text-align: left;
						color: #888;
					}
					em {
						color: #333;
						float: right;
						text-align: right;
						width: calc(100% - 190px);
					}
				}
			}
		}
		.familyDetailInp{
			overflow: hidden;
			background: #fff;
			margin-top: 30px;
			ul{
				box-sizing: border-box;
				padding-left: 30px;
				li{
					overflow: hidden;
					color: #333;
					span{
						display: block;
						float: left;
						color: #333;
						font-size: 32px;
						box-sizing: border-box;
						width: 70px;
					}
					em{
						display: block;
						float: left;
						color: #333;
						box-sizing: border-box;
						padding-left: 85px;
						font-size: 32px;
						width: calc( 100% - 70px );
						position: relative;
					}
					&:first-child{
						padding: 22px 30px 22px 0;
						border-bottom: 1px solid #e5e5e5;
						span{
							height: 44px;
							line-height: 44px;
						}
						em{
							height: 44px;
							line-height: 44px;
						}
					}
					&:nth-child(2){
						padding: 22px 30px 22px 0;
						textarea{
							border: none;
							width: 100%;
							height: 106px;
							font-family: 'PingFangSC-Regular';
							box-sizing: border-box;
							&::-webkit-input-placeholder{
								color:#999;
								font-family: 'PingFangSC-Regular';
							}
						}
						em{
							height: 148px;
							.wordTot{
								position: absolute;
								right: 0;
								bottom: 0;
								font-size: 24px;
								color: #999;
								display: block;
								height: 32px;
								line-height: 32px;
								b{
									font-weight: normal;
								}
							}
						}
					}

				}
			}
		}
		.familyDetailImg{
			width: 100%;
			box-sizing: border-box;
			padding: 30px;
			margin-top: 30px;
			background: #fff;
			h4{
				font-weight: normal;
				em{
					font-size: 32px;
					line-height: 44px;
				}
				span{
					margin-left: 22px;
					font-size: 24px;
					color: #999;
				}
			}
			p.tips{
				font-size: 24px;
				line-height: 36px;
				// height: 28px;
				color: #F5A623;
				margin-top: 14px;
				background: url(../../assets/img/tips.png) no-repeat left top 6px;
				background-size: 24px;
				padding-left: 34px;
			}
		}
		.btns{
			width: 100%;
			height: 118px;
			background: #fff;
			padding: 24px 45px;
			position: absolute;
			bottom: 0;
			left:0;
			box-sizing: border-box;
			overflow: hidden;
			input[type="button"]{
				width: calc((100% - 56px)/2);
				height: 70px;
				border-radius: 6px;
				background: none;
				float: left;
				font-size: 32px;
				&:nth-child(1){
					border: 2px solid #00ae66;
					margin-right: 56px;
					color: #00ae66;
				}
				&:nth-child(2){
					background: #00ae66;
					color: #fff;
					border: 1px solid #00ae66;
				}
			}
		}
	}
	/* 上传图片 */
	.upload {
		background: #ffffff;
		margin-top: 30px;
		width: 100%;
		overflow: hidden;
		#UploadImg{
			display: block;
			float: left;
			width: calc((100% - 30px)/2);
			box-sizing: border-box;
			padding: 0;
			text-align: center;
			overflow: hidden;
		}
		.imgshow {
			background: #fff;
			font-size: 0;
			display: block;
			// position: relative;
			// float: left;
			// width: calc((100% - 30px)/2);
			// margin-right: 30px;
			// margin-top: 25px;
			.bigImgBg{
				position: fixed;
				width: 100%;
				height: 100%;
				background:rgba(0,0,0,.35);
				z-index: 3;
				left:0;
				top:0;
			}
			div {
				display: inline-block;
				width: calc((100% - 30px)/2);
				// width: 100%;
				text-align: center;
				height: 227px;
				position: relative;
				margin-right: 30px;
				margin-bottom: 30px;
				float: left;
				&:nth-child(2n){
					margin-right: 0;
				}
				&>img {
					width: 100%;
					height: 100%;
				}
				i {
					position: absolute;
					display: inline-block;
					width: 1.6rem;
					height: 1.6rem;
					background:url('../../../static/img/delet.png') no-repeat center;
					top: 0;
					right: 0;
					z-index: 3;
					//border-radius: 50%;
				}
				// &::before{
				// 	content: "";
				// 	width: 100%;
				// 	height: 227px;
				// 	position: absolute;
				// 	left: 0;
				// 	top:0;
				// 	background: url(../../assets/img/addIcon.png) no-repeat rgba(0,0,0,.35) center center;
				// 	background-size: 41px;
				// }
				b.bigImgIcon{
					width: 100%;
					height: 227px;
					position: absolute;
					left: 0;
					top:0;
					background: rgba(0,0,0,.5);
					span{
						display: block;
						width: 41px;
						height: 41px;
						background: url(../../assets/img/addIcon.png) no-repeat  center center;
						background-size: 41px;
						position: absolute;
						left:50%;
						top:50%;
						margin-top: -20px;
						margin-left: -20px;
					}
				}
			}

		}
	}
</style>
