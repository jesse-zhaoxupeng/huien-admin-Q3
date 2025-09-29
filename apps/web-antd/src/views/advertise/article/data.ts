import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn } from '#/adapter/vxe-table';
import type { HospitalsApi } from '#/api';

import { z } from '#/adapter/form';
import { getCitysList } from '#/api';
import { $t } from '#/locales';

/**
 * 获取编辑表单的字段配置。如果没有使用多语言，可以直接export一个数组常量
 */
export function useSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: '医院名称',
      rules: z
        .string()
        .min(2, $t('ui.formRules.minLength', ['医院名称', 2]))
        .max(30, $t('ui.formRules.maxLength', ['医院名称', 30])),
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
    },

    {
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        options: [
          { label: '启用', value: '0' },
          { label: '禁用', value: '1' },
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
  onActionClick?: OnActionClickFn<HospitalsApi.Hospital>,
): VxeTableGridOptions<HospitalsApi.Hospital>['columns'] {
  return [
    { title: '序号', type: 'seq', width: 50, fixed: 'left' },
    {
      align: 'left',
      field: 'name',
      fixed: 'left',
      title: '医院名称',
      treeNode: true,
      width: 360,
    },

    {
      field: 'city.cityname',
      title: '所属城市',
      fixed: 'left',
      width: 80,
    },

    {
      field: 'create_time',
      title: $t('system.dept.createTime'),
      width: 180,
    },
    {
      field: 'update_time',
      title: '更新时间',
      width: 180,
    },
    {
      field: 'remark',
      title: '备注',
      width: 180,
    },

    {
      cellRender: { name: 'CellHospitalStatusTag' },
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
            disabled: (row: HospitalsApi.Hospital) => {
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
