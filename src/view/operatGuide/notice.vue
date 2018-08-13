<template>
    <div class="sysLogin">
        <div class="intro">
            <div>查看我发布的通知和发布通知的操作：</div>
            <div>
                1）点击通知列表，查看通知的内容，点击“查看阅读人员”查看通知的“已读人员”和“未读人员”；
            </div>
            <div> 2）点击“发布通知”进入发布通知页面，依次选择区域与通知部门，填写“标题”与“内容”，视情况选择“上传图片”，然后点击“提交”完成通知发布。</div>

        </div>
        <img class="img1" src="../../../static/img/9.jpg" alt="">
        <img class="img1 img2" src="../../../static/img/10.jpg" alt="">
        <img class="img1 img2" src="../../../static/img/11.jpg" alt="">
        <div class="explain">
            <div>说明：</div>
            <div>1、	市、区/县以及乡/镇/街道级部门发布通知，只能发布给同级别或下一级别的部门；
                </div>
            <div> 2、村/社区级单位没有发布通知的操作。</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "notice"
    }
</script>

<style lang="scss" scoped>
    .sysLogin{
        background: #fff;
        text-align: center;
        padding-bottom:85px;
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
        .explain{
            margin-top:30px;
            text-align:left;
            padding:0 30px;
            font-family: PingFangSC-Regular;
            font-size: 28px;
            color: #333333;
            letter-spacing: 0;
            line-height: 45px;
        }
    }
</style>
