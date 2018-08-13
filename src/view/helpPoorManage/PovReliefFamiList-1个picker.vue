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
        	当前所选筛选区域：{{choosedTownShow}} {{choosedStreetShow}}
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
		id="famiLiPop"
	>
		<p class="popBar">
			<span @click="popCancle">取消</span>
			<i>请选择</i>
			<em @click="popSure">确定</em>
		</p>
		<!-- <ul class="searchTab">
			<li class="cur">
				<span>
					区县
				</span>
			</li>
			<li>
				<span>
					街道、乡、镇
				</span>
			</li>
			<li>
				<span>
					村、社区
				</span>		
			</li>
		</ul> -->
		<mt-picker 
			:slots="slots" 
			@change="onValuesChange" 
			value-key = "valueKey"
			style="width:100%;"
			id="famiLiPic"
		>

		</mt-picker>

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
import { setTimeout } from 'timers';

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
		popupVisible:true,
		slots: [
			{
				flex: 1,
				values: [],
				className: 'slot1',
				textAlign:'left',
			},
			{
				flex: 1.5,
				values: [],
				className: 'slot2',
				textAlign:'left',
			},
			{
				flex: 2.5,
				values: [],
				className: 'slot3',
				textAlign:'left',
			}
		],
		//省市区的选中值
		/* 这块儿是中间的文本值 */
		choosedArea:"",
		choosedTown:"",
		choosedStreet:"",
		/* 这块儿是中间的code值 - 可以用来传参 */
		choosedAreaCode:"",
		choosedTownCode:"",
		choosedStreetCode:"",
		/* 这块儿是点击确定以后要传到页面上的值 */
		choosedAreaShow:"",
		choosedTownShow:"",
		choosedStreetShow:"",
		//筛选结果显示区域
		addressShow:"",
		//从统计页面带过来的值
		areaCode:'',
		townCode:'',
		streetCode:'',
		key:'',
    };
  },
  mounted() {
    let OperatorID = util.getlocal("OperatorID");
    this.OperatorID = OperatorID.OperatorID;
	//脱贫动态areaCode
	this.areaCode=this.$route.query.areaCode;
	this.townCode=this.$route.query.townCode;
	this.streetCode=this.$route.query.streetCode;
	this.key=this.$route.query.searchKey;
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
  beforeRouteEnter (to, from, next) {
	  	next(vm => {
			
		});
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
        NameOrIDCard: this.NameOrIDCard||this.key,
        TreatmentStatus: 0,
        TreatmentTime: "",
		OrderBy: "",
		AreaCode: this.areaCode,
		TownCode: this.townCode,
		StreetCode: this.streetCode,
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
		this.key='';
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
        OperatorId: this.OperatorID,
      };
      try {
		let res = await GetPoorFamilyScope(Par);
		let resBox = res.data.Data;
		// console.log(resBox);
		let alls={};
		resBox.forEach( itemArea =>{
			let itemAreaPlus = itemArea.AreaName + "/" + itemArea.AreaCode;
			alls[itemAreaPlus] = {};
			itemArea.areas.forEach(itemTown=>{
				let itemTownPlus = itemTown.AreaName + "/" + itemTown.AreaCode;
				alls[itemAreaPlus][itemTownPlus] = [];
				itemTown.towns.forEach(itemStreet=>{
					alls[itemAreaPlus][itemTownPlus].push(itemStreet.AreaName+"/"+itemStreet.AreaCode);
				})
			})
		});
		this.areaBox = alls;
		let _this = this;
		this.$nextTick(()=>{
			 //给 选择框 赋值；
			this.slots[0].values = _this.splitNum(Object.keys( this.areaBox ));  
			this.slots[1].values = _this.splitNum(Object.keys( 
										this.areaBox[
											Object.keys(this.areaBox)[0]
										]
									));
			this.slots[2].values = _this.splitNum(this.areaBox[
										Object.keys( this.areaBox )[0]
									]
									[
										Object.keys(this.areaBox[
											Object.keys( this.areaBox )[0]
										])[0]
									]); 
		});
      } catch (err) {
        console.log(err);
      } finally {
      }
    },
	//选择条的变化
	onValuesChange( picker, values ){
		console.log( picker )

		if( picker.getSlotValue(0) !== null &&  
			picker.getSlotValue(0) !== undefined && 
			picker.getSlotValue(1) !== null &&  
			picker.getSlotValue(1) !== undefined &&  
			picker.getSlotValue(2) !== null &&  
			picker.getSlotValue(2) !== undefined
		){
			// let values0Cont = picker.getSlotValue(0).valueKey + "/"+ picker.getSlotValue(0).AreaCode;
			// let values1Cont = picker.getSlotValue(1).valueKey + "/"+ picker.getSlotValue(1).AreaCode;
			let values0Cont = picker.getSlotValue(0).valuePlus;
			let values1Cont = picker.getSlotValue(1).valuePlus;
			// console.log("values0Cont:"+values0Cont)
			// console.log("values1Cont:"+values1Cont)

			this.slots[1].values = this.splitNum( Object.keys(this.areaBox[values0Cont]) );
			this.slots[2].values = this.splitNum( this.areaBox[values0Cont][values1Cont] );

			this.choosedArea = picker.getSlotValue(0);
			this.choosedTown = picker.getSlotValue(1);
			this.choosedStreet = picker.getSlotValue(2);
		}else{
			this.choosedArea = this.slots[0].values[0];
			this.choosedTown = this.slots[1].values[0];
			this.choosedStreet = this.slots[2].values[0];
		}
	},
	//打开弹窗
	openPop(){
		this.popupVisible = true
	},
	//分离区域名称和code
	splitNum( arrs ){
		if(arrs){
			let arrsLen = arrs.length;
			let newArrs = [];
			arrs.forEach(item=>{
				let objs =  {
					AreaCode: item.split("/")[1],
					valueKey: item.split("/")[0],
					valuePlus:item,
				}
				newArrs.push( objs );
			})
			return newArrs;
		}else{
			return [];
		}
	},
	//地址筛选区域的详细信息是否显示
	addShow(){
		if( this.choosedAreaShow!=="" || this.choosedTownShow!=="" || this.choosedStreetShow!==""){
			// this.addressShow = true ;
		}
	},		
	//弹窗确定选择
	popSure(){
		this.choosedAreaShow = this.choosedArea.valueKey;
		this.choosedTownShow = this.choosedTown.valueKey;
		this.choosedStreetShow = this.choosedStreet.valueKey;
		this.choosedAreaCode = this.choosedArea.AreaCode;
		this.choosedTownCode = this.choosedTown.AreaCode;
		this.choosedStreetCode = this.choosedStreet.AreaCode;
		this.popupVisible = false;
		//地址条
		// this.addressShow = true;
		//更新区域code和key值;
		this.areaCode = this.choosedAreaCode;
		this.townCode = this.choosedTownCode;
		this.streetCode = this.choosedStreetCode;
		this.key = "";

		this.PageIndex = 1;
      	this.famiListBox = [];
      	this.GetPoorFamilyList();
	},
	//弹窗取消选择
	popCancle(){
		this.popupVisible = false
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
    background: url(../../assets/img/addressIcon.png) no-repeat left 40px top 30px;
    background-size: 22px 32px;
    padding-left: 74px;
    font-size: 28px;
    text-overflow: ellipsis;
    white-space: nowrap;
	overflow: hidden;
	float: left;

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
.popBar{
	height: 80px;
	line-height: 80px;
	overflow: hidden;
	border-bottom: 1px solid #DFDFDF;
	background: #FBF9FE;
	display: flex;
	display: -webkit-flex;
	justify-content: space-between;
	i{
		font-style: normal;
	}
	span{
		float: left;
		padding-left: 30px;
		color: #00ae66;
	}
	em{
		float: right;
		padding-right: 30px;
		color: #00ae66;
	}
}
.searchTab{
	overflow: hidden;
	display: flex;
	display: -webkit-flex;
	justify-content: space-between;
	li{
		text-align: center;
		padding: 0 30px;
		span{
			display: inline-block;
			height: 60px;
			line-height: 60px;
			padding: 0 30px 0 8px;
		}
		&.cur span{
			border-bottom: 4px solid #00ae66;
		}
	}
}
</style>
