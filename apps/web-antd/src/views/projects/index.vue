<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { ProjectsApi } from '#/api';

import { useRouter } from 'vue-router';

import { Page, useVbenModal } from '@vben/common-ui';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteProject,
  getDictionariesList,
  getIndicationsList,
  getProjectsList,
  updateProject,
} from '#/api';

import { useColumns } from './data';
import Form from './modules/form.vue';
import OpenHospital from './modules/open-hospital.vue';

interface RowType {
  category: string;
  color: string;
  id: string;
  price: string;
  productName: string;
  releaseDate: string;
}
const router = useRouter();

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

const [OpenHospitalModal, openHospitalModalApi] = useVbenModal({
  connectedComponent: OpenHospital,
  destroyOnClose: true,
});

const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  // fieldMappingTime: [['date', ['start', 'end']]],
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
      component: 'Select',
      defaultValue: undefined,
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          {
            label: '等待招募',
            value: '0',
          },
          {
            label: '正在招募',
            value: '1',
          },
          {
            label: '停止招募',
            value: '2',
          },
        ],
        placeholder: '全部',
        showSearch: true,
      },
      fieldName: 'status',
      label: '招募状态',
      labelWidth: 60,
    },
    {
      component: 'ApiSelect',
      componentProps: {
        allowClear: true,
        immediate: true,
        api: async () => {
          const res = await getIndicationsList({ page: 1, pageSize: 100 });

          return res.data;
        },
        class: 'w-full',
        labelField: 'name',
        valueField: 'id',
        placeholder: '全部',
        showSearch: true,
      },
      fieldName: 'indication_id',
      label: '适应症',
      labelWidth: 60,
    },

    {
      component: 'RangePicker',
      defaultValue: undefined,
      componentProps: {
        allowClear: true,
        filterOption: true,

        placeholder: ['开始日期', '结束日期'],
        showSearch: true,
      },
      fieldName: 'createAts',
      formItemClass: 'col-span-1',
      label: '创建时间',
      labelWidth: 60,
    },

    {
      // 组件需要在 #/adapter.ts内注册，并加上类型
      component: 'Input',
      // 对应组件的参数
      componentProps: {
        placeholder: '按 项目名称/药物名称 搜索',
      },
      // 字段名
      fieldName: 'keywords',
      // formItemClass: 'col-span-2',
      // 界面显示的label
      label: '搜索',
      hideLabel: true,
      // labelWidth: 0,
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
function onEdit(row: ProjectsApi.Indication) {
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
  await deleteProject(row.id);

  gridApi.formApi.submitForm();
  message.success(`${row.projectName} 删除成功`);
};

/**
 * 停止招募
 */
const onStop = async (row) => {
  let willStatus = '1';  // 默认转为"正在招募"
  
  if (row.status === '0') {
    willStatus = '1';  // 等待招募->正在招募
  }
  if (row.status === '1') {
    willStatus = '2';  // 正在招募->停止招募
  } 
  if (row.status === '2') {
    willStatus = '1';  // 停止招募->正在招募
  }
  
  const updateParams = {
    status: willStatus,
  };
  await updateProject(row.id, updateParams);

  gridApi.formApi.submitForm();
  message.success(`招募状态调整成功`);
};

/**
 * 开展医院
 */
const onHospital = async (row) => {
  openHospitalModalApi.setData(row).open();
};

/**
 * 报名管理
 */
const onApply = async (row) => {
  router.push({
    name: 'applies-lists',
    query: {
      projectId: row.id,
      projectName: row.projectName,
    },
    // params: {
    //   id: row.id,
    // },
  });
};

const onSuccess = () => {
  gridApi.formApi.submitForm();
};

/**
 * 表格操作按钮的回调函数
 */
function onActionClick({
  code,
  row,
}: OnActionClickParams<ProjectsApi.Indication>) {
  switch (code) {
    case 'apply': {
      onApply(row);

      break;
    }
    case 'delete': {
      onDelete(row);

      break;
    }
    case 'edit': {
      onEdit(row);
      break;
    }
    case 'hospital': {
      onHospital(row);

      break;
    }
    case 'stop': {
      onStop(row);
      break;
    }
  }
}

const gridOptions: VxeTableGridOptions<RowType> = {
  gridEvents: {
    mounted: () => {
      console.log('表格已挂载');
    },
    'checkbox-change': () => {
      console.log('复选框状态变化');
    },
    'checkbox-all': () => {
      console.log('全选复选框状态变化');
    },
  },
  checkboxConfig: {
    highlight: true,
    labelField: 'projectName',
  },
  border: true,
  columns: useColumns(onActionClick),
  exportConfig: {},
  height: 'auto',
  keepSource: true,
  rowConfig: {
    keyField: 'id', // 确保正确的行键字段
  },
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        // message.success(`Query params: ${JSON.stringify(formValues)}`);

        const res = await getProjectsList({
          page: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        });

        console.log('原始API响应:', res);
        
        // 检查API响应格式
        if (!res.list) {
          console.error('API响应中没有list字段:', res);
          return { items: [], total: 0 };
        }
        
        // 保持原始字段名称，仅添加表格需要的额外字段
        const transformedData = res.list.map(item => {
          console.log('处理项目:', item.projectName, '原始状态:', item.status);
          
          // 简化数据转换，只添加必要字段
          return {
            ...item,
            // 只添加必须的嵌套对象
            type: { label: item.projectTypeName || '', value: item.projectType },
            stage: { label: item.projectStageName || '', value: item.projectStage },
            // 状态ID映射（必需）
            statusId: mapStatusId(item.status),
          };
        });
        
        console.log('转换后数据第一项:', transformedData[0]);
        
        // 确保返回正确的数据结构
        const result = {
          items: transformedData,
          total: res.total || transformedData.length,
        };
        
        console.log('返回给表格的数据结构:', result);
        return result;
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

// 状态ID映射函数
function mapStatusId(status) {
  const statusMap = {
    "0": "206628493037797903357", // 等待招募
    "1": "206628519472642133136", // 正在招募
    "2": "206628562022253305061"  // 停止招募
  };
  return statusMap[status] || status;
}

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});
</script>

<template>
  <Page auto-content-height>
    <OpenHospitalModal @success="onSuccess" />
    <FormModal @success="onSuccess" />
    <Grid table-title="项目列表">
      <template #toolbar-tools>
        <Button type="primary" @click="onCreate"> 新增 </Button>
      </template>
    </Grid>
  </Page>
</template>
