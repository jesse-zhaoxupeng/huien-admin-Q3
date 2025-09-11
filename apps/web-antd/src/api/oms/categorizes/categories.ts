import { requestClient } from '#/api/request';

export namespace CategorizesCategoriesApi {
  export interface CategorizeCategory {
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
async function getCategorizesCategoryList(
  params: CategorizesCategoriesApi.PageFetchParams,
) {
  return requestClient.get<Array<CategorizesCategoriesApi.CategorizeCategory>>(
    '/oms/categorizes/categories',
    {
      params,
    },
  );
}

/**
 * 创建分类类型
 * @param data 分类类型数据
 */
async function createCategorizeCategory(
  data: Omit<CategorizesCategoriesApi.CategorizeCategory, 'children' | 'id'>,
) {
  return requestClient.post('/oms/categorizes/categories', data);
}

/**
 * 更新分类类型
 *
 * @param id 分类类型 ID
 * @param data 分类类型数据
 */
async function updateCategorizeCategory(
  id: string,
  data: Omit<CategorizesCategoriesApi.CategorizeCategory, 'children' | 'id'>,
) {
  return requestClient.put(`/oms/categorizes/categories/${id}`, data);
}

/**
 * 删除分类类型
 * @param id 分类类型 ID
 */
async function deleteCategorizeCategory(id: string) {
  return requestClient.delete(`/oms/categorizes/categories/${id}`);
}

export {
  createCategorizeCategory,
  deleteCategorizeCategory,
  getCategorizesCategoryList,
  updateCategorizeCategory,
};
