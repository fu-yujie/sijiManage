//webpack配置文件

module.exports = {
    //本地开发
    dev: {
        // 目录地址
        assetsPublicPath: "/",   // /helpWx/
        proxyTable: {
			'/api/**/**':{
				target: ' https://devlfybmesinfo.zhiscity.com ',   //  https://lfybflp.zhiscity.com    https://devlfybmesinfo.zhiscity.com    http://qalfybgx.zhiscity.com 
				secure:  false, 
				changeOrigin:  true,

			}
		},
        host: "0.0.0.0",
        port: "8089"
    },
    //打包
    build: {
        /* 目录地址 */
        assetsPublicPath: "/helpWx/"
    }
}
