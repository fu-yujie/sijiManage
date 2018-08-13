<template>
	<div class="addContact">
		<div class="selectType">
			<div class="title">请选择人员类型</div>
			<div class="type">
				<div class="item" @click="tabChange(item)" v-for="(item,index) in lists" :class="{cur: item.isSelect}">
					<div class="checked">
						<img src="../../static/img/checked.png" alt="">
					</div>
					{{item.name}}
				</div>
				<!--<div class="item"  @click="tabChange(2)">-->
				<!--<div class="checked">-->
				<!--<img  src="../../static/img/checked.png" alt="">-->
				<!--</div>-->
				<!--帮扶干部</div>-->
				<!--<div class="item"  @click="tabChange(3)">-->
				<!--<div class="checked">-->
				<!--<img  src="../../static/img/checked.png" alt="">-->
				<!--</div>-->
				<!--基层干部</div>-->
			</div>
		</div>

		<div class="form">
			<div class="item">
				<div class="left">姓名</div>
				<input class="right" maxlength="50" required="required" v-model="name" type="text" placeholder="请输入姓名">
			</div>
			<div class="item" @click="unitClick" style="height:auto;overflow: hidden">
				<div class="left" style="float: left">单位</div>
				<div class="select" style="display: inline-block">
					<span v-if="noChoice">请选择单位</span>
					<span style="color:#333" v-if="unitValue.City">{{unitValue.City}}-</span>
					<span style="color:#333" v-if="unitValue.Area">{{unitValue.Area}}-</span>
					<span style="color:#333" v-if="unitValue.Town">{{unitValue.Town}}-</span>
					<span style="color:#333" v-if="unitValue.Street">{{unitValue.Street}}-</span>
					<span style="color:#333" v-if="unitValue.Name">{{unitValue.Name}}</span>
				</div>
				<!--<input class="right" v-model="unitValue" type="text" placeholder="请选择单位">-->
				<img src="../../static/img/Chevron.png" alt="">
			</div>
			<div class="item">
				<div class="left">职务</div>
				<input v-model="job" maxlength="100" class="right" type="text" placeholder="请输入职务">
			</div>
			<div class="item">
				<div class="left">联系方式</div>
				<input class="right" maxlength="11" v-model="phone" type="number" placeholder="请输入联系方式">
			</div>
			<div class="item" @click="rangeClick" v-if="areaShow">
				<div class="left">扶贫领域</div>
				<input v-model="typeValue" disabled class="right" id="rangeInput" type="text" placeholder="请选择扶贫领域">
				<img src="../../static/img/Chevron.png" alt="">
			</div>
		</div>
		<div class="saveButton" @click="save">保存</div>

		<!--//领域弹窗-->
		<mt-popup
			v-model="typeVisible"
			position="bottom" style="width:100%;"
			id="AreaVisible"
		>
			<p class="popBar">
				<span @click="typeCancle">取消</span>
				<i>请选择扶贫领域</i>
				<em @click="typeSure">确定</em>
			</p>
			<div class="searchPicker">
				<ul id="choseSlotArea">
                    <li v-for=" (item,index) in slotArea " :key="index" @click="choseSlotArea(index)">
                        {{ item.textV }}
						<div>
							<img src="../../static/img/checked.png" alt="">
						</div>
                    </li>
                </ul>
				<!--<mt-checklist title="" v-model="selectvalue" :options="slotArea">
				</mt-checklist>-->
			</div>
		</mt-popup>


	</div>
</template>

<script>
	import { Indicator } from 'mint-ui';
	import util from '../../src/util/util.js'
	import { Search} from 'mint-ui';
	import {GetOrderType,AddPeopleContact,GetPeopleContactById,UpdatePeopleContact} from '../api'
	export default {
		name: "add-contact",
		data() {
			return {
				OperatorID:'',
				name:'',
				job:'',
				phone:'',
				noChoice: true,
				areaShow: true,
				unitValue: '',
				curVal: 1,
				typeValue:'',
				typeValueModel:'',
				typeCode: '',
				typeVisible: false,
				/* 领域列表 */
				PovertyAreaList: [],
				/* 领域盒子 */
				slotArea: [],
				selectvalue: [],
				typeList:[],//从详情获取的联系人的类型数组
				lists: [
					{name: '帮扶行动负责人', id: 1, isSelect: false},
					{name: '帮扶干部', id: 2, isSelect: false},
					{name: '基层干部', id: 3, isSelect: false}
				],

			}
		},
		watch: {
			lists: 'a'
		},
		mounted(){
			let OperatorID = util.getlocal('OperatorID');
			this.userInfo = OperatorID;
			//新接口都用guid
			this.OperatorID = this.userInfo.PeopleGuid;
			this.GetOrderType();
			//获取联系人详情
			if(!util.getlocal('isSearch')){
				this.GetPeopleContactById();
				this.$parent.detailValue=''
			}

			//从搜索页返回保持状态
			var data=util.getlocal('inputDetail');
			if(data){
			this.toInput(data);
			this.unitValue = this.$parent.value||this.$parent.detailValue;
			if (this.unitValue == '') {
				this.noChoice = true
			} else {
				this.noChoice = false
			}
			}

			//从搜索页返回重新判断扶贫领域是否显示
			if (this.lists[0].isSelect) {
				this.areaShow = true
			} else {
				this.typeCode='';
				this.areaShow = false
			}

		},
		/*activated(){
			this.unitValue = this.$parent.value||this.$parent.detailValue;
			if (this.unitValue == '') {
				this.noChoice = true
			} else {
				this.noChoice = false
			}
		},*/
		created() {
			/*this.unitValue='';*/

		},
		beforeRouteEnter (to, from, next) {
			console.log(to);


			next(vm => {
				if(to.query.isEdit){
					document.title='编辑人员'
				}
				// 通过 `vm` 访问组件实例
			})
		},
		methods: {
			//获取领域
			async GetOrderType(){
				try{
					var obj={};
					obj.CodeTypes=['EnumGovInfoTag'];
					obj.OrderBy='';
					let result = await GetOrderType(obj);
					this.PovertyAreaList = result.data.Data;
					let slotAreaBox = {};
					this.PovertyAreaList.forEach(item => {
						slotAreaBox = {
							codes: item.CodeValue,
							textV: item.Description
						}
						this.slotArea.push(slotAreaBox);
					});
					this.choseSlotArea(this.typeCode-1);
					this.typeValue=this.typeValueModel
				}catch (error) {
					console.log(error)
				}

			},
			//获取联系人详情
			async GetPeopleContactById(){
				Indicator.open()
				let obj={
					Id:this.$route.query.Id,
					OperatorGuid:this.OperatorID
				};
				let result = await GetPeopleContactById(obj);
				Indicator.close();
				if(result.data.StatusCode==0){
					let data=result.data.Data
					this.name=data.Name;
					this.unitValue={
						CityCode:data.CityCode,
						City:data.City,
						AreaCode:data.AreaCode,
						Area:data.Area,
						TownCode:data.TownCode,
						Town:data.Town,
						StreetCode:data.StreetCode,
						Street:data.Street,
						Name:data.Department,
						Id:data.DepartmentId,
						Level:data.Level
					};
					this.$parent.detailValue=this.unitValue
					this.job=data.Job;
					this.phone=data.Phone;
					/*this.typeValue=data.PovertyAlleviation;*/
					this.typeCode=data.PovertyAlleviation;
					this.typeList=data.UserType.split(',');
					console.log('数组'+this.typeList);
					this.typeList.pop();
					/*this.typeList.forEach((item,index)=>{
						this.tabChange(this.lists[index]);
					});*/
					for(var i=0;i<this.typeList.length;i++){
						for(var j=0;j<this.lists.length;j++){
							if(this.typeList[i]==this.lists[j].id){
								this.lists[j].isSelect=true;
							}
						}
					}
					if (this.lists[0].isSelect) {
						this.areaShow = true
					} else {
						this.typeCode='';
						this.areaShow = false
					}
					if(this.unitValue == '') {
						this.noChoice = true
					} else {
						this.noChoice = false
					}
					this.GetOrderType()
				}
				/*this.tabChange(this.lists[0]);*/

			},
			//往表单中赋值
			toInput(data){
				this.name=data.Name;
				this.job=data.Job;
				this.phone=data.Phone;
				/*this.typeValue=data.PovertyAlleviation;*/
				this.typeCode=data.PovertyAlleviation;
				this.typeList=data.UserType.split(',');
				console.log('数组'+this.typeList);
				this.typeList.pop();
				/*this.typeList.forEach((item,index)=>{
					this.lists.forEach((item,index)=>{
						if(this.typeList[index]==this.lists[index].id){
							this.lists[index].isSelect=true;
							console.log('arr'+this.lists[index])
							this.tabChange(this.lists[index]);
						}
					})

				});*/
				for(var i=0;i<this.typeList.length;i++){
					for(var j=0;j<this.lists.length;j++){
						if(this.typeList[i]==this.lists[j].id){
							this.lists[j].isSelect=true;
						}
					}
				}

				if(this.unitValue == '') {
					this.noChoice = true
				} else {
					this.noChoice = false
				}
				this.GetOrderType()
			},
			rangeClick() {
				this.typeVisible = true;
			},
			unitClick() {
				var typeList=[];
				for(var i=0;i<this.lists.length;i++){
					if(this.lists[i].isSelect){
						typeList.push(this.lists[i].id)
					}
				}
				let obj={
					UserType:typeList.join(',')+',',
					Name:this.name,
					Job:this.job,
					Phone:this.phone,
					PovertyAlleviation:this.typeCode,

				}
				util.setlocal('inputDetail', obj);
				this.$router.push('/search')
			},
			typeCancle() {
				this.typeVisible = false;
			},
			typeSure() {
				this.typeValue=this.typeValueModel
				this.typeVisible = false;
			},
			choseSlotArea(liIndex) {
				this.typeCode = this.slotArea[liIndex].codes;
				this.typeValueModel = this.slotArea[liIndex].textV;
				$("#choseSlotArea li").eq(liIndex).addClass("cur").siblings("li").removeClass("cur");

			},
			save() {

				var _this=this;
				console.log(this.lists);
				var typeList=[]
				for(var i=0;i<this.lists.length;i++){
					if(this.lists[i].isSelect){
						typeList.push(this.lists[i].id)
					}
				}
				console.log(typeList);
				if(typeList.length == 0){
					util.toastinfo('请选择人员类型');
					return
				}
				if(this.name.length == 0){
					util.toastinfo('请输入姓名');
					return
				}
				if(!this.unitValue.Id){
					util.toastinfo('请选择单位');
					return
				}
				if(this.job.length == 0){
					util.toastinfo('请输入职务');
					return
				}
				if(this.phone == ''){
					util.toastinfo('请输入联系方式');
					return
				}else if(this.phone.length!=11){
					util.toastinfo('联系方式格式不正确');
					return
				}
				if(this.typeCode == ''&&this.areaShow){
					util.toastinfo('请选择扶贫领域');
					return
				}
				let obj={
					Name:this.name,
					Phone:this.phone,
					Job:this.job,
					DepartmentId:this.unitValue.Id,
					Department:this.unitValue.Name,
					Level:this.unitValue.Level,
					CityCode:this.unitValue.CityCode,
					City:this.unitValue.City,
					AreaCode:this.unitValue.AreaCode,
					Area:this.unitValue.Area,
					TownCode:this.unitValue.TownCode,
					Town:this.unitValue.Town,
					StreetCode:this.unitValue.StreetCode,
					Street:this.unitValue.Street,
					UserType:typeList.join(',')+',',
					PovertyAlleviation:this.typeCode,
					OperatorGuid:this.OperatorID
				};
				/*let result = AddPeopleContact(obj);
				console.log(result)
				if(result.data.StatusCode==0){
					alert(33)
					this.$router.push('/Contacts')
				}*/
				Indicator.open({
					text:'保存中，请稍等...',
					spinnerType: 'fading-circle'
				});
				if(this.$route.query.isEdit){
					obj.Id=this.$route.query.Id;
					UpdatePeopleContact(obj).then(function(res){
						if(res.data.StatusCode==0){
							Indicator.close()
							_this.$router.push('/Contacts');
							_this.$parent.detailValue=''
						}else{
							Indicator.close()
							util.toastinfo(res.data.Info);
						}
					})
				}else{
					AddPeopleContact(obj).then(function(res){
						if(res.data.StatusCode==0){
							Indicator.close()
							_this.$router.push('/Contacts')
							_this.$parent.detailValue=''
						}else{
							Indicator.close()
							util.toastinfo(res.data.Info);
						}
					})
				}



			},
			tabChange(item) {
				item.isSelect = !item.isSelect;
				if (this.lists[0].isSelect) {
					this.areaShow = true
				} else {
					this.typeCode='';
					this.areaShow = false
				}

			}
		}
	}
</script>

<style lang="scss" scoped>
	.addContact {
		height: 100%;
		padding: 0;
		margin: 0;
		overflow: auto;
		.selectType {
			background: #fff;
			margin-top: 30px;
			padding: 26px 30px 30px;
			.title {
				font-size: 28px;
				color: #333333;
				margin-bottom: 20px;
			}
			.type {
				&:after {
					content: '';
					height: 0; //高度为0
					line-height: 0; //行高为0
					display: block; //将文本转为块级元素
					visibility: hidden; //将元素隐藏
					clear: both
				}
				.item {
					float: left;
					border: 1px solid #666666;
					border-radius: 4px;
					font-size: 28px;
					width: 156px;
					height: 72px;
					line-height: 72px;
					text-align: center;
					margin-right: 30px;
					&:nth-child(1) {
						width: 240px;
					}
					img {
						display: none;
					}
				}
				.cur {
					color: #00AE66;
					border: 1px solid #00AE66;
					position: relative;
					.checked {
						position: absolute;
						right: 0;
						width: 0;
						height: 0;
						border-width: 16px;
						border-style: solid solid dashed dashed;
						border-color: #00AE66 #00AE66 transparent transparent;
						img {
							display: inline-block;
							position: absolute;
							top: -12px;
							right: -12px;
							width: 16px;
							height: 10px;
						}
					}
				}
			}
		}
		.form {
			background: #fff;
			margin-top: 30px;
			.item {
				position: relative;
				font-size: 0;
				height: 87px;
				line-height: 87px;
				border-bottom: 1px solid #E5E5E5;
				margin-left: 30px;
				.left {
					display: inline-block;
					width: 180px;
					font-size: 32px;
					color: #333333;
				}
				.right {
					width:calc(100% - 180px);
					border: none;
					font-size: 32px;
					&::placeholder {
						color: #999999;
					}
				}
				#rangeInput{
					background: transparent;
				}
				input[disabled] {
					-webkit-opacity: 1;
					opacity: 1;
					color: #333333;
					-webkit-text-fill-color: #333333;
				}
				input::-webkit-input-placeholder{
					color: #999999 !important;
					-webkit-text-fill-color: #999999 !important;
				}
				img {
					position: absolute;
					right: 30px;
					top: 50%;
					margin-top: -13px;
					width: 16px;
					height: 26px;
				}
				.select {
					position: absolute;
					top: 50%;
					transform: translateY(-50%);
					line-height: 36px;
					font-size: 32px;
					float: left;
					width: 490px;
					color: #999999;
				}
				.selected {
					color: #333 !important;
				}
			}
		}
		.saveButton {
			width: 670px;
			height: 94px;
			line-height: 94px;
			background: #00AE66;
			border: 2px solid rgba(5, 5, 5, 0.08);
			border-radius: 10px;
			margin: auto;
			text-align: center;
			font-size: 36px;
			color: #FFFFFF;
			margin-top: 50px;
		}
		.popBar {
			height: 80px;
			line-height: 80px;
			overflow: hidden;
			border-bottom: 1px solid #dfdfdf;
			background: #fbf9fe;
			display: flex;
			display: -webkit-flex;
			justify-content: space-between;
			i {
				font-style: normal;
			}
			span {
				float: left;
				padding-left: 30px;
				color: #00ae66;
			}
			em {
				float: right;
				padding-right: 30px;
				color: #00ae66;
			}
		}
		.head {
			margin: 16px;
			position: relative;
			input {
				border: 1px solid #E6E6EA;
				border-radius: 10px;
				width: 100%;
				height: 56px;
				text-indent: 350px;
				&::placeholder {
					font-size: 26px;
					color: #B2B2B2;
				}

			}
			.shortImg {
				position: absolute;
				height: 25px;
				width: 25px;
				top: 0;
				bottom: 0;
				margin: auto;
				left: 315px;
			}

		}
		.searchPicker {
			position: relative;
			width: 100%;
			height: 635px;
			& > ul {
				position: absolute;
				left: 0;
				top: 0;
				background: #fff;
				width: 100%;
				height: 100%;
				box-sizing: border-box;
				padding: 40px 0;
				overflow-y: auto;
				&:nth-child(1) {
					z-index: 3;
					// background: lightblue;
				}
				&:nth-child(2) {
					z-index: 2;
					// background: lavenderblush;
				}
				&:nth-child(3) {
					z-index: 1;
					// background: lightcyan;
				}
				li {
					box-sizing: border-box;
					padding: 0 40px;
					height: 80px;
					line-height: 80px;
					position:relative;
					div{
						position:absolute;
						right:60px;
						top:0;
						bottom:0;
						margin:auto;
						display: inline-block;
						height:46px;
						width:46px;
						border-radius: 50%;
						border:1px solid  #C9C9C9;
						img{
							position: absolute;
							top: 0;
							bottom: 0;
							left: 0;
							right: 0;
							margin: auto;
						}
					}
					&.cur {
						color: #00ae66;
						font-size: 36px;
						div{
							background: #00AE66;
							border:1px solid  #00AE66;
						};
					}
				}
			}
		}
	}
</style>
