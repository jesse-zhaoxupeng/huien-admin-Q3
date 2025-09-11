<script lang="ts" setup>
import type { IndicationsApi } from '#/api/indications';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Button } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import {
  createDataDictionaryItem,
  getDataDictionariesItemList,
  updateDataDictionaryItem,
} from '#/api';
import { $t } from '#/locales';

import { useSchema } from '../data';

const emit = defineEmits(['success']);
const formData = ref<IndicationsApi.Indication>();
const getTitle = computed(() => {
  return formData.value?.id
    ? $t('ui.actionTitle.edit', ['字典'])
    : $t('ui.actionTitle.create', ['字典']);
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
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (valid) {
      modalApi.lock();
      const formCurrentData = await formApi.getValues();

      try {
        await (formData.value?.id
          ? updateDataDictionaryItem(formData.value.id, formCurrentData)
          : createDataDictionaryItem(formCurrentData));
        modalApi.close();
        emit('success');
      } finally {
        modalApi.lock(false);
      }
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<IndicationsApi.Indication>();

      if (data) {
        formData.value = data;
        formApi.setValues(formData.value);

        formApi.updateSchema([
          {
            component: 'ApiCascader',
            componentProps: (values) => {
              return {
                allowClear: true,
                changeOnSelect: true,
                immediate: true,
                api: async () => {
                  return await getDataDictionariesItemList({
                    isShowTree: '1',
                    data_dictionary_id: data.data_dictionary_id,
                  });
                },
                class: 'w-full',
                fieldNames: {
                  label: 'name',
                  value: 'id',
                  children: 'children',
                },
                placeholder: '请选择 上级项目',
                showSearch: true,
                onChange: (value, selectedOptions) => {
                  if (value) {
                    values.parent_id = value[value.length - 1];
                    values.parent_names = selectedOptions.map(
                      (item) => item.name,
                    );
                  } else {
                    values.parent_id = '0';
                    values.parent_ids = [];
                    values.parent_names = [];
                  }
                },
              };
            },
            defaultValue: [],
            fieldName: 'parent_ids',
            label: '上级项目',
            labelWidth: 80,
            // rules: 'selectRequired',
          },
        ]);
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
