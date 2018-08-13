<template>
    <div class="contpass">
        <div class="pass">
            <div v-if="$root.loginType == 1">
                <div class="input-content input-header">
                    <span>验证码</span>
                    <input type="text" v-model="Code" placeholder="请输入验证码">
                    <button v-if="timeSecond == 60" v-on:click="sendVerifiactionCode">发送验证码</button>
                    <button v-else>{{timeSecond}}s</button>
                </div>
                <div v-if="userInfo.Phone" class="input-message">
                    将会向手机{{getPhone()}}发送验证短信
                </div>
            </div>
            <div class="input-content input-pass">
                <span>新密码</span>
                <input v-model="Password" type="password" placeholder="请输入8位以上字母+数字的密码">
            </div>
            <div class="input-content input-pass">
                <span>确认密码</span>
                <input v-model="PasswordAgain" type="password" placeholder="请再次输入新的登录密码">
            </div>
            <button class="input-finish" v-on:click="updatePwd">确认</button>
        </div>
    </div>


</template>

<script>
import util from '../../src/util/util.js'
import { Toast, Indicator } from 'mint-ui'
import {    pass,
    SendMessage,
    UpdatePwd} from '../api'
import { strictEqual } from 'assert';
export default {
    name: 'pass',
    data() {
        return {
            timeSecond: 60,
            timerObj: null,
            userInfo: {},
            Code: "",
            Password: "",
            PasswordAgain: ""
        }
    },
    components: {

    },

    created() { },
    mounted() {
        let OperatorID = util.getlocal('OperatorID');
        this.userInfo = OperatorID;
    },
    methods: {
        /**
         * UpdatePwd()
         * @param Phone 手机号
         * @param OperatorID  操作人ID
         * @param Code  验证码
         * @param Password  密码
         * @param PasswordAgain  确认密码
         */
        async updatePwd() {
            try {
                var reg= /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,}$/;

                if(!reg.test(this.Password)){
                    let info = Toast({
                        message: "请输入八位以上且包含数字与英文组合的密码",
                        iconClass: ''
                    });
                    setTimeout(() => {
                        Indicator.close();
                        info.close();
                    }, 1000);
                    return;
                }

                if(this.Password != this.PasswordAgain){
                    let info = Toast({
                        message: "两次输入密码不一致",
                        iconClass: ''
                    });
                    setTimeout(() => {
                        Indicator.close();
                        info.close();
                    }, 1000);
                    return;
                }

                Indicator.open();
                let res = await UpdatePwd({
                    Phone: this.userInfo.Phone,
                    OperatorID: this.userInfo.OperatorID,
                    Type: this.$root.loginType,
                    Code: this.Code,
                    Password: this.Password,
                    PasswordAgain: this.PasswordAgain
                })
                Indicator.close();
                if (res.data.StatusCode != 0) {
                    let info = Toast({
                        message: res.data.Info,
                        iconClass: ''
                    });
                    setTimeout(() => {
                        info.close();
                    }, 1000);
                    return;
                }
                let info = Toast({
                    message: res.data.Info,
                    iconClass: ''
                });
                this.$root.loginType = 1;
                var obj = util.getlocal('OperatorID');
                obj.IsActive = 1;
                util.setlocal('OperatorID', obj);
                this.$router.push({
                    name: 'HomeBefore'
                });
                setTimeout(() => {
                    info.close();
                }, 1000);
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * SendMessage(Code,Phone,BusinessChannel)
         * @param Phone 发送验证码的手机号码
         * @param BusinessChannel 业务渠道(非必填 不填默认为智慧人社渠道)
         * @param Code Code
         */
        async sendVerifiactionCode() {
            try {
                this.timeComputed();
                let res = await SendMessage({
                    Phone: this.userInfo.Phone,
                    OperatorID: this.userInfo.OperatorID
                });
                if (res.data.StatusCode != 0) {
                    let info = Toast({
                        message: res.data.Info,
                        iconClass: ''
                    });
                    setTimeout(() => {
                        Indicator.close();
                        info.close();
                    }, 1000);
                    return;
                }
                let info = Toast({
                    message: res.data.Info,
                    iconClass: ''
                });
                setTimeout(() => {
                    Indicator.close();
                    info.close();
                }, 1000);
            } catch (error) {

            }
        },
        timeComputed() {
            if (this.timeSecond == 60) {
                this.timeSecond--;
                this.timerObj = setInterval(() => {
                    this.timeSecond--;
                    if (this.timeSecond <= 0) {
                        this.timeSecond = 60;
                        clearInterval(this.timerObj);
                    }
                }, 1000)
            }
        },
        getPhone() {
            let phone = this.userInfo.Phone;
            return phone.substr(0, 3) + "***" + phone.substr(7);
        }
    }
}
</script>
<style lang="scss">
.passwords {
    padding-left: 40px;
    background: url(../../static/img/Shape.png) no-repeat 15px center;
    background-size: 30px 39.4px;
}
.phone {
    padding-left: 40px;
    background: url(../../static/img/phone.png) no-repeat 15px center;
    background-size: 30px 39.4px;
}
</style>

<style lang="scss" scoped>
.contpass {
    width: 100%;
    height: 100%;
    background: #efeff4;
    overflow: hidden;
    .pass {
        margin-top: 31px;
        .input-content {
            background: #ffffff;
            padding: 22px 30px;
            font-size: 32px;
            line-height: 45px;
            input{
                border:0;
            }
            > span {
                color: #333333;
            }

            > button {
                border: 0;
                background: #ffffff;
                width: 185px;
                position: relative;
                float: right;
                text-align:right;
                color: #2dbc81;
            }
            > button::before {
                content: '';
                position: absolute;
                width: 2px;
                background: #f2f2f2;
                top: -22px;
                bottom: -22px;
                left: 0;
            }
        }
        .input-header {
            > input {
                margin-left: 84px;
                width: 192px;
            }
        }
        .input-message {
            color: #353535;
            font-size: 24px;
            padding-left: 30px;
            margin-top: 12px;
            margin-bottom: 24px;
        }
        .input-pass {
            span {
                width: 128px;
                font-size: 32px;
                white-space:nowrap;
                display: inline-block;
            }
            input {
                margin-left: 52px;
                width: 455px;
            }
        }
        .input-finish {
            background: #00ae66;
            border: 2px solid rgba(5, 5, 5, 0.08);
            border-radius: 10px;
            width: 670px;
            display: block;
            margin: 60px auto;
            font-size: 36px;
            color: #ffffff;
            padding: 20px;
        }
    }
}
</style>
