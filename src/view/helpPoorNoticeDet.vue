<template>
    <div class="helpPoorNoticeArt" v-html="helpPoorCon.InfoContent">
    </div>
</template>

<script>
import {
  	policyGuide //政策指南；
} from "../api.js";
import { Toast, Indicator } from 'mint-ui';
import util from '../util/util';

export default {
	name: "helpPoorNotice",
	data() {
		return {
			//个人id
			OperatorID: "",
			//必传 1政策指南，2常见问题
			ContentTypeVal: 1,
			//InfoTag 默认0为全部 政策指南标签 1就业脱贫、2危房改造脱贫、3教育脱贫、4产业脱贫、5助残脱贫、6社保兜底脱贫、7健康脱贫
			InfoTagVal:0,
			//检索关键字
			KeywordsVal:"",
			//分页页码
			PageIndexVal:1,
			//每页条数
			PageSizeVal:50,
			//总条数
			TotalItemCountVal:"",
			//总页数
			TotalPageCountVal:"",
			//文章内容盒子==========
			helpPoorCon:"",
			//文章id
			articleId:0,
		};
	},
	mounted() {
		let OperatorID = util.getlocal('OperatorID');
		this.OperatorID = OperatorID.OperatorID;
		this.articleId = this.$route.query.id
		this.policyGuide();
	},
	created() {},
	methods: {
		//获取文章列表；
		async policyGuide(){
			Indicator.open();
			let pars = {
				ContentType:this.ContentTypeVal,
				InfoTag:this.InfoTagVal,
				OperatorID:this.OperatorID,
				Keywords:this.KeywordsVal,
				OrderBy:'',
				PageIndex:this.PageIndexVal,
				PageSize:this.PageSizeVal,
				ID:this.articleId,
			}
			try{
				let res = await policyGuide(pars);
				console.log( res );
				let resCode = res.data.StatusCode;
				let resInfo = res.data.Info;
				if(resCode===0){
					this.helpPoorCon = res.data.Data.List[0];
					this.TotalItemCountVal = res.data.Data.TotalItemCount;
					this.TotalPageCountVal = res.data.Data.TotalPageCount;
					
				}else{
					Toast({
						message: resInfo,
						position: 'bottom',
						duration: 5000
					});
				}
			}
			catch(error){
				console.log(error);
			}
			finally{
				Indicator.close();
			}
		},

	}
};
</script>


<style lang="scss" scoped>
	.helpPoorNoticeArt {
		overflow: hidden;
		box-sizing: border-box;
		padding: 60px 30px;
		background: #fff;
		.headers{
			font-size: 44px;
			line-height: 70px;
		}
	}
</style>
