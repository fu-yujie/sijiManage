<template>
	<div class="messageDetail">
		<div class="Box1">
			<h5>{{data.Title}}</h5>
			<p>{{data.CreateDate}}</p>
			<div class="text">
				{{data.Content}}
			</div>
			<img class='imgArea' v-for="(item,index) in data.ImageData" :key='index' :src="item.ImageContent"/>
		</div>
		<div class="attachment">
			<div class="file" v-if='hasFileUrl'>
				<img src="../../../static/img/附件.png" />
				<p>查看附件</p>
			</div>
			<ul>
				<li v-for="(item,index) in data.UploadList">
                    <a :href="item.FileUrl"><img src="../../../static/img/默认附件.png" /></a>
					<p>{{item.FileName}}</p>
				</li>
				<!--<li>
					<img src="../../../static/img/默认附件.png" />
					<p>附件二</p>
				</li>-->
			</ul>
		</div>
	</div>
</template>

<script>
import {GetNoticeInfoByID} from '../../api';
import util from '../../util/util';
import { Toast ,Indicator} from 'mint-ui';
  export default {
    name: 'messageDetail',
    data () {
      return {
		  data:[],
		  OperatorID:'',
		  hasFileUrl:false
      }
    },
    mounted(){
    	let OperatorID = util.getlocal('OperatorID');
		this.OperatorID = OperatorID.OperatorID;
		this.GetNoticeInfoByID();
		Indicator.open();
    },
    methods:{
    	//通知详情数据
 		async GetNoticeInfoByID(){
   			let object = {};
   			object.NoticeID = this.$route.params.id;
   			object.OperatorID = this.OperatorID;
   			let res = await GetNoticeInfoByID(object);
   			this.data = res.data.Data;
   			Indicator.close();
			if(this.data.UploadList.length){
            	this.hasFileUrl = true;
            }
   		},
        async UploadNoticeFiles(){
            let object = {};
            object.NoticeID = this.$route.params.id;
            object.OperatorID = this.OperatorID;
            let res = await UploadNoticeFiles(object);
            this.data = res.data.Data;
            console.log(this.data);
        },
    }
  }
</script>


<style lang="scss" scoped>
.messageDetail{
	width: 100%;
	height: 100%;
	background: #EFEFF4;
	.Box1{
		width: 100%;
		/*height: 902px;*/
		background: #fff;
		padding-top: 20px;
		padding-left: 30px;
		padding-right:0px;
		box-sizing: border-box;
		h5{
            word-wrap: break-word;
			font-size: 32px;
			color: #333333;
			font-weight: 550;
		}
		p{
			font-size: 26px;
			color: #999999;
			margin-top: 9px;
			padding-bottom: 22px;
			border-bottom: 1px solid #E5E5E5;
		}
		.imgArea{
			display:block;
			width: 100%;
			padding-right: 30px;
			margin-top: 20px;
			box-sizing: border-box;
		}
		.text{
            word-wrap: break-word;
			font-size: 28px;
			color: #333333;
			letter-spacing: 0;
			line-height: 42px;
			box-sizing: border-box;
			padding-top: 20px;
			/*padding-bottom: 37px;*/
		}
	}
	.attachment{
		background: #fff;
		margin-top: 30px;
		.file{
			margin-left: 30px;
			border-bottom: 1px solid #E5E5E5;
			display: flex;
			padding-top: 24px;
			padding-bottom: 20px;
			img{
				width: 48px;
				height: 42px;
				margin-right: 12px;
			}
		}
		ul{
			display: flex;
			margin-left: 33px;
			li{
                text-align:center;
				padding-top:31px;
				padding-left: 66px;
				img{
					width: 94px;
					height: 90px;
				}
				p{
                    word-break:break-all;
                    width:110px;
					font-size: 28px;
					color: #333333;
				}
			}
		}
	}
}
</style>
