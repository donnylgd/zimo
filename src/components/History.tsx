import React, { useState } from 'react';
import { FileText, Clock, CheckCircle2, XCircle, Loader2, ChevronRight, Search, Filter } from 'lucide-react';
import { TaskStatus } from '../types';
import { Translations } from '../i18n';

export interface Task {
  id: string;
  filename: string;
  date: string;
  status: TaskStatus;
  total: number;
  completed: number;
  style?: string;
  stage?: string;
  subject?: string;
  brandSize?: 'small' | 'large';
  enableFirstSentenceStrategy?: boolean;
  firstSentenceValues?: string[];
}

interface HistoryProps {
  tasks: Task[];
  onViewTask: (taskId: string) => void;
  t: Translations;
}

/**
 * 历史记录组件
 * 展示用户过往所有的文案生成任务列表，支持搜索和筛选
 */
export const History = ({ tasks, onViewTask, t }: HistoryProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          task.filename.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = stageFilter === 'all' || task.stage === stageFilter;
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesStage && matchesStatus;
  });

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center text-slate-400 dark:text-slate-500 mb-6 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
          <FileText size={40} strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">{t.common.empty_history_title}</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mb-8 leading-relaxed">{t.common.empty_history_desc}</p>
        <button 
          onClick={() => window.location.hash = '#generate'} // Simple way to trigger navigation if handled by hash or parent
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          {t.common.go_create}
          <ChevronRight size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{t.history.title}</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">{t.history.subtitle}</p>
        </div>
      </div>

      {/* Filter Bar - Optimized Layout */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 flex flex-col md:flex-row gap-4 items-center justify-between transition-colors duration-200">
        <div className="relative w-full md:flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={16} />
          <input 
            type="text" 
            placeholder={t.history.search} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 flex-1 md:flex-none">
            <select 
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="w-full md:w-auto bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 block px-3 py-2 outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="all">{t.history.filter_stage}</option>
              <option value="initial">{t.workspace.stage_initial}</option>
              <option value="details">{t.workspace.stage_details}</option>
              <option value="tracking">{t.workspace.stage_tracking}</option>
            </select>
          </div>
          <div className="flex items-center gap-2 flex-1 md:flex-none">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-auto bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 block px-3 py-2 outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="all">{t.history.filter_status}</option>
              <option value="completed">{t.history.status.completed}</option>
              <option value="processing">{t.history.status.processing}</option>
              <option value="failed">{t.history.status.failed}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-200">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/30 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 uppercase tracking-wider">{t.history.list_title}</h3>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-bold bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
            {filteredTasks.length} {t.history.record_count}
          </span>
        </div>
        
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filteredTasks.length === 0 ? (
            <div className="p-12 text-center text-slate-500 dark:text-slate-400 text-sm">{t.history.no_match}</div>
          ) : (
            filteredTasks.map((task) => (
              <div 
                key={task.id}
                onClick={() => task.status === 'completed' && onViewTask(task.id)}
                className={`group p-6 flex items-center justify-between transition-all duration-300 ${
                  task.status === 'completed' ? 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer' : 'opacity-80'
                }`}
              >
                <div className="flex items-start gap-5 flex-1 min-w-0">
                  {/* Status Icon - Left */}
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105 ${
                    task.status === 'completed' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                    task.status === 'processing' ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' :
                    'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'
                  }`}>
                    {task.status === 'completed' && <CheckCircle2 size={24} />}
                    {task.status === 'processing' && <Loader2 size={24} className="animate-spin" />}
                    {task.status === 'failed' && <XCircle size={24} />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    {/* Level 1: Filename, Stage, Status */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h4 className="font-bold text-slate-900 dark:text-white text-lg truncate max-w-md group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {task.filename}
                      </h4>
                      <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
                        {task.stage && (
                          <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-100 dark:border-indigo-500/20 uppercase tracking-tight">
                            {task.stage === 'initial' ? t.workspace.stage_initial : task.stage === 'details' ? t.workspace.stage_details : t.workspace.stage_tracking}
                          </span>
                        )}
                        <span className={`text-[10px] px-2.5 py-1 rounded-lg font-bold uppercase tracking-tight ${
                          task.status === 'completed' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' :
                          task.status === 'processing' ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400' :
                          'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400'
                        }`}>
                          {task.status === 'completed' ? t.history.status.completed : task.status === 'processing' ? t.history.status.processing : t.history.status.failed}
                        </span>
                      </div>
                    </div>
                    
                    {/* Level 2: Subject, Date, Progress */}
                    <div className="space-y-2">
                      {task.subject && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1 italic" title={task.subject}>
                          <span className="text-slate-400 dark:text-slate-500 not-italic font-medium mr-1">{t.history.table.subject}:</span> 
                          "{task.subject}"
                        </p>
                      )}
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Clock size={14} className="text-slate-400" /> 
                          {task.date}
                        </span>
                        <span className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                          <FileText size={14} className="text-slate-400" />
                          {t.history.table.progress.replace('{completed}', task.completed.toString()).replace('{total}', task.total.toString())}
                        </span>
                        <span className="text-slate-300 dark:text-slate-700 font-mono">|</span>
                        <span className="text-slate-400 dark:text-slate-500 font-mono text-[10px] uppercase">ID: {task.id.toUpperCase()}</span>
                      </div>
                    </div>
                    
                    {/* Level 3: Brand Size, Strategy */}
                    <div className="flex items-center gap-2 mt-3.5">
                      {task.brandSize && (
                        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 uppercase tracking-tighter">
                          {task.brandSize === 'large' ? t.history.table.brand_large : t.history.table.brand_small}
                        </span>
                      )}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-tighter ${
                        task.enableFirstSentenceStrategy 
                          ? 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20' 
                          : 'text-slate-500 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800'
                      }`}>
                        {task.enableFirstSentenceStrategy ? t.history.table.strategy_deep : t.history.table.strategy_normal}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Action - Explicit Entry */}
                <div className="flex items-center gap-3 ml-6">
                  {task.status === 'completed' && (
                    <div className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                      {t.history.table.view}
                      <ChevronRight size={18} />
                    </div>
                  )}
                  {task.status !== 'completed' && (
                    <div className="text-slate-300 dark:text-slate-700">
                      <ChevronRight size={20} />
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
