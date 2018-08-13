import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const state = {
    OperatorID:''
}
const mutations = {
    changeName(state, str) {
        state.name = str
    }
}
const getters = {}
const actions = {
	
}
export default new Vuex.Store({
    state,
    mutations,
    getters,
    actions
})
