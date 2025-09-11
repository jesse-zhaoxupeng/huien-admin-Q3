import { requestClient } from '#/api/request';

export namespace DictionariesApi {
  export interface Dictionary {
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
async function getDictionariesList(params: DictionariesApi.PageFetchParams) {
  return requestClient.get<Array<DictionariesApi.Dictionary>>('/dictionaries', {
    params,
  });
}

/**
 * 创建适应症
 * @param data 部门数据
 */
async function createDictionary(
  data: Omit<DictionariesApi.Dictionary, 'children' | 'id'>,
) {
  return requestClient.post('/dictionaries', data);
}

/**
 * 更新适应症
 *
 * @param id 适应症 ID
 * @param data 适应症数据
 */
async function updateDictionary(
  id: string,
  data: Omit<DictionariesApi.Dictionary, 'children' | 'id'>,
) {
  return requestClient.put(`/dictionaries/${id}`, data);
}

/**
 * 删除部门
 * @param id 部门 ID
 */
async function deleteDictionary(id: string) {
  return requestClient.delete(`/dictionaries/${id}`);
}

export {
  createDictionary,
  deleteDictionary,
  getDictionariesList,
  updateDictionary,
};
