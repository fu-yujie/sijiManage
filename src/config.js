/**
 * 编译环境 线上环境切换
 * 使用方法：
 * npm run build dev 测试环境
 * npm run build pro 生产环境
 * npm run build * ………………
 * npm run dev 使用的是localhost 环境
 * 规范 ：所有属性大写。
 * localhost - 本地开发
 * testdev - 测试环境
 * pro - 生产环境
 * dev - 内网
 * beta - 外网
 * @return obj
 */

import setConfig from '@/resources/setting/setConfig.js'

export default setConfig({
    /* 不同环境配置 */
    setting: {
	    localhost: {
			URLWEBHTTP: '',     //http://devlfybmesinfo.zhiscity.com
			helpPoorDym:'71',//开发环境
			powerId:'48',
			messId:'54',//测试
			helpPoorMan: '73',
			helpPoorId:'75',
			paySearchId:'76',
			reportId:'77'
        },
        testdev: {
			URLWEBHTTP: 'http://qalfybgx.zhiscity.com',
			powerId:'48',
			messId:'54',//测试
			helpPoorDym:'67',//QA环境
			helpPoorMan: '73',
			helpPoorId:'75',
			paySearchId:'76',
			reportId:'77'
        },
        pro: {
			URLWEBHTTP: 'https://lfybflp.zhiscity.com',
			powerId:'8',
			messId:'14',//生产环境
			helpPoorDym:'71',//正式环境
			helpPoorMan: '73',
			helpPoorId:'77',
			paySearchId:'79',
			reportId:'81'
        },
        dev: {
            URLWEBHTTP: 'https://devlfybmesinfo.zhiscity.com'
        },
        beta: {
            URLWEBHTTP: 'http://www.baidu.com/bata'
        }
    },
    /* 通用配置 - 每个环境都有 */
    propertys: {
        TIME: 2000
    }
})
