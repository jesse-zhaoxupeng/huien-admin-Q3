import { requestClient } from '#/api/request';

export namespace IndicationsApi {
  export interface Indication {
    [key: string]: any;
    /** 适应症ID */
    id: string;
    /** 适应症名称 */
    name: string;
    /** 备注 */
    remark?: string;
    /** 状态 */
    status: 0 | 1;
  }
  export interface PageFetchParams {
    [key: string]: any;
    page: number;
    pageSize: number;
  }
}

/**
 * 获取适应症列表数据
 */
async function getIndicationsList(params: IndicationsApi.PageFetchParams) {
  return requestClient.get<Array<IndicationsApi.Indication>>(
    '/indication/page',
    {
      params,
    },
  );
}

/**
 * 创建适应症
 * @param data 部门数据
 */
async function createIndication(
  data: Omit<IndicationsApi.Indication, 'children' | 'id'>,
) {
  return requestClient.post('/indication', data);
}

/**
 * 更新适应症
 *
 * @param id 适应症 ID
 * @param data 适应症数据
 */
async function updateIndication(
  id: string,
  data: Omit<IndicationsApi.Indication, 'children' | 'id'>,
) {
  return requestClient.put(`/indication/${id}`, data);
}

/**
 * 删除部门
 * @param id 部门 ID
 */
async function deleteIndication(id: string) {
  return requestClient.delete(`/indication/${id}`);
}

export {
  createIndication,
  deleteIndication,
  getIndicationsList,
  updateIndication,
};
