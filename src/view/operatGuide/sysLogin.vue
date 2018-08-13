<template>
<div class="sysLogin">
    <div class="intro">点击“四级管理平台”（超链接），输入手机号和初始密码，点击登录进入系统。</div>
    <img class="img1" src="../../../static/img/1.jpg" alt="">
    <img class="img1 img2" src="../../../static/img/2.jpg" alt="">
</div>
</template>

<script>
    export default {
        name: "sys-login"
    }
</script>

<style lang="scss" scoped>
.sysLogin{
    background: #fff;
    text-align: center;
    padding-bottom:57px;
    .intro{
        text-align:left;
        margin:auto;
        font-family: PingFangSC-Regular;
        font-size: 28px;
        color: #333333;
        letter-spacing: 0;
        line-height: 45px;
        padding:30px;

    }
    .img1{
        width: 80%;
    }
    .img2{
        margin-top:30px;
    }
}
</style>
