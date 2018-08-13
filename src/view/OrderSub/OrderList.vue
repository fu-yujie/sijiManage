<template>
    <div class="orderList">
        <div class="NavBar">
            <ul>
                <li class="selected all" @click="panelShow1" v-if="isHelpLeader">我的工单</li>
                <li class="solved" v-bind:class="isHelpLeader ? '' : 'selected' " @click="panelShow2">未处理</li>
                <li class="handing" @click="panelShow3">处理中</li>
                <li class="close" @click="panelShow4">已关闭/已完成</li>
            </ul>
        </div>
        <div class="Content"  id="Content">
            <div  class="PerMess"
				v-for="(item,index) in items"
				v-if="isAll"
				@click="toDetail(item.Id,item.State)"
				:key="index"
			>
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
                暂无数据{{noPowerMsg}}
            </div>
            <div class="PerMess"
				v-for="(item,index) in items"
				v-if="isSolved"
				@click="toDetail(item.Id,item.State)"
				:key="index"
			>
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
                暂无数据{{noPowerMsg}}
            </div>
            <div class="PerMess"
				v-for="(item,index) in items"
				v-if="isHanding"
				@click="toDetail(item.Id,item.State)"
				:key="index"
			>
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
                暂无数据{{noPowerMsg}}
            </div>
            <div class="PerMess"
				v-for="(item,index) in items"
				v-if="isClose"
				@click="toDetail(item.Id,item.State)"
				:key="index"
			>
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
                暂无数据{{noPowerMsg}}
            </div>
        </div>
    </div>
</template>

<script>
    import { Toast,InfiniteScroll,Indicator} from 'mint-ui'
	import util from '../../../src/util/util.js'
    import {GetWorkOrderList} from '../../api'
import { clearTimeout, setTimeout } from 'timers';
    export default {
        name: 'orderList',
        data () {
            return {
				isHelpLeader:'',
                items:[],
                isAll:true,
                isSolved:false,
                isHanding:false,
                isClose:false,
                page:1,
                pageSize:6,
                state:0,
				OperatorID:'',
				//没有权限的提示语
				noPowerMsg:"",
				//是否启用下次搜索
				scrollState:true,
				//盒子的顶部移动
				domScrollTop:0,
				//盒子的滚动高度
				domScrollHei:0,
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
			this.page=1;
            this.getList( ()=>{
				_this.scrollState = true;
			} );
			//获取滚动条高度;
			let _this = this;
			let ContentDom = document.getElementById("Content");
			let domClientHei = ContentDom.clientHeight;
			this.scrollState = true;
			ContentDom.addEventListener("scroll",function scrollThing(){
					_this.domScrollTop = ContentDom.scrollTop;
					_this.domScrollHei = ContentDom.scrollHeight;
					/*console.log( "domScrollTop :" + _this.domScrollTop );
					console.log( "ContentDom.clientHeight:" + ContentDom.clientHeight );
					console.log( "domScrollHei:" + _this.domScrollHei );*/
					if( _this.domScrollHei === ( _this.domScrollTop + domClientHei) && _this.domScrollTop>0 ){
						console.log("到底了");
						_this.page +=  1;
						if( _this.scrollState ){
							_this.getList( ()=>{
								_this.scrollState = false;
								console.log("列表数据展示完了");
								Toast( "没有更多数据" );
							} );
						}

					}

			});

        },
        created(){
        },
        methods:{
            async getList( cb ){
				Indicator.open();
                var obj={};
                var _this=this;
                obj.OperatorID=this.OperatorID;
                obj.PageSize=this.pageSize;
                obj.PageIndex=this.page;
                obj.State=this.state;
				var res=await GetWorkOrderList(obj);
				Indicator.close();
				console.log(res)
                if(res.data.StatusCode==0){
					let currentPage = res.data.Data.CurrentPageIndex;
					let totalPage = res.data.Data.TotalPageCount;
					if ( res.data.Data.List  ) {
						let listLen =  res.data.Data.List.length;
						console.log( "listLen:" + listLen )
						if( listLen > 0 ){
							console.log("列表数据存在" + listLen);
							res.data.Data.List.forEach(item => {
								_this.items.push( item );
							});
							//到达最后一页；
							console.log( "_this.page:" + _this.page );
							console.log( "totalPage:" + totalPage );
							console.log( "_this.page === totalPage:123" + _this.page == totalPage )
							if(  _this.page === totalPage ){
								cb();
							}
						}else if( currentPage === 1 && listLen===0 ){
							_this.items=[];
						}
					}
                }else{
					_this.items=[];
                    Indicator.close();
					Toast( res.data.Info);
					this.noPowerMsg = ":" + res.data.Info ;
                }
            },
            panelShow1(){
				$("#Content").off('scroll');
				this.items=[];
				this.state=0;
				this.page = 1;
                this.getList( ()=>{
					this.scrollState = false;
				} );
                $('.all').addClass('selected').siblings().removeClass('selected');
                this.isAll = true;
                this.isSolved = false;
                this.isHanding = false;
                this.isClose = false;
            },
            panelShow2(){
				this.items=[];
				this.state=1;
				this.page = 1;
                this.getList( ()=>{
					this.scrollState = false;
				} );
                $('.solved').addClass('selected').siblings().removeClass('selected');
                this.isAll = false;
                this.isSolved = true;
                this.isHanding = false;
                this.isClose = false;
            },
            panelShow3(){
				this.items=[];
				this.state=2;
				this.page = 1;
                this.getList( ()=>{
					this.scrollState = false;
				} );
                $('.handing').addClass('selected').siblings().removeClass('selected');
                this.isAll = false;
                this.isSolved = false;
                this.isHanding = true;
                this.isClose = false;
            },
            panelShow4(){
				this.items=[];
				this.state=3||4;
				this.page = 1;
                this.getList( ()=>{
					this.scrollState = false;
				} );
                $('.close').addClass('selected').siblings().removeClass('selected');
                this.isAll = false;
                this.isSolved = false;
                this.isHanding = false;
                this.isClose = true;
            },
            toDetail(id,state){
                console.log(id);
                this.$router.push({
                    name: 'OrderDetail',
                    params:{id:id,state:state}
                });
            },
			scrollTop(){
				console.log("滚动")
			},


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
