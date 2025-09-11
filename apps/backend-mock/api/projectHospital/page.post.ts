import { eventHandler, readBody } from 'h3';

export default eventHandler(async (event) => {
  // 获取请求体中的参数
  const body = await readBody(event);
  const { pageNo = 1, pageSize = 20, projectId } = body;

  // 为指定的项目ID生成固定的医院列表，确保数据一致性
  const totalHospitals = 10; // 总医院数量，可以根据projectId变化
  
  // 生成医院列表
  const hospitalList = Array.from({ length: totalHospitals }, (_, index) => {
    const id = 220 + index;
    const hospitalId = 30 + index;
    const status = ["0", "1", "2"][Math.floor(Math.random() * 3)]; // 随机状态: 等待招募、正在招募、停止招募
    
    return {
      projectId: Number(projectId),
      hospitalId: hospitalId,
      phone: `1399${String(hospitalId).padStart(7, '0')}`,
      checkupDate: ["周一-周五", "周一至周日", "每周二、四"][Math.floor(Math.random() * 3)],
      recruitmentCount: Math.floor(Math.random() * 20) + 1,
      status: status,
      comment: null,
      id: id,
      projectName: `项目${projectId} - ${["肿瘤临床试验", "糖尿病新药研究", "心血管疾病用药"][Math.floor(Math.random() * 3)]}`,
      hospitalName: `${["北京协和", "上海瑞金", "复旦肿瘤", "浙大一院", "广东省人民"][Math.floor(Math.random() * 5)]}医院`,
      cityFullName: ["北京市", "上海市", "杭州市", "广州市", "深圳市"][Math.floor(Math.random() * 5)],
      provinceId: null,
      provinceName: null,
      cityId: null,
      cityName: null,
      createTime: formatDate(new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)))
    };
  });

  // 分页处理
  const startIndex = (pageNo - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pageItems = hospitalList.slice(startIndex, endIndex);
  const totalPages = Math.ceil(hospitalList.length / pageSize);

  // 返回分页结果
  return {
    code: 0,
    msg: "SUCCESS",
    data: {
      list: pageItems,
      totalRecords: hospitalList.length,
      totalPages: totalPages,
      pageSize: pageSize,
      currentPageNo: pageNo,
      previousPageNo: pageNo > 1 ? pageNo - 1 : 1,
      nextPageNo: pageNo < totalPages ? pageNo + 1 : totalPages,
      hasPreviousPage: pageNo > 1,
      hasNextPage: pageNo < totalPages,
      firstPage: pageNo === 1,
      lastPage: pageNo === totalPages,
      currentPageSize: pageItems.length
    }
  };
});

// 格式化日期为 "YYYY-MM-DD HH:MM:SS" 格式
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
} 
