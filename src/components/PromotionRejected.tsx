import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, XCircle, AlertCircle, RefreshCcw, Info } from 'lucide-react';

interface PromotionRejectedProps {
  t: any;
  onBack: () => void;
  onReapply: () => void;
}

/**
 * 推广申请被驳回组件
 * 提示用户申请未通过，并提供重新申请的入口
 */
export const PromotionRejected = ({ t, onBack, onReapply }: PromotionRejectedProps) => {
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
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">申请未通过</h1>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        {/* A. Status Section */}
        <div className="p-12 text-center border-b border-slate-100 dark:border-slate-800 space-y-6">
          <div className="w-24 h-24 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 mx-auto">
            <XCircle size={48} />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">推广权限申请未通过</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              很抱歉，您提交的推广权限申请暂未通过审核。这可能是由于资料不完整或不符合当前推广计划的要求。
            </p>
          </div>
        </div>

        {/* B. Supplementary Info Section */}
        <div className="bg-slate-50/50 dark:bg-slate-800/30 p-8 space-y-4">
          <div className="flex items-start gap-4">
            <div className="mt-1 p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400">
              <AlertCircle size={16} />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">功能限制说明</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                在申请通过之前，您将无法访问正式推广中心，也无法生成专属推广链接或查看收益数据。您可以根据驳回建议修改信息后重新发起申请。
              </p>
            </div>
          </div>
        </div>

        {/* C. Action Section */}
        <div className="p-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={onReapply}
            className="w-full sm:w-auto px-10 py-3.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
          >
            <RefreshCcw size={18} />
            重新申请
          </button>
          <button 
            onClick={onBack}
            className="w-full sm:w-auto px-10 py-3.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            返回
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-center gap-2 text-slate-400 dark:text-slate-500">
        <Info size={14} />
        <p className="text-xs">
          建议您在重新申请前，仔细阅读《推广员准入标准》
        </p>
      </div>
    </div>
  );
};
