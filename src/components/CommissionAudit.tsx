import React, { useState, useMemo } from 'react';
import { 
  ClipboardCheck, 
  ArrowLeft, 
  Search, 
  X, 
  Filter, 
  MoreHorizontal, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  CreditCard,
  ExternalLink,
  User,
  ShoppingBag,
  History,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CommissionRecord {
  id: string;
  promoter: string;
  promoterPhone: string;
  invitee: string;
  inviteePhone: string;
  orderId: string;
  orderAmount: number;
  paidAmount: number;
  rate: number;
  commission: number;
  payTime: string;
  estAuditTime: string;
  payoutTime?: string;
  status: 'waiting' | 'pending' | 'payout' | 'paid' | 'rejected';
  alipay: string;
  recipient: string;
  risk: 'normal' | 'review' | 'high';
  remark: string;
}

const MOCK_RECORDS: CommissionRecord[] = [
  {
    id: '1',
    promoter: '张三',
    promoterPhone: '138****0001',
    invitee: '李四',
    inviteePhone: '139****1111',
    orderId: 'ORD20240331001',
    orderAmount: 299,
    paidAmount: 299,
    rate: 10,
    commission: 29.9,
    payTime: '2024-03-31 10:00',
    estAuditTime: '2024-04-07 10:00',
    status: 'waiting',
    alipay: '138****0001',
    recipient: '张三',
    risk: 'normal',
    remark: '首单奖励'
  },
  {
    id: '2',
    promoter: '王五',
    promoterPhone: '137****2222',
    invitee: '赵六',
    inviteePhone: '136****3333',
    orderId: 'ORD20240330005',
    orderAmount: 599,
    paidAmount: 599,
    rate: 15,
    commission: 89.85,
    payTime: '2024-03-30 15:30',
    estAuditTime: '2024-03-31 15:30',
    status: 'pending',
    alipay: 'wangwu@example.com',
    recipient: '王五',
    risk: 'review',
    remark: '高额订单'
  },
  {
    id: '3',
    promoter: '孙七',
    promoterPhone: '135****4444',
    invitee: '周八',
    inviteePhone: '134****5555',
    orderId: 'ORD20240329012',
    orderAmount: 199,
    paidAmount: 199,
    rate: 10,
    commission: 19.9,
    payTime: '2024-03-29 09:15',
    estAuditTime: '2024-04-05 09:15',
    status: 'payout',
    alipay: '135****4444',
    recipient: '孙七',
    risk: 'normal',
    remark: ''
  },
  {
    id: '4',
    promoter: '吴九',
    promoterPhone: '133****6666',
    invitee: '郑十',
    inviteePhone: '132****7777',
    orderId: 'ORD20240328088',
    orderAmount: 999,
    paidAmount: 999,
    rate: 20,
    commission: 199.8,
    payTime: '2024-03-28 20:45',
    estAuditTime: '2024-04-04 20:45',
    status: 'paid',
    payoutTime: '2024-03-31 12:00',
    alipay: 'wujiu_pay@163.com',
    recipient: '吴九',
    risk: 'high',
    remark: '疑似刷单'
  },
  {
    id: '5',
    promoter: '陈十一',
    promoterPhone: '131****8888',
    invitee: '林十二',
    inviteePhone: '130****9999',
    orderId: 'ORD20240327045',
    orderAmount: 150,
    paidAmount: 150,
    rate: 10,
    commission: 15,
    payTime: '2024-03-27 14:20',
    estAuditTime: '2024-04-03 14:20',
    status: 'rejected',
    alipay: 'chen11@alipay.com',
    recipient: '陈十一',
    risk: 'high',
    remark: '订单已退款'
  }
];

interface CommissionAuditProps {
  t: any;
  onBack?: () => void;
  setToast: (toast: { message: string; type: 'success' | 'error' | 'warning' | 'info' } | null) => void;
}

/**
 * 佣金审核组件
 * 用于管理员审核和管理推广佣金记录
 */
export const CommissionAudit = ({ t, onBack, setToast }: CommissionAuditProps) => {
  const [activeTab, setActiveTab] = useState<'all' | 'waiting' | 'pending' | 'payout' | 'paid' | 'rejected'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [records, setRecords] = useState<CommissionRecord[]>(MOCK_RECORDS);
  const [selectedRecord, setSelectedRecord] = useState<CommissionRecord | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // 模拟初始加载
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  /**
   * 根据当前标签和搜索查询过滤记录
   */
  const filteredRecords = useMemo(() => {
    return records.filter(record => {
      const matchesTab = activeTab === 'all' || record.status === activeTab;
      const matchesSearch = 
        record.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.promoter.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.invitee.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [records, activeTab, searchQuery]);

  /**
   * 处理状态更新逻辑
   * @param id 记录ID
   * @param newStatus 新状态
   */
  const handleStatusUpdate = (id: string, newStatus: CommissionRecord['status']) => {
    setIsSaving(true);
    
    // 模拟 API 调用
    setTimeout(() => {
      setRecords(prev => prev.map(r => r.id === id ? { ...r, status: newStatus, payoutTime: newStatus === 'paid' ? new Date().toLocaleString() : r.payoutTime } : r));
      
      let successMsg = t.common.success;
      if (newStatus === 'payout') successMsg = t.commission_audit.actions.approve_success || "Approved successfully";
      if (newStatus === 'rejected') successMsg = t.commission_audit.actions.reject_success || "Rejected successfully";
      if (newStatus === 'paid') successMsg = t.commission_audit.actions.paid_success || "Marked as paid";
      
      setToast({ message: successMsg, type: 'success' });
      setIsSaving(false);
      
      if (selectedRecord?.id === id) {
        setSelectedRecord(prev => prev ? { ...prev, status: newStatus } : null);
      }
    }, 1000);
  };

  /**
   * 获取状态徽章
   * @param status 佣金状态
   */
  const getStatusBadge = (status: CommissionRecord['status']) => {
    switch (status) {
      case 'waiting':
        return <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium flex items-center gap-1 w-fit"><Clock size={12} />{t.commission_audit.tabs.waiting}</span>;
      case 'pending':
        return <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-600 text-xs font-medium flex items-center gap-1 w-fit"><Info size={12} />{t.commission_audit.tabs.pending}</span>;
      case 'payout':
        return <span className="px-2 py-1 rounded-full bg-indigo-100 text-indigo-600 text-xs font-medium flex items-center gap-1 w-fit"><CreditCard size={12} />{t.commission_audit.tabs.payout}</span>;
      case 'paid':
        return <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-600 text-xs font-medium flex items-center gap-1 w-fit"><CheckCircle2 size={12} />{t.commission_audit.tabs.paid}</span>;
      case 'rejected':
        return <span className="px-2 py-1 rounded-full bg-rose-100 text-rose-600 text-xs font-medium flex items-center gap-1 w-fit"><XCircle size={12} />{t.commission_audit.tabs.rejected}</span>;
    }
  };

  /**
   * 获取风险等级徽章
   * @param risk 风险等级
   */
  const getRiskBadge = (risk: CommissionRecord['risk']) => {
    switch (risk) {
      case 'normal':
        return <span className="text-emerald-500 text-xs font-medium">{t.commission_audit.risk_levels.normal}</span>;
      case 'review':
        return <span className="text-amber-500 text-xs font-medium flex items-center gap-1"><AlertTriangle size={12} />{t.commission_audit.risk_levels.review}</span>;
      case 'high':
        return <span className="text-rose-500 text-xs font-medium flex items-center gap-1"><AlertTriangle size={12} />{t.commission_audit.risk_levels.high}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* 头部区域 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <button 
              onClick={onBack}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ClipboardCheck className="text-indigo-500" size={24} />
              {t.commission_audit.title}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              {t.commission_audit.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* 开发提示 */}
      <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={18} />
        <div>
          <h4 className="text-sm font-bold text-amber-800 dark:text-amber-400">
            {t.distribution_config.dev_banner_title}
          </h4>
          <p className="text-xs text-amber-700 dark:text-amber-500 mt-1">
            {t.commission_audit.dev_notice}
          </p>
        </div>
      </div>

      {/* 筛选区域 */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl overflow-x-auto max-w-full no-scrollbar">
            {(['all', 'waiting', 'pending', 'payout', 'paid', 'rejected'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab 
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {t.commission_audit.tabs[tab]}
              </button>
            ))}
          </div>

          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder={t.commission_audit.table.order_id + ' / ' + t.commission_audit.table.promoter}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
          <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-sm text-slate-500 animate-pulse">{t.common.loading || "Loading records..."}</p>
        </div>
      ) : (
        /* 表格区域 */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-bottom border-slate-200 dark:border-slate-800">
                  <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">{t.commission_audit.table.promoter}</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">{t.commission_audit.table.invitee}</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">{t.commission_audit.table.order_id}</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">{t.commission_audit.table.commission}</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">{t.commission_audit.table.status}</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">{t.commission_audit.table.risk}</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">{t.common.actions || 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{record.promoter}</span>
                        <span className="text-xs text-slate-500">{record.promoterPhone}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{record.invitee}</span>
                        <span className="text-xs text-slate-500">{record.inviteePhone}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-mono text-slate-600 dark:text-slate-400">{record.orderId}</span>
                        <span className="text-xs text-slate-400">{record.payTime}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">¥{record.commission.toFixed(2)}</span>
                        <span className="text-xs text-slate-400">{record.rate}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {getStatusBadge(record.status)}
                    </td>
                    <td className="px-4 py-4">
                      {getRiskBadge(record.risk)}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => {
                            setSelectedRecord(record);
                            setIsDrawerOpen(true);
                          }}
                          className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-all"
                          title={t.commission_audit.actions.view_details}
                        >
                          <ExternalLink size={18} />
                        </button>
                        
                        {record.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleStatusUpdate(record.id, 'payout')}
                              disabled={isSaving}
                              className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-all disabled:opacity-50"
                              title={t.commission_audit.actions.approve}
                            >
                              <CheckCircle2 size={18} />
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(record.id, 'rejected')}
                              disabled={isSaving}
                              className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-all disabled:opacity-50"
                              title={t.commission_audit.actions.reject}
                            >
                              <XCircle size={18} />
                            </button>
                          </>
                        )}

                        {record.status === 'payout' && (
                          <button 
                            onClick={() => handleStatusUpdate(record.id, 'paid')}
                            disabled={isSaving}
                            className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-all disabled:opacity-50"
                            title={t.commission_audit.actions.mark_paid}
                          >
                            <CreditCard size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredRecords.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center gap-2 opacity-40">
                        <History size={48} />
                        <p className="text-sm">{t.common.empty_transactions_desc || "No records found"}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 详情抽屉 */}
      <AnimatePresence>
        {isDrawerOpen && selectedRecord && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl z-50 flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Info className="text-indigo-500" size={20} />
                  {t.commission_audit.details.title}
                </h2>
                <button 
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* 状态横幅 */}
                <div className="flex flex-col items-center text-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="mb-3">
                    {getStatusBadge(selectedRecord.status)}
                  </div>
                  <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                    ¥{selectedRecord.commission.toFixed(2)}
                  </div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                    {t.commission_audit.table.commission}
                  </div>
                </div>

                {/* 基础信息 */}
                <section className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <div className="w-1 h-4 bg-indigo-500 rounded-full" />
                    {t.commission_audit.details.base_info}
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl">
                      <div className="text-xs text-slate-500 mb-1">{t.commission_audit.table.pay_time}</div>
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-300">{selectedRecord.payTime}</div>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl">
                      <div className="text-xs text-slate-500 mb-1">{t.commission_audit.table.audit_time}</div>
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-300">{selectedRecord.estAuditTime}</div>
                    </div>
                  </div>
                </section>

                {/* 邀请信息 */}
                <section className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <div className="w-1 h-4 bg-indigo-500 rounded-full" />
                    {t.commission_audit.details.invite_info}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                          <User size={16} />
                        </div>
                        <div>
                          <div className="text-xs text-slate-500">{t.commission_audit.table.promoter}</div>
                          <div className="text-sm font-bold text-slate-700 dark:text-slate-300">{selectedRecord.promoter}</div>
                        </div>
                      </div>
                      <div className="text-xs text-slate-500">{selectedRecord.promoterPhone}</div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-400">
                          <User size={16} />
                        </div>
                        <div>
                          <div className="text-xs text-slate-500">{t.commission_audit.table.invitee}</div>
                          <div className="text-sm font-bold text-slate-700 dark:text-slate-300">{selectedRecord.invitee}</div>
                        </div>
                      </div>
                      <div className="text-xs text-slate-500">{selectedRecord.inviteePhone}</div>
                    </div>
                  </div>
                </section>

                {/* 订单信息 */}
                <section className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <div className="w-1 h-4 bg-indigo-500 rounded-full" />
                    {t.commission_audit.details.order_info}
                  </h3>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">{t.commission_audit.table.order_id}</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300">{selectedRecord.orderId}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">{t.commission_audit.table.order_amount}</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">¥{selectedRecord.orderAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">{t.commission_audit.table.paid_amount}</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">¥{selectedRecord.paidAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">{t.commission_audit.table.rate}</span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold">{selectedRecord.rate}%</span>
                    </div>
                  </div>
                </section>

                {/* 结算信息 */}
                <section className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <div className="w-1 h-4 bg-indigo-500 rounded-full" />
                    {t.commission_audit.details.payout_info}
                  </h3>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">{t.commission_audit.table.alipay}</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">{selectedRecord.alipay}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">{t.commission_audit.table.recipient}</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">{selectedRecord.recipient}</span>
                    </div>
                    {selectedRecord.payoutTime && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">{t.commission_audit.tabs.paid}</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">{selectedRecord.payoutTime}</span>
                      </div>
                    )}
                  </div>
                </section>

                {/* 备注 */}
                <section className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <div className="w-1 h-4 bg-indigo-500 rounded-full" />
                    {t.commission_audit.table.remark}
                  </h3>
                  <textarea
                    placeholder={t.commission_audit.details.remark_placeholder}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 min-h-[100px] transition-all"
                    defaultValue={selectedRecord.remark}
                  />
                </section>
              </div>

              {/* 抽屉操作 */}
              <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col gap-3">
                {selectedRecord.status === 'pending' && (
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => handleStatusUpdate(selectedRecord.id, 'payout')}
                      disabled={isSaving}
                      className="flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 dark:shadow-none"
                    >
                      {isSaving ? (
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      ) : (
                        <CheckCircle2 size={18} />
                      )}
                      {t.commission_audit.actions.approve}
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(selectedRecord.id, 'rejected')}
                      disabled={isSaving}
                      className="flex items-center justify-center gap-2 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl font-bold transition-all disabled:opacity-50"
                    >
                      <XCircle size={18} />
                      {t.commission_audit.actions.reject}
                    </button>
                  </div>
                )}
                {selectedRecord.status === 'payout' && (
                  <button 
                    onClick={() => handleStatusUpdate(selectedRecord.id, 'paid')}
                    disabled={isSaving}
                    className="flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 dark:shadow-none"
                  >
                    {isSaving ? (
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <CreditCard size={18} />
                    )}
                    {t.commission_audit.actions.mark_paid}
                  </button>
                )}
                <button 
                  onClick={() => setIsDrawerOpen(false)}
                  disabled={isSaving}
                  className="w-full py-2.5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium transition-all disabled:opacity-50"
                >
                  {t.common.cancel || 'Cancel'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
