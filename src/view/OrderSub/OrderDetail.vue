<template>
	<div class="orderDetail">
        <div>
		<div class="Box1">
			<h5>{{content.Title}}</h5>
			<p>{{content.CreateDate}}</p>
			<div class="text">
				{{content.Content}}
			</div>
			<img class='imgArea' v-for="(item,index) in content.PovertyAlleviationImgs" :key='index' :src="item.ImageContent"/>
		</div>
		<ul class="Content clearfloat">
			<li class="title">
				<img src="../../../static/img/回复.png" />
				<span>全部回复</span>
			</li>
			<li class="cont" v-for="(item,index) in items" :key="index" >
				<p class="deve"><span>{{item.OperatorName}}：</span>{{item.Content}}</p>
				<!--<p class="repeat"><span>回复戴永名：</span>精准扶贫要一切为了群众</p>-->
				<p class="time">{{item.CreateDate}}</p>
			</li>
		</ul>
        </div>
        <div class="inputPop">
            <textarea class="huifu" placeholder="添加一条回复" v-model="huifu" ></textarea><span @click="send">发送</span>
        </div>
        <div class="btns" v-if="content.IsCloseOperate">
            <div class="done" @click="close">关闭</div>
            <div class="quess" @click="question">回复</div>
        </div>
		<div class="btns" v-if="content.IsSolveOperate">
			<div class="done" @click="solve">完成</div>
			<div class="quess" @click="question">提问</div>
		</div>

        <mt-popup
            style="z-index:900"
            class="popup"
            v-model="popupVisible"
            >
            <div style="padding:0 25px;font-size:0">
                <div class="title">温馨提示</div>
                <div class="tishi">您将关闭此条问题反映，关闭后将不能继续沟通，如确定关闭请输入关闭原因。</div>
                <textarea placeholder="请输入关闭原因" v-model="reason" name="" id=""></textarea>

            </div>
            <div class="myButton">
                <span @click="cancelClick"  style="border-right: 1px solid #E5E5E5;">取消</span><span @click="sureClick" style="color:#00AE66">确定</span>
            </div>
        </mt-popup>

	</div>
</template>

<script>
    import { Indicator,MessageBox,Toast} from 'mint-ui'
    import util from '../../../src/util/util.js'
    import {GetWorkOrderInfo,GetWorkOrderMessageList,AddWorkOrderMessage,UpdWorkOrderState} from '../../api'
  export default {
    name: 'orderDetail',
    data () {
      return {
		items:[],
          popupVisible:false,
          content:'',
          page:1,
          pageSize:8,
          huifu:'',
          state:'',
          reason:'',
          OperatorID:''
      }
    },
    mounted(){
        $('.inputPop').hide()
        Indicator.open();
        this.getDetail();
        this.getOrderList();
        this.state=this.$route.params.state;

    },
      created(){
          let OperatorID = util.getlocal('OperatorID');
          this.OperatorID = OperatorID.OperatorID;
      },
    methods:{
        async getDetail(){
            var obj={};
            var _this=this;
            obj.id=this.$route.params.id;
            obj.OperatorID=this.OperatorID
            var res=await GetWorkOrderInfo(obj);
            if(res.data.StatusCode==0){
            		Indicator.close();
                _this.content=res.data.Data
                console.log(_this.content);
            }
        },
        async getOrderList(){
            var obj={};
            var _this=this;
            obj.Workid=this.$route.params.id;
            obj.PageIndex=this.page;
            obj.PageSize=this.pageSize;
            var res=await GetWorkOrderMessageList(obj);
            if(res.data.StatusCode==0){
                Indicator.close();
                _this.items=res.data.Data.List
            }
        },
        question(){
            $('.inputPop').show();
            $('.btns').hide();
            $('.huifu').focus()
        },
        send(){
            var obj={};
            var _this=this;
            obj.Workid=this.$route.params.id;
            obj.Content=this.huifu;
            obj.OperatorID=this.OperatorID;
            AddWorkOrderMessage(obj).then(function(res){
                if(res.data.StatusCode==0){
                    Indicator.open();
                    _this.getOrderList();
                    _this.huifu='';
                    $('.inputPop').hide();
                    $('.btns').show();
                    Toast('回复成功');
                }
            })
        },
        close(){
            this.popupVisible=true;
        },
        cancelClick(){
            this.popupVisible=false
        },
        solve(){
            var obj={};
            var _this=this;
            obj.Id=this.$route.params.id;
            obj.OperatorID=this.OperatorID;
            obj.State=3;
            //增加提示
			MessageBox.confirm('确定完成吗?').then(action => {
				UpdWorkOrderState(obj).then(function(res){
				if(res.data.StatusCode==0){
                    _this.popupVisible=false;
                    _this.$router.go(-1);
                    Toast({
                        message: res.data.Info,
                        iconClass: '',
                        time: 500
                    });
					//_this.getDetail()
				}
			})
			});
                // UpdWorkOrderState(obj).then(function(res){
                //     if(res.data.StatusCode==0){
                //         Toast( res.data.Info);
                //         _this.popupVisible=false;
                //         _this.getDetail()
                //     }
                // })

        },
        sureClick(){
            var obj={};
            var _this=this;
            obj.Reason=this.reason;
            obj.Id=this.$route.params.id;
            obj.OperatorID=this.OperatorID;
            obj.State=4;
            if(this.reason){
                UpdWorkOrderState(obj).then(function(res){
                    if(res.data.StatusCode==0){
                        let info = Toast({
						message: res.data.Info,
						iconClass: ''
                        });
                        setTimeout(() => {
                            info.close();
                        }, 1000);
                        _this.popupVisible=false;
                        _this.$router.go(-1);
                    }else{
                        let info = Toast({
						message: res.data.Info,
						iconClass: ''
                        });
                        setTimeout(() => {
                            info.close();
                        }, 1000);
                    }
                })
            }else{
                Toast('请输入关闭原因');
            }

        }
    }
  }
</script>


<style lang="scss" scoped>
.orderDetail{
	background: #EFEFF4;
    position:relative;
	.Box1{
		width: 100%;
		background: #fff;
		padding-top: 20px;
		padding-left: 30px;
		padding-right:30px;
		box-sizing: border-box;
		h5{
            word-wrap: break-word;
			font-size: 32px;
			color: #333333;
			font-weight:550;
		}
		p{
			font-size: 26px;
			color: #999999;
			margin-top: 9px;
			padding-bottom: 22px;
			border-bottom: 1px solid #E5E5E5;
		}
		.imgArea{
			display:block;
			width: 100%;
			margin-top: 20px;
			box-sizing: border-box;
		}
		.text{
            word-wrap: break-word;
			box-sizing: border-box;
			padding-top: 20px;
			padding-bottom: 25px;
			font-size: 28px;
			color: #333333;
			letter-spacing: 0;
			line-height: 42px;
		}
	}
	.Content{
		width: 100%;
		margin-top: 30px;
        margin-bottom:140px;
		padding-left: 30px;
		background: #fff;
		box-sizing: border-box;
		padding-bottom: 200px;
		.title{
			border-bottom: 1px solid #E5E5E5;
			padding-top: 24px;
			padding-bottom: 20px;
			display: flex;
			img{
				width: 42.5px;
				height: 42.5px;
				margin-right: 18.5px;
			}
			span{
				font-size: 32px;
				color: #333333;
				letter-spacing: 0;
			}
		}
		.cont{
			border-bottom: 1px solid #E5E5E5;
			padding-top: 30px;
			padding-bottom: 30px;
			padding-right: 31px;
			box-sizing: border-box;
			.deve{
				font-size: 28px;
				color: #333333;
				letter-spacing: 0;
				line-height: 42px;
                span{
                    color:#576B95 ;
                }
			}
			.repeat{
				font-size: 28px;
				color: #151515;
				line-height: 40px;
				span{
					font-size: 28px;
					color: #999999;
				}
			}
			.time{
				font-size: 26px;
				color: #999999;
			}
		}
	}
    .inputPop{
        position: fixed;
        bottom: 0;
        height:88px;
        line-height:88px;
        background: #F0F1F2;
        width:100%;
        display: flex;
        align-items: center;
        textarea{
            margin:0 30px;
            width:80%;
            line-height:66px;
            height:66px;
            border:none;
            border-radius: 6px;
        }
    }
	.btns{
        position:fixed;
        bottom:0;
		width: 100%;
		background: #fff;
		display: flex;
		justify-content: center;
		padding: 24px 0;
		.done,.quess{
			width: 300px;
			height: 70px;
			border-radius: 10px;
			text-align: center;
			line-height: 70px;
		}
		.done{
			background: #FFFFFF;
			border: 2px solid #00AE66;
			color: #00AE66;
			margin-right: 57px;
		}
		.quess{
			background: #00AE66;
			color: #fff;
		}
	}
    .popup{
       /* width:74.4%;*/
       /* height: 33.3%;*/
        width: 70%;
        padding-top:30px;
        box-sizing:border-box;
        background: #FFFFFF;
        border-radius: 8px;
        .title{
            font-size: 36px;
            color: #333333;
            text-align: center;
        }
        .tishi{
            margin-top:20px;
            font-size: 28px;
            color: #666666;
            line-height: 40px;
        }
        textarea{
            font-size:28px;
            padding: 17px 20px;
            box-sizing: border-box;
            border:none;
            margin-top:20px;
            width: 100%;
            background: #EFEFF4;
            border-radius: 6px;
            height:114px;

        }
        .myButton{
            display: flex;
            justify-content: space-between;
            border-top: 1px solid #E5E5E5;
            height: 100px;
            line-height: 100px;
            margin-top:25px;
            span{
                width:50%;
                text-align: center;
            }
        }
    }

}
/*.clearfloat:after{display:block;clear:both;content:"";visibility:hidden;height:0;zoom: 1;} */
</style>
