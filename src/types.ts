export type ViewState = 'workspace' | 'history' | 'task_detail' | 'my_plan' | 'transactions' | 'mass_send' | 'account' | 'design_system' | 'promotion_center' | 'distribution_config' | 'commission_audit' | 'invite_history' | 'reward_history' | 'alipay_info' | 'referral_dashboard' | 'promotion_apply' | 'promotion_pending' | 'promotion_rejected' | 'promotion_form';
export type PromotionStatus = 'none' | 'pending' | 'approved' | 'rejected';
export type UploadState = 'idle' | 'parsing' | 'success' | 'format_error' | 'header_error' | 'quota_error' | 'empty_file' | 'partial_error' | 'parsing_failed';
export type TaskStatus = 'processing' | 'completed' | 'failed';
export type PaymentState = 'waiting' | 'success' | 'failed' | 'expired';

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  quota: number | 'unlimited';
  usedQuota: number;
  plan: 'free' | 'basic' | 'pro';
  expireDate?: string;
  planStartDate?: string;
  registerDate: string;
  lastLoginDate: string;
  loginMethod: 'phone';
  phone?: string;
  email?: string;
  hasPassword?: boolean;
}
