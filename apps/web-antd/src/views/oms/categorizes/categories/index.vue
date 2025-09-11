<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { CategorizesCategoriesApi } from '#/api';

import { Page, useVbenModal } from '@vben/common-ui';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteCategorizeCategory,
  getCategorizesCategoryList,
  getCitysList,
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
  onClosed: () => {
    gridApi.formApi.submitForm();
  },
});

const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  fieldMappingTime: [['date', ['start', 'end']]],
  schema: [
    {
      component: 'ApiCascader',
      componentProps: {
        allowClear: true,
        immediate: true,
        api: async () => {
          return await getCitysList({ isShowTree: '1' });
        },
        class: 'w-full',
        fieldNames: {
          label: 'cityname',
          value: 'id',
          children: 'children',
        },

        placeholder: '全部',
        showSearch: true,
      },
      fieldName: 'area_ids',
      label: '所属城市',
      labelWidth: 60,
    },

    {
      // 组件需要在 #/adapter.ts内注册，并加上类型
      component: 'Input',
      // 对应组件的参数
      componentProps: {
        placeholder: '按 医院名称 搜索',
      },
      // 字段名
      fieldName: 'keywords',
      // 界面显示的label
      label: '搜索',
      labelWidth: 60,
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
 * 编辑分类类型
 * @param row
 */
function onEdit(row: CategorizesCategoriesApi.CategorizeCategory) {
  formModalApi.setData(row).open();
  // formModalApi.setData(row).open();
}

/**
 * 创建新分类类型
 */
function onCreate() {
  formModalApi.setData(null).open();
}

/**
 * 删除
 */
const onDelete = async (row: CategorizesCategoriesApi.CategorizeCategory) => {
  const res = await deleteCategorizeCategory(row.id);

  gridApi.formApi.submitForm();
  message.success(`${row.name} 删除成功`);
};

// deleteCity

/**
 * 表格操作按钮的回调函数
 */
function onActionClick({
  code,
  row,
}: OnActionClickParams<CategorizesCategoriesApi.CategorizeCategory>) {
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
        const res = await getCategorizesCategoryList({
          page: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        });

        console.log(res);

        return {
          items: res,
          total: 10,
        };
      },
    },
  },
  treeConfig: {
    indent: 20,
    transform: true, // 指定表格为树形表格
    parentField: 'parent_id', // 父节点字段名
    rowField: 'id', // 行数据字段名
    children: 'children',
  },
  toolbarConfig: {
    custom: true,
    export: false,
    refresh: { code: 'query' },
    zoom: true,
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});
</script>

<template>
  <Page auto-content-height>
    <FormModal />
    <Grid table-title="分类类型">
      <template #toolbar-tools>
        <Button type="primary" @click="onCreate"> 新增 </Button>
      </template>
    </Grid>
  </Page>
</template>
