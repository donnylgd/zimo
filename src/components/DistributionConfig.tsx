import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  AlertTriangle,
  X,
  CheckCircle2,
  Globe,
  Search,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DistributionConfigProps {
  t: any;
  onBack?: () => void;
  setToast?: (toast: { message: string, type: 'success' | 'error' | 'info' | 'warning' } | null) => void;
}

interface SingleAccountConfig {
  id: string;
  account: string;
  isEnabled: boolean;
  useGlobal: boolean;
  commissionRate: number;
  regReward: number;
  actReward: number;
  firstOrderReward: number;
  auditDays: number;
  allowCash: boolean;
  rewardLimit: number;
  startTime: string;
  endTime: string;
  remark: string;
}

export const DistributionConfig = ({ t, onBack, setToast }: DistributionConfigProps) => {
  // A. Global Default Configuration State
  const [globalConfig, setGlobalConfig] = useState({
    isEnabled: true,
    isQuotaRewardEnabled: true,
    isCashCommissionEnabled: true,
    regReward: 50,
    actReward: 100,
    firstOrderReward: 200,
    commissionRate: 10,
    auditDays: 30,
    requireAlipay: true,
    allowOverride: true
  });

  // B. Single Account Configuration State
  const [accounts, setAccounts] = useState<SingleAccountConfig[]>([
    {
      id: '1',
      account: '138****8888',
      isEnabled: true,
      useGlobal: false,
      commissionRate: 15,
      regReward: 60,
      actReward: 120,
      firstOrderReward: 300,
      auditDays: 15,
      allowCash: true,
      rewardLimit: 5000,
      startTime: '2024-03-01',
      endTime: '2025-03-01',
      remark: '优质推广员，特殊优待'
    },
    {
      id: '2',
      account: '155****6666',
      isEnabled: true,
      useGlobal: true,
      commissionRate: 10,
      regReward: 50,
      actReward: 100,
      firstOrderReward: 200,
      auditDays: 30,
      allowCash: true,
      rewardLimit: 1000,
      startTime: '2024-01-01',
      endTime: '2024-12-31',
      remark: '普通推广员'
    }
  ]);

  const [activeTab, setActiveTab] = useState<'global' | 'account'>('global');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<SingleAccountConfig | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);

  // Simulate initial loading
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredAccounts = accounts.filter(a => 
    a.account.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.remark.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveGlobal = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      if (setToast) {
        setToast({ message: t.distribution_config.save_success, type: 'success' });
      }
    }, 1000);
  };

  const handleOpenDrawer = (account?: SingleAccountConfig) => {
    if (account) {
      setEditingAccount({ ...account });
    } else {
      setEditingAccount({
        id: Math.random().toString(36).substr(2, 9),
        account: '',
        isEnabled: true,
        useGlobal: true,
        commissionRate: 10,
        regReward: 50,
        actReward: 100,
        firstOrderReward: 200,
        auditDays: 30,
        allowCash: true,
        rewardLimit: 1000,
        startTime: '',
        endTime: '',
        remark: ''
      });
    }
    setIsDrawerOpen(true);
  };

  const handleSaveAccount = () => {
    if (!editingAccount) return;
    
    if (!editingAccount.account.trim()) {
      if (setToast) {
        setToast({ message: t.distribution_config.account_required || "Account is required", type: 'warning' });
      }
      return;
    }

    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      if (accounts.find(a => a.id === editingAccount.id)) {
        setAccounts(accounts.map(a => a.id === editingAccount.id ? editingAccount : a));
      } else {
        setAccounts([...accounts, editingAccount]);
      }
      
      setIsSaving(false);
      setIsDrawerOpen(false);
      if (setToast) {
        setToast({ message: t.distribution_config.save_success, type: 'success' });
      }
    }, 1000);
  };

  const handleDeleteAccount = (id: string) => {
    setAccountToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (accountToDelete) {
      setIsSaving(true);
      // Simulate API call
      setTimeout(() => {
        setAccounts(accounts.filter(a => a.id !== accountToDelete));
        setIsSaving(false);
        setIsDeleteConfirmOpen(false);
        setAccountToDelete(null);
        if (setToast) {
          setToast({ message: t.distribution_config.delete_success || "Account configuration deleted", type: 'success' });
        }
      }, 800);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-24 animate-in fade-in duration-500">
      {/* Dev Mode Banner */}
      <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-4 flex items-start gap-3">
        <AlertTriangle className="text-amber-500 shrink-0" size={20} />
        <div>
          <h4 className="text-sm font-bold text-amber-800 dark:text-amber-400">
            {t.distribution_config.dev_banner_title}
          </h4>
          <p className="text-xs text-amber-700/70 dark:text-amber-400/60 mt-1">
            {t.distribution_config.dev_banner_desc}
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center gap-4">
          {onBack && (
            <button 
              onClick={onBack}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors mb-1"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Settings className="text-blue-500" size={24} />
              {t.distribution_config.title}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              {t.distribution_config.desc}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('global')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'global'
                ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Globe size={16} />
            {t.distribution_config.global_title}
          </button>
          <button
            onClick={() => setActiveTab('account')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'account'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <User size={16} />
            {t.distribution_config.account_title}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
          <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-sm text-slate-500 animate-pulse">{t.common.loading || "Loading configuration..."}</p>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'global' ? (
            /* A. Global Default Configuration */
            <div className="max-w-2xl mx-auto">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                      <Settings size={20} className="text-blue-500" />
                      {t.distribution_config.global_title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">{t.distribution_config.global_desc || "Set default rules for all promoters"}</p>
                  </div>
                  <button 
                    onClick={handleSaveGlobal}
                    disabled={isSaving}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
                  >
                    {isSaving ? (
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Save size={16} />
                    )}
                    {t.user.save}
                  </button>
                </div>

                <div className="space-y-8">
                  <div className="flex items-center justify-between p-4 bg-blue-50/50 dark:bg-blue-500/5 rounded-2xl border border-blue-100 dark:border-blue-500/20">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-blue-900 dark:text-blue-300">{t.distribution_config.fields.is_enabled}</p>
                      <p className="text-xs text-blue-700/60 dark:text-blue-400/60">{t.distribution_config.fields.is_enabled_desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={globalConfig.isEnabled}
                        onChange={(e) => setGlobalConfig({ ...globalConfig, isEnabled: e.target.checked })}
                      />
                      <div className="w-12 h-6.5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5.5 after:w-5.5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t.distribution_config.reward_switch || "Reward Switches"}</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">{t.distribution_config.fields.is_quota_reward}</span>
                        <input 
                          type="checkbox" 
                          checked={globalConfig.isQuotaRewardEnabled}
                          onChange={(e) => setGlobalConfig({ ...globalConfig, isQuotaRewardEnabled: e.target.checked })}
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">{t.distribution_config.fields.is_cash_commission}</span>
                        <input 
                          type="checkbox" 
                          checked={globalConfig.isCashCommissionEnabled}
                          onChange={(e) => setGlobalConfig({ ...globalConfig, isCashCommissionEnabled: e.target.checked })}
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t.distribution_config.policy_settings || "Policy Settings"}</h4>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <p className="text-sm text-slate-600 dark:text-slate-400">{t.distribution_config.fields.require_alipay}</p>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={globalConfig.requireAlipay}
                          onChange={(e) => setGlobalConfig({ ...globalConfig, requireAlipay: e.target.checked })}
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <p className="text-sm text-slate-600 dark:text-slate-400">{t.distribution_config.fields.allow_override}</p>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={globalConfig.allowOverride}
                          onChange={(e) => setGlobalConfig({ ...globalConfig, allowOverride: e.target.checked })}
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.distribution_config.fields.reg_reward}</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          value={globalConfig.regReward}
                          onChange={(e) => setGlobalConfig({ ...globalConfig, regReward: Number(e.target.value) })}
                          className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-mono">Quota</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.distribution_config.fields.act_reward}</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          value={globalConfig.actReward}
                          onChange={(e) => setGlobalConfig({ ...globalConfig, actReward: Number(e.target.value) })}
                          className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-mono">Quota</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.distribution_config.fields.commission_rate}</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          value={globalConfig.commissionRate}
                          onChange={(e) => setGlobalConfig({ ...globalConfig, commissionRate: Number(e.target.value) })}
                          className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-mono">%</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.distribution_config.fields.audit_days}</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          value={globalConfig.auditDays}
                          onChange={(e) => setGlobalConfig({ ...globalConfig, auditDays: Number(e.target.value) })}
                          className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-mono">Days</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* B. Single Account Distribution Configuration */
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <User size={18} className="text-indigo-500" />
                      {t.distribution_config.account_title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">{t.distribution_config.account_desc}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t.common.search_placeholder || "Search..."}
                        className="pl-9 pr-10 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-48 sm:w-64 transition-all"
                      />
                      <Settings size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      {searchQuery && (
                        <button 
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                    <button 
                      onClick={() => handleOpenDrawer()}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20 shrink-0"
                    >
                      <Plus size={16} />
                      {t.distribution_config.add_account}
                    </button>
                  </div>
                </div>

                {/* Account List */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800">
                        <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{t.distribution_config.table.account}</th>
                        <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{t.distribution_config.table.mode}</th>
                        <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{t.distribution_config.table.rate}</th>
                        <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{t.distribution_config.table.status}</th>
                        <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">{t.user.actions}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                      {filteredAccounts.length > 0 ? (
                        filteredAccounts.map((account) => (
                          <tr key={account.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                            <td className="py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                  <User size={14} />
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-slate-900 dark:text-white">{account.account}</p>
                                  <p className="text-[10px] text-slate-500 truncate max-w-[150px]">{account.remark || '-'}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                account.useGlobal 
                                  ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' 
                                  : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400'
                              }`}>
                                {account.useGlobal ? t.distribution_config.table.mode_global : t.distribution_config.table.mode_custom}
                              </span>
                            </td>
                            <td className="py-4">
                              <p className="text-sm font-mono font-medium text-slate-700 dark:text-slate-300">{account.commissionRate}%</p>
                            </td>
                            <td className="py-4">
                              <div className="flex items-center gap-1.5">
                                <div className={`w-1.5 h-1.5 rounded-full ${account.isEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                <span className="text-xs text-slate-600 dark:text-slate-400">
                                  {account.isEnabled ? t.user.enabled : t.user.disabled}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button 
                                  onClick={() => handleOpenDrawer(account)}
                                  className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-all"
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button 
                                  onClick={() => handleDeleteAccount(account.id)}
                                  className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-all"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-12 text-center">
                            <div className="flex flex-col items-center justify-center space-y-2 opacity-40">
                              <User size={32} />
                              <p className="text-sm">{t.common.no_data || "No accounts found"}</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteConfirmOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteConfirmOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl z-[111] p-6"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 bg-rose-50 dark:bg-rose-500/10 rounded-full flex items-center justify-center">
                  <Trash2 size={24} className="text-rose-500" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{t.user.logout_confirm_title || "Confirm Delete"}</h3>
                  <p className="text-sm text-slate-500 mt-1">{t.user.logout_confirm_desc || "Are you sure you want to delete this configuration?"}</p>
                </div>
                <div className="flex gap-3 w-full pt-2">
                  <button 
                    onClick={() => setIsDeleteConfirmOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                  >
                    {t.user.cancel}
                  </button>
                  <button 
                    onClick={confirmDelete}
                    disabled={isSaving}
                    className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white text-sm font-bold transition-all shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2"
                  >
                    {isSaving && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
                    {t.user.confirm_logout || "Delete"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Single Account Config Drawer */}
      <AnimatePresence>
        {isDrawerOpen && editingAccount && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl z-[101] flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    {editingAccount.account ? t.distribution_config.edit_account : t.distribution_config.add_account}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">{t.distribution_config.drawer_desc}</p>
                </div>
                <button 
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.distribution_config.fields.account}</label>
                    <input 
                      type="text" 
                      value={editingAccount.account}
                      onChange={(e) => setEditingAccount({ ...editingAccount, account: e.target.value })}
                      placeholder="Enter phone or UID"
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-indigo-50/50 dark:bg-indigo-500/5 rounded-xl border border-indigo-100 dark:border-indigo-500/20">
                    <div className="space-y-0.5">
                      <p className="text-sm font-bold text-indigo-900 dark:text-indigo-300">{t.distribution_config.fields.use_global}</p>
                      <p className="text-[10px] text-indigo-600/70 dark:text-indigo-400/60">{t.distribution_config.fields.use_global_desc}</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={editingAccount.useGlobal}
                      onChange={(e) => setEditingAccount({ ...editingAccount, useGlobal: e.target.checked })}
                      className="w-4 h-4 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Custom Rules (Only if useGlobal is false) */}
                <div className={`space-y-6 transition-all duration-300 ${editingAccount.useGlobal ? 'opacity-40 pointer-events-none grayscale' : ''}`}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.distribution_config.fields.commission_rate}</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          value={editingAccount.commissionRate}
                          onChange={(e) => setEditingAccount({ ...editingAccount, commissionRate: Number(e.target.value) })}
                          className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">%</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.distribution_config.fields.audit_days}</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          value={editingAccount.auditDays}
                          onChange={(e) => setEditingAccount({ ...editingAccount, auditDays: Number(e.target.value) })}
                          className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">D</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.distribution_config.fields.reg_reward}</label>
                      <input 
                        type="number" 
                        value={editingAccount.regReward}
                        onChange={(e) => setEditingAccount({ ...editingAccount, regReward: Number(e.target.value) })}
                        className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.distribution_config.fields.act_reward}</label>
                      <input 
                        type="number" 
                        value={editingAccount.actReward}
                        onChange={(e) => setEditingAccount({ ...editingAccount, actReward: Number(e.target.value) })}
                        className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.distribution_config.fields.first_order_reward}</label>
                    <input 
                      type="number" 
                      value={editingAccount.firstOrderReward}
                      onChange={(e) => setEditingAccount({ ...editingAccount, firstOrderReward: Number(e.target.value) })}
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.distribution_config.fields.reward_limit}</label>
                    <input 
                      type="number" 
                      value={editingAccount.rewardLimit}
                      onChange={(e) => setEditingAccount({ ...editingAccount, rewardLimit: Number(e.target.value) })}
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.distribution_config.fields.start_time}</label>
                      <input 
                        type="date" 
                        value={editingAccount.startTime}
                        onChange={(e) => setEditingAccount({ ...editingAccount, startTime: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.distribution_config.fields.end_time}</label>
                      <input 
                        type="date" 
                        value={editingAccount.endTime}
                        onChange={(e) => setEditingAccount({ ...editingAccount, endTime: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.distribution_config.fields.remark}</label>
                  <textarea 
                    value={editingAccount.remark}
                    onChange={(e) => setEditingAccount({ ...editingAccount, remark: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                    placeholder="Add internal notes..."
                  />
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center gap-4">
                <button 
                  onClick={handleSaveAccount}
                  disabled={isSaving}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <CheckCircle2 size={18} />
                  )}
                  {t.user.save}
                </button>
                <button 
                  onClick={() => setIsDrawerOpen(false)}
                  disabled={isSaving}
                  className="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all disabled:opacity-50"
                >
                  {t.user.cancel}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
