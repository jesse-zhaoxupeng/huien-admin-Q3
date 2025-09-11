import type { H3Event } from 'h3';
import { createError, eventHandler, getQuery } from 'h3';
import { StatusCode } from '../../utils/constants';

// 模拟适应症数据
const mockIndications = [
  {
    id: '101',
    name: '肺癌',
    sort: 1,
    status: 1,
    remark: '肺癌相关适应症',
    create_time: '2023-11-01 08:30:00',
    update_time: '2024-01-15 10:20:00'
  },
  {
    id: '102',
    name: '乳腺癌',
    sort: 2,
    status: 1,
    remark: '乳腺癌相关适应症',
    create_time: '2023-11-02 09:45:00',
    update_time: '2024-01-16 11:30:00'
  },
  {
    id: '103',
    name: '骨质疏松',
    sort: 3,
    status: 1,
    remark: '骨质疏松相关适应症',
    create_time: '2023-11-03 10:15:00',
    update_time: '2024-01-17 14:25:00'
  },
  {
    id: '104',
    name: '糖尿病',
    sort: 4,
    status: 1,
    remark: '糖尿病相关适应症',
    create_time: '2023-11-04 11:20:00',
    update_time: '2024-01-18 15:40:00'
  },
  {
    id: '105',
    name: '高血压',
    sort: 5,
    status: 1,
    remark: '高血压相关适应症',
    create_time: '2023-11-05 12:30:00',
    update_time: '2024-01-19 16:50:00'
  }
];

export default eventHandler(async (event: H3Event) => {
  try {
    const query = getQuery(event);
    const { page = 1, pageSize = 10 } = query;
    
    // 简单分页逻辑
    const startIndex = (Number(page) - 1) * Number(pageSize);
    const endIndex = startIndex + Number(pageSize);
    const paginatedData = mockIndications.slice(startIndex, endIndex);
    
    return {
      code: StatusCode.success,
      message: '获取成功',
      data: paginatedData,
      total: mockIndications.length,
    };
  } catch (e) {
    throw createError({
      statusCode: 500,
      message: '服务器内部错误',
    });
  }
}); 
