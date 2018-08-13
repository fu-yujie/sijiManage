<template>
	<div class="contlogin">
		<div class="login">
			<div class="header">廊坊智慧医保四级管理平台</div>
			<div class="login_content" style="margin-right: 30px;">
				<div id="user" style="border-bottom: 1px solid #999;margin: 0 auto;margin-bottom: 25px;">
					<input type="text" id='phone' v-model="user" placeholder="请输入手机号码"/>
					<img src="../../static/img/delet.png" v-if="user" @click="user=''"/>
				</div>
				<div id="" style="border-bottom: 1px solid #999;margin: 0 auto;">
					<input type="password" id='pass' v-model="pass" placeholder="请输入登录密码"/>
					<img src="../../static/img/delet.png" v-if="pass" @click="pass=''"/>
				</div>
			</div>
			<mt-button type="primary" class="btn" @click="goHome()">登录</mt-button>
            <p class="messageLogin" @click="messageLogin">
                短信验证登录
            </p>
			<p class="helpCent" @click="openPop">
				帮助中心
			</p>
		</div>

		<mt-popup
		v-model="popupVisible"
		position="center"
		:closeOnClickModal="false"
		style="width:75%; border-radius:0.25rem">
			<div class="helpCenPop">
				<i @click="cloPop"></i>
				<ul>
					<li @click="toGuideList">
						操作使用指南
					</li>
					<li @click="toHelpBar">
						扶贫政策专栏
					</li>
				</ul>
			</div>
		</mt-popup>
	</div>

</template>

<script>
	import util from '../../src/util/util.js'
	import { Toast,Indicator} from 'mint-ui'
	import { login } from '../api'
	export default {
		name: 'login',
		data() {
			return {
				user: '',
				pass: '',
				OperatorID: '',
                PeopleGuid:'',
				name: '',
				Level: '',
				Code: '',
                AreaName:'',
                DepartmentName: '',
                Phone: '',
				PeopleMenuList: [],
				popupVisible: false,
				//判断值
				IsActive:'',
				IsIndustryleader:'',
				IsHelpleader:'',
			}
		},
		components: {

		},
		created() {},
		mounted() {
		},
		methods: {
			async goHome() {
                Indicator.open();
				let obj = {};
				obj.UserName = this.user;
				obj.PassWord = this.pass;
				let res = await login(obj);
				console.log(res);
				Indicator.close();
				if(res.data.StatusCode == 0) {
					this.OperatorID = res.data.Data.Id;
                    this.PeopleGuid=res.data.Data.PeopleGuid;
					this.name = res.data.Data.Name;
					this.Level = res.data.Data.Level;
					this.Code = res.data.Data.Code;
					this.AreaName = res.data.Data.AreaName;
                    this.Phone = res.data.Data.Phone;
                    this.DepartmentName = res.data.Data.DepartmentName;
                    this.PeopleMenuList = res.data.Data.PeopleMenuList;
                    this.IsActive = res.data.Data.IsActive;
					this.IsIndustryleader = res.data.Data.IsIndustryleader;
					this.IsHelpleader = res.data.Data.IsHelpleader;
					this.saveOperatorID();
					Toast({
						message: '登录成功',
						iconClass: '',
						time: 500
					});
                    if(res.data.Data.IsActive == 0){
						Indicator.close();
                        this.$router.push({name : "ChangePass"});
                        return;
                    }
                    Indicator.close();
					setTimeout(() => {
						this.$router.push({
							'name': 'HomeBefore'
						});
					}, 500);
				} else if(res.data.StatusCode == -1004) {
					let info = Toast({
						message: '用户名或密码不正确',
						iconClass: ''
					});
					setTimeout(() => {
						Indicator.close();
						info.close();
					}, 1000);
				} else if(res.data.StatusCode == -1003) {
					let info = Toast({
						message: '该用户不存在',
						iconClass: ''
					});
					setTimeout(() => {
						Indicator.close();
						info.close();
					}, 1000);
				}else if(res.data.StatusCode == -1002) {
					let info = Toast({
						message: '请填写登录密码',
						iconClass: ''
					});
					setTimeout(() => {
						Indicator.close();
						info.close();
					}, 1000);
				}else if(res.data.StatusCode == -1001) {
					let info = Toast({
						message: '请填写用户账号',
						iconClass: ''
					});
					setTimeout(() => {
						Indicator.close();
						info.close();
					}, 1000);
				}
			},
            messageLogin(){
                this.$router.push({
                    name:"messageLogin",
                })
            },
			saveOperatorID() {
				let obj = {
					'OperatorID': this.OperatorID,
                    'PeopleGuid':this.PeopleGuid,
					'Name': this.name,
					'Level': this.Level,
					'Code': this.Code,
					'user':this.user,
					'AreaName':this.AreaName,
                    'Phone':this.Phone,
                    'IsActive': this.IsActive,
					'DepartmentName':this.DepartmentName,
                    'PeopleMenuList':this.PeopleMenuList,
					'IsIndustryleader': this.IsIndustryleader,
					'IsHelpleader': this.IsHelpleader,
				};
				util.setlocal('OperatorID', obj);
                let OperatorID = util.getlocal('OperatorID');
                console.log(OperatorID);
			},
			//跳转到扶贫政策专栏
			toHelpBar(){
				this.$router.push({
					name:"helpPoorNotice",
					query:{
						routerId:1,
					}
				})
			},
			//跳转到操作使用指南 //guideList
			toGuideList(){
				this.$router.push({
					name:"guideList",
				})
			},
			//关闭弹窗
			cloPop(){
				this.popupVisible = false;
			},
			//启动弹窗
			openPop(){
				this.popupVisible = true;
			},

		}
	}

</script>

<style lang="scss" scoped>
	.contlogin {
		width: 100%;
		height: 100%;
		background: #fff;
		overflow: hidden;
		.login {
			width: 620px;
			margin: 175px auto 0 auto;
			background: #fff;
			.header {
				height: 67px;
				color: #00AE66;
				text-align: center;
				font-size: 48px;
				line-height: 67px;
				font-weight: bold;
				margin-bottom: 114px;
			}
			.login_content {
				width: 620px;
				/*margin: 0 auto;*/
				background: #fff;
				font-size: 12px;
				input{
					width: 500px;
					padding: 25px;
					padding-left: 80px;
					border: none;
					/*border-bottom: 1px solid #999;*/
					font-family: PingFangSC-Regular;
					font-size: 32px;
					color: #666666;
					box-sizing: border-box;
				}
				div{
                    position:relative;
					display: flex;
					align-items: center;
                    img{
                        position:absolute;
                        right:10px;
                        height:40px;
                    }
				}

				#phone{
                    width:100%;
					/*padding: 25px 0px;*/
					background-image: url(../../static/img/phone.png);
					background-repeat: no-repeat;
					background-position: 25px center;
					background-size: 24.4px 41.3px;

				}
				#pass{
                    width:100%;
					background-image: url(../../static/img/Shape.png);
					background-repeat: no-repeat;
					background-position: 25px center;
					background-size: 30px 40px;
				}
			}
			.btn {
				width: 620px;
				height: 94px;
				margin-top: 80px;
				background-color: #00AE66;
			}
            .messageLogin{
                float: left;
                font-size:28px;
                height: 34px;
                line-height: 34px;
                color:#666666;
                background-size:34px;
                /*padding-left: 44px;*/
                margin-top: 40px;
            }
			.helpCent{
				float: right;
				font-size:28px;
				height: 34px;
				line-height: 34px;
				color:#E64340;
				background: url(../assets/img/helpCenterIcon.png) no-repeat left center;
				background-size:34px;
				padding-left: 44px;
				margin-top: 40px;
			}
		}
		.helpCenPop{
			width:100%;
			position: relative;
			box-sizing:border-box;
			padding:30px;
			border-radius:8px;
			background:#fff;
			i{
				display: inline-block;
				width: 40px;
				height: 40px;
				background:url(../assets/img/helpCenterClo.png)  no-repeat center center;
				background-size:30px;
				position: absolute;
				right: 30px;
				top:30px;
			}
			ul{
				width: 100%;
				box-sizing:border-box;
				padding-left:46px;
				margin-top: 40px;
				padding-bottom: 10px;
				li{
					width:100%;
					box-sizing:border-box;
					height: 50px;
					line-height: 50px;
					color:#333;
					font-size:36px;
					margin-bottom: 30px;
					background:url(../assets/img/helpItemIcon.png)  no-repeat left center;
					padding-left:54px;
					background-size:34px;
				}
			}

		}
	}
</style>
