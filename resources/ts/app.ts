import Vue from "vue";
import Vuetify from "vuetify";
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
import "vuetify/dist/vuetify.min.css";
import App from "./components/Main.vue";
import router from './router'
import { required, email, max, min, confirmed } from 'vee-validate/dist/rules'
import { extend, ValidationProvider, ValidationObserver } from 'vee-validate'
import http from './plugins/http';
Vue.use(http);

Vue.use(Vuetify);
Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);

extend('required', {
  ...required,
  message: '{_field_} は必須です',
})
extend('max', {
  ...max,
  message: '{_field_} が {length} 文字数を超えています',
})
extend('min', {
  ...min,
  message: '{_field_} は最低 {length} 文字以上必要です',
})
extend('email', {
  ...email,
  message: 'メールアドレスの形式が不正です',
})
extend("confirmed", {
  ...confirmed,
  message: "再確認パスワードと入力が一致していません"
});

new Vuetify({
  icons: {
    iconfont: 'mdi',
  }
});
new Vue({
  router: router,
  components: {
    app: App
  },
  vuetify: new Vuetify()
}).$mount('#app')
