import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn } from '#/adapter/vxe-table';
import type { ParticipantsApi } from '#/api';

import { z } from '#/adapter/form';
import { $t } from '#/locales';

/**
 * 获取编辑表单的字段配置。如果没有使用多语言，可以直接export一个数组常量
 */
export function useSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Textarea',
      componentProps: {
        minLength: 2,
        maxLength: 50,
        rows: 2,
        placeholder: '请输入驳回原因',
        showCount: true,
      },
      fieldName: 'rejected_reason',
      label: '驳回原因',
      rules: z
        .string()
        .min(2, $t('ui.formRules.minLength', ['驳回原因', 2]))
        .max(50, $t('ui.formRules.maxLength', ['驳回原因', 50]))
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
  onActionClick?: OnActionClickFn<ParticipantsApi.Participant>,
): VxeTableGridOptions<ParticipantsApi.Participant>['columns'] {
  return [
    { title: '序号', type: 'seq', width: 50, fixed: 'left' },
    {
      align: 'center',
      field: 'name',
      fixed: 'left',
      title: '姓名',
      treeNode: true,
      width: 120,
    },

    {
      field: 'referrer_phone',
      title: '推荐人手机',
      width: 115,
    },

    {
      align: 'left',
      field: 'project.project_name',
      title: '报名项目',
      width: 180,
    },

    {
      field: 'indication.name',
      title: '适应症',
      width: 180,
    },
    {
      field: 'project.type.label',
      title: '项目类型',
      width: 80,
    },

    {
      field: 'phone',
      title: '报名人手机',
      width: 115,
    },

    {
      field: 'id_card_no',
      title: '身份证',
      width: 180,
    },
    {
      field: 'age',
      title: '年龄',
      width: 60,
    },
    {
      field: 'male.label',
      title: '性别',
      width: 60,
    },
    {
      field: 'bmi',
      title: 'BMI',
      slots: { default: 'bmi' },
      width: 60,
    },
    {
      field: 'province.cityname',
      title: '所属省份',
      width: 100,
    },
    {
      field: 'city.cityname',
      title: '所属城市',
      width: 100,
    },

    {
      field: 'create_time',
      title: '报名时间',
      width: 160,
    },
    {
      field: 'audit_at',
      title: '审核时间',
      width: 160,
    },
    {
      field: 'rejected_reason',
      title: '审核原因',
      minWidth: 100,
    },

    {
      // cellRender: { name: 'CellTag' },
      field: 'audit_status.label',
      minWidth: 80,
      fixed: 'right',
      title: '审核状态',
    },

    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'productName',
          nameTitle: $t('system.dept.name'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          // 'view', // 默认的编辑按钮
          // 'edit', // 默认的编辑按钮,
          {
            code: 'detail', // 默认的删除按钮
            text: '详情',
          },
          {
            code: 'audit', // 默认的删除按钮
            text: '审核',
          },
          // {
          //   code: 'delete', // 默认的删除按钮
          //   disabled: (row: ParticipantsApi.Participant) => {
          //     return !!(row.children && row.children.length > 0);
          //   },
          // },
        ],
      },
      field: 'operation',
      fixed: 'right',

      headerAlign: 'center',
      showOverflow: true,
      title: $t('system.dept.operation'),
      width: 100,
    },
  ];
}
