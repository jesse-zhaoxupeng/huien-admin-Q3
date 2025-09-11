<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { ParticipantsApi } from '#/api';

import { nextTick, ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';

import { Page, useVbenModal } from '@vben/common-ui';
import { useTabs } from '@vben/hooks';
import { downloadFileFromUrl } from '@vben/utils';

import { Button, Segmented, Space } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  exportParticipantsList,
  getAuditStatusStatistics,
  getCitysList,
  getDictionariesList,
  getIndicationsList,
  getParticipantsList,
  getProjectsList,
} from '#/api';

import { useColumns } from './data';
import Detail from './modules/detail.vue';
import Form from './modules/form.vue';

const route = useRoute();

const { setTabTitle } = useTabs();

// const projectId = computed(() => {
//   console.info('projectId =>', route);
//   return route.params?.projectId ?? undefined;
// });

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

const [DetailModal, detailModalApi] = useVbenModal({
  connectedComponent: Detail,
  destroyOnClose: true,
  showConfirmButton: false,
  onClosed: () => {
    loadAuditStatusStatistics();
    if (mode.value === 'audit') {
      gridApi.formApi.submitForm();
    }
  },
});

const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,

  // fieldMappingTime: [['area_ids', ['province_id', 'city_id']]],
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
      hideLabel: false,

      labelWidth: 60,
      label: '项目类型',
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
      label: '报名时间',
      labelWidth: 60,
    },

    {
      component: 'ApiSelect',
      componentProps: {
        allowClear: true,
        immediate: true,
        api: async () => {
          const res = await getDictionariesList({
            dict_type: 'gender_requirement',
          });

          return res.data;
        },
        class: 'w-full',
        labelField: 'label',
        valueField: 'value',
        placeholder: '全部',
        showSearch: true,
      },
      fieldName: 'gender',
      label: '人员性别',

      labelWidth: 60,
    },
    {
      component: 'VzRangeInput',
      componentProps: {
        placeholder: ['最小年龄', '最大年龄'],
        class: 'w-full',
      },
      // modelPropName: 'value',
      defaultValue: ['', ''],
      fieldName: 'ages',
      label: '年龄范围',
      labelWidth: 60,
    },
    {
      component: 'ApiSelect',
      componentProps: {
        allowClear: true,
        immediate: true,
        api: async () => {
          const res = await getProjectsList({
            is_deleted: '0',
          });

          return res.data;
        },
        class: 'w-full',

        fieldNames: { label: 'project_name', value: 'id' },
        placeholder: '报名项目',
        showSearch: true,
        filterOption: (input: string, option: any) => {
          return option.project_name.includes(input);
        },
        onChange: (value, option) => {
          loadAppliesByProjectId(option?.project_name);
        },
      },
      fieldName: 'project_id',
      label: '报名项目',
      labelWidth: 60,
      hideLabel: true,
      formItemClass: 'col-span-2',
    },
    {
      // 组件需要在 #/adapter.ts内注册，并加上类型
      component: 'Input',
      // 对应组件的参数
      componentProps: {
        placeholder: '按 姓名/报名人/推荐人手机号/身份证号 搜索',
      },
      // 字段名
      fieldName: 'keywords',
      // 界面显示的label
      label: '搜索',
      formItemClass: 'col-span-1',

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

const mode = ref<string>('detail');

/**
 * 编辑部门
 * @param row
 */
function onEdit(row: ParticipantsApi.Indication) {
  formModalApi.setData(row).open();
  // formModalApi.setData(row).open();
}

/**
 * 创建新部门
 */
function onCreate() {
  formModalApi.setData(null).open();
}

const onDetail = (row) => {
  mode.value = 'detail';
  detailModalApi.setData({ row, mode: mode.value }).open();
};

const onAudit = (row) => {
  mode.value = 'audit';
  detailModalApi.setData({ row, mode: mode.value }).open();
};

/**
 * 表格操作按钮的回调函数
 */
function onActionClick({
  code,
  row,
}: OnActionClickParams<ParticipantsApi.Indication>) {
  switch (code) {
    case 'audit': {
      onAudit(row);
      break;
    }
    case 'delete': {
      // onDelete(row);
      console.info('delete', row);
      break;
    }
    case 'detail': {
      onDetail(row);
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

        const res = await getParticipantsList({
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

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});

const loadAppliesByProjectId = (
  projectName = undefined,
  projectId = undefined,
) => {
  if (projectName) {
    const slicedStr = `${projectName.slice(0, 6)}...`;
    setTabTitle(`${slicedStr}报名列表`);
  } else {
    setTabTitle('报名列表');
  }
  if (projectId) {
    nextTick(() => {
      gridApi.formApi.setFieldValue('project_id', Number.parseInt(projectId));
    });
  }
};

watchEffect(() => {
  const projectName = route.query.projectName || undefined;
  const projectId = route.query.projectId || undefined;
  loadAppliesByProjectId(projectName, projectId);
});

const loadAuditStatusStatistics = async () => {
  const res = await getAuditStatusStatistics();

  segmentedOptions.value = res;
  // segmentedOptions.value = res;
};

loadAuditStatusStatistics();

const exportFile = async () => {
  const params = await gridApi.formApi.getValues();
  const res = await exportParticipantsList(params);
  downloadFileFromUrl({
    source: res.url,
    target: '_self',
  });
};

const segmentedOptions = ref([
  {
    id: 10_232,
    title: '全部',
    value: '9199999',
    payload: {
      id: 10_232,
      title: '全部',
      count: 18,
    },
  },
  {
    id: 6,
    title: '待初筛',
    value: '0',
    payload: {
      id: 6,
      title: '待初筛',
      count: 6,
    },
  },
  {
    id: 7,
    title: '初筛通过',
    value: '1',
    payload: {
      id: 7,
      title: '初筛通过',
      count: 5,
    },
  },
  {
    id: 8,
    title: '初筛驳回',
    value: '2',
    payload: {
      id: 8,
      title: '初筛驳回',
      count: 1,
    },
  },
  {
    id: 9,
    title: '入组通过',
    value: '3',
    payload: {
      id: 9,
      title: '入组通过',
      count: 3,
    },
  },
  {
    id: 10,
    title: '入组驳回',
    value: '4',
    payload: {
      id: 10,
      title: '入组驳回',
      count: 3,
    },
  },
  {
    id: 11,
    title: '已脱落',
    value: '5',
    payload: {
      id: 11,
      title: '已脱落',
      count: 0,
    },
  },
  {
    id: 33,
    title: '缺少材料',
    value: '6',
    payload: {
      id: 33,
      title: '缺少材料',
      count: 0,
    },
  },
]);

const currentAuditStatus = ref('9199999');

const onSegmentedChange = (value: string) => {
  // console.info('onSegmentedChange', value);
  // console.info('onSegmentedChange gridApi', gridApi.formApi.submit());
  console.info('gridApi.formApi =>', gridApi.formApi);
  gridApi.formApi.setFieldValue('status', value);
  // gridApi.formApi.submitForm();
  // formApi.submit();
};
</script>

<template>
  <Page auto-content-height>
    <FormModal />
    <DetailModal />
    <Grid table-title="报名列表">
      <template #toolbar-tools>
        <Space>
          <Segmented
            v-model:value="currentAuditStatus"
            :options="segmentedOptions"
            @change="onSegmentedChange"
          >
            <template #label="{ payload }">
              <div>{{ payload.title }}({{ payload.count }})</div>
            </template>
          </Segmented>
          <Button type="primary" @click="exportFile">导出</Button>
        </Space>
      </template>
      <template #bmi="{ row }">
        {{
          (row.weight / (((row.height / 100) * row.height) / 100)).toFixed(2)
        }}
      </template>
    </Grid>
  </Page>
</template>
