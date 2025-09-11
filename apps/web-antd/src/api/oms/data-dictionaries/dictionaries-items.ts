import { requestClient } from '#/api/request';

export namespace DataDictionariesItemsApi {
  export interface DataDictionaryItem {
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
async function getDataDictionariesItemList(
  params: DataDictionariesItemsApi.PageFetchParams,
) {
  return requestClient.get<Array<DataDictionariesItemsApi.DataDictionaryItem>>(
    'oms/dataDictionariesItems',
    {
      params,
    },
  );
}

/**
 * 创建分类类型
 * @param data 分类类型数据
 */
async function createDataDictionaryItem(
  data: Omit<DataDictionariesItemsApi.DataDictionaryItem, 'children' | 'id'>,
) {
  return requestClient.post('oms/dataDictionariesItems', data);
}

/**
 * 更新分类类型
 *
 * @param id 分类类型 ID
 * @param data 分类类型数据
 */
async function updateDataDictionaryItem(
  id: string,
  data: Omit<DataDictionariesItemsApi.DataDictionaryItem, 'children' | 'id'>,
) {
  return requestClient.put(`oms/dataDictionariesItems/${id}`, data);
}

/**
 * 删除分类类型
 * @param id 分类类型 ID
 */
async function deleteDataDictionaryItem(id: string) {
  return requestClient.delete(`oms/dataDictionariesItems/${id}`);
}

export {
  createDataDictionaryItem,
  deleteDataDictionaryItem,
  getDataDictionariesItemList,
  updateDataDictionaryItem,
};
