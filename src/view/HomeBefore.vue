<template>
    <div class="HomeBefore">
        <div v-on:click="jumpRoute()" class="content-block">
            <img src="../../static/img/医保扶贫.png" alt="">
            <p>医保扶贫<br>四级管理平台</p>
        </div>
        <div v-on:click="jumpRoute(1)" class="content-block">
            <img src="../../static/img/城乡征缴.png" alt="">
            <p>城乡征缴<br>四级管理平台</p>
        </div>
        <div v-on:click="jumpRoute(1)"  class="content-block">
            <img src="../../static/img/民政低保.png" alt="">
            <p>医保低保<br>四级管理平台</p>
        </div>
        <div v-on:click="jumpRoute(1)"  class="content-block">
            <img src="../../static/img/医院管理.png" alt="">
            <p>定点医院<br>四级管理平台</p>
        </div>
    </div>
</template>

<script>
import {
    policyGuide //政策指南；
} from "../api.js";
import { Toast, Indicator } from 'mint-ui';
import util from '../util/util';

export default {
    name: "HomeBefore",
    data() {
        return {
            userInfo: {}
        };
    },
    mounted() {
        this.userInfo = util.getlocal('OperatorID');
    },
    created() { },
    methods: {
        jumpRoute(msg){
            if(msg){
                let info = Toast({
					message: "功能建设中...",
                    iconClass: '',
                    time: 500
				});
            }else{
                this.$router.push({name : 'Home'})
            }
        }
    }
};
</script>


<style lang="scss" scoped>
.HomeBefore {
    overflow: hidden;
    height:100%;
    .content-block{
        background:#ffffff;
        width:330px;
        height:330px;
        position: relative;
        border-radius:10px;
        box-shadow:0 0 20px 0 rgba(0,0,0,0.08);;
        margin:30px;
        margin-right:0;
        margin-bottom:0;
        float:left;
        img{
            position: absolute;
            top:88px;
            left:0;
            right:0;
            margin:auto;
            width:57px;
            height:59px;
        }
        p{
            position:absolute;
            top:178px;
            left:0;
            right:0;
            margin:auto;
            width:168px;
            font-size: 28px;
            color:#333333;
            text-align:center;
        }
    }
}
/*
<div class="HomeBefore">
        <div class="content-block">
            <img src="../../static/img/医保扶贫.png" alt="">
            <p>医保扶贫<br>四级管理平台</p>
        </div>
        <div class="content-block">
            <img src="../../static/img/医保扶贫.png" alt="">
            <p>医保扶贫<br>四级管理平台</p>
        </div>
    </div>
 */


</style>
