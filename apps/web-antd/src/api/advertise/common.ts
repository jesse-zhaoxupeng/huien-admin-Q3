import { requestClient } from '../request';

export namespace CommonApi {
  export interface UploadFileParams {
    file: File;
    onError?: (error: Error) => void;
    onProgress?: (progress: { percent: number }) => void;
    onSuccess?: (data: any, file: File) => void;
  }
}

/**
 * 上传广告图
 */
async function uploadFile({
  file,
  onError,
  onProgress,
  onSuccess,
}: CommonApi.UploadFileParams) {
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

export { uploadFile };
