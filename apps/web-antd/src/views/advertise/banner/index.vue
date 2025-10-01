<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { AdImageApi } from '#/api';

import { Page, useVbenModal } from '@vben/common-ui';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteAdImage, getAdImageList } from '#/api';

import { useColumns } from './data';
import Form from './modules/form.vue';

interface RowType {
  name: string;
  url: string;
  description: string;
  sequenceNo: string;
  category: string;
  comment: string;
  linkType: string;
  linkData: string;
  id: string;
}

// console.info('Form', Form);

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
  onClosed: () => {
    gridApi.formApi.submitForm();
  },
});

// const formOptions: VbenFormProps = {
//   // 默认展开
//   collapsed: false,
//   fieldMappingTime: [['date', ['start', 'end']]],
//   schema: [
//     {
//       component: 'ApiCascader',
//       componentProps: {
//         allowClear: true,
//         immediate: true,
//         api: async () => {
//           return await getCitysList({ isShowTree: '1' });
//         },
//         class: 'w-full',
//         fieldNames: {
//           label: 'cityname',
//           value: 'id',
//           children: 'children',
//         },

//         placeholder: '全部',
//         showSearch: true,
//       },
//       fieldName: 'area_ids',
//       label: '所属城市',
//       labelWidth: 60,
//     },

//     {
//       // 组件需要在 #/adapter.ts内注册，并加上类型
//       component: 'Input',
//       // 对应组件的参数
//       componentProps: {
//         placeholder: '按 医院名称 搜索',
//       },
//       // 字段名
//       fieldName: 'keywords',
//       // 界面显示的label
//       label: '搜索',
//       labelWidth: 60,
//       hideLabel: true,
//     },
//   ],
//   // 控制表单是否显示折叠按钮
//   showCollapseButton: true,
//   // 是否在字段值改变时提交表单
//   submitOnChange: true,
//   // 按下回车时是否提交表单
//   submitOnEnter: false,
// };

/**
 * 编辑部门
 * @param row
 */
function onEdit(row: AdImageApi.AdImage) {
  formModalApi.setData(row).open();
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
const onDelete = async (row: RowType) => {
  deleteAdImage(row.id)
    .then(() => {
      gridApi.formApi.submitForm();
      message.success(`${row.name} 删除成功`);
      handleFormSuccess();
    })
    .catch(() => {
      message.error(`${row.name} 删除失败`);
    });
};

// deleteCity

/**
 * 表格操作按钮的回调函数
 */
function onActionClick({ code, row }: OnActionClickParams<AdImageApi.AdImage>) {
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
function handleFormSuccess() {
  // ✅ 刷新表格数据
  gridApi.reload();
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
        const res = await getAdImageList({
          pageNo: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        });

        return {
          items: res.list,
          total: res.totalRecords,
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

const [Grid, gridApi] = useVbenVxeGrid({
  // formOptions,
  gridOptions,
});
</script>

<template>
  <Page auto-content-height>
    <FormModal @success="handleFormSuccess" />
    <Grid table-title="广告图片列表">
      <template #toolbar-tools>
        <Button type="primary" @click="onCreate"> 新增 </Button>
      </template>
    </Grid>
  </Page>
</template>
