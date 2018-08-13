<template>
    <div class="progress">
        <div  class="helpPoorSearch">
            <input type="search" placeholder="请输入姓名、身份证号" v-model="NameOrIDCard" @keyup="">
            <span @click="searchKey">搜索</span>
        </div>

        <div class="schedule">
            <div class="title">您当前查看的是廊坊市扶贫工作进度</div>
            <div class="chartBox" ref="abc">
                <div class="circleCenter">贫困家庭2305户
                    共计6500人
                </div>
                <div class="chart" id="chart">
                </div>
            </div>
            <div class="summarize">
                <div class="left">
                    <div class="square"></div>
                    <div class="text">已脱贫600户
                        共计1800人</div>
                </div>
                <div class="right">
                    <div class="square"></div>
                    <div class="text">未脱贫1705户
                        共计4700人</div>
                </div>
            </div>
        </div>

        <div class="decbox">
            <div class="dec" v-for="(item,index) in list" :key="index" @click="goNext(item.AreaCode)">
                <div class="loca">{{item.AreaName}}<img class="arrow" src="../assets/img/viewDetIcon.png" alt=""></div>

                <div class="summ">贫困家庭{{item.FamilyTotal}}户（共计{{item.PeopleTotal}}人）</div>
                <mt-progress :value="item.FamilyProportion" class="pross">
                    <div slot="end" class="shoupre">{{item.FamilyProportion}}%</div>
                </mt-progress>
                <div class="left">
                    <div class="tongji"><div class="square"></div><span class="text">已脱贫{{item.FamilyAmount}}户（共计{{item.PeopleAmount}}人）</span></div>
                    <div class="tongji"><div class="square" style="background: #D6D6D6;"></div><span class="text">未脱贫{{item.PoorFamilyAmount}}户（共计{{item.PoorPeopleamount}}人）</span></div>
                </div>
                <div class="right" @click.stop="goDetail">查看脱贫动态</div>
            </div>
        </div>

    </div>
</template>

<script>
    import util from '../../src/util/util.js'
    import {GetPoorProgressList} from '../api'
    export default {
        name: "pov-progresspublic",
        data() {
            return {
                code:'',
                list:[],
                NameOrIDCard:"",
                OperatorID:'',
                data:[{
                    value: 100, name: '已脱贫50%', itemStyle: {
                        color: '#50CB74'
                    }
                },
                    {
                        value: 100, name: '未脱贫50%', itemStyle: {
                            color: '#D6D6D6'
                        }
                    },]
            }
        },
        mounted() {
            let OperatorID = util.getlocal('OperatorID');
            this.OperatorID = OperatorID.OperatorID;
            this.drawPie();
            this.GetPoorProgressList()
        },
        created(){

        },
        methods: {
            async GetPoorProgressList(){
                var obj={};
                obj.OperatorID=this.OperatorID;
                try{
                    var res=await GetPoorProgressList(obj);
                    if(res.data.StatusCode==0){
                        this.list=res.data.Data
                    }
                }catch(e){
                    console.log(e)
                }
            },
            searchKey(){

            },
            goDetail(){

            },
            goNext(code){
                let data={code:code};
                this.$emit('goNext1',data)
            },
            drawPie() {
                var myChart = echarts.init(document.getElementById('chart'));

                myChart.setOption({
                    title: {
                        text: '总资产',
                        subtext: '2000000.00',
                        x: 'center',
                        y: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b}: {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'left',

                    },


                    series: [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius: ['40%', '55%'],
                            labelLine: {
                                normal: {
                                    show: true
                                }
                            },

                            itemStyle: {
                                normal: {
                                    label: {
                                        show: true,
                                        formatter: function (val) {   //让series 中的文字进行换行
                                            return val.name.split("-").join("\n");
                                        }
                                    },

                                }
                            },
                            data: this.data,
                            label: {
                                normal: {
                                    textStyle: {
                                       fontSize:'12px'
                                    }
                                }
                            },
                        }
                    ]
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .progress {
        padding-bottom: 118px;
        background: #EFEFF4;
        /* 搜索框区域 */
        .helpPoorSearch {
            width: 100%;
            height: 88px;
            overflow: hidden;
            box-sizing: border-box;
            padding: 16px 30px;
            background: #00ae66;
            position: fixed;
            left: 0;
            top: 0;
            z-index:3;
            input {
                float: left;
                width: calc(100% - 102px - 30px);
                height: 56px;
                border: none;
                font-size: 26px;
                box-sizing: border-box;
                padding-left: 52px;
                border-radius: 10px;
                background: url("../assets/img/searchIcon.png") #009557 no-repeat left
                20px center;
                background-size: 25px;
                color: #fff;
                -webkit-appearance: none;
                &::-webkit-input-placeholder {
                    color: rgba(255,255,255,0.6);
                    font-size: 26px;
                }
                &::-webkit-search-cancel-button {
                    position: relative;
                    right: 10px;
                    height: 40px;
                    width: 40px;
                    border-radius: 50%;
                    background: url("../assets/img/icon_cha.png") #009557 no-repeat center
                    center;
                    background-size: 40px;
                    -webkit-appearance: none;
                }
                &::-webkit-search-cancel-button:after {
                    position: absolute;
                    height: 30px;
                    width: 30px;
                    left: 0;
                    top: 0;
                }
            }
            span {
                width: 102px;
                font-size: 28px;
                float: right;
                color: #fff;
                box-sizing: border-box;
                margin: 8px 0;
                text-align: right;
                padding-right: 10px;
            }
        }
        .schedule {
            position: relative;
            top: 118px;
            margin:0 20px 30px;
            padding-top: 28px;
            padding-bottom:39px;
            background: #fff;
            .title {
                font-size: 32px;
                color: #333333;
                text-align: center;

            }
            .chartBox {
                position: relative;
            }
            .chart {
                width: 669px;
                height: 500px;
                margin: auto
            }
            .circleCenter {
                font-family: PingFangSC-Medium;
                font-size: 28px;
                color: #333333;
                width: 150px;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
            .summarize{
                margin:0 114px;
                display: flex;
                justify-content: space-between;
                .square{
                    float:left;
                    margin:5px 17px 0 0;
                    display:inline-block;
                    height:17px;
                    width:17px;
                    background:#50CB74
                }
                .text{
                    display:inline-block;
                    width:140px;
                    font-size:24px;
                }
                .left{

                }
                .right{
                    .square{
                        background:#D6D6D6
                    }
                }
            }
        }
        .decbox {
            position:relative;
            top:118px;
            .dec {
                overflow: hidden;
                padding-bottom:28px;
                margin:0 20px 30px;
                background: #ffffff;
                font-size: 12px;
                box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.04);
                border-radius: 8px;
                position:relative;
                .arrow{
                    height:26px;
                    width:16px;
                    float:right;
                    margin-right:30px;
                }
                .left{
                    float:left
                }
                .right{
                    position:absolute;
                    bottom:30px;
                    right:30px;
                    font-size: 26px;
                    color: #FFFFFF;
                    background: #00AE66;
                    padding:12px 16px;
                    border-radius: 6px;
                }
                .loca {
                    font-family: PingFangSC-Regular;
                    font-size: 34px;
                    color: #111111;
                    text-align: left;
                    padding: 34px 0 0 30px;
                }
                .summ{
                    margin-left:30px;
                    margin-top:5px;
                }
                .pross {
                    height: 17px;
                    margin: 26px 30px 30px;
                    .mt-progress-progress {
                        width: 100%;
                        height: 7px;
                        border-radius: 15px;
                        background-color: #00AE66 !important;
                    }
                    .shoupre {
                        margin-left: 24px;
                        font-size: 28px;
                    }
                }
                .tongji {
                    position:relative;
                    margin-top:10px;
                    margin-left:30px;
                    font-family: PingFangSC-Regular;
                    font-size: 28px;
                    color: #333333;
                    .square{
                        position: absolute;
                        top: 50%;
                        transform: translateY(-50%);
                        color: black;
                        display:inline-block;
                        height:17px;
                        width:17px;
                        background:#50CB74
                    }
                    .text{
                        margin-left:32px;
                        /* position:absolute;
                         left:32px;
                         top:0*/
                    }
                }
            }
        }

    }
</style>
