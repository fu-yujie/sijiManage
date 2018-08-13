<template>
	<div class="contacts">
		<div class="helpPoorTab">
			<ul>
				<li v-bind:class="curVal === 1 ? 'cur' : '' " v-on:click="tabChange(1)">
					<span>
						扶贫行动负责人
					</span>
				</li>
				<li v-bind:class="curVal === 2 ? 'cur':'' " v-on:click="tabChange(2)">
					<span>
						帮扶干部
					</span>
				</li>
				<li v-bind:class="curVal === 3 ? 'cur':'' " v-on:click="tabChange(3)">
					<span>
						基层干部
					</span>
				</li>
			</ul>
		</div>
		<div v-if="curVal==1" class="head">

			<input class="short" type="text" v-model="SearchKey" placeholder="请输入扶贫领域、单位、姓名">
			<img src="../../static/img/Loupe.png" alt="" class="shortImg">
			<button v-on:click="GetPeopleContactList(1)">搜索</button>
			<span class="selectArea" v-on:click="openSele">{{selectText}} <i id="arr2"></i></span>
		</div>
		<div v-if="curVal==2" class="head">
			<input type="text" class="short" v-model="SearchKey" placeholder="请输入姓名、单位、电话">
			<img src="../../static/img/Loupe.png" alt="" class="shortImg">
			<button v-on:click="GetPeopleContactList(1)">搜索</button>
			<span class="selectArea" v-on:click="openSele">{{selectText}} <i id="arr2"></i></span>
			<!--<span class="selectArea" v-on:click="openPop">地区<i id="arr2"></i></span>-->
		</div>
		<div v-if="curVal==3" class="head">
			<input type="text" class="short" v-model="SearchKey" placeholder="请输入姓名、单位、电话">
			<img src="../../static/img/Loupe.png" alt="" class="shortImg">
			<button v-on:click="GetPeopleContactList(1)">搜索</button>
			<span class="selectArea" v-on:click="openSele">{{selectText}} <i id="arr2"></i></span>
			<!--	<span class="selectArea" v-on:click="openPop">地区<i id="arr2"></i></span>-->
		</div>
		<div v-if="dataList.length > 0" id="content-list" class="content">

			<div v-for="(item,index) in dataList" class="box" :key="index">
				<div class="content-title">
					<h3>{{item.Name}}</h3>
					<div class="rightEdit">
						<div @click="edit(item.Id)" class="edit">
							<img src="../../static/img/edit.png" alt="">
							<span>编辑</span>
						</div>
						<div class="delet" @click="delet(item)">
							<img src="../../static/img/deletIcon.png" alt="">
							<span>删除</span>
						</div>
					</div>
					<span v-if="curVal==1" style="display:block"><span v-if="item.Area.length != 0">{{item.Area}}</span>{{item.Department}} {{item.Job}}</span>
					<span v-if="curVal==2||curVal==3" style="display:block">{{item.Department}} {{item.Job}}</span>
				</div>
				<div class="content-body">
                    <span v-if="curVal==1">
						<span class="body-left" :class="{'isShow':(item.PovertyAlleviation.length===0)}">
						扶贫领域:{{item.PovertyAlleviation}}
					   	</span>
					</span>
					<!--<span class="body-left" v-if="curVal == 1">
                      <span>扶贫领域：</span>
                      {{item.PovertyAlleviation}}
                  </span>-->
					<span class="body-left" v-if="curVal == 2">
                        &nbsp;
                    </span>
					<span class="body-left" v-if="curVal == 3">
                        &nbsp;
                    </span>
					<span class="phone-right">
                        <img src="../../static/img/电话.png" alt="" v-if="item.Phone">
                        <a :href="getPhone(item.Phone)">{{item.Phone}}</a>
                    </span>
				</div>
			</div>
		</div>
		<div v-else id="content-list" class="content">
			<p>
				暂无数据
			</p>
		</div>


		<!-- 区域筛选弹窗 -->
		<!-- 弹窗，区域选择4级联动 -->
		<mt-popup
			v-model="popupVisible"
			position="bottom" style="width:100%;"
			id="famiLiPop3Picker"
			:closeOnClickModal="false"
		>
			<p class="popBar">
				<span @click="popCancle">取消</span>
				<i>请选择</i>
				<em @click="popSure">确定</em>
			</p>
			<ul class="searchTab">
				<!--<li class="tabItem" v-bind:class="curNum===1?'cur':''"-->
				<!--@click="tabchange1"-->
				<!--&gt;-->
				<!--<span>-->
				<!--{{tab1text}}-->
				<!--</span>-->
				<!--</li>-->
				<li v-if="curVal != 1 " class="tabItem" v-bind:class="curNum===2?'cur':''"
					@click="tabchange2"
				>
				<span>
					{{tab2text}}
				</span>
				</li>
				<li v-if="curVal != 1 " v-bind:class="curNum===3?'cur':''"
					@click="tabchange3"
				>
				<span>
					{{tab3text}}
				</span>
				</li>
				<li v-if="curVal != 1 " v-bind:class="curNum===4?'cur':''"
					@click="tabchange4"
				>
				<span>
					{{tab4text}}
				</span>
				</li>
			</ul>

			<div class="searchPicker">
				<!--<ul id="listArea">
					<li v-for=" (item,index) in slot1 " :key="index" @click="areaCli(index)">
						{{ item.valueKey }}
					</li>
				</ul>-->
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
				<ul id="listCountry">
					<li v-for=" (item,index) in slot4 " :key="index" @click="countryCli(index)">
						{{ item.valueKey }}
					</li>
				</ul>
			</div>
		</mt-popup>

		<!-- 弹窗，领域 -->
		<mt-popup
			v-model="AreaVisible"
			position="bottom" style="width:100%;"
			id="AreaVisible"
		>
			<p class="popBar">
				<span @click="AreaCancle">取消</span>
				<i>请选择</i>
				<em @click="AreaSure">确定</em>
			</p>
			<div class="searchPicker">
				<ul id="choseSlotArea">
					<li v-for=" (item,index) in slotArea " :key="index" @click="choseSlotArea(index)">
						{{ item.textV }}
					</li>
				</ul>
			</div>
		</mt-popup>


		<!-- select 选择框 -->
		<div id="selectVisibleWrap" v-show="selectVisible">
			<div id="selectVisible">
				<ul>
					<li @click="closeSele">
						全部
					</li>
					<li v-if="curVal === 1" @click="AreaOpen">
						领域
					</li>
					<li @click="openPop">
						地区
					</li>
				</ul>
			</div>
		</div>
		<!-- select 选择框over -->

		<div @click="addContact"  class="helpPoorSearch">
			<p>
				新建人员
			</p>
		</div>
	</div>
</template>

<script>
	/*import from '../../static/css/my-mint.css'*/
	import util from '../../src/util/util.js'
	import {Toast, Indicator,MessageBox} from 'mint-ui'
	import {
		GetPeopleContactList,
		GetAreaScope,
		GetOrderType, //获取领域
		DeletePeopleContactByID
	} from '../api'
	import {strictEqual} from 'assert';

	export default {
		name: 'contacts',
		data() {
			return {
				level: '',
				SearchKey: '', //关键字搜索
				PageIndex: 1, //当前页面
				dataList: [],//数组
				userInfo: {},
				state: true,
				//cur
				curVal: 1,
				ContentTypeVal: 1,
				//新接口都要用guid的，这个存的guid的值；
				OperatorID: '',
				//=======省市区的data==============
				//区域盒子
				areaBox: [],
				popupVisible: false,

				//省市区数据盒子
				slot1: [],
				slot2: [],
				slot3: [],
				slot4: [],
				//省市区的选中值
				/* 这块儿是中间的文本值 */
				choosedArea: "",
				choosedTown: "",
				choosedStreet: "",
				choosedCountry: "",
				/* 这块儿是中间的code值 - 可以用来传参 */
				choosedAreaCode: "",
				choosedTownCode: "",
				choosedStreetCode: "",
				choosedCountryCode: "",
				/* 这块儿是点击确定以后要传到页面上的值 */
				choosedAreaShow: "",
				choosedTownShow: "",
				choosedStreetShow: "",
				choosedCountryShow: "",
				/* tab签的文案显示 */
				tab1text: "市",
				tab2text: "区/县",
				tab3text: "街道/乡/镇",
				tab4text: "村/社区",
				//picker选到的值，为下个picker的选择做key
				pick1ValKey: "",
				pick2ValKey: "",
				// pick3ValKey:"",

				//判断是否可以打开第二、三个box
				open2box: false,
				open3box: false,
				open4box: false,

				curNum: 1,

				/* 选择框 */
				selectVisible: false,
				/* 扶贫领域编码 */
				PovertyAlleviationCode: "",
				/* 领域列表 */
				PovertyAreaList: [],
				/* 领域盒子 */
				slotArea: [],
				/* 领域弹窗 */
				AreaVisible: false,
				/* selectText */
				selectText: "全部",

			}
		},
		components: {},

		created() {

		},
		mounted() {
			util.setlocal('isSearch',0)
			util.setlocal('inputDetail','');
			let OperatorID = util.getlocal('OperatorID');
			this.userInfo = OperatorID;
			//新接口都用guid
			this.OperatorID = this.userInfo.PeopleGuid;
			this.level = this.userInfo.Level;
			this.GetPeopleContactList(1);
			var contentOne = document.getElementById('content-list');
			contentOne.addEventListener("scroll", () => {
				var scrollheight = contentOne.scrollHeight;
				var clientheight = contentOne.clientHeight;
				var top = contentOne.scrollTop;
				if (scrollheight == (clientheight + top)) {
					if (this.state) {
						this.state = false;
						this.GetPeopleContactList();
					}
				}
			});
			/* 判断登录 */
			/* 获取区域 */
			this.GetAreaScope();
			/* 获取领域 */
			this.GetOrderType();
		},
		/*beforeRouteLeave(to, from, next) {
			// 设置下一个路由的 meta
			to.meta.keepAlive = false; // C 跳转到 A 时让 A 不缓存，即刷新
			next();
		},*/
		methods: {
			//新建联系人
			addContact(){
				this.$router.push('/addContact')
			},
			//编辑
			edit(id){
				this.$router.push({
					name:'addContact',
					query: {
						Id: id,
						isEdit:1
					}
				})
			},
			//删除
			delet(item){
				MessageBox.confirm(
					"<div style='text-align:center'>确定删除该人？</div>",
					' 温馨提示'
				).then(action => {
					this.DeletePeopleContactByID(item.Id)
				}).catch(error=>{
					if( error == 'cancel' ){

					}
				});
			},
			getPhone(phoneNumber) {
				return 'tel:' + phoneNumber;
			},

			//tab切换
			tabChange(val) {
				//切换tab初始筛选弹框样式
				this.selectVisible = false;
				$("#arr2").removeClass("cur");


				this.selectText = "全部";
				this.curVal = val;
				if (val == 2 || val == 3) {
					$('.searchTab li').removeClass('tabItem')
				} else {
					$('.searchTab li').addClass('tabItem')
				}
				this.choosedAreaCode = "";
				this.choosedTownCode = "";
				this.choosedStreetCode = "";
				this.choosedCountryCode = "";
				this.SearchKey = '';
				this.PageIndex = 1;
				this.ContentTypeVal = val;
				util.setlocal("ContentTypeVal", val);
				console.log("this.ContentTypeVal:" + this.ContentTypeVal);

				// 清空选择值
				// $("#listCountry li").removeClass("cur");

				// 清空数据
				this.clearSelectVal();
				this.GetPeopleContactList(1);
			},
			clearSelectVal() {
				this.PovertyAlleviationCode = "";
				//第一个选中值清空；
				this.choosedArea = {
					AreaCode: "",
					valueKey: "暂无数据",
					valuePlus: ""
				};
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
				//第四个选中值清空；
				this.choosedCountry = {
					AreaCode: "",
					valueKey: "暂无数据",
					valuePlus: ""
				};
				//cur初始化
				$("#listArea li").removeClass("cur");
				$("#listStreet li").removeClass("cur");
				$("#listTown li").removeClass("cur");
				$("#listCountry li").removeClass("cur");

			},
			//删除通讯录列表信息
			async DeletePeopleContactByID(id){
				let obj={};
				obj.Id=id;
				obj.OperatorGuid=this.OperatorID;
				let result = await DeletePeopleContactByID(obj);
				console.log(result);
				if(result.data.StatusCode == 0){
					this.GetPeopleContactList(1)
				}
			},
			/**
			 * 获取人员管理列表
			 * @param SearchKey 关键字搜索
			 * @param DepId 部门ID
			 * @param Enabled -1全部 0未启用，1启用
			 * @param PageIndex 页码
			 * @param PageSize 页数
			 * @param OrderBy  排序
			 *
			 * @param OperatorID 操作者ID--------------不要了---------------
			 *
			 * @param Type 1产业负责人 2帮扶负责人  3基层干部
			 * @param PovertyAlleviationCode 扶贫领域编码
			 * @param CityCode 市级编码
			 * @param AreaCode 区县编码
			 * @param TownCode 乡镇编码
			 * @param VillageCode 村编码
			 * @param OperatorGuid 操作者guid
			 */
			async GetPeopleContactList(PageIndex) {
				try {
					if (PageIndex) {
						this.PageIndex = PageIndex;
						document.getElementById('content-list').scrollTop = 0;
						this.state = false;
					}
					Indicator.open();
					let result = await GetPeopleContactList({
						SearchKey: this.SearchKey,
						Enabled: 1,
						PageIndex: this.PageIndex,
						PageSize: 10,
						Type: this.curVal,
						PovertyAlleviationCode: this.PovertyAlleviationCode,
						CityCode: this.choosedAreaCode,
						AreaCode: this.choosedTownCode,
						TownCode: this.choosedStreetCode,
						VillageCode: this.choosedCountryCode,
						OperatorGuid: this.OperatorID
						// OperatorID: this.userInfo.OperatorID
					})
					Indicator.close();
					if (result.data.StatusCode != 0) {
						let info = Toast({message: result.data.Info, iconClass: '', time: 500});
						return;
					}
					if (result.data.Data.List.length == 0) {
						if (PageIndex) {
							this.dataList = result.data.Data.List;
						} else {
							let info = Toast({message: "没有更多数据了", iconClass: '', time: 500});
						}
						return;
					} else {
						this.state = true;
					}
					if (this.PageIndex == 1) {
						this.dataList = result.data.Data.List;
					} else {
						this.dataList = this.dataList.concat(result.data.Data.List);
					}
					this.PageIndex++;
				} catch (error) {
					console.log(error);
				}
			},

			/* 获取领域 */
			async GetOrderType() {
				try {
					let res = await GetOrderType({
						CodeTypes: [
							"EnumGovInfoTag",
						],
						OrderBy: "CodeType"
					});
					this.PovertyAreaList = res.data.Data;
					console.log(this.PovertyAreaList)
					let slotAreaBox = {};
					this.PovertyAreaList.forEach(item => {
						slotAreaBox = {
							codes: item.CodeValue,
							textV: item.Description
						}
						this.slotArea.push(slotAreaBox);
					});
				}
				catch (error) {
					console.log(error)
				}
				finally {
				}
			},

			//===============获取区域的方法集合=============================
			async GetAreaScope() {
				let Par = {
					OperatorId: this.OperatorID
				};
				try {
					let res = await GetAreaScope(Par);
					let resBox = res.data.Data;
					console.log(resBox);
					let alls = {};
					resBox.forEach(itemArea => {
						let itemAreaPlus = itemArea.AreaName + "/" + itemArea.AreaCode;
						alls[itemAreaPlus] = {};
						itemArea.areas.forEach(itemTown => {
							let itemTownPlus = itemTown.AreaName + "/" + itemTown.AreaCode;
							alls[itemAreaPlus][itemTownPlus] = {};
							itemTown.towns.forEach(itemStreet => {
								let itemStreetPlus = itemStreet.AreaName + "/" + itemStreet.AreaCode;
								alls[itemAreaPlus][itemTownPlus][itemStreetPlus] = [];
								itemStreet.villages.forEach(itemCountry => {
									alls[itemAreaPlus][itemTownPlus][itemStreetPlus].push(
										itemCountry.AreaName + "/" + itemCountry.AreaCode
									);
								})
							});
						});
					});
					this.areaBox = alls;
					// console.log(this.areaBox);
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
			// 市li的点击事件，获取街道
			areaCli(liIndex) {
				//市的值，保存；
				this.choosedArea = this.slot1[liIndex];
				this.slot2 = this.splitNum(Object.keys(this.areaBox[this.slot1[liIndex].valuePlus]));
				//市块儿缓离;
				$("#listArea").addClass("moveGoTo");
				$("#listArea li").eq(liIndex).addClass("cur").siblings("li").removeClass("cur");
				//其他块儿初始化
				$("#listStreet li").removeClass("cur");
				$("#listTown li").removeClass("cur");
				$("#listCountry li").removeClass("cur");
				//绿条条选中状态
				this.curNum = 2;
				//=============box1的点击事件处理box2、3的显示与否，数据清空======================================
				//可以打开第二个box；
				this.open2box = true;
				//不可以打开第三个box；
				this.open3box = false;
				//不可以打开第四个box；
				this.open4box = false;
				//清空第三个box
				this.slot3 = [];
				//清空第四个box
				this.slot4 = [];
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
				//第四个选中值清空；
				this.choosedCountry = {
					AreaCode: "",
					valueKey: "暂无数据",
					valuePlus: ""
				};
			},
			TownCli(liIndex) {
				//区县的值，保存；
				this.choosedTown = this.slot2[liIndex];
				console.log(this.choosedTown)
				//市块儿缓离;
				$("#listStreet li").eq(liIndex).addClass("cur").siblings("li").removeClass("cur");
				if ((liIndex != 0 && this.curVal == 2&&this.level==61) || (this.curVal == 3)||(this.level!=61&&this.curVal == 2)) {

					let judgeVal = this.splitNum(Object.keys(this.areaBox[this.choosedArea.valuePlus][this.slot2[liIndex].valuePlus]));
					if (judgeVal.length > 0) {
						this.slot3 = judgeVal;
					} else {
						this.slot3 = [{
							AreaCode: "",
							valueKey: "暂无数据",
							valuePlus: ""
						}];
					}
					;

					$("#listStreet").addClass("moveGoTo");
					//其他块儿初始化
					$("#listTown li").removeClass("cur");
					$("#listCountry li").removeClass("cur");
					//绿条条选中状态
					this.curNum = 3;
					//=============box2的点击事件处理box3、4的显示与否，数据清空======================================
					//可以打开第三个box
					this.open3box = true;

					//不可以打开第四个box
					this.open4box = false;
					//清空第四个box
					this.slot4 = [];
					//第三个选中值清空；
					this.choosedStreet = {
						AreaCode: "",
						valueKey: "暂无数据",
						valuePlus: ""
					};
					//第四个选中值清空；
					this.choosedCountry = {
						AreaCode: "",
						valueKey: "暂无数据",
						valuePlus: ""
					};

				}
			},
			streetCli(liIndex) {
				//街道的值，保存；
				this.choosedStreet = this.slot3[liIndex];
				let judgeVal = this.splitNum(this.areaBox[this.choosedArea.valuePlus][this.choosedTown.valuePlus][this.slot3[liIndex].valuePlus]);
				if (judgeVal.length > 0) {
					this.slot4 = judgeVal;
				} else {
					this.slot4 = [{
						AreaCode: "",
						valueKey: "暂无数据",
						valuePlus: ""
					}];
				}
				;
				//市块儿缓离;
				$("#listTown li").eq(liIndex).addClass("cur").siblings("li").removeClass("cur");
				$("#listTown").addClass("moveGoTo");
				//其他块儿初始化
				$("#listCountry li").removeClass("cur");
				//绿条条选中状态
				this.curNum = 4;
				//=============box3的点击事件处理box4的显示与否，数据清空======================================
				//可以打开第四个box
				this.open4box = true;
				//第四个选中值清空；
				this.choosedCountry = {
					AreaCode: "",
					valueKey: "暂无数据",
					valuePlus: ""
				};
			},
			countryCli(liIndex) {
				this.choosedCountry = this.slot4[liIndex];
				$("#listCountry li").eq(liIndex).addClass("cur").siblings("li").removeClass("cur");
			},
			listAreaScroll() {
				//获取滚动位置，除以li的高度，获取滚动到那一条了
				let indexComo = 0;
				$("#listArea").scroll(function () {
					let ulScrollY = $("#listArea").scrollTop(); // 当前滚动条位置;
					let indexComo = parseInt(ulScrollY / 40) + 1;
					console.log(indexComo);
					$("#listArea li").eq(parseInt(ulScrollY / 40)).addClass("cur").siblings("li").removeClass("cur");
				})
			},
			tabchange1() {
				this.curNum = 1;
				$("#listArea, #listStreet, #listTown, #listCountry").removeClass("moveGoTo");
			},
			tabchange2() {
				/*if (this.open2box === true) {*/
				//因为不显示市级，先获取市级的值
				this.choosedArea = this.slot1[0];
				console.log(222);
				console.log(this.slot1[0]);
				this.slot2 = this.splitNum(Object.keys(this.areaBox[this.slot1[0].valuePlus]));
				if (this.curVal != 3 && this.level == 61) {
					this.slot2.unshift({AreaCode: '61', valueKey: '市本级', valuePlus: "市本级/'61'"})
				}

				console.log(this.slot2);

				this.curNum = 2;
				let slot2Len = this.slot2.length;
				if (slot2Len === 0) {
					this.slot2 = [{
						AreaCode: "",
						valueKey: "暂无数据",
						valuePlus: ""
					}];
				}
				$("#listArea").addClass("moveGoTo");
				$("#listStreet,#listTown,#listCountry").removeClass("moveGoTo");
				/*} else {
					Toast({
						message: "请先选择市",
						time: 500
					});
				}*/
			},
			tabchange3() {
				if (this.choosedTown.AreaCode == '61') {
					Toast({
						message: "请先选择 区/县",
						time: 500
					});
				} else {
					if (this.open3box === true) {
						this.curNum = 3;
						let slot3Len = this.slot3.length;
						if (slot3Len === 0) {
							this.slot3 = [{
								AreaCode: "",
								valueKey: "暂无数据",
								valuePlus: ""
							}];
						}
						$("#listStreet").addClass("moveGoTo");
						$("#listTown,#listCountry").removeClass("moveGoTo");
					} else {
						Toast({
							message: "请先选择 区/县",
							time: 500
						});
					}
				}
			},
			tabchange4() {
				if (this.open4box === true) {
					this.curNum = 4;
					let slot4Len = this.slot4.length;
					if (slot4Len === 0) {
						this.slot4 = [{
							AreaCode: "",
							valueKey: "暂无数据",
							valuePlus: ""
						}];
					}
					$("#listTown").addClass("moveGoTo");
					$("#listCountry").removeClass("moveGoTo");
				} else {
					Toast({
						message: "请先选择 街道/乡/镇",
						time: 500
					});
				}
				;
			},
			//打开弹窗
			openPop() {
				this.popupVisible = true;
				this.tabchange2();
				//关掉select选择框
				this.selectVisible = false;
				this.selectText = "地区";
				$("#arr2").addClass("cur");
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
				if (this.choosedArea && this.choosedArea.AreaCode !== "") {
					this.choosedAreaCode = this.choosedArea.AreaCode;
					this.choosedAreaShow = this.choosedArea.valueKey;

				} else {
					this.choosedAreaCode = "";
					this.choosedAreaShow = "";
				}
				if (this.choosedTown && this.choosedTown.AreaCode !== "") {
					this.choosedTownCode = this.choosedTown.AreaCode;
					this.choosedTownShow = this.choosedTown.valueKey;
				} else {
					this.choosedTownCode = "";
					this.choosedTownShow = "";
				}
				if (this.choosedStreet && this.choosedStreet.AreaCode !== "") {
					this.choosedStreetCode = this.choosedStreet.AreaCode;
					this.choosedStreetShow = this.choosedStreet.valueKey;
				} else {
					this.choosedStreetCode = "";
					this.choosedStreetShow = "";
				}
				if (this.choosedCountry && this.choosedCountry.AreaCode !== "") {
					this.choosedCountryCode = this.choosedCountry.AreaCode;
					this.choosedCountryShow = this.choosedCountry.valueKey;
				} else {
					this.choosedCountryCode = "";
					this.choosedCountryShow = "";
				}
				;
				this.PovertyAlleviationCode = "";
				$("#arr2").removeClass("cur");
				this.GetPeopleContactList(1);

				console.log("this.choosedAreaCode:" + this.choosedAreaCode)
				console.log("this.choosedTownCode:" + this.choosedTownCode)
				console.log("this.choosedStreetCode:" + this.choosedStreetCode)
				console.log("this.choosedCountryCode:" + this.choosedCountryCode)
				// console.log( this.choosedArea )
				// console.log( this.choosedTown )
				// console.log( this.choosedStreet )
				// console.log( this.choosedCountry )
			},
			//弹窗取消选择
			popCancle() {
				this.popupVisible = false;
				$("#arr2").removeClass("cur");
			},
			//===============获取区域的方法集合over=====================


			//筛选框框 开/关
			openSele() {
				this.selectVisible = !this.selectVisible;
				if (this.selectVisible === true) {
					$("#arr2").addClass("cur");
				} else {
					$("#arr2").removeClass("cur");
				}
			},
			//筛选框框关闭===领域和区域 清空
			closeSele() {
				this.selectVisible = false;
				this.PovertyAlleviationCode = "";
				this.choosedAreaCode = "";
				this.choosedTownCode = "";
				this.choosedStreetCode = "";
				this.choosedCountryCode = "";
				$("#arr2").removeClass("cur");
				this.selectText = "全部";
				this.GetPeopleContactList(1);
			},

			/* 领域集合 */
			AreaOpen() {
				this.AreaVisible = true;
				this.selectVisible = false;
				this.selectText = "领域";
				$("#arr2").addClass("cur");
			},
			AreaCancle() {
				this.AreaVisible = false;
				$("#arr2").removeClass("cur");
			},
			AreaSure() {
				this.AreaVisible = false;
				this.choosedAreaCode = "";
				this.choosedTownCode = "";
				this.choosedStreetCode = "";
				this.choosedCountryCode = "";
				$("#arr2").removeClass("cur");
				this.GetPeopleContactList(1);
			},
			choseSlotArea(liIndex) {
				this.PovertyAlleviationCode = this.slotArea[liIndex].codes;
				$("#choseSlotArea li").eq(liIndex).addClass("cur").siblings("li").removeClass("cur");
				console.log(this.slotArea[liIndex].codes)
				console.log(this.slotArea[liIndex])
			}
		}
	}
</script>
<style lang="scss" scoped>
	.isShow {
		color: transparent !important;

	}

	::-webkit-input-placeholder {
		color: #93d1b7;
	}

	:-ms-input-placeholder {
		color: #93d1b7;
	}

	.contacts {
		width: 100%;
		height: 100%;
		background: #efeff4;
		overflow: hidden;
		.helpPoorTab {
			overflow: hidden;
			width: 100%;
			background: #fff;
			left: 0;
			ul {
				overflow: hidden;
				height: 94px;
				li {
					width: calc(100% / 3);
					float: left;
					box-sizing: border-box;
					height: 94px;
					line-height: 94px;
					font-size: 14px;
					text-align: center;
					span {
						color: #333;
						display: inline-block;
						height: 100%;
						box-sizing: border-box;
						padding: 0 14px;
						font-size: 28px;
					}
					&.cur span {
						border-bottom: 3px solid #00ae66;
						color: #00ae66;
					}
				}
			}
		}
		.head {
			background: #00ae66;
			padding: 16px 30px 16px 30px;
			margin-top: 31px;
			position: relative;
			box-sizing: border-box;
			input {
				width: 589px;
				border: 0;
				background: #009557;
				border-radius: 10px;
				height: 56px;
				line-height: 56px;
				font-size: 26px;
				color: #ffffff;
				text-indent: 65px;
			}
			input.short {
				text-indent: 186px;
			}
			img {
				position: absolute;
				left: 50px;
				top: 0;
				bottom: 0;
				margin: auto;
				width: 25px;
				height: 25px;
			}
			img.shortImg {
				left: 181px;
			}
			button {
				position: absolute;
				right: 30px;
				top: 0;
				bottom: 0;
				margin: auto;
				color: #ffffff;
				background: none;
				border: 0;
				font-size: 28px;
				line-height: 40px;
			}
			.selectArea {
				position: absolute;
				left: 30px;
				top: 16px;
				color: #fff;
				font-size: 26px;
				line-height: 56px;
				width: 131px;
				height: 56px;
				box-sizing: border-box;
				border-right: 2px solid #00AE66;
				text-align: right;
				padding-right: 48px;
				i {
					display: block;
					width: 14px;
					height: 8px;
					background: url(../assets/img/arrUp.png) no-repeat center center;
					background-size: 14px;
					position: absolute;
					right: 24px;
					top: 24px;
					transform: rotate(180deg);
				}
				i.cur {
					transform: rotate(0);
				}

			}
		}
		.content {
			margin-top: 119px;
			background: #ffffff;
			position: absolute;
			padding-bottom: 98px;
			top: 94px;
			left: 0;
			right: 0;
			bottom: 0;
			overflow-y: scroll;
			p {
				margin-top: 30px;
				text-align: center;
			}
			.box {
				padding: 30px 0 30px 0px;
				margin-left: 30px;
				border-bottom: 1px solid #eeefee;
				.content-title {
					position:relative;
					h3 {
						font-size: 34px;
						color: #111111;
						line-height: 34px;
						display: inline-block;
						vertical-align: middle;
					}
					.rightEdit{
						position:absolute;
						right:30px;
						top:-10px;
						display: inline-block;
						div{
							width:100px;
							position:relative;
							display: inline-block;
							img{
								position:absolute;
								top:50%;
								transform: translateY(-50%);
								width:30px;
								height:30px;
							}
							span{
								padding:0;
								margin:0;
								position:absolute;
								top:50%;
								left:38px;
								transform: translateY(-50%);
							}
						}
					}
					span {
						/*display: block;*/
						margin-top: 7px;
						font-size: 26px;
						padding-right: 30px;
						vertical-align: middle;
						color: #999999;
					}
					margin-bottom: 30px;
				}
				.content-body {
					.body-left {
						font-size: 28px;
						color: #666666;
						line-height: 28px;
					}
					.phone-right {
						float: right;
						margin-right: 30px;
						img {
							width: 40px;
							height: 40px;
							vertical-align: middle;
						}
						a {
							font-family: arial;
							display: inline-block;
							white-space: nowrap;
							border-collapse: collapse;
							width: 173px;
							text-align: left;
							color: #333333;
							font-size: 28px;
							line-height: 28px;
							vertical-align: middle;
						}
					}
				}
			}
		}
	}

	//区域筛选弹窗样式
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
		.tabItem {
			/*width: 45% !important;*/
			span {
				width: 100%;
				text-align: center;
			}
		}
		li {
			text-align: center;
			width: 33%;
			box-sizing: border-box;
			font-size: 32px;
			span {
				width:100%;
				display: inline-block;
				height: 88px;
				line-height: 88px;
				padding: 0 10px 0 10px;
				float: left;
				max-width: 90%;
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
				width: 33%
			}
			&:nth-child(3) {
				padding: 0 30px 0 0;
				width: 33%
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
			li {
				box-sizing: border-box;
				padding: 0 40px;
				height: 80px;
				line-height: 80px;
				&.cur {
					color: #00ae66;
					font-size: 36px;
				}
			}
		}
	}

	@-webkit-keyframes moveGo /* Safari 和 Chrome */
	{
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(-100%);
		}
	}

	@keyframes moveGo {
		from {
			transform: translateX(0);;
		}
		to {
			transform: translateX(-100%);
		}
	}

	@-webkit-keyframes moveCome /* Safari 和 Chrome */
	{
		from {
			transform: translateX(-100%);
		}
		to {
			transform: translateX(-0);
		}
	}

	@keyframes moveCome {
		from {
			transform: translateX(-100%);
		}
		to {
			transform: translateX(0);
		}
	}

	.moveGoTo {
		animation: moveGo 0.5s ease 0.3s 1 normal forwards;
		-webkit-animation: moveGo 0.5s ease 0.3s 1 normal forwards; /* Safari 和 Chrome */
	}

	/* .moveComeFrom{
		animation:         moveCome 0.5s  ease 0s 1 normal forwards;
		-webkit-animation: moveCome 0.5s  ease 0s 1 normal forwards;
	} */

	#selectVisibleWrap {
		#selectVisible {
			width: 250px;
			position: absolute;
			left: 25px;
			top: 234px;
			transform: translate3d(0, 0, 0);
			box-shadow: 0px 1px 15px #8F8F8F;
			border-radius: 10px;
			z-index: 3;
			background: #fff;
			ul {
				position: relative;
				z-index: 1;
				li {
					width: 100%;
					height: 74px;
					text-align: center;
					line-height: 74px;
					border-bottom: 1px solid #d1d1d1;
					font-size: 28px;
					&:last-child {
						border-bottom: none;
					}
				}
				&::before {
					content: "";
					position: absolute;
					left: 40px;
					top: -10px;
					width: 0;
					height: 0;
					border-left: 14px solid transparent;
					border-right: 14px solid transparent;
					border-bottom: 14px solid #fff;
					filter: drop-shadow(0px -8px 5px #8F8F8F);
					z-index: 3;
				}
			}
		}
	}
	.helpPoorSearch {
		width: 100%;
		height: 88px;
		overflow: hidden;
		box-sizing: border-box;
		padding: 0 30px;
		background: #00ae66;
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 3;
		p{
			color: #fff;
			width: 260px;
			height: 88px;
			line-height: 88px;
			margin: 0 auto;
			box-sizing: border-box;
			background: url(../assets/img/addIcon.png) no-repeat left center;
			background-size: 41px;
			padding-left: 60px;
		}
	}

</style>
