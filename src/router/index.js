import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const  router = new Router({
  scrollBehavior: () => ({ // 滚动条滚动的行为，不加这个默认就会记忆原来滚动条的位置
    y: 0
  }),
  routes:[
    {
      path: '*',
      redirect:'/'
    },
    {path: '/test',name: 'test',title: '测试界面',component: () => import('../pages/test.vue')},
    {path: '/login',name: 'login',title: '登录',component: () => import('../pages/login.vue')},
    {path: '/',name: 'protal',title: '首页-员工管理',component: () => import('../pages/protal.vue')},
    {path: '/PersonDetail',name: 'PersonDetail',title: '员工详情',component: () => import('../pages/PersonDetail.vue')},
    {path: '/Ctemplate',name: 'Ctemplate',title: '合同模板',component: () => import('../pages/Ctemplate.vue')},
    {path: '/Cmanager',name: 'Cmanager',title: '合同管理',component: () => import('../pages/Cmanager.vue')},
    {path: '/Sdetails',name: 'Sdetails',title: '合同管理详情',component: () => import('../pages/Sdetails.vue')},
    {path: '/sign',name: 'sign',title: '合同签署',component: () => import('../pages/sign.vue')},
    {path: '/FaceRecord',name: 'FaceRecord',title: '人脸识别记录',component: () => import('../pages/FaceRecord.vue')},
    
  ]
})
router.beforeEach((to, from, next) => {
  var userInfo = window.localStorage.getItem('TOKEN');
  if(userInfo){
    next()
  } else {
    if(to.path == '/login'){
      next()
    } else {
      next('/login')
    }
  }
})
export default router
