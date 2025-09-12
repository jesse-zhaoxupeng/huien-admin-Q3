import { requestClient } from '#/api/request';

export namespace ProjectsApi {
  export interface Project {
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

    page: number;
    pageSize: number;
  }
  export interface PageFetchProjectOpenHospitalsParams {
    [key: string]: any;
    projectId: number | string;
    page: number;
    pageSize: number;
  }

  export interface ProjectHospitalPageParams {
    pageNo: number;
    pageSize: number;
    projectId: number | string;
  }
}

/**
 * 获取项目开展医院
 */
async function getProjectOpenHospitals(
  params: ProjectsApi.PageFetchProjectOpenHospitalsParams,
) {
  return requestClient.get<Array<ProjectsApi.Project>>(
    `/project/${params.projectId}/hospitals`,
    {
      params,
    },
  );
}

/**
 * 获取项目医院列表（新API）
 */
async function getProjectHospitalPage(
  params: ProjectsApi.ProjectHospitalPageParams,
) {
  return requestClient.post('/projectHospital/page', params);
}

//

/**
 * 创建项目开展医院
 * @param data 部门数据
 */
async function createProjectOpenHospital(
  data: Omit<ProjectsApi.Project, 'children' | 'id'>,
) {
  return requestClient.post('/project/openHospital', data);
}

/**
 * 更新项目开展医院
 *
 * @param id 适应症 ID
 * @param data 适应症数据
 */
async function updateProjectOpenHospital(
  id: string,
  data: Omit<ProjectsApi.Project, 'children' | 'id'>,
) {
  return requestClient.put(`/project/openHospital/${id}`, data);
}

/**
 * 获取适应症列表数据
 */
async function getProjectsList(params: ProjectsApi.PageFetchParams) {
  return requestClient.get<Array<ProjectsApi.Project>>('/project', {
    params,
  });
}

/**
 * 创建适应症
 * @param data 部门数据
 */
async function createProject(
  data: Omit<ProjectsApi.Project, 'children' | 'id'>,
) {
  return requestClient.post('/project', data);
}

/**
 * 更新适应症
 *
 * @param id 适应症 ID
 * @param data 适应症数据
 */
async function updateProject(
  id: string,
  data: Omit<ProjectsApi.Project, 'children' | 'id'>,
) {
  return requestClient.put(`/project/${id}`, data);
}

/**
 * 删除部门
 * @param id 部门 ID
 */
async function deleteProject(id: string) {
  return requestClient.delete(`/project/${id}`);
}

/**
 * 删除开展医院
 * @param id 部门 ID
 */
async function deleteProjectOpenHospital(id: string) {
  return requestClient.delete(`/project/openHospital/${id}/delete`);
}

async function updateProjectHospitalStatus(params: object) {
  return requestClient.post(`/project/openHospital/batchUpdateStatus`, params);
}

async function updateProjectHospitalRemove(params: object) {
  return requestClient.post(`/project/openHospital/batchRemove`, params);
}

//

export {
  createProject,
  createProjectOpenHospital,
  deleteProject,
  deleteProjectOpenHospital,
  getProjectHospitalPage,
  getProjectOpenHospitals,
  getProjectsList,
  updateProject,
  updateProjectHospitalRemove,
  updateProjectHospitalStatus,
  updateProjectOpenHospital,
};
