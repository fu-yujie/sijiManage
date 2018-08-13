<template>
    <div class="sysLogin">
        <div class="intro">查看发布给我所在部门的通知列表：默认显示“我收到的”全部通知，可以通过点击“已阅读”和“未阅读”分别查看已经阅读过的和未阅读的通知。</div>
        <img class="img1" src="../../../static/img/12.jpg" alt="">
    </div>
</template>

<script>
    export default {
        name: "notice-gonggao"
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
