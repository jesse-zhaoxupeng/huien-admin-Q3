import type { H3Event } from 'h3';
import { createError, eventHandler, getRouterParam } from 'h3';
import { StatusCode } from '../../utils/constants';

export default eventHandler(async (event: H3Event) => {
  try {
    const id = getRouterParam(event, 'id');
    
    // 这里只是模拟成功响应，实际中应该删除存储的数据
    return {
      code: StatusCode.success,
      message: '删除成功',
      data: { id },
    };
  } catch (e) {
    throw createError({
      statusCode: 500,
      message: '服务器内部错误',
    });
  }
}); 
