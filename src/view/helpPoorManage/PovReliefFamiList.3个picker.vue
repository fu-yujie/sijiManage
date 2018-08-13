<template>
  <div class="famiListWrap" id="famiListWrap">
    <div  class="helpPoorSearch">
      <input type="search" placeholder="请输入姓名、身份证号" v-model="NameOrIDCard" @keyup="keyCodeSear">
      <span @click="searchKey">搜索</span>
    </div>

    <div class="helpPoorSelect">
    	<span > 
			<!-- v-if="addressShow" -->
		  	<!-- {{choosedAreaShow}}  -->
        	<i>当前所选筛选区域：</i>
			{{choosedTownShow}} {{choosedStreetShow}}
      	</span>
      <em @click="openPop">
        筛选
      </em>
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
              </dd>
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
			  <dd>
                <span>
                  健康状态
                </span>
                <em>
                  {{ item.LaborSkills.Health === 0 ?'---':item.Health }}
                </em>
              </dd>
			  <dd>
                <span>
                  劳动能力
                </span>
                <em>
                  {{ item.LaborSkills.length === 0 ?'---':item.LaborSkills }}
                </em>
              </dd>
			  <dd>
                <span>
                  医保状态
                </span>
                <em>
                  {{ item.ParticipateMedicalStr.length === 0 ?'---':item.ParticipateMedicalStr }}
                </em>
              </dd>
            </dl>
            <div class="famiListBtn">
              <p @click="toFamilyMeM(index)">
                家庭成员
              </p>
              <p  @click="toHelpPer(index)">
                帮扶干部
              </p>
              <p @click="building">
                享受政策
              </p>
              <p @click="building">
                扶贫动态
              </p>
            </div>
          </li>
        </ul>
      </mt-loadmore>


      <div class="noData" v-if = "noData">
        暂无数据
      </div>
    </div>

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
			<mt-picker 
				:slots="slots1" 
				@change="onValuesChange1" 
				value-key = "valueKey"
				style="width:100%;"
				id="famiLiPic1"
				v-show="famiLiPic1"
			>
			</mt-picker>

			<mt-picker 
				:slots="slots2" 
				@change="onValuesChange2" 
				value-key = "valueKey"
				style="width:100%;"
				id="famiLiPic2"
				v-show="famiLiPic2"
			>
			</mt-picker>

			<mt-picker 
				:slots="slots3" 
				@change="onValuesChange3" 
				value-key = "valueKey"
				style="width:100%;"
				id="famiLiPic3"
				v-show="famiLiPic3"
			>
			</mt-picker>
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
      popupVisible: false,

      slots1: [
        {
          flex: 1,
          values: [],
          className: "slot1",
          textAlign: "left"
        }
      ],

      slots2: [
        {
          flex: 1,
          values: [],
          className: "slot2",
          textAlign: "left"
        }
      ],

      slots3: [
        {
          flex: 1,
          values: [],
          className: "slot3",
          textAlign: "left"
        }
      ],
      //picker是否显示
      famiLiPic1: true,
      famiLiPic2: true,
      famiLiPic3: true,

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
      curNum: 1,

      //筛选结果显示区域
      addressShow: "",
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

    //脱贫动态areaCode
    let searchFactor = util.getlocal("searchFactor");
    this.areaCode = searchFactor.areaCode;
    this.townCode = searchFactor.townCode;
    this.streetCode = searchFactor.streetCode;
    this.key = searchFactor.searchKey;
    //获取列表信息；
    this.PageIndex = 1;
    this.GetPoorFamilyList();
    //进入页面时候改变高度；
    let winHei = document.body.scrollHeight;
    document.getElementById("famiListWrap").style.height = winHei + "px";
    document.getElementById("app").style.height = "auto";
    document.getElementById("app").style.minHeight = "100%";
    document.getElementsByTagName("body")[0].style.background = "#EFEFF4";

    //获取区域信息
    this.GetPoorFamilyScope();
  },
  beforeDestroy() {
    //离开页面时候改变高度；
    document.getElementById("app").style.height = "";
    document.getElementsByTagName("body")[0].style.background = "";
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {});
    console.log(from);
  },
  methods: {
    //获取列表信息
    async GetPoorFamilyList() {
      Indicator.open();
      let Entity = {
        OperatorID: this.OperatorID,
        PageIndex: this.PageIndex,
        PageSize: this.PageSize,
        Name: "",
        IDCardNumber: "",
        NameOrIDCard: this.NameOrIDCard || this.key,
        TreatmentStatus: 0,
        TreatmentTime: "",
        OrderBy: "",
        AreaCode: this.areaCode ,  //|| this.choosedAreaCode
        TownCode: this.townCode ,  //|| this.choosedTownCode
        StreetCode: this.streetCode, // || this.choosedStreetCode
      };
      try {
        let res = await GetPoorFamilyList(Entity);
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
        name: "PovReliefFamiMem",
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
      this.GetPoorFamilyList();
      this.$refs.loadmore.onTopLoaded();
      this.allLoaded = false;
    },
    //上划
    loadBottom() {
      console.log("底部变化");
      this.PageIndex = this.PageIndex + 1;
      this.GetPoorFamilyList();
      this.$refs.loadmore.onBottomLoaded();
    },
    //sear
    searchKey() {
      this.key = "";
      this.PageIndex = 1;
      this.famiListBox = [];
      this.GetPoorFamilyList();
    },
    //keycode
    keyCodeSear(e) {
      if (e.keyCode === 13) {
        this.PageIndex = 1;
        this.famiListBox = [];
        this.GetPoorFamilyList();
      }
    },
    //功能建设中
    building() {
      Toast({
        message: "功能建设中...",
        time: 500
      });
    },
    //获取区域
    async GetPoorFamilyScope() {
      let Par = {
        OperatorId: this.OperatorID
      };
      try {
        let res = await GetPoorFamilyScope(Par);
        let resBox = res.data.Data;
		console.log(resBox);
		//插一个请选择进去，用于第一次自动加载的change
		// resBox.unshift({
		// 	AreaName: "请选择", AreaCode: "9999", areas: [{
		// 		AreaName: "请选择", AreaCode: "9999",towns: [{
		// 			AreaCode: "9999", AreaName: "请选择"
		// 		}]
		// 	}]
		// });
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
		console.log( this.areaBox )
        let _this = this;
        this.$nextTick(() => {
          //给 选择框 赋值；
          this.slots1[0].values = _this.splitNum(Object.keys(this.areaBox));
        });
      } catch (err) {
        console.log(err);
      } finally {
      }
    },

    //选择条的变化；
    onValuesChange1(picker, values) {
		console.log(picker);
		if (
			picker.getSlotValue(0) !== null &&
			picker.getSlotValue(0) !== undefined
		) {
			//===change的值不为空，也就是非第一次加载；
			if (picker.getSlotValue(0).valueKey.indexOf("请选择") <= -1) {
				//如果不是请选择，就走选择
				// this.famiLiPic1 = false;
				// this.famiLiPic3 = false;
				// this.famiLiPic2 = true;
				$("#famiLiPic1").addClass("moveGoTo");
				$("#famiLiPic1").removeClass("moveComeFrom");
				$("#famiLiPic1").css({
					"animation-delay" : "1s"
				});
				this.tab1text = picker.getSlotValue(0).valueKey;
				this.pick1ValKey = picker.getSlotValue(0).valuePlus;
				this.slots2[0].values = this.splitNum(
					Object.keys(this.areaBox[this.pick1ValKey])
				);
				//cur类名的流转；
				this.curNum = 2;
				this.choosedArea = picker.getSlotValue(0);
				console.log( "非请选择,保存选择的值111：");
				console.log( this.choosedArea );
			} else {
				//如果是  请选择，tab签不变化，同时传  请选择 这个值过来；
				this.tab1text = "区县";
				this.choosedArea = this.slots1[0].values[0];
				this.slots2[0].values = [];
				this.slots3[0].values = [];
				console.log( "请选择，保存请选择/9999code111：");
				console.log( this.choosedArea );
			}
		} else {
				//===第一次加载，没有值，就用默认的第一个值；
				this.choosedArea = this.slots1[0].values[0];
				this.slots2[0].values = [];
				this.slots3[0].values = [];
		}
    },
    onValuesChange2(picker, values) {
		console.log(picker);
		if (
			picker.getSlotValue(0) !== null &&
			picker.getSlotValue(0) !== undefined
		) {
			//===change的值不为空，也就是非第一次加载；
			if (picker.getSlotValue(0).valueKey.indexOf("请选择") <= -1) {
				//如果不是请选择，就走选择
				// this.famiLiPic1 = false;
				// this.famiLiPic2 = false;
				// this.famiLiPic3 = true;
				$("#famiLiPic2").addClass("moveGoTo");
				$("#famiLiPic2").removeClass("moveComeFrom");
				$("#famiLiPic2").css({
					"animation-delay" : "1s"
				});
				this.tab2text = picker.getSlotValue(0).valueKey;
				this.pick2ValKey = picker.getSlotValue(0).valuePlus;
				this.slots3[0].values = this.splitNum(
					this.areaBox[this.pick1ValKey][this.pick2ValKey]
				);
				//cur类名的流转；
				this.curNum = 3;
				this.choosedTown = picker.getSlotValue(0);
				console.log( "非请选择,保存选择的值222：")
				console.log( this.choosedTown)
			} else {
				//如果是请选择，tab签不变化，同时传  请选择 这个值过来；
				this.tab2text = "街道、乡、镇";
				this.choosedTown = this.slots2[0].values[0];
				this.slots3[0].values = [];
				console.log( "请选择，保存请选择/9999code222：" )
				console.log( this.choosedTown )
			}
		} else {
			//===第一次加载，没有值，就用默认的第一个值；
			this.choosedTown = this.slots2[0].values[0];
			this.slots3[0].values = [];
		}
    },
    onValuesChange3(picker, values) {
		console.log(picker);
		if (
			picker.getSlotValue(0) !== null &&
			picker.getSlotValue(0) !== undefined
		) {
			//===change的值不为空，也就是非第一次加载；
			if (picker.getSlotValue(0).valueKey.indexOf("请选择") <= -1) {
				//如果不是请选择，就走选择
				this.tab3text = picker.getSlotValue(0).valueKey;
				this.pick3ValKey = picker.getSlotValue(0).valuePlus;
				//cur类名的流转；
				this.curNum = 3;
				this.choosedStreet = picker.getSlotValue(0);
				console.log( "非请选择,保存选择的值333：" )
				console.log( this.choosedStreet )
			} else {
				//如果是请选择，tab签不变化，同时传  请选择 这个值过来；
				this.tab3text = "村、社区";
				this.choosedStreet = this.slots3[0].values[0];
				console.log( "请选择，保存请选择/9999code333：")
				console.log( this.choosedStreet )
			}
		} else {
				//===第一次加载，没有值，就用默认的第一个值；
				this.choosedStreet = this.slots3[0].values[0];
		}
	},
	
	tabchange1(){
		this.curNum = 1;
		$("#famiLiPic1").removeClass("moveGoTo");
		$("#famiLiPic1").addClass("moveComeFrom");
		$("#famiLiPic2").removeClass("moveGoTo");
	},
	tabchange2(){
		console.log( this.choosedArea.valueKey.indexOf("请选择") )
		if(this.choosedArea.valueKey.indexOf("请选择") > -1){
			Toast({
				message: "请先选择区县",
				time: 500
			});

		}else{
			this.curNum = 2;
			$("#famiLiPic1").removeClass("moveComeFrom");
			$("#famiLiPic1").addClass("moveGoTo");
			$("#famiLiPic2").addClass("moveComeFrom");
			$("#famiLiPic1").css({
				"animation-delay" : "0s"
			});
		}
	},
	tabchange3(){
		if(this.choosedTown.valueKey.indexOf("请选择")> -1){
			Toast({
				message: "请先选择街道、乡、镇",
				time: 500
			});
		}else{
			this.curNum = 3;
			$("#famiLiPic2").addClass("moveGoTo");
			$("#famiLiPic2").removeClass("moveComeFrom");
				$("#famiLiPic2").css({
					"animation-delay" : "0s"
				});
		}
	},
    //打开弹窗
    openPop() {
      this.popupVisible = true;
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
        newArrs.unshift({
			AreaCode: "9999",
			valueKey: "请选择",
			valuePlus: "请选择/9999"
        });
        return newArrs;
      } else {
        return [];
      }
    },
    //地址筛选区域的详细信息是否显示
    addShow() {
      if (
        this.choosedAreaShow !== "" ||
        this.choosedTownShow !== "" ||
        this.choosedStreetShow !== ""
      ) {
        // this.addressShow = true ;
      }
    },
    //弹窗确定选择
    popSure() {
		this.popupVisible = false;
		if( this.choosedArea && this.choosedArea.valueKey.indexOf("请选择")<=-1 ){
			this.choosedAreaCode = this.choosedArea.AreaCode;
			this.choosedAreaShow = this.choosedArea.valueKey;
		}else{
			this.choosedAreaShow = "";
			this.choosedAreaCode = "";
		}
		if( this.choosedTown && this.choosedTown.valueKey.indexOf("请选择")<=-1 ){
			this.choosedTownCode = this.choosedTown.AreaCode;
			this.choosedTownShow = this.choosedTown.valueKey;
		}else{
			this.choosedTownShow = "";
			this.choosedTownCode = "";
		}
		if( this.choosedStreet && this.choosedStreet.valueKey.indexOf("请选择")<=-1  ){
			this.choosedStreetCode = this.choosedStreet.AreaCode;
			this.choosedStreetShow = this.choosedStreet.valueKey;
		}else{
			this.choosedStreetShow = "";
			this.choosedStreetCode = "";
		}
		console.log("this.choosedAreaCode:"+ this.choosedAreaCode)
		console.log("this.choosedTownCode:"+ this.choosedTownCode)
		console.log("this.choosedStreetCode:"+ this.choosedStreetCode)
		console.log("this.choosedAreaShow:"+ this.choosedAreaShow)
		console.log("this.choosedTownShow:"+ this.choosedTownShow)
		console.log("this.choosedStreetShow:"+ this.choosedStreetShow)
		//地址条
		// this.addressShow = true;
		//更新区域code和key值;
		this.areaCode = this.choosedAreaCode;
		this.townCode = this.choosedTownCode;
		this.streetCode = this.choosedStreetCode;

		this.PageIndex = 1;
		this.famiListBox = [];
		this.GetPoorFamilyList();
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
/* 搜索框区域 */
.helpPoorSearch {
  width: 100%;
  height: 88px;
  overflow: hidden;
  box-sizing: border-box;
  padding: 16px 30px;
  background: #00ae66;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 3;
  input {
    float: left;
    width: calc(100% - 102px - 30px);
    height: 56px;
    border: none;
    font-size: 26px;
    box-sizing: border-box;
    padding-left: 52px;
    border-radius: 10px;
    background: url("../../assets/img/searchIcon.png") #009557 no-repeat left
      20px center;
    background-size: 25px;
    color: #fff;
    -webkit-appearance: none;
    &::-webkit-input-placeholder {
      color: rgba(255, 255, 255, 0.6);
      font-size: 26px;
    }
    &::-webkit-search-cancel-button {
      position: relative;
      right: 10px;
      height: 40px;
      width: 40px;
      border-radius: 50%;
      background: url("../../assets/img/icon_cha.png") #009557 no-repeat center
        center;
      background-size: 40px;
      -webkit-appearance: none;
    }
    &::-webkit-search-cancel-button:after {
      position: absolute;
      height: 30px;
      width: 30px;
      left: 0;
      top: 0;
    }
  }
  span {
    width: 102px;
    font-size: 28px;
    float: right;
    color: #fff;
    box-sizing: border-box;
    margin: 8px 0;
    text-align: right;
    padding-right: 10px;
  }
}
/* 筛选区域 */
.helpPoorSelect {
  overflow: hidden;
  width: 100%;
  height: 88px;
  background: #fff;
  position: relative;
  top: 88px;
  left: 0;
  /* display: flex;
  display: -webkit-flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between; */
  overflow: hidden;
  span {
    display: inline-block;
    width: calc(100% - 160px);
    height: 88px;
    line-height: 28px;
    padding-top: 30px;
    box-sizing: border-box;
    background: url(../../assets/img/addressIcon.png) no-repeat left 40px top
      30px;
    background-size: 22px 32px;
    padding-left: 74px;
    font-size: 28px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
	float: left;
	i{
		color: #999;
		font-style: normal;
	}
  }
  em {
    display: inline-block;
    // width: 128px;
    height: 88px;
    line-height: 28px;
    padding-top: 30px;
    box-sizing: border-box;
    background: url(../../assets/img/selectIcon2.png) no-repeat left top 30px;
    background-size: 28px 29px;
    margin-right: 40px;
    font-size: 28px;
    padding-left: 38px;
    // flex-shrink: 0;
    float: right;
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
  height: calc(100% - 88px - 88px);
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
      float: left;
      background: #00ae66;
      color: #fff;
      font-size: 28px;
      text-align: center;
      border-radius: 6px;
      box-sizing: border-box;
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
