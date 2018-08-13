<template>
    <div id="app">
        <router-view v-wechat-title="$route.meta.title"/>
    </div>
</template>

<script>
export default {
    name: 'App',
    data() {
        return {
        	value:'',
			detailValue:''
		}
    },
    components: {},
    created() {
		//帮扶专栏页面不检测登录
		if( this.$route.name.indexOf("helpPoorNotice") <= -1 ){
			var res = sessionStorage.getItem("OperatorID");
			if(!res){
					this.$router.push({name : "Login"});
					return;
			}
			if(JSON.parse(res).IsActive == 0){
					this.$router.push({name : "ChangePass"});
			}
		}
	},
    mounted() {},
    methods: {}
}
</script>

<style lang="scss">
/* 全局resetCss 重置 */
@import './assets/css/resetCss.css';
@import './assets/css/my-mint.scss';
#app{
    height:100%;
    background: #EFEFF4;
}
html,body{
	width: 100%;
	height: 100%;
	font-family: PingFangSC-Regular;
}
/* 文章页- 政策须知什么的*/
.helpPoorNoticeArt {
	overflow: hidden;
	box-sizing: border-box;
	width: 100%;
	min-height: 100%;
	padding: 60px 30px;
	background: #fff;
	.headers,h3{
		font-size: 44px;
		line-height: 70px;
		font-weight: normal;
		text-align: center;
	}
	h3{
		margin-bottom: 10px;
	}
	span,p{
		font-size: 32px;
		line-height: 64px;
	}
	table{
		width: 100%!important;
		td{
			border:1px solid #d1d1d1!important;
			text-align: center;
		}
	}
}
</style>
