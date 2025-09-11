import type { H3Event } from 'h3';
import { createError, eventHandler, getRouterParam } from 'h3';
import { StatusCode } from '../../utils/constants';

// 修改后的模拟项目数据，与index.get.ts中保持一致
const mockProjects = [
  {
    id: '1',
    project_name: '肺癌早期筛查项目',
    medicine_name: '阿斯利康',
    project_type: '0',
    type: {
      label: '经典试验',
      value: '0'
    },
    project_stage: '1',
    stage: {
      label: 'I期',
      value: '1'
    },
    gender_requirement: '0',
    gender_requirement_label: '不限',
    third_party_system: '1',
    third_party_system_label: '已接入',
    allowance_amount: '5000',
    custom_tags: '肺癌,筛查',
    sort: 1,
    status: '206628493037797903357',
    status_id: '206628493037797903357',
    indication_id: '',
    remark: '该项目旨在通过早期筛查减少肺癌死亡率',
    create_time: '2023-12-01 09:30:00',
    update_time: '2024-03-15 14:20:00',
    updated_time: '2024-03-15 14:20:00',
    sticked: true,
    hospitals_count: 12,
    participants_count: 245
  },
  {
    id: '2',
    project_name: '糖尿病并发症治疗项目',
    medicine_name: '诺和诺德',
    project_type: '1',
    type: {
      label: '上市后研究',
      value: '1'
    },
    project_stage: '2',
    stage: {
      label: 'II期',
      value: '2'
    },
    gender_requirement: '0',
    gender_requirement_label: '不限',
    third_party_system: '',
    third_party_system_label: '',
    allowance_amount: '3500',
    custom_tags: '糖尿病,并发症',
    sort: 2,
    status: '206628519472642133136',
    status_id: '206628519472642133136',
    indication_id: '101',
    remark: '针对2型糖尿病患者的并发症治疗研究',
    create_time: '2024-01-10 10:15:00',
    update_time: '2024-03-20 16:45:00',
    updated_time: '2024-03-20 16:45:00',
    sticked: false,
    hospitals_count: 8,
    participants_count: 156
  },
  {
    id: '3',
    project_name: '高血压创新药物试验',
    medicine_name: '拜耳制药',
    project_type: '0',
    type: {
      label: '经典试验',
      value: '0'
    },
    project_stage: '3',
    stage: {
      label: 'III期',
      value: '3'
    },
    gender_requirement: '1',
    gender_requirement_label: '男',
    third_party_system: '0',
    third_party_system_label: '未接入',
    allowance_amount: '4200',
    custom_tags: '高血压,创新药',
    sort: 3,
    status: '206628519472642133136',
    status_id: '206628519472642133136',
    indication_id: '',
    remark: '创新型高血压药物临床试验',
    create_time: '2023-11-05 14:00:00',
    update_time: '2024-02-28 09:15:00',
    updated_time: '2024-02-28 09:15:00',
    sticked: false,
    hospitals_count: 5,
    participants_count: 89
  },
  {
    id: '4',
    project_name: '乳腺癌靶向治疗项目',
    medicine_name: '罗氏制药',
    project_type: '1',
    type: {
      label: '上市后研究',
      value: '1'
    },
    project_stage: '4',
    stage: {
      label: 'IV期',
      value: '4'
    },
    gender_requirement: '2',
    gender_requirement_label: '女',
    third_party_system: '',
    third_party_system_label: '',
    allowance_amount: '6000',
    custom_tags: '乳腺癌,靶向治疗',
    sort: 4,
    status: '206628493037797903357',
    status_id: '206628493037797903357',
    indication_id: '102',
    remark: '乳腺癌患者靶向治疗效果评估',
    create_time: '2024-02-01 08:30:00',
    update_time: '2024-04-01 11:20:00',
    updated_time: '2024-04-01 11:20:00',
    sticked: true,
    hospitals_count: 15,
    participants_count: 278
  },
  {
    id: '5',
    project_name: '骨质疏松预防研究',
    medicine_name: '辉瑞制药',
    project_type: '2',
    type: {
      label: '观察性研究',
      value: '2'
    },
    project_stage: '1',
    stage: {
      label: 'I期',
      value: '1'
    },
    gender_requirement: '0',
    gender_requirement_label: '不限',
    third_party_system: '',
    third_party_system_label: '',
    allowance_amount: '2800',
    custom_tags: '骨质疏松,预防',
    sort: 5,
    status: '206628562022253305061',
    status_id: '206628562022253305061',
    indication_id: '103',
    remark: '老年人群骨质疏松预防研究',
    create_time: '2023-10-15 13:45:00',
    update_time: '2024-01-18 15:30:00',
    updated_time: '2024-01-18 15:30:00',
    sticked: false,
    hospitals_count: 3,
    participants_count: 42
  }
];

export default eventHandler(async (event: H3Event) => {
  try {
    const id = getRouterParam(event, 'id');
    
    const project = mockProjects.find(item => item.id === id);
    
    if (!project) {
      throw createError({
        statusCode: 404,
        message: '项目不存在',
      });
    }
    
    return {
      code: StatusCode.success,
      message: '获取成功',
      data: project,
    };
  } catch (e) {
    if (e.statusCode === 404) {
      throw e;
    }
    throw createError({
      statusCode: 500,
      message: '服务器内部错误',
    });
  }
}); 
