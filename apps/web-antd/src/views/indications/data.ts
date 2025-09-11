import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn } from '#/adapter/vxe-table';
import type { IndicationsApi } from '#/api/indications';

import { z } from '#/adapter/form';
import { getDictionariesList } from '#/api';
import { $t } from '#/locales';

//

/**
 * 获取编辑表单的字段配置。如果没有使用多语言，可以直接export一个数组常量
 */
export function useSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: '适应症名称',
      rules: z
        .string()
        .min(2, $t('ui.formRules.minLength', ['适应症名称', 2]))
        .max(20, $t('ui.formRules.maxLength', ['适应症名称', 20])),
    },

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
    },

    {
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        options: [
          { label: $t('common.enabled'), value: 1 },
          { label: $t('common.disabled'), value: 0 },
        ],
        optionType: 'button',
      },
      defaultValue: 1,
      fieldName: 'status',
      label: $t('system.dept.status'),
    },
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
  onActionClick?: OnActionClickFn<IndicationsApi.Indication>,
): VxeTableGridOptions<IndicationsApi.Indication>['columns'] {
  return [
    { title: '序号', type: 'seq', width: 50, fixed: 'left' },
    {
      align: 'left',
      field: 'name',
      fixed: 'left',
      title: $t('projects.indications.lists.columns.name'),
      treeNode: true,
      width: 200,
    },

    {
      field: 'type.label',
      title: '项目类型',
      width: 100,
    },

    {
      field: 'create_time',
      title: $t('system.dept.createTime'),
      width: 230,
    },
    {
      field: 'update_time',
      title: '更新时间',
      width: 230,
    },
    // {
    //   field: 'remark',
    //   minWidth: 100,
    //   title: '备注',
    // },

    {
      cellRender: { name: 'CellStatusTag' },
      field: 'status',
      minWidth: 60,
      fixed: 'right',
      title: $t('system.dept.status'),
    },

    {
      align: 'right',
      cellRender: {
        attrs: {
          nameField: 'productName',
          nameTitle: '适应症',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          'edit', // 默认的编辑按钮
          {
            code: 'delete', // 默认的删除按钮
            disabled: (row: IndicationsApi.Indication) => {
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
