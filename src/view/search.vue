<template>
    <div class="search">
		<div style="width:100%;height:100%;background: #EFEFF4;overflow: auto"
			id="AreaVisible"
		>
			<div class="head">

				<input class="short" type="text" v-model="value" placeholder="搜索">
				<img src="../../static/img/searchIcon.png" alt="" class="shortImg">
			</div>
			<div style="background:#fff;overflow: scroll;" id="famiListWrap">
				<mt-cell
					v-show="show"
					v-for="(item,index) in filterResult"
					:key="index">
					<div style="width:100%;text-align:left;color: #666;" @click="itemClick(item)">
						<!--{{item.City}}-{{item.Area}}-{{item.Town}}-{{item.Street}}-{{item.Name}}-->
						<span v-if="item.City">{{item.City}}-</span>
						<span v-if="item.Area">{{item.Area}}-</span>
						<span v-if="item.Town">{{item.Town}}-</span>
						<span v-if="item.Street">{{item.Street}}-</span>
						<span v-if="item.Name">{{item.Name}}</span>
					</div>
				</mt-cell>
			</div>
		</div>
	</div>
</template>

<script>
	import { Indicator } from 'mint-ui';
	import util from '../../src/util/util.js'
	import {
		GetPeopleContactDepartmentList
	} from '../api'
    export default {
        name: "search",
		data(){
        	return{
				OperatorID:'',
				show:true,
        		value:'',
				unitVisible:true,
				filterResult:[],
				// 默认数据
				defaultResult: [

				]
			}
		},
		watch:{
			value:'a'
		},
		computed: {

		},
		mounted(){
			let OperatorID = util.getlocal('OperatorID');
			this.userInfo = OperatorID;
			//新接口都用guid
			this.OperatorID = this.userInfo.PeopleGuid;
			this.fn()
        	var elem=document.getElementsByClassName('short')[0];
        	elem.addEventListener('keyup',this.debounce(this.fn,1000))
		},
		created(){
			util.setlocal('isSearch', 1);
		},

		methods:{

        	//节流阀
			debounce(func, delay) {
				let timer;
				return function(...args) {
					if (timer) {
						clearInterval(timer)
					}
					timer = setTimeout(() => {
						func.apply(this, args)
					}, delay)
				}
			},
			async fn(){
				Indicator.open('加载中...');
				var obj={};
				obj.SearchKey=this.value;
				obj.OrderBy='';
				obj.OperatorGuid=this.OperatorID;
				let result = await GetPeopleContactDepartmentList(obj);
				Indicator.close();
				if(result.data.StatusCode==0){
					this.filterResult=result.data.Data.List
				}
				console.log(result)
				console.log(3333)
			},
			itemClick(item){
				this.value=item;
				this.show=false;
				this.isClick=true;
				this.$parent.value=this.value
				window.history.go(-1);
			},
			a(){
				this.show=true;
				if(this.isClick){
					this.show=false;
					this.isClick=false;
				}

			},
		}
    }
</script>

<style lang="scss" scoped>
	.search{
		height:100%
	}
	#famiListWrap{
		height:calc(100% - 88px)
	}
	.head{
		margin:16px;
		position:relative;
	input{
		border: 1px solid #E6E6EA;
		border-radius: 10px;
		width:100%;
		height:56px;
		text-indent: 350px;
	&::placeholder{
		 font-size: 26px;
		 color: #B2B2B2;
	 }

	}
	.shortImg{
		position:absolute;
		height:25px;
		width:25px;
		top:0;
		bottom:0;
		margin:auto;
		left:315px;
	}

	}
</style>
