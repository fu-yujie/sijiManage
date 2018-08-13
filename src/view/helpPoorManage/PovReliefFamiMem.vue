<template>
	<div class="familymember">
        <ul>
            <li class="item" v-for="(item,index) in dataList" :key="index">
                <div class="top">
					<div class="content"><span class="left">编号</span><span class="right">{{item.IndividualNum}}</span></div>
					<div class="content"><span class="left">姓名</span><span class="right">{{item.Name}}</span></div>
					<div class="content"><span class="left">年龄</span><span class="right">{{item.Age}}岁</span></div>
					<div class="content"><span class="left">身份证号</span><span class="right">{{item.IDCardNumber}}</span></div>
					<div class="content"><span class="left">地址</span><span class="right">{{item.Address.length===0?'---':item.Address}}</span></div>
					<!--<div class="content"><span class="left">固定电话</span><span class="right">{{item.Telephone}}</span></div>
					<div class="content"><span class="left">手机号码</span><span class="right">{{item.Phone}}</span></div>-->
					<div class="content"><span class="left">联系电话</span><span class="right">{{item.Phone}}</span><span class="right">{{item.Telephone}}</span></div>
					<div class="content"><span class="left">健康状态</span><span class="right">{{item.Health.length === 0 ?'---':item.Health}}</span></div>
					<div class="content"><span class="left">劳动能力</span><span class="right">{{item.LaborSkills.length === 0 ?'---':item.LaborSkills}}</span></div>
					<div class="content"><span class="left">医保状态</span><span class="right">{{item.ParticipateMedicalStr.length === 0 ?'---':item.ParticipateMedicalStr}}</span></div>

				</div>
                <div class="under">

                    <mt-button type="primary" @click="reset(item.Id)" class="mybutton">证件信息</mt-button>
                    <mt-button type="primary" @click="search(item.Id)" class="mybutton">人员照片</mt-button>
					<mt-button type="primary" @click="paySearch(item.IDCardNumber)" class="mybutton mybuttonSearch">医疗费用查询</mt-button>
                    <!-- <mt-button type="primary" @click="stopId" class="mybutton" >医保待遇</mt-button> -->
                </div>
            </li>

        </ul>
        <div class="noDate" v-if="!isShow">
            <div>暂无数据</div>
        </div>
	</div>
</template>


<script>
    import util from '../../../src/util/util.js'
	import {GetPoorFamilyInfoByID} from '../../api'
	import { Toast, Indicator  } from 'mint-ui' ;
export default {
	data(){
		return{
            isShow:true,
			abc:'123',
            OperatorID:'',
            dataList:[]
		}
	},
	mounted(){
        let OperatorID = util.getlocal('OperatorID');
        this.OperatorID = OperatorID.PeopleGuid;
        this.GetPoorFamilyInfoByID();
		document.getElementById("app").style.height = "auto";
		document.getElementById("app").style.minHeight = "100%";
		document.getElementsByTagName("body")[0].style.background = "#EFEFF4";
	},
	beforeDestroy(){
		//离开页面时候改变高度；
		document.getElementById("app").style.height = "";
		document.getElementsByTagName("body")[0].style.background = "";
	},
	methods:{
	    async GetPoorFamilyInfoByID(){
			Indicator.open();
	        var obj={};
	        obj.OperatorID=this.OperatorID;
	        obj.FamilyId=this.$route.query.FamilyId;
            try{
				let res=await GetPoorFamilyInfoByID(obj);
				Indicator.close();
	            this.dataList=res.data.Data.PoorPeopleList;
	            if(this.dataList.length==0){
	                this.isShow=false
                }
            }catch (error) {
                console.log(error);
            }

        },
        //信息修改
        reset(id){
           /* let info = Toast({
                message: "功能建设中...",
                iconClass: ''
            });
            setTimeout(() => {
                info.close();
            }, 1000);*/


			this.$router.push({
				name: "paperworkInfo",
				query: {
					id:id
				}
			});

        },
        //人员照片
        search(id){

			this.$router.push({
				name: "memPicture",
				query: {
					id:id
				}
			});
            /*let info = Toast({
                message: "功能建设中...",
                iconClass: ''
            });
            setTimeout(() => {
                info.close();
            }, 1000);*/
        },
		//医疗费用查询
		paySearch(id){
			this.$router.push({
				name: "paysearchList",
				query: {
					id:id
				}
			});
		},
        //终止身份
        stopId(){
            let info = Toast({
                message: "功能建设中...",
                iconClass: ''
            });
            setTimeout(() => {
                info.close();
            }, 1000);
        }

	},

}
</script>


<style lang="scss" scoped>
.familymember{
    box-sizing: border-box;
    height:100%;
    background: #EFEFF4;
    padding-top:30px;
    ul{
        .item{
            background:#fff;
            margin-bottom:30px;
            .top{
                padding:30px 40px;
                .content{
                    overflow: hidden;
                   /* display: flex;
                    justify-content: space-between;*/
                    color: #333333;
					margin-bottom: 20px;
					&:last-child{
						margin-bottom: 0;
					}
                    span{
                        font-family: PingFangSC-Regular;
                        font-size: 28px;
                        color: #888888;
                        line-height: 42px;
                    }
                    .left{
                        float:left;
                    }
                    .right{
                        color: #333333;
                        text-align:right;
                        float:right;
                        width: calc( 100% - 190px )
                    }
                }
            }
            .under{
                text-align:right;
                padding:30px 40px;
                border-top:1px solid #E5E5E5;
                .mybutton{
                    padding:0;
                    margin-left:30px;
                    font-size:26px;
                    background-color: #00AE66;
                    width:145px;
                    height:60px;
                }
				.mybuttonSearch{
					width:195px;

				}
            }


        }
    }
    .noDate{
        box-sizing: border-box;
        text-align:center;
        margin-top:-30px;
        height:100%;
        background:#fff;
        padding-top:60px;
    }
}
</style>
