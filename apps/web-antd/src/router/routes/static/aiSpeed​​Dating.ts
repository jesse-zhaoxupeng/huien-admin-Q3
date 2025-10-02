import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'ic:baseline-view-in-ar',
      keepAlive: true,
      order: 1,
      title: $t('aiSpeedDating.title'),
    },
    name: 'aiSpeedDating',
    path: '/aiSpeedDating',
    component: () => import('#/views/aiSpeedDating/index.vue'),
  },
];

export default routes;
