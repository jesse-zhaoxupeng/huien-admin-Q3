import { requestClient } from '#/api/request';

export namespace AdminsApi {
  export interface Admin {
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
async function getAdminsList(params: AdminsApi.PageFetchParams) {
  return requestClient.get<Array<AdminsApi.Admin>>('/admins', {
    params,
  });
}

/**
 * 创建适应症
 * @param data 部门数据
 */
async function createAdmin(data: Omit<AdminsApi.Admin, 'children' | 'id'>) {
  return requestClient.post('/admins', data);
}

/**
 * 更新适应症
 *
 * @param id 适应症 ID
 * @param data 适应症数据
 */
async function updateAdmin(
  id: string,
  data: Omit<AdminsApi.Admin, 'children' | 'id'>,
) {
  return requestClient.put(`/admins/${id}`, data);
}

/**
 * 删除部门
 * @param id 部门 ID
 */
async function deleteAdmin(id: string) {
  return requestClient.delete(`/admins/${id}`);
}

export { createAdmin, deleteAdmin, getAdminsList, updateAdmin };
