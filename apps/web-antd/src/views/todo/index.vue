<script lang="ts" setup>
// import type {
//   WorkbenchProjectItem,
//   WorkbenchQuickNavItem,
//   WorkbenchTodoItem,
//   WorkbenchTrendItem,
// } from '@vben/common-ui';

import type { MyTodoParticipantsApi } from '#/api';

import { onMounted, ref } from 'vue';

// import { useRouter } from 'vue-router';
import { WorkbenchHeader } from '@vben/common-ui';
import { preferences } from '@vben/preferences';
import { useUserStore } from '@vben/stores';

import { geMyTodoParticipants } from '#/api';

import WorkbenchTodo from './modules/workbench-todo.vue';
// import { openWindow } from '@vben/utils';

// import AnalyticsVisitsSource from '../analytics/analytics-visits-source.vue';

const userStore = useUserStore();
const myTodoParticipantsList =
  ref<MyTodoParticipantsApi.MyTodoParticipants[]>();
// 页面加载时请求数据
onMounted(async () => {
  try {
    const res = await geMyTodoParticipants();
    myTodoParticipantsList.value = res;
  } catch (error) {
    console.error('请求失败:', error);
    loading.value = false;
    // 可选：显示错误提示
  } finally {
    loading.value = false;
  }
});

// const trendItems: WorkbenchTrendItem[] = [
//   {
//     avatar: 'svg:avatar-1',
//     content: `在 <a>开源组</a> 创建了项目 <a>Vue</a>`,
//     date: '刚刚',
//     title: '威廉',
//   },
//   {
//     avatar: 'svg:avatar-2',
//     content: `关注了 <a>威廉</a> `,
//     date: '1个小时前',
//     title: '艾文',
//   },
//   {
//     avatar: 'svg:avatar-3',
//     content: `发布了 <a>个人动态</a> `,
//     date: '1天前',
//     title: '克里斯',
//   },
//   {
//     avatar: 'svg:avatar-4',
//     content: `发表文章 <a>如何编写一个Vite插件</a> `,
//     date: '2天前',
//     title: 'Vben',
//   },
//   {
//     avatar: 'svg:avatar-1',
//     content: `回复了 <a>杰克</a> 的问题 <a>如何进行项目优化？</a>`,
//     date: '3天前',
//     title: '皮特',
//   },
//   {
//     avatar: 'svg:avatar-2',
//     content: `关闭了问题 <a>如何运行项目</a> `,
//     date: '1周前',
//     title: '杰克',
//   },
//   {
//     avatar: 'svg:avatar-3',
//     content: `发布了 <a>个人动态</a> `,
//     date: '1周前',
//     title: '威廉',
//   },
//   {
//     avatar: 'svg:avatar-4',
//     content: `推送了代码到 <a>Github</a>`,
//     date: '2021-04-01 20:00',
//     title: '威廉',
//   },
//   {
//     avatar: 'svg:avatar-4',
//     content: `发表文章 <a>如何编写使用 Admin Vben</a> `,
//     date: '2021-03-01 20:00',
//     title: 'Vben',
//   },
// ];

// const router = useRouter();

// // 这是一个示例方法，实际项目中需要根据实际情况进行调整
// // This is a sample method, adjust according to the actual project requirements
// function navTo(nav: WorkbenchProjectItem | WorkbenchQuickNavItem) {
//   if (nav.url?.startsWith('http')) {
//     openWindow(nav.url);
//     return;
//   }
//   if (nav.url?.startsWith('/')) {
//     router.push(nav.url).catch((error) => {
//       console.error('Navigation failed:', error);
//     });
//   } else {
//     console.warn(`Unknown URL for navigation item: ${nav.title} -> ${nav.url}`);
//   }
// }
</script>

<template>
  <div class="p-5">
    <WorkbenchHeader
      :avatar="userStore.userInfo?.avatar || preferences.app.defaultAvatar"
    >
      <template #title>
        早安, {{ userStore.userInfo?.realName }}, 开始您一天的工作吧！
      </template>
      <template #description> 今日晴，20℃ - 32℃！ </template>
    </WorkbenchHeader>

    <div class="mt-4 flex flex-col">
      <WorkbenchTodo
        :items="myTodoParticipantsList"
        class="pt-0"
        title="待办事项"
      />
    </div>
  </div>
</template>
