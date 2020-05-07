import Vue from 'vue'
import Router from 'vue-router'
import Top from './components/pages/Top.vue'
import Upload from './components/pages/Upload.vue'
import SimpleUpload from './components/pages/SimpleUpload.vue'
import Search from './components/pages/Search.vue'
import SumDL from './components/pages/SumDL.vue'
import Login from './components/pages/Login.vue'
import Register from './components/pages/Register.vue'
import Information from './components/pages/Information.vue'
import EventNotice from './components/pages/EventNotice.vue'
import Mypage from './components/pages/Mypage.vue'
import PasswordEmail from './components/pages/PasswordEmail.vue'
import PasswordReset from './components/pages/PasswordReset.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Top',
      component: Top,
    },
    {
      path: '/upload',
      name: 'Upload',
      component: Upload,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/simpleupload',
      name: 'SimpleUpload',
      component: SimpleUpload,
    },
    {
      path: '/search/:searchType',
      name: 'Search',
      component: Search,
    },
    {
      path: '/sumdownload/:searchType',
      name: 'SumDL',
      component: SumDL,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
    },
    {
      path: '/information',
      name: 'Information',
      component: Information,
    },
    {
      path: '/eventnotice',
      name: 'EventNotice',
      component: EventNotice,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/mypage',
      name: 'Mypage',
      component: Mypage,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/password/email',
      name: 'PasswordEmail',
      component: PasswordEmail,
    },
    {
      path: '/password/reset/:token',
      name: 'PasswordReset',
      component: PasswordReset,
    },
  ]
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(rec => rec.meta.requiresAuth)) {
    Vue.prototype.$http.get("/api/user").then((res: any) => {
      const user = res.data;
      if (user) {
        next()
      } else {
        next({
          path: '/login',
        })
      }
    }).catch((error: any) => {
      if (error.response.status === 401) {
        alert("未認証のユーザーのためLogin画面でログインを行ってください");
      } else {
        alert("予期しないエラーが発生しました。再度ログインを行ってください");
      }
      next({
        path: '/login',
      })
    });
  } else {
    next()
  }
})
export default router;
