<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { Page } from '@vben/common-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getAiTodoParticipants } from '#/api/aiSpeedDating';

import { useColumns } from './data';

// import Form from './modules/form.vue';

interface RowType {
  /** 项目ID */
  projectId: string;
  /** 项目名称 */
  projectName: string;
  /** 项目类型 */
  projectType?: string;
  /** 待办数量 */
  counts: string;
  /** 项目报名待办日期 */
  participantDate: string;
  /** 项目报名待办月份 */
  participantMonth: string;
}

// const [FormModal, formModalApi] = useVbenModal({
//   connectedComponent: Form,
//   destroyOnClose: true,
//   onClosed: () => {
//     gridApi.formApi.submitForm();
//   },
// });

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
//           return await getCitysList();
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

// /**
//  * 编辑部门
//  * @param row
//  */
// function onEdit(row: HospitalsApi.Indication) {
//   formModalApi.setData(row).open();
//   // formModalApi.setData(row).open();
// }

// /**
//  * 创建新部门
//  */
// function onCreate() {
//   formModalApi.setData(null).open();
// }

/**
 * 删除
 */
// const onDelete = async (row) => {
//   deleteHospital(row.id).then(() => {
//     gridApi.formApi.submitForm();
//     message.success(`${row.name} 删除成功`);
//   });
//   // console.info('res', res);
// };

// deleteCity

/**
 * 表格操作按钮的回调函数
 */
// function onActionClick({
//   code,
//   row,
// }: OnActionClickParams<HospitalsApi.Indication>) {
//   switch (code) {
//     case 'delete': {
//       onDelete(row);

//       break;
//     }
//     case 'edit': {
//       onEdit(row);
//       break;
//     }
//   }
// }

const gridOptions: VxeTableGridOptions<RowType> = {
  gridEvents: {},
  checkboxConfig: {
    highlight: true,
    labelField: 'name',
  },
  border: true,
  columns: useColumns(),
  exportConfig: {},
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async () => {
        const res = await getAiTodoParticipants();
        return {
          items: res,
          total: res.length,
        };
      },
    },
  },
  toolbarConfig: {
    custom: true,
    export: false,
    refresh: true,
    zoom: true,
  },
};

const [Grid] = useVbenVxeGrid({
  // formOptions,
  gridOptions,
});
</script>

<template>
  <Page auto-content-height>
    <Grid table-title="AI速配列表" />
  </Page>
</template>
