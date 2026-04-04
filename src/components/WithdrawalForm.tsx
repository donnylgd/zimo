import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Wallet, 
  AlertCircle, 
  Loader2, 
  CheckCircle2, 
  Building2, 
  User,
  ChevronRight,
  Info
} from 'lucide-react';
import { UserProfile } from '../types';
import { Translations } from '../i18n';

interface WithdrawalFormProps {
  user: UserProfile;
  t: Translations;
  onBack: () => void;
  onSuccess: () => void;
  setToast: (toast: any) => void;
}

/**
 * 提现申请表单组件
 */
export const WithdrawalForm = ({ user, t, onBack, onSuccess, setToast }: WithdrawalFormProps) => {
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const balance = user.referralBalance || 0;
  const minAmount = 10;

  const handleSubmit = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < minAmount) {
      setToast({ message: t.account.withdraw_min_tip, type: 'warning' });
      return;
    }
    if (numAmount > balance) {
      setToast({ message: t.common.error_insufficient_balance, type: 'warning' });
      return;
    }
    if (!user.alipayAccount || !user.alipayName) {
      setToast({ message: t.promotion.alipay_required, type: 'warning' });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setToast({ message: t.account.withdraw_success, type: 'success' });
      onSuccess();
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors mb-4"
      >
        <ArrowLeft size={18} />
        <span className="text-sm font-medium">{t.common.back}</span>
      </button>

      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/50 p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Wallet size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t.account.withdraw}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t.account.referral_balance}: ¥{balance.toFixed(2)}</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* 收款信息预览 */}
          <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700/50 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.account.alipay_info}</span>
              <button 
                onClick={() => {/* Navigate to edit alipay info */}}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {t.common.edit}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400">
                  <Building2 size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase">{t.account.alipay_account}</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{user.alipayAccount || '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400">
                  <User size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase">{t.account.alipay_name}</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{user.alipayName || '-'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">{t.account.withdraw_amount}</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">¥</div>
              <input 
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-10 pr-24 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-2xl font-bold text-slate-900 dark:text-white"
              />
              <button 
                onClick={() => setAmount(balance.toString())}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
              >
                {t.common.all_withdraw}
              </button>
            </div>
            <p className="text-xs text-slate-400 ml-1">{t.account.withdraw_min_tip}</p>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/10 flex gap-3">
            <Info size={18} className="text-indigo-500 shrink-0 mt-0.5" />
            <p className="text-xs text-indigo-600 dark:text-indigo-400 leading-relaxed">
              {t.promotion.withdraw_notice}
            </p>
          </div>

          <div className="pt-4">
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting || !amount || parseFloat(amount) < minAmount}
              className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader2 size={20} className="animate-spin" />}
              {t.account.withdraw}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
