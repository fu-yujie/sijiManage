<template>
    <div>
        <div v-show=" src==''" class="add-img img-box" @click="uploadInput()" style="display:inline-block">
            <img src="../../../static/img/upload.png" alt="" id="img">
            <div class="click">点此上传</div>
            <!--<i class="iconfont icon-tianjiazhaopian"></i>-->
        </div>
        <div class="img-box" @click.prevent="uploadInput()" v-show="src!=''" style="display:inline-block">

            <img :src="src" alt="" ref="img">
        </div>

        <input type="file" ref="file" name="file" accept="image/*" v-on:change="upload()" hidden>
    </div>
</template>
<script>
   /* import {activation} from '../api/index'*/
    import {Actionsheet} from 'mint-ui';
    import {Toast} from "mint-ui";
    import {Navbar, TabItem} from "mint-ui";
    import {Indicator} from 'mint-ui';
    import {MessageBox} from 'mint-ui';
    import {DatetimePicker} from 'mint-ui';
    import {InfiniteScroll} from 'mint-ui';
    /* import config from '../../../api/web_config'
     import axios from 'axios'*/
    /* axios.defaults.withCredentials = true;*/
    /* import {uploadImg} from '../../../api/web_index'*/
    export default {
        props: {
            srcFromParent: {
                type: String,
                default: ''
            },
            uploadUrl: {
                type: String,
                default: ''
            },
            addClearSrc: {},
            type: ''
        },
        data() {
            return {
                file: '',
				src:''
            }
        },
        mounted() {
            var _this = this;
            this.src = _this.srcFromParent;

        },
        methods: {

            uploadInput() {
                /*console.log('this.$refs.file', this.$refs.file)*/
                this.$refs.file.click();
            },
            upload(e) {
                Indicator.open({
                    spinnerType: 'fading-circle'
                });
                var _this = this;

                if (this.$refs.file.files.length == 0) {
                    setTimeout(() => {
                        Indicator.close();
                    }, 100);
                    return;
                }
                let files = this.$refs.file.files;
                if (files[0].type.indexOf("image") < 0) {

                    Toast({
                        message: '上传了非图片',
                        position: 'middle',
                        duration: 1500
                    });
                    setTimeout(() => {
                        Indicator.close();
                    }, 100);
                    return;
                }
                if (files[0].size > 1024*1024*4) {
                    Toast({
                        message: '上传文件过大',
                        position: 'middle',
                        duration: 1500
                    });
                    setTimeout(() => {
                        Indicator.close();
                    }, 100)
                    return;
                }

                // var reader=new FileReader();
                // reader.readAsDataURL(this.$refs.file.files[0]);
                // reader.onload=function () {
                // console.log('_this.src',_this.src);
                //   _this.src=this.result;
                //   _this.$emit('upimg', this.result);
                //   Indicator.close();
                // };


                //图片压缩
                // function compress(event, callback) {
                //var inputID="file";
                //图片方向角 added by lzk
                var Orientation = null;

                /*console.log(_this.$refs.file.files[0]);*/
                var file = _this.$refs.file.files[0];


                //获取照片方向角属性，用户旋转控制
                EXIF.getData(file, function () {
                    // alert(EXIF.pretty(this));
                    EXIF.getAllTags(this);
                    //alert(EXIF.getTag(this, 'Orientation'));
                    Orientation = EXIF.getTag(this, 'Orientation');
                    //return;
                });

                var reader = new FileReader();
                reader.onload = function (e) {
                    // var image = $("<img />");
                    var image = document.createElement("img");
                    image.onload = function () {
                        var canvas = document.createElement("canvas");
                        var x = this.width;
                        var y = this.height;
                        this.width = 375 * 2;
                        this.height = this.width / x * y;
                        var width = this.width;
                        var height = this.height;

                        canvas.width = this.width;
                        canvas.height = this.height;

                        var context = canvas.getContext("2d");
                        context.clearRect(0, 0, width, height);

                        // context.drawImage(this, 0, 0, this.width, this.height);
                        switch (Orientation) {
                            case 3:
                                context.rotate(180 * Math.PI / 180);
                                context.drawImage(this, -this.width, -this.height, this.width, this.height);
                                break;
                            case 6:
                                context.rotate(90 * Math.PI / 180);
                                context.drawImage(this, 0, -this.width, this.height, this.width);
                                break;
                            case 8:
                                context.rotate(270 * Math.PI / 180);
                                context.drawImage(this, -this.height, 0, this.height, this.width);
                                break;
                            case 2:
                                context.translate(this.width, 0);
                                context.scale(-1, 1);
                                context.drawImage(this, 0, 0, this.width, this.height);
                                break;
                            case 4:
                                context.translate(this.width, 0);
                                context.scale(-1, 1);
                                context.rotate(180 * Math.PI / 180);
                                context.drawImage(this, -this.width, -this.height, this.width, this.height);
                                break;
                            case 5:
                                context.translate(this.width, 0);
                                context.scale(-1, 1);
                                context.rotate(90 * Math.PI / 180);
                                context.drawImage(this, 0, -this.width, this.height, this.width);
                                break;
                            case 7:
                                context.translate(this.width, 0);
                                context.scale(-1, 1);
                                context.rotate(270 * Math.PI / 180);
                                context.drawImage(this, -this.height, 0, this.height, this.width);
                                break;
                            default:
                                context.drawImage(this, 0, 0, this.width, this.height);
                        }


                        var quality = 0.6; //可以理解为压缩程度
                        //quality :图片质量。0 到 1 之间的数字，并且只在格式为 image/jpeg 或 image/webp 时才有效，如果参数值格式不合法，将会被忽略并使用默认值
                        var data;
                        var result;
                        var length;
                        //处理图片过大问题
                        //控制图片上传的大小，注意若图片过大 ajax上传的时候会出现参数为null的错误
                        //这里如果图片过大会将图片压缩程度放大
                        do {
                            data = canvas.toDataURL("image/jpeg", quality); //压缩图片
                            length = data.length;
                            result = (length / 4 * 3 + 1023) / 1024; //计算压缩后图片的大小（单位：KB）
                           /* console.log("result:" + result);*/
                            quality -= 0.05;
                        } while (result > 450);
                        //data：base64
                        // callback(data, _this.$refs.file.files[0]); //回调函数
                        _this.src = data;
                        _this.$emit('upimg', data);
                        Indicator.close();
                    };
                    // image.attr("src", e.target.result);
                    image.src = e.target.result;
                };
                reader.readAsDataURL(file);


                // }
            }

        },
        watch: {
            srcFromParent(n, o) {
                this.src = n;
            }

        }
    }
</script>
<style scoped="">
    .add-img {
        border: 1px dashed #aaa;
        /*line-height:170px;*/
        text-align: center;
        padding: 50px;
        box-sizing: border-box;
    }

    .img-box {
        /* margin:0 auto;*/
        width: 100%;
        height: 227px;
        overflow: hidden;
    }

    .add-img:hover {
        /* border:1px dashed #1e90ff;*/
    }

    .add-img i {
        font-size: 73px;
        color: #9ea4b1;
    }

    #img {
        height: 70px;
        width: auto
    }

    .img-box img {
        width: 100%;
        height: 100%;
    }
</style>
