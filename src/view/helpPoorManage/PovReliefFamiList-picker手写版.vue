<template>
  <div class="famiListWrap" id="famiListWrap">
	  <input type="button"  @click="openPop"  value="打开弹窗" style="width:100px;height:40px;background:#00ae66;color:#fff;border:none;">
	  <p style="padding:40px 20px;">
		已经选择的值：{{choosedAreaShow}}{{choosedTownShow}}{{choosedStreetShow}}
	  </p>
	<!-- 弹窗，区域选择三级联动 -->
	<mt-popup
		v-model="popupVisible"
		position="bottom" style="width:100%;"
		id="famiLiPop3Picker"
	>
		<p class="popBar">
			<span @click="popCancle">取消</span>
			<i>请选择</i>
			<em @click="popSure">确定</em>
		</p>
		<ul class="searchTab">
			<li v-bind:class="curNum===1?'cur':''"
				@click="tabchange1"
			>
				<span>
					<!-- 区县 -->
					{{tab1text}}
				</span>
			</li>
			<li v-bind:class="curNum===2?'cur':''"
				@click="tabchange2"
			>
				<span>
					<!-- 街道、乡、镇 -->
					{{tab2text}}
				</span>
			</li>
			<li v-bind:class="curNum===3?'cur':''"
				@click="tabchange3"
			>
				<span>
					<!-- 村、社区 -->
					{{tab3text}}
				</span>
			</li>
		</ul>

		<div class="searchPicker">
			<ul id="listArea">
				<li v-for=" (item,index) in slot1 " :key="index" @click="areaCli(index)">
					{{ item.valueKey }}
				</li>
			</ul>
			<ul id="listStreet">
				<li v-for=" (item,index) in slot2 " :key="index" @click="TownCli(index)">
					{{ item.valueKey }}
				</li>
			</ul>
			<ul id="listTown">
				<li v-for=" (item,index) in slot3 " :key="index" @click="streetCli(index)">
					{{ item.valueKey }}
				</li>
			</ul>

		</div>




	</mt-popup>


  </div>
</template>


<script>
import util from "../../../src/util/util.js";
import {
  GetPoorFamilyList, // 获取列表信息
  GetPoorFamilyScope
} from "../../api";
import { Toast, Indicator, Loadmore, Popup, Actionsheet } from "mint-ui";
import { setTimeout } from "timers";

export default {
  data() {
    return {
		//操作人id-要传过去的参数
		OperatorID: "",
		//区域盒子
		areaBox: [],
		popupVisible: true,

		//省市区数据盒子
		slot1: [],
		slot2: [],
		slot3: [],

		//省市区的选中值
		/* 这块儿是中间的文本值 */
		choosedArea: "",
		choosedTown: "",
		choosedStreet: "",
		/* 这块儿是中间的code值 - 可以用来传参 */
		choosedAreaCode: "",
		choosedTownCode: "",
		choosedStreetCode: "",
		/* 这块儿是点击确定以后要传到页面上的值 */
		choosedAreaShow: "",
		choosedTownShow: "",
		choosedStreetShow: "",

		/* tab签的文案显示 */
		tab1text: "区县",
		tab2text: "街道、乡、镇",
		tab3text: "村、社区",

		//picker选到的值，为下个picker的选择做key
		pick1ValKey: "",
		pick2ValKey: "",
		// pick3ValKey:"",

		//判断是否可以打开第二、三个box
		open2box:false,
		open3box:false,

		curNum: 1
    };
  },
  mounted() {
    let OperatorID = util.getlocal("OperatorID");
    this.OperatorID = OperatorID.PeopleGuid;
    //获取区域信息
	this.GetPoorFamilyScope();

  },
  methods: {
    //获取区域
    async GetPoorFamilyScope() {
      let Par = {
        OperatorId: this.OperatorID
      };
      try {
        let res = await GetPoorFamilyScope(Par);
        let resBox = res.data.Data;
        console.log(resBox);
        let alls = {};
        resBox.forEach(itemArea => {
          let itemAreaPlus = itemArea.AreaName + "/" + itemArea.AreaCode;
          alls[itemAreaPlus] = {};
          itemArea.areas.forEach(itemTown => {
            let itemTownPlus = itemTown.AreaName + "/" + itemTown.AreaCode;
            alls[itemAreaPlus][itemTownPlus] = [];
            itemTown.towns.forEach(itemStreet => {
              alls[itemAreaPlus][itemTownPlus].push(
                itemStreet.AreaName + "/" + itemStreet.AreaCode
              );
            });
          });
        });
        this.areaBox = alls;
        console.log(this.areaBox);
        let _this = this;
        this.$nextTick(() => {
          //给 选择框 赋值；
          this.slot1 = _this.splitNum(Object.keys(this.areaBox));
        });
      } catch (err) {
        console.log(err);
      } finally {
      }
    },
	// 区县li的点击事件，获取街道
	areaCli( liIndex ){
		//区县的值，保存；
		this.choosedArea = this.slot1[liIndex];
		this.slot2 = this.splitNum(Object.keys(this.areaBox[this.slot1[liIndex].valuePlus]));
		$("#listArea").addClass("moveGoTo");
		$("#listArea li").eq(liIndex).addClass("cur").siblings("li").removeClass("cur");
		$("#listStreet li").removeClass("cur");
		$("#listTown li").removeClass("cur");
		this.curNum = 2;
		//=============box1的点击事件处理box2、3的显示与否，数据清空======================================
		//可以打开第二个box；
		this.open2box = true;
		//不可以打开第三个box；
		this.open3box = false;
		//清空第三个box
		this.slot3 = [];
		//第二个选中值清空；
		this.choosedTown = {
			AreaCode: "",
			valueKey: "暂无数据",
			valuePlus: ""
		};
		//第三个选中值清空；
		this.choosedStreet = {
			AreaCode: "",
			valueKey: "暂无数据",
			valuePlus: ""
		};
	},
	TownCli( liIndex ){
		//街道的值，保存；
		this.choosedTown = this.slot2[liIndex];
		let judgeVal = this.splitNum(this.areaBox[this.choosedArea.valuePlus][this.slot2[liIndex].valuePlus]);
		if( judgeVal.length >0 ){
			this.slot3 = judgeVal;
		}else{
			this.slot3 = [{
				AreaCode: "",
				valueKey: "暂无数据",
				valuePlus: ""
			}];
		}
		$("#listStreet li").eq(liIndex).addClass("cur").siblings("li").removeClass("cur");
		$("#listStreet").addClass("moveGoTo");
		$("#listTown li").removeClass("cur");
		this.curNum = 3;
		//可以打开第三个box
		this.open3box = true;
	},
	streetCli( liIndex ){
		this.choosedStreet = this.slot3[liIndex];
		$("#listTown li").eq(liIndex).addClass("cur").siblings("li").removeClass("cur");
	},
	listAreaScroll(){
		//获取滚动位置，除以li的高度，获取滚动到那一条了
		let indexComo = 0;
		$("#listArea").scroll(function(){
			let ulScrollY = $("#listArea").scrollTop(); // 当前滚动条位置;
			let indexComo = parseInt(ulScrollY / 40) + 1;
			console.log( indexComo );
			$("#listArea li").eq( parseInt(ulScrollY / 40) ).addClass("cur").siblings("li").removeClass("cur");
		})
	},
    tabchange1() {
      	this.curNum = 1;
		$("#listArea").removeClass("moveGoTo");
		$("#listStreet").removeClass("moveGoTo");
    },
    tabchange2() {
		if(this.open2box===true){
			this.curNum = 2;
			let slot2Len = this.slot2.length;
			if(slot2Len===0){
				this.slot2 = [{
					AreaCode: "",
					valueKey: "暂无数据",
					valuePlus: ""
				}];
			}
			$("#listArea").addClass("moveGoTo");
			$("#listStreet").removeClass("moveGoTo");
		}else{
			Toast({
				message: "请先选择区县",
				time: 500
			});
		}
    },
    tabchange3() {
		if(this.open2box===true){
			this.curNum = 3;
			let slot3Len = this.slot3.length;
			if(slot3Len===0){
				this.slot3 = [{
					AreaCode: "",
					valueKey: "暂无数据",
					valuePlus: ""
				}];
			}
			$("#listStreet").addClass("moveGoTo");
		}else{
			Toast({
				message: "请先选择 街道、乡、镇",
				time: 500
			});
		}

    },
    //打开弹窗
    openPop() {
	  this.popupVisible = true;
	  this.tabchange1();
    },
    //分离区域名称和code
    splitNum(arrs) {
      if (arrs) {
        let arrsLen = arrs.length;
        let newArrs = [];
        arrs.forEach(item => {
          let objs = {
            AreaCode: item.split("/")[1],
            valueKey: item.split("/")[0],
            valuePlus: item
          };
          newArrs.push(objs);
        });
        return newArrs;
      } else {
        return [];
      }
    },
    //弹窗确定选择
    popSure() {

		this.popupVisible = false;

		if( this.choosedArea && this.choosedArea.AreaCode !==""){
			this.choosedAreaCode = this.choosedArea.AreaCode;
			this.choosedAreaShow = this.choosedArea.valueKey;
		}else{
			this.choosedAreaCode = "";
			this.choosedAreaShow = "";
		}
		if( this.choosedTown && this.choosedTown.AreaCode !=="" ){
			this.choosedTownCode = this.choosedTown.AreaCode;
			this.choosedTownShow = this.choosedTown.valueKey;
		}else{
			this.choosedTownCode = "";
			this.choosedTownShow = "";
		}
		if( this.choosedStreet && this.choosedStreet.AreaCode !==""  ){
			this.choosedStreetCode = this.choosedStreet.AreaCode;
       		this.choosedStreetShow = this.choosedStreet.valueKey;
		}else{
			this.choosedStreetCode = "";
       		this.choosedStreetShow = "";
		}
		console.log("this.choosedAreaCode:" + this.choosedAreaCode)
		console.log("this.choosedTownCode:" + this.choosedTownCode)
		console.log("this.choosedStreetCode:" + this.choosedStreetCode)
		console.log( this.choosedArea )
		console.log( this.choosedTown )
		console.log( this.choosedStreet )
    },
    //弹窗取消选择
    popCancle() {
      	this.popupVisible = false;
    }
  }
};
</script>


<style lang="scss" scoped>
	.famiListWrap {
		height: auto;
		min-height: 100%;
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
	.famiLiPop3Picker {
		overflow: hidden;
	}
	.searchPicker {
		position: relative;
		width: 100%;
		height: 360px;
		& > ul {
			position: absolute;
			left: 0;
			top: 0;
			background: #fff;
			width: 100%;
			height: 100%;
			box-sizing: border-box;
			padding: 40px 0;
			overflow-y: auto;
			&:nth-child(1) {
				z-index: 3;
				// background: lightblue;
			}
			&:nth-child(2) {
				z-index: 2;
				// background: lavenderblush;
			}
			&:nth-child(3) {
				z-index: 1;
				// background: lightcyan;
			}
			li{
				box-sizing: border-box;
				padding: 0 40px;
				height: 80px;
				line-height: 80px;
				&.cur{
					color:#00ae66;
					font-size: 36px;
				}
			}
		}
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
	.moveGoTo{
		animation:          moveGo 0.5s ease 0.3s 1 normal forwards;
		-webkit-animation:  moveGo 0.5s ease 0.3s 1 normal forwards;	/* Safari 和 Chrome */
	}
	.moveComeFrom{
		animation:         moveCome 0.5s  ease 0s 1 normal forwards;
		-webkit-animation: moveCome 0.5s  ease 0s 1 normal forwards;	/* Safari 和 Chrome */
	}
</style>
