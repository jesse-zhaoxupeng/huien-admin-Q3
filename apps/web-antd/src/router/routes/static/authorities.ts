import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'ic:baseline-view-in-ar',
      keepAlive: true,
      order: 210,
      title: '权限管理',
    },
    name: 'authorities',
    path: '/authorities',
    children: [
      {
        meta: {
          title: '用户管理',
        },
        name: 'authorities-admins',
        path: '/authorities/admins',
        component: () => import('#/views/authorities/admin/index.vue'),
      },
    ],
  },
];

export default routes;
