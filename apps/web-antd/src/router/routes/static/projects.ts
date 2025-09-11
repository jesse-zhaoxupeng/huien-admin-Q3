import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'ic:baseline-view-in-ar',
      keepAlive: true,
      order: 10,
      title: $t('projects.title'),
    },
    name: 'projects',
    path: '/projects',
    children: [
      {
        meta: {
          title: $t('projects.antd'),
        },
        name: 'projects-lists',
        path: '/projects',
        component: () => import('#/views/projects/index.vue'),
      },
      {
        meta: {
          title: $t('projects.indications.title'),
        },
        name: 'indications',
        path: '/indications',
        component: () => import('#/views/indications/index.vue'),
      },
    ],
  },
];

export default routes;
