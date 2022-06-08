import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue } from 'bootstrap-vue'
import router from "./router/routes.js"

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import firebase from 'firebase/compat/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

Vue.use(BootstrapVue)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
  created(){
    firebase.initializeApp({
      apiKey: "AIzaSyAODwot1IGUT6lxDzCyTJDyjSx6oSueuCM",
      authDomain: "vue-upload-7ace8.firebaseapp.com",
      projectId: "vue-upload-7ace8",
      storageBucket: "vue-upload-7ace8.appspot.com",
      messagingSenderId: "820260915872",
      appId: "1:820260915872:web:ac5ae10c6ffbc79d8d97c5"
    });
  }
}).$mount('#app')

