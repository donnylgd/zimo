/**
 * 全局类型定义文件
 * 
 * 包含应用程序中使用的所有核心接口、枚举和类型定义。
 */

/**
 * 页面视图状态类型
 * 
 * 定义了应用中所有可切换的页面视图。
 */
export type ViewState = 'workspace' | 'history' | 'task_detail' | 'my_plan' | 'transactions' | 'account' | 'design_system' | 'promotion_center' | 'invite_history' | 'reward_history' | 'alipay_info' | 'referral_dashboard' | 'promotion_apply' | 'promotion_pending' | 'promotion_rejected' | 'promotion_form' | 'withdrawal_form';

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
export type TaskStatus = 'queued' | 'processing' | 'partial' | 'completed' | 'failed';

/**
 * 支付状态
 */
export type PaymentState = 'waiting' | 'success' | 'failed' | 'expired';

/**
 * 用户个人资料接口
 */
export interface UserProfile {
  id: string; // 用户唯一 ID
  name: string; // 用户昵称
  avatar: string; // 用户头像 URL
  quota: number; // 剩余算力配额
  usedQuota: number; // 累计已使用算力
  plan: 'free' | 'basic' | 'pro' | 'enterprise'; // 当前套餐等级
  expireDate?: string; // 套餐到期日期
  planStartDate?: string; // 套餐生效日期
  registerDate: string; // 账户注册日期
  lastLoginDate: string; // 最近一次登录日期
  loginMethod: 'phone'; // 登录方式
  phone?: string; // 绑定手机号
  email?: string; // 绑定邮箱
  hasPassword?: boolean; // 是否已设置登录密码
  referralCode?: string; // 个人推广码
  referralBalance?: number; // 可提现激励金余额
  referralRewards?: number; // 累计获得的奖励算力
  alipayAccount?: string; // 支付宝收款账号
  alipayName?: string; // 支付宝收款人真实姓名
}

/**
 * 提现记录接口
 */
export interface WithdrawalRecord {
  id: string; // 提现单号
  amount: number; // 提现金额
  alipayAccount: string; // 提现到的支付宝账号
  alipayName: string; // 提现到的支付宝姓名
  status: 'pending' | 'approved' | 'rejected'; // 提现状态
  date: string; // 申请日期
  remark?: string; // 审核备注（如驳回原因）
}
