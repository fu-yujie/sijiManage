<template>
    <div class="contacts">
        <div class="helpPoorTab">
            <ul>
                <li v-bind:class="curVal === 3 ? 'cur' : '' "  v-on:click="tabChange(3)">
					<span>
						我收到的
					</span>
                </li>
                <li v-bind:class="curVal === 2 ? 'cur':'' "  v-on:click="tabChange(2)">
					<span>
						已阅读
					</span>
                </li>
                <li v-bind:class="curVal === 1 ? 'cur':'' "  v-on:click="tabChange(1)">
					<span>
						未阅读
					</span>
                </li>
            </ul>
        </div>

        <div v-if="dataList.length > 0" id="content-list" class="content">

            <div v-for="(item,index) in dataList" class="box" @click.stop="ToMessDetail(item)">
                <div class="content-title">
                    <span>{{item.DepartmentName}}</span>
                </div>
                <div class="content-body">
                    <div class="time">{{item.CreateDate}}</div>
                    <div class="title">
                        标题：<span style="word-break:break-all">{{item.Title}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div v-else id="content-list" class="content">
            <p>
                暂无数据
            </p>
        </div>
    </div>
</template>

<script>
    import util from '../../../src/util/util.js'
    import { Toast, Indicator } from 'mint-ui'
    import { GetNoticeList } from '../../api'
    import { strictEqual } from 'assert';
    export default {
        name: 'message-list',
        data() {
            return {
                SearchKey: '', //关键字搜索
                PageIndex: 1, //当前页面
                dataList: [],//数组
                userInfo: {},
                state: true,
                //cur
                curVal:3,
                ContentTypeVal: 1,
                fromName:3
            }
        },
        components: {

        },

        created() {

        },
        mounted() {
            let mesSign = util.getlocal("tabIndex");
            if(mesSign==3){
                this.curVal=3
            }else if(mesSign==2){
                this.curVal=2
            }else if(mesSign==1){
                this.curVal=1
            }

            let OperatorID = util.getlocal('OperatorID');
            this.userInfo = OperatorID;
            this.GetNoticeList(1);
            var contentOne = document.getElementById('content-list');
            contentOne.addEventListener("scroll", () => {
                var scrollheight = contentOne.scrollHeight;
                var clientheight = contentOne.clientHeight;
                var top = contentOne.scrollTop;

                if (scrollheight == ( clientheight + top)) {
                    if (this.state) {
                        this.state = false;
                        this.GetNoticeList()
                    }
                }
            });


            /* 判断登录 */
        },

        methods: {

            //tab切换
            tabChange(val){
                util.setlocal("tabIndex",val);
                this.SearchKey='';
                this.PageIndex=1;
                this.curVal = val;
                this.ContentTypeVal = val;
                util.setlocal("ContentTypeVal",val)
                console.log("this.ContentTypeVal:"+this.ContentTypeVal)
                this.GetNoticeList(1);
            },

            /**
             * 获取人员管理列表
             * @param SearchKey 关键字搜索
             * @param DepId 部门ID
             * @param Enabled -1全部 0未启用，1启用
             * @param PageIndex 页码
             * @param PageSize 页数
             * @param OrderBy  排序
             * @param OperatorID 操作者ID
             */
            async GetNoticeList(PageIndex) {
                try {
                    if(PageIndex){
                        this.PageIndex = PageIndex;
                        document.getElementById('content-list').scrollTop = 0;
                        this.state = false;
                    }
                    Indicator.open();
                    let result = await GetNoticeList({
                        KeyWord: '',
                        OrderBy:'',
                        PageIndex: this.PageIndex,
                        PageSize: 10,
                        OperatorType:this.curVal,
                        OperatorID: this.userInfo.OperatorID
                    });
                    Indicator.close();
                    if (result.data.StatusCode != 0) {
                        let info = Toast({ message: result.data.Info, iconClass: '', time: 500 });
                        return;
                    }
                    if (result.data.Data.List.length == 0) {
                        if(PageIndex){
                            this.dataList = result.data.Data.List;
                        }else{
                            let info = Toast({ message: "没有更多数据了", iconClass: '', time: 500 });
                        }
                        return;
                    }else{
                        this.state = true;
                    }
                    if(this.PageIndex == 1){
                        this.dataList = result.data.Data.List;
                    }else{
                        this.dataList = this.dataList.concat(result.data.Data.List);
                    }
                    this.PageIndex ++;
                } catch (error) {
                    console.log(error);
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

        }
    }
</script>
<style lang="scss" scoped>
    .isShow{
        color:transparent;
    }
    ::-webkit-input-placeholder {
        color: #93d1b7;
    }
    :-ms-input-placeholder {
        color: #93d1b7;
    }
    .contacts {
        width: 100%;
        height: 100%;
        background: #efeff4;
        overflow: hidden;
        .helpPoorTab {
            overflow: hidden;
            width: 100%;
            background: #fff;
            position: fixed;
            left: 0;
            ul {
                overflow: hidden;
                height: 94px;
                li {
                    width: 33%;
                    float: left;
                    box-sizing: border-box;
                    height: 94px;
                    line-height: 94px;
                    font-size: 14px;
                    text-align: center;
                    span {
                        color: #333;
                        display: inline-block;
                        height: 100%;
                        box-sizing: border-box;
                        padding: 0 14px;
                        font-size: 28px;
                    }
                    &.cur span {
                        border-bottom: 3px solid #00ae66;
                        color: #00ae66;
                    }
                }
            }
        }
        .head {
            background: #00ae66;
            padding: 16px 40px 16px 30px;
            position: relative;
            input {
                width: 589px;
                border: 0;
                background: #009557;
                border-radius: 10px;
                height: 56px;
                line-height: 56px;
                font-size: 26px;
                color: #ffffff;
                text-indent: 65px;
            }
            img {
                position: absolute;
                left: 50px;
                top: 0;
                bottom: 0;
                margin: auto;
                width: 25px;
                height: 25px;
            }
            button {
                position: absolute;
                right:30px;
                top:0;
                bottom:0;
                margin:auto;
                color: #ffffff;
                background:none;
                border:0;
                font-size: 28px;
                line-height: 40px;
            }
        }
        .content {
            background: #ffffff;
            position: absolute;
           /* padding-bottom:50px;*/
            top: 124px;
            left: 0;
            right: 0;
            bottom: 0;
            overflow-y: scroll;
            p{
                margin-top:30px;
                text-align:center;
            }
            .box {
                padding: 30px 0 30px 0px;
                margin-left: 30px;
                border-bottom: 1px solid #eeefee;
                .content-title {
                    h3 {
                        font-size: 34px;
                        color: #111111;
                        line-height: 34px;
                        display: inline-block;
                        vertical-align: middle;
                    }
                    span {
                        /*display: block;
                        margin-top:7px;
                        font-size: 26px;
                        padding-right:30px;
                        vertical-align: middle;
                        color: #999999;*/
                        width: 65%;
                        font-size: 1.0625rem;
                        color: #111111;
                        text-align: left;
                        font-weight: 500;
                    }
                    margin-bottom: 13px;
                }
                .content-body {
                    .time{
                        font-size: 0.8125rem;
                        color: #999999;
                    }
                    .title{
                        font-size: 28px;
                        color: #666666;
                        span{
                            word-wrap: break-word;
                        }
                    }
                    .body-left {
                        font-size: 28px;
                        color: #666666;
                        line-height: 28px;
                    }
                    .phone-right {
                        float: right;
                        margin-right: 30px;
                        img {
                            width: 40px;
                            height: 40px;
                            vertical-align: middle;
                        }
                        a {
                            font-family: arial;
                            display: inline-block;
                            white-space: nowrap;
                            border-collapse: collapse;
                            width:173px;
                            text-align:left;
                            color: #333333;
                            font-size: 28px;
                            line-height: 28px;
                            vertical-align: middle;
                        }
                    }
                }
            }
        }
    }
</style>
