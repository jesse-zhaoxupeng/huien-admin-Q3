<script setup lang="ts">
import type { WorkbenchTodoItem } from '../typing';

import { Card, CardContent } from '@vben-core/shadcn-ui';

import { Button } from 'ant-design-vue';

interface Props {
  items: WorkbenchTodoItem[];
  title: string;
}

defineOptions({
  name: 'WorkbenchTodo',
});

withDefaults(defineProps<Props>(), {
  items: () => [],
});
</script>

<template>
  <div>
    <div class="text-l font-bold">8月待办任务:1</div>
    <div class="mt-5 flex flex-wrap">
      <div class="flex flex-col flex-wrap pr-2">
        <span>9日</span>
        <span>周五</span>
      </div>
      <Card class="flex-1">
        <CardContent class="flex flex-wrap">
          <ul class="divide-border w-full divide-y" role="list">
            <li
              v-for="item in items"
              :key="item.title"
              class="flex cursor-pointer items-end justify-between gap-x-6 py-5"
            >
              <div class="flex min-w-0 items-center gap-x-4">
                <!--         <div class="grid grid-cols-4 gap-x-20 gap-y-2"> -->
                <div class="grid min-w-0 flex-auto gap-y-2">
                  <div class="flex">
                    <span class="pr-2 font-semibold text-gray-500">
                      项目名称:
                    </span>
                    <p class="text-foreground text-sm font-medium leading-6">
                      {{ item.title }}
                    </p>
                  </div>
                  <div class="flex">
                    <span class="pr-2 font-semibold text-gray-500">
                      自述疾病名称:
                    </span>
                    <p class="text-foreground text-sm font-medium leading-6">
                      {{ item.title }}
                    </p>
                  </div>
                  <div class="flex">
                    <span class="pr-2 font-semibold text-gray-500">
                      自述疾病:
                    </span>
                    <p class="text-foreground text-sm font-medium leading-6">
                      {{ item.title }}
                    </p>
                  </div>
                  <div class="flex">
                    <span class="pr-2 font-semibold text-gray-500">
                      患者称呼/昵称:
                    </span>
                    <p class="text-foreground text-sm font-medium leading-6">
                      {{ item.title }}
                    </p>
                  </div>
                  <div class="flex">
                    <span class="pr-2 font-semibold text-gray-500">
                      推荐人手机号:
                    </span>
                    <p class="text-foreground text-sm font-medium leading-6">
                      {{ item.title }}
                    </p>
                  </div>
                  <div class="flex">
                    <span class="pr-2 font-semibold text-gray-500">
                      报名项目:
                    </span>
                    <p class="text-foreground text-sm font-medium leading-6">
                      {{ item.title }}
                    </p>
                  </div>

                  <!-- eslint-disable vue/no-v-html -->
                  <div class="flex">
                    <span class="pr-2 font-semibold text-gray-500">
                      联系方式:
                    </span>
                    <p class="text-foreground text-sm font-medium leading-6">
                      {{ item.title }}
                    </p>
                  </div>
                  <div class="flex">
                    <span class="pr-2 font-semibold text-gray-500">
                      年龄:
                    </span>
                    <p class="text-foreground text-sm font-medium leading-6">
                      {{ item.title }}
                    </p>
                  </div>
                  <div class="flex">
                    <span class="pr-2 font-semibold text-gray-500">
                      性别:
                    </span>
                    <p class="text-foreground text-sm font-medium leading-6">
                      {{ item.title }}
                    </p>
                  </div>
                  <div class="flex">
                    <span class="pr-2 font-semibold text-gray-500">
                      意向参加城市:
                    </span>
                    <p class="text-foreground text-sm font-medium leading-6">
                      {{ item.title }}
                    </p>
                  </div>
                  <div class="flex">
                    <span class="pr-2 font-semibold text-gray-500">
                      报名时间:
                    </span>
                    <p class="text-foreground text-sm font-medium leading-6">
                      {{ item.title }}
                    </p>
                  </div>
                  <div class="flex">
                    <span class="pr-2 font-semibold text-gray-500">
                      审核状态:
                    </span>
                    <p class="text-foreground text-sm font-medium leading-6">
                      {{ item.title }}
                    </p>
                  </div>
                </div>
              </div>
              <div
                class="hidden h-full shrink-0 sm:flex sm:flex-col sm:items-end"
              >
                <span class="text-foreground/80 mt-6 text-xs leading-6">
                  {{ item.date }}
                </span>
                <Button type="primary"> 审核 </Button>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
