import axios from 'axios';

/**
 * API 响应基础接口
 * 
 * @template T 响应数据的类型
 */
export interface ApiResponse<T> {
  code: number; // 业务状态码，200 表示成功
  message: string; // 响应消息
  data: T; // 响应核心数据
}

/**
 * AI 生成邮件标题请求参数
 * 
 * 用于根据业务阶段、品牌规模等背景信息，请求 AI 生成吸引人的邮件标题。
 */
export interface GenerateSubjectRequest {
  stage: 'initial' | 'details' | 'tracking'; // 业务阶段
  brandSize: 'small' | 'large'; // 品牌规模
  brandName?: string; // 品牌名称
  productName?: string; // 产品名称
  genLanguage?: 'en' | 'es' | 'pt'; // 生成语言
}

/**
 * AI 优化产品卖点请求参数
 * 
 * 用于请求 AI 对原始的产品卖点描述进行润色和优化。
 */
export interface OptimizeSellingPointsRequest {
  stage: 'initial' | 'details' | 'tracking'; // 业务阶段
  sellingPoints: string; // 原始卖点描述
  productName?: string; // 产品名称
  genLanguage?: 'en' | 'es' | 'pt'; // 生成语言
}

/**
 * 创建生成任务请求参数
 * 
 * 包含导入模式、达人信息以及完整的生成配置。
 */
export interface CreateTaskRequest {
  importMode: 'single' | 'batch'; // 导入模式：单条或批量
  singleCreator?: { // 单条模式下的达人信息
    name: string;
    email: string;
    followers: string;
    profileUrl?: string;
  };
  // 批量模式下通常是先上传文件获取文件ID或路径，这里简化为传递配置
  config: {
    stage: 'initial' | 'details' | 'tracking'; // 业务阶段
    brandSize: 'small' | 'large'; // 品牌规模
    brandName: string; // 品牌名称
    subject: string; // 邮件标题
    productName: string; // 产品名称
    sellingPoints: string; // 产品卖点
    tone: string; // 语气
    enableFirstSentenceStrategy: boolean; // 是否开启深度思考策略
    firstSentenceValues?: string[]; // 价值点
    valuePointsKeywords?: Record<string, string>; // 价值点关键词
    commissionRate?: string; // 佣金比例
    freeSampleThreshold?: string; // 免费样品门槛
    collabNotes?: string; // 合作备注
    packageContent?: string; // 包裹内容
    trackingNumber?: string; // 物流单号
    carrier?: string; // 承运商
    additionalNotes?: string; // 额外说明
    genLanguage?: 'en' | 'es' | 'pt'; // 生成语言
  };
}

/**
 * 任务创建响应数据
 */
export interface CreateTaskResponse {
  taskId: string; // 任务唯一 ID
  status: 'queued' | 'processing' | 'partial' | 'completed' | 'failed'; // 任务初始状态
}

// 创建 axios 实例，配置基础路径和超时时间
const api = axios.create({
  baseURL: '/api', // 后端接口基础路径
  timeout: 30000,   // 请求超时时间（30秒）
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器：在发送请求前统一注入认证 Token
api.interceptors.request.use(
  (config) => {
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

// 响应拦截器：统一提取响应数据并处理异常
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // 统一处理 API 错误，输出到控制台
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * AI 服务接口集合
 */
export const aiService = {
  /**
   * 请求 AI 推荐邮件标题
   * 
   * @param params 请求参数
   * @returns 包含生成的标题字符串的 Promise
   */
  generateSubject: (params: GenerateSubjectRequest): Promise<ApiResponse<{ subject: string }>> => {
    return api.post('/ai/generate-subject', params);
  },

  /**
   * 请求 AI 优化产品卖点
   * 
   * @param params 请求参数
   * @returns 包含优化后的卖点字符串的 Promise
   */
  optimizeSellingPoints: (params: OptimizeSellingPointsRequest): Promise<ApiResponse<{ optimizedPoints: string }>> => {
    return api.post('/ai/optimize-selling-points', params);
  },
};

/**
 * 任务服务接口集合
 */
export const taskService = {
  /**
   * 创建并开始异步生成任务
   * 
   * @param params 任务创建参数
   * @returns 包含任务 ID 的 Promise
   */
  createTask: (params: CreateTaskRequest): Promise<ApiResponse<CreateTaskResponse>> => {
    return api.post('/tasks/create', params);
  },
};

export default api;
