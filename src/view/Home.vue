<template>
	<div class="Home">
		<div class="header">
            <div>
                <img src="../../static/img/退出.png" alt="" />
			    <span @click="LoginOut">退出登录</span>
            </div>
            <div>
                <img src="../../static/img/密码.png" alt="" />
			    <span @click="changePass">修改密码</span>
            </div>
		</div>
		<div class="person">
			<img src="../../static/img/headImg.png" alt="" />
			<p>{{name}}</p>
            <p class="depart">{{DepartmentName}}</p>
		</div>
		<div  v-if="!hasPhone" class="messdNew" id="messed">
			<ul>
				<li class="isson" @click='OrderList'>
					<div style="position:relative">
					<img class="icon_pob" src="../../static/img/问题处理结果.png" alt="" />
					<img  class="newIcon" src="../../static/img/标新.png" alt="" v-if="showimg" />
					</div>
					<p>反馈工单</p>
				</li>
				<li class="newss" @click='ToInfoList'>
					<img class="img_tongzhi" src="../../static/img/通知公告.png" alt="" />
					<span style="margin-right:2.7rem;" v-if="showmessage">{{number}}</span>
					<p>通知公告</p>
				</li>
			</ul>
		</div>

		<div class="" v-if="hasPhone" id="messed">
			<ul>
				<li class="isson" @click='OrderList'>
                    <div style="position:relative">
					<img class="icon_pob" src="../../static/img/问题处理结果.png" alt="" />
					<img  class="newIcon" src="../../static/img/标新.png" alt="" v-if="showimg" />
                    </div>
                    <p>反馈工单</p>
				</li>
				<li class="isson" @click='ToPhoneBook'>
					<img class="icon_pob" src="../../static/img/形状.png" alt="" />
					<p>通讯录</p>
				</li>
				<li class="newss" @click='ToInfoList'>
					<img class="img_tongzhi" src="../../static/img/通知公告.png" alt="" />
					<span v-if="showmessage">{{number}}</span>
					<p>通知公告</p>
				</li>
			</ul>
		</div>
		<div class="menu">
			<ul>
                <li class="notice" @click="notice" v-if="toPub">
                    <div class="rukou">通知管理 ></div>
                    <p class="desc">快速布置工作任务</p>
                </li>

				<li class="pob" @click="ToOrder" v-if="toOrder">
					<div class="rukou">新建工单 ></div>
					<p class="descc">快速反馈工作问题</p>
				</li>

				<li class="poor" @click="ToNewPage" v-if="toNewPage">
					<div class="rukou">扶贫政策专栏 ></div>
					<p class="descc">快速查询扶贫政策指南</p>
				</li>

				<li class="card" @click="Popdeve()" v-if="paySearch">
					<div class="rukou">建档立卡就医费用查询></div>
					<p class="descc">快速查询建档立卡人员就医费用信息</p>
				</li>

				<!--<li class="jiaofei" @click="Toinfo">
					<div class="rukou">缴费进度查询 ></div>
					<p class="desc">快速查询城乡居民医保缴费信息</p>
				</li>-->
				<li class="jiaofei" @click="toPovertyRelief()" v-if="tohelpPoorDym">
					<div class="rukou">建档立卡脱贫动态管理 ></div>
					<p class="desc">快速维护建档立卡扶贫动态信息</p>
				</li>
                <li class="jiaofei huibao" @click="huibao()" v-if="workReport">
                    <div></div>
                    <!--<img src="../../static/img/huibao.png" alt="" style="width:100%">-->
                </li>
				<li class="jiaofei relaPoverty" @click="toHelpPoorPage()" v-if="toHelpPoorMana">
					<div class="rukou">帮扶对象管理 ></div>
					<p class="desc">快速管理帮扶对象关联关系</p>
				</li>
			</ul>
		</div>
       <!-- <div id="homePop">
        <mt-popup
            style="width:90%;border-radius: 5px"
            class="popup"
            v-model="$root.popupVisible"
            :closeOnClickModal="false"
        >
            <div class="popbox">
                <div class="news1" @click="toNews1">
                <img src="../../static/img/pageImg1.jpg" alt="">
                <div class="title">4月27日上午，市执法局领导对霸州市胜芳镇扶贫户进行走访</div>
                </div>
                <div class="news2" @click="toNews2">
                    <div class="title">5月7日，市国土资源局领导对永清县里灡
                        城崔家堡村扶贫户进行走访</div>
                    <img src="../../static/img/pageImg2.jpg" alt="">
                </div>
            </div>
            <img class="popClose" @click="popClose" src="../../static/img/close.png" alt="">
        </mt-popup>
        </div>-->
	</div>
</template>

<script>
	import util from '../../src/util/util.js'
	import config from '@/config.js';
	import { Toast } from 'mint-ui'
	import { GetWorkOrderListfail, GetNoticeListfail,login } from '../api'
	export default {
		name: 'Home',
		data() {
			return {
			    number:'',
				phone: '',
				password: '',
				showimg: false,
                showmessage: false,
                DepartmentName: "",
				OperatorID:'',
				name:'',
				user: '',
				pass: '',
				powerId: config.powerId,
				messId: config.messId,//测试
				helpPoorDym:config.helpPoorDym,//开发环境
				helpPoorMan:config.helpPoorMan,//扶贫管理菜单是否显示
				helpPoorId:config.helpPoorId,//扶贫政策专栏是否显示
				paySearchId:config.paySearchId,//就医费用查询是否显示
				reportId:config.reportId,
				workReport:true,
				tohelpPoorDym:true,
				toOrder:true,
				toNewPage:true,
				paySearch:true,
				toPub: true,
				hasPhone: true,
				IsIndustryleader:'',
				// IsHelpleader:'',
				toHelpPoorMana:false,  //帮扶对象管理是否显示
			}
		},
		components: {

		},
		created() {},
		mounted() {
            util.setlocal("tabIndex",'');
			let OperatorID = util.getlocal('OperatorID');
            this.OperatorID = OperatorID.OperatorID;
            this.PeopleMenuList = OperatorID.PeopleMenuList;
			this.IsIndustryleader = OperatorID.IsIndustryleader;
			// this.IsHelpleader =  OperatorID.IsHelpleader
            console.log(this.PeopleMenuList);
            this.DepartmentName = OperatorID.DepartmentName;
			this.name = OperatorID.Name;
			this.user = OperatorID.user;
			this.pass = OperatorID.pass;
//			console.log(this.user);
//			console.log(this.pass);
			if(this.OperatorID == '') {
				this.$router.push({
					'name': 'Login'
				});
			}
			this.GetWorkOrderListfail();
			this.GetNoticeListfail();
			this.login();
			this.login1();
			this.hasPhoneNum();
		},
		methods: {
			async GetWorkOrderListfail() {
				//查找未处理工单；
				let obj = {};
				obj.OperatorID = this.OperatorID;
				obj.OperatorType = 1;
				obj.PageIndex = 5;
				obj.PageSize = 5;
				obj.State = 1;
				let res = await GetWorkOrderListfail(obj);
				let resCode = res.data.StatusCode;
				var message = res.data.Info;
				// console.log(res);
				//判断未处理工单条数提示是否显示；
				if(resCode===0){
					let ordercount = res.data.Data.List.length;
					if(ordercount == 0) {
						this.showimg = false;
					} else {
						this.showimg = true;
						// Toast(message);
					}
				}else{
					this.showimg = false;
					// Toast(message);
				}
			},
			login() {
				let t = this;
                var message = this.PeopleMenuList;
				let arr = [];
				message.forEach(item=>{
					/*arr.push(item.SubList[0]);*/
					item.SubList.forEach(item=>{
						arr.push(item);
					});
				});
				/*console.log(message);
				console.log(222)
				 console.log(arr)*/
				var state = false;
				arr.forEach(item=>{
					if( item.Id == t.powerId ){
						console.log( "powerId匹配" );
						let ar = item;
						if(ar.IsCheckd){
							state = true;
						}
						else {
							state = false;
						}
					}
					console.log(item.Id)
				})
				if(!state){
					t.toOrder = false;
				}else{
					t.toOrder = true;
				}

				//脱贫动态管理的菜单是否显示
				var stateHelpPoorDym = false;
				let arrHelpPoorDym = [];
				message.forEach(item=>{
					item.SubList.forEach(item=>{
						arrHelpPoorDym.push(item);
					});
				});
				arrHelpPoorDym.forEach(item=>{
					if( item.Id == t.helpPoorDym ){
						console.log( "helpPoorDym匹配" );
						let ar = item;
						if(ar.IsCheckd){
							stateHelpPoorDym = true;
						}
						else {
							stateHelpPoorDym = false;
						}
					};
				});
				if(!stateHelpPoorDym){
					t.tohelpPoorDym = false;
				}else{
					t.tohelpPoorDym = true;
				};

				//扶贫政策专栏是否显示
				var helpPoor=false;
				let helpPoorList=[];
				message.forEach(item=>{
					item.SubList.forEach(item=>{
						helpPoorList.push(item);
					});
				});
				helpPoorList.forEach(item=>{
					if( item.Id == t.helpPoorId ){
						console.log( "helpPoorId匹配" )
						let ar = item;
						if(ar.IsCheckd){
							helpPoor = true;
						}
						else {
							helpPoor = false;
						}
					};
				});
				if(!helpPoor){
					t.toNewPage = false;
				}else{
					t.toNewPage = true;
				};
				//建档立卡就医费用查询是否显示
				var paySearch=false;
				let paySearchList=[];
				message.forEach(item=>{
					item.SubList.forEach(item=>{
						paySearchList.push(item);
					});
				});
				paySearchList.forEach(item=>{
					if( item.Id == t.paySearchId ){
						console.log( "paySearchId匹配" )
						let ar = item;
						if(ar.IsCheckd){
							paySearch = true;
						}
						else {
							paySearch = false;
						}
					};
				});
				if(!paySearch){
					t.paySearch = false;
				}else{
					t.paySearch = true;
				};

				//工作汇报是否显示
				var report=false;
				let reportList=[];
				message.forEach(item=>{
					item.SubList.forEach(item=>{
						reportList.push(item);
					});
				});
				console.log(111);
				console.log(reportList)
				reportList.forEach(item=>{
					if( item.Id == t.reportId ){
						console.log( "reportId匹配" )
						let ar = item;
						if(ar.IsCheckd){
							report = true;
						}
						else {
							report = false;
						}
					};
				});
				if(!report){
					t.workReport = false;
				}else{
					t.workReport = true;
				};



				//帮扶对象管理菜单是否显示
				var stateHelpPoorMan = false;
				let arrHelpMana = [];
				message.forEach(item=>{
					item.SubList.forEach(item=>{
						arrHelpMana.push(item);
					});
				})
				arrHelpMana.forEach(item=>{
					if( item.Id == t.helpPoorMan ){
						console.log( "helpPoorMan匹配" );
						let ar = item;
						if(ar.IsCheckd){
							stateHelpPoorMan = true;
						}
						else {
							stateHelpPoorMan = false;
						}
					};
				});
				if(!stateHelpPoorMan){
					t.toHelpPoorMana = false;
				}else{
					t.toHelpPoorMana = true;
				};
			},
			login1() {
				let t = this;
                var message = this.PeopleMenuList;
				let arr = [];
				message.forEach(item=>{
					/*arr.push(item.SubList[0]);*/
					item.SubList.forEach(item=>{
						arr.push(item);
					});
				})
				var state1 = false;
				arr.forEach(item=>{
					if(item.Id==t.messId){
						console.log('messId匹配')
						let ar = item;
						if(ar.IsCheckd){
							state1= true
						}
						else {
							state1 = false;
						}
					}
				})
				if(!state1){
					t.toPub = false;
				}else{
					t.toPub = true;
				}
			},
			hasPhoneNum(){
				if(this.IsIndustryleader){
					this.hasPhone = true;
				}else{
					this.hasPhone = false;
				}
			},
			async GetNoticeListfail() {
				let obj = {};
				obj.OperatorID  = this.OperatorID;
				obj.OperatorType = 1;
				obj.PageIndex = 1;
				obj.PageSize = 1;
				let res = await GetNoticeListfail(obj);
                if(res.data.StatusCode != 0){
                    return;
                }
                if(res.data.Data.TotalItemCount >= 99){
                    var messagecount = res.data.Data.TotalItemCount;
                }else{
                    var messagecount = res.data.Data.TotalItemCount;
                }
                var message = res.data.Info;
				if(messagecount == 0) {
					this.showmessage = false;
				} else {
					this.showmessage = true;
					this.number=messagecount;
				}
			},
			LoginOut() {
				sessionStorage.removeItem("OperatorID");
                sessionStorage.removeItem("searchFactor");
				this.$router.push({
					'name': 'Login'
				});
            },
            changePass(){
                this.$router.push({
					'name': 'ChangePass'
				});
            },
			Toinfo() {
				this.$router.push({
					'name': 'InformationAskList'
				});
			},
            notice(){
				this.$router.push({
					'name': 'PublishedMessList'
				});
            },
			ToOrder() {
				this.$router.push({
					'name': 'OrderSub'
				});
			},
			ToPhoneBook(){
				this.$router.push({
					'name': 'Contacts'
				});
			},
			ToInfoList() {
				this.$router.push({
					'name': 'MessageList'
				});
			},
			ToNewPage(){
				// window.location.href = "http://testlfybwx.zhiscity.com/Basic/Assets/Static/fpzl/fpzl_home.html";
				this.$router.push({
					name: 'helpPoorNotice',
					query:{
						routerId:1,
					}
				});
			},
            //工作汇报
            huibao(){
                 Toast({
                    message: "功能建设中...",
                    iconClass: '',
                    time: 500
                });
            },
            //关闭弹框
            popClose(){
                this.$root.popupVisible=false;
                this.homePopState = false;
            },
            //新闻一
			toNews1(){
				this.$router.push({
					'name': 'article01'
				});
			},
			toNews2(){
				this.$router.push({
					'name': 'article02'
				});
			},
			//问题处理结果
			OrderList() {
				this.$router.push({
					'name': 'OrderList'
				});
			},
			//提示弹框
			Popdeve(){
				let info = Toast({
					message: "功能建设中...",
					iconClass: ''
				});
				setTimeout(() => {
					info.close();
				}, 1000);
			},
			//去脱贫动态管理
			toPovertyRelief(){
			    if( this.IsIndustryleader ){
                    this.$router.push({
                        name:'PovProgressone',
                    })
                }else{
                    this.$router.push({
                        name:'PovReliefFamiList',
                    })
                }
			},
			//去帮扶对象管理页面
			toHelpPoorPage(){
				this.$router.push({
					name:'allHelpFami',
				});
			},
		}
	}
</script>

<style lang="scss" scoped>

	.Home {
		width: 670px;
		padding: 22px 40px;
		height: 100%;
        overflow: scroll;
		background: white;
        #homePop{
            .popClose{
                margin-top:26px;
                width:54px;
                left: 50%;
                transform: translateX(-50%);
                position: absolute;
            }
            .popbox{
                padding:24px 20px 11px;
                background: #FFFFFF;
                border: 1px solid #CACACA;
                border-radius: 10px;
                .news1{
                    position: relative;
                    font-size: 0;
                    img{
                        width:100%;
                    }
                    .title{
                        font-family: PingFangSC-Regular;
                        font-size: 28px;
                        color: #FFFFFF;
                        letter-spacing: 0;
                        text-align: left;
                       /* line-height: 28px;*/
                        // opacity: 0.4;
                        background: rgba(0,0,0,0.4);
                        padding:18px 33px 16px 26px ;
                        bottom: 0;
                        position: absolute;
                    }
                }
                .news2{
                    margin-top:20px;
                    padding-top:10px;
                    border-top:1px solid #E5E5E5;
                    display: flex;
                    align-items: center;
                    .title{
                        margin-right:29px;
                        font-family: PingFangSC-Regular;
                        font-size: 28px;
                        color: #000000;
                        letter-spacing: 0;
                        text-align: left;
                       /* line-height: 28px;*/
                    }
                    img{
                        width:102px;
                    }
                }


            }
        }

		.header {
            position: relative;
			display: flex;
			height: 45px;
			color: #333333;
			text-align: center;
			font-size: 28px;
			/*margin-top: 22px;*/
			line-height: 45px;
            justify-content: space-between;
			img {
				width: 29px;
				height: 31px;
				margin: 0px 10px 0 0;
                vertical-align: middle;
			}
			span {
				font-family: PingFangSC-Regular;
				font-size: 28px;
				color: #333333;
				letter-spacing: 0;
                display: inline-block;
                 vertical-align: middle;
			}
		}
		.person {
            .depart{
                color:#999999;font-size:28px;
            }
			img {
				width: 116px;
				height: 140px;
				display: block;
				margin: 0 auto;
			}
			p {
				text-align: center;
			}
        }
        .messdNew{
            li{
                width: 50%!important;
            }
        }
		#messed{
			margin-top: 44px;
			height: 183px;
			ul {
				display: flex;
				justify-content: space-between;
				li{
					width: 33.3%;
					height: 180px;
					border-right: 1px solid #E5E5E5;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					img{
						width: 52px;
						height: 52px;
					}
					p{
						font-size: 28px;
						color: #333333;
						margin-top: 25px;
					}
				}
				.newss{
					position: relative;
					border: none;
					span {
						position: absolute;
						width: 45px;
						height: 45px;
						background: #E64340;
						border-radius: 50%;
						top: 0;
						right: 0;
						margin-top: 20px;
						margin-right: 30px;
						text-align: center;
						line-height: 45px;
						color: #ffffff;
					}
				}
			}
		}
		.message {
			margin-top: 44px;
			height: 183px;
			ul {
				.isson {
					float: left;
					width: 320px;
					height: 183px;
					background: #F5F5F5;
					border-radius: 12px;

					.icon_pob {
						width: 50px;
						height: 59px;
						margin: 45px 0 0 130px;
						float: left;
					}
					.new {
						width: 75px;
						height: 36px;
						float: left;
						margin-top: 20px;
					}
					p {
						text-align: center;
						float: left;
						width: 320px;
						font-size: 32px;
						line-height: 32px;
						margin-top: 19px;
					}
				}

				.newss {
					float: left;
					background: #F5F5F5;
					border-radius: 12px;
					margin-left: 30px;
					width: 320px;
					height: 183px;
					img {
						// width: 56px;
						height: 59px;
						margin: 42px 0 0 132px;
						float: left;
					}
					span {
						float: left;
						width: 45px;
						height: 45px;
						background: #E64340;
						border-radius: 50%;
						margin-top: 20px;
						text-align: center;
						line-height: 45px;
                        margin-right: 0px;
						color: #ffffff;
					}
					p {
						text-align: center;
						width: 320px;
						float: left;
						font-size: 32px;
						line-height: 32px;
						margin-top: 19px;
					}
				}
			}
		}
		.menu {
			clear: both;
            margin-top: 30px;
            padding-bottom:30px;
			ul {

				.jiaofei{
                    margin-top: 30px;
					width: 670px;
					height: 229px;
					border-radius: 14px;
					background: url(../../static/img/bj1_search.png);
					background-size: 670px 229px;
					.rukou {
						font-family: PingFangSC-Medium;
						font-size: 54px;
						color: #FFFFFF;
						letter-spacing: 0;
						padding: 44px 0 0 47px;
						width: 600px;
						height: 75px;
					}
					.desc {
						font-family: PingFangSC-Regular;
						font-size: 32px;
						color: #FFFFFF;
						letter-spacing: 0;
						color: #FFFFFF;
						height: 45px;
						padding: 10px 0 0 47px;
					}

				}
                .huibao{
                    background: url(../../static/img/huibao.png);
                    background-size: 670px 229px;
                    position: relative;
                }
                .huibao::before, .relaPoverty::before{
                    content: "";
                    position: absolute;
                    top:0;
                    left:0;
                    right:0;
                    bottom:0;
				}
				.relaPoverty{
					background: url(../../static/img/relaPoverty.png);
                    background-size: 670px 229px;
                    position: relative;
				}
				.poor{
                    margin-top: 30px;
					width: 670px;
					height: 229px;
					border-radius: 14px;
					background: url(../../static/img/poor.png);
					background-size: 670px 229px;
					.rukou {
						font-family: PingFangSC-Medium;
						font-size: 54px;
						color: #FFFFFF;
						letter-spacing: 0;
						padding: 44px 0 0 47px;
						width: 400px;
						height: 75px;
					}
					.descc {
						font-family: PingFangSC-Regular;
						font-size: 32px;
						color: #FFFFFF;
						letter-spacing: 0;
						color: #FFFFFF;
						height: 45px;
						padding: 10px 0 0 47px;
					}
				}
				.card{
                    margin-top: 30px;
					width: 670px;
					height: 229px;
					border-radius: 14px;
					background: url(../../static/img/card.png);
					background-size: 670px 229px;
					.rukou {
						font-family: PingFangSC-Medium;
						font-size: 54px;
						color: #FFFFFF;
						letter-spacing: 0;
						padding: 44px 0 0 47px;
						width: 600px;
						height: 75px;
					}
					.descc {
						font-family: PingFangSC-Regular;
						font-size: 32px;
						color: #FFFFFF;
						letter-spacing: 0;
						color: #FFFFFF;
						height: 45px;
						padding: 10px 0 0 47px;
					}
				}
                .notice{
                    margin-top: 30px;
                    width: 670px;
                    height: 229px;
                    border-radius: 14px;
                    background: url(../../static/img/ic_search_copy.png);
                    background-size: 670px 229px;
                    .rukou {
                        font-family: PingFangSC-Medium;
                        font-size: 54px;
                        color: #FFFFFF;
                        letter-spacing: 0;
                        padding: 44px 0 0 47px;
                        width: 400px;
                        height: 75px;
                    }
                    .desc {
                        font-family: PingFangSC-Regular;
                        font-size: 32px;
                        color: #FFFFFF;
                        letter-spacing: 0;
                        color: #FFFFFF;
                        width: 448px;
                        height: 45px;
                        padding: 10px 0 0 47px;
                    }
                }
				.pob {
					margin-top: 30px;
                    margin-bottom:30px;
					width: 670px;
					height: 229px;
					border-radius: 14px;
					background: url(../../static/img/bj2.png);
					background-size: 670px 229px;
					.rukou {
						font-family: PingFangSC-Medium;
						font-size: 54px;
						color: #FFFFFF;
						letter-spacing: 0;
						padding: 44px 0 0 47px;
						width: 400px;
						height: 75px;
					}
					.descc {
						font-family: PingFangSC-Regular;
						font-size: 32px;
						color: #FFFFFF;
						letter-spacing: 0;
						color: #FFFFFF;
						width: 448px;
						height: 45px;
						padding: 10px 0 0 47px;
					}
				}
			}
		}
        .newIcon{
            width:75px !important;
            height:36px !important;
            position:absolute;
            top:-18px;
            left:55px;

        }
	}
</style>
