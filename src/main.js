// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import MintUI from 'mint-ui'
import App from './App'
import $ from 'n-zepto'
import router from './router'
import './resources/rem.js'
import store from "./store.js"
import vueUtil from "./util/vueUtil.js"
import axios from 'axios'
import 'mint-ui/lib/style.css'
import { InfiniteScroll } from 'mint-ui'
import filters from '../filters/index.js'


Vue.use(require('vue-wechat-title'));
Vue.use(InfiniteScroll);
Object.keys(filters).forEach(key => {
	Vue.filter(key, filters[key])
});

Vue.config.productionTip = false;
Vue.use(MintUI);
Vue.use(vueUtil);
Vue.prototype.$http = axios;
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>',
    data(){
        return {
            popupVisible: true,
            loginType: 1,
        }
    }
})
