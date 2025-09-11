import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn } from '#/adapter/vxe-table';
import type { CategorizesCategoriesApi } from '#/api';

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
      label: '姓名',
      rules: z
        .string()
        .min(2, $t('ui.formRules.minLength', ['姓名', 2]))
        .max(10, $t('ui.formRules.maxLength', ['姓名', 10])),
    },

    {
      component: 'Input',
      fieldName: 'account',
      label: '账号',
      rules: z
        .string()
        .min(3, $t('ui.formRules.minLength', ['账号', 3]))
        .max(10, $t('ui.formRules.maxLength', ['账号', 10])),
    },

    {
      component: 'Input',
      fieldName: 'password',
      label: '密码',
      rules: z
        .string()
        .min(6, $t('ui.formRules.minLength', ['密码', 6]))
        .max(18, $t('ui.formRules.maxLength', ['密码', 18])),
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
          { label: '启用', value: true },
          { label: '禁用', value: false },
        ],
        optionType: 'button',
      },
      defaultValue: true,
      fieldName: 'status',
      label: $t('system.dept.status'),
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
  onActionClick?: OnActionClickFn<CategorizesCategoriesApi.CategorizeCategory>,
): VxeTableGridOptions<CategorizesCategoriesApi.CategorizeCategory>['columns'] {
  return [
    { title: '序号', type: 'seq', width: 80, fixed: 'left' },
    {
      align: 'left',
      field: 'name',
      fixed: 'left',
      title: '名称',
      treeNode: true,
      width: 280,
    },

    {
      field: 'code',
      title: '编码',

      width: 140,
    },
    {
      field: 'icon',
      title: '图标',
      width: 60,
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
      cellRender: { name: 'CellCategorizeCategoryStatusTag' },
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
            disabled: (row: CategorizesCategoriesApi.CategorizeCategory) => {
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
