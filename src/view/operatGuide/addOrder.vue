<template>
    <div class="sysLogin">
        <div class="intro">进行工单提交操作：点击“新建工单”进入工单提交页面，依次选择“选择问题反馈部门”与“工单反馈类型”，填写“标题”与“内容”，并可以根据情况选择上传图片，点击“提交”就完成了，完成后，工单的提交人和问题反馈部门部门均可查看并管理工单。</div>
        <img class="img1" src="../../../static/img/4.jpg" alt="">
        <div class="explain">
            <div>说明：</div>
            <div>1、	市、区/县以及乡/镇/街道级部门新建工单，“选择问题反馈部门”只能选择自己部门的同级的其他部门或者上级部门；</div>
            <div>2、	村/社区级部门新建工单，“选择问题反馈部门”只能选择上级部门。</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "add-order"
    }
</script>

<style lang="scss" scoped>
    .sysLogin{
        background: #fff;
        text-align: center;
        padding-bottom:85px;
        .intro{
            text-align: left;
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
