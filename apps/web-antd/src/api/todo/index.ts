import { requestClient } from '#/api/request';

export namespace MyTodoParticipantsApi {
  export interface MyTodoParticipants {
    [key: string]: any;
    /** 项目名称 */
    projectName: string;
    /** 项目ID */
    projectId: number;
    /** 项目类型 */
    projectType: number;
    /** 项目待办数量 */
    counts: number;
    /** 参与时间 */
    participantDate: string;
    /** 参与月份 */
    participantMonth: string;
  }
}

/**
 * 我的待办
 */
async function geMyTodoParticipants() {
  return requestClient.get<Array<MyTodoParticipantsApi.MyTodoParticipants>>(
    `participant/myTodoParticipants`,
  );
}

//

export { geMyTodoParticipants };
