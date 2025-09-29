<script lang="ts" setup>
import type { AdImageApi } from '#/api';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Button } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { $t } from '#/locales';

import { useSchema } from '../data';

// const emit = defineEmits(['success']);
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
      // console.log(formData.value);
      // modalApi.lock();
      // const data = await formApi.getValues();
      //  data.files[0].response
      // // console.log('updateHospital =>', data);
      // try {
      //   await (formData.value?.id
      //     ? updateHospital(formData.value.id, data)
      //     : createHospital(data));
      //   modalApi.close();
      //   emit('success');
      // } finally {
      //   modalApi.lock(false);
      // }
    }
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<IndicationsApi.Indication>();
      if (data) {
        if (data.pid === 0) {
          data.pid = undefined;
        }
        formData.value = data;
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
