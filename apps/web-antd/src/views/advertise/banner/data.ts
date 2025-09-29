import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn } from '#/adapter/vxe-table';
import type { AdImageApi } from '#/api';

import { z } from '#/adapter/form';
import { $t } from '#/locales';
/**
 * 获取编辑表单的字段配置。如果没有使用多语言，可以直接export一个数组常量
 */
export function useSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: '图片名称',
      rules: z
        .string()
        .min(2, $t('ui.formRules.minLength', ['图片名称', 2]))
        .max(30, $t('ui.formRules.maxLength', ['图片名称', 30])),
    },
    {
      component: 'Upload',
      fieldName: 'imageUrl', // ⚠️ 最终提交时的字段名
      label: '上传图片',
      // componentProps: {
      //   api: async (file: File) => {
      //     try {
      //       const res = await upDataAdImage(file);
      //       return {
      //         url: res.data.url,
      //         name: file.name,
      //       };
      //     } catch {
      //       throw new Error('上传失败，请重试');
      //     }
      //   },
      //   maxNumber: 1, // 只允许上传1张
      //   accept: 'image/*', // 只允许图片
      // },
      // rules: z.any().refine(
      //   (value) => {
      //     return value && typeof value === 'object' && value.url;
      //   },
      //   {
      //     message: '请上传封面图片',
      //   },
      // ),
    },
    // {
    //   component: 'Input',
    //   fieldName: 'name',
    //   label: '图片名称',
    //   rules: z
    //     .string()
    //     .min(2, $t('ui.formRules.minLength', ['图片名称', 2]))
    //     .max(30, $t('ui.formRules.maxLength', ['图片名称', 30])),
    // },
    // {
    //   component: 'Textarea',
    //   componentProps: {
    //     maxLength: 50,
    //     rows: 3,
    //     showCount: true,
    //   },
    //   fieldName: 'remark',
    //   label: $t('system.dept.remark'),
    //   rules: z
    //     .string()
    //     .max(50, $t('ui.formRules.maxLength', [$t('system.dept.remark'), 50]))
    //     .optional(),
    // },
  ];
}

/**
 * 获取表格列配置
 * @description 使用函数的形式返回列数据而不是直接export一个Array常量，是为了响应语言切换时重新翻译表头
 * @param onActionClick 表格操作按钮点击事件
 */
export function useColumns(
  onActionClick?: OnActionClickFn<AdImageApi.AdImage>,
): VxeTableGridOptions<AdImageApi.AdImage>['columns'] {
  return [
    { title: '序号', type: 'seq', width: 50, fixed: 'left' },
    {
      field: 'id',
      title: 'ID',
      fixed: 'left',
      width: 80,
    },
    {
      align: 'left',
      field: 'name',
      fixed: 'left',
      title: '图片名称',
      treeNode: true,
      width: 360,
    },
    {
      field: 'url',
      title: '图片url',
      fixed: 'left',
      width: 80,
    },

    {
      field: 'description',
      title: '图片描述',
      width: 180,
    },
    {
      field: 'category',
      title: '图片类型',
      width: 180,
    },
    {
      field: 'category',
      title: '图片类型',
      width: 180,
    },
    {
      field: 'link_data',
      title: '跳转目标',
      width: 180,
    },
    {
      field: '跳转类型',
      title: 'link_type',
      width: 180,
    },
    {
      field: 'comment',
      title: '备注',
      width: 180,
    },
    {
      align: 'right',
      cellRender: {
        attrs: {
          nameField: 'productName',
          nameTitle: '医院',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          'edit', // 默认的编辑按钮
          {
            code: 'delete', // 默认的删除按钮
            disabled: (row: AdImageApi.AdImage) => {
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
