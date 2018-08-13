import vhttp from './modle/vueRequest'
import config from '@/config.js'

/* API接口 */
/**
 * vhttp(url,params,httpType,method)
 * @url APIurl的地址。
 * @params 请求的参数。
 * @httpType 请求的类型 GET POST。
 * @method 请求方法 ajax（jsonp) 或者 axios 默认axios。
 * @return Promise;
 * 规范 ： 命名前缀需要 type_*  get_baidu  post_baidu。接口地址需要添加注释.
 */

/* 请求URL地址 */
const URLWEBHTTP = config.URLWEBHTTP;

// 请求百度接口获取数据
export const get_baidu = params => vhttp('/baidu', params, 'GET');

// 请求百度接口获取数据
export const post_baidu = params => vhttp('/baidu', params, 'POST');



//登录

export const login = params => vhttp('/api/People/Login', params, 'POST');
//短信验证登录
export const loginSms = params => vhttp('/api/People/LoginForSMS', params, 'POST');
//缴费进度查询
export const MedicarePay = params => vhttp('/api/Statistics/MedicarePay', params, 'POST');
//通知列表
export const GetNoticeList = params => vhttp('/api/PovertyAlleviation/GetNoticeList', params, 'POST');
//我发布的
export const GetNoticeList1 = params => vhttp('/api/PovertyAlleviation/GetNoticeList', params, 'POST');
//已阅读的
export const GetNoticeListAl = params => vhttp('/api/PovertyAlleviation/GetNoticeList', params, 'POST');
//查看阅读人员
export const GetNoticeReadingList = params => vhttp('/api/PovertyAlleviation/GetNoticeReadingList', params, 'POST');
//发布工单
export const AddWorkOrder = params => vhttp('/api/PovertyAlleviation/AddWorkOrder', params, 'POST');

//查看通知详情
export const GetNoticeInfoByID = params => vhttp('/api/PovertyAlleviation/GetNoticeInfoByID', params, 'POST');
//通知附件
export const UploadNoticeFiles = params => vhttp('/api/PovertyAlleviation/UploadNoticeFiles', params, 'POST');
//发布通知页面的通知范围
export const GetNoticeScopeLevel = params => vhttp('/api/PovertyAlleviation/GetNoticeScopeLevel', params, 'POST');

//添加通知
export const AddNotice = params => vhttp('/api/PovertyAlleviation/AddNotice', params, 'POST');

//获取工单列表
export const GetWorkOrderList = params => vhttp('/api/PovertyAlleviation/GetWorkOrderList', params, 'POST');
//工单类型选择
export const GetOrderType = params => vhttp('/api/PovertyAlleviation/GetDictionarysList', params, 'POST');
//工单详情
export const GetWorkOrderInfo = params => vhttp('/api/PovertyAlleviation/GetWorkOrderInfo', params, 'POST');
//工单回复列表
export const GetWorkOrderMessageList = params => vhttp('/api/PovertyAlleviation/GetWorkOrderMessageList', params, 'POST');
//新增工单回复信息
export const AddWorkOrderMessage = params => vhttp('/api/PovertyAlleviation/AddWorkOrderMessage', params, 'POST');
//更新工单状态
export const UpdWorkOrderState = params => vhttp('/api/PovertyAlleviation/UpdWorkOrderState', params, 'POST');
//根据扶贫领域获取所有相关工单受理人员部门
export const GetDepartmentByPovertyAlleviation = params => vhttp('/api/PovertyAlleviation/GetDepartmentByPovertyAlleviation', params, 'POST');

//未处理工单接口
export const GetWorkOrderListfail = params => vhttp('/api/PovertyAlleviation/GetWorkOrderList', params, 'POST');
//为通知消息数量
export const GetNoticeListfail = params => vhttp('/api/PovertyAlleviation/GetNoticeList', params, 'POST');


//工单授理人级别
export const GetWorkOrderLevelScope = params => vhttp('/api/PovertyAlleviation/GetWorkOrderLevelScope', params, 'POST');
//工单受理人员部门
export const GetWorkOrderDepartmentScope = params => vhttp('/api/PovertyAlleviation/GetWorkOrderDepartmentScope', params, 'POST');

//发送验证码
export const SendMessage = params => vhttp('/api/People/SendMessage', params, 'POST');

//修改密码
export const UpdatePwd = params => vhttp('/api/People/UpdatePwd', params, 'POST');

//政策指南
export const policyGuide = params => vhttp('/api/PovertyAlleviation/GetGovInfoList', params, 'POST');

//获取人员管理列表
export const GePeopleList = params => vhttp('/api/People/GePeopleList', params, 'POST');
//通讯录列表
export const GetPeopleContactList = params => vhttp('/api/PeopleContact/GetPeopleContactList', params, 'POST');
//删除通讯录信息
export const DeletePeopleContactByID = params => vhttp('/api/PeopleContact/DeletePeopleContactByID', params, 'POST');
//编辑通讯录信息
export const UpdatePeopleContact = params => vhttp('/api/PeopleContact/UpdatePeopleContact', params, 'POST');
//新建通讯录信息
export const AddPeopleContact = params => vhttp('/api/PeopleContact/AddPeopleContact', params, 'POST');
//获取人员通讯录单位信息列表
export const GetPeopleContactDepartmentList = params => vhttp('/api/PeopleContact/GetPeopleContactDepartmentList', params, 'POST');
//获取通讯录联系人详情
export const GetPeopleContactById = params => vhttp('/api/PeopleContact/GetPeopleContactById', params, 'POST');
//脱贫进度
export const GetPoorProgressList = params => vhttp('/api/PovertyAlleviation/GetPoorProgressList', params, 'POST');
//进度总数
export const GetPoorProgressTotalList = params => vhttp('/api/PovertyAlleviation/GetPoorProgressTotalList', params, 'POST');

//获取贫困户信息管理列表--建档立卡脱贫动态管理
export const GetPoorFamilyList = params => vhttp('/api/PovertyAlleviation/GetPoorFamilyList', params, 'POST');
//获取贫困户家庭成员、帮扶干部信息--建档立卡脱贫动态管理GetPoorFamilyInfoByID
export const GetPoorFamilyInfoByID = params => vhttp('/api/PovertyAlleviation/GetPoorFamilyInfoByID', params, 'POST');
//医疗费用查询
export const GetMedCostsListByIDCardNo = params => vhttp('/api/PovertyAlleviation/GetMedCostsListByIDCardNo', params, 'POST');

//上传证件照片信息
export const UploadIDCardImages = params => vhttp('/api/PovertyAlleviation/UploadIDCardImages', params, 'POST');
//获取证件信息及照片
export const GetCardInfoById = params => vhttp('/api/PovertyAlleviation/GetCardInfoById', params, 'POST');
//上传个人免冠照片信息
export const UploadPersonImage = params => vhttp('/api/PovertyAlleviation/UploadPersonImage', params, 'POST');
//上传户口本本人信息照片
export const UploadCensusRegisterImages = params => vhttp('/api/PovertyAlleviation/UploadCensusRegisterImages', params, 'POST');

// 获取区域
export const GetPoorFamilyScope = params => vhttp('/api/PovertyAlleviation/GetPoorFamilyScope', params, 'POST');

//获取未绑定贫困户信息管理列表-贫困户绑定-全部未绑定
export const GetPoorFamilyNoRelList = params => vhttp('/api/PovertyAlleviation/GetPoorFamilyNoRelList', params, 'POST');
//获取帮扶干部本人已绑定帮扶对象家庭信息
export const GetPoorFamilySelflList = params => vhttp('/api/PovertyAlleviation/GetPoorFamilySelflList', params, 'POST');
//扶贫干部添加帮扶对象
export const AddPoorLeaderRelation = params => vhttp('/api/PovertyAlleviation/AddPoorLeaderRelation', params, 'POST');
//扶贫干部解除帮扶对象
export const RemovePoorLeaderRelation = params => vhttp('/api/PovertyAlleviation/RemovePoorLeaderRelation', params, 'POST');
//扶贫干部解除帮扶对象-添加地域 GetPoorFamilyNoRelScope
export const GetPoorFamilyNoRelScope = params => vhttp('/api/PovertyAlleviation/GetPoorFamilyNoRelScope', params, 'POST');

//扶贫动态-家庭情况获取 GetPoorFamilyInfoByID
export const GetFamilyInfoByFamilyNo = params => vhttp('/api/PovertyAlleviation/GetFamilyInfoByFamilyNo', params, 'POST');
//扶贫动态-家庭情况信息提交 AddPoorFamilyInfo
export const AddPoorFamilyInfo = params => vhttp('/api/PovertyAlleviation/AddPoorFamilyInfo', params, 'POST');
//通讯录-获取区域信息
export const GetAreaScope = params => vhttp('/api/People/GetAreaScope', params, 'POST');

