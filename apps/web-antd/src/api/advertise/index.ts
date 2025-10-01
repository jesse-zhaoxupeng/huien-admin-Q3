import { requestClient } from '#/api/request';

export namespace AdImageApi {
  export interface AdImage {
    [key: string]: any;
    /** 图片ID */
    id: string;
    /** 图片名称 */
    name: string;
    /** 备注 */
    remark?: string;
  }
  export interface PageFetchParams {
    [key: string]: any;
    page?: number;
    pageSize?: number;
  }
  export interface upDataFetchParams {
    [key: string]: any;
  }
  export interface UploadFileParams {
    file: File;
    onError?: (error: Error) => void;
    onProgress?: (progress: { percent: number }) => void;
    onSuccess?: (data: any, file: File) => void;
  }
}

/**
 * 获取分页查询广告图
 */
async function getAdImageList(params: AdImageApi.PageFetchParams) {
  return requestClient.post<Array<AdImageApi.AdImage>>('/adImage/page', params);
}
/**
 * 新增广告图
 */
async function createAdImage(params: AdImageApi.upDataFetchParams) {
  return requestClient.post('/adImage', params);
}
/**
 * 更新广告图
 */
async function updateAdImage(params: AdImageApi.upDataFetchParams) {
  return requestClient.put('/adImage', params);
}
/**
 * 删除广告图
 */
async function deleteAdImage(id: string) {
  return requestClient.delete(`/adImage?id=${id}`);
}
/**
 * 上传广告图
 */
async function uploadFile({
  file,
  onError,
  onProgress,
  onSuccess,
}: AdImageApi.UploadFileParams) {
  try {
    onProgress?.({ percent: 0 });

    const data = await requestClient.upload('/upload/adimage', { file });
    const uploadResult = {
      name: file.name, // 文件名
      status: 'done',
      url: `${import.meta.env.VITE_APP_URL}/images/${data}`, // 服务器返回的图片 URL
    };
    onProgress?.({ percent: 100 });
    onSuccess?.(uploadResult, file);
  } catch (error) {
    onError?.(error instanceof Error ? error : new Error(String(error)));
  }
}

export {
  createAdImage,
  deleteAdImage,
  getAdImageList,
  updateAdImage,
  uploadFile,
};
