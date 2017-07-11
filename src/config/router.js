import Index from '@/component/Index';
import Login from '@/component/Login';
import JSSdkDemo from '@/component/JSSdkDemo';

export default {
  routes: [
    {
      path: '/',
      name: 'Index',
      meta: { auth: false },
      component: Index,
    },
    {
      path: '/login',
      name: 'Login',
      meta: { auth: false },
      component: Login,
    },
    {
      path: '/jssdkdemo/:id',
      name: 'JSSdkDemo',
      meta: { auth: false },
      component: JSSdkDemo,
    },
  ],
};
