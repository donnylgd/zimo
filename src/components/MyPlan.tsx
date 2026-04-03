import React, { useState } from 'react';
import { CreditCard, Gift, CheckCircle2, Zap, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { UserProfile } from '../types';
import { ToastType } from './Shared';
import { Translations } from '../i18n';

interface MyPlanProps {
  user: UserProfile;
  onBuyPlan: (planId: string) => void;
  onRedeemCode: (code: string) => void;
  onViewTransactions: () => void;
  setToast: (toast: { message: string, type: ToastType } | null) => void;
  t: Translations;
}

/**
 * 我的套餐组件
 * 展示用户当前套餐状态、配额使用情况，并提供升级套餐和兑换码功能
 */
export const MyPlan = ({ user, onBuyPlan, onRedeemCode, onViewTransactions, setToast, t }: MyPlanProps) => {
  const [promoCode, setPromoCode] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);

  /**
   * 处理兑换码逻辑
   */
  const handleRedeem = () => {
    if (!promoCode.trim()) return;
    setIsRedeeming(true);
    // Simulate API call
    setTimeout(() => {
      setIsRedeeming(false);
      if (promoCode === 'ZIMO2024') {
        onRedeemCode(promoCode);
        setPromoCode('');
      } else {
        setToast({ message: t.common.error_redeem, type: 'error' });
      }
    }, 1000);
  };

  const plans = [
    {
      id: 'basic',
      name: t.my_plan.plans.basic.name,
      price: t.my_plan.basic_price,
      period: t.my_plan.period,
      quota: t.my_plan.plans.basic.quota,
      features: t.my_plan.plans.basic.features,
      recommended: false,
    },
    {
      id: 'pro',
      name: t.my_plan.plans.pro.name,
      price: t.my_plan.pro_price,
      period: t.my_plan.period,
      quota: t.my_plan.plans.pro.quota,
      features: t.my_plan.plans.pro.features,
      recommended: true,
    }
  ];

  const isPro = user.plan === 'pro';
  const isBasic = user.plan === 'basic';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{t.my_plan.title}</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">{t.my_plan.subtitle}</p>
        </div>
        <button 
          onClick={onViewTransactions}
          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium text-sm flex items-center gap-1 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-lg transition-colors"
        >
          {t.my_plan.transactions} <ArrowRight size={16} />
        </button>
      </div>

      {/* Current Status Section - Full Width Top */}
      <div className="bg-slate-900 dark:bg-slate-800 rounded-3xl p-8 text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden border border-white/5">
        <div className="absolute top-0 right-0 p-12 opacity-5">
          <ShieldCheck size={240} className="text-white" />
        </div>
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center">
          <div>
            <div className="flex items-center gap-2 text-indigo-300 mb-2">
              <CreditCard size={18} />
              <span className="text-sm font-semibold uppercase tracking-wider">{t.my_plan.current}</span>
            </div>
            <h3 className="text-4xl font-black tracking-tight">
              {user.plan === 'free' ? t.user.plans.free : user.plan === 'basic' ? t.user.plans.basic : t.user.plans.pro}
            </h3>
            {user.expireDate && (
              <p className="text-slate-400 text-sm mt-2 font-medium">{t.my_plan.expire.replace('{date}', user.expireDate)}</p>
            )}
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-md border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">
                  {isPro ? t.my_plan.remaining_unlimited : t.my_plan.remaining}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-white tabular-nums">
                    {isPro ? t.my_plan.unlimited : (user.quota === 'unlimited' ? t.my_plan.unlimited : user.quota)}
                  </span>
                  {!isPro && user.quota !== 'unlimited' && (
                    <span className="text-lg text-slate-400 font-bold">/ 5,000 {t.my_plan.unit}</span>
                  )}
                  {isPro && (
                    <span className="text-indigo-400 text-sm font-bold bg-indigo-500/20 px-2 py-0.5 rounded ml-2">
                      {t.my_plan.plans.pro.quota}
                    </span>
                  )}
                </div>
              </div>
              
              {!isPro && (
                <div className="flex-1 max-w-xs hidden md:block">
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min(100, (Number(user.quota) || 0) / 5000 * 100)}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2 text-right font-bold uppercase tracking-widest">
                    {Math.round((Number(user.quota) || 0) / 5000 * 100)}% {t.user.quota}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Redeem Code Card */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm h-full flex flex-col">
            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 mb-4">
              <Gift size={20} className="text-indigo-500" />
              <h3 className="font-bold text-base">{t.my_plan.redeem}</h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">{t.my_plan.redeem_desc}</p>
            <div className="space-y-3 mt-auto">
              <input 
                type="text" 
                placeholder={t.my_plan.redeem_placeholder}
                value={promoCode}
                onChange={e => setPromoCode(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all uppercase font-mono tracking-wider"
              />
              <button 
                onClick={handleRedeem}
                disabled={!promoCode.trim() || isRedeeming}
                className="w-full bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 text-white px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center shadow-lg shadow-indigo-500/10"
              >
                {isRedeeming ? <Loader2 size={18} className="animate-spin" /> : t.my_plan.redeem_btn}
              </button>
            </div>
          </div>
        </div>

        {/* Plans Comparison */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((plan) => {
            const isActive = user.plan === plan.id;
            const canUpgrade = user.plan === 'free' || (user.plan === 'basic' && plan.id === 'pro');
            const isDowngrade = user.plan === 'pro' && plan.id === 'basic';

            return (
              <div 
                key={plan.id}
                className={`relative bg-white dark:bg-slate-900 rounded-2xl border p-8 flex flex-col transition-all ${
                  isActive 
                    ? 'border-indigo-500 dark:border-indigo-500 shadow-xl shadow-indigo-500/10 ring-1 ring-indigo-500' 
                    : 'border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-200 dark:hover:border-indigo-800'
                } ${isDowngrade ? 'opacity-60 grayscale-[0.5]' : ''}`}
              >
                {plan.recommended && !isActive && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase flex items-center gap-1 shadow-lg">
                    <Zap size={10} className="fill-white" /> {t.my_plan.recommended}
                  </div>
                )}

                {isActive && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase flex items-center gap-1 shadow-lg">
                    <CheckCircle2 size={10} /> {t.my_plan.current_plan}
                  </div>
                )}
                
                <div className="mb-8">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{plan.price}</span>
                    <span className="text-slate-500 dark:text-slate-400 text-sm font-bold">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-10 flex-1">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                      <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => !isActive && !isDowngrade && onBuyPlan(plan.id)}
                  disabled={isActive || isDowngrade}
                  className={`w-full py-4 rounded-2xl font-bold text-sm transition-all ${
                    isActive
                      ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 cursor-default'
                      : isDowngrade
                      ? 'bg-slate-50 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                      : plan.recommended
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/20'
                      : 'bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white'
                  }`}
                >
                  {isActive ? t.my_plan.current_plan : isDowngrade ? t.my_plan.downgrade_disabled : t.my_plan.upgrade_now}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
