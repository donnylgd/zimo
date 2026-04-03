import React, { useState } from 'react';
import { 
  Palette, 
  Type, 
  MousePointer2, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle,
  Info, 
  Loader2, 
  X, 
  Copy, 
  ExternalLink, 
  ChevronRight, 
  Zap, 
  ShieldCheck,
  Layout,
  FileText,
  CreditCard,
  History,
  User,
  Smartphone,
  Mail,
  Gift,
  Search,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Download,
  FileSpreadsheet,
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Toast, ToastType } from './Shared';

export const DesignSystem = () => {
  const [activeToast, setActiveToast] = useState<{ message: string, type: ToastType } | null>(null);

  const showToast = (type: ToastType) => {
    const messages: Record<ToastType, string> = {
      success: '操作成功：您的设置已保存',
      error: '操作失败：网络连接异常，请重试',
      warning: '警告信息：您的套餐即将到期',
      info: '提示信息：系统正在进行维护'
    };
    setActiveToast({ message: messages[type], type });
    setTimeout(() => setActiveToast(null), 3000);
  };

  const Section = ({ title, description, children }: { title: string, description?: string, children: React.ReactNode }) => (
    <div className="space-y-6 pb-12 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <div className="space-y-1">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          {title}
        </h3>
        {description && <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>}
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-8 shadow-sm">
        {children}
      </div>
    </div>
  );

  const ColorBlock = ({ color, name, hex }: { color: string, name: string, hex: string }) => (
    <div className="space-y-2">
      <div className={`h-20 w-full rounded-2xl ${color} border border-black/5 dark:border-white/5 shadow-inner`} />
      <div className="px-1">
        <p className="text-xs font-bold text-slate-900 dark:text-white">{name}</p>
        <p className="text-[10px] text-slate-500 font-mono uppercase">{hex}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {activeToast && <Toast message={activeToast.message} type={activeToast.type} onClose={() => setActiveToast(null)} />}

      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest">
          <ShieldCheck size={14} /> Design System
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">ZIMO 灵鸮设计规范</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
          本页用于集中展示当前产品的设计规范、状态规范与组件规范，仅用于设计参考，不参与业务开发。
          所有组件均遵循“先展示正常状态，仅在动作发生后展示反馈”的交互原则。
        </p>
      </div>

      {/* 1. Colors */}
      <Section title="颜色与主题规范" description="核心品牌色与功能色，支持白天与夜间模式。">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          <ColorBlock color="bg-indigo-600" name="Primary (Brand)" hex="#4F46E5" />
          <ColorBlock color="bg-slate-900 dark:bg-white" name="Ink (Text)" hex="#0F172A" />
          <ColorBlock color="bg-emerald-500" name="Success" hex="#10B981" />
          <ColorBlock color="bg-amber-500" name="Warning" hex="#F59E0B" />
          <ColorBlock color="bg-red-500" name="Error" hex="#EF4444" />
          <ColorBlock color="bg-slate-100 dark:bg-slate-800" name="Surface" hex="#F1F5F9" />
        </div>
      </Section>

      {/* 2. Typography */}
      <Section title="字体与层级规范" description="使用 Inter 字体，通过粗细与大小构建清晰的信息层级。">
        <div className="space-y-8">
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Display / H1</p>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">ZIMO 灵鸮智能建联</h1>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Heading / H2</p>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">历史任务详情</h2>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Subheading / H3</p>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">账户资产信息</h3>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Body / Base</p>
            <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              灵鸮可以帮助您快速生成针对不同达人的个性化建联文案，提升回复率。
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Caption / Small</p>
            <p className="text-xs text-slate-500 dark:text-slate-500">
              * 导出结果将以 Excel 格式下载到您的本地电脑。
            </p>
          </div>
        </div>
      </Section>

      {/* 3. Buttons */}
      <Section title="按钮规范" description="不同层级与状态的按钮样式。">
        <div className="space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Primary / 主按钮</p>
              <button className="w-full bg-slate-900 dark:bg-indigo-600 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/10 hover:scale-[1.02] transition-all">开始生成</button>
            </div>
            <div className="space-y-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Secondary / 次按钮</p>
              <button className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-6 py-3 rounded-xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">查看详情</button>
            </div>
            <div className="space-y-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ghost / 轻按钮</p>
              <button className="w-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-6 py-3 rounded-xl text-sm font-bold hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-all">AI 优化</button>
            </div>
            <div className="space-y-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Danger / 危险按钮</p>
              <button className="w-full bg-red-500 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-red-500/10 hover:bg-red-600 transition-all">退出登录</button>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Button States / 按钮状态</p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-slate-900 dark:bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold opacity-50 cursor-not-allowed">禁用状态</button>
              <button className="bg-slate-900 dark:bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" /> 加载中...
              </button>
              <button className="bg-slate-900 dark:bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2">
                <Sparkles size={16} /> 带图标按钮
              </button>
            </div>
          </div>
        </div>
      </Section>

      {/* 4. Forms */}
      <Section title="输入框 / 表单规范" description="统一的表单输入样式与状态。">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">默认输入框</label>
              <input type="text" placeholder="请输入内容..." className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">激活/聚焦态</label>
              <input type="text" defaultValue="正在输入中" className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border-2 border-indigo-500 focus:outline-none transition-all shadow-lg shadow-indigo-500/5" />
            </div>
          </div>
          <div className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">错误提示态</label>
              <input type="text" defaultValue="错误的内容" className="w-full px-4 py-3 rounded-xl bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/30 focus:outline-none transition-all" />
              <p className="text-[10px] text-red-500 font-bold ml-1">请输入正确的邮箱格式</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">禁用态</label>
              <input type="text" disabled defaultValue="不可编辑的内容" className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-400 cursor-not-allowed" />
            </div>
          </div>
        </div>
      </Section>

      {/* 5. Tags */}
      <Section title="标签 / 状态规范" description="用于展示阶段、状态、套餐等信息。">
        <div className="flex flex-wrap gap-4">
          <span className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-wider border border-indigo-100 dark:border-indigo-500/20">初次建联</span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-100 dark:border-emerald-500/20">已完成</span>
          <span className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wider border border-amber-100 dark:border-amber-500/20">处理中</span>
          <span className="px-2.5 py-1 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] font-bold uppercase tracking-wider border border-red-100 dark:border-red-500/20">生成失败</span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-bold uppercase tracking-wider">专业版</span>
        </div>
      </Section>

      {/* 6. Interaction Feedback (Toasts) */}
      <Section title="交互反馈规范 (Toast)" description="点击动作后出现的轻提示，短暂停留后自动消失。">
        <div className="space-y-8">
          <div className="flex flex-wrap gap-4">
            <button onClick={() => showToast('success')} className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-colors">触发成功 Toast</button>
            <button onClick={() => showToast('error')} className="px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-bold hover:bg-red-600 transition-colors">触发失败 Toast</button>
            <button onClick={() => showToast('warning')} className="px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition-colors">触发警告 Toast</button>
            <button onClick={() => showToast('info')} className="px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors">触发提示 Toast</button>
          </div>
          
          <div className="space-y-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Visual Preview / 视觉预览</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20 flex items-center gap-3">
                <CheckCircle2 size={18} />
                <span className="text-sm font-medium">操作成功：您的设置已保存</span>
              </div>
              <div className="p-4 rounded-xl border bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20 flex items-center gap-3">
                <AlertCircle size={18} />
                <span className="text-sm font-medium">操作失败：网络连接异常，请重试</span>
              </div>
              <div className="p-4 rounded-xl border bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20 flex items-center gap-3">
                <AlertTriangle size={18} />
                <span className="text-sm font-medium">警告信息：您的套餐即将到期</span>
              </div>
              <div className="p-4 rounded-xl border bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20 flex items-center gap-3">
                <Info size={18} />
                <span className="text-sm font-medium">提示信息：系统正在进行维护</span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 12. Interaction Rules */}
      <Section title="交互原则与反馈规范" description="明确区分常驻提示与触发式反馈。">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">A. 默认常驻提示</p>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
              <p className="text-xs text-slate-500 leading-relaxed">
                用于展示页面说明、轻量规则或模块引导。这些内容在页面加载时即存在，不随用户操作消失。
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">B. 触发式反馈 (重要)</p>
            <div className="p-4 bg-indigo-50 dark:bg-indigo-500/5 rounded-2xl border border-indigo-100 dark:border-indigo-500/20">
              <ul className="text-xs text-indigo-600 dark:text-indigo-400 space-y-2 list-disc ml-4">
                <li>仅在用户点击按钮、提交表单或上传文件后出现。</li>
                <li>成功提示（Toast）在 3 秒后自动隐藏。</li>
                <li>校验错误提示在用户修正输入后消失。</li>
                <li>加载状态在异步任务完成后被结果或错误状态替换。</li>
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* 7. Empty States */}
      <Section title="空状态规范" description="当页面或模块无数据时展示的占位状态。">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-10 border border-slate-100 dark:border-slate-700/50 text-center space-y-4">
            <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-300 dark:text-slate-600 mx-auto shadow-sm">
              <FileText size={32} />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">暂无历史任务</h4>
              <p className="text-xs text-slate-500">生成后的任务会显示在这里</p>
            </div>
            <button className="px-6 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl">去创建任务</button>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-10 border border-slate-100 dark:border-slate-700/50 text-center space-y-4">
            <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-300 dark:text-slate-600 mx-auto shadow-sm">
              <CreditCard size={32} />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">暂无充值记录</h4>
              <p className="text-xs text-slate-500">当前还没有相关记录</p>
            </div>
          </div>
        </div>
      </Section>

      {/* 8. Loading States */}
      <Section title="加载态规范" description="操作触发后的中间状态，告知用户系统正在处理。">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50 flex flex-col items-center gap-3">
            <Loader2 size={24} className="text-indigo-600 animate-spin" />
            <p className="text-xs font-bold text-slate-600 dark:text-slate-400">正在解析达人数据...</p>
          </div>
          <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50 flex flex-col items-center gap-3">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-400">AI 正在生成中...</p>
          </div>
          <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50 flex flex-col items-center gap-3">
            <RefreshCw size={24} className="text-indigo-600 animate-spin" />
            <p className="text-xs font-bold text-slate-600 dark:text-slate-400">正在优化核心卖点...</p>
          </div>
        </div>
      </Section>

      {/* 9. Error States */}
      <Section title="异常态规范" description="系统遇到问题时的反馈，引导用户如何修正。">
        <div className="space-y-4">
          <div className="p-4 bg-red-50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/20 rounded-2xl flex items-center gap-3">
            <AlertCircle size={20} className="text-red-500 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-bold text-red-900 dark:text-red-400">上传失败：文件表头不匹配</p>
              <p className="text-xs text-red-700 dark:text-red-500/80">请确保 CSV 文件包含“达人姓名”和“粉丝数”字段。</p>
            </div>
          </div>
          <div className="p-4 bg-amber-50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/20 rounded-2xl flex items-center gap-3">
            <Info size={20} className="text-amber-500 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-bold text-amber-900 dark:text-amber-400">网络异常</p>
              <p className="text-xs text-amber-700 dark:text-amber-500/80">当前网络连接不稳定，请检查后重试。</p>
            </div>
          </div>
        </div>
      </Section>

      {/* 10. Modals */}
      <Section title="弹窗规范" description="需要用户处理的紧急任务或重要确认。">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mock Login Modal */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
            <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
              <h4 className="font-bold text-slate-900 dark:text-white">微信扫码登录</h4>
              <X size={18} className="text-slate-400" />
            </div>
            <div className="p-8 text-center space-y-6">
              <div className="w-40 h-40 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 mx-auto flex items-center justify-center">
                <Palette size={48} className="text-slate-200" />
              </div>
              <p className="text-sm text-slate-500">首次扫码将自动注册账号</p>
            </div>
          </div>
          {/* Mock Confirm Modal */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
            <div className="p-6 border-b border-slate-50 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-white">确认退出登录？</h4>
            </div>
            <div className="p-6 space-y-8">
              <p className="text-sm text-slate-500">退出后可重新登录继续使用，当前正在生成的任务不会中断。</p>
              <div className="flex gap-3">
                <button className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold">取消</button>
                <button className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold">确认退出</button>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 11. Cards & Tables */}
      <Section title="卡片与表格规范" description="核心数据展示容器。">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-sm">
              <div className="flex items-center gap-2 text-indigo-500 mb-2">
                <Zap size={16} />
                <span className="text-[10px] font-bold uppercase tracking-widest">推荐套餐</span>
              </div>
              <h4 className="text-xl font-black text-slate-900 dark:text-white">专业版</h4>
              <p className="text-2xl font-black mt-2">¥299 <span className="text-sm font-normal text-slate-500">/月</span></p>
            </div>
            <div className="md:col-span-2 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-3 font-bold text-slate-500">达人</th>
                    <th className="px-6 py-3 font-bold text-slate-500">状态</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                  <tr>
                    <td className="px-6 py-3 font-bold">@tech_guru</td>
                    <td className="px-6 py-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[10px] font-bold">已生成</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 font-bold">@beauty_queen</td>
                    <td className="px-6 py-3">
                      <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-600 text-[10px] font-bold">失败</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Section>

      {/* Footer Note */}
      <div className="pt-12 text-center">
        <p className="text-xs text-slate-400 dark:text-slate-600 font-medium">
          ZIMO 灵鸮设计规范中心 · 2024 · 仅供内部参考
        </p>
      </div>
    </div>
  );
};
