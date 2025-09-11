import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'ic:baseline-view-in-ar',
      keepAlive: true,
      order: 210,
      title: '运维管理',
    },
    name: 'oms',
    path: '/oms',
    children: [
      {
        meta: {
          title: '数据字典',
        },
        name: 'oms-data-dictionaries',
        path: '/oms/data-dictionaries',
        component: () => import('#/views/oms/data-dictionaries/index.vue'),
      },
      {
        meta: {
          title: '分类管理',
        },
        name: 'oms-categorizes',
        path: '/oms/categorizes',
        children: [
          {
            meta: {
              title: '类型管理',
            },
            name: 'oms-categorizes-types',
            path: '/oms/categorizes/types',
            component: () => import('#/views/oms/categorizes/types/index.vue'),
          },
          {
            meta: {
              title: '分类管理',
            },
            name: 'oms-categorizes-categories',
            path: '/oms/categorizes/categories',
            component: () =>
              import('#/views/oms/categorizes/categories/index.vue'),
          },
        ],
      },
      {
        meta: {
          title: '报名表单管理',
        },
        name: 'oms-registration-forms',
        path: '/oms/registration-forms',
        component: () => import('#/views/oms/registration-forms/index.vue'),
      },
    ],
  },
];

export default routes;
