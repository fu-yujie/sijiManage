<template>
    <div class="familymember">
        <ul>
            <li class="item" v-for="item in dataList">
                <div class="top">
                    <div class="content"><span class="left">编号</span><span class="right">{{item.HelpLeaderNum.length==0 ? item.HelpLeaderId : item.HelpLeaderNum}}</span></div>
                    <div class="content"><span class="left">姓名</span><span class="right">{{item.Name}}</span></div>
                    <div class="content"><span class="left">单位</span><span class="right">{{item.DepartmentName}}</span></div>
                    <div class="content"><span class="left">职务</span><span class="right">{{item.Job.length==0 ? "--": item.Job}}</span></div>
                    <div class="content"><span class="left">联系电话</span><span class="right">{{item.Phone}}</span></div>
                </div>
                <div class="under">
                    <mt-button type="primary" @click="checkAll" class="mybutton">查看全部帮扶对象</mt-button>
                </div>
            </li>

        </ul>
        <div class="noDate" v-if="!isShow">
            <div>暂无数据</div>
        </div>
    </div>
</template>


<script>
    import { Toast, Indicator } from 'mint-ui'
    import util from '../../../src/util/util.js'
    import {GetPoorFamilyInfoByID} from '../../api'
    export default {
        data(){
            return{
                abc:'123',
                OperatorID:'',
                dataList:[],
                isShow:true
            }
        },
        mounted(){
            let OperatorID = util.getlocal('OperatorID');
            this.OperatorID = OperatorID.PeopleGuid;
            this.GetPoorFamilyInfoByID()
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
					console.log(res)
					Indicator.close();
                    this.dataList=res.data.Data.HelpLeaderList;
                    if(this.dataList.length==0){
                        this.isShow=false
                    }
                }catch (error) {
                    console.log(error);
                }

            },
            checkAll(){
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
                    padding:10px 42px 29px 40px;
                    .content{
                        margin-top:20px;
                        overflow: hidden;
                      /*  display: flex;
                        justify-content: space-between;*/
                        color: #333333;
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
                        // margin-left:30px;
                        font-size:26px;
                        background-color: #00AE66;
						padding:0;
						width:240px;
						height:60px;
                    }
                }


            }
        }
        .noDate{
            text-align:center;
            margin-top:-30px;
            height:100%;
            background:#fff;
            padding-top:60px;
        }
    }
</style>
