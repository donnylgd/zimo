import React, { useEffect } from 'react';
import { Loader2, Megaphone } from 'lucide-react';
import { motion } from 'motion/react';

import { PromotionStatus } from '../types';

interface ReferralDashboardProps {
  t: any;
  onChangeView: (view: any) => void;
  promotionStatus: PromotionStatus;
  setPromotionStatus: (status: PromotionStatus) => void;
}

/**
 * 推广仪表盘组件
 * 作为推广中心的入口，负责根据用户的推广权限状态（未申请、审核中、已通过、已驳回）进行视图跳转
 */
export const ReferralDashboard = ({ t, onChangeView, promotionStatus, setPromotionStatus }: ReferralDashboardProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      switch (promotionStatus) {
        case 'none':
          onChangeView('promotion_apply');
          break;
        case 'pending':
          onChangeView('promotion_pending');
          break;
        case 'approved':
          onChangeView('promotion_center');
          break;
        case 'rejected':
          onChangeView('promotion_rejected');
          break;
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [onChangeView, promotionStatus]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 relative">
      {/* Dev Status Selector */}
      {import.meta.env.DEV && (
        <div className="absolute top-0 right-0 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl z-50 space-y-3">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dev: 模拟权限状态</p>
          <div className="flex flex-col gap-2">
            {(['none', 'pending', 'approved', 'rejected'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setPromotionStatus(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  promotionStatus === status 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {status === 'none' && '未申请 (none)'}
                {status === 'pending' && '审核中 (pending)'}
                {status === 'approved' && '已通过 (approved)'}
                {status === 'rejected' && '已驳回 (rejected)'}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 italic">选择后将重新开始 2s 倒计时跳转</p>
        </div>
      )}

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-20 h-20 bg-indigo-100 dark:bg-indigo-500/20 rounded-3xl flex items-center justify-center text-indigo-600 dark:text-indigo-400"
      >
        <Megaphone size={40} />
      </motion.div>
      
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          {t.promotion_center.title}
        </h2>
        <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
          <Loader2 size={16} className="animate-spin" />
          <span>正在进入推广中心...</span>
        </div>
      </div>

      <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs text-center">
        正在验证您的推广权限，请稍候。系统将根据您的等级为您展示相应的推广工具。
      </p>
    </div>
  );
};
