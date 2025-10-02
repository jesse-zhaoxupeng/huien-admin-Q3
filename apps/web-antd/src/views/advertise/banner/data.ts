import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn } from '#/adapter/vxe-table';
import type { AdImageApi } from '#/api';

import { h } from 'vue';

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
      fieldName: 'name',
      labelWidth: 120,
      label: '图片名称',
      rules: z
        .string()
        .min(2, $t('ui.formRules.minLength', ['图片名称', 2]))
        .max(30, $t('ui.formRules.maxLength', ['图片名称', 30])),
    },
    {
      component: 'RadioGroup',
      componentProps: {
        options: [
          {
            label: '系统内文章',
            value: 1,
          },
          {
            label: '外链',
            value: 2,
          },
        ],
      },
      defaultValue: 1,
      fieldName: 'linkType',
      labelWidth: 120,
      label: '跳转类型',
      rules: z
        .number()
        .refine((val) => val !== undefined && val !== null && val > 0, {
          message: $t('ui.formRules.selectRequired', ['跳转目标']), // 或自定义提示
        }),
    },
    {
      component: 'Input',
      help: () =>
        ['小程序跳转内部是需要填写文章ID，外链时候需要填写完整外链地址'].map(
          (v) => h('p', v),
        ),
      fieldName: 'linkData',
      labelWidth: 120,
      label: '跳转目标',
      rules: z
        .string()
        .refine(
          (val) => val !== undefined && val !== null && val.trim() !== '',
          {
            message: $t('ui.formRules.required', ['跳转目标']), // 或自定义提示
          },
        ),
    },
    {
      component: 'InputNumber',
      fieldName: 'sequenceNo',
      labelWidth: 120,
      label: '图片序号',
      rules: 'required',
      componentProps: {
        class: 'w-full',
      },
    },
    {
      component: 'Input',
      fieldName: 'description',
      labelWidth: 120,
      label: '图片描述',
    },
    {
      component: 'Input',
      labelWidth: 120,
      componentProps: {
        disabled: true,
      },
      dependencies: {
        trigger(values, form) {
          if (values.files) {
            const type =
              values.files[0].type.split('/')[
                values.files[0].type.split('/').length - 1
              ];
            form.setFieldValue('category', type);
          }
        },
        // 只有指定的字段改变时，才会触发
        triggerFields: ['files'],
      },
      fieldName: 'category',
      label: '图片类型',
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
      formItemClass: 'items-start',
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
    {
      component: 'Textarea',
      componentProps: {
        class: 'w-full',
        maxLength: 300,
        rows: 3,
        showCount: true,
      },
      fieldName: 'comment',
      labelWidth: 120,
      formItemClass: 'col-span-2 items-start',
      label: '备注',
      rules: z
        .string()
        .max(300, $t('ui.formRules.maxLength', ['备注', 300]))
        .optional(),
    },
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
      align: 'left',
      field: 'name',
      fixed: 'left',
      title: '图片名称',
      treeNode: true,
      width: 360,
    },
    {
      field: 'id',
      fixed: 'left',
      title: '图片ID',
    },
    {
      field: 'url',
      title: '图片url',
      fixed: 'left',
    },

    {
      field: 'category',
      title: '图片类型',
      width: 180,
    },
    {
      field: 'linkType',
      title: '跳转类型',
      width: 180,
      formatter: ({ row }) => {
        switch (row.linkType) {
          case 1: {
            return '系统内文章';
          }
          case 2: {
            return '外链';
          }
        }
        return '';
      },
    },
    {
      field: 'linkData',
      title: '跳转目标',
      width: 180,
    },
    {
      field: 'description',
      title: '图片描述',
    },
    {
      field: 'comment',
      title: '备注',
    },
    {
      align: 'right',
      cellRender: {
        attrs: {
          nameField: 'productName',
          nameTitle: '广告图',
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
    },
  ];
}
