import type { H3Event } from 'h3';
import { createError, eventHandler, getRouterParam, readBody } from 'h3';
import { StatusCode } from '../../utils/constants';

export default eventHandler(async (event: H3Event) => {
  try {
    const id = getRouterParam(event, 'id');
    const body = await readBody(event);
    
    // 这里只是模拟成功响应，实际中应该更新存储的数据
    return {
      code: StatusCode.success,
      message: '更新成功',
      data: {
        id,
        ...body,
        update_time: new Date().toISOString().replace('T', ' ').substring(0, 19),
      },
    };
  } catch (e) {
    throw createError({
      statusCode: 500,
      message: '服务器内部错误',
    });
  }
}); 
