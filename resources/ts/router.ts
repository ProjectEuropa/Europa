import { createRouter, createWebHistory } from 'vue-router';
import axios from 'axios';
// import Router from 'vue-router'
import Top from './components/pages/Top.vue'
// import Upload from './components/pages/Upload.vue'
import SimpleUpload from './components/pages/SimpleUpload.vue'
// import Search from './components/pages/Search.vue'
// import SumDL from './components/pages/SumDL.vue'
// import Login from './components/pages/Login.vue'
// import Register from './components/pages/Register.vue'
// import Information from './components/pages/Information.vue'
// import EventNotice from './components/pages/EventNotice.vue'
// import Mypage from './components/pages/Mypage.vue'
// import PasswordEmail from './components/pages/PasswordEmail.vue'
// import PasswordReset from './components/pages/PasswordReset.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Top', component: Top },
    // {
    //   path: '/upload',
    //   name: 'Upload',
    //   component: Upload,
    //   meta: { requiresAuth: true },
    // },
    { path: '/simpleupload', name: 'SimpleUpload', component: SimpleUpload },
    // { path: '/search/:searchType', name: 'Search', component: Search },
    // { path: '/sumdownload/:searchType', name: 'SumDL', component: SumDL },
    // { path: '/login', name: 'Login', component: Login },
    // { path: '/register', name: 'Register', component: Register },
    // { path: '/information', name: 'Information', component: Information },
    // {
    //   path: '/eventnotice',
    //   name: 'EventNotice',
    //   component: EventNotice,
    //   meta: { requiresAuth: true },
    // },
    // {
    //   path: '/mypage',
    //   name: 'Mypage',
    //   component: Mypage,
    //   meta: { requiresAuth: true },
    // },
    // { path: '/password/email', name: 'PasswordEmail', component: PasswordEmail },
    // {
    //   path: '/password/reset/:token',
    //   name: 'PasswordReset',
    //   component: PasswordReset,
    // },
  ],
});
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.meta.requiresAuth;

  if (requiresAuth) {
    const user = await axios.get('/api/user');
    if (!user.data) {
      try {
        next();
      } catch (error) {
        alert('認証が必要です。ログインしてください。');
        next({ path: '/login' });
      }
    } else {
      next();
    }
  } else {
    next();
  }
});
export default router;
