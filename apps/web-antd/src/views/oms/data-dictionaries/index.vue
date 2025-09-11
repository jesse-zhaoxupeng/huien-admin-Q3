<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';

import { ref } from 'vue';

import { ColPage, useVbenModal } from '@vben/common-ui';
import {
  AntDesignCopyOutlined,
  AntDesignEditOutlined,
  AntDesignPlusOutlined,
  IconifyIcon,
} from '@vben/icons';

import { useClipboard } from '@vueuse/core';
import { Button, message, Space, Tooltip, Tree } from 'ant-design-vue';

// import type { DataDictionariesApi } from '#/api';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteIndication,
  getDataDictionariesItemList,
  getDataDictionariesList,
  getDictionariesList,
} from '#/api';

import { useColumns } from './data';
import DtaDictionaryForm from './modules/data-dictionary-form.vue';
import Form from './modules/form.vue';

const dataDictionariesTree = ref([]);

const expandedKeys = ref<string[]>([]);
const selectedKeys = ref<string[]>([]);
const checkedKeys = ref<string[]>([]);

const currentSelectDataDictionary = ref();

const currentDataDictionaryItem = ref();

const { copy } = useClipboard({ legacy: true });

const getTreeData = async () => {
  const res = await getDataDictionariesList({});
  console.log(res);
  dataDictionariesTree.value = res;
};

getTreeData();

const onDataDictionarySelect = (selectedKeys: string[], { node }) => {
  currentSelectDataDictionary.value = node.dataRef;
  console.info(gridApi.formApi, currentSelectDataDictionary.value);

  gridApi.formApi.setFieldValue(
    'data_dictionary_id',
    currentSelectDataDictionary.value.id,
  );
  // gridApi.formApi.submitForm();

  // console.info('onDataDictionarySelect => selectedKeys', selectedKeys);
  // console.info('onDataDictionarySelect => node', node);

  // dataDictionaryItemCurdRef.value.filterForm.modelRef.dataDictionaryId =
  //   node.dataRef.id;
  // dataDictionaryItemCurdRef.value.filterForm.modelRef.page = 1;

  // dataDictionaryItemStore.getLists(
  //   dataDictionaryItemCurdRef.value.filterForm.modelRef,
  // );
};

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

const [DtaDictionaryFormModal, dtaDictionaryFormModalApi] = useVbenModal({
  connectedComponent: DtaDictionaryForm,
  destroyOnClose: true,
});

//

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

const onEditDataDictionary = (dataDictionary) => {
  dtaDictionaryFormModalApi.setData(dataDictionary).open();
};

const onCreateDataDictionary = (dataDictionary) => {
  const data = {
    type_id: dataDictionary.data.type_id,
    parent_id: dataDictionary.data.id,
  };
  if (
    dataDictionary.data.parent_names &&
    dataDictionary.data.parent_names.length > 0
  ) {
    data.parent_names = dataDictionary.data.parent_names;
    data.parent_names.push(dataDictionary.data.name);
  } else {
    data.parent_names = [];
  }

  if (
    dataDictionary.data.parent_ids &&
    dataDictionary.data.parent_ids.length > 0
  ) {
    data.parent_ids = dataDictionary.data.parent_ids;
    data.parent_ids.push(dataDictionary.data.id);
  } else {
    data.parent_ids = [];
  }

  dtaDictionaryFormModalApi.setData(data).open();
};

const onDtaDictionaryFormSuccess = () => {
  getTreeData();
};

/**
 * 编辑部门
 * @param row
 */
function onEdit(row: IndicationsApi.Indication) {
  console.info('edit 删除处理逻辑', row);
  console.info('formModalApi', formModalApi);

  // row.data_dictionary_names = [...new Set(row.data_dictionary_names)];
  // row.data_dictionary_ids = [...new Set(row.data_dictionary_ids)];
  formModalApi.setData(row).open();
  // formModalApi.setData(row).open();
}

/**
 * 创建新部门
 */
function onCreate() {
  currentDataDictionaryItem.value = currentSelectDataDictionary.value;

  const data = {
    parent_id: '0',
    parent_ids: [],
    parent_names: [],
    data_dictionary_id: currentSelectDataDictionary.value.id,
    data_dictionary_names: [],
    data_dictionary_ids: [],
  };
  data.data_dictionary_names =
    currentSelectDataDictionary.value.parent_names &&
    currentSelectDataDictionary.value.parent_names.length > 0
      ? currentSelectDataDictionary.value.parent_names
      : [];

  data.data_dictionary_ids =
    currentSelectDataDictionary.value.parent_ids &&
    currentSelectDataDictionary.value.parent_ids.length > 0
      ? currentSelectDataDictionary.value.parent_ids
      : [];

  if (data.data_dictionary_ids.length === 0 && data.data_dictionary_id) {
    data.data_dictionary_ids.push(data.data_dictionary_id);
  } else {
    data.data_dictionary_ids.push(data.data_dictionary_id);
  }

  console.info('data.data_dictionary_names =>', data.data_dictionary_names);

  if (
    data.data_dictionary_names.length === 0 &&
    currentSelectDataDictionary.value.name
  ) {
    data.data_dictionary_names.push(currentSelectDataDictionary.value.name);
  } else {
    data.data_dictionary_names.push(currentSelectDataDictionary.value.name);
  }
  data.data_dictionary_names = [...new Set(data.data_dictionary_names)];
  data.data_dictionary_ids = [...new Set(data.data_dictionary_ids)];
  // console.info('data =>', data);

  formModalApi.setData(data).open();
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
        const res = await getDataDictionariesItemList({
          page: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        });
        console.log('getDataDictionariesItemList', res);

        return {
          items: res,
          total: 100,
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
  treeConfig: {
    indent: 5,
    transform: true, // 指定表格为树形表格
    parentField: 'parent_id', // 父节点字段名
    rowField: 'id', // 行数据字段名
    childrenField: 'children',
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
  <ColPage :auto-content-height="true" resizable split-line split-handle>
    <template #left="{ isCollapsed, expand }">
      <div v-if="isCollapsed" @click="expand">
        <Tooltip title="点击展开左侧">
          <Button shape="circle" type="primary">
            <template #icon>
              <IconifyIcon class="text-2xl" icon="bi:arrow-right" />
            </template>
          </Button>
        </Tooltip>
      </div>
      <div
        v-else
        :style="{ minWidth: '200px' }"
        class="border-border bg-card mr-2 rounded-[var(--radius)] border p-2"
      >
        <Tree
          class="data-dictionaries-tree"
          v-model:expanded-keys="expandedKeys"
          v-model:selected-keys="selectedKeys"
          v-model:checked-keys="checkedKeys"
          @select="onDataDictionarySelect"
          show-line
          :checkable="false"
          :multiple="false"
          check-strictly
          block-node
          :field-names="{
            children: 'children',
            title: 'name',
            key: 'id',
          }"
          checkable
          :tree-data="dataDictionariesTree"
        >
          <template #title="item">
            <div class="flex w-full items-center justify-between">
              <div class="title-wrapper flex flex-1">
                <div class="title-name">
                  {{ item.name }}
                </div>
                <span class="description ml-2">{{ item.description }}</span>
              </div>

              <Space>
                <AntDesignPlusOutlined
                  @click.stop="onCreateDataDictionary(item)"
                  class="action hover-color-#1677ff"
                  :inline="true"
                />
                <AntDesignEditOutlined
                  @click.stop="onEditDataDictionary(item)"
                  class="action hover-color-#1677ff"
                  :inline="true"
                />
              </Space>
            </div>
          </template>
        </Tree>
      </div>
      <DtaDictionaryFormModal @success="onDtaDictionaryFormSuccess" />
    </template>

    <div class="bd-red h-[800px]">
      <FormModal @success="onSuccess" />
      <Grid table-title="字典项目">
        <template #table-title>
          <Space>
            <div>
              {{ currentSelectDataDictionary?.name }}
            </div>
            <div>
              {{ currentSelectDataDictionary?.id }}
            </div>
            <div
              @click="copy(currentSelectDataDictionary?.id)"
              class="hover:cursor-pointer"
            >
              <AntDesignCopyOutlined />
            </div>
          </Space>
        </template>
        <template #toolbar-tools>
          <Button
            type="primary"
            :disabled="!currentSelectDataDictionary"
            @click="onCreate"
          >
            新增
          </Button>
        </template>
      </Grid>
    </div>
  </ColPage>
</template>

<style lang="less" scoped>
/* shorthand */
:deep(.data-dictionaries-tree) {
  .ant-tree-treenode {
    .ant-tree-node-content-wrapper {
      .description {
        color: #00000073;
        display: none;
      }

      .title-wrapper {
        &:hover {
          .description {
            display: inline-block;
          }
        }
      }

      &:hover {
        background-color: transparent;
        .title-name {
          color: #1677ff;
        }

        // .action {
        //   color: #1677ff;
        // }
      }
    }
    // border: 1px solid red;
  }
  .ant-tree-node-selected {
    background-color: transparent;
    .title-name {
      color: #1677ff;
      font-weight: bold;
    }
  }
}
</style>
