<template>
    <div class="messageList">
        <div class="NavBar">
            <ul style="display: flex;justify-content: space-around;align-items: center;">
                <li class="selected se" @click="panelShow">我发布的</li>
                <!--<li class="si" @click="">发布</li>-->
                <li style='font-size: 14px;width:114px;height:28px;line-height:28px;border:1px solid #00AE66;padding: 0 5px;border-radius: 5px;'>
                	<router-link to='/addMessage' class="addno" style='color: #00AE66;font-size:14px;'>发布通知</router-link>
                </li>

            </ul>

        </div>
        <!--<div id="content-list" class="Content">-->
       	<div id="content-list" class="Content">
            <div class="PerMess" v-for="(item,index) in all" :key="index" v-if="isAll && all.length > 0" @click.stop="ToMessDetail(item)">
                <div class="CityOrder">
                    <h5>{{item.DepartmentName}}</h5>
                    <p @click.stop="checkPerson(item,index,1)">查看阅读人员</p>
                </div>
                <div class="time">
                    <p>{{item.CreateDate}}</p>
                    <span>
                        <i>{{item.ReadPeopleNum}}</i>/{{item.TotalPeopleNum}}</span>
                </div>
                <p>标题：<span style="word-wrap: break-word;">{{item.Title}}</span></p>
            </div>
            <div v-if="isAll && all.length == 0" style="text-align:center" class="PerMess">
                暂无数据
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
        }
    },
    mounted() {
        let OperatorID = util.getlocal('OperatorID');
        this.OperatorID = OperatorID.OperatorID;
        this.GetNoticeList();

        var contentList = document.getElementById('content-list');
        var state = true;
        contentList.addEventListener("scroll", () => {
            if (this.isAll) {
                var scrollheight = contentList.scrollHeight;
                var clientheight = contentList.clientHeight;
                var top = contentList.scrollTop;
                if (scrollheight == ( clientheight + top)) {
                    if (state) {
                        state = false;
                        this.loadTop(function(e){
                            state = true;
                        })
                    }
                }
            }

        });
    },
    created(){
    },
    methods: {
        panelShow() {
            $('.se').addClass('selected').siblings().removeClass('selected');
            this.isShow = false;
            this.isEnd = false;
            this.isAll = true;
            if(this.allError != ""){
                let instance = Toast({
                    message: this.allError,
                    iconClass: ''
                });
                setTimeout(() => {
                    instance.close();
                }, 1000);
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
        //获取我发布的通知列表
        async GetNoticeList() {
            Indicator.open();
            //全部
            let obj = {};
            obj.OperatorID = this.OperatorID;
            obj.PageIndex = this.count;
            obj.PageSize = 10;
            obj.KeyWord = '';
            obj.OperatorType = 0;
            obj.OrderBy = '';
            let res = await GetNoticeList(obj);
            console.log(res)
            Indicator.close();
            if (res.data.StatusCode != 0) {
                let instance = Toast({
                    message: res.data.Info,
                    iconClass: ''
                });
                setTimeout(() => {
                    instance.close();
                }, 500);
                this.allError = res.data.Info;
            }
            this.all = res.data.Data.List;

        },
        //获取我发布的数据
        async GetNoticeList1(cb) {
            Indicator.open();
            let obj = {};
            obj.OperatorID = this.OperatorID;
            obj.PageIndex = this.count;
            obj.PageSize = 10;
            obj.KeyWord = '';
            obj.OperatorType = 0;
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
        }
    },

}
</script>


<style lang="scss" scoped>
.messageList {
    background: #efeff4;
    padding-bottom: 10px;
    height:100%;
    box-sizing: border-box;
    overflow: hidden;
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
                .addno{
                    font-size: 28px;
                }
            }
        }
    }
    .Content {
        margin-top: 30px;
        margin-left: 20px;
        margin-right: 20px;
		height:1200px;
        /*height: calc( 100% - 130px );*/
        overflow-y: scroll;
        .PerMess {
            width: 100%;
            background: #ffffff;
            box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.04);
            border-radius: 8px;
            padding: 30px;
            box-sizing: border-box;
            margin-bottom: 30px;
            .CityOrder {
                display: flex;
                justify-content: space-between;
                position: relative;
                h5 {
                    width:65%;
                    font-size: 34px;
                    color: #111111;
                    text-align: left;
                    font-weight: 500;
                }
                p {
                   /* width: 170px;

                    height: 40px;*/
                    padding:4px 12px;
                   /* line-height: 40px;*/
                   position: absolute;
                   right:0px;
                    font-size: 24px;
                    background: #41cc8d;
                    border: 1px solid #00a450;
                    border-radius: 4px;
                    color: #ffffff;
                    letter-spacing: 0;
                    text-align: center;
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
                    color: #666666;
                    i {
                        font-style: normal;
                        color: #d0021b;
                    }
                }
            }
            p {
              /*  height: 40px;
                line-height: 40px;*/
                font-size: 28px;
                color: #666666;
            }
        }
    }
}
.selected {
    color: #00ae66 !important;
    border-bottom: 6px solid #00ae66;
}
</style>
