<script lang="ts" setup>
import type { ProjectsApi } from '#/api';

// import { computed, onMounted, ref } from 'vue';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Button } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { createProjectOpenHospital, updateProjectOpenHospital } from '#/api';
import { $t } from '#/locales';

// //
import { useOpenHospitalSchema } from '../data';

import '@wangeditor/editor/dist/css/style.css'; // 引入 css

const emit = defineEmits(['success']);
const formData = ref<ProjectsApi.Project>();
const getTitle = computed(() => {
  console.log('getTitle formData', formData.value);
  return formData.value?.id
    ? $t('ui.actionTitle.edit', ['开展医院'])
    : $t('ui.actionTitle.create', ['开展医院']);
});

const [Form, formApi] = useVbenForm({
  layout: 'horizontal',
  schema: useOpenHospitalSchema(),
  wrapperClass: 'grid-cols-2',
  showDefaultActions: false,
});

function resetForm() {
  formApi.resetForm();
  formApi.setValues(formData.value || {});
}

// 模拟 ajax 异步获取内容
onMounted(() => {
  // setTimeout(() => {
  //   valueHtml.value = '<p>模拟 Ajax 异步设置内容</p>';
  // }, 1500);
});

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {});

const [Modal, modalApi] = useVbenModal({
  class: 'w-[800px]',
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (valid) {
      modalApi.lock();
      const data = await formApi.getValues();
      data.project_id = formData.value?.project_id;

      try {
        await (formData.value?.id
          ? updateProjectOpenHospital(formData.value.id, data)
          : createProjectOpenHospital(data));
        modalApi.close();
        emit('success');
      } finally {
        modalApi.lock(false);
      }
    }
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<ProjectsApi.Project>();
      if (data) {
        if (data.pid === 0) {
          data.pid = undefined;
        }
        formData.value = data;

        // valueHtml.value = data.project_info;
        formApi.setValues(formData.value);
      }
    }
  },
});
</script>

<template>
  <Modal :title="getTitle">
    <Form class="mx-4" />

    <template #prepend-footer>
      <div class="flex-auto">
        <Button type="primary" danger @click="resetForm">
          {{ $t('common.reset') }}
        </Button>
      </div>
    </template>
  </Modal>
</template>
