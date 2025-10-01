import { requestClient } from '#/api/request';

export namespace ArticleApi {
  export interface Article {
    [key: string]: any;
    /** 图片ID */
    id: string;
    /** 文章标题 */
    title: string;
    /** 封面图 */
    frontImg?: string;
    /** 文章内容，富文本 */
    articleContent?: string;
    /** 上下架状态，1上架2下架 */
    status?: string;
  }
  export interface PageFetchParams {
    [key: string]: any;
    page?: number;
    pageSize?: number;
    id?: number;
  }
  export interface CreateFetchParams {
    /** 文章标题*/
    title: string;
    /** 封面图*/
    frontImg: string;
    /** 文章内容，富文本*/
    articleContent: string;
  }
  export interface upDataFetchParams {
    /** 文章标题*/
    title: string;
    /** 封面图*/
    frontImg: string;
    /** 文章内容，富文本*/
    articleContent: string;
    /** 文章ID*/
    id: number;
  }
  export interface upDownArticleFetchParams {
    /** 1上架 2下架*/
    status: string;
    /** 文章ID*/
    id: number;
  }
}
/**
 * 新增文章
 */
async function createArticle(params: ArticleApi.CreateFetchParams) {
  return requestClient.post('/article', params);
}

/**
 * 更新文章
 */
async function updateArticle(params: ArticleApi.upDataFetchParams) {
  return requestClient.put('/article', params);
}

/**
 * 删除文章
 */
async function deleteArticle(id: string) {
  return requestClient.delete(`/article?id=${id}`);
}

/**
 * 文章上下架
 */
async function upDownArticle(params: ArticleApi.upDownArticleFetchParams) {
  return requestClient.post('/article/upDown', params);
}

/**
 * 查询文章详情
 */
async function getArticleDetail(id: string) {
  return requestClient.get(`/article/${id}`);
}
/**
 * 获取分页查询广告图
 */
async function getArticleList(params: ArticleApi.PageFetchParams) {
  return requestClient.post<Array<ArticleApi.Article>>('/article/page', params);
}

export {
  createArticle,
  deleteArticle,
  getArticleDetail,
  getArticleList,
  updateArticle,
  upDownArticle,
};
