import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, Copy, CheckCircle2, FileSpreadsheet, AlertCircle, ChevronLeft, ChevronRight, Info, Loader2, RefreshCw, Clock, XCircle } from 'lucide-react';
import { ToastType } from './Shared';
import { Translations } from '../i18n';

export interface TaskResult {
  id: string;
  creatorName: string;
  followers: string;
  generatedCopy: string;
  status: 'success' | 'failed';
  failureReason?: string;
}

interface TaskDetailProps {
  taskId: string;
  filename: string;
  stage?: string;
  style?: string;
  date?: string;
  status?: string;
  total?: number;
  completed?: number;
  successCount?: number;
  failedCount?: number;
  subject?: string;
  brandSize?: 'small' | 'large';
  enableFirstSentenceStrategy?: boolean;
  firstSentenceValues?: string[];
  results: TaskResult[];
  onBack: () => void;
  setToast: (toast: { message: string, type: ToastType } | null) => void;
  t: Translations;
}

/**
 * 任务详情组件
 * 
 * @param taskId 任务唯一标识
 * @param filename 导入的文件名
 * @param stage 业务阶段
 * @param style 生成风格（可选）
 * @param date 创建日期
 * @param status 任务当前状态
 * @param total 总任务量
 * @param completed 已完成数量
 * @param successCount 成功生成数量
 * @param failedCount 生成失败数量
 * @param subject 邮件标题
 * @param brandSize 品牌规模
 * @param enableFirstSentenceStrategy 是否开启深度思考
 * @param firstSentenceValues 深度思考价值点
 * @param results 生成结果列表
 * @param onBack 返回回调
 * @param setToast 设置全局提示回调
 * @param t 国际化翻译对象
 * 
 * 功能：
 * 1. 展示任务的整体进度（进度条、成功/失败统计）。
 * 2. 展示任务的配置摘要（标题、策略等）。
 * 3. 分页展示生成结果，支持按成功/失败进行筛选。
 * 4. 支持一键复制生成文案及导出 Excel 功能。
 */
export const TaskDetail = ({ 
  taskId, 
  filename, 
  stage, 
  style, 
  date, 
  status, 
  total = 0,
  completed = 0,
  successCount = 0,
  failedCount = 0,
  subject, 
  brandSize,
  enableFirstSentenceStrategy,
  firstSentenceValues,
  results, 
  onBack,
  setToast,
  t
}: TaskDetailProps) => {
  const [copiedId, setCopiedId] = useState<string | null>(null); // 记录当前已复制的结果 ID
  const [currentPage, setCurrentPage] = useState(1); // 当前页码
  const [filter, setFilter] = useState<'all' | 'success' | 'failed'>('all'); // 结果筛选状态
  const [isLoading, setIsLoading] = useState(true); // 详情加载状态
  const itemsPerPage = 10; // 每页展示条数

  useEffect(() => {
    // 模拟从后端加载详情数据的延迟
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [taskId]);

  /**
   * 处理复制生成文案
   * 
   * 将文案写入剪贴板，并展示成功提示。
   * 
   * @param text 文案内容
   * @param id 结果ID
   */
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setToast({ message: t.common.success_copy, type: 'success' });
    setTimeout(() => setCopiedId(null), 2000);
  };

  /**
   * 处理导出任务结果为 Excel
   */
  const handleExport = () => {
    setToast({ message: t.task_detail.exporting, type: 'info' });
    // Simulate export
    setTimeout(() => {
      setToast({ message: t.common.success_export, type: 'success' });
    }, 1500);
  };

  // Filtering logic
  const filteredResults = results.filter(r => {
    if (filter === 'success') return r.status === 'success';
    if (filter === 'failed') return r.status === 'failed';
    return true;
  });

  // Pagination logic
  const totalItems = filteredResults.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedResults = filteredResults.slice(startIndex, startIndex + itemsPerPage);

  // Summary stats
  const resultsSuccessCount = results.filter(r => r.status === 'success').length;
  const resultsFailureCount = results.filter(r => r.status === 'failed').length;

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 animate-in fade-in duration-500">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-100 dark:border-indigo-900/30 border-t-indigo-600 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 size={20} className="text-indigo-600 animate-pulse" />
          </div>
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{t.common.loading_results}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{t.common.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 1. Header: Back & Title */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shrink-0 shadow-sm"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/50 px-2 py-0.5 rounded uppercase tracking-wider">
              ID: {taskId.toUpperCase()}
            </span>
            {stage && (
              <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-100 dark:border-indigo-500/20 uppercase tracking-tight">
                {stage === 'initial' ? t.workspace.stage_initial : stage === 'details' ? t.workspace.stage_details : stage === 'tracking' ? t.workspace.stage_tracking : stage}
              </span>
            )}
            {status && (
              <div className="flex items-center gap-1.5">
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-tight flex items-center gap-1 ${
                  status === 'completed' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' :
                  status === 'processing' ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400' :
                  status === 'queued' ? 'bg-slate-50 dark:bg-slate-500/10 text-slate-700 dark:text-slate-400' :
                  status === 'partial' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400' :
                  'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400'
                }`}>
                  {status === 'completed' && <CheckCircle2 size={10} />}
                  {status === 'processing' && <Loader2 size={10} className="animate-spin" />}
                  {status === 'queued' && <Clock size={10} />}
                  {status === 'partial' && <RefreshCw size={10} className="animate-spin" />}
                  {status === 'failed' && <XCircle size={10} />}
                  {status === 'completed' ? t.history.status.completed : 
                   status === 'processing' ? t.history.status.processing : 
                   status === 'queued' ? t.history.status.queued : 
                   status === 'partial' ? t.history.status.partial : 
                   t.history.status.failed}
                </span>
              </div>
            )}
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight truncate">{filename}</h2>
        </div>
      </div>

      {/* 2. Task Progress Card (New) */}
      {(status === 'processing' || status === 'partial' || status === 'queued' || status === 'completed') && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-300">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/30 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{t.history.table.progress}</h3>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-tight ${
                status === 'completed' ? 'text-emerald-600 dark:text-emerald-400' :
                status === 'processing' ? 'text-indigo-600 dark:text-indigo-400' :
                status === 'queued' ? 'text-slate-500 dark:text-slate-500' :
                'text-amber-600 dark:text-amber-400'
              }`}>
                {status === 'completed' ? t.history.status.completed_desc : 
                 status === 'processing' ? t.history.status.processing_desc : 
                 status === 'queued' ? t.history.status.queued_desc : 
                 t.history.status.partial_desc}
              </span>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t.task_detail.result_summary.split(' ')[0]}</div>
                <div className="text-xl font-bold text-slate-900 dark:text-white">{total}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t.history.table.progress}</div>
                <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{completed} / {total}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t.task_detail.success_count.split(' ')[0]}</div>
                <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{successCount}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t.task_detail.failure_count.split(' ')[0]}</div>
                <div className="text-xl font-bold text-red-500 dark:text-red-400">{failedCount}</div>
              </div>
            </div>
            
            <div className="relative h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`absolute left-0 top-0 h-full transition-all duration-500 ${
                  status === 'completed' ? 'bg-emerald-500' : 'bg-indigo-500'
                }`}
                style={{ width: `${(completed / total) * 100}%` }}
              />
              {status === 'processing' && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. Task Summary Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-300">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/30">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{t.task_detail.summary_card}</h3>
        </div>
        <div className="p-6 space-y-6">
          {/* Unified Subject Block */}
          {subject && (
            <div className="bg-indigo-50/50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl p-5">
              <div className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2">{t.task_detail.unified_subject}</div>
              <div className="text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                {subject}
              </div>
            </div>
          )}

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t.task_detail.creator_count.split(' ')[0]}</div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-500" />
                {t.task_detail.creator_count.replace('{count}', results.length.toString())}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t.task_detail.create_time}</div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{date || '-'}</div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t.task_detail.brand_strategy}</div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {brandSize === 'large' ? t.workspace.big_brand : t.workspace.new_brand}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t.task_detail.body_strategy}</div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {enableFirstSentenceStrategy 
                  ? t.task_detail.strategy_deep
                  : t.task_detail.strategy_normal}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Results Area */}
      <div className="space-y-4">
        <div className="px-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">{t.task_detail.results_card}</h3>
            <button 
              onClick={handleExport}
              className="bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm shadow-emerald-500/20"
            >
              <Download size={14} />
              {t.task_detail.export_excel}
            </button>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Result Summary Tags */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">{t.task_detail.result_summary.replace('{total}', results.length.toString())}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/5 rounded-lg border border-emerald-100 dark:border-emerald-500/20">
                <CheckCircle2 size={12} className="text-emerald-500" />
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-tight">{t.task_detail.success_count.replace('{count}', resultsSuccessCount.toString())}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-500/5 rounded-lg border border-amber-100 dark:border-amber-500/20">
                <AlertCircle size={12} className="text-amber-500" />
                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-tight">{t.task_detail.failure_count.replace('{count}', resultsFailureCount.toString())}</span>
              </div>
              
              {/* Failure Hint - Default */}
              {filter === 'all' && resultsFailureCount > 0 && (
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-amber-600 dark:text-amber-400 animate-in fade-in slide-in-from-left-2 duration-300">
                  <Info size={12} />
                  {t.task_detail.failure_hint}
                </div>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button 
                onClick={() => setFilter('all')}
                className={`px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all ${filter === 'all' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                {t.task_detail.filter_all}
              </button>
              <button 
                onClick={() => setFilter('success')}
                className={`px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all ${filter === 'success' ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                {t.task_detail.filter_success}
              </button>
              <button 
                onClick={() => setFilter('failed')}
                className={`px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all ${filter === 'failed' ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                {t.task_detail.filter_failed}
              </button>
            </div>
          </div>
        </div>

        {/* Failure Loop Guidance - Enhanced when filtering for failures */}
        {filter === 'failed' && resultsFailureCount > 0 && (
          <div className="mx-2 p-3 bg-amber-50/50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/20 rounded-2xl flex items-center gap-3 animate-in zoom-in-95 duration-300">
            <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
              <AlertCircle size={16} />
            </div>
            <p className="text-xs font-medium text-amber-800 dark:text-amber-300">
              {t.task_detail.viewing_failed}
            </p>
          </div>
        )}

        {/* Success Hint when filtering for success */}
        {filter === 'success' && resultsSuccessCount > 0 && (
          <div className="mx-2 p-3 bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl flex items-center gap-3 animate-in zoom-in-95 duration-300">
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <CheckCircle2 size={16} />
            </div>
            <p className="text-xs font-medium text-emerald-800 dark:text-emerald-300">
              {t.task_detail.viewing_success}
            </p>
          </div>
        )}

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4 whitespace-nowrap uppercase tracking-tighter text-[11px]">{t.task_detail.creator}</th>
                  <th className="px-6 py-4 whitespace-nowrap uppercase tracking-tighter text-[11px]">{t.task_detail.followers}</th>
                  <th className="px-6 py-4 w-full uppercase tracking-tighter text-[11px]">{t.task_detail.generated_result}</th>
                  <th className="px-6 py-4 whitespace-nowrap uppercase tracking-tighter text-[11px]">{t.task_detail.result_status}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredResults.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3 animate-in fade-in zoom-in-95 duration-500">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-600">
                          {filter === 'failed' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                        </div>
                        <div className="space-y-1 max-w-xs mx-auto">
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                            {filter === 'failed' ? t.task_detail.no_failed_results_title : t.task_detail.no_success_results_title}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {filter === 'failed' ? t.task_detail.no_failed_results_desc : t.task_detail.no_success_results_desc}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedResults.map((row) => (
                    <tr key={row.id} className={`hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-colors group ${row.status === 'failed' ? 'bg-slate-50/30 dark:bg-slate-800/10' : ''}`}>
                      <td className="px-6 py-5 font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">{row.creatorName}</td>
                      <td className="px-6 py-5 whitespace-nowrap font-medium">{row.followers}</td>
                      <td className="px-6 py-5">
                        {row.status === 'success' ? (
                          <div className="relative group/copy">
                            <p className="line-clamp-3 group-hover:line-clamp-none transition-all text-slate-700 dark:text-slate-300 leading-relaxed">{row.generatedCopy}</p>
                            <button 
                              onClick={() => handleCopy(row.generatedCopy, row.id)}
                              className="absolute top-0 right-0 p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg opacity-0 group-hover/copy:opacity-100 transition-all hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transform translate-y-[-4px]"
                              title={t.task_detail.copy}
                            >
                              {copiedId === row.id ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Copy size={16} />}
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 italic">
                            <Info size={14} className="shrink-0" />
                            <span>{row.failureReason || t.task_detail.failure_reason_default}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tight ${
                          row.status === 'success' 
                            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' 
                            : 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400'
                        }`}>
                          <div className={`w-1 h-1 rounded-full ${row.status === 'success' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          {row.status === 'success' ? t.task_detail.status_generated : t.task_detail.status_failed}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-800/30">
              <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {t.task_detail.pagination.total.replace('{total}', totalItems.toString())}
              </div>
              <div className="flex items-center gap-4">
                <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  {t.task_detail.pagination.page.replace('{current}', currentPage.toString())} / {totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-slate-800 transition-all"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-slate-800 transition-all"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="px-2">
          <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed italic">
            * {t.task_detail.export_desc}
          </p>
        </div>
      </div>
    </div>
  );
};
