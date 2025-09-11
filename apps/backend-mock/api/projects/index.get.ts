import { eventHandler, getQuery } from 'h3';

export default eventHandler(async (event) => {
  // 获取分页参数
  const query = getQuery(event);
  const page = Number(query.page) || 1;
  const pageSize = Number(query.pageSize) || 10;

  // 生成模拟数据
  const totalProjects = 100;
  const projects = Array.from({ length: totalProjects }, (_, index) => {
    const id = index + 1;
    const projectType = Math.floor(Math.random() * 3); // 0, 1, 2
    const projectStage = Math.floor(Math.random() * 4); // 0, 1, 2, 3
    const status = String(Math.floor(Math.random() * 3)); // "0", "1", "2"
    
    return {
      projectName: `测试项目 ${id}`,
      medicineName: `测试药物 ${id}`,
      projectType,
      genderRequirement: String(Math.floor(Math.random() * 3)), // "0", "1", "2"
      allowanceAmount: `${Math.floor(Math.random() * 9000) + 1000}`,
      projectStage,
      thirdPartySystem: Math.floor(Math.random() * 4), // 0, 1, 2, 3
      indicationId: Math.floor(Math.random() * 50),
      customTags: "测试标签",
      projectInfo: "<p>项目详情信息</p>",
      inclusionCriteria: "<p>入组标准</p>",
      exclusionCriteria: "<p>排除标准</p>",
      isTop: null,
      extraFields: null,
      uploadImageEnabled: null,
      uploadedImagesUrl: "",
      uploadImagePrompt: null,
      status,
      comment: null,
      id,
      hospitalCount: Math.floor(Math.random() * 10) + 1,
      participantCount: Math.floor(Math.random() * 20),
      createTime: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0].replace(/-/g, '/'),
      projectTypeName: getProjectTypeName(projectType),
      projectStageName: getProjectStageName(projectStage),
      hospitalList: generateHospitals(Math.floor(Math.random() * 5) + 1),
      creator: null,
      customTagList: null
    };
  });

  // 分页
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pagedProjects = projects.slice(startIndex, endIndex);

  // 返回结果
  return {
    code: 0,
    msg: "SUCCESS",
    data: {
      list: pagedProjects,
      totalRecords: totalProjects,
      totalPages: Math.ceil(totalProjects / pageSize),
      pageSize,
      currentPageNo: page,
      previousPageNo: page > 1 ? page - 1 : 1,
      nextPageNo: page < Math.ceil(totalProjects / pageSize) ? page + 1 : Math.ceil(totalProjects / pageSize),
      hasPreviousPage: page > 1,
      hasNextPage: page < Math.ceil(totalProjects / pageSize),
      firstPage: page === 1,
      lastPage: page === Math.ceil(totalProjects / pageSize),
      currentPageSize: pagedProjects.length
    }
  };
});

// 辅助函数
function getProjectTypeName(type: number): string | null {
  const types = ['健康受试', '患者受试', '特殊项目'];
  return types[type] || null;
}

function getProjectStageName(stage: number): string | null {
  const stages = ['I期', 'II期', 'III期', 'IV期'];
  return stages[stage] || null;
}

function generateHospitals(count: number) {
  return Array.from({ length: count }, (_, index) => {
    const id = 100 + index;
    return {
      name: `测试医院 ${id}`,
      alias: null,
      cityId: null,
      province: null,
      city: null,
      district: null,
      location: null,
      nature: null,
      level: null,
      phone: null,
      address: null,
      status: null,
      id,
      cityFullName: null,
      createTime: null
    };
  });
}
