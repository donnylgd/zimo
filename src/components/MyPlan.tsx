import React, { useState } from 'react';
import { CreditCard, Gift, CheckCircle2, Zap, ShieldCheck, ArrowRight, Loader2, Plus, X, Info, Download, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';
import { ToastType, Modal } from './Shared';
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
  const [showAddonModal, setShowAddonModal] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [selectedOS, setSelectedOS] = useState<'windows' | 'macos' | null>(null);
  const [selectedChip, setSelectedChip] = useState<'intel' | 'apple' | null>(null);
  const [showChipHelp, setShowChipHelp] = useState(false);

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
      subtitle: t.my_plan.plans.basic.subtitle,
      price: t.my_plan.basic_price,
      period: t.my_plan.period,
      quota: t.my_plan.plans.basic.quota,
      features: t.my_plan.plans.basic.features,
      recommended: false,
    },
    {
      id: 'pro',
      name: t.my_plan.plans.pro.name,
      subtitle: t.my_plan.plans.pro.subtitle,
      price: t.my_plan.pro_price,
      period: t.my_plan.period,
      quota: t.my_plan.plans.pro.quota,
      features: t.my_plan.plans.pro.features,
      recommended: true,
    },
    {
      id: 'enterprise',
      name: t.my_plan.plans.enterprise.name,
      subtitle: t.my_plan.plans.enterprise.subtitle,
      price: t.my_plan.enterprise_price,
      period: t.my_plan.period,
      quota: t.my_plan.plans.enterprise.quota,
      features: t.my_plan.plans.enterprise.features,
      recommended: false,
    }
  ];

  const isPro = user.plan === 'pro';
  const isBasic = user.plan === 'basic';
  const isEnterprise = user.plan === 'enterprise';

  const renderFeatureWithTag = (text: string) => {
    const tags = [
      { key: '特权：', enKey: 'Privilege: ', color: 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20' },
      { key: '性能：', enKey: 'Performance: ', color: 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20' },
      { key: '服务：', enKey: 'Service: ', color: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' }
    ];

    let label = '';
    let content = text;
    let tagColor = '';

    for (const tag of tags) {
      if (text.startsWith(tag.key) || text.startsWith(tag.enKey)) {
        label = text.startsWith(tag.key) ? tag.key.replace('：', '') : tag.enKey.replace(': ', '');
        content = text.startsWith(tag.key) ? text.replace(tag.key, '') : text.replace(tag.enKey, '');
        tagColor = tag.color;
        break;
      }
    }

    if (label) {
      return (
        <div className="flex items-center gap-2">
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${tagColor} shrink-0`}>
            {label}
          </span>
          <span>{content}</span>
        </div>
      );
    }

    return <span>{text}</span>;
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{t.my_plan.title}</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">{t.my_plan.subtitle}</p>
        </div>
      </div>

      {/* Current Status Section - Full Width Top */}
      <div className="bg-slate-900 dark:bg-slate-800 rounded-3xl p-8 text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden border border-white/5 group">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-500">
          <ShieldCheck size={240} className="text-white" />
        </div>
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 text-indigo-400 mb-2">
                <CreditCard size={16} />
                <span className="text-xs font-bold uppercase tracking-[0.2em]">{t.my_plan.current}</span>
              </div>
              <h3 className="text-4xl font-black tracking-tight flex items-center gap-3">
                {user.plan === 'free' ? t.user.plans.free : user.plan === 'basic' ? t.user.plans.basic : user.plan === 'pro' ? t.user.plans.pro : t.user.plans.enterprise}
                <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-bold uppercase tracking-widest text-slate-400 border border-white/10">
                  Active
                </span>
              </h3>
            </div>
            {user.expireDate && (
              <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {t.my_plan.expire.replace('{date}', user.expireDate)}
              </div>
            )}
          </div>

          <div className="flex-1 max-w-2xl w-full">
            <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-md border border-white/10 space-y-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Zap size={12} className="text-amber-400" />
                    {t.my_plan.remaining}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-white tabular-nums tracking-tighter">
                      {user.quota}
                    </span>
                    <span className="text-lg text-slate-500 font-bold">
                      / {isBasic ? '800' : isPro ? '3000' : isEnterprise ? '10000' : '500'} {t.my_plan.unit}
                    </span>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className="text-2xl font-black text-indigo-400 tabular-nums">
                    {Math.round((Number(user.quota) || 0) / (isBasic ? 800 : isPro ? 3000 : isEnterprise ? 10000 : 500) * 100)}%
                  </span>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Remaining</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-600 to-violet-500 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(79,70,229,0.4)]"
                    style={{ width: `${Math.min(100, (Number(user.quota) || 0) / (isBasic ? 800 : isPro ? 3000 : isEnterprise ? 10000 : 500) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Plans Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan) => {
          const isActive = user.plan === plan.id;
          const isDowngrade = (user.plan === 'pro' && plan.id === 'basic') || 
                              (user.plan === 'enterprise' && (plan.id === 'basic' || plan.id === 'pro'));
          
          const showDownloadEntry = plan.id === 'pro' || plan.id === 'enterprise';

          return (
            <div 
              key={plan.id}
              data-plan-id={plan.id}
              className={`relative bg-white dark:bg-slate-900 rounded-3xl border p-8 flex flex-col transition-all duration-300 ${
                isActive 
                  ? 'border-indigo-500 dark:border-indigo-500 shadow-xl shadow-indigo-500/10 ring-1 ring-indigo-500 z-10' 
                  : 'border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-200 dark:hover:border-indigo-800'
              } ${plan.recommended ? 'md:scale-105 md:-translate-y-2' : ''}`}
            >
              {plan.recommended && !isActive && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase flex items-center gap-1 shadow-lg whitespace-nowrap">
                  <Zap size={10} className="fill-white" /> {t.my_plan.recommended}
                </div>
              )}

              {isActive && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase flex items-center gap-1 shadow-lg whitespace-nowrap">
                  <CheckCircle2 size={10} /> {t.my_plan.current_plan}
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{plan.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">{plan.subtitle}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{plan.price}</span>
                  <span className="text-slate-500 dark:text-slate-400 text-xs font-bold">{plan.period}</span>
                </div>
                <div className="mt-2 text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  {plan.quota}
                </div>
              </div>

              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature: any, idx) => (
                  <li key={idx} className={`flex items-start gap-3 text-xs leading-relaxed ${feature.included ? 'text-slate-600 dark:text-slate-300 font-medium' : 'text-slate-400 dark:text-slate-500 line-through opacity-60'}`}>
                    {feature.included ? (
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 shrink-0 mt-0.5" />
                    )}
                    {renderFeatureWithTag(feature.text)}
                  </li>
                ))}
              </ul>

              {/* Secondary Entry: Download Tool */}
              {showDownloadEntry && (
                <div className="mb-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col items-center">
                  {(user.plan === 'pro' || user.plan === 'enterprise') ? (
                    <button 
                      onClick={() => setIsDownloadModalOpen(true)}
                      className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors py-2 px-4 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
                    >
                      <Download size={14} />
                      {t.my_plan.download_mass_send_tool}
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 py-2 px-4">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {t.my_plan.pro_exclusive}
                      </span>
                      <button 
                        onClick={() => {
                          const proCard = document.querySelector('[data-plan-id="pro"]');
                          proCard?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }}
                        className="text-[10px] font-bold text-indigo-500 hover:underline flex items-center gap-0.5"
                      >
                        {t.my_plan.upgrade_to_unlock}
                        <ArrowRight size={10} />
                      </button>
                    </div>
                  )}
                </div>
              )}

              <button 
                onClick={() => !isActive && !isDowngrade && onBuyPlan(plan.id)}
                disabled={isActive || isDowngrade}
                className={`w-full py-4 rounded-2xl font-bold text-sm transition-all ${
                  isActive
                    ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 cursor-default border border-emerald-100 dark:border-emerald-500/20'
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

      {/* Addon Packs Section */}
      <div className="pt-12 border-t border-slate-200 dark:border-slate-800">
        <div className="mb-8">
          <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Zap className="text-amber-500 fill-amber-500" size={24} />
            {t.my_plan.addon_modal.title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            {t.my_plan.addon_modal.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pack A */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center gap-8 group hover:border-indigo-500/30 transition-all shadow-sm">
            <div className="flex-1">
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{t.my_plan.addon_modal.pack_a.name}</h4>
              <div className="text-indigo-600 dark:text-indigo-400 font-black text-2xl mb-4">
                {t.my_plan.addon_modal.pack_a.quota}
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
                {t.my_plan.addon_modal.pack_a.desc}
              </p>
            </div>
            
            <div className="text-center md:text-right space-y-4 min-w-[140px]">
              <div className="text-3xl font-black text-slate-900 dark:text-white">{t.my_plan.addon_modal.pack_a.price}</div>
              <button 
                onClick={() => setToast({ message: t.my_plan.addon_modal.success_toast, type: 'success' })}
                className="w-full py-3 px-6 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl font-bold text-sm transition-all active:scale-95 whitespace-nowrap"
              >
                {t.my_plan.addon_modal.pack_a.btn}
              </button>
            </div>
          </div>

          {/* Pack B */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border-2 border-indigo-500/20 flex flex-col md:flex-row items-center gap-8 relative group hover:border-indigo-500/50 transition-all shadow-sm">
            <div className="absolute -top-3 left-8 bg-indigo-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-indigo-500/20">
              {t.my_plan.addon_modal.pack_b.badge}
            </div>
            
            <div className="flex-1">
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{t.my_plan.addon_modal.pack_b.name}</h4>
              <div className="text-indigo-600 dark:text-indigo-400 font-black text-2xl mb-4">
                {t.my_plan.addon_modal.pack_b.quota}
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
                {t.my_plan.addon_modal.pack_b.desc}
              </p>
            </div>
            
            <div className="text-center md:text-right space-y-4 min-w-[140px]">
              <div className="text-3xl font-black text-slate-900 dark:text-white">{t.my_plan.addon_modal.pack_b.price}</div>
              <button 
                onClick={() => setToast({ message: t.my_plan.addon_modal.success_toast, type: 'success' })}
                className="w-full py-3 px-6 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl font-bold text-sm transition-all active:scale-95 whitespace-nowrap"
              >
                {t.my_plan.addon_modal.pack_b.btn}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Redeem Code Section - Moved to Bottom and Weakened */}
      <div className="pt-12 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 mb-2">
            <Gift size={20} className="text-indigo-500" />
            <h3 className="font-bold text-lg">{t.my_plan.redeem}</h3>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{t.my_plan.redeem_desc}</p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <input 
              type="text" 
              placeholder={t.my_plan.redeem_placeholder}
              value={promoCode}
              onChange={e => setPromoCode(e.target.value)}
              className="flex-1 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all uppercase font-mono tracking-wider"
            />
            <button 
              onClick={handleRedeem}
              disabled={!promoCode.trim() || isRedeeming}
              className={`px-8 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                !promoCode.trim() || isRedeeming
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 active:scale-[0.98]'
              }`}
            >
              {isRedeeming ? <Loader2 size={18} className="animate-spin" /> : t.my_plan.redeem_btn}
            </button>
          </div>
        </div>
      </div>

      {/* Download Modal */}
      <Modal 
        isOpen={isDownloadModalOpen} 
        onClose={() => setIsDownloadModalOpen(false)} 
        title={t.my_plan.download_modal_title}
        width="max-w-lg"
      >
        <div className="space-y-8">
          {/* Header Description */}
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {t.my_plan.download_modal_subtitle}
            </p>
          </div>

          {/* Status Badge */}
          <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl border border-emerald-100 dark:border-emerald-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-emerald-500 shadow-sm">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{t.my_plan.unlocked}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">{t.my_plan.download_status_unlocked}</p>
              </div>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          {/* Features List */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.my_plan.current_benefits}</h4>
            <ul className="space-y-3">
              {t.my_plan.download_features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <CheckCircle2 size={16} className="text-indigo-500 shrink-0 mt-0.5" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Download Area */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-900 dark:text-white">{t.my_plan.download_version}</p>
                <p className="text-xs text-slate-500">{t.my_plan.download_update_date}</p>
              </div>
            </div>

            {/* OS Selection */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.my_plan.download_os_label}</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setSelectedOS('windows');
                    setSelectedChip(null);
                  }}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all font-medium ${
                    selectedOS === 'windows'
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700'
                  }`}
                >
                  {t.my_plan.download_os_windows}
                </button>
                <button
                  onClick={() => setSelectedOS('macos')}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all font-medium ${
                    selectedOS === 'macos'
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700'
                  }`}
                >
                  {t.my_plan.download_os_macos}
                </button>
              </div>
            </div>

            {/* Chip Selection (macOS only) */}
            <AnimatePresence>
              {selectedOS === 'macos' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.my_plan.download_chip_label}</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setSelectedChip('intel')}
                        className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all font-medium text-sm ${
                          selectedChip === 'intel'
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700'
                        }`}
                      >
                        {t.my_plan.download_chip_intel}
                      </button>
                      <button
                        onClick={() => setSelectedChip('apple')}
                        className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all font-medium text-sm ${
                          selectedChip === 'apple'
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700'
                        }`}
                      >
                        {t.my_plan.download_chip_apple}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      {t.my_plan.download_chip_hint}
                    </p>
                    <button 
                      onClick={() => setShowChipHelp(true)}
                      className="text-[10px] font-bold text-indigo-500 hover:text-indigo-600 transition-colors flex items-center gap-1"
                    >
                      <Info size={10} /> {t.my_plan.download_chip_help_btn}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              disabled={!selectedOS || (selectedOS === 'macos' && !selectedChip)}
              onClick={() => {
                setToast({ message: t.my_plan.download_demo_notice, type: 'info' });
              }}
              className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 group ${
                (!selectedOS || (selectedOS === 'macos' && !selectedChip))
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-700'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/20'
              }`}
            >
              <Download size={20} className={(!selectedOS || (selectedOS === 'macos' && !selectedChip)) ? '' : 'group-hover:translate-y-0.5 transition-transform'} />
              {!selectedOS 
                ? t.my_plan.download_btn_select 
                : selectedOS === 'windows' 
                  ? t.my_plan.download_btn_win 
                  : !selectedChip 
                    ? t.my_plan.download_btn_select 
                    : selectedChip === 'intel' 
                      ? t.my_plan.download_btn_mac_intel 
                      : t.my_plan.download_btn_mac_apple
              }
            </button>
          </div>

          {/* Footer Links */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-slate-400 font-medium italic">
                * {t.my_plan.download_demo_notice}
              </p>
              <div className="flex items-center gap-4">
                <button className="text-[10px] font-bold text-slate-500 hover:text-indigo-500 transition-colors flex items-center gap-1">
                  <Info size={10} /> {t.my_plan.download_footer_links.install}
                </button>
                <button className="text-[10px] font-bold text-slate-500 hover:text-indigo-500 transition-colors flex items-center gap-1">
                  <ExternalLink size={10} /> {t.my_plan.download_footer_links.tutorial}
                </button>
              </div>
            </div>
          </div>

          {/* Chip Help Modal (Simple) */}
          <Modal
            isOpen={showChipHelp}
            onClose={() => setShowChipHelp(false)}
            title={t.my_plan.download_chip_help_title}
            width="max-w-sm"
          >
            <div className="space-y-4 py-2">
              <div className="space-y-3">
                {t.my_plan.download_chip_help_steps.map((step, idx) => (
                  <p key={idx} className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {step}
                  </p>
                ))}
              </div>
              <button
                onClick={() => setShowChipHelp(false)}
                className="w-full py-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                {t.common.confirm}
              </button>
            </div>
          </Modal>
        </div>
      </Modal>
    </div>
  );
};
