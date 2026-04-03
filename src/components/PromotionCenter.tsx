import React from 'react';
import { Megaphone, ArrowLeft, Copy, ExternalLink, Users, UserCheck, CreditCard, Coins, Clock, CheckCircle2, History, Wallet, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface PromotionCenterProps {
  t: any;
  onBack?: () => void;
  setToast?: (toast: { message: string, type: 'success' | 'error' | 'info' | 'warning' } | null) => void;
  onChangeView?: (view: any) => void;
}

/**
 * 推广中心组件
 * 审核通过后，用户查看推广数据、生成推广链接的核心页面
 */
export const PromotionCenter = ({ t, onBack, setToast, onChangeView }: PromotionCenterProps) => {
  const [isLoading, setIsLoading] = React.useState(true);
  
  // Helper to get language (hacky but works for demo)
  const language = t.promotion_center.title === '推广中心' ? 'zh' : 'en';

  const inviteCode = 'ZIMO826';
  const inviteLink = `https://zimo.ai/register?ref=${inviteCode}`;

  React.useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  /**
   * 处理复制推广链接
   * @param text 要复制的文本
   * @param type 复制类型：'code' (邀请码) 或 'link' (邀请链接)
   */
  const handleCopy = (text: string, type: 'code' | 'link') => {
    navigator.clipboard.writeText(text);
    if (setToast) {
      setToast({
        message: type === 'code' ? t.common.success_copy : t.common.success_copy,
        type: 'success'
      });
    }
  };

  const stats = [
    { label: t.promotion_center.stats.total_invited, value: '128', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
    { label: t.promotion_center.stats.total_activated, value: '96', icon: UserCheck, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
    { label: t.promotion_center.stats.total_paid, value: '42', icon: CreditCard, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
    { label: t.promotion_center.stats.total_quota, value: '500', icon: Sparkles, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10', unit: t.my_plan.unit },
    { label: t.promotion_center.stats.total_commission, value: '¥1,280.00', icon: Coins, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-500/10', highlight: true },
    { label: t.promotion_center.stats.pending_audit, value: '¥150.00', icon: Clock, color: 'text-slate-400', bg: 'bg-slate-50 dark:bg-slate-500/10' },
    { label: t.promotion_center.stats.pending_payment, value: '¥320.00', icon: Wallet, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
    { label: t.promotion_center.stats.paid_commission, value: '¥810.00', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
  ];

  const quickLinks = [
    { id: 'invite_history', label: t.promotion_center.quick_links.invite_history, icon: History, desc: language === 'zh' ? '查看已邀请的用户列表' : 'View list of invited users' },
    { id: 'reward_history', label: t.promotion_center.quick_links.reward_history, icon: Coins, desc: language === 'zh' ? '查看佣金与额度奖励明细' : 'View commission and quota details' },
    { id: 'payment_info', label: t.promotion_center.quick_links.payment_info, icon: Wallet, desc: language === 'zh' ? '设置或修改支付宝收款账号' : 'Set or modify Alipay account' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
      {/* A. Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <button 
              onClick={onBack}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Megaphone className="text-indigo-500" size={24} />
              {t.promotion_center.title}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              {t.promotion_center.desc}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* B. Invitation Tools Section */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">
              {language === 'zh' ? '邀请工具' : 'Invite Tools'}
            </h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500">{t.promotion_center.invite_code}</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 font-mono text-lg font-bold text-indigo-600 dark:text-indigo-400">
                    {inviteCode}
                  </div>
                  <button 
                    onClick={() => handleCopy(inviteCode, 'code')}
                    className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-400"
                    title={t.promotion_center.copy_code}
                  >
                    <Copy size={20} />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500">{t.promotion_center.invite_link}</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-600 dark:text-slate-400 truncate">
                    {inviteLink}
                  </div>
                  <button 
                    onClick={() => handleCopy(inviteLink, 'link')}
                    className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-400"
                    title={t.promotion_center.copy_link}
                  >
                    <Copy size={20} />
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2">
                  <ExternalLink size={18} />
                  {language === 'zh' ? '立即分享' : 'Share Now'}
                </button>
              </div>
            </div>
          </div>

          {/* D. Quick Links Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider px-1">
              {language === 'zh' ? '快捷入口' : 'Quick Links'}
            </h3>
            {quickLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  if (link.id === 'invite_history' || link.id === 'reward_history' || link.id === 'payment_info') {
                    const viewMap: Record<string, any> = {
                      'invite_history': 'invite_history',
                      'reward_history': 'reward_history',
                      'payment_info': 'alipay_info'
                    };
                    onChangeView?.(viewMap[link.id]);
                  } else if (setToast) {
                    setToast({ message: t.mass_send.coming_soon, type: 'info' });
                  }
                }}
                className="w-full flex items-center gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-indigo-500/50 hover:shadow-md transition-all group text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-indigo-500 transition-colors">
                  <link.icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{link.label}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{link.desc}</p>
                </div>
                <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
              </button>
            ))}
          </div>
        </div>

        {/* C. Data Overview Section */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 animate-pulse">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 mb-4" />
                  <div className="h-3 w-24 bg-slate-100 dark:bg-slate-800 rounded mb-2" />
                  <div className="h-6 w-32 bg-slate-100 dark:bg-slate-800 rounded" />
                </div>
              ))
            ) : stats.length > 0 ? (
              stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-6 rounded-2xl border transition-all ${
                    stat.highlight 
                      ? 'bg-indigo-600 border-indigo-500 shadow-lg shadow-indigo-500/20' 
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      stat.highlight ? 'bg-white/20 text-white' : `${stat.bg} ${stat.color}`
                    }`}>
                      <stat.icon size={20} />
                    </div>
                  </div>
                  <div>
                    <p className={`text-xs font-medium mb-1 ${
                      stat.highlight ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'
                    }`}>
                      {stat.label}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-2xl font-bold ${
                        stat.highlight ? 'text-white' : 'text-slate-900 dark:text-white'
                      }`}>
                        {stat.value}
                      </span>
                      {stat.unit && (
                        <span className={`text-xs ${
                          stat.highlight ? 'text-indigo-200' : 'text-slate-400'
                        }`}>
                          {stat.unit}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full p-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <Megaphone size={32} className="text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{t.common.empty_promotion_title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs">{t.common.empty_promotion_desc}</p>
              </div>
            )}
          </div>

          {/* Empty State Reference (Small Card) */}
          {!isLoading && stats.length > 0 && (
            <div className="mt-8 p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center opacity-50">
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3">
                <History size={24} className="text-slate-400" />
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {language === 'zh' ? '暂无详细邀请明细' : 'No detailed invitation records'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Sparkles = ({ size, className }: { size?: number, className?: string }) => (
  <svg 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4" />
    <path d="M19 17v4" />
    <path d="M3 5h4" />
    <path d="M17 19h4" />
  </svg>
);
