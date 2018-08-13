<template>
	<div>
		<popArea
			:popupVisible = 'popupVisible'
			:tabtextCon = 'tabtextCon'
			:areaBoxWrap = 'areaBoxWrap'
			:choosedAreaCode = 'choosedAreaCode'
			:choosedTownCode = 'choosedTownCode'
			:choosedStreetCode = 'choosedStreetCode'
			:choosedAreaShow = 'choosedAreaShow'
			:choosedTownShow = 'choosedTownShow'
			:choosedStreetShow = 'choosedStreetShow'
			ref = 'popAreaData'
		></popArea>

		{{choosedAreaShow}}{{choosedTownShow}}{{choosedStreetShow}}

		<input type="button" value="点击出现弹窗"  @click="openPop"/>

	</div>
</template>


<script>
import { Toast, Indicator, Loadmore, Popup, Actionsheet } from "mint-ui";
import util from "../../src/util/util.js";
import popArea from "../components/common/popArea";
import {
  	GetPoorFamilyScope, // 获取区域信息
} from "../api";
import { setTimeout } from 'timers';

export default {
	data(){
		return{
			/* ===组件需要的props======================= */
			popupVisible: false,
			/* tab签的文案显示 */
			tabtextCon:["区县", "街道、乡、镇", "村、社区"],
			/* 数据源获取 */
			areaBoxWrap:[],
			choosedAreaCode:"",
			choosedTownCode:"",
			choosedStreetCode:"",
			choosedAreaShow:"",
			choosedTownShow:"",
			choosedStreetShow:"",
			/* ===组件需要的props======================= */

			//api请求时候要加的参数===跟组件无关
			OperatorID:"",
			PageIndex: 1,
			PageSize: 10,
			NameOrIDCard: "",
			allPage: "",
			areaBox:[],
		}
	},
	components:{
		popArea : popArea
	},
	methods:{
		//打开弹窗
		openPop(){
			this.popupVisible = true
		},
		//获取区域
		async GetPoorFamilyScope() {
			let Par = {
				OperatorId: this.OperatorID
			};
			try {
				let res = await GetPoorFamilyScope(Par);
				this.areaBoxWrap = res.data.Data;
				console.log( this.areaBoxWrap );

			} catch (err) {
				console.log(err);
			} finally {
			}
		},
	},
	mounted(){
		let OperatorID = util.getlocal("OperatorID");
		this.OperatorID = OperatorID.PeopleGuid;
		this.$nextTick(()=>{
			this.GetPoorFamilyScope();
		});
	},
	// watch:{
	// 	//获取到的数据盒子；
	// 	areaBoxWrap(val){
	// 		this.areaBoxWrap = val;
	// 	},
	// },
}
</script>


<style lang="scss">

</style>
