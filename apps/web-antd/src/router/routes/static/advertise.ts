import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'ic:baseline-view-in-ar',
      keepAlive: true,
      order: 218,
      title: $t('advertise.title'),
    },
    name: 'advertise',
    path: '/advertise',
    children: [
      {
        meta: {
          title: $t('advertise.banner'),
        },
        name: 'advertise-banner',
        path: '/advertise/banner',
        component: () => import('#/views/advertise/banner/index.vue'),
      },
      {
        meta: {
          title: $t('advertise.article'),
        },
        name: 'advertise-article',
        path: '/advertise/article',
        component: () => import('#/views/advertise/article/index.vue'),
      },
    ],
  },
];

export default routes;
