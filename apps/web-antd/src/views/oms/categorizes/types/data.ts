import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn } from '#/adapter/vxe-table';
import type { CategorizesTypesApi } from '#/api';

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
      label: '名称',
      labelClass: 'w-[60px]',
      rules: z
        .string()
        .min(2, $t('ui.formRules.minLength', ['名称', 2]))
        .max(10, $t('ui.formRules.maxLength', ['名称', 10])),
    },

    {
      component: 'Input',
      fieldName: 'account',
      label: '别名',
      labelClass: 'w-[60px]',
      rules: z
        .string()
        .min(3, $t('ui.formRules.minLength', ['账号', 3]))
        .max(10, $t('ui.formRules.maxLength', ['账号', 10])),
    },

    {
      component: 'Input',
      fieldName: 'code',
      label: '编码',
      labelClass: 'w-[60px]',
      rules: z
        .string()
        .min(6, $t('ui.formRules.minLength', ['编码', 6]))
        .max(18, $t('ui.formRules.maxLength', ['编码', 18])),
    },
    {
      component: 'Input',
      fieldName: 'icon',
      label: '图标',
      labelClass: 'w-[60px]',
      rules: z
        .string()
        .min(6, $t('ui.formRules.minLength', ['图标', 6]))
        .max(18, $t('ui.formRules.maxLength', ['图标', 18]))
        .optional(),
    },

    // {
    //   component: 'ApiCascader',
    //   componentProps: {
    //     allowClear: true,
    //     immediate: true,
    //     api: async () => {
    //       return await getCitysList({ isShowTree: '1' });
    //     },
    //     class: 'w-full',
    //     fieldNames: {
    //       label: 'cityname',
    //       value: 'id',
    //       children: 'children',
    //     },

    //     placeholder: '全部',
    //     showSearch: true,
    //   },
    //   fieldName: 'area_ids',
    //   label: '所属城市',
    // },

    {
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        options: [
          { label: '启用', value: '206553438332378418574' },
          { label: '禁用', value: '206553438438641108518' },
        ],
        optionType: 'button',
      },
      defaultValue: true,
      fieldName: 'status_id',
      label: $t('system.dept.status'),
      labelClass: 'w-[60px]',
    },
    {
      component: 'Textarea',
      componentProps: {
        maxLength: 50,
        rows: 3,
        showCount: true,
      },
      fieldName: 'description',
      label: '描述',
      labelClass: 'w-[60px]',
      formItemClass: 'col-span-2',

      rules: z
        .string()
        .max(50, $t('ui.formRules.maxLength', [$t('system.dept.remark'), 50]))
        .optional(),
    },
    {
      component: 'Textarea',
      componentProps: {
        maxLength: 50,
        rows: 3,
        showCount: true,
      },
      fieldName: 'remark',
      label: $t('system.dept.remark'),
      labelClass: 'w-[60px]',
      formItemClass: 'col-span-2',

      rules: z
        .string()
        .max(50, $t('ui.formRules.maxLength', [$t('system.dept.remark'), 50]))
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
  onActionClick?: OnActionClickFn<CategorizesTypesApi.CategorizeType>,
): VxeTableGridOptions<CategorizesTypesApi.CategorizeType>['columns'] {
  return [
    { title: '序号', type: 'seq', width: 50, fixed: 'left' },
    {
      align: 'left',
      field: 'name',
      fixed: 'left',
      title: '名称',
      treeNode: true,
      width: 180,
    },
    {
      field: 'alias',
      title: '别名',

      width: 140,
    },
    {
      field: 'code',
      title: '编码',

      width: 140,
    },
    {
      field: 'icon',
      title: '图标',

      width: 140,
    },
    {
      field: 'created_at',
      title: $t('system.dept.createTime'),
      width: 180,
    },
    {
      field: 'updated_at',
      title: '更新时间',
      width: 180,
    },
    {
      field: 'description',
      title: '描述',
      width: 180,
    },
    {
      field: 'remark',
      title: '备注',
      width: 180,
    },
    {
      cellRender: { name: 'CellCategorizeTypeStatusTag' },
      field: 'status',
      minWidth: 100,
      fixed: 'right',
      title: $t('system.dept.status'),
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
            disabled: (row: CategorizesTypesApi.CategorizeType) => {
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
