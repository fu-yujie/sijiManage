<template>
    <div class="sysLogin">
        <div class="intro">
            <div>对我提交的与提交给我所在的部门的工单进行查看或者管理操作：</div>
            <div>
                1）点击“反馈工单”进入工单列表页面，“我的工单”显示的是所有我提交的工单，“未处理”、“处理中”与“已关闭/已完成”显示的是所有提交给我所在的部门的工单；
            </div>
            <div>2）依次点击“我的工单”、“工单列表”进入“工单详情”，可以查看工单详情，提问或者选择确认完成；</div>
            <div> 3）点击“已关闭/已完成”可以查看已关闭/已完成的工单，点击“未处理”和“处理中”进入工单详情，可以进行“回复”和“关闭”操作。</div>
        </div>
        <img class="img1" src="../../../static/img/5.jpg" alt="">
        <img class="img1 img2" src="../../../static/img/6.jpg" alt="">
        <img class="img1 img2" src="../../../static/img/7.jpg" alt="">
        <img class="img1 img2" src="../../../static/img/8.jpg" alt="">
        <div class="explain">
            <div>说明：</div>
            <div>1、	工单提交人可以标记工单完成；</div>
            <div> 2、接收工单部门的人员可以关闭工单，但必须输入关闭原因；</div>
            <div> 3、被标记为“已完成/已关闭”的，只能进行查看，不能再进行提问回复。</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "order"
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
