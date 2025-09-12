import { requestClient } from '#/api/request';

export namespace CitysApi {
  export interface City {
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
    page?: number;
    pageSize?: number;
  }
}

/**
 * 获取适应症列表数据
 */
async function getCitysList(params: CitysApi.PageFetchParams) {
  return requestClient.get<Array<CitysApi.City>>('/city', {
    params,
  });
}

//

/**
 * 创建适应症
 * @param data 部门数据
 */
async function createCity(data: Omit<CitysApi.City, 'children' | 'id'>) {
  return requestClient.post('/city', data);
}

/**
 * 审核
 *
 * @param id 报名 ID
 * @param data 审核数据
 */
async function auditCity(
  id: string,
  data: Omit<CitysApi.City, 'children' | 'id'>,
) {
  return requestClient.put(`/city/audit/${id}`, data);
}

/**
 * 更新适应症
 *
 * @param id 适应症 ID
 * @param data 适应症数据
 */
async function updateCity(
  id: string,
  data: Omit<CitysApi.City, 'children' | 'id'>,
) {
  return requestClient.put(`/city/${id}`, data);
}

/**
 * 删除部门
 * @param id 部门 ID
 */
async function deleteCity(id: string) {
  return requestClient.delete(`/city/${id}`);
}

export { auditCity, createCity, deleteCity, getCitysList, updateCity };
