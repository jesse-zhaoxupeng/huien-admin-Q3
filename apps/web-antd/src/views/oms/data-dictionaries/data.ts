import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn } from '#/adapter/vxe-table';
import type { HospitalsApi } from '#/api';

import { z } from '#/adapter/form';
import {
  getCategorizesTypesList,
  getDataDictionariesItemList,
  getDataDictionariesList,
} from '#/api';
import { $t } from '#/locales';

export function useSchema(): VbenFormSchema[] {
  return [
    {
      component: 'ApiCascader',
      componentProps: (values) => {
        // console.log('values', values);
        return {
          allowClear: true,
          changeOnSelect: true,
          immediate: true,
          api: async () => {
            return await getDataDictionariesItemList({ isShowTree: '1' });
          },
          class: 'w-full',
          fieldNames: {
            label: 'name',
            value: 'id',
            children: 'children',
          },
          placeholder: '请选择 上级项目',
          showSearch: true,
          onChange: (value, selectedOptions) => {
            if (value) {
              values.parent_id = value[value.length - 1];
              values.parent_names = selectedOptions.map((item) => item.name);
            } else {
              values.parent_id = '0';
              values.parent_ids = [];
              values.parent_names = [];
            }
          },
        };
      },
      defaultValue: [],
      fieldName: 'parent_ids',
      label: '上级项目',
      labelWidth: 80,

      dependencies: {
        // componentProps(values,formApi){},
        triggerFields: ['data_dictionary_id'],
        trigger(values, formApi) {
          // console.log('data_dictionary_id =>trigger', values);
          // console.log('parent_ids =>trigger', values);
          // formApi.setFieldValue(
          //   'parent_id',
          //   values.parent_ids?.length
          //     ? values.parent_ids[values.parent_ids.length - 1]
          //     : '0',
          // );
          // console.log('values', values);
        },
      },
    },

    {
      component: 'ApiCascader',
      componentProps: (values) => {
        // console.log('values', values);
        return {
          allowClear: true,
          changeOnSelect: true,
          immediate: true,
          api: async () => {
            return await getDataDictionariesList({ isShowTree: '1' });
          },
          class: 'w-full',
          fieldNames: {
            label: 'name',
            value: 'id',
            children: 'children',
          },
          placeholder: '请选择 上级项目',
          showSearch: true,
          onChange: (value, selectedOptions) => {
            // if (value) {
            //   values.parent_id = value[value.length - 1];
            //   values.parent_names = selectedOptions.map((item) => item.name);
            // } else {
            //   values.parent_id = '0';
            //   values.parent_ids = [];
            //   values.parent_names = [];
            // }
          },
        };
      },
      defaultValue: [],
      fieldName: 'data_dictionary_ids',
      label: '所属字典',
      labelWidth: 80,
      rules: 'selectRequired',
      dependencies: {
        // componentProps(values,formApi){},
        triggerFields: ['data_dictionary_id'],
        trigger(values, formApi) {
          // console.log('data_dictionary_id =>trigger', values);
          // console.log('parent_ids =>trigger', values);
          // formApi.setFieldValue(
          //   'parent_id',
          //   values.parent_ids?.length
          //     ? values.parent_ids[values.parent_ids.length - 1]
          //     : '0',
          // );
          // console.log('values', values);
        },
      },
    },

    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入 项目名称',
      },
      fieldName: 'name',
      label: '项目名称',
      labelWidth: 80,
      rules: z
        .string()
        .min(2, $t('ui.formRules.minLength', ['项目名称', 2]))
        .max(10, $t('ui.formRules.maxLength', ['项目名称', 10])),
    },

    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入 项目编码',
      },
      fieldName: 'code',
      label: '项目编码',
      labelWidth: 80,
      rules: z
        .string()
        .min(2, $t('ui.formRules.minLength', ['项目编码', 2]))
        .max(50, $t('ui.formRules.maxLength', ['项目编码', 50])),
    },

    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入 项目标签',
      },
      fieldName: 'label',
      label: '项目标签',
      labelWidth: 80,
      // rules: z
      //   .string()
      //   .min(1, $t('ui.formRules.minLength', ['项目标签', 1]))
      //   .max(10, $t('ui.formRules.maxLength', ['项目标签', 10]))
      //   .optional(),
    },

    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入 项目值',
      },
      fieldName: 'value',
      label: '项目值',
      labelWidth: 80,
      // rules: z
      //   .string()
      //   .min(1, $t('ui.formRules.minLength', ['项目值', 1]))
      //   .max(50, $t('ui.formRules.maxLength', ['项目值', 50]))
      //   .optional(),
    },

    {
      component: 'Input',
      fieldName: 'data_dictionary_id',
      label: '上级名称',
      labelWidth: 80,
      dependencies: {
        show: false,
        triggerFields: ['data_dictionary_id'],
      },
      rules: 'selectRequired',
    },

    {
      component: 'Input',
      fieldName: 'data_dictionary_names',
      label: '上级名称',
      labelWidth: 80,
      dependencies: {
        show: false,
        triggerFields: ['data_dictionary_names'],
      },
    },

    {
      component: 'Input',
      fieldName: 'parent_names',
      label: '上级名称',
      labelWidth: 80,
      dependencies: {
        show: false,
        triggerFields: ['parent_names'],
      },
      rules: 'selectRequired',
    },

    {
      component: 'Input',
      fieldName: 'parent_id',
      label: '上级ID',
      labelWidth: 80,
      dependencies: {
        show: false,
        triggerFields: ['parent_id'],
        // disabled(values, formApi) {
        //   if (values.project_type !== '0') {
        //     formApi?.setFieldValue('third_party_system', '');
        //   }
        //   //
        //   return values.project_type !== '0';
        // },
      },

      rules: 'required',
      defaultValue: '0',
    },

    {
      component: 'InputNumber',
      fieldName: 'sort',
      label: '排序',
      labelWidth: 80,
      defaultValue: 1,
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
      labelWidth: 80,
      label: $t('system.dept.status'),
    },
    {
      component: 'Textarea',
      componentProps: {
        maxLength: 50,
        rows: 3,
        showCount: true,
        placeholder: '请输入 项目描述',
        class: 'w-full',
      },
      fieldName: 'description',
      label: '描述',
      labelWidth: 80,
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
        placeholder: '请输入 项目备注',
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
 * 获取编辑表单的字段配置。如果没有使用多语言，可以直接export一个数组常量
 */
export function useDataDictionarySchema(): VbenFormSchema[] {
  return [
    {
      component: 'ApiCascader',
      componentProps: (values) => {
        console.log('values', values);
        return {
          allowClear: true,
          changeOnSelect: true,
          immediate: true,
          api: async () => {
            return await getDataDictionariesList({ isShowTree: '1' });
          },
          class: 'w-full',
          fieldNames: {
            label: 'name',
            value: 'id',
            children: 'children',
          },
          placeholder: '请选择 上级字典',
          showSearch: true,
          onChange: (value, selectedOptions) => {
            if (value) {
              values.parent_id = value[value.length - 1];
              values.parent_names = selectedOptions.map((item) => item.name);
            } else {
              values.parent_id = '0';
              values.parent_ids = [];
              values.parent_names = [];
            }
          },
        };
      },
      defaultValue: [],
      fieldName: 'parent_ids',
      label: '上级字典',
      labelWidth: 80,
      // rules: 'selectRequired',
      dependencies: {
        triggerFields: ['parent_ids'],
        trigger(values, formApi) {
          // console.log('parent_ids =>trigger', values);
          formApi.setFieldValue(
            'parent_id',
            values.parent_ids?.length
              ? values.parent_ids[values.parent_ids.length - 1]
              : '0',
          );

          // console.log('values', values);
        },
      },
    },
    {
      component: 'ApiCascader',
      componentProps: {
        allowClear: true,
        changeOnSelect: true,
        immediate: true,
        api: async () => {
          return await getCategorizesTypesList({ isShowTree: '1' });
        },
        class: 'w-full',
        fieldNames: {
          label: 'name',
          value: 'id',
          children: 'children',
        },
        placeholder: '请选择 字典类型',
        showSearch: true,
      },
      fieldName: 'type_id',
      label: '字典类型',
      labelWidth: 80,
      defaultValue: '208594011285855666390',
      disabled: true,
      rules: 'selectRequired',
    },

    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入 字典名称',
      },
      fieldName: 'name',
      label: '字典名称',
      labelWidth: 80,
      rules: z
        .string()
        .min(2, $t('ui.formRules.minLength', ['字典名称', 2]))
        .max(10, $t('ui.formRules.maxLength', ['字典名称', 10])),
    },

    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入 字典编码',
      },
      fieldName: 'code',
      label: '字典编码',
      labelWidth: 80,
      rules: z
        .string()
        .min(2, $t('ui.formRules.minLength', ['字典编码', 2]))
        .max(50, $t('ui.formRules.maxLength', ['字典编码', 50])),
    },

    {
      component: 'Input',
      fieldName: 'parent_names',
      label: '上级名称',
      labelWidth: 80,
      dependencies: {
        show: false,
        triggerFields: ['parent_names'],
      },
      rules: 'selectRequired',
    },

    {
      component: 'Input',
      fieldName: 'parent_id',
      label: '上级ID',
      labelWidth: 80,
      dependencies: {
        show: false,
        triggerFields: ['parent_id'],
        // disabled(values, formApi) {
        //   if (values.project_type !== '0') {
        //     formApi?.setFieldValue('third_party_system', '');
        //   }
        //   //
        //   return values.project_type !== '0';
        // },
      },

      rules: 'required',
      defaultValue: '0',
    },

    {
      component: 'InputNumber',
      fieldName: 'sort',
      label: '排序',
      labelWidth: 80,
      defaultValue: 1,
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
      labelWidth: 80,
      label: $t('system.dept.status'),
    },
    {
      component: 'Textarea',
      componentProps: {
        maxLength: 50,
        rows: 3,
        showCount: true,
        placeholder: '请输入 字典描述',
      },
      fieldName: 'description',
      label: '描述',
      labelWidth: 80,
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
        placeholder: '请输入 字典备注',
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
  onActionClick?: OnActionClickFn<HospitalsApi.Hospital>,
): VxeTableGridOptions<HospitalsApi.Hospital>['columns'] {
  return [
    { title: '序号', type: 'seq', width: 50, fixed: 'left' },

    {
      align: 'center',
      field: 'data_dictionary.name',
      fixed: 'left',
      title: '所属字典',
      width: 120,
    },
    {
      align: 'left',
      field: 'name',
      fixed: 'left',
      title: '名称',
      treeNode: true,
      width: 160,
    },

    {
      field: 'code',
      title: '编码标识',
      width: 100,
    },
    {
      field: 'id',
      title: '唯一标识',
      width: 200,
    },
    {
      field: 'created_at',
      title: $t('system.dept.createTime'),
      width: 160,
    },
    {
      field: 'updated_at',
      title: '更新时间',
      width: 160,
    },
    {
      field: 'remark',
      title: '备注',
      width: 180,
    },
    {
      field: 'status.name',
      minWidth: 60,
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
