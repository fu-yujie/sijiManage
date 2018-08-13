<template>
	<div class="messagePerson">
		<div class="NavBar">
			<ul>
				<li class="selected se" @click="panelShow">已读人员</li>
				<li class="de" @click="panelShow1">未读人员</li>
			</ul>
		</div>
		<div class="Content">
		    <ul class="PersonInfo" v-show='isShow'>
		    	<li v-for="item in alRead">
		    		<span>{{item.Name}}</span>
		    		<p>{{item.DepartmentName}}</p>
		    	</li>
		    </ul>
		    <div class="PersonInfo" style="text-align:center" v-if="isShow && alRead.length == 0">
                暂无数据
            </div>
	    	<ul class="PersonInfo" v-show='isEnd'>
		    	<li v-for="item in NoRead">
		    		<span>{{item.Name}}</span>
		    		<p>{{item.DepartmentName}}</p>
		    	</li>
		    </ul>
		    <div class="PersonInfo" style="text-align:center" v-if="isEnd && NoRead.length == 0">
                暂无数据
            </div>
		</div>
	</div>
</template>

<script>
import {GetNoticeReadingList} from '../../api';
import util from '../../util/util';
  export default {
    name: 'messagePerson',
    data () {
      return {
		 selected:'1',
		 isShow: true,
		 isEnd: false,
		 alRead:[],
		 NoRead:[],
		 OperatorID:''
      }
    },
    mounted(){
    	let OperatorID = util.getlocal('OperatorID');
		this.OperatorID = OperatorID.OperatorID;
    	this.GetNoticeReadingList();
    	let num = this.$route.params.num;
		if(num==1){
			this.panelShow();
		}
		if(num==2){
			this.panelShow1();
		}
    },
    methods:{
    	panelShow(){
    		$('.se').addClass('selected').siblings().removeClass('selected');
    		this.isShow = true;
    		this.isEnd = false;
    	},
    	panelShow1(){
    		$('.de').addClass('selected').siblings().removeClass('selected');
    		this.isEnd = true;
    		this.isShow = false;
    	},
    	//查看人员
    	async GetNoticeReadingList(){
    		//已阅读
   			let obj = {};
   			obj.NoticeID = this.$route.params.id;
   			obj.OperatorID = this.OperatorID;
			obj.ReadingType=1;
			let res = await GetNoticeReadingList(obj);
			this.alRead = res.data.Data;
			//未阅读
			let obj2 = {};
   			obj2.NoticeID = this.$route.params.id;
   			obj2.OperatorID = this.OperatorID;
			obj2.ReadingType=2;
			let respon = await GetNoticeReadingList(obj2);
			this.NoRead = respon.data.Data;
   		},
    }
  }
</script>


<style lang="scss" scoped>
.messagePerson{
	width: 100%;
	height: 100%;
	background: #EFEFF4;
	.NavBar{
		width: 100%;
		height: 96px;
		background: #fff;
		ul{
			display: flex;
			li{
				width: 144px;
				line-height: 96px;
				margin-left: 157px;
				text-align: center;
				font-size: 28px;
				color: #353535;
				letter-spacing: 0;
				text-align: center;
			}
		}
		
	}
	.Content{
		margin-top: 30px;
		.PersonInfo{
			width: 100%;
			/*height: 264px;*/
			border-top: 1px solid #EEEEEE;
			/*border-bottom: 1px solid #eee;*/
			background: #fff;
			li{
				display: flex;
				margin-left: 30px;
				padding-top: 22px;
				padding-bottom: 20px;
				border-bottom: 1px solid #eee;
				span{
					font-size: 32px;
					color: #333333;
					padding-right: 50px;
				}
				p{
					font-size: 32px;
					color: #999999;
				}
			}
			/*li:last-child{
				border: none;
			}*/
		}
	}
	.selected{
		color: #00AE66!important;
		border-bottom: 6px solid #00AE66;
	}
}
</style>