import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Megaphone, 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  MessageSquare,
  Globe,
  Zap
} from 'lucide-react';

interface PromotionApplyProps {
  t: any;
  onBack: () => void;
  onApply: () => void;
}

export const PromotionApply = ({ t, onBack, onApply }: PromotionApplyProps) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">推广计划</h1>
      </div>

      {/* A. Introduction Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 dark:opacity-10">
          <Megaphone size={120} className="-rotate-12" />
        </div>
        
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles size={12} />
            Promotion Program
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
            分享灵鸮，<br />
            开启您的收益增长之旅
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
            灵鸮推广计划旨在与优秀的创作者和合作伙伴共同成长。通过申请并获得审核后，您将获得专属的推广工具、实时的收益结算系统以及专业的运营支持。
          </p>
          <div className="flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400">
            <CheckCircle2 size={16} />
            审核通过后即可解锁正式推广中心权限
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* B. Suitable Audience Section */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-6">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Users size={24} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">适合人群</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">如果您符合以下特征，欢迎加入我们：</p>
          </div>
          <ul className="space-y-4">
            {[
              { icon: <MessageSquare size={16} />, text: "拥有公众号、小红书、抖音、社群等内容渠道的创作者" },
              { icon: <Globe size={16} />, text: "具备内容分发能力或精准用户触达能力的合作伙伴" },
              { icon: <Zap size={16} />, text: "认可灵鸮产品价值，并有意向长期推广的个人或团队" }
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                <div className="mt-0.5 text-blue-500">{item.icon}</div>
                {item.text}
              </li>
            ))}
          </ul>
        </div>

        {/* C. Application Instructions Section */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-6">
          <div className="w-12 h-12 bg-amber-50 dark:bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400">
            <ShieldCheck size={24} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">申请说明</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">为了保证推广生态的质量，我们需要进行人工审核：</p>
          </div>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xs font-bold">1</div>
                <div className="w-px h-full bg-slate-100 dark:bg-slate-800 my-1"></div>
              </div>
              <div className="pb-4">
                <p className="text-sm font-bold text-slate-900 dark:text-white">提交资料</p>
                <p className="text-xs text-slate-500 mt-1">点击下方按钮，填写您的基础推广渠道信息。</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xs font-bold">2</div>
                <div className="w-px h-full bg-slate-100 dark:bg-slate-800 my-1"></div>
              </div>
              <div className="pb-4">
                <p className="text-sm font-bold text-slate-900 dark:text-white">人工审核</p>
                <p className="text-xs text-slate-500 mt-1">后台将在 1-3 个工作日内完成审核，并通知结果。</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xs font-bold">3</div>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">开通权限</p>
                <p className="text-xs text-slate-500 mt-1">审核通过后，您将自动获得正式推广中心的所有功能。</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* D. Application Entry Section */}
      <div className="bg-indigo-600 rounded-3xl p-10 text-center space-y-6 shadow-xl shadow-indigo-500/20">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-white">准备好开启您的推广之旅了吗？</h3>
          <p className="text-indigo-100 opacity-80">点击下方按钮开始申请，审核通过后即可获得专属推广链接。</p>
        </div>
        <button 
          onClick={onApply}
          className="px-10 py-4 bg-white text-indigo-600 hover:bg-indigo-50 rounded-2xl font-bold transition-all flex items-center gap-2 mx-auto shadow-lg"
        >
          申请推广权限
          <ArrowRight size={20} />
        </button>
        <p className="text-[10px] text-indigo-200 opacity-60">
          申请即代表您同意《灵鸮推广员服务协议》
        </p>
      </div>
    </div>
  );
};
