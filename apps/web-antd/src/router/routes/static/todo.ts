import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'ic:baseline-view-in-ar',
      keepAlive: true,
      order: 1,
      title: $t('todo.title'),
    },
    name: 'todo',
    path: '/todo',
    component: () => import('#/views/todo/index.vue'),
  },
];

export default routes;
