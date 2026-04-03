import React from 'react';
import { ArrowLeft, Receipt, CheckCircle2 } from 'lucide-react';
import { Translations } from '../i18n';

interface Transaction {
  id: string;
  date: string;
  amount: string;
  plan: string;
  status: 'success' | 'failed';
}

interface TransactionsProps {
  transactions: Transaction[];
  onBack: () => void;
  t: Translations;
}

/**
 * 交易记录组件
 * 展示用户的充值和套餐购买历史
 */
export const Transactions = ({ transactions, onBack, t }: TransactionsProps) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{t.transactions.title}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{t.transactions.subtitle}</p>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-80 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm animate-in fade-in duration-500">
          <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-300 dark:text-slate-600 mb-4 border border-slate-100 dark:border-slate-700/50">
            <Receipt size={32} strokeWidth={1.5} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 tracking-tight">{t.common.empty_transactions_title}</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs leading-relaxed">{t.common.empty_transactions_desc}</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4 whitespace-nowrap">{t.transactions.table.id}</th>
                  <th className="px-6 py-4 whitespace-nowrap">{t.transactions.table.plan}</th>
                  <th className="px-6 py-4 whitespace-nowrap">{t.transactions.table.amount}</th>
                  <th className="px-6 py-4 whitespace-nowrap">{t.transactions.table.date}</th>
                  <th className="px-6 py-4 whitespace-nowrap">{t.transactions.table.status}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-slate-500 dark:text-slate-500">{tx.id}</td>
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{tx.plan}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{tx.amount}</td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{tx.date}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        tx.status === 'success' 
                          ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' 
                          : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                      }`}>
                        {tx.status === 'success' ? <CheckCircle2 size={12} /> : null}
                        {tx.status === 'success' ? t.transactions.table.success : t.transactions.table.failed}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
