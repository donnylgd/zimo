/**
 * 页面视图状态类型
 */
export type ViewState = 'workspace' | 'history' | 'task_detail' | 'my_plan' | 'transactions' | 'mass_send' | 'account' | 'design_system' | 'promotion_center' | 'invite_history' | 'reward_history' | 'alipay_info' | 'referral_dashboard' | 'promotion_apply' | 'promotion_pending' | 'promotion_rejected' | 'promotion_form';

/**
 * 推广申请状态
 */
export type PromotionStatus = 'none' | 'pending' | 'approved' | 'rejected';

/**
 * 文件上传状态
 */
export type UploadState = 'idle' | 'parsing' | 'success' | 'format_error' | 'header_error' | 'quota_error' | 'empty_file' | 'partial_error' | 'parsing_failed';

/**
 * 任务状态
 */
export type TaskStatus = 'pending' | 'processing' | 'completed' | 'failed';

/**
 * 支付状态
 */
export type PaymentState = 'waiting' | 'success' | 'failed' | 'expired';

/**
 * 用户个人资料接口
 */
export interface UserProfile {
  id: string; // 用户ID
  name: string; // 用户名
  avatar: string; // 头像URL
  quota: number | 'unlimited'; // 剩余配额
  usedQuota: number; // 已使用配额
  plan: 'free' | 'basic' | 'pro'; // 套餐类型
  expireDate?: string; // 到期日期
  planStartDate?: string; // 套餐开始日期
  registerDate: string; // 注册日期
  lastLoginDate: string; // 最后登录日期
  loginMethod: 'phone'; // 登录方式
  phone?: string; // 手机号
  email?: string; // 邮箱
  hasPassword?: boolean; // 是否已设置密码
}
