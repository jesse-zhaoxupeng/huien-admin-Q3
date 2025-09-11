import { requestClient } from '#/api/request';

export namespace DataDictionariesApi {
  export interface DataDictionary {
    [key: string]: any;
    /** 分类类型ID */
    id: string;
    /** 分类类型名称 */
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
 * 获取分类类型列表数据
 */
async function getDataDictionariesList(
  params: DataDictionariesApi.PageFetchParams,
) {
  return requestClient.get<Array<DataDictionariesApi.DataDictionary>>(
    'oms/dataDictionaries',
    {
      params,
    },
  );
}

/**
 * 创建分类类型
 * @param data 分类类型数据
 */
async function createDataDictionary(
  data: Omit<DataDictionariesApi.DataDictionary, 'children' | 'id'>,
) {
  return requestClient.post('oms/dataDictionaries', data);
}

/**
 * 更新分类类型
 *
 * @param id 分类类型 ID
 * @param data 分类类型数据
 */
async function updateDataDictionary(
  id: string,
  data: Omit<DataDictionariesApi.DataDictionary, 'children' | 'id'>,
) {
  return requestClient.put(`oms/dataDictionaries/${id}`, data);
}

/**
 * 删除分类类型
 * @param id 分类类型 ID
 */
async function deleteDataDictionary(id: string) {
  return requestClient.delete(`oms/dataDictionaries/${id}`);
}

export {
  createDataDictionary,
  deleteDataDictionary,
  getDataDictionariesList,
  updateDataDictionary,
};
