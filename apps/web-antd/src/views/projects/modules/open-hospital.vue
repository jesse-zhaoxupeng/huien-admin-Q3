<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type {
  OnActionClickParams,
  VxeGridListeners,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { ProjectsApi } from '#/api';

// import { computed, onMounted, ref } from 'vue';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Button, message, Space } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteProjectOpenHospital,
  getProjectHospitalPage,
  updateProjectHospitalRemove,
  updateProjectHospitalStatus,
  updateProjectOpenHospital,
} from '#/api';

// import { createProjectOpenHospital, updateProjectOpenHospital } from '#/api';
import { useOpenHospitalColumns } from '../data';
import UpdateHospitalForm from './update-hospital-form.vue';

interface RowType {
  category: string;
  color: string;
  id: string;
  price: string;
  productName: string;
  releaseDate: string;
}

const emit = defineEmits(['success']);
const formData = ref<ProjectsApi.Project>();
const getTitle = computed(() => {
  return `开展医院`;
});

/**
 * 创建 新的开展医院
 */
function onCreate() {
  updateHospitalFormModalApi.setData({ project_id: formData.value.id }).open();
}

const onEdit = (row) => {
  console.log('修改开展医院. xxx..', row);
  updateHospitalFormModalApi.setData(row).open();
};

const onStatus = async (row) => {
  let willStatus = '206628493037797903357';
  if (row.status === '206628493037797903357') {
    willStatus = '206628519408439919256';
  }
  if (row.status === '206628519408439919256') {
    willStatus = '206628519472642133136';
  }
  if (row.status === '206628519472642133136') {
    willStatus = '206628519408439919256';
  }
  const updateParams = {
    status_id: willStatus,
  };
  await updateProjectOpenHospital(row.id, updateParams);
  gridApi.formApi.submitForm();
  emit('success');
  message.success(`招募状态调整成功`);
  // updateHospitalFormModalApi.setData(row).open();
};

const onDelete = async (row) => {
  await deleteProjectOpenHospital(row.id);

  gridApi.formApi.submitForm();
  emit('success');
  message.success(`移出成功`);
};

/**
 * 表格操作按钮的回调函数
 */
function onActionClick({
  code,
  row,
}: OnActionClickParams<ProjectsApi.Indication>) {
  switch (code) {
    case 'delete': {
      onDelete(row);

      break;
    }
    //
    case 'edit': {
      onEdit(row);
      break;
    }
    case 'status': {
      onStatus(row);

      break;
    }
  }
}

const gridOptions: VxeTableGridOptions<RowType> = {
  gridEvents: {
    onCheckboxChange: () => {
      console.log('checkboxChange');
    },
  },
  // checkboxConfig: {
  //   highlight: true,
  //   labelField: 'name',
  // },
  border: true,
  checkboxConfig: {
    // labelField: 'hospital.name',
    highlight: true,
  },
  columns: useOpenHospitalColumns(onActionClick),
  exportConfig: {},
  height: '600px',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        // 使用新的API获取项目医院列表
        const res = await getProjectHospitalPage({
          pageNo: page.currentPage,
          pageSize: page.pageSize,
          projectId: formData.value.id,
          ...formValues,
        });

        console.log('API响应数据:', res);
        
        // 检查不同可能的响应结构
        let listData = [];
        let totalCount = 0;
        
        // 情况1: 直接返回了{list, totalRecords}格式
        if (res && res.list) {
          listData = res.list;
          totalCount = res.totalRecords || res.list.length;
        } 
        // 情况2: 返回了{code, msg, data:{list, totalRecords}}格式
        else if (res && res.code === 0 && res.data) {
          if (res.data.list) {
            listData = res.data.list;
            totalCount = res.data.totalRecords || res.data.list.length;
          } else if (Array.isArray(res.data)) {
            // 情况3: 直接在data中返回了数组
            listData = res.data;
            totalCount = res.total || res.data.length;
          }
        }
        
        console.log('提取的列表数据:', listData);
        
        // 如果有数据，转换数据结构
        if (listData && listData.length > 0) {
          // 转换数据
          const items = listData.map(item => {
            return {
              ...item,
              // 以下是必要的转换
              id: item.id,
              project_id: item.projectId,
              hospital: {
                id: item.hospitalId,
                name: item.hospitalName,
                city: {
                  cityname: item.cityFullName || item.cityName,
                }
              },
              status: item.status,
              statusId: mapStatusToId(item.status), // 将简单状态码转为ID
              phone: item.phone,
              checkup_date: item.checkupDate,
              recruitment_count: item.recruitmentCount,
              create_time: item.createTime,
            };
          });

          console.log('转换后的数据:', items);
          
          return {
            items: items,
            total: totalCount,
          };
        }

        // 兜底返回空数据
        return {
          items: [],
          total: 0,
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

const checkboxRecordsIds = ref<string[]>([]);

const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  // fieldMappingTime: [['date', ['start', 'end']]],
  schema: [
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
      // formItemClass: 'col-span-2',
      // 界面显示的label
      label: '搜索',
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

const gridEvents: VxeGridListeners<RowType> = {
  checkboxChange: ({
    checked,
    row,
    rowIndex,
    $rowIndex,
    column,
    columnIndex,
    $columnIndex,
    $event,
  }) => {
    // console.log('checked', checked);
    // console.log('checkboxChange', row);
    // console.log('rowIndex', rowIndex);
    // console.log('$rowIndex', $rowIndex);
    const checkboxRecords = gridApi.grid.getCheckboxRecords();

    const recordsIds: string[] = [];
    checkboxRecords.forEach((item) => {
      recordsIds.push(item.id);
    });
    // recordsIds
    checkboxRecordsIds.value = recordsIds;

    // message.info(`checkboxChange:${row.hospital.name}`);
  },
  checkboxAll: ({ checked, $event }) => {
    const checkboxRecords = gridApi.grid.getCheckboxRecords();
    const recordsIds: string[] = [];
    checkboxRecords.forEach((item) => {
      recordsIds.push(item.id);
    });
    // recordsIds
    checkboxRecordsIds.value = recordsIds;
  },
};

// const [Grid, gridApi] = useVbenVxeGrid({ gridEvents, gridOptions });

const [Grid, gridApi] = useVbenVxeGrid({
  gridEvents,
  formOptions,
  gridOptions,
});

const [UpdateHospitalFormModal, updateHospitalFormModalApi] = useVbenModal({
  connectedComponent: UpdateHospitalForm,
  destroyOnClose: true,
});

const onOpenHospitalSuccess = () => {
  gridApi.formApi.submitForm();
  emit('success');
};

// const onStatus = async (row) => {
//   let willStatus = '206628493037797903357';
//   if (row.status === '206628493037797903357') {
//     willStatus = '206628519408439919256';
//   }
//   if (row.status === '206628519408439919256') {
//     willStatus = '206628519472642133136';
//   }
//   if (row.status === '206628519472642133136') {
//     willStatus = '206628519408439919256';
//   }
//   const updateParams = {
//     status_id: willStatus,
//   };
//   await updateProjectOpenHospital(row.id, updateParams);
//   gridApi.formApi.submitForm();
//   emit('success');
//   message.success(`招募状态调整成功`);
//   // updateHospitalFormModalApi.setData(row).open();
// };

const onBatchChangeStatus = async (statusId: string) => {
  console.log('onBatchChangeStatus', statusId);
  const updateParams = {
    status_id: statusId,
    ids: checkboxRecordsIds.value,
  };
  await updateProjectHospitalStatus(updateParams);
  gridApi.formApi.submitForm();
};

const onBatchRemove = async () => {
  // console.log('onBatchRemove');
  // console.log('onBatchChangeStatus', statusId);
  const updateParams = {
    ids: checkboxRecordsIds.value,
  };
  await updateProjectHospitalRemove(updateParams);
  gridApi.formApi.submitForm();
  emit('success');
  //
};

//

// 模拟 ajax 异步获取内容
onMounted(() => {
  // setTimeout(() => {
  //   valueHtml.value = '<p>模拟 Ajax 异步设置内容</p>';
  // }, 1500);
});

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {});

const [Modal, modalApi] = useVbenModal({
  class: 'w-[1200px]',
  showConfirmButton: false,
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<ProjectsApi.Project>();
      if (data) {
        if (data.pid === 0) {
          data.pid = undefined;
        }
        formData.value = data;

        // valueHtml.value = data.project_info;
        // formApi.setValues(formData.value);
      }
    }
  },
});

// 状态映射函数
function mapStatusToId(status) {
  const statusMap = {
    '0': '206628493037797903357', // 等待招募
    '1': '206628519472642133136', // 正在招募
    '2': '206628562022253305061'  // 停止招募
  };
  return statusMap[status] || status;
}
</script>

<template>
  <Modal :title="getTitle">
    <UpdateHospitalFormModal @success="onOpenHospitalSuccess" />
    <Grid>
      <template #toolbar-actions>
        <Space>
          <Button
            @click="onBatchChangeStatus('206628519408439919256')"
            type="primary"
            ghost
            :disabled="checkboxRecordsIds.length === 0"
          >
            筛选
          </Button>
          <Button
            @click="onBatchChangeStatus('206628519472642133136')"
            danger
            ghost
            :disabled="checkboxRecordsIds.length === 0"
          >
            停止
          </Button>
          <Button
            danger
            ghost
            @click="onBatchRemove"
            :disabled="checkboxRecordsIds.length === 0"
          >
            移出
          </Button>
        </Space>
      </template>
      <template #toolbar-tools>
        <Button type="primary" @click="onCreate"> 新增 </Button>
      </template>
    </Grid>

    <!-- <Form class="mx-4" /> -->

    <!-- <template #prepend-footer>
      <div class="flex-auto">
        <Button type="primary" danger @click="resetForm">
          {{ $t('common.reset') }}
        </Button>
      </div>
    </template> -->
  </Modal>
</template>
