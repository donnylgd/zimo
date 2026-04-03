import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Sparkles, X, Smartphone, AlertTriangle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

/**
 * 轻提示组件
 * 用于显示操作成功、失败或提示信息
 */
export const Toast = ({ message, type = 'success', onClose }: { message: string, type?: ToastType, onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20',
    error: 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20',
    warning: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20',
    info: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20'
  };
  
  const icons = {
    success: CheckCircle2,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info
  };

  const Icon = icons[type];

  return (
    <div className="fixed top-6 left-0 right-0 flex justify-center pointer-events-none z-[100]">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`px-4 py-3 rounded-xl border shadow-lg flex items-center gap-3 backdrop-blur-md min-w-[240px] max-w-md pointer-events-auto ${styles[type]}`}
      >
        <div className="flex-shrink-0">
          <Icon size={18} strokeWidth={2.5} />
        </div>
        <span className="font-medium text-sm leading-tight flex-grow">{message}</span>
        <button onClick={onClose} className="opacity-40 hover:opacity-100 transition-opacity">
          <X size={14} />
        </button>
      </motion.div>
    </div>
  );
};

/**
 * 模态框组件
 * 用于展示弹窗内容，支持自定义标题和宽度
 */
export const Modal = ({ isOpen, onClose, title, children, width = 'max-w-md' }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode, width?: string }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className={`bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full ${width} overflow-hidden animate-in zoom-in-95 duration-200 border dark:border-slate-800`} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

/**
 * 移动端提示组件
 * 当检测到移动端访问时，提示用户切换至桌面端以获得最佳体验
 */
export const MobilePrompt = ({ t }: { t: any }) => (
  <div className="h-screen w-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-6 text-center md:hidden transition-colors duration-200">
    <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6">
      <Smartphone size={32} />
    </div>
    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">{t.common.mobile_title}</h2>
    <p className="text-slate-500 dark:text-slate-400 mb-8">{t.common.mobile_desc}</p>
    <div className="bg-white dark:bg-slate-800 px-6 py-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm font-mono text-sm text-slate-600 dark:text-slate-300">
      zimo-pigeon.com
    </div>
  </div>
);
