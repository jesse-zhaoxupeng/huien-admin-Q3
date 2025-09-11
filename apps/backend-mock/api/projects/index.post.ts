import type { H3Event } from 'h3';
import { createError, eventHandler, readBody } from 'h3';
import { StatusCode } from '../../utils/constants';

export default eventHandler(async (event: H3Event) => {
  try {
    const body = await readBody(event);
    
    // 这里只是模拟成功响应，实际中应该将数据存储
    return {
      code: StatusCode.success,
      message: '创建成功',
      data: {
        id: new Date().getTime().toString(),
        ...body,
        create_time: new Date().toISOString().replace('T', ' ').substring(0, 19),
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
