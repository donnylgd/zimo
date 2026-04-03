import React, { useState } from 'react';
import { ArrowLeft, Users, Search, Filter, ChevronRight, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface InviteHistoryProps {
  t: any;
  onBack: () => void;
}

export const InviteHistory = ({ t, onBack }: InviteHistoryProps) => {
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const language = t.promotion_center.title === '推广中心' ? 'zh' : 'en';

  React.useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const tabs = [
    { id: 'all', label: t.promotion_center.invite_history.tabs.all },
    { id: 'registered', label: t.promotion_center.invite_history.tabs.registered },
    { id: 'activated', label: t.promotion_center.invite_history.tabs.activated },
    { id: 'paid', label: t.promotion_center.invite_history.tabs.paid },
    { id: 'expired', label: t.promotion_center.invite_history.tabs.expired },
  ];

  const mockData = [
    { id: 1, user: '138****8888', time: '2024-03-20 14:30', status: 'paid', is_activated: true, is_paid: true, reward: language === 'zh' ? '50 额度 + 10% 佣金' : '50 Quota + 10% Comm.' },
    { id: 2, user: '155****6666', time: '2024-03-21 09:15', status: 'activated', is_activated: true, is_paid: false, reward: language === 'zh' ? '20 额度' : '20 Quota' },
    { id: 3, user: '177****2222', time: '2024-03-22 18:45', status: 'registered', is_activated: false, is_paid: false, reward: '-' },
    { id: 4, user: '133****1111', time: '2024-03-15 10:00', status: 'expired', is_activated: false, is_paid: false, reward: '-' },
    { id: 5, user: '189****9999', time: '2024-03-25 11:20', status: 'paid', is_activated: true, is_paid: true, reward: language === 'zh' ? '50 额度 + 10% 佣金' : '50 Quota + 10% Comm.' },
  ];

  const filteredData = activeTab === 'all' ? mockData : mockData.filter(item => item.status === activeTab);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20';
      case 'activated': return 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20';
      case 'registered': return 'bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20';
      case 'expired': return 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="text-indigo-500" size={24} />
            {t.promotion_center.invite_history.title}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {t.promotion_center.invite_history.desc}
          </p>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative px-2">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text"
            placeholder={language === 'zh' ? '搜索手机号...' : 'Search phone...'}
            className="w-full sm:w-64 pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-slate-100 dark:bg-slate-800 rounded" />
                  <div className="h-3 w-24 bg-slate-100 dark:bg-slate-800 rounded" />
                </div>
              </div>
            </div>
          ))
        ) : filteredData.length > 0 ? (
          filteredData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 hover:border-indigo-500/50 hover:shadow-md transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                    <Users size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{item.user}</h4>
                    <p className="text-xs text-slate-500">{t.promotion_center.invite_history.table.time}: {item.time}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1 max-w-2xl">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.promotion_center.invite_history.table.status}</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(item.status)}`}>
                      {tabs.find(t => t.id === item.status)?.label}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.promotion_center.invite_history.table.is_activated}</p>
                    <div className="flex items-center gap-1.5 text-xs font-medium">
                      {item.is_activated ? (
                        <CheckCircle2 size={14} className="text-emerald-500" />
                      ) : (
                        <Clock size={14} className="text-slate-300" />
                      )}
                      <span className={item.is_activated ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400'}>
                        {item.is_activated ? (language === 'zh' ? '已激活' : 'Activated') : (language === 'zh' ? '未激活' : 'Pending')}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.promotion_center.invite_history.table.is_paid}</p>
                    <div className="flex items-center gap-1.5 text-xs font-medium">
                      {item.is_paid ? (
                        <CheckCircle2 size={14} className="text-emerald-500" />
                      ) : (
                        <Clock size={14} className="text-slate-300" />
                      )}
                      <span className={item.is_paid ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400'}>
                        {item.is_paid ? (language === 'zh' ? '已支付' : 'Paid') : (language === 'zh' ? '未支付' : 'Pending')}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.promotion_center.invite_history.table.reward}</p>
                    <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{item.reward}</p>
                  </div>
                </div>

                <div className="hidden md:block">
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <Users size={32} className="text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{t.common.empty_invites_title}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{t.common.empty_invites_desc}</p>
          </div>
        )}
      </div>
    </div>
  );
};
