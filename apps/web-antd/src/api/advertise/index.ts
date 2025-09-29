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
    pageNo?: number;
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
  return requestClient.post<{ fileName: string; url: string }>(
    '/adImage/page',
    {
      params,
    },
    {
      responseType: 'blob',
    },
  );
}
/**
 * 获取分页查询广告图
 */
async function upDataAdImage(params: AdImageApi.upDataFetchParams) {
  return requestClient.post<{ fileName: string; url: string }>(
    '/adImage',
    {
      params,
    },
    {
      responseType: 'blob',
    },
  );
}
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
      url: `https://www.huienmed:8181/images/${data}`, // 服务器返回的图片 URL
    };
    onProgress?.({ percent: 100 });
    onSuccess?.(uploadResult, file);
  } catch (error) {
    onError?.(error instanceof Error ? error : new Error(String(error)));
  }
}

export { getAdImageList, upDataAdImage, uploadFile };
