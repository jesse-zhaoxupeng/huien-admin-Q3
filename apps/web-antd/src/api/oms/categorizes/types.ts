import { requestClient } from '#/api/request';

export namespace CategorizesTypesApi {
  export interface CategorizeType {
    [key: string]: any;
    /** 分类类别ID */
    id: string;
    /** 分类类别名称 */
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
 * 获取分类类别列表数据
 */
async function getCategorizesTypesList(
  params: CategorizesTypesApi.PageFetchParams,
) {
  return requestClient.get<Array<CategorizesTypesApi.CategorizeType>>(
    '/oms/categorizes/types',
    {
      params,
    },
  );
}

/**
 * 创建分类类别
 * @param data 分类类别数据
 */
async function createCategorizeType(
  data: Omit<CategorizesTypesApi.CategorizeType, 'children' | 'id'>,
) {
  return requestClient.post('/oms/categorizes/types', data);
}

/**
 * 更新分类类别
 *
 * @param id 分类类别 ID
 * @param data 分类类别数据
 */
async function updateCategorizeType(
  id: string,
  data: Omit<CategorizesTypesApi.CategorizeType, 'children' | 'id'>,
) {
  return requestClient.put(`/oms/categorizes/types/${id}`, data);
}

/**
 * 删除分类类别
 * @param id 分类类别 ID
 */
async function deleteCategorizeType(id: string) {
  return requestClient.delete(`/oms/categorizes/types/${id}`);
}

export {
  createCategorizeType,
  deleteCategorizeType,
  getCategorizesTypesList,
  updateCategorizeType,
};
