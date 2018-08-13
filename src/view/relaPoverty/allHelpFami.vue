<template>
	<div class="famiListWrap" id="famiListWrap">
			<div  @click="addPoorFami" class="helpPoorSearch">
				<p>
					添加帮扶对象
				</p>
			</div>

			<div class="famiListBox" id="famiListBox">
			<mt-loadmore
				:auto-fill="false"
				:top-method="loadTop"
				:bottom-method="loadBottom"
				:bottom-all-loaded="allLoaded"
				ref="loadmore"
			>
				<!-- :bottom-method="loadBottom"  -->
				<ul id="ul1">
				<li v-for = " (item,index) in famiListBox " :key = "index">
					<dl>
					<dd>
						<span>
						家庭编号
						</span>
						<em>
						{{ item.FamilyId }}
						</em>
					</dd>
					<dd>
						<span>
						户主姓名
						</span>
						<em>
						{{ item.Name }}
						</em>
					</dd>
					<dd>
						<span>
						户主身份证号
						</span>
						<em>
						{{ item.IDCardNumber }}
						</em>
					</dd>
					<dd>
						<span>
						家庭地址
						</span>
						<em>
						{{ item.Address.length === 0 ?'---':item.Address }}
						</em>
					</dd>
					<dd>
						<span>
						家庭成员数量
						</span>
						<em>
						{{ item.PeopleCount }}人
						</em>
					</dd>
						<dd>
						<span>
						联系方式
						</span>
							<em>
								{{ item.Phone }}
							</em>
							<em>
								{{ item.Telephone }}
							</em>
						</dd>
					<!--<dd>
						<span>
						固定电话
						</span>
						<em>
						{{ item.Telephone }}
						</em>
					</dd>
					<dd>
						<span>
						手机号码
						</span>
						<em>
						{{ item.Phone }}
						</em>
					</dd>-->
					<dd>
						<span>
						致贫原因
						</span>
						<em>
						{{  item.PoorMainReason.length === 0 ?'---':item.PoorMainReason }}
						</em>
					</dd>
					<dd>
						<span>
						脱贫状态
						</span>
						<em>
						{{ item.TreatmentStatusStr }}
						</em>
					</dd>
					</dl>
					<div class="famiListBtn">
						<p @click="releaseHelp( index )" class="specialBtn">
							解除帮扶
						</p>
						<p @click="toFamilyMeM(index)">
							家庭成员
						</p>
					</div>
				</li>
				</ul>
			</mt-loadmore>
			<div class="noData" v-if = "noData">
				暂无数据
			</div>
			</div>



	</div>
</template>


<script>
import util from "../../../src/util/util.js";
import {
	GetPoorFamilySelflList, //干部本人已绑定家庭户信息
	RemovePoorLeaderRelation  //解除绑定
} from "../../api";
import { Toast, Indicator, Loadmore, Popup, Actionsheet, MessageBox } from "mint-ui";
import { setTimeout } from "timers";

export default {
	data() {
		return {
			//操作人id-要传过去的参数
			OperatorID: "",
			PageIndex: 1,
			PageSize: 10,
			NameOrIDCard: "",
			allPage: "",
			//盒子
			famiListBox: [],
			//下拉上划什么的
			allLoaded: false,
			noData: false,
			//区域盒子
			areaBox: [],

			//从统计页面带过来的值
			areaCode: "",
			townCode: "",
			streetCode: "",
			key: "",

		};
	},
	mounted() {
		let OperatorID = util.getlocal("OperatorID");
		this.OperatorID = OperatorID.PeopleGuid;
		console.log("this.OperatorID:"+this.OperatorID)

		//脱贫动态areaCode
		let searchFactor = util.getlocal("searchFactor");
		this.areaCode = searchFactor.areaCode;
		this.townCode = searchFactor.townCode;
		this.streetCode = searchFactor.streetCode;
		this.key = searchFactor.searchKey;
		//获取列表信息；
		this.PageIndex = 1;
		this.GetPoorFamilySelflList();
		//进入页面时候改变高度；
		let winHei = document.body.scrollHeight;
		document.getElementById("famiListWrap").style.height = winHei + "px";
		document.getElementById("app").style.height = "auto";
		document.getElementById("app").style.minHeight = "100%";
		document.getElementsByTagName("body")[0].style.background = "#EFEFF4";
	},
	beforeDestroy() {
		//离开页面时候改变高度；
		document.getElementById("app").style.height = "";
		document.getElementsByTagName("body")[0].style.background = "";
	},
  methods: {
    //获取列表信息
    async GetPoorFamilySelflList() {
		/* 	Name: "",
			IDCardNumber: "",
			NameOrIDCard: this.NameOrIDCard || this.key,
			TreatmentStatus: 0,
			TreatmentTime: "",
			AreaCode: this.areaCode ,  //|| this.choosedAreaCode
			TownCode: this.townCode ,  //|| this.choosedTownCode
			StreetCode: this.streetCode, // || this.choosedStreetCode
		 */
		Indicator.open();
		let Entity = {
			OperatorID: this.OperatorID,
			PageIndex: this.PageIndex,
			PageSize: this.PageSize,
			OrderBy: "",
		};
		try {
			let res = await GetPoorFamilySelflList(Entity);
			Indicator.close();
			console.log(res);
			let resCode = res.data.StatusCode;
			let resInfo = res.data.Info;
			if (resCode === 0) {
			this.allPage = res.data.Data.TotalPageCount;
			let listLen = res.data.Data.List.length;
			if (this.PageIndex === this.allPage) {
				console.log("最后一页了");
				this.allLoaded = true;
			}
			if (listLen === 0) {
				this.noData = true;
			} else {
				this.noData = false;
				res.data.Data.List.forEach(item => {
				this.famiListBox.push(item);
				});
			}
			} else {
			Toast({
				message: resInfo,
				time: 500
			});
			}
		} catch (error) {
			console.log(error);
		} finally {
		}
    },
    //跳转到家庭页面；
    toFamilyMeM(liIndex) {
      this.$router.push({
        name: "helpFamiMem",
        query: {
          FamilyId: this.famiListBox[liIndex].FamilyId
        }
      });
    },
    //跳转到帮扶人列表页面
    toHelpPer(liIndex) {
      this.$router.push({
        name: "PovReliefHelpCadres",
        query: {
          FamilyId: this.famiListBox[liIndex].FamilyId
        }
      });
    },
    //下拉
    loadTop() {
      this.PageIndex = 1;
      this.NameOrIDCard = "";
      this.famiListBox = [];
      this.GetPoorFamilySelflList();
      this.$refs.loadmore.onTopLoaded();
      this.allLoaded = false;
    },
    //上划
    loadBottom() {
      console.log("底部变化");
      this.PageIndex = this.PageIndex + 1;
      this.GetPoorFamilySelflList();
      this.$refs.loadmore.onBottomLoaded();
    },
    //sear
    searchKey() {
      this.key = "";
      this.PageIndex = 1;
      this.famiListBox = [];
      this.GetPoorFamilySelflList();
    },
    //keycode
    keyCodeSear(e) {
      if (e.keyCode === 13) {
        this.PageIndex = 1;
        this.famiListBox = [];
        this.GetPoorFamilySelflList();
      }
    },
    //功能建设中
    building() {
      Toast({
        message: "功能建设中...",
        time: 500
      });
	},
	//解除绑定的ajax事件
	async RemovePoorLeaderRelation( liIndex ){
		let parama = {
			PoorFamilyNum: this.famiListBox[liIndex].FamilyId,
  			OperatorId: this.OperatorID,
		}
		try{
			let res = await RemovePoorLeaderRelation( parama );
			console.log( res );
			let resInfo = res.data.Info;
			Toast({
				message: resInfo,
				time: 500
			});
			let resCode = res.data.StatusCode;
				if(resCode === 0){
					this.$nextTick( ()=>{
						//获取列表信息；
						this.PageIndex = 1;
						this.famiListBox = [];
						this.GetPoorFamilySelflList();
					} )
				}
		}
		catch(error){

		}
		finally{

		}
	},
	//解除帮扶
	releaseHelp( liIndex ){
		let famiNum = this.famiListBox[liIndex].FamilyId;
		let famiName = this.famiListBox[liIndex].Name;
		MessageBox.confirm(
			'点击“确定”按钮将解除与贫困户 '+ famiName +' 一家（编号：'+ famiNum +'）的帮扶关系，点击“取消”按钮可取消操作。',
			'确定解除'
			).then(action => {
			this.RemovePoorLeaderRelation( liIndex );
		}).catch(error=>{
			if( error == 'cancel' ){

			}
		});
	},
	//添加帮扶对象
	addPoorFami(){
		this.$router.push({
			name:"unHelpFami",
		})
	},
  }
};
</script>


<style lang="scss" scoped>
.famiListWrap {
	height: auto;
	min-height: 100%;
}
/* 搜索框区域 */
.helpPoorSearch {
	width: 100%;
	height: 88px;
	overflow: hidden;
	box-sizing: border-box;
	padding: 0 30px;
	background: #00ae66;
	position: fixed;
	left: 0;
	top: 0;
	z-index: 3;
	p{
		color: #fff;
		width: 260px;
		height: 88px;
		line-height: 88px;
		margin: 0 auto;
		box-sizing: border-box;
		background: url(../../assets/img/addIcon.png) no-repeat left center;
		background-size: 41px;
		padding-left: 60px;
	}
}
/* 列表区域 */
.famiListBox {
	overflow: scroll;
	// padding-top: 88px;
	position: relative;
	top: 88px;
	left: 0;
	box-sizing: border-box;
	height: calc(100% - 88px);
	ul {
		li {
			background: #fff;
			width: 100%;
			margin-top: 30px;
			margin-bottom: 30px;
			box-sizing: border-box;
			overflow: hidden;
			dl {
				overflow: hidden;
				padding: 30px 40px 10px;
				border-bottom: 1px solid #e5e5e5;
				dd {
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
	}
	.famiListBtn {
		overflow: hidden;
		width: 100%;
		box-sizing: border-box;
		padding: 30px 10px 30px 40px;
		p {
			margin-right: 30px;
			width: calc((100% - 120px) / 4);
			height: 60px;
			line-height: 60px;
			float: right;
			background: #00ae66;
			color: #fff;
			font-size: 28px;
			text-align: center;
			border-radius: 6px;
			box-sizing: border-box;
			&.specialBtn{
				background: #F5A623;
			}
		}
	}
}
.noData {
  text-align: center;
  padding-top: 100px;
}
.popBar {
  height: 80px;
  line-height: 80px;
  overflow: hidden;
  border-bottom: 1px solid #dfdfdf;
  background: #fbf9fe;
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
  i {
    font-style: normal;
  }
  span {
    float: left;
    padding-left: 30px;
    color: #00ae66;
  }
  em {
    float: right;
    padding-right: 30px;
    color: #00ae66;
  }
}
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
      max-width: 90%;
      box-sizing: border-box;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: left;
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
/* picker部分 */
.famiLiPop3Picker{
	overflow: hidden;
}
@-webkit-keyframes moveGo /* Safari 和 Chrome */
{
	from { transform:translateX(0);  }
	to { transform:translateX(-100%);}
}
@keyframes moveGo
{
	from { transform:translateX(0);;  }
	to { transform:translateX(-100%); }
}
@-webkit-keyframes moveCome /* Safari 和 Chrome */
{
	from { transform:translateX(-100%);  }
	to { transform:translateX(-0);  }
}
@keyframes moveCome
{
	from { transform:translateX(-100%);  }
	to { transform:translateX(0); }
}
.searchPicker{
	position: relative;
	width: 100%;
	height: 360px;
	&>div{
		position: absolute;
		left: 0;
		top:0;
		background: #fff;
		&:nth-child(1){
			z-index: 3;
			// background: lightcoral;
		}
		&:nth-child(2){
			z-index: 2;
			// background: yellow;
		}
		&:nth-child(3){
			z-index: 1;
			// background: lightblue;
		}
	}
	.moveGoTo{
		animation: moveGo 0.5s ease 1s 1 normal forwards;
		-webkit-animation:  moveGo 0.5s ease 1s 1 normal forwards;	/* Safari 和 Chrome */
	}
	.moveComeFrom{
		animation: moveCome 0.5s  ease 0s 1 normal forwards;
		-webkit-animation: moveCome 0.5s  ease 0s 1 normal forwards;	/* Safari 和 Chrome */
	}
}
</style>
