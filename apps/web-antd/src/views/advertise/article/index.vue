<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { ArticleApi } from '#/api';

import { Page, useVbenModal } from '@vben/common-ui';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteArticle, getArticleList, upDownArticle } from '#/api';

import { useColumns } from './data';
import Form from './modules/form.vue';

interface RowType {
  id: number;
  /** 文章标题 */
  title: string;
  /** 封面图 */
  frontImg?: string;
  /** 文章内容，富文本 */
  articleContent?: string;
  /** 上下架状态，1上架2下架 */
  status?: string;
}

// console.info('Form', Form);

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
  onClosed: () => {
    gridApi.formApi.submitForm();
  },
});

/**
 * 编辑部门
 * @param row
 */
function onEdit(row: ArticleApi.Article) {
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
  deleteArticle(row.id)
    .then(() => {
      gridApi.formApi.submitForm();
      message.success(`${row.title} 删除成功`);
      handleFormSuccess();
    })
    .catch(() => {
      message.error(`${row.title} 删除失败`);
    });
};
/**
 * 删除
 */
const onUpDown = async (row: RowType) => {
  upDownArticle({
    id: row.id,
    status: row.status === '1' ? '2' : '1',
  })
    .then(() => {
      gridApi.formApi.submitForm();
      message.success(`${row.title} 删除成功`);
      handleFormSuccess();
    })
    .catch(() => {
      message.error(`${row.title} 删除失败`);
    });
};
// deleteCity

/**
 * 表格操作按钮的回调函数
 */
function onActionClick({ code, row }: OnActionClickParams<ArticleApi.Article>) {
  switch (code) {
    case 'delete': {
      onDelete(row);
      break;
    }
    case 'edit': {
      onEdit(row);
      break;
    }
    case 'status': {
      onUpDown(row);
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
        const res = await getArticleList({
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
    <Grid table-title="文章管理列表">
      <template #toolbar-tools>
        <Button type="primary" @click="onCreate"> 新增 </Button>
      </template>
    </Grid>
  </Page>
</template>
