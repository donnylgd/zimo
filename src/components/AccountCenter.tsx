import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  CreditCard, 
  ShieldCheck, 
  Smartphone, 
  Mail, 
  History, 
  LogOut, 
  Copy, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  Clock,
  Calendar,
  Wallet,
  X,
  Loader2,
  Share2,
  TrendingUp
} from 'lucide-react';
import { UserProfile } from '../types';
import { Translations } from '../i18n';
import { ToastType } from './Shared';

interface AccountCenterProps {
  user: UserProfile;
  onLogout: () => void;
  onViewHistory: () => void;
  onViewPlan: () => void;
  onViewTransactions: () => void;
  onUpdateUser: (updates: Partial<UserProfile>) => void;
  onSetPassword: () => void;
  onChangePassword: () => void;
  onBindEmail: () => void;
  onViewPromotion: () => void;
  setToast: (toast: { message: string, type: ToastType } | null) => void;
  t: Translations;
}

/**
 * 个人中心组件
 * 展示用户信息、资产信息和账号绑定信息
 */
export const AccountCenter = ({ 
  user, 
  onLogout, 
  onViewHistory, 
  onViewPlan, 
  onViewTransactions,
  onUpdateUser,
  onSetPassword,
  onChangePassword,
  onBindEmail,
  onViewPromotion,
  setToast,
  t 
}: AccountCenterProps) => {
  const [copied, setCopied] = useState(false);
  const [showBindModal, setShowBindModal] = useState<'phone' | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [codeValue, setCodeValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isBinding, setIsBinding] = useState(false);
  const [countdown, setCountdown] = useState(0);

  /**
   * 处理复制用户ID逻辑
   */
  const handleCopyId = () => {
    navigator.clipboard.writeText(user.id);
    setCopied(true);
    setToast({ message: t.common.success_copy, type: 'success' });
    setTimeout(() => setCopied(false), 2000);
  };

  /**
   * 处理发送验证码逻辑
   */
  const handleSendCode = () => {
    if (!inputValue) return;
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 1000);
  };

  /**
   * 处理绑定逻辑
   */
  const handleBind = () => {
    if (!inputValue || !codeValue) return;
    setIsBinding(true);
    setTimeout(() => {
      setIsBinding(false);
      onUpdateUser({ phone: inputValue });
      setShowBindModal(null);
      setInputValue('');
      setCodeValue('');
      setToast({ message: t.common.success_bind, type: 'success' });
    }, 1500);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 pb-12"
    >
      {/* 头部 */}
      <div className="flex flex-col gap-1 mb-2">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{t.account.title}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">{t.account.title}</p>
      </div>

      {/* 1. 基础身份信息卡片 */}
      <motion.div 
        variants={itemVariants}
        className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/50 p-6 md:p-8 shadow-sm overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
          <User size={160} />
        </div>
        
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 relative z-10">
          {/* 头像 */}
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-md">
              <img src={user.avatar} alt="avatar" className="w-full h-full rounded-full" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white dark:bg-slate-700 rounded-full shadow-sm flex items-center justify-center border border-slate-100 dark:border-slate-600">
              <ShieldCheck size={16} className="text-indigo-500" />
            </div>
          </div>

          {/* 信息 */}
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{user.name}</h3>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                user.plan === 'enterprise'
                  ? 'bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400'
                  : user.plan === 'pro' 
                    ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400' 
                    : user.plan === 'basic'
                      ? 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
              }`}>
                {user.plan === 'free' ? t.user.plans.free : user.plan === 'basic' ? t.user.plans.basic : user.plan === 'pro' ? t.user.plans.pro : t.user.plans.enterprise}
              </span>
            </div>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-y-2 gap-x-4 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900/50 px-2 py-1 rounded-lg border border-slate-100 dark:border-slate-700/50">
                <span className="text-xs font-medium opacity-70">{t.account.user_id}:</span>
                <span className="font-mono text-xs">{user.id}</span>
                <button 
                  onClick={handleCopyId}
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                  title={t.account.copy_id}
                >
                  {copied ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Copy size={12} />}
                </button>
              </div>
              <div className="flex items-center gap-1.5">
                <Smartphone size={14} className="opacity-70" />
                <span>{t.account.login_method}: {t.account.phone_login}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mt-6 pt-6 border-t border-slate-50 dark:border-slate-700/50 w-full">
              <div className="flex items-center gap-2 text-xs">
                <Calendar size={14} className="text-slate-400" />
                <span className="text-slate-400">{t.account.register_date}:</span>
                <span className="text-slate-600 dark:text-slate-300">{user.registerDate}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Clock size={14} className="text-slate-400" />
                <span className="text-slate-400">{t.account.last_login}:</span>
                <span className="text-slate-600 dark:text-slate-300">{user.lastLoginDate}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 2. 账户资产信息卡片 */}
        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/50 p-6 shadow-sm flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
                <Wallet size={18} className="text-indigo-500" />
              </div>
              <h4 className="font-bold text-slate-800 dark:text-white">{t.account.asset_info}</h4>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/50">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{t.account.remaining_quota}</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {user.quota.toLocaleString()}
                <span className="text-xs font-normal text-slate-500 ml-1">{t.user.unit}</span>
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/50">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{t.account.used_quota}</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {user.usedQuota.toLocaleString()}
                <span className="text-xs font-normal text-slate-500 ml-1">{t.user.unit}</span>
              </p>
            </div>
          </div>

          <div className="space-y-4 flex-1">
            <div className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-slate-700/30">
              <div className="flex flex-col">
                <span className="text-sm text-slate-500 dark:text-slate-400">{t.account.current_plan}</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                  {user.plan === 'free' ? t.account.plan_free_desc : t.account.plan_paid_desc}
                </span>
              </div>
              <span className={`text-sm font-bold ${
                user.plan === 'enterprise' ? 'text-violet-600 dark:text-violet-400' : user.plan === 'pro' ? 'text-indigo-500' : user.plan === 'basic' ? 'text-amber-500' : 'text-slate-800 dark:text-slate-200'
              }`}>
                {user.plan === 'free' ? t.user.plans.free : user.plan === 'basic' ? t.user.plans.basic : user.plan === 'pro' ? t.user.plans.pro : t.user.plans.enterprise}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-slate-700/30">
              <span className="text-sm text-slate-500 dark:text-slate-400">{t.account.plan_start}</span>
              <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{user.planStartDate || user.registerDate}</span>
            </div>
            {user.plan !== 'free' && user.expireDate && (
              <div className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-slate-700/30">
                <span className="text-sm text-slate-500 dark:text-slate-400">{t.account.plan_end}</span>
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{user.expireDate}</span>
              </div>
            )}
          </div>

          <div className="mt-8">
            <button 
              onClick={onViewTransactions}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <History size={14} />
              {t.my_plan.transactions}
            </button>
          </div>
        </motion.div>

        {/* 3. 账号绑定信息卡片 */}
        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/50 p-6 shadow-sm flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
                <ShieldCheck size={18} className="text-indigo-500" />
              </div>
              <h4 className="font-bold text-slate-800 dark:text-white">{t.account.binding_info}</h4>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
              {t.account.security_status}: {user.phone ? t.account.security_perfect : t.account.security_basic}
            </div>
          </div>

          <div className="space-y-4 flex-1">
            {/* 登录方式 */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                  <Smartphone size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">{t.account.login_method}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t.account.phone_login}</p>
                </div>
              </div>
              <CheckCircle2 size={18} className="text-emerald-500" />
            </div>

            {/* 登录密码 */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">{t.account.login_password}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {user.hasPassword ? t.account.password_set : t.account.password_unset}
                  </p>
                </div>
              </div>
              <button 
                onClick={user.hasPassword ? onChangePassword : onSetPassword}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                  user.hasPassword 
                    ? 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {user.hasPassword ? t.account.password_change : t.account.password_go_set}
              </button>
            </div>

            {/* 邮箱 */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">{t.account.email}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {user.email 
                      ? user.email.replace(/(.{2}).*(@.*)/, '$1****$2') 
                      : t.account.unbound}
                  </p>
                </div>
              </div>
              <button 
                onClick={onBindEmail}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                  user.email 
                    ? 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {user.email ? t.account.change_bind : t.account.go_bind}
              </button>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-500/5 border border-indigo-100/50 dark:border-indigo-500/10">
            <p className="text-xs text-indigo-600 dark:text-indigo-400 leading-relaxed">
              {t.account.email_recovery_desc}
            </p>
          </div>
        </motion.div>

        {/* 4. 推广赚钱入口卡片 */}
        <motion.div 
          variants={itemVariants}
          className="bg-indigo-600 rounded-3xl border border-indigo-500 p-6 shadow-lg shadow-indigo-500/20 flex flex-col relative overflow-hidden group cursor-pointer"
          onClick={onViewPromotion}
        >
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
            <Share2 size={120} />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <TrendingUp size={18} className="text-white" />
              </div>
              <h4 className="font-bold text-white">{t.account.promotion_center}</h4>
            </div>
            
            <p className="text-sm text-indigo-100 mb-6 leading-relaxed opacity-90">
              {t.account.promotion_desc}
            </p>

            <div className="mt-auto flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] text-indigo-200 uppercase tracking-wider font-bold">{t.account.referral_balance}</span>
                <span className="text-xl font-bold text-white">¥{(user.referralBalance || 0).toFixed(2)}</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-white text-indigo-600 flex items-center justify-center shadow-sm group-hover:translate-x-1 transition-transform">
                <ChevronRight size={20} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 绑定弹窗 */}
      <AnimatePresence>
        {showBindModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBindModal(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-800 w-full max-w-md rounded-3xl shadow-2xl relative z-10 overflow-hidden"
            >
            <div className="p-6 border-b border-slate-50 dark:border-slate-700/50 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {showBindModal === 'phone' ? t.account.bind_phone_title : t.account.bind_email_title}
              </h3>
              <button 
                onClick={() => setShowBindModal(null)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                  {showBindModal === 'phone' ? t.account.phone : t.account.email}
                </label>
                <input 
                  type={showBindModal === 'phone' ? 'tel' : 'email'}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={showBindModal === 'phone' ? t.account.phone_placeholder : t.account.email_placeholder}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                  {t.account.code_placeholder}
                </label>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={codeValue}
                    onChange={(e) => setCodeValue(e.target.value)}
                    placeholder={t.account.code_placeholder}
                    className="flex-1 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 dark:text-white"
                  />
                  <button 
                    onClick={handleSendCode}
                    disabled={isSending || countdown > 0 || !inputValue}
                    className="px-4 py-3 rounded-xl border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:bg-indigo-50 dark:hover:bg-indigo-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all min-w-[100px]"
                  >
                    {isSending ? <Loader2 size={18} className="animate-spin mx-auto" /> : countdown > 0 ? `${countdown}s` : t.account.get_code}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button 
                  onClick={handleBind}
                  disabled={isBinding || !inputValue || !codeValue}
                  className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {isBinding && <Loader2 size={18} className="animate-spin" />}
                  {t.account.bind_now}
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/50">
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {showBindModal === 'phone' ? t.account.bind_phone_desc : t.account.bind_email_desc}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      </AnimatePresence>
    </motion.div>
  );
};
