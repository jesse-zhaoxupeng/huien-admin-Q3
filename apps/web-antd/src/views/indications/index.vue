<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { IndicationsApi } from '#/api/indications';

import { Page, useVbenModal } from '@vben/common-ui';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteIndication,
  getDictionariesList,
  getIndicationsList,
} from '#/api';

import { useColumns } from './data';
import Form from './modules/form.vue';

interface RowType {
  category: string;
  color: string;
  id: string;
  price: string;
  productName: string;
  releaseDate: string;
}

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  fieldMappingTime: [['date', ['start', 'end']]],
  schema: [
    {
      component: 'ApiSelect',
      componentProps: {
        allowClear: true,
        immediate: true,
        api: async () => {
          const res = await getDictionariesList({ dict_type: 'project_type' });

          return res.data;
        },
        class: 'w-full',
        labelField: 'label',
        valueField: 'value',
        placeholder: '全部',
        showSearch: true,
      },
      fieldName: 'project_type',
      label: '项目类型',
      labelWidth: 60,
    },
    {
      // 组件需要在 #/adapter.ts内注册，并加上类型
      component: 'Input',
      // 对应组件的参数
      componentProps: {
        placeholder: '按 适应症名称 搜索',
      },
      // 字段名
      fieldName: 'keywords',
      // 界面显示的label
      label: '搜索',
      hideLabel: true,
    },
  ],
  // 控制表单是否显示折叠按钮
  showCollapseButton: true,
  // 是否在字段值改变时提交表单
  submitOnChange: true,
  // 按下回车时是否提交表单
  submitOnEnter: false,
};

/**
 * 编辑部门
 * @param row
 */
function onEdit(row: IndicationsApi.Indication) {
  console.info('edit 删除处理逻辑', row);
  console.info('formModalApi', formModalApi);
  formModalApi.setData(row).open();
  // formModalApi.setData(row).open();
}

/**
 * 创建新部门
 */
function onCreate() {
  formModalApi.setData(null).open();
}

/**
 * 删除
 */
const onDelete = async (row) => {
  const res = await deleteIndication(row.id);

  gridApi.formApi.submitForm();
  message.success(`${row.name} 删除成功`);
};

/**
 * 表格操作按钮的回调函数
 */
function onActionClick({
  code,
  row,
}: OnActionClickParams<IndicationsApi.Indication>) {
  switch (code) {
    case 'delete': {
      onDelete(row);

      break;
    }
    case 'edit': {
      onEdit(row);
      break;
    }
  }
}

const gridOptions: VxeTableGridOptions<RowType> = {
  gridEvents: {},
  checkboxConfig: {
    highlight: true,
    labelField: 'name',
  },
  border: true,
  columns: useColumns(onActionClick),
  exportConfig: {},
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        // message.success(`Query params: ${JSON.stringify(formValues)}`);

        const res = await getIndicationsList({
          page: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        });

        return {
          items: res.data,
          total: res.total,
        };
      },
    },
  },
  toolbarConfig: {
    custom: true,
    export: false,
    refresh: { code: 'query' },
    zoom: true,
  },
};

const onSuccess = () => {
  gridApi.formApi.submitForm();
};

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});
</script>

<template>
  <Page auto-content-height>
    <FormModal @success="onSuccess" />
    <Grid table-title="适应症列表">
      <template #toolbar-tools>
        <Button type="primary" @click="onCreate"> 新增 </Button>
      </template>
    </Grid>
  </Page>
</template>
