import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'ic:baseline-view-in-ar',
      keepAlive: true,
      order: 1,
      title: $t('aiSpeed​​Dating.title'),
    },
    name: 'aiSpeed​​Dating',
    path: '/aiSpeed​​Dating',
    component: () => import('#/views/aiSpeed​​Dating/index.vue'),
  },
];

export default routes;
