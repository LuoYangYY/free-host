import Vue from 'vue'
import axios from 'axios'

import App from './App'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.directive('focus', {
    inserted: function (el) {
        // 聚焦元素
        el.focus()
    }
});

/* eslint-disable no-new */
new Vue({
  components: { App },
  template: '<App/>'
}).$mount('#app')
