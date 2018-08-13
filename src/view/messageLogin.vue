<template>
<div class="messageLogin">
    <div class="form">
    <div class="phoneNum" style="border-bottom: 1px solid #e5e5e5;">
        <div><label for="phoneNum">手机号码</label></div>
        <input type="number" id="phoneNum" placeholder="请输入手机号" onkeyup="(this.v=function(){this.value=this.value.replace(/[^0-9-]+/,'');}).call(this)"   maxlength="11" v-model="phoneNum" @keyup="change()">
    </div>
    <div class="verificationCode">
        <div><label for="verificationCode">验证码</label></div>
        <input type="text" id="verificationCode" placeholder="请输入验证码"  maxlength="" v-model="verificationCode" @keyup="change()">
        <div v-show="show" class="send" @click="sendVerifiactionCode" >发送验证码</div>
        <div v-show="!show" class="send">{{count}}s</div>
    </div>
    </div>
    <mt-button type="primary" class="btn" @click="goHome()">登录</mt-button>
</div>
</template>

<script>
    import util from '../../src/util/util.js'
    import { Toast, Indicator } from 'mint-ui'
    import {SendMessage,loginSms} from '../api'
    export default {
        name: "message-login",
        data() {
            return {
				PeopleGuid:'',
                phoneNum:'',
                show:true,
                verificationCode:'',
                count: 60,
                OperatorID: '',
                name: '',
                Level: '',
                Code: '',
                AreaName:'',
                DepartmentName: '',
                Phone: '',
				PeopleMenuList: [],
				//判断值
				IsActive:'',
				IsIndustryleader:'',
				IsHelpleader:'',
            }
        },
        mounted() {
        },
        methods:{
            async sendVerifiactionCode() {
                var _this=this;
                try {
                    let res = await SendMessage({
                        Phone: this.phoneNum,
                        OperatorID: 1
                    });
                    if (res.data.StatusCode == 0) {
                        Toast({
                            iconClass: 'mintui mintui-success',
                            message: '验证码发送成功',
                            position: 'bottom',
                            duration: 2000
                        });
                        const TIME_COUNT = 60;
                        if (!_this.timer) {
                            _this.count = TIME_COUNT;
                            _this.show = false;
                            _this.timer = setInterval(() => {
                                if (_this.count > 0 && _this.count <= TIME_COUNT) {
                                    _this.count--;
                                } else {
                                    _this.show = true;
                                    clearInterval(_this.timer);
                                    _this.timer = null;
                                }
                            }, 1000)
                        }
                    }else{
                        Toast({
                            message: res.data.Info,
                            position: 'bottom',
                            duration: 2000
                        });
                    }
                } catch (error) {

                }
            },
            //点击登录
            async goHome() {
                Indicator.open();
                let obj = {};
                obj.UserName = this.phoneNum;
                obj.PassWord = this.verificationCode;
                let res = await loginSms(obj);
                console.log(res);
                Indicator.close();
                if(res.data.StatusCode == 0) {
                    this.OperatorID = res.data.Data.Id;
					this.PeopleGuid=res.data.Data.PeopleGuid,
                    this.name = res.data.Data.Name;
                    this.Level = res.data.Data.Level;
                    this.Code = res.data.Data.Code;
                    this.AreaName = res.data.Data.AreaName;
                    this.Phone = res.data.Data.Phone;
                    this.DepartmentName = res.data.Data.DepartmentName;
                    this.PeopleMenuList = res.data.Data.PeopleMenuList;
                    this.IsActive = res.data.Data.IsActive;
					this.IsIndustryleader = res.data.Data.IsIndustryleader;
					this.IsHelpleader = res.data.Data.IsHelpleader;
                    this.saveOperatorID();
                    if(res.data.Data.IsActive == 0){
						Indicator.close();
						this.$root.loginType = 0;
                        this.$router.push({name : "ChangePass"});
                        return;
                    }
                    Toast({
                        message: '登录成功',
                        iconClass: '',
                        time: 500
                    });
                    /*Indicator.close();*/
                    setTimeout(() => {
                        this.$router.push({
                            'name': 'HomeBefore'
                        });
                    }, 500);
                } else {
                    let info = Toast({
                        message: res.data.Info,
                        iconClass: ''
                    });
                    setTimeout(() => {
                      /*  Indicator.close();*/
                        info.close();
                    }, 1000);
                }
            },
            saveOperatorID() {
                let obj = {
                    'OperatorID': this.OperatorID,
					'PeopleGuid':this.PeopleGuid,
                    'Name': this.name,
                    'Level': this.Level,
                    'Code': this.Code,
                    'user':this.user,
                    'AreaName':this.AreaName,
                    'Phone':this.Phone,
                    'IsActive': this.IsActive,
                    'DepartmentName':this.DepartmentName,
                    'PeopleMenuList':this.PeopleMenuList,
					'IsIndustryleader': this.IsIndustryleader,
					'IsHelpleader': this.IsHelpleader,
                };
                util.setlocal('OperatorID', obj);
            },

            change(){

            }
        }
    }
</script>

<style lang="scss" scoped>
    .messageLogin{
        padding-top:30px;
    }
    .selectPaperwork{
        height:100%;
        background:#E5E5E5;
    }
    .warning{
        background:white;
        margin-bottom:15px;
        padding:32px 33px 22px;
    }
    .warning img{
        height:100px;
        width:100px;
        margin-bottom:19px;
    }
    .warning div{
        width:100%;
        margin:0 auto;
        text-align:left;
        font-size:32px;
        color:#333333
    }
    .form{
        background:white;
        /*padding-top:32px;*/
    }
    .btn {
        width: 620px;
        height: 94px;
        background-color: #00AE66;
        position: absolute;
        left: 0;
        right: 0;
        margin:80px auto;
    }
    .form input{
        border:0;
        height:88px;
        font-size:32px;
        width:70%;
        color:#333333;
		box-sizing:border-box;
    }
    .form>div{
       /* border-bottom:1px solid #E5E5E5;*/
        margin-left:15px;
        text-align:left;
        font-size:0;
		height:89px;
    }
    .form div div{
        color:#333333;
        display:inline-block;
        width:30%;
        position:relative;
        font-size:32px;
    }
    #app .inputBox{
        width:70%;
    }
    #app .inputBox input{
        width:100%;

    }
    #app .verificationCode{
        margin-left:0;
        padding-left:15px;
    }
    .paperwork,.relation{
        position:relative;
    }
    .send{
        padding:0 2px;
        position:absolute!important;
        width:200px !important;
        right:0;
        text-align:center ;
        border-left:1px solid #E5E5E5;
        height:88px;
        line-height:88px;
        color:#00AE66!important;
    }
    .right_arrow{
        height:13px;
        width:8px;
        position: absolute;
        right: 15px;
        top: 50%;
        margin-top: -6px;
    }

    .next{
        width:90%;
        height:47px;
        color:white;
        background:#00AE66;
        line-height:47px;
        border-radius:5px;
        margin:0 auto;
        margin-top:25px;
        margin-bottom:15px;
        opacity: 0.4;
    }
    .next1{
        opacity:1
    }
</style>
