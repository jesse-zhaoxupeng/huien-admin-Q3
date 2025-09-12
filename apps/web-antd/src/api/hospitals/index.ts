import { requestClient } from '#/api/request';

export namespace HospitalsApi {
  export interface Hospital {
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
async function getHospitalsList(params: HospitalsApi.PageFetchParams) {
  return requestClient.get<Array<HospitalsApi.Hospital>>('/hospital', {
    params,
  });
}

/**
 * 创建适应症
 * @param data 部门数据
 */
async function createHospital(
  data: Omit<HospitalsApi.Hospital, 'children' | 'id'>,
) {
  return requestClient.post('/hospital', data);
}

/**
 * 更新适应症
 *
 * @param id 适应症 ID
 * @param data 适应症数据
 */
async function updateHospital(
  id: string,
  data: Omit<HospitalsApi.Hospital, 'children' | 'id'>,
) {
  return requestClient.put(`/hospital/${id}`, data);
}

/**
 * 删除部门
 * @param id 部门 ID
 */
async function deleteHospital(id: string) {
  return requestClient.delete(`/hospital/${id}`);
}

export { createHospital, deleteHospital, getHospitalsList, updateHospital };
