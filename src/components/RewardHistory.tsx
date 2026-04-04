import React, { useState } from 'react';
import { ArrowLeft, Coins, Wallet, Clock, CheckCircle2, XCircle, ChevronRight, Search, Filter, Info } from 'lucide-react';
import { motion } from 'motion/react';

interface RewardHistoryProps {
  t: any;
  onBack: () => void;
}

/**
 * 奖励明细组件
 * 展示用户的算力奖励和佣金奖励记录
 */
export const RewardHistory = ({ t, onBack }: RewardHistoryProps) => {
  const [activeTab, setActiveTab] = useState<'quota' | 'commission'>('quota');
  const [isLoading, setIsLoading] = useState(true);
  const language = t.promotion_center.title === '推广中心' ? 'zh' : 'en';

  React.useEffect(() => {
    // Simulate initial loading
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const quotaMockData = [
    { id: 1, type: language === 'zh' ? '注册奖励' : 'Reg. Reward', amount: '+20', source: '138****8888', time: '2024-03-20 14:30', status: 'success' },
    { id: 2, type: language === 'zh' ? '激活奖励' : 'Act. Reward', amount: '+30', source: '155****6666', time: '2024-03-21 09:15', status: 'success' },
    { id: 3, type: language === 'zh' ? '注册奖励' : 'Reg. Reward', amount: '+20', source: '177****2222', time: '2024-03-22 18:45', status: 'success' },
    { id: 4, type: language === 'zh' ? '首单奖励' : 'First Order', amount: '+50', source: '189****9999', time: '2024-03-25 11:20', status: 'success' },
  ];

  const commissionMockData = [
    { 
      id: 1, 
      source: '138****8888', 
      order_id: 'ORD20240320001', 
      amount: '¥299.00', 
      rate: '10%', 
      earned: '¥29.90', 
      status: 'paid',
      pay_time: '2024-03-20 14:30',
      audit_time_est: '2024-03-21',
      payout_time: '2024-03-22 10:00',
      notes: language === 'zh' ? '打款成功' : 'Payout successful'
    },
    { 
      id: 2, 
      source: '189****9999', 
      order_id: 'ORD20240325005', 
      amount: '¥99.00', 
      rate: '10%', 
      earned: '¥9.90', 
      status: 'pending_payment',
      pay_time: '2024-03-25 11:20',
      audit_time_est: '2024-03-26',
      payout_time: '-',
      notes: ''
    },
    { 
      id: 3, 
      source: '133****1111', 
      order_id: 'ORD20240315002', 
      amount: '¥299.00', 
      rate: '10%', 
      earned: '¥29.90', 
      status: 'rejected',
      pay_time: '2024-03-15 09:00',
      audit_time_est: '2024-03-16',
      payout_time: '-',
      notes: language === 'zh' ? '订单发生退款' : 'Order refunded'
    },
    { 
      id: 4, 
      source: '155****0000', 
      order_id: 'ORD20240328009', 
      amount: '¥299.00', 
      rate: '10%', 
      earned: '¥29.90', 
      status: 'auditing',
      pay_time: '2024-03-28 16:45',
      audit_time_est: '2024-03-29',
      payout_time: '-',
      notes: ''
    },
    { 
      id: 5, 
      source: '177****2222', 
      order_id: 'ORD20240330012', 
      amount: '¥499.00', 
      rate: '10%', 
      earned: '¥49.90', 
      status: 'pending_audit',
      pay_time: '2024-03-30 20:15',
      audit_time_est: '2024-04-01',
      payout_time: '-',
      notes: ''
    },
  ];

  /**
   * 根据状态获取对应的样式类名
   * @param status 状态值
   * @returns Tailwind CSS 类名字符串
   */
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20';
      case 'pending_payment': return 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20';
      case 'auditing': return 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20';
      case 'pending_audit': return 'bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20';
      case 'rejected': return 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20';
      case 'success': return 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  /**
   * 根据状态获取对应的显示标签文本
   * @param status 状态值
   * @returns 翻译后的标签文本
   */
  const getStatusLabel = (status: string) => {
    return t.promotion_center.reward_history.status[status] || (language === 'zh' ? '已发放' : 'Issued');
  };

  /**
   * 根据状态获取对应的提示文本
   * @param status 状态值
   * @returns 翻译后的提示文本
   */
  const getStatusHint = (status: string) => {
    return t.promotion_center.reward_history.status_hints[status] || '';
  };

  /**
   * 根据状态获取对应的图标组件
   * @param status 状态值
   * @returns Lucide 图标组件或 null
   */
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle2 size={14} />;
      case 'pending_payment': return <Wallet size={14} />;
      case 'auditing': return <Clock size={14} />;
      case 'pending_audit': return <Clock size={14} />;
      case 'rejected': return <XCircle size={14} />;
      default: return null;
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
            <Coins className="text-indigo-500" size={24} />
            {t.promotion_center.reward_history.title}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {t.promotion_center.reward_history.desc}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm w-fit">
        <button
          onClick={() => setActiveTab('quota')}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'quota'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
              : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Clock size={18} />
          {t.promotion_center.reward_history.tabs.quota}
        </button>
        <button
          onClick={() => setActiveTab('commission')}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'commission'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
              : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Wallet size={18} />
          {t.promotion_center.reward_history.tabs.commission}
        </button>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 animate-pulse space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 bg-slate-50 dark:bg-slate-800 rounded-xl" />
            ))}
          </div>
        ) : activeTab === 'quota' ? (
          quotaMockData.length > 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 border-bottom border-slate-100 dark:border-slate-800">
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{t.promotion_center.reward_history.quota_table.type}</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{t.promotion_center.reward_history.quota_table.amount}</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{t.promotion_center.reward_history.quota_table.source}</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{t.promotion_center.reward_history.quota_table.time}</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{t.promotion_center.reward_history.quota_table.status}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {quotaMockData.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-300">{item.type}</td>
                      <td className="px-6 py-4 text-sm font-bold text-indigo-600 dark:text-indigo-400">{item.amount}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{item.source}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{item.time}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(item.status)}`}>
                          {getStatusLabel(item.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <Coins size={32} className="text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{t.common.empty_rewards_title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">{t.common.empty_rewards_desc}</p>
            </div>
          )
        ) : (
          commissionMockData.length > 0 ? (
            <div className="space-y-4">
              {/* Commission Info Banner */}
              <div className="bg-indigo-50/50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/10 rounded-2xl p-4 flex items-start gap-3">
                <div className="p-1.5 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg text-indigo-600 dark:text-indigo-400 mt-0.5">
                  <Info size={16} />
                </div>
                <p className="text-sm text-indigo-700 dark:text-indigo-300 leading-relaxed">
                  {t.promotion_center.reward_history.commission_desc}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {commissionMockData.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:border-indigo-500/50 hover:shadow-md transition-all group overflow-hidden relative"
                  >
                    {/* Status Indicator Bar */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                      item.status === 'paid' ? 'bg-emerald-500' :
                      item.status === 'rejected' ? 'bg-rose-500' :
                      item.status === 'pending_payment' ? 'bg-indigo-500' :
                      'bg-blue-500'
                    }`} />

                    <div className="flex flex-col gap-6">
                      {/* Top Row: User & Status */}
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                            <Wallet size={20} />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 dark:text-white">{item.source}</h4>
                            <p className="text-xs text-slate-500">{t.promotion_center.reward_history.commission_table.order_id}: {item.order_id}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1.5">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(item.status)}`}>
                            {getStatusIcon(item.status)}
                            {getStatusLabel(item.status)}
                          </span>
                          <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 italic">
                            {getStatusHint(item.status)}
                          </p>
                        </div>
                      </div>

                      {/* Middle Row: Financial Details */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-4 border-y border-slate-50 dark:border-slate-800/50">
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.promotion_center.reward_history.commission_table.amount}</p>
                          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{item.amount}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.promotion_center.reward_history.commission_table.rate}</p>
                          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{item.rate}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.promotion_center.reward_history.commission_table.earned}</p>
                          <p className="text-xl font-black text-indigo-600 dark:text-indigo-400">{item.earned}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.promotion_center.reward_history.commission_table.pay_time}</p>
                          <p className="text-sm text-slate-500">{item.pay_time}</p>
                        </div>
                      </div>

                      {/* Bottom Row: Timeline & Notes */}
                      <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400">{t.promotion_center.reward_history.commission_table.audit_time_est}:</span>
                            <span className="font-medium text-slate-600 dark:text-slate-400">{item.audit_time_est}</span>
                          </div>
                          {item.status === 'paid' && (
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400">{t.promotion_center.reward_history.commission_table.payout_time}:</span>
                              <span className="font-medium text-emerald-600 dark:text-emerald-400">{item.payout_time}</span>
                            </div>
                          )}
                        </div>
                        {item.notes && (
                          <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                            <span className="text-slate-400">{t.promotion_center.reward_history.commission_table.notes}:</span>
                            <span className="text-slate-600 dark:text-slate-400">{item.notes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <Wallet size={32} className="text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{t.common.empty_rewards_title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">{t.common.empty_rewards_desc}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};
