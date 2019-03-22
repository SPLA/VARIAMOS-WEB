import Vue from 'vue'
import Vuex from 'vuex'
import filetree from './filetree.js'

Vue.use(Vuex)

export default new Vuex.Store({
    modules:{
        filetree
    }
})