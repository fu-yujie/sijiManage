<template>
    <div class="messageList">
        <div class="NavBar">
            <ul>
                <li class="selected se" @click="panelShow">我收到的</li>
                <li class="si" @click="panelShow1">已阅读</li>
                <li class="de" @click="panelShow2">未阅读</li>
            </ul>
        </div>
       	<div id="content-list" class="Content">
            <div id="content-list-one" class="PerMess" v-show="isAll" >
            	<div class="perSec" v-if="all.length > 0" v-for="(item,index) in all" :key="index" @click.stop="ToMessDetail(item)" >
	            	<div class="CityOrder">
	                    <h5>{{item.DepartmentName}}</h5>
	                </div>
	                <div class="time">
	                    <p>{{item.CreateDate}}</p>
	                </div>
	                <p>标题：{{item.Title}}</p>
            	</div>
            	<div class="perSec" style="text-align:center"  v-if="isAll && all.length == 0">暂无数据</div>
            </div>
            <div id="content-list-tow" class="PerMess"  v-show="isShow" >
	            <div class="perSec" v-if="alRead.length > 0" v-for="(item,index) in alRead" :key="index" @click.stop="ToMessDetail(item)">
	                <div class="CityOrder">
	                    <h5>{{item.DepartmentName}}</h5>
	                </div>
	                <div class="time">
	                    <p>{{item.CreateDate}}</p>
	                </div>
	                <p>标题：{{item.Title}}</p>
	            </div>
	            <div class="perSec" style="text-align:center" v-if="isShow && alRead.length == 0">
	                暂无数据
	            </div>
            </div>
            <div id="content-list-three" class="PerMess"  v-show="isEnd" >
	            <div class="perSec" v-for="(item,index) in NoRead" :key="index" @click.stop="ToMessDetail(item)">
	                <div class="CityOrder">
	                    <h5>{{item.DepartmentName}}</h5>
	                </div>
	                <div class="time">
	                    <p>{{item.CreateDate}}</p>
	                </div>
	                <p>标题：{{item.Title}}</p>
	            </div>
	            <div class="perSec" style="text-align:center" v-if="isEnd && NoRead.length == 0">
	                暂无数据
	            </div>
	        </div>
        </div>
    </div>
</template>

<script>
import { GetNoticeList } from '../../api';
import { Toast, Indicator } from 'mint-ui';
import { InfiniteScroll } from 'mint-ui';
import util from '../../util/util';
import { setTimeout } from 'timers';
export default {
    name: 'messageList',
    data() {
        return {
            selected: '1',
            isShow: false,
            isEnd: false,
            isAll: true,
            alRead: [],
            NoRead: [],
            all: [],
            OperatorID: '',
            unReadError : "",
            readError: "",
            allError: "",
            allLoaded: false,
            count: 1,
            count1: 1,
            count2: 1
        }
    },
    mounted() {

        let OperatorID = util.getlocal('OperatorID');
        this.OperatorID = OperatorID.OperatorID;
        this.GetNoticeList();

        var contentOne = document.getElementById('content-list-one');
        var contentTow = document.getElementById('content-list-tow');
        var contentThree = document.getElementById('content-list-three');
        var state = true;
        var state2 = true;
        var state3= true;

        contentOne.addEventListener("scroll", () => {
                var scrollheight = contentOne.scrollHeight;
                var clientheight = contentOne.clientHeight;
                var top = contentOne.scrollTop;
                if (scrollheight == ( clientheight + top)) {
                    if (state) {
                        state = false;
                        console.log(1)
                        this.loadTop(function(e){
                            state = true;
                        })
                    }
                }
        });
        contentTow.addEventListener("scroll", () => {
           	var scrollheight = contentTow.scrollHeight;
            var clientheight = contentTow.clientHeight;
            var top = contentTow.scrollTop;
            if (scrollheight == ( clientheight + top)) {
                if (state2) {
                    state2 = false;
                    console.log(2)
                    this.loadTop1(function(e){
                        state2 = true;
                    })
                }
            }
        });

         contentThree.addEventListener("scroll", () => {
           	var scrollheight = contentThree.scrollHeight;
            var clientheight = contentThree.clientHeight;
            var top = contentThree.scrollTop;
            if (scrollheight == ( clientheight + top)) {
                if (state3) {
                    state3 = false;
                    this.loadTop2(function(e){
                        state3 = true;
                    })
                }
            }
        });

    },
    created(){
	},
	beforeRouteEnter (to, from, next) {
		let fromName = from.name;
		console.log("fromName:"+fromName);
		next(vm => {
			console.log( from )
			if(fromName!==null){
				if(fromName.indexOf("MessageDetail")>-1){
					vm.judgeShowMsg();
				}
			}
		})
	},
    methods: {
        panelShow() {
			$('.se').addClass('selected').siblings().removeClass('selected');
			//根据列表切换值来储存当前所在tab位置；
			util.setlocal("tabIndex","panelShow");
            this.isShow = false;
            this.isEnd = false;
            this.isAll = true;
            /*if(this.allError != ""){
                let instance = Toast({
                    message: this.allError,
                    iconClass: ''
                });
                setTimeout(() => {
                    instance.close();
                }, 1000);
            }*/
        },
        panelShow1() {
        	let t = this;
			$('.si').addClass('selected').siblings().removeClass('selected');
			//根据列表切换值来储存当前所在tab位置；
			util.setlocal("tabIndex","panelShow1");
            this.isShow = true;
            this.isEnd = false;
            this.isAll = false;
            if(this.readError != ""){
                let instance = Toast({
                    message: this.readError,
                    iconClass: ''
                });
                setTimeout(() => {
                    instance.close();
                }, 1000);
            }

        },
        panelShow2() {
			$('.de').addClass('selected').siblings().removeClass('selected');
			//根据列表切换值来储存当前所在tab位置；
			util.setlocal("tabIndex","panelShow2");
            this.isShow = false;
            this.isEnd = true;
            this.isAll = false;
            if(this.unReadError != ""){
                let instance = Toast({
                    message: this.unReadError,
                    iconClass: ''
                });
                setTimeout(() => {
                    instance.close();
                }, 1000);
            }
		},
		judgeShowMsg(){
			let mesSign = util.getlocal("tabIndex");
			console.log("mesSign:"+mesSign);
			if(mesSign !==''){
				if( mesSign.indexOf("panelShow")>-1 ){
					this.panelShow();
					console.log("panelShow");
				}
				if( mesSign.indexOf("panelShow1")>-1 ){
					this.panelShow1();
					console.log("panelShow1");
				}
				if( mesSign.indexOf("panelShow2")>-1 ){
					this.panelShow2();
					console.log("panelShow2");
				}
			}else{
				this.panelShow();
			}
		},
        ToMessDetail(item) {
            this.$router.push({
                'name': 'MessageDetail',
                params: {
                    id: item.Id,
                }
            });
        },
        //获取通知列表
        async GetNoticeList(PageIndex) {
            if(PageIndex){
                this.PageIndex = PageIndex;
                document.getElementById('content-list').scrollTop = 0;
                this.state = false;
            }
            Indicator.open();
            //全部
            let obj = {};
            obj.OperatorID = this.OperatorID;
            obj.PageIndex = this.count;
            obj.PageSize = 10;
            obj.KeyWord = '';
            obj.OperatorType = 3;
            obj.OrderBy = '';
            let res = await GetNoticeList(obj);
//          console.log(res)
            Indicator.close();
            if (res.data.StatusCode != 0) {
                let instance = Toast({
                    message: res.data.Info+'all',
                    iconClass: ''
                });
                setTimeout(() => {
                    instance.close();
                }, 500);
                /*this.allError = res.data.Info;*/
            }
            this.all = res.data.Data.List;

            //已阅读
            let obj1 = {};
            obj1.OperatorID = this.OperatorID;
            obj1.PageIndex = this.count1;
            obj1.PageSize = 10;
            obj1.KeyWord = '';
            obj1.OperatorType = 2;
            obj1.OrderBy = '';
            let response = await GetNoticeList(obj1);
            if (response.data.StatusCode != 0) {
                /*let instance = Toast({
                    message: response.data.Info,
                    iconClass: ''
                });
                setTimeout(() => {
                    instance.close();
                }, 500);*/
                this.readError = response.data.Info;
            }
            this.alRead = response.data.Data.List;
            //未读
            let obj2 = {};
            obj2.OperatorID = this.OperatorID;
            obj2.PageIndex = this.count2;
            obj2.PageSize = 10;
            obj2.KeyWord = '';
            obj2.OperatorType = 1;
            obj2.OrderBy = '';
            let respo = await GetNoticeList(obj2);
            //          Indicator.close();
            if (respo.data.StatusCode != 0) {
                /*let instance = Toast({
                    message: respo.data.Info,
                    iconClass: ''
                });
                setTimeout(() => {
                    instance.close();
                }, 500);*/
                this.unReadError = respo.data.Info
            }
            this.NoRead = respo.data.Data.List;
        },
        //获取我发布的数据
        async GetNoticeList1(cb) {
            Indicator.open();
            let obj = {};
            obj.OperatorID = this.OperatorID;
            obj.PageIndex = this.count;
            obj.PageSize = 10;
            obj.KeyWord = '';
            obj.OperatorType = 3;
            obj.OrderBy = '';
            let res = await GetNoticeList(obj);
            Indicator.close();
            if(res.data.StatusCode != 0){
                let instance = Toast({
                    message: res.data.Info,
                    iconClass: ''
                });
                setTimeout(() => {
                    instance.close();
                }, 500);
            }
            if(res.data.Data.List.length == 0){
                let instance = Toast({
                    message: "已经没有数据了",
                    iconClass: ''
                });
                setTimeout(() => {
                    instance.close();
                }, 500);
                return;
            }
            res.data.Data.List.forEach(item => {
                this.all.push(item);
                cb();
            })
        },
        //获取已阅读的数据
        async GetNoticeList2(cb) {
            Indicator.open();
            let obj = {};
            obj.OperatorID = this.OperatorID;
            obj.PageIndex = this.count1;
            obj.PageSize = 10;
            obj.KeyWord = '';
            obj.OperatorType = 2;
            obj.OrderBy = '';
            let res = await GetNoticeList(obj);
            Indicator.close();
            if(res.data.StatusCode != 0){
                let instance = Toast({
                    message: res.data.Info,
                    iconClass: ''
                });
                setTimeout(() => {
                    instance.close();
                }, 500);
            }
            if(res.data.Data.List.length == 0){
                let instance = Toast({
                    message: "已经没有数据了",
                    iconClass: ''
                });
                setTimeout(() => {
                    instance.close();
                }, 500);
                return;
            }
            res.data.Data.List.forEach(item => {
                this.alRead.push(item);
                cb();
            })
            console.log(this.alRead);
            console.log('qqqqq');
        },
        //获取未阅读的数据
        async GetNoticeList3(cb) {
            Indicator.open();
            let obj = {};
            obj.OperatorID = this.OperatorID;
            obj.PageIndex = this.count2;
            obj.PageSize = 10;
            obj.KeyWord = '';
            obj.OperatorType = 1;
            obj.OrderBy = '';
            let res = await GetNoticeList(obj);
            Indicator.close();
            if(res.data.StatusCode != 0){
                let instance = Toast({
                    message: res.data.Info,
                    iconClass: ''
                });
                setTimeout(() => {
                    instance.close();
                }, 500);
            }
            if(res.data.Data.List.length == 0){
                let instance = Toast({
                    message: "已经没有数据了",
                    iconClass: ''
                });
                setTimeout(() => {
                    instance.close();
                }, 500);
                return;
            }
            res.data.Data.List.forEach(item => {
                this.NoRead.push(item);
                cb();
            })
        },
        //点击进入查看人员
        checkPerson(item, index, num) {
            this.code = item.Id;
            this.$router.push({
                'name': 'MessagePerson',
                params: {
                    id: this.code,
                    num: num
                }
            });
        },
        //下拉加载更多数据
        loadTop(cb) {
            this.count = this.count + 1;
            this.GetNoticeList1(cb);
            this.allLoaded = true;
        },
        loadTop1(cb) {
            this.count1 = this.count1 + 1;
            this.GetNoticeList2(cb);
            this.allLoaded = true;
        },
        loadTop2(cb) {
            this.count2 = this.count2 + 1;
            this.GetNoticeList3(cb);
            this.allLoaded = true;
        }
    },

}
</script>


<style lang="scss" scoped>
.messageList {
    background: #efeff4;
    height:100%;
    overflow: hidden;
    padding-bottom:30px;
    .NavBar {
        width: 100%;
        height: 96px;
        background: #fff;
        border-bottom: 1px solid #e5e5e5;
        ul {
            display: flex;
            li {
                width: 144px;
                line-height: 96px;
                /*margin-left: 157px;*/
                margin-left: 9.5%;
                text-align: center;
                font-size: 28px;
                color: #353535;
                letter-spacing: 0;
                text-align: center;
            }
        }
    }
    .Content {
    	margin-left: 20px;
    	margin-right: 20px;
        .PerMess {
        	height:1200px;
        	overflow-y: scroll;
            width: 100%;
            /*background: #ffffff;*/
            /*box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.04);*/
            /*border-radius: 8px;*/
            box-sizing: border-box;
            position:relative;
            .perSec{
            	padding-left: 30px;
            	padding-bottom: 30px;
				/*padding-top: 30px;*/
				background: #fff;
    			margin-top: 30px;
    			box-shadow: 0 2px 4px 0 rgba(0,0,0,0.04);
				border-radius: 8px;
            }
            .CityOrder {
				padding-left: 30px;
				padding-top: 30px;
                display: flex;
                justify-content: space-between;
                h5 {
                    width:65%;
                    font-size: 34px;
                    color: #111111;
                    text-align: left;
                    font-weight: 500;
                }

            }
            .time {
                display: flex;
                justify-content: space-between;
                padding-top: 13px;
                padding-bottom: 5px;
                p {
                    font-size: 26px;
                    color: #999999;
                }
                span {
                    font-size: 28px;
                    color: #2a2a2a;
                    i {
                        font-style: normal;
                        color: #d0021b;
                    }
                }
            }
            p {
                height: 40px;
                line-height: 40px;
                font-size: 28px;
                color: #666666;
                padding-left: 30px;
            }
        }
    }
}
.selected {
    color: #00ae66 !important;
    border-bottom: 6px solid #00ae66;
}
</style>
