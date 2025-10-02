import { requestClient } from '#/api/request';

export namespace AiSpeedDatingApi {
  export interface aiTodoParticipantsItem {
    [key: string]: any;
    /** 项目ID */
    projectId: string;
    /** 项目名称 */
    projectName: string;
    /** 项目类型 */
    projectType?: string;
    /** 待办数量 */
    counts: string;
    /** 项目报名待办日期 */
    participantDate: string;
    /** 项目报名待办月份 */
    participantMonth: string;
  }
}

/**
 * 查询AI速配
 */
async function getAiTodoParticipants() {
  return requestClient.get<Array<AiSpeedDatingApi.aiTodoParticipantsItem>>(
    '/participant/aiTodoParticipants',
  );
}

export { getAiTodoParticipants };
