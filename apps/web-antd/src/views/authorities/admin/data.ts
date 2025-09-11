import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn } from '#/adapter/vxe-table';
import type { AdminsApi } from '#/api';

import { z } from '#/adapter/form';
import { getDataDictionariesItemList } from '#/api';
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
      labelWidth: 80,
      formItemClass: 'col-span-1',
      rules: z
        .string()
        .min(2, $t('ui.formRules.minLength', ['姓名', 2]))
        .max(10, $t('ui.formRules.maxLength', ['姓名', 10])),
    },
    {
      component: 'Input',
      fieldName: 'account',
      label: '账号',
      labelWidth: 80,
      formItemClass: 'col-span-1',
      rules: z
        .string()
        .min(3, $t('ui.formRules.minLength', ['账号', 3]))
        .max(10, $t('ui.formRules.maxLength', ['账号', 10])),
    },
    {
      component: 'Input',
      fieldName: 'email',
      label: '邮箱',
      labelWidth: 80,
      rules: z
        .string()
        .email({
          message: '请输入正确的邮箱地址',
        })
        .min(4, $t('ui.formRules.minLength', ['邮箱', 4]))
        .max(30, $t('ui.formRules.maxLength', ['邮箱', 30])),
    },
    {
      component: 'InputPassword',
      fieldName: 'password',
      label: '密码',
      labelWidth: 80,
      defaultValue: undefined,
      rules: z
        .string()
        .min(6, $t('ui.formRules.minLength', ['密码', 6]))
        .max(18, $t('ui.formRules.maxLength', ['密码', 18]))
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
      component: 'ApiSelect',
      componentProps: {
        allowClear: true,
        immediate: true,
        api: async () => {
          const res = await getDataDictionariesItemList({
            data_dictionary_id: '205621707767970792281',
          });

          return res;
        },
        class: 'w-full',
        labelField: 'name',
        valueField: 'id',
        placeholder: '请选择 账号类型',
        showSearch: true,
        onChange: (value) => {
          console.log('value', value);

          // formApi?.setFieldValue('project_stage', '');
        },
      },
      fieldName: 'type_id',
      label: '账号类型',
      labelWidth: 80,
      rules: 'required',
      // rules: z.required('项目类型不能为空'),
    },
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
      defaultValue: '206553438332378418574',
      fieldName: 'status_id',
      label: $t('system.dept.status'),
      labelWidth: 80,
    },
    {
      component: 'Textarea',
      componentProps: {
        maxLength: 50,
        rows: 3,
        showCount: true,
        class: 'w-full',
      },
      fieldName: 'remark',
      label: $t('system.dept.remark'),
      labelWidth: 80,
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
  onActionClick?: OnActionClickFn<AdminsApi.Admin>,
): VxeTableGridOptions<AdminsApi.Admin>['columns'] {
  return [
    { title: '序号', type: 'seq', width: 50, fixed: 'left' },
    {
      align: 'left',
      field: 'name',
      fixed: 'left',
      title: '姓名',
      treeNode: true,
      width: 120,
    },
    {
      field: 'account',
      title: '账号',
      fixed: 'left',
      width: 140,
    },
    {
      field: 'email',
      title: '邮箱',

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
      field: 'remark',
      title: '备注',
      width: 180,
    },
    {
      field: 'type.name',
      minWidth: 100,
      fixed: 'right',
      title: '类型',
    },
    {
      field: 'status.name',
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
            disabled: (row: AdminsApi.Admin) => {
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
