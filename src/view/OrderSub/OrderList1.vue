<template>
    <div class="orderList">
        <div class="NavBar">
            <ul>
                <li class="selected all" @click="panelShow1">我的工单</li>
                <li class="solved" @click="panelShow2">未处理</li>
                <li class="handing" @click="panelShow3">处理中</li>
                <li class="close" @click="panelShow4">已关闭/已完成</li>
            </ul>
        </div>
        <div class="Content">
            <div  class="PerMess" v-for="item in items" v-if="isAll" @click="toDetail(item.Id,item.State)">
                <div class="CityOrder" >
                    <h5>{{item.DepartmentName}}</h5>
                    <div v-if="item.State==1" style="color: #F5A623;" class="status">{{item.State | State}}</div>
                    <div v-if="item.State==2" class="status">{{item.State | State}}</div>
                    <div v-if="item.State==3" style="color:#00AE66;;" class="status">{{item.State | State}}</div>
                    <div v-if="item.State==4" style="color:#D0021B;" class="status">{{item.State | State}}</div>
                </div>
                <div class="time">
                    <p>{{item.CreateDate}}</p>
                </div>
                <p class="title">标题：<span style="word-wrap: break-word;">{{item.Title}}</span></p>
            </div>
            <div class="PerMess" style="text-align:center" v-if="isAll && items.length == 0">
                暂无数据
            </div>
            <div class="PerMess" v-for="item in items" v-if="isSolved" @click="toDetail(item.Id,item.State)">
                <div class="CityOrder" >
                    <h5>{{item.DepartmentName}}</h5>
                    <div class="status" style="color: #F5A623;">{{item.State | State }}</div>
                </div>
                <div class="time">
                    <p>{{item.CreateDate}}</p>
                </div>
                <p class="title">标题：{{item.Title}}</p>
            </div>
            <div class="PerMess" style="text-align:center" v-if="isSolved && items.length == 0">
                暂无数据：{{noPowerMsg}}
            </div>
            <div class="PerMess" v-for="item in items" v-if="isHanding" @click="toDetail(item.Id,item.State)">
                <div class="CityOrder" >
                    <h5>{{item.DepartmentName}}</h5>
                    <div class="status" style="color: #4A90E2;">{{item.State | State}}</div>
                </div>
                <div class="time">
                    <p>{{item.CreateDate}}</p>
                </div>
                <p class="title">标题：{{item.Title}}</p>
            </div>
            <div class="PerMess" style="text-align:center" v-if="isHanding && items.length == 0">
                暂无数据：{{noPowerMsg}}
            </div>
            <div class="PerMess" v-for="item in items" v-if="isClose" @click="toDetail(item.Id,item.State)">
                <div class="CityOrder" >
                    <h5>{{item.DepartmentName}}</h5>
                    <div class="status" style="color: #D0021B;">{{item.State | State}}</div>
                </div>
                <div class="time">
                    <p>{{item.CreateDate}}</p>
                </div>
                <p class="title">标题：{{item.Title}}</p>
            </div>
            <div class="PerMess" style="text-align:center" v-if="isClose && items.length == 0">
                暂无数据：{{noPowerMsg}}
            </div>
        </div>
    </div>
</template>

<script>
    import { Toast,InfiniteScroll,Indicator} from 'mint-ui'
    import util from '../../../src/util/util.js'
    import {GetWorkOrderList} from '../../api'
    export default {
        name: 'orderList',
        data () {
            return {
                items:[],
                isAll:true,
                isSolved:false,
                isHanding:false,
                isClose:false,
                page:1,
                pageSize:200,
                state:0,
                OperatorID:'',
                //没有权限的提示语
                noPowerMsg:"",
            }
        },
        mounted(){
            let OperatorID = util.getlocal('OperatorID');
			this.OperatorID = OperatorID.OperatorID;
			//根据是否是帮扶干部，判断请求的值的state值；
			this.isHelpLeader=OperatorID.IsHelpleader;
			if(this.isHelpLeader === 1){
				this.state = 0;
			}else{
				this.state = 1;
			}
            Indicator.open();
            this.getList();
        },
        created(){
        },
        methods:{
            async getList(){
                var obj={};
                var _this=this;
                obj.OperatorID=this.OperatorID;
                obj.PageSize=this.pageSize;
                obj.PageIndex=this.page;
                obj.State=this.state;
                var res=await GetWorkOrderList(obj);
                console.log(res)
                if(res.data.StatusCode==0){
                    Indicator.close();
                    if ( res.data.Data.List ) {
                        console.log("存在")
                        _this.items=[];
                        _this.items = res.data.Data.List;
                        console.log(_this.items);
                    }
                }else{
                    _this.items=[];
                    Indicator.close();
                    Toast( res.data.Info);
                    this.noPowerMsg = res.data.Info ;
                }
            },
            panelShow1(){
                Indicator.open();
                this.state=0;
                this.getList()
                $('.all').addClass('selected').siblings().removeClass('selected');
                this.isAll = true;
                this.isSolved = false;
                this.isHanding = false;
                this.isClose = false;
//              if(this.isAll&&this.items.length == 0) {
//					let instance = Toast({
//						message: '暂无数据',
//						iconClass: ''
//					});
//					setTimeout(() => {
//						instance.close();
//					}, 1000);
//				}

            },
            panelShow2(){
                Indicator.open();
                this.state=1;
                this.getList()
                $('.solved').addClass('selected').siblings().removeClass('selected');
                this.isAll = false;
                this.isSolved = true;
                this.isHanding = false;
                this.isClose = false;
//				if(this.isSolved&&this.items.length == 0) {
//					let instance = Toast({
//						message: '暂无数据',
//						iconClass: ''
//					});
//					setTimeout(() => {
//						instance.close();
//					}, 500);
//				}
            },
            panelShow3(){
                Indicator.open();
                this.state=2;
                this.getList()
                $('.handing').addClass('selected').siblings().removeClass('selected');
                this.isAll = false;
                this.isSolved = false;
                this.isHanding = true;
                this.isClose = false;
//				if(this.isHanding&&this.items.length == 0) {
//					let instance = Toast({
//						message: '暂无数据',
//						iconClass: ''
//					});
//					setTimeout(() => {
//						instance.close();
//					}, 1000);
//				}
            },
            panelShow4(){
                Indicator.open();
                this.state=3||4;
                this.getList()
                $('.close').addClass('selected').siblings().removeClass('selected');
                this.isAll = false;
                this.isSolved = false;
                this.isHanding = false;
                this.isClose = true;
//              if(this.isClose&&this.items.length == 0) {
//              	Indicator.close();
//					let instance = Toast({
//						message: '暂无数据',
//						iconClass: ''
//					});
//					setTimeout(() => {
//						instance.close();
//					}, 500);
//				}
            },
            toDetail(id,state){
                console.log(id);
                this.$router.push({
                    'name': 'OrderDetail',
                    params:{id:id,state:state}
                });
            }

        }
    }
</script>


<style lang="scss" scoped>
    .orderList{
        background: #EFEFF4;
        .NavBar{
            width: 100%;
            height: 96px;
            background: #fff;
            border-bottom:1px solid #E5E5E5;
            ul{
                padding:0 20px;
                display: flex;
                justify-content: space-between;
                li{
                    height: 96px;
                    line-height: 96px;
                    margin-left: 32px;
                    text-align: center;
                    font-size: 28px;
                    color: #353535;
                    letter-spacing: 0;
                }
            }

        }
        .Content{
            margin-top: 30px;
            margin-left: 20px;
            margin-right: 20px;
            height: 1200px;
            overflow-y: scroll;
            .PerMess{
                width: 100%;
                height: 190px;
                background: #FFFFFF;
                box-shadow: 0 2px 4px 0 rgba(0,0,0,0.04);
                border-radius: 8px;
                padding: 30px;
                box-sizing: border-box;
                margin-bottom: 30px;
                .CityOrder{
                    display: flex;
                    justify-content: space-between;
                    h5{
                        font-size: 34px;
                        color: #111111;
                        text-align: left;
                        font-weight: 500;
                    }
                    .status{
                        font-size: 34px;
                        color: #4A90E2;
                    }
                }
                .time{
                    display: flex;
                    justify-content: space-between;
                    height: 37px;
                    p{
                        font-size: 26px;
                        color: #999999;
                    }
                    span{
                        font-size: 28px;
                        color:#2A2A2A;
                        i{
                            font-style: normal;
                            color: #D0021B;
                        }
                    }
                }
                .title{
                    width: 644px;
                    height: 40px;
                    line-height: 40px;
                    font-size: 28px;
                    color: #666666;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                }
            }
        }
    }
    .selected{
        color: #00AE66!important;
        border-bottom: 6px solid #00AE66;
    }
</style>
