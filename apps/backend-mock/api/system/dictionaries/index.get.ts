import type { H3Event } from 'h3';
import { createError, eventHandler, getQuery } from 'h3';
import { StatusCode } from '../../../utils/constants';

// 模拟字典数据
const dictionaries = {
  'project_type': [
    { label: '经典试验', value: '0' },
    { label: '上市后研究', value: '1' },
    { label: '观察性研究', value: '2' }
  ],
  'gender_requirement': [
    { label: '不限', value: '0' },
    { label: '男', value: '1' },
    { label: '女', value: '2' }
  ],
  '0_project_stage': [
    { label: 'I期', value: '1', id: '1' },
    { label: 'II期', value: '2', id: '2' },
    { label: 'III期', value: '3', id: '3' },
    { label: 'IV期', value: '4', id: '4' }
  ],
  '1_project_stage': [
    { label: 'I期', value: '1', id: '1' },
    { label: 'II期', value: '2', id: '2' },
    { label: 'III期', value: '3', id: '3' },
    { label: 'IV期', value: '4', id: '4' }
  ],
  '2_project_stage': [
    { label: 'I期', value: '1', id: '1' },
    { label: 'II期', value: '2', id: '2' },
    { label: 'III期', value: '3', id: '3' }
  ],
  'third_party_system': [
    { label: '未接入', value: '0' },
    { label: '已接入', value: '1' }
  ]
};

export default eventHandler(async (event: H3Event) => {
  try {
    const query = getQuery(event);
    const { dict_type } = query;
    
    if (!dict_type || typeof dict_type !== 'string') {
      throw createError({
        statusCode: 400,
        message: '请提供字典类型',
      });
    }
    
    const dictData = dictionaries[dict_type] || [];
    
    return {
      code: StatusCode.success,
      message: '获取成功',
      data: dictData,
    };
  } catch (e) {
    if (e.statusCode === 400) {
      throw e;
    }
    throw createError({
      statusCode: 500,
      message: '服务器内部错误',
    });
  }
}); 
