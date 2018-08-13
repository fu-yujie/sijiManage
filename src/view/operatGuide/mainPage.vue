<template>
    <div class="sysLogin">
        <div class="intro">登录后进入系统主界面，包含以下模块：“反馈工单”、“通讯录”、“通知公告”、“通知管理”、“新建工单”、“扶贫政策专栏”、“建档立卡脱贫动态管理”、“建档立卡就医费用查询”。
        </div>
        <img class="img1" src="../../../static/img/3.jpg" alt="">
    </div>
</template>

<script>
    export default {
        name: "main-page"
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
