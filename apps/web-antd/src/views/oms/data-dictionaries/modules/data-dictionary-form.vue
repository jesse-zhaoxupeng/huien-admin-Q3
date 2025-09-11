<script lang="ts" setup>
import type { IndicationsApi } from '#/api/indications';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Button } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { createDataDictionary, updateDataDictionary } from '#/api';
import { $t } from '#/locales';

import { useDataDictionarySchema } from '../data';

const emit = defineEmits(['success']);
const formData = ref<IndicationsApi.Indication>();
const getTitle = computed(() => {
  return formData.value?.id
    ? $t('ui.actionTitle.edit', ['字典'])
    : $t('ui.actionTitle.create', ['字典']);
});

const [Form, formApi] = useVbenForm({
  layout: 'horizontal',
  schema: useDataDictionarySchema(),
  wrapperClass: 'grid-cols-2',
  showDefaultActions: false,
});

function resetForm() {
  formApi.resetForm();
  formApi.setValues(formData.value || {});
}

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (valid) {
      modalApi.lock();
      const formCurrentData = await formApi.getValues();

      try {
        await (formData.value?.id
          ? updateDataDictionary(formData.value.id, formCurrentData)
          : createDataDictionary(formCurrentData));
        modalApi.close();
        emit('success');
      } finally {
        modalApi.lock(false);
      }
    }
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<IndicationsApi.Indication>();
      if (data) {
        formData.value = data;
        formApi.setValues(formData.value);
      }
    }
  },
});
</script>

<template>
  <Modal :title="getTitle" class="w-[800px]">
    <Form />
    <template #prepend-footer>
      <div class="flex-auto">
        <Button type="primary" danger @click="resetForm">
          {{ $t('common.reset') }}
        </Button>
      </div>
    </template>
  </Modal>
</template>
