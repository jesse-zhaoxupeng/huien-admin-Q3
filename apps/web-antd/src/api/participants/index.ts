import { requestClient } from '#/api/request';

export namespace ParticipantsApi {
  export interface Participant {
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
async function exportParticipantsList(params: ParticipantsApi.PageFetchParams) {
  return requestClient.get<{ fileName: string; url: string }>(
    '/participants/export',
    {
      params,
    },
    {
      responseType: 'blob',
    },
  );
}

/**
 * 获取适应症列表数据
 */
async function getParticipantsList(params: ParticipantsApi.PageFetchParams) {
  return requestClient.get<Array<ParticipantsApi.Participant>>(
    '/participants',
    {
      params,
    },
  );
}

/**
 * 获取适应症列表数据
 */
async function getAuditStatusStatistics(params: object = {}) {
  return requestClient.get<any[]>('/participants/auditStatusStatistics', {
    params,
  });
}

//

/**
 * 创建适应症
 * @param data 部门数据
 */
async function createParticipant(
  data: Omit<ParticipantsApi.Participant, 'children' | 'id'>,
) {
  return requestClient.post('/participants', data);
}

/**
 * 审核
 *
 * @param id 报名 ID
 * @param data 审核数据
 */
async function auditParticipant(
  id: string,
  data: Omit<ParticipantsApi.Participant, 'children' | 'id'>,
) {
  return requestClient.put(`/participants/audit/${id}`, data);
}

/**
 * 更新适应症
 *
 * @param id 适应症 ID
 * @param data 适应症数据
 */
async function updateParticipant(
  id: string,
  data: Omit<ParticipantsApi.Participant, 'children' | 'id'>,
) {
  return requestClient.put(`/participants/${id}`, data);
}

/**
 * 删除部门
 * @param id 部门 ID
 */
async function deleteParticipant(id: string) {
  return requestClient.delete(`/participants/${id}`);
}

export {
  auditParticipant,
  createParticipant,
  deleteParticipant,
  exportParticipantsList,
  getAuditStatusStatistics,
  getParticipantsList,
  updateParticipant,
};
