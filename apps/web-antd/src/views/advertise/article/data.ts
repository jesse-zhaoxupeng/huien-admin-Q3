import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn } from '#/adapter/vxe-table';
import type { ArticleApi } from '#/api';

import { z } from '#/adapter/form';
import { uploadFile } from '#/api';
import { $t } from '#/locales';
/**
 * 获取编辑表单的字段配置。如果没有使用多语言，可以直接export一个数组常量
 */
export function useSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'title',
      labelWidth: 120,
      label: '文章标题',
      formItemClass: 'col-span-2',
      rules: z
        .string()
        .min(2, $t('ui.formRules.minLength', ['文章标题', 2]))
        .max(30, $t('ui.formRules.maxLength', ['文章标题', 30])),
    },
    {
      component: 'Upload',
      componentProps: {
        accept: '.png,.jpg,.jpeg',

        // 自动携带认证信息
        customRequest: uploadFile,
        disabled: false,
        maxCount: 1,
        multiple: false,
        showUploadList: true,
        // 上传列表的内建样式，支持四种基本样式 text, picture, picture-card 和 picture-circle
        listType: 'picture-card',
      },
      fieldName: 'files',
      labelWidth: 120,
      label: '上传图片',
      formItemClass: 'col-span-2 items-start',
      renderComponentContent: () => {
        return {
          default: () => '点击上传图片',
        };
      },
      rules: z.any().refine(
        (val) => val?.length > 0 && val[0]?.response?.url, // 确保有 url 字段
        { message: '请上传图片' },
      ),
    },
  ];
}

/**
 * 获取表格列配置
 * @description 使用函数的形式返回列数据而不是直接export一个Array常量，是为了响应语言切换时重新翻译表头
 * @param onActionClick 表格操作按钮点击事件
 */
export function useColumns(
  onActionClick?: OnActionClickFn<ArticleApi.Article>,
): VxeTableGridOptions<ArticleApi.Article>['columns'] {
  return [
    { title: '序号', type: 'seq', width: 50, fixed: 'left' },
    {
      field: 'id',
      fixed: 'left',
      title: 'ID',
    },
    {
      align: 'left',
      field: 'title',
      fixed: 'left',
      title: '文章标题',
      treeNode: true,
    },
    {
      field: 'frontImg',
      title: '封面图',
      fixed: 'left',
    },
    {
      field: 'articleContent',
      title: '图片类型',
    },
    {
      field: 'status',
      title: '状态',
      cellRender: { name: 'CellArticleStatusTag' },
    },
    {
      align: 'right',
      cellRender: {
        attrs: {
          nameField: 'productName',
          nameTitle: '文章管理',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'status',
            text: '上下架管理',
          },
          'edit', // 默认的编辑按钮
          {
            code: 'delete', // 默认的删除按钮
            disabled: (row: ArticleApi.Article) => {
              return !!(row.children && row.children.length > 0);
            },
          },
        ],
      },
      field: 'operation',
      fixed: 'right',
      headerAlign: 'center',
      showOverflow: false,
      title: $t('system.dept.operation'),
      width: 120,
    },
  ];
}
