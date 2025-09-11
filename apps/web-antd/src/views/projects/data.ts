import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn } from '#/adapter/vxe-table';
import type { IndicationsApi } from '#/api/indications';

import { z } from '#/adapter/form';
import {
  getDataDictionariesItemList,
  getDictionariesList,
  getHospitalsList,
  getIndicationsList,
} from '#/api';
import { $t } from '#/locales';

// getIndicationsList gender_requirement getDictionariesList

/**
 * 获取编辑表单的字段配置。如果没有使用多语言，可以直接export一个数组常量
 */
export function useSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'projectName',
      label: '项目名称',
      rules: z
        .string()
        .min(2, $t('ui.formRules.minLength', ['项目名称', 2]))
        .max(100, $t('ui.formRules.maxLength', ['项目名称', 100])),
    },
    {
      component: 'Input',
      fieldName: 'medicineName',
      label: '药物名称',
      rules: z
        .string()
        .min(2, $t('ui.formRules.minLength', ['药物名称', 2]))
        .max(50, $t('ui.formRules.maxLength', ['药物名称', 50])),
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: false,
        options: [
          { label: '标准报名表单', value: 'STD-FORM', key: '1' },
          { label: '简易报名表单', value: 'SIMPLE-FORM', key: '2' },
          { label: '详细健康表单', value: 'HEALTH-FORM', key: '3' },
        ],
        placeholder: '请选择报名表单模板',
      },
      defaultValue: 'STD-FORM',
      fieldName: 'registrationFormCode',
      label: '报名表单模板',
      rules: 'required',
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
        onChange: (value) => {
          console.log('value', value);

          // formApi?.setFieldValue('project_stage', '');
        },
      },
      fieldName: 'projectType',
      label: '项目类型',
      rules: 'required',
    },

    {
      component: 'ApiSelect',
      componentProps: {
        allowClear: true,
        immediate: true,
        api: async () => {
          const res = await getDictionariesList({
            dict_type: 'gender_requirement',
          });

          return res.data;
        },
        class: 'w-full',
        labelField: 'label',
        valueField: 'value',
        placeholder: '全部',
        showSearch: true,
      },
      fieldName: 'genderRequirement',
      label: '性别要求',
      rules: 'required',
    },
    // gender_requirement

    {
      component: 'Input',
      fieldName: 'allowanceAmount',
      label: '补助金额',
      rules: z
        .string()
        .min(2, $t('ui.formRules.minLength', ['补助金额', 2]))
        .max(20, $t('ui.formRules.maxLength', ['补助金额', 20])),
    },

    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [],
        class: 'w-full',
        fieldNames: {
          label: 'label',
          value: 'id',
        },
        placeholder: '全部',
        showSearch: false,
      },
      fieldName: 'projectStage',
      label: '项目分期',
      rules: 'required',
      dependencies: {
        triggerFields: ['projectType'],
        async disabled(values) {
          return values.projectType === undefined;
        },
        async componentProps(values) {
          //

          const dictType = `${values.projectType}_project_stage`;

          const res = await getDictionariesList({
            dict_type: dictType,
          });

          return {
            options: res.data,
          };
        },
      },
    },

    {
      component: 'ApiSelect',
      componentProps: {
        allowClear: true,
        immediate: true,
        api: async () => {
          const res = await getDictionariesList({
            dict_type: 'third_party_system',
          });

          return res.data;
        },
        class: 'w-full',
        labelField: 'label',
        valueField: 'value',
        placeholder: '全部',
        showSearch: true,
      },
      fieldName: 'thirdPartySystem',
      label: '联网',

      dependencies: {
        triggerFields: ['projectType'],
        required(values) {
          const projectType = values.projectType;
          // console.log('formApi', formApi);
          return projectType === '0';
        },
        disabled(values, formApi) {
          if (values.projectType !== '0') {
            formApi?.setFieldValue('thirdPartySystem', '');
          }
          //
          return values.projectType !== '0';
        },
      },
    },

    {
      component: 'ApiSelect',
      componentProps: {
        allowClear: true,
        immediate: true,
        api: async () => {
          const res = await getIndicationsList({ page: 1, pageSize: 100 });

          return res.data;
        },
        class: 'w-full',
        labelField: 'name',
        valueField: 'id',
        placeholder: '全部',
        showSearch: true,
      },
      fieldName: 'indicationId',
      label: '适应症',

      dependencies: {
        triggerFields: ['projectType'],
        required(values) {
          const projectType = values.projectType;
          // console.log('formApi', formApi);
          return projectType !== '0';
        },
      },
    },

    {
      component: 'Input',
      fieldName: 'customTags',
      label: '自定义标签',
      formItemClass: 'col-span-1',
    },

    {
      component: 'InputNumber',
      fieldName: 'sort',
      label: '排序',
      formItemClass: 'col-span-1',
    },

    // {
    //   component: 'RadioGroup',
    //   componentProps: {
    //     buttonStyle: 'solid',
    //     disabled: false,
    //     options: [
    //       { label: '等待招募', value: '0' },
    //       { label: '正在招募', value: '1' },
    //       { label: '停止招募', value: '2' },
    //     ],
    //     optionType: 'button',
    //   },
    //   defaultValue: '0',
    //   fieldName: 'status',
    //   formItemClass: 'col-span-1',
    //   label: '招募状态',
    // },

    {
      component: 'ApiSelect',
      componentProps: {
        allowClear: true,
        immediate: true,
        api: async () => {
          const res = await getDataDictionariesItemList({
            dataDictionaryId: '205625336283647969024',
          });

          return res;
        },
        class: 'w-full',
        labelField: 'name',
        valueField: 'id',
        placeholder: '请选择 招募状态',
        showSearch: true,
        onChange: (value) => {
          console.log('value', value);

          // formApi?.setFieldValue('projectStage', '');
        },
      },
      fieldName: 'statusId',
      label: '招募状态',
      labelWidth: 80,
      defaultValue: '206628493037797903357',
      rules: 'required',
      // rules: z.required('项目类型不能为空'),
    },

    {
      component: 'Switch',
      componentProps: {
        // buttonStyle: 'solid',
        // disabled: false,
        // options: [
        //   { label: '等待招募', value: '0' },
        //   { label: '正在招募', value: '1' },
        // ],
        // optionType: 'button',
      },
      defaultValue: false,
      fieldName: 'sticked',
      formItemClass: 'col-span-1',
      label: '是否置顶',
    },
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
    // { title: '序号', type: 'seq', width: 50, fixed: 'left' },
    {
      align: 'left',
      field: 'projectName',
      fixed: 'left',
      title: '项目名称',
      width: 360,
    },
    {
      align: 'left',
      field: 'medicineName',
      title: '药物名称',
      width: 160,
    },
    {
      align: 'center',
      field: 'type.label',
      title: '项目类型',
      width: 80,
    },
    {
      align: 'center',
      field: 'stage.label',
      title: '项目分期',
      width: 80,
    },
    {
      align: 'center',
      field: 'allowanceAmount',
      title: '项目补助金额（¥）',
      width: 140,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'projectName',
          nameTitle: '项目',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'hospital',
            text: (row) => {
              return row.hospitalCount || 0;
            },
          },
        ],
      },
      field: 'hospitalCount',
      headerAlign: 'center',
      title: '开展医院数量',
      width: 100,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'projectName',
          nameTitle: '项目',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'apply',
            text: (row) => {
              return row.participantCount || 0;
            },
          },
        ],
      },
      field: 'participantCount',
      headerAlign: 'center',
      title: '报名数量',
      width: 100,
    },
    {
      field: 'createTime',
      title: $t('system.dept.createTime'),
      width: 180,
    },
    {
      field: 'updatedTime',
      title: '更新时间',
      width: 180,
    },
    {
      field: 'remark',
      title: '备注',
      minWidth: 180,
    },

    {
      cellRender: {
        name: 'CellStickedTag',
      },
      field: 'sticked',
      title: '置顶',
      fixed: 'right',
      minWidth: 60,
    },
    {
      field: 'sort',
      title: '排序',
      fixed: 'right',
      minWidth: 60,
    },

    {
      cellRender: { name: 'CellProjectStatusTag' },
      field: 'statusId',
      width: 95,
      fixed: 'right',
      title: '招募状态',
    },

    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'projectName',
          nameTitle: '项目',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          'edit', // 默认的编辑按钮
          {
            code: 'stop',
            text: (row: any) => {
              // 判断状态值（可能是简单状态码或者映射后的长ID）
              const status = row.status || '';
              return status === '0' || status === '1' ? '筛选' : '停止';
            },
          },
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
      width: 140,
    },
  ];
}

/**
 * 获取开展医院表格列配置
 * @description 使用函数的形式返回列数据而不是直接export一个Array常量，是为了响应语言切换时重新翻译表头
 * @param onActionClick 表格操作按钮点击事件
 */
export function useOpenHospitalColumns(
  onActionClick?: OnActionClickFn<IndicationsApi.Indication>,
): VxeTableGridOptions<IndicationsApi.Indication>['columns'] {
  return [
    { title: '序号', type: 'seq', width: 50, fixed: 'left' },
    { title: '', type: 'checkbox', width: 50, fixed: 'left' },
    {
      align: 'left',
      field: 'hospital.name',
      fixed: 'left',
      title: '医院名称',

      width: 260,
    },

    // {
    //   align: 'center',
    //   field: 'hospital.province',
    //   title: '所属省份',

    //   width: 100,
    // },

    {
      align: 'center',
      field: 'hospital.city.cityname',
      title: '所属城市',

      width: 80,
    },

    {
      align: 'center',
      field: 'phone',
      title: '联系电话',
      width: 120,
    },

    {
      align: 'center',
      field: 'checkupDate',
      title: '体检时间',
      width: 80,
    },
    {
      align: 'center',
      field: 'recruitmentCount',
      title: '入组人数',

      width: 80,
    },
    {
      align: 'center',
      field: 'createTime',
      title: '创建时间',
      // width: 160,
      minWidth: 160,
    },

    {
      cellRender: { name: 'CellProjectStatusTag' },
      field: 'statusId',
      width: 80,
      fixed: 'right',
      title: '招募状态',
    },

    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'projectName',
          nameTitle: '开展医院',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          'edit', // 默认的编辑按钮
          {
            code: 'status',
            text: (row: any) => {
              return row.statusId === '206628519472642133136' ||
                row.statusId === '206628493037797903357'
                ? '筛选'
                : '停止';
            },
          },
          {
            code: 'delete', // 默认的删除按钮
            text: '移出',
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
      width: 140,
    },
  ];
}

/**
 * 获取编辑表单的字段配置。如果没有使用多语言，可以直接export一个数组常量
 */
export function useOpenHospitalSchema(): VbenFormSchema[] {
  return [
    {
      component: 'ApiSelect',
      componentProps: {
        allowClear: true,
        immediate: true,
        api: async () => {
          const res = await getHospitalsList({
            isDeleted: '0',
            page: 1,
            pageSize: 100_000,
          });
          return res.data;
        },
        class: 'w-full',
        fieldNames: { label: 'name', value: 'id' },

        placeholder: '请选择',
        filterOption: (input: string, option: any) => {
          return option.name.includes(input);
        },
        showSearch: true,
      },
      fieldName: 'hospitalId',
      label: '医院名称',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'phone',
      label: '联系电话',
      rules: z
        .string()
        .min(11, $t('ui.formRules.minLength', ['联系电话', 11]))
        .max(11, $t('ui.formRules.maxLength', ['联系电话', 11])),
    },
    {
      component: 'Input',
      componentProps: {
        allowClear: true,
        immediate: true,
        api: async () => {
          const res = await getDictionariesList({ dictType: 'projectType' });

          return res.data;
        },
        class: 'w-full',
        labelField: 'label',
        valueField: 'value',
        placeholder: '全部',
        showSearch: true,
        onChange: (value) => {
          console.log('value', value);

          // formApi?.setFieldValue('projectStage', '');
        },
      },
      fieldName: 'checkupDate',
      label: '体检时间',
      rules: 'required',
      // rules: z.required('项目类型不能为空'),
    },

    {
      component: 'Input',
      componentProps: {
        allowClear: true,
        immediate: true,
        api: async () => {
          const res = await getDictionariesList({
            dictType: 'genderRequirement',
          });

          return res.data;
        },
        class: 'w-full',
        labelField: 'label',
        valueField: 'value',
        placeholder: '全部',
        showSearch: true,
      },
      fieldName: 'recruitmentCount',
      label: '入组人数',
      rules: 'required',
    },
  ];
}

// 状态ID映射函数
const mapStatusToId = (status) => {
  const statusMap = {
    '0': '206628493037797903357', // 等待招募
    '1': '206628519472642133136', // 正在招募
    '2': '206628562022253305061'  // 停止招募
  };
  return statusMap[status] || status;
};
