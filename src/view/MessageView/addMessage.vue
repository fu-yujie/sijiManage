<template>
	<div class="addMessage" id="addMessage">
		<div class="header" @click="selectCity('popupVisible')">

            市
			<div style="float: right;color:#999999">{{cityText1}}<span v-if="cityShow">{{cityText}}</span></div>
			<i></i>
		</div>
		<div class="header" @click="selectArea('popupVisible1')">

            区、县
			<div style="float: right;color:#999999">{{quxianText1}}<span v-if="quxianShow">{{quxianText}}</span></div>
			<i></i>
		</div>
		<div class="header" @click="selectTown('popupVisible2')">

            街道、镇、乡
			<div style="float: right;color:#999999">{{zhenText1}}<span v-if="zhenShow">{{zhenText}}</span></div>
			<i></i>
		</div>
		 <div class="header" @click="selectStreet('popupVisible3')">

             社区、村
             <div style="float: right;color:#999999">{{streetText1}}<span v-if="streetShow">{{streetText}}</span></div>
            <i></i>
        </div>
		<div class="header bumenBox" @click="selectBumen()" style="overflow: hidden">

            部门
            <div   style="float: right;color:#999999;width:80%;text-align: right">{{depText1}}
            <div v-if="bumenShow" class="bumenText">
			    <span  v-for="(item,index) in value" v-bind:key="index">
					{{item}}{{index == value.length - 1 ? '' : ','}}
				</span>
            </div></div>
            <i></i>
		</div>
		<div class="content">
			<!--<p class="speLine"></p>-->
			<mt-field  label="标题" id='titleInp' @input="titleInp" placeholder="请输入标题"  v-model="Title"></mt-field>
            <p class="speLine"></p>
            <mt-field label="内容" id='conInp' @input="entrytext" placeholder="请输入正文内容" type="textarea" :attr="{maxlength: 1000}" rows="4" v-model="introduction"></mt-field>
			<div class='countNum'>{{introduction.length}}/1000</div>
		</div>
		<div class="upload">
			<div class="tit">上传图片 <span>图片大小不超过4M</span></div>
			<UploadImg @changeImg="getImg" class="up"></UploadImg>
			<div class='imgshow'>
				<div v-for='(item, index) in imgUrl' :key="index">
					<i @click='delImg(index)'></i>
					<img :src="item" alt="" :class="`img${index}`" @click="enlarge(index)">
				</div>
			</div>
		</div>
		<div class="play" :class="footState == true ? '' : 'play-newStyle' ">
			<mt-button  type="default" class="cancel" @click="cancels()">取消</mt-button>
			<mt-button type="default" class="sub" @click="OrderSub()" :disabled="isDisable">提交</mt-button>
		</div>
		<mt-popup :closeOnClickModal="false" style="width:100%" v-model="popupVisible" popup-transition="popup-fade" position="bottom">
			<div class="head" style="height:40px;display:flex;justify-content: space-between;background:#FBF9FE;border-bottom:1px solid #DFDFDF;">
				<div class="popButton" style="margin-left:15px;" @click="close">取消</div>
				<div class="popButton" style="color:#333333">请选择市</div>
				<div class="popButton" style="margin-right:15px;" @click="tru">确定</div>
			</div>
			<mt-picker ref="slots" :slots="slots" @change="onValuesChange"></mt-picker>
			<!--<mt-picker :slots="slots1" @change="onValuesChange1"></mt-picker>
            <mt-picker :slots="slots2" @change="onValuesChange2"></mt-picker>
            <mt-picker :slots="slots3" @change="onValuesChange3"></mt-picker>-->
		</mt-popup>
		<mt-popup :closeOnClickModal="false" style="width:100%" v-model="popupVisible1" popup-transition="popup-fade" position="bottom">
			<div class="head" style="height:40px;display:flex;justify-content: space-between;background:#FBF9FE;border-bottom:1px solid #DFDFDF;">
				<div class="popButton" style="margin-left:15px;" @click="close1">取消</div>
				<div class="popButton" style="color:#333333">请选择区、县</div>
				<div class="popButton" style="margin-right:15px;" @click="tru1">确定</div>
			</div>

			<mt-picker ref="slots1" :slots="slots1" @change="onValuesChange1"></mt-picker>
		</mt-popup>
		<mt-popup :closeOnClickModal="false" style="width:100%" v-model="popupVisible2" popup-transition="popup-fade" position="bottom">
			<div class="head" style="height:40px;display:flex;justify-content: space-between;background:#FBF9FE;border-bottom:1px solid #DFDFDF;">
				<div class="popButton" style="margin-left:15px;" @click="close2">取消</div>
				<div class="popButton" style="color:#333333">请选择街道、镇、乡</div>
				<div class="popButton" style="margin-right:15px;" @click="tru2">确定</div>
			</div>

			<mt-picker ref="slots2" :slots="slots2" @change="onValuesChange2"></mt-picker>
		</mt-popup>
		<mt-popup :closeOnClickModal="false" style="width:100%" v-model="popupVisible3" popup-transition="popup-fade" position="bottom">
			<div class="head" style="height:40px;display:flex;justify-content: space-between;background:#FBF9FE;border-bottom:1px solid #DFDFDF;">
				<div class="popButton" style="margin-left:15px;" @click="close3">取消</div>
				<div class="popButton" style="color:#333333">请选择社区、村</div>
				<div class="popButton" style="margin-right:15px;" @click="tru3">确定</div>
			</div>
			<mt-picker ref="slots3" :slots="slots3" @change="onValuesChange3"></mt-picker>
		</mt-popup>
		<mt-popup :closeOnClickModal="false" style="width:100%" v-model="popupVisible4" popup-transition="popup-fade" position="bottom">
			<div class="head" style="height:40px;display:flex;justify-content: space-between;background:#FBF9FE;border-bottom:1px solid #DFDFDF;">
				<div class="popButton" style="margin-left:15px;" @click="close4">取消</div>
				<div class="popButton" style="color:#333333">请选择通知部门</div>
				<div class="popButton" style="margin-right:15px;" @click="tru4">确定</div>
			</div>
			<div style="height:200px;overflow: scroll">
				<mt-checklist title="" v-model="value" :options="slots4[0].values">
				</mt-checklist>
			</div>
			<!-- <mt-picker :slots="slots4" @change="onValuesChange4"></mt-picker>-->
		</mt-popup>
	</div>

</template>

<script>
	import util from '../../../src/util/util.js'
    import UploadImg from "@/components/common/UploadImg.vue";
    import { Toast,Indicator } from 'mint-ui';
    import { AddNotice, GetWorkOrderDepartmentScope, GetWorkOrderLevelScope,GetNoticeScopeLevel} from '../../api'
import { setTimeout } from 'timers';
    export default {
        name: 'add-message',
        data() {
            return {
                cityShow:false,
                quxianShow:false,
                zhenShow:false,
                streetShow:false,
                bumenShow:false,
                footState: true,
                value:[],
                cityText:'',
                quxianText:'',
                zhenText:'',
                streetText:'',
                depText:[],
                cityText1:'请选择市',
                quxianText1:'请选择区、县',
                zhenText1:'请选择街道、镇、乡',
                depText1:'请选择通知部门',
                streetText1:'请选择社区、村',
                text:'',
                isDisable: false,
                Department: '选择通知部门',
                AcceptPersonnel: '1',
                DepartmentId: '0',
                Title: '',
                OperatorID: '',
                introduction: '',
                imgUrl: [],
                entrylength: 0,
                popupVisible: false,
                popupVisible1:false,
                popupVisible2:false,
                popupVisible3:false,
                popupVisible4:false,
                levelCode: '',
                bumenCode: '',
                bumen: '',
                code:'',
                cityCode:'',
                areaCode:'',
                zhenCode:'',
                streetCode:'',
                level:61,
                name:'',
                data:[],
                depList:[],
                depId:'',
                slots: [{
                    flex: 1,
                    values: [],
                    className: 'slot1',
                    textAlign: 'center',
                }],
                slots1: [{
                    flex: 1,
                    values: [],
                    className: 'slot1',
                    textAlign: 'center',

                }],
                slots2: [{
                    flex: 1,
                    values: [],
                    className: 'slot1',
                    textAlign: 'center',

                }],
                slots3: [{
                    flex: 1,
                    values: [],
                    className: 'slot1',
                    textAlign: 'center',

                }],
                slots4: [{
                    flex: 1,
                    values: [],
                    className: 'slot1',
                    textAlign: 'center',

                }],


            }
        },
        components: {
            UploadImg
        },
        created() {},
        mounted() {
            let t=this;
            let OperatorID = util.getlocal('OperatorID');
            this.OperatorID = OperatorID.OperatorID;

            this.level=61;
            this.code='';
            this.GetNoticeScope(null,()=>{

            });

           /*  $('#titleInp input').focus(function() {
                t.footState = false;
            }).blur(function() {
                t.footState = true;
            })
            $('#conInp textarea').focus(function() {
                t.footState = false;
            }).blur(function() {
                t.footState = true;
			}); */

			let winHei = document.body.clientHeight;
			document.getElementById("addMessage").style.minHeight = winHei + "px";
			document.getElementById("app").style.height = "auto";
		},
		beforeDestroy(){
			document.getElementById("app").style.minHeight = "";
			document.getElementById("app").style.height = "";
		},
        methods: {
            //获取部门范围
            async GetNoticeScope(visible,cb) {
                var obj = {};
                obj.OperatorID = this.OperatorID;
                obj.AreaCode=this.code;
                obj.Level=this.level;
                Indicator.open()
                try {
                    var res = await GetNoticeScopeLevel(obj);
                    Indicator.close()
                    if(visible != null){
                        this[visible] = true;
                    }
                    if(res.data.StatusCode != 0) {
                        Toast(res.data.Info)
                        return;
                    }

                    this.data=res.data.Data
                    cb();

                } catch(e){
                    console.log(e)
                } finally{
                    Indicator.close()
                }

            },

            selectCity(visible) {

                this.level=61;
                this.code='';
                /*this.data=[];*/

                this.GetNoticeScope(visible,()=>{
                    var name = this.data;
                    var i = name.length;
                    var arr = [];
                    var code = [];
                    for (var j = 0; j < i; j++) {
                        arr.push(name[j].AreaName);
                        code.push(name[j].AreaCode)
                    }
                    this.slots[0].values = arr;
                    this.slots[0].values1 = code;
                    this.levelCode = this.slots[0].values[0];
                    var len = this.slots[0].values.length;
                    for (var i = 0; i < len; i++) {
                        if (this.slots[0].values[i] == this.levelCode) {
                            this.code = this.slots[0].values1[i];
                            console.log(this.code);
                        }
                    }

                });







            },
            selectArea(visible){
                this.quxianShow=false;
                this.quxianText1='请选择区、县'
               /* this.popupVisible1 = true;*/
                this.level=62;
                var obj={};
                this.code=this.cityCode;
                this.GetNoticeScope(visible,() => {
                    if(this.cityText) {
                        var name = this.data;
                        var i = name.length;
                        var arr = [''];
                        var code = [''];
                        for (var j = 0; j < i; j++) {
                            arr.push(name[j].AreaName);
                            code.push(name[j].AreaCode)
                        }
                        this.slots1[0].values = arr;
                        this.slots1[0].values1 = code;
                        this.levelCode = this.slots1[0].values[0];
                        var len = this.slots1[0].values.length;
                        for (var i = 0; i < len; i++) {
                            if (this.slots1[0].values[i] == this.levelCode) {
                                this.code = this.slots1[0].values1[i];
                                console.log(this.code);
                            }
                        }

                    }else{
                        Toast('请选择市');
                        this.popupVisible1= false
                    }
                });
               /* this.slots[0].values=[]*/

            },
            selectTown(visible){
                this.zhenShow=false;
                this.zhenText1='请选择街道、镇、乡'
                this.level=71;
                var obj={};
               this.code=this.areaCode;
               // alert(this.areaCode)
                this.GetNoticeScope(visible,()=>{
                    if(this.quxianText){
                        var name = this.data;
                        var i = name.length;
                        var arr = [''];
                        var code = [''];
                        for(var j = 0; j < i; j++) {
                            arr.push(name[j].AreaName);
                            code.push(name[j].AreaCode)
                        }
                        this.slots2[0].values = arr;
                        this.slots2[0].values1 = code;
                        this.levelCode = this.slots2[0].values[0];
                        var len = this.slots2[0].values.length;
                        for(var i = 0; i < len; i++) {
                            if(this.slots2[0].values[i] == this.levelCode) {
                                /* this.code = this.slots2[0].values1[i];
                                 console.log(this.code);*/
                            }
                        }
                    }else{
                        Toast('请选择区、县');
                        this.popupVisible2 = false

                    }
                });


            },
            selectStreet(visible){
                this.streetShow=false;
                this.streetText1='请选择社区、村';
                /*this.popupVisible3 = true;*/
                this.level=72;
                var obj={};
                this.code=this.zhenCode;
                // alert(this.areaCode)
                this.GetNoticeScope(visible,()=>{
                    if(this.zhenText){
                        var name = this.data;
                        var i = name.length;
                        var arr = [''];
                        var code = [''];
                        for(var j = 0; j < i; j++) {
                            arr.push(name[j].AreaName);
                            code.push(name[j].AreaCode)
                        }
                        this.slots3[0].values = arr;
                        this.slots3[0].values1 = code;
                        this.levelCode = this.slots3[0].values[0];
                        var len = this.slots3[0].values.length;
                        for(var i = 0; i < len; i++) {
                            if(this.slots3[0].values[i] == this.levelCode) {
                                /* this.code = this.slots2[0].values1[i];
                                 console.log(this.code);*/
                            }
                        }
                    }else{
                        Toast('请选择街道、镇、乡');
                        this.popupVisible3 = false

                    }
                });
            },
            selectBumen(){
                this.depText1='请选择通知部门';
                this.bumenShow=false;
               /* this.depText1=''*/
                this.popupVisible4 = true;
              /*  this.code=this.areaCode;*/
                /*this.GetNoticeScope();*/

            },
			//放大图片
			enlarge(index){
				console.log(index);
				$(`.img${index}`).toggleClass('enlargeimg');
			},
            onValuesChange1(picker, values) {
                this.zhenText='';
                this.zhenText1='请选择街道、镇、乡';
                this.streetText='';
                this.streetText1='请选择社区、村';
                this.value=[];
                this.depText1='请选择通知部门'
                console.log(values);
               /* this.text=values[0];*/
               this.quxianText=values[0];
                this.name = values[0];
                var len = this.slots1[0].values.length;
                if(len.length != 0) {
                    for (var i = 0; i < len; i++) {
                        if (this.slots1[0].values[i] == this.name) {
                            this.areaCode = this.slots1[0].values1[i];

                        }
                    }

                }

            },
            onValuesChange2(picker, values) {
                this.value=[];
                this.depText1='请选择通知部门';
                this.streetText='';
                this.streetText1='请选择社区、村';
                console.log(values);
              /*  this.text=values[0];*/
              this.zhenText=values[0];
                this.name = values[0];
                var len = this.slots2[0].values.length;
                if(len.length != 0) {
                    for (var i = 0; i < len; i++) {
                        if (this.slots2[0].values[i] == this.name) {
                            this.zhenCode = this.slots2[0].values1[i];

                        }
                    }

                }
            },
            onValuesChange3(picker, values) {
                console.log(values);
                this.value=[];
                this.depText1='请选择通知部门';
               /* this.text=values[0];*/
               this.streetText=values[0];
                this.name = values[0];
                var len = this.slots3[0].values.length;
                if(len.length != 0) {
                    for (var i = 0; i < len; i++) {
                        if (this.slots3[0].values[i] == this.name) {
                            this.streetCode = this.slots3[0].values1[i];

                        }
                    }

                }

            },
            onValuesChange4(picker, values) {
                console.log(values);
                this.depText=values[0];
                this.name = values[0];
                var len = this.slots4[0].values.length;
                if(len.length != 0) {
                    for (var i = 0; i < len; i++) {
                        if (this.slots4[0].values[i] == this.name) {
                            this.depId = this.slots4[0].values1[i];

                        }
                    }

                }
            },
            onValuesChange(picker, values) {
                this.quxianText='';
                this.quxianText1='请选择区、县';
                this.value=[];
                this.depText1='请选择通知部门';
                console.log(values);
                /*this.text=values[0];*/
                this.cityText=values[0];
                this.name = values[0];
                var len = this.slots[0].values.length;
                if(len.length != 0) {
                    for (var i = 0; i < len; i++) {
                        if (this.slots[0].values[i] == this.name) {
                            this.cityCode = this.slots[0].values1[i];
                        }
                    }
                }
            },
            close() {
                this.popupVisible = false;
                if(this.cityText){
                    this.cityText1=''
                }
                /*this.cityText=''*/
            },
            close1() {
            this.$refs.slots1.setValues(['']);
                this.popupVisible1 = false;
                if(this.quxianText){
                    /*this.quxianText1='';
                    this.zhenText1='';
                    this.value=[]*/
                    this.quxianText='';
                    this.quxianText1='请选择区、县';
                    this.zhenText='';
                    this.zhenText1='请选择街道、镇、乡';
                    this.value=[];
                    this.depText1='请选择通知部门'
                    this.tru()
                }
            },
            close2() {
                this.$refs.slots2.setValues(['']);
                this.popupVisible2 = false;
                if(this.zhenText){
                    /*this.zhenText1='';*/
                    /*this.quxianText='';
                    this.quxianText1='请选择区县';*/
                    this.zhenText='';
                    this.zhenText1='请选择街道、镇、乡';
                    this.value=[];
                    this.depText1='请选择通知部门'
                    this.tru1()
                }
            },
            close3() {
                this.$refs.slots3.setValues(['']);
                this.popupVisible3 = false;
                this.tru2()
            },
            close4() {
                this.popupVisible4 = false;
                if(this.value.length==0){
                    this.depText1='请选择通知部门'
                }
            },
            tru() {
                if(this.cityText==''){
                    this.popupVisible = false;
                    return
                }
                this.popupVisible = false;
                this.code='';
                this.level=61;
                this.GetNoticeScope(null,() => {
                    var name = this.data;
                    var i = name.length;
                    var arr = [];
                    var code = [];
                    for (var j = 0; j < i; j++) {
                        arr.push(name[j].departments);
                        code.push(name[j].AreaCode)
                    }
                    var len=code.length;
                    var arr1=[];
                    for(var i=0;i<len;i++){
                        if(code[i]==this.cityCode){
                            arr1 = name[0].departments;
                            console.log(arr1);
                        }
                    }




                    var list =arr1;
                    var n = list.length;

                    var arr2 = [];
                    var code2 = [];
                    for(var m = 0; m < n; m++) {
                        arr2.push(list[m].DepartmentName);
                        code2.push(list[m].DepartmentId)
                    }
                    this.slots4[0].values = arr2;
                    this.slots4[0].values1 = code2;
                    this.cityShow=true;
                    this.cityText1='';
                   /* this.cityText=this.text*/
                });


            },
            tru1() {
                if(this.quxianText==''){
                    this.popupVisible1 = false;
                    this.quxianText1='请选择区、县';
                    this.quxianText='';


                    //若区县选择为空
                    this.code='';
                    this.level=61;
                    this.GetNoticeScope(null,() => {
                        var name = this.data;
                        var i = name.length;
                        var arr = [];
                        var code = [];
                        for (var j = 0; j < i; j++) {
                            arr.push(name[j].departments);
                            code.push(name[j].AreaCode)
                        }
                        var len=code.length;
                        var arr1=[];
                        for(var i=0;i<len;i++){
                            if(code[i]==this.cityCode){
                                arr1 = name[0].departments;
                                console.log(arr1);
                            }
                        }




                        var list =arr1;
                        var n = list.length;

                        var arr2 = [];
                        var code2 = [];
                        for(var m = 0; m < n; m++) {
                            arr2.push(list[m].DepartmentName);
                            code2.push(list[m].DepartmentId)
                        }
                        this.slots4[0].values = arr2;
                        this.slots4[0].values1 = code2;
                       /* this.cityText1='';
                        this.cityText=this.text*/
                    });


                    return
                }
                this.popupVisible1 = false;
                this.code=this.cityCode;
                this.level=62;
                this.GetNoticeScope(null,cb=>{
                    var name = this.data;
                    var i = name.length;
                    var arr = [];
                    var code = [];

                    for(var j=0;j<i;j++){
                        if(name[j].AreaCode==this.areaCode){
                            arr = name[j].departments;
                            console.log(arr);
                        }
                    }




                    var list =arr;
                    var n = list.length;
                    var arr2 = [];
                    var code2 = [];
                    for(var m = 0; m < n; m++) {
                        arr2.push(list[m].DepartmentName);
                        code2.push(list[m].DepartmentId)
                    }
                    this.slots4[0].values = arr2;
                    this.slots4[0].values1 = code2;
                    /*if(this.quxianText){
                        this.quxianText1=''
                    }*/
                    if(this.quxianText!=''){

                        this.quxianText1='';
                        this.quxianShow=true;
                       /* this.quxianText=this.text*/
                    }else{

                        this.quxianText1='请选择区、县'
                        /*this.quxianText=''*/
                        this.quxianShow=false;
                    }
                    /*this.text = ""*/
                });


            },
            tru2() {
                if(this.zhenText==''){
                    this.popupVisible2 = false;
                    this.zhenText1='请选择街道、镇、乡';
                    this.zhenText='';


                    //若街道、镇、乡选择为空
                    this.code=this.cityCode;
                    this.level=62;
                    this.GetNoticeScope(null,cb=>{
                        var name = this.data;
                        var i = name.length;
                        var arr = [];
                        var code = [];

                        for(var j=0;j<i;j++){
                            if(name[j].AreaCode==this.areaCode){
                                arr = name[j].departments;
                                console.log(arr);
                            }
                        }




                        var list =arr;
                        var n = list.length;
                        var arr2 = [];
                        var code2 = [];
                        for(var m = 0; m < n; m++) {
                            arr2.push(list[m].DepartmentName);
                            code2.push(list[m].DepartmentId)
                        }
                        this.slots4[0].values = arr2;
                        this.slots4[0].values1 = code2;
                        /*if(this.quxianText){
                            this.quxianText1=''
                        }*/
                        /*if(this.text!=''){

                            this.quxianText1='';
                            this.quxianText=this.text
                        }else{

                            this.quxianText1='请选择区县'
                            this.quxianText=''
                        }
                        this.text = ""*/
                    });
                    return
                }
                this.popupVisible2 = false;
                this.code=this.areaCode;
                this.level=71;
                this.GetNoticeScope(null,cb=>{
                    var name = this.data;
                    var i = name.length;
                    var arr = [];
                    var code = [];

                    for(var j=0;j<i;j++){
                        if(name[j].AreaCode==this.zhenCode){
                            arr = name[j].departments;
                            console.log(arr);
                        }
                    }




                    var list =arr;
                    var n = list.length;
                    var arr2 = [];
                    var code2 = [];
                    for(var m = 0; m < n; m++) {
                        arr2.push(list[m].DepartmentName);
                        code2.push(list[m].DepartmentId)
                    }
                    this.slots4[0].values = arr2;
                    this.slots4[0].values1 = code2;
                    console.log(this.slots4[0].values);
                    if(this.zhenText!=''){


                        this.zhenText1='';
                        /*this.zhenText=this.text*/
                        this.zhenShow=true;
                    }else{
                        this.zhenText1='请选择街道、镇、乡';
                        /*this.zhenText=''*/
                        this.zhenShow=false;
                    }

                    this.text = ""
                });


            },
            tru3() {
               /* this.popupVisible3 = false;*/


                if(this.streetText==''){
                    this.popupVisible3 = false;
                    this.streetText1='请选择社区、村';
                    this.streetText='';



                    //若街道选择为空
                    this.code=this.areaCode;
                    this.level=71;
                    this.GetNoticeScope(null,cb=>{
                        var name = this.data;
                        var i = name.length;
                        var arr = [];
                        var code = [];

                        for(var j=0;j<i;j++){
                            if(name[j].AreaCode==this.zhenCode){
                                arr = name[j].departments;
                                console.log(arr);
                            }
                        }




                        var list =arr;
                        var n = list.length;
                        var arr2 = [];
                        var code2 = [];
                        for(var m = 0; m < n; m++) {
                            arr2.push(list[m].DepartmentName);
                            code2.push(list[m].DepartmentId)
                        }
                        this.slots4[0].values = arr2;
                        this.slots4[0].values1 = code2;
                        console.log(this.slots4[0].values);
                       /* if(this.text!=''){


                            this.zhenText1=''
                            this.zhenText=this.text
                        }else{
                            this.zhenText1='请选择街道、镇、乡';
                            this.zhenText=''
                        }

                        this.text = ""*/
                    });
                    return
                }
                this.popupVisible3 = false;
                this.code=this.zhenCode;
                this.level=72;
                this.GetNoticeScope(null,cb=>{
                    var name = this.data;
                    var i = name.length;
                    var arr = [];
                    var code = [];

                    for(var j=0;j<i;j++){
                        if(name[j].AreaCode==this.streetCode){
                            arr = name[j].departments;
                            console.log(arr);
                        }
                    }




                    var list =arr;
                    var n = list.length;
                    var arr2 = [];
                    var code2 = [];
                    for(var m = 0; m < n; m++) {
                        arr2.push(list[m].DepartmentName);
                        code2.push(list[m].DepartmentId)
                    }
                    this.slots4[0].values = arr2;
                    this.slots4[0].values1 = code2;
                    console.log(this.slots4[0].values);
                    /* this.zhenText1='';
                     if(this.zhenText){
                         this.zhenText1='';
                     }else{
                         this.zhenText1='请选择街道、镇、乡'
                     }*/
                    if(this.streetText!=''){


                        this.streetText1=''
                       /* this.streetText=this.text*/
                       this.streetShow=true;
                    }else{
                        this.streetText1='请选择社区、村';
                       /* this.streetText=''*/
                        this.streetShow=false;
                    }

                    this.text = ""
                });

            },
            tru4() {
                this.popupVisible4 = false;
                console.log(this.value);
                if(this.value.length==0){
                    this.depText1='请选择通知部门'
                }else{
                    this.depText1='';
                    this.bumenShow=true;
                }


            },
            cancels() {
                this.$router.push({
                    'name': 'Home'
                });
            },
            getImg({
                       base64,
                       blob,
                       imgFile
                   }) {
                /* 获取压缩后的图片 base64格式 blob格式 和imgFile */
                /* 建议只使用blob格式上传图片 base64文件过大在某些手机上会上传失败 */
                // console.log(base64, blob, imgFile);
                this.imgUrl.push(base64)
                /*console.log(base64);*/

            },
            delImg(i) {
                this.imgUrl.splice(i, 1);
                /*console.log(this.imgUrl);*/
            },
            entrytext() {
				/*this.entrylength = this.introduction.length;*/
				this.introduction = util.noFace( this.introduction );
				//去掉表情符号
				// let abc = util.noFace( this.introduction );
				// this.introduction = abc.replace(/\s+/g, "");
			},
			titleInp(){
				this.Title = util.noFace( this.Title );
				//去掉表情符号
				// let abc = util.noFace( this.Title );
				// this.Title = abc.replace(/\s+/g, "");
			},
            async OrderSub() {
               /* if(this.level == '') {
                    Toast('请选择通知部门');
                    return;
				}*/

                // if(this.depId == '') {
                //     Toast('请选择通知部门');
                //     return;
				// }

				this.introduction = util.noFace( this.introduction );
				// alert("this.introduction:" + this.introduction)

				this.Title = util.noFace( this.Title );
                if(!this.cityText) {
                    Toast('请选择市');
                    return;
                }
                if(this.Title == '') {
                    Toast('标题不能为空');
                    return;
                }
                if(this.introduction == '') {
                    Toast('内容不能为空');
                    return;
                }
               /* if(this.imgUrl.length == 0) {
                    Toast('请上传照片');
                    return;
                }*/
                if(this.imgUrl.length >5){
                    Toast('上传的照片不能多于5张');
                    return;
                }

                let obj = {};

                var len=this.value.length;
                var len1=this.slots4[0].values.length;
                console.log(this.slots4[0].values);
                var arr=[];
                for(var i=0;i<len;i++){
                    for(var j=0;j<len1;j++){
                        if(this.value[i]==this.slots4[0].values[j]){
                            arr.push(this.slots4[0].values1[j])
                        }
                    }
                }
                /*alert(arr);*/
                /*obj.AcceptPersonnelID=this.code;*/
                obj.Title = this.Title;
                obj.ImageList = this.imgUrl;
                obj.Content = this.introduction;
                obj.OperatorID = this.OperatorID;
                /*obj.AcceptPersonnel = this.levelCode;*/
                obj.DepartmentId = arr.join(',');
                if(this.cityText&&!this.quxianText){
                    obj.AcceptPersonnel=1;
                    obj.AcceptPersonnelID=this.cityCode
                }else if(this.quxianText&&!this.zhenText){
                    obj.AcceptPersonnel=2;
                    obj.AcceptPersonnelID=this.areaCode
                }else if(this.zhenText&&!this.streetText){
                    obj.AcceptPersonnel=3;
                    obj.AcceptPersonnelID=this.zhenCode
                }else if(this.streetText){
                    obj.AcceptPersonnel=4;
                    obj.AcceptPersonnelID=this.streetCode
                }
                console.log(obj)
                this.isDisable = true;
                let res = await AddNotice(obj);
                console.log(res);
                if(res.data.StatusCode == 0) {
                    Toast('发布成功');
                    this.isDisable = false;
                    setTimeout(() => {
                        this.$router.push({
                            'name': 'Home'
                        });
                    }, 1000);
                }else{
                    this.isDisable = false;
                    Toast(res.data.Info)
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .play-newStyle{
        position: relative!important;
        margin-top:20px;
    }
	.addMessage {
      /*  height:100%;*/
        position:relative;
		background-color: #EFEFF4;
		padding-bottom: 150px;
		.enlargeimg{
			position: fixed;
			top: 0;
			left: 0;
			margin-left: 0px;
			z-index: 1000;
			width: 400px;
		}
		.popButton {
			display: inline-block;
			/* border-bottom: 1px solid #E5E5E5;*/
			/*width: 50%;*/
			font-size: 32px;
			height: 80px;
			line-height: 80px;
			color: #00AE66
		}
		.header {
			width: 750px;
			// color: #EF6C37;
			// padding-left: 80px;
            min-height:88px;
			text-align: left;
			font-size: 28px;
			line-height: 88px;
			background: #ffffff;
            box-sizing: border-box;
            padding-left: 40px;
            padding-right: 80px;
			background-size: 38px 38px;
			position: relative;
			.bumenText{
				text-align: left;
				float: right;
				color:#999999;
			}
            img{
                width:35px;
                height:35px;
                position: absolute;
                top:30px;
                left:30px;
            }
			i {
				position: absolute;
				right: 30px;
				top: 30px;
				width: 16px;
				height: 26px;
				background: url('../../../static/img/Chevron.png') no-repeat center;
				background-size: contain;
				z-index: 99;
			}
		}
		.bumenBox{
			line-height: 56px;
			padding-top:16px;
			padding-bottom:16px;
		}
		.content {
            margin-top: 30px;
            position: relative;
			.speLine {
				width: calc(100% - 30px);
				height: 1px;
				border-bottom: 1px solid #E5E5E5;
				position: absolute;
				left: 30px;
				z-index: 1;
			}
			.countNum {
				background: #fff;
				padding: 0 20px 10px;
				text-align: right;
				color: #999;
			}
		}
		.upload {
			background: #ffffff;
			margin-top: 30px;
            // padding-bottom:208px;
			width: 750px;
			.tit {
                font-weight:bold;
				padding: 25px 0 0 30px;
				span {
                    margin-left:22px;
                    font-weight:normal;
					font-family: PingFangSC-Regular;
					font-size: 24px;
					color: #999999;
					letter-spacing: 0;
				}
			}
			.up {
				text-align: center;
			}
			.imgshow {
				padding-bottom: 25px;
				background: #fff;
				font-size: 0;
				div {
					display: inline-block;
					padding: 10px;
					width: 22%;
					text-align: center;
					height: 150px;
					position: relative;
					img {
						width: 100%;
						height: 100%;
					}
					i {
						position: absolute;
						display: inline-block;
						width: 1.6rem;
						height: 1.6rem;
						background:url('../../../static/img/delet.png') no-repeat center;
						top: -6%;
						right: -6%;
					}
				}
			}
		}
		.play {
            z-index:100;
            position: absolute;
            bottom: 0;
			/*margin-top: 350px;*/
			height: 118px;
			width: 750px;
			background: #fff;
			.cancel {
				border: 2px solid #00AE66;
				border-radius: 10px;
				width: 301px;
				height: 70px;
				margin: 24px 0 0 45px;
				color: #00AE66;
			}
			.sub {
				background: #00AE66;
				border-radius: 10px;
				width: 301px;
				height: 70px;
				margin-left: 57px;
				color: #FFFFFF;
			}
		}
	}
</style>
