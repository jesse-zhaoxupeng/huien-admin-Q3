import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'ic:baseline-view-in-ar',
      keepAlive: true,
      order: 200,
      title: $t('applies.title'),
    },
    name: 'applies',
    path: '/applies',

    children: [
      {
        meta: {
          title: $t('applies.antd'),
          query: {
            projectId: undefined,
            projectName: undefined,
          },
          maxNumOfOpenTab: 1,
        },
        name: 'applies-lists',
        path: '/applies/lists',
        component: () => import('#/views/applies/index.vue'),
      },
    ],
  },
];

export default routes;
