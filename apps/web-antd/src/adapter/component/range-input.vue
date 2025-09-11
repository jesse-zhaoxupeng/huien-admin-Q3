<script lang="ts" setup>
import { Input, Space } from 'ant-design-vue';

interface VzCheckboxInputProps {
  placeholder?: [string, string];
  separator?: string;
}

interface ModelValueType {
  min: string;
  max: string;
}

defineOptions({
  name: 'VzRangeInput',
});
const { placeholder = ['min', 'max'], separator = '~' } =
  defineProps<VzCheckboxInputProps>();

const modelValue = defineModel<['', '']>('value', {
  default: ['', ''],
});
</script>

<template>
  <Space>
    <Input v-model:value="modelValue[0]" :placeholder="placeholder[0]" />
    <span>{{ separator }}</span>
    <Input v-model:value="modelValue[1]" :placeholder="placeholder[1]" />
  </Space>
</template>
