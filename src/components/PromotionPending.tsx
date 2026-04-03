import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, FileSearch, ShieldCheck, Info, CheckCircle2 } from 'lucide-react';

interface PromotionPendingProps {
  t: any;
  onBack: () => void;
}

export const PromotionPending = ({ t, onBack }: PromotionPendingProps) => {
  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">申请已提交</h1>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        {/* A. Status Section */}
        <div className="p-12 text-center border-b border-slate-100 dark:border-slate-800 space-y-6">
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto">
              <CheckCircle2 size={48} />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-900">
              <Clock size={16} className="text-white animate-spin-slow" />
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full text-xs font-bold border border-amber-100 dark:border-amber-500/20">
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
              审核中
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">您的推广权限申请已提交成功</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto text-sm leading-relaxed">
              我们会根据您提交的信息进行人工审核。审核通过后将为您开通正式推广功能，届时您可访问完整的推广中心。
            </p>
          </div>
        </div>

        {/* B. Hint Section */}
        <div className="bg-slate-50/50 dark:bg-slate-800/30 p-8 space-y-4">
          <div className="flex items-start gap-4">
            <div className="mt-1 p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400">
              <Info size={16} />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">审核说明</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                后台管理人员将在 1-3 个工作日内完成审核。审核结果将通过系统通知告知您，请您耐心等待。在此期间，您可以继续使用工作台的其他功能。
              </p>
            </div>
          </div>
        </div>

        {/* C. Action Section */}
        <div className="p-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={onBack}
            className="w-full sm:w-auto px-10 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-slate-900/10"
          >
            返回首页
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <p className="text-center text-xs text-slate-400 dark:text-slate-500">
        如有疑问，请咨询在线客服或联系您的客户经理。
      </p>
    </div>
  );
};
