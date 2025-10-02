import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { HospitalsApi } from '#/api';

/**
 * 获取表格列配置
 * @description 使用函数的形式返回列数据而不是直接export一个Array常量，是为了响应语言切换时重新翻译表头
 */
export function useColumns(): VxeTableGridOptions<HospitalsApi.Hospital>['columns'] {
  return [
    { title: '序号', type: 'seq', width: 50, fixed: 'left' },
    {
      field: 'projectName',
      title: '项目名称',
      fixed: 'left',
    },

    {
      field: 'projectType',
      title: '项目类型',
      width: 180,
    },
    {
      field: 'counts',
      title: '待办数量',
      width: 80,
    },
    {
      field: 'participantDate',
      title: '待办日期',
      width: 180,
    },
    {
      field: 'participantMonth',
      title: '待办月份',
      width: 180,
    },
  ];
}
