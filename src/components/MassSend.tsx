import React from 'react';
import { Mail, Sparkles } from 'lucide-react';
import { Translations } from '../i18n';

interface MassSendProps {
  t: Translations;
}

export const MassSend = ({ t }: MassSendProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-in fade-in duration-500">
      <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 rounded-3xl flex items-center justify-center text-indigo-500 dark:text-indigo-400 mb-6 shadow-sm border border-indigo-100/50 dark:border-indigo-800/50">
        <Mail size={36} />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
        {t.mass_send.title} <span className="text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">{t.mass_send.developing}</span>
      </h2>
      <p className="text-slate-500 dark:text-slate-400 max-w-md text-base leading-relaxed">
        {t.mass_send.desc}
      </p>
      
      <div className="mt-10 flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 font-medium bg-indigo-50/50 dark:bg-indigo-900/20 px-4 py-2 rounded-full border border-indigo-100 dark:border-indigo-800">
        <Sparkles size={16} />
        {t.mass_send.coming_soon}
      </div>
    </div>
  );
};
