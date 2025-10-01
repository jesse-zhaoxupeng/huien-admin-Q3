<script lang="ts" setup>
import type { AdImageApi } from '#/api';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Button, message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { createAdImage, updateAdImage } from '#/api';
import { $t } from '#/locales';

import { useSchema } from '../data';

const emit = defineEmits(['success']);
const formData = ref<AdImageApi.AdImage>();
const getTitle = computed(() => {
  return formData.value?.id
    ? $t('ui.actionTitle.edit', ['广告图'])
    : $t('ui.actionTitle.create', ['广告图']);
});

const [Form, formApi] = useVbenForm({
  layout: 'horizontal',
  schema: useSchema(),
  wrapperClass: 'grid-cols-2',
  showDefaultActions: false,
});

function resetForm() {
  formApi.resetForm();
  formApi.setValues(formData.value || {});
}

const [Modal, modalApi] = useVbenModal({
  class: 'w-[800px]',
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (valid) {
      modalApi.lock();
      const data = await formApi.getValues();
      const params = {
        url: data.files[0].response.url,
        ...data,
      };
      try {
        await (formData.value?.id
          ? updateAdImage({ ...params, id: formData.value?.id })
          : createAdImage(params));
        modalApi.close();
        message.success(
          formData.value?.id
            ? $t('ui.actionTitle.edit', ['广告图成功'])
            : $t('ui.actionTitle.create', ['广告图成功']),
        );
        emit('success');
      } finally {
        modalApi.lock(false);
      }
    }
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<AdImageApi.AdImage>();
      if (data) {
        if (data.pid === 0) {
          data.pid = undefined;
        }
        const formattedFiles = [
          {
            name: data.name,
            status: 'done',
            type: `images/${data.category}`,
            url: data.url,
            response: { url: data.url },
            thumbUrl: data.url,
            uid: data.id,
          },
        ];

        formData.value = data;
        formApi.setValues({
          ...formData.value,
          files: data.url ? formattedFiles : null,
        });
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
