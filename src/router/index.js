import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/view/HomePage.vue'
import Login from '@/view/Login.vue'
import messageLogin from '@/view/messageLogin.vue'
import ChangePass from '@/view/ChangePass.vue'
import Home from '@/view/Home.vue'
import InformationAskList from '@/view/InformationAsk/InformationAskList' //信息查询首页
import InformationAskCountyTown from '@/view/InformationAsk/InformationAskCountyTown' //乡镇进度查询
import InformationAskVillageStreet from '@/view/InformationAsk/InformationAskVillageStreet' //村街进度查询
import MessageDetail from '@/view/MessageView/MessageDetail' //消息详情
import MessagePerson from '@/view/MessageView/MessagePerson' //查看人员
import MessageList from '@/view/MessageView/MessageList' //消息列表
import MessageVList from '@/view/MessageView/MessageVList' //消息列表
import PublishedMessList from '@/view/MessageView/PublishedMessList' //消息列表
import addMessage from '@/view/MessageView/addMessage'
import OrderDetail from '@/view/OrderSub/OrderDetail' //工单详情
import OrderList from '@/view/OrderSub/OrderList' //工单列表
import OrderSub from '@/view/OrderSub/OrderSub1' //工单提交
import Contacts from '@/view/Contacts' //通讯录
import addContact from '@/view/addContact'//新增联系人
import search from '@/view/search'
import helpPoorNotice from '@/view/helpPoorNotice' //扶贫专栏
import helpPoorNoticeDet from '@/view/helpPoorNoticeDet' //扶贫专栏文章页
import article01 from '@/view/news/article01' //新闻动态1
import article02 from '@/view/news/article02' //新闻动态2
import sysLogin from '@/view/operatGuide/sysLogin'//帮助中心系统登录
import mainPage from '@/view/operatGuide/mainPage'//帮助中心主界面
import addOrder from '@/view/operatGuide/addOrder'//帮助中心新建工单
import order from '@/view/operatGuide/order'//帮助中心工单列表
import notice from '@/view/operatGuide/notice'//帮助中心通知管理
import noticeGonggao from '@/view/operatGuide/noticeGonggao'//帮助中心通知公告
import zhuanlan from '@/view/operatGuide/zhuanlan'//帮助中心扶贫政策专栏
import guideList from '@/view/operatGuide/guideList'//帮助中心九宫格列表
import HomeBefore from '@/view/HomeBefore.vue'//四级管理系统
import PovReliefFamiList from '@/view/helpPoorManage/PovReliefFamiList'//扶贫动态管理-家庭户列表
import PovReliefFamiMem from '@/view/helpPoorManage/PovReliefFamiMem'//扶贫动态管理-家庭成员列表
import PovReliefHelpCadres from '@/view/helpPoorManage/PovReliefHelpCadres'//扶贫动态管理-帮扶干部列表
import PovReliefEnjoyPolicy from '@/view/helpPoorManage/PovReliefEnjoyPolicy'//扶贫动态管理-享受政策列表
import PovReliefDynamic from '@/view/helpPoorManage/PovReliefDynamic'//扶贫动态管理-扶贫动态列表
import PovProgressone from '@/view/helpPoorManage/PovProgressone'//扶贫动态管理-建档立卡脱贫进度查询1
import PovProgresstwo from '@/view/helpPoorManage/PovProgresstwo'//扶贫动态管理-建档立卡脱贫进度查询2
import PovProgressthree from '@/view/helpPoorManage/PovProgressthree'//扶贫动态管理-建档立卡脱贫进度查询3
import familyDetail from '@/view/helpPoorManage/familyDetail'//扶贫动态管理-家庭情况页面
import paperworkInfo from '@/view/helpPoorManage/paperworkInfo'//家庭成员证件信息
import memPicture from '@/view/helpPoorManage/memPicture'//家庭成员人员照片
import paysearchList from '@/view/helpPoorManage/paysearchList'//家庭成员医疗费用查询

import popPage from '@/view/popPage'//====popPage 三级联动弹窗====

import allHelpFami from '@/view/relaPoverty/allHelpFami'    //扶贫对象管理-已绑定对象
import unHelpFami  from '@/view/relaPoverty/unHelpFami'		//扶贫对象管理-未绑定对象
import helpFamiMem  from '@/view/relaPoverty/helpFamiMem'		//扶贫对象管理-未绑定对象


Vue.use(Router)

export default new Router({
	routes: [
		/*{ path: '*', component: NotFoundComponent },//404页面*/
		{
			path: '/',
			name: 'Login',
			component: Login,
			meta: {
		      title: '廊坊智慧医保四级管理平台'
            }
        },
        {
            path: '/messageLogin',
            name: 'messageLogin',
            component: messageLogin,
            meta: {
                title: '廊坊智慧医保四级管理平台'
            }
        },
        {
            path: '/ChangePass',
            name: 'ChangePass',
            component: ChangePass,
            meta: {
                title: '修改密码'
            }
        },
		{
			path: '/HomePage',
			name: 'HomePage',
			component: HomePage,
			meta: {
		      title: '首页样例'
		    }
		},
		{
			path: '/Home',
			name: 'Home',
			component: Home,
			meta: {
		      title: '首页'
		    }
        },
        {
            path: '/HomeBefore',
            name: 'HomeBefore',
            component: HomeBefore,
            meta: {
                title: '廊坊智慧医保四级管理平台'
            }
        },
		{
			path: '/InformationAskList',
			name: 'InformationAskList',
			component: InformationAskList,
			meta: {
		      title: '缴费进度查询'
		    }
		},
		{
			path: '/InformationAskCountyTown/:Code/:LevelCode/:loca',
			name: 'InformationAskCountyTown',
			component: InformationAskCountyTown,
			meta: {
		      title: '缴费进度查询'
		    }
		},
		{
			path: '/InformationAskVillageStreet/:Code/:LevelCode/:loca',
			name: 'InformationAskVillageStreet',
			component: InformationAskVillageStreet,
			meta: {
		      title: '缴费进度查询'
		    }
        },
        {
            path: '/Contacts',
            name: 'Contacts',
            component: Contacts,
            meta: {
                title: '通讯录'
            }
        },
		{
			path: '/addContact',
			name: 'addContact',
			component: addContact,
			meta: {
				title: '新建人员'
			}
		},
		{
			path: '/search',
			name: 'search',
			component: search,
			meta: {
				title: '选择单位'
			}
		},
		{
			path: '/MessageDetail/:id',
			name: 'MessageDetail',
			component: MessageDetail,
			meta: {
		      title: '通知详情'
		    }
		},
		{
			path: '/MessagePerson',
			name: 'MessagePerson',
			component: MessagePerson,
			meta: {
		      title: '查看人员'
		    }
		},
        {
            path: '/addMessage',
            name: 'addMessage',
            component: addMessage,
            meta: {
                title: '发布通知'
            }
        },
		{
			path: '/MessageVList',
			name: 'MessageVList',
			component: MessageVList,
			meta: {
		      title: '通知列表'
		    }
		},
        {
            path: '/MessageList',
            name: 'MessageList',
            component: MessageList,
            meta: {
                title: '通知列表'
            }
        },
		{
			path: '/OrderDetail/:id/:state',
			name: 'OrderDetail',
			component: OrderDetail,
			meta: {
		      title: '工单详情'
		    }
		},
		{
			path: '/OrderList',
			name: 'OrderList',
			component: OrderList,
			meta: {
		      title: '工单列表'
		    }
		},
		{
			path: '/OrderSub',
			name: 'OrderSub',
			component: OrderSub,
			meta: {
		      title: '工单提交'
		    }
		},
		{
			path: '/PublishedMessList',
			name: 'PublishedMessList',
			component: PublishedMessList,
			meta: {
		      title: '我发布的'
		    }
		},
		{
			path: '/helpPoorNotice',
			name: 'helpPoorNotice',
			component: helpPoorNotice,
			meta: {
		      title: '扶贫专栏'
		    }
		},
		{
			path: '/helpPoorNoticeDet',
			name: 'helpPoorNoticeDet',
			component: helpPoorNoticeDet,
			meta: {
		      title: '详情'
		    }
		},
		{
			path: '/article01',
			name: 'article01',
			component: article01,
			meta: {
		      title: '最新动态'
		    }
		},
		{
			path: '/article02',
			name: 'article02',
			component: article02,
			meta: {
		      title: '最新动态'
		    }
		},
        {
            path: '/sysLogin',
            name: 'sysLogin',
            component: sysLogin,
            meta: {
                title: '系统登录'
            }
        },
        {
            path: '/mainPage',
            name: 'mainPage',
            component: mainPage,
            meta: {
                title: '主界面'
            }
        },
        {
            path: '/addOrder',
            name: 'addOrder',
            component: addOrder,
            meta: {
                title: '新建工单'
            }
        },
        {
            path: '/order',
            name: 'order',
            component: order,
            meta: {
                title: '反馈工单'
            }
        },
        {
            path: '/notice',
            name: 'notice',
            component: notice,
            meta: {
                title: '通知管理'
            }
        },
        {
            path: '/noticeGonggao',
            name: 'noticeGonggao',
            component: noticeGonggao,
            meta: {
                title: '通知公告'
            }
        },
        {
            path: '/zhuanlan',
            name: 'zhuanlan',
            component: zhuanlan,
            meta: {
                title: '扶贫政策专栏'
            }
		},
		{
            path: '/guideList',
            name: 'guideList',
            component: guideList,
            meta: {
                title: '操作使用指南'
            }
		},
		//扶贫动态板块======
		{
            path: '/PovReliefFamiList',
            name: 'PovReliefFamiList',
            component: PovReliefFamiList,
            meta: {
                title: '建档立卡脱贫动态管理'
            }
		},
		{
            path: '/PovReliefFamiMem',
            name: 'PovReliefFamiMem',
            component: PovReliefFamiMem,
            meta: {
                title: '家庭成员'
            }
		},
		{
            path: '/PovReliefHelpCadres',
            name: 'PovReliefHelpCadres',
            component: PovReliefHelpCadres,
            meta: {
                title: '帮扶干部'
            }
		},
		{
            path: '/PovReliefEnjoyPolicy',
            name: 'PovReliefEnjoyPolicy',
            component: PovReliefEnjoyPolicy,
            meta: {
                title: '享受政策'
            }
		},
		{
            path: '/PovReliefDynamic',
            name: 'PovReliefDynamic',
            component: PovReliefDynamic,
            meta: {
                title: '扶贫动态'
            }
		},
        {
            path: '/PovProgressone',
            name: 'PovProgressone',
            component: PovProgressone,
            meta: {
                title: '建档立卡脱贫进度查询'
            }
        },
        {
            path: '/PovProgresstwo',
            name: 'PovProgresstwo',
            component: PovProgresstwo,
            meta: {
                title: '建档立卡脱贫进度查询'
            }
        },
        {
            path: '/PovProgressthree',
            name: 'PovProgressthree',
            component: PovProgressthree,
            meta: {
                title: '建档立卡脱贫进度查询'
            }
		},
		{
			path: '/allHelpFami',
			name: 'allHelpFami',
			component: allHelpFami,
			meta: {
				title: '全部帮扶对象'
			}
		},
		{
			path: '/unHelpFami',
			name: 'unHelpFami',
			component: unHelpFami,
			meta: {
				title: '添加帮扶对象'
			}
		},
		{
			path: '/helpFamiMem',
			name: 'helpFamiMem',
			component: helpFamiMem,
			meta: {
				title: '家庭成员列表'
			}
		},
		{
            path: '/familyDetail',
            name: 'familyDetail',
            component: familyDetail,
            meta: {
                title: '家庭情况'
            }
		},

		{
			path: '/paperworkInfo',
			name: 'paperworkInfo',
			component: paperworkInfo,
			meta: {
				title: '证件信息'
			}
		},
		{
			path: '/memPicture',
			name: 'memPicture',
			component: memPicture,
			meta: {
				title: '人员照片'
			}
		},
		{
			path: '/paysearchList',
			name: 'paysearchList',
			component: paysearchList,
			meta: {
				title: '医疗费用查询'
			}
		},
		//====popPage====
		{
            path: '/popPage',
            name: 'popPage',
            component: popPage,
            meta: {
                title: '弹窗'
            }
		},
	]
})
