import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'ic:baseline-view-in-ar',
      keepAlive: true,
      order: 11,
      title: $t('hospitals.title'),
    },
    name: 'hospitals',
    path: '/hospitals',
    children: [
      {
        meta: {
          title: $t('hospitals.antd'),
        },
        name: 'hospitals-lists',
        path: '/hospitals',
        component: () => import('#/views/hospitals/index.vue'),
      },
    ],
  },
];

export default routes;
