import React, { useState } from 'react';
import { ArrowLeft, Wallet, CheckCircle2, AlertCircle, Save, Edit2, Info, ShieldCheck, User, CreditCard } from 'lucide-react';
import { motion } from 'motion/react';

interface AlipayInfoProps {
  t: any;
  onBack: () => void;
  setToast?: (toast: { message: string, type: 'success' | 'error' | 'info' | 'warning' } | null) => void;
}

export const AlipayInfo = ({ t, onBack, setToast }: AlipayInfoProps) => {
  // Mock initial state: Filled
  const [isFilled, setIsFilled] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string | null>('2024-03-20 14:30');
  
  const [formData, setFormData] = useState({
    account: 'donny.li.826@gmail.com',
    name: '李*'
  });

  const [errors, setErrors] = useState({
    account: false,
    name: false
  });

  const handleSave = () => {
    const newErrors = {
      account: !formData.account.trim(),
      name: !formData.name.trim()
    };
    
    setErrors(newErrors);

    if (newErrors.account || newErrors.name) {
      if (setToast) {
        setToast({ message: t.common.error_save, type: 'warning' });
      }
      return;
    }

    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setIsFilled(true);
      setIsEditing(false);
      setLastUpdate(new Date().toLocaleString());
      
      if (setToast) {
        setToast({ message: t.common.save_success, type: 'success' });
      }
    }, 1000);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  // Helper to mask sensitive info
  const maskAccount = (account: string) => {
    if (!account) return '';
    if (account.includes('@')) {
      const [user, domain] = account.split('@');
      return `${user.slice(0, 2)}***@${domain}`;
    }
    if (account.length >= 7) {
      return `${account.slice(0, 3)}****${account.slice(-4)}`;
    }
    return account;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
      {/* A. Header Section */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Wallet className="text-indigo-500" size={24} />
            {t.promotion_center.alipay_info.title}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {t.promotion_center.alipay_info.desc}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* B. Current Status Area */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isFilled ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'
                }`}>
                  {isFilled ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{t.promotion_center.alipay_info.status_label}</p>
                  <p className={`text-sm font-bold ${isFilled ? 'text-emerald-500' : 'text-slate-400'}`}>
                    {isFilled ? t.promotion_center.alipay_info.filled : t.promotion_center.alipay_info.not_filled}
                  </p>
                </div>
              </div>
              {lastUpdate && (
                <div className="text-right">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{t.promotion_center.alipay_info.last_update}</p>
                  <p className="text-xs text-slate-400">{lastUpdate}</p>
                </div>
              )}
            </div>

            {isFilled && !isEditing && (
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-4 border border-slate-100 dark:border-slate-700">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-slate-500">
                    <User size={16} />
                    <span className="text-sm">{t.promotion_center.alipay_info.account_label}</span>
                  </div>
                  <span className="text-sm font-mono font-bold text-slate-900 dark:text-white">{maskAccount(formData.account)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-slate-500">
                    <CreditCard size={16} />
                    <span className="text-sm">{t.promotion_center.alipay_info.name_label}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{formData.name}</span>
                </div>
              </div>
            )}
          </div>

          {/* C. Form Area */}
          {isEditing && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm space-y-6"
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    {t.promotion_center.alipay_info.account_label}
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.account}
                    onChange={(e) => setFormData({ ...formData, account: e.target.value })}
                    placeholder={t.promotion_center.alipay_info.account_placeholder}
                    className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border ${
                      errors.account ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                    } rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 dark:text-white`}
                  />
                  {errors.account && <p className="text-xs text-rose-500 mt-1">{t.common.error_save}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    {t.promotion_center.alipay_info.name_label}
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t.promotion_center.alipay_info.name_placeholder}
                    className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border ${
                      errors.name ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                    } rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 dark:text-white`}
                  />
                  {errors.name && <p className="text-xs text-rose-500 mt-1">{t.common.error_save}</p>}
                </div>
              </div>

              {/* D. Action Buttons */}
              <div className="flex items-center gap-4 pt-4">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save size={18} />
                  )}
                  {t.promotion_center.alipay_info.save_btn}
                </button>
                <button
                  onClick={isFilled ? () => setIsEditing(false) : onBack}
                  disabled={isSaving}
                  className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all disabled:opacity-50"
                >
                  {t.common.cancel}
                </button>
              </div>
            </motion.div>
          )}

          {isFilled && !isEditing && (
            <div className="flex justify-center">
              <button
                onClick={handleEdit}
                className="px-8 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:border-indigo-500 hover:text-indigo-500 transition-all flex items-center gap-2 shadow-sm"
              >
                <Edit2 size={18} />
                {t.promotion_center.alipay_info.edit_btn}
              </button>
            </div>
          )}
        </div>

        {/* Tips Section */}
        <div className="space-y-6">
          <div className="bg-indigo-50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-4">
              <Info size={18} />
              {t.promotion_center.alipay_info.tip_title}
            </h3>
            <ul className="space-y-3">
              {t.promotion_center.alipay_info.tips.map((tip: string, index: number) => (
                <li key={index} className="flex items-start gap-2 text-xs text-indigo-700/70 dark:text-indigo-300/60 leading-relaxed">
                  <div className="w-1 h-1 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-center gap-2 text-slate-400">
            <ShieldCheck size={16} />
            <span className="text-[10px] font-medium uppercase tracking-wider">{t.promotion_center.alipay_info.security_tip}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
