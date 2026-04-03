import axios from 'axios';

/**
 * API 响应基础接口
 */
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

/**
 * AI 生成邮件标题请求参数
 */
export interface GenerateSubjectRequest {
  stage: 'initial' | 'details' | 'tracking';
  brandSize: 'small' | 'large';
  brandName?: string;
  productName?: string;
}

/**
 * AI 优化产品卖点请求参数
 */
export interface OptimizeSellingPointsRequest {
  stage: 'initial' | 'details' | 'tracking';
  sellingPoints: string;
  productName?: string;
}

/**
 * 创建生成任务请求参数
 */
export interface CreateTaskRequest {
  importMode: 'single' | 'batch';
  singleCreator?: {
    name: string;
    email: string;
    followers: string;
    profileUrl?: string;
  };
  // 批量模式下通常是先上传文件获取文件ID或路径，这里简化为传递配置
  config: {
    stage: 'initial' | 'details' | 'tracking';
    brandSize: 'small' | 'large';
    brandName: string;
    subject: string;
    productName: string;
    sellingPoints: string;
    tone: string;
    enableFirstSentenceStrategy: boolean;
    firstSentenceValues?: string[];
    valuePointsKeywords?: Record<string, string>;
    commissionRate?: string;
    freeSampleThreshold?: string;
    collabNotes?: string;
    packageContent?: string;
    trackingNumber?: string;
    carrier?: string;
    additionalNotes?: string;
  };
}

/**
 * 任务创建响应数据
 */
export interface CreateTaskResponse {
  taskId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

// 创建 axios 实例
const api = axios.create({
  baseURL: '/api', // 后端接口基础路径
  timeout: 30000,   // 请求超时时间
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 在这里可以添加 token 等认证信息
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // 统一处理错误
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * AI 服务接口
 */
export const aiService = {
  /**
   * AI 推荐邮件标题
   */
  generateSubject: (params: GenerateSubjectRequest): Promise<ApiResponse<{ subject: string }>> => {
    return api.post('/ai/generate-subject', params);
  },

  /**
   * AI 优化产品卖点
   */
  optimizeSellingPoints: (params: OptimizeSellingPointsRequest): Promise<ApiResponse<{ optimizedPoints: string }>> => {
    return api.post('/ai/optimize-selling-points', params);
  },
};

/**
 * 任务服务接口
 */
export const taskService = {
  /**
   * 创建并开始生成任务
   */
  createTask: (params: CreateTaskRequest): Promise<ApiResponse<CreateTaskResponse>> => {
    return api.post('/tasks/create', params);
  },
};

export default api;
