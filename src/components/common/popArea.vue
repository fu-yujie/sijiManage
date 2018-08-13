<template>
	<div class="famiListWrap">
		<!-- {{ areaBoxWrapArea }} -->
		<mt-popup
			v-model="popupVisibleArea"
			position="bottom" style="width:100%;"
			id="famiLiPop3Picker"
		>
			<p class="popBar">
				<span @click="popCancle">取消</span>
				<i>请选择</i>
				<em @click="popSure">确定</em>
			</p>
			<ul class="searchTab">
				<li v-bind:class="curNumArea===1?'cur':''"
					@click="tabchange1"
				>
					<span>
						<!-- 区县 -->
						{{tabtextConArea[0]}}
					</span>
				</li>
				<li v-bind:class="curNumArea===2?'cur':''"
					@click="tabchange2"
				>
					<span>
						<!-- 街道、乡、镇 -->
						{{tabtextConArea[1]}}
					</span>
				</li>
				<li v-bind:class="curNumArea===3?'cur':''"
					@click="tabchange3"
				>
					<span>
						<!-- 村、社区 -->
						{{tabtextConArea[2]}}
					</span>
				</li>
			</ul>
			<div class="searchPicker">
				<ul id="listArea">
					<li v-for=" (item,index) in slot1Area " :key="index" @click="areaCli(index)">
						{{ item.valueKey }}
					</li>
				</ul>
				<ul id="listStreet">
					<li v-for=" (item,index) in slot2Area " :key="index" @click="TownCli(index)">
						{{ item.valueKey }}
					</li>
				</ul>
				<ul id="listTown">
					<li v-for=" (item,index) in slot3Area " :key="index" @click="streetCli(index)">
						{{ item.valueKey }}
					</li>
				</ul>
			</div>
		</mt-popup>
	</div>
</template>

<script>
import { Toast, Indicator, Popup } from "mint-ui";
import { debug } from 'util';
export default {
    name: 'popArea',
	/*
		是否可见、
		class的cur状态、
		tab签盒子、
		slot1、
		slot2、
		slot3、
	*/
	props: [
			'popupVisible',
			'tabtextCon',
			'areaBoxWrap',
			/* 这块儿是中间的code值 - 可以用来传参 */
			'choosedAreaCode',
			'choosedTownCode',
			'choosedStreetCode',
			/* 这块儿是点击确定以后要传到页面上的值 */
			'choosedAreaShow',
			'choosedTownShow',
			'choosedStreetShow'
			],
    data() {
        return {
			//=====props部分======
			//是否显示
			popupVisibleArea: this.popupVisible,
			//tab值文案数组
			tabtextConArea:this.tabtextCon,
			//数据源
			areaBoxWrapArea:this.areaBoxWrap,
			/* 这块儿是中间的code值 - 可以用来传参 */
			choosedAreaCodeArea: this.choosedAreaCode,
			choosedTownCodeArea: this.choosedTownCode,
			choosedStreetCodeArea: this.choosedStreetCode,
			/* 这块儿是点击确定以后要传到页面上的值 */
			choosedAreaShowArea: this.choosedAreaShow,
			choosedTownShowArea: this.choosedTownShow,
			choosedStreetShowArea: this.choosedStreetShow,


			//=====非props部分，子组件自己的值======
			//省市区数据盒子
			slot1Area:[],
			slot2Area:[],
			slot3Area:[],
			//tab 的  cur
			curNumArea:1,
			//ajax获取的数据源，整理以后的值
			areaBox: [],
			//省市区的选中值=========
			/* 这块儿是中间的介质-保存着code和文本 */
			choosedArea: "",
			choosedTown: "",
			choosedStreet: "",


			//判断是否可以打开第二、三个box
			open2box:false,
			open3box:false,
        }
	},
	computed:{
	},
	watch: {
		//新增数据的watch，监听变更并同步到父组件用的数据上
		//弹窗是否显示；
        popupVisible(val) {
            this.popupVisibleArea = val;
		},
		//获取到的数据盒子；
		areaBoxWrap(val){
			this.areaBoxWrapArea = val;
			//数据变化的时候获取一次；
			this.getOrginData();
		},
		choosedAreaShow(val){
			debugger;
			this.choosedAreaShow = val;
		},
    },
    mounted() {
		//刚打开页面的时候获取一次；
		this.getOrginData();
    },
	methods: {
		//获取源数据；
		getOrginData(){
			let alls = {};
			this.areaBoxWrapArea.forEach(itemArea => {
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
				this.slot1Area = _this.splitNum(Object.keys(this.areaBox));
			});
		},
		// 区县li的点击事件，获取街道
		areaCli( liIndex ){
			//区县的值，保存；
			this.choosedArea = this.slot1Area[liIndex];
			this.slot2Area = this.splitNum(Object.keys(this.areaBox[this.slot1Area[liIndex].valuePlus]));
			$("#listArea").addClass("moveGoTo");
			$("#listArea li").eq(liIndex).addClass("cur").siblings("li").removeClass("cur");
			$("#listStreet li").removeClass("cur");
			$("#listTown li").removeClass("cur");
			this.curNumArea = 2;
			//=============box1的点击事件处理box2、3的显示与否，数据清空======================================
			//可以打开第二个box；
			this.open2box = true;
			//不可以打开第三个box；
			this.open3box = false;
			//清空第三个box
			this.slot3Area = [];
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
			this.choosedTown = this.slot2Area[liIndex];
			let judgeVal = this.splitNum(this.areaBox[this.choosedArea.valuePlus][this.slot2Area[liIndex].valuePlus]);
			if( judgeVal.length >0 ){
				this.slot3Area = judgeVal;
			}else{
				this.slot3Area = [{
					AreaCode: "",
					valueKey: "暂无数据",
					valuePlus: ""
				}];
			}
			$("#listStreet li").eq(liIndex).addClass("cur").siblings("li").removeClass("cur");
			$("#listStreet").addClass("moveGoTo");
			$("#listTown li").removeClass("cur");
			this.curNumArea = 3;
			//可以打开第三个box
			this.open3box = true;
		},
		streetCli( liIndex ){
			this.choosedStreet = this.slot3Area[liIndex];
			$("#listTown li").eq(liIndex).addClass("cur").siblings("li").removeClass("cur");
		},
		tabchange1() {
			this.curNumArea = 1;
			$("#listArea").removeClass("moveGoTo");
			$("#listStreet").removeClass("moveGoTo");
		},
		tabchange2() {
			if(this.open2box===true){
				this.curNumArea = 2;
				let slot2Len = this.slot2Area.length;
				if(slot2Len===0){
					this.slot2Area = [{
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
			if(this.open3box===true){
				this.curNumArea = 3;
				let slot3Len = this.slot3Area.length;
				if(slot3Len===0){
					this.slot3Area = [{
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
			this.popupVisibleArea = false
			if( this.choosedArea && this.choosedArea.AreaCode !==""){
				this.choosedAreaCodeArea = this.choosedArea.AreaCode;
				this.choosedAreaShowArea = this.choosedArea.valueKey;
			}else{
				this.choosedAreaCodeArea = "";
				this.choosedAreaShowArea = "";
			}
			if( this.choosedTown && this.choosedTown.AreaCode !=="" ){
				this.choosedTownCodeArea = this.choosedTown.AreaCode;
				this.choosedTownShowArea = this.choosedTown.valueKey;
			}else{
				this.choosedTownCodeArea = "";
				this.choosedTownShowArea = "";
			}
			if( this.choosedStreet && this.choosedStreet.AreaCode !==""  ){
				this.choosedStreetCodeArea = this.choosedStreet.AreaCode;
				this.choosedStreetShowArea = this.choosedStreet.valueKey;
			}else{
				this.choosedStreetCodeArea = "";
				this.choosedStreetShowArea = "";
			}
			console.log("this.choosedAreaCodeArea:" + this.choosedAreaCodeArea)
			console.log("this.choosedTownCodeArea:" + this.choosedTownCodeArea)
			console.log("this.choosedStreetCodeArea:" + this.choosedStreetCodeArea)
			console.log( this.choosedArea )
			console.log( this.choosedTown )
			console.log( this.choosedStreet )
		},
		//弹窗取消选择
		popCancle() {
			this.popupVisibleArea = false
		}
	},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" >
	.famiListWrap {
		height: auto;
		min-height: 100%;
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
	}
	/* 3个picker的改造版本 */
	#famiLiPop3Picker .picker-item.picker-selected{
		font-size: 36px!important;
	}
	#famiLiPop3Picker  .picker-slot-wrapper{
		font-size: 32px!important;
	}
	#famiLiPop3Picker .slot1, #famiLiPop3Picker .slot2, #famiLiPop3Picker .slot3{
		padding-left: 30px;
	}
	#famiLiPop3Picker{
		height: 540px;
	}
</style>
