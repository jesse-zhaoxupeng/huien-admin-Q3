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
export { getAdImageList, upDataAdImage };
