import React, { useState, useEffect } from 'react';
import { LayoutDashboard, History, LogOut, CreditCard, ChevronDown, Sparkles, Send, Moon, Sun, User, Megaphone, Settings, ClipboardCheck } from 'lucide-react';
import { ViewState, UserProfile } from '../types';
import { Language, translations } from '../i18n';

interface LayoutProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  user: UserProfile | null;
  onLoginClick: () => void;
  onLogout: () => void;
  children: React.ReactNode;
  language: Language;
  setLanguage: (lang: Language) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
}

export const Layout = ({ 
  currentView, 
  onChangeView, 
  user, 
  onLoginClick, 
  onLogout, 
  children,
  language,
  setLanguage,
  isDarkMode,
  setIsDarkMode
}: LayoutProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const t = translations[language];

  const navItems = [
    { id: 'workspace', label: t.nav.workspace },
    { id: 'mass_send', label: t.nav.mass_send },
    { id: 'design_system', label: t.nav.design_system },
  ].filter(item => item.id !== 'design_system');

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans transition-colors duration-200">
      {/* Top Navigation */}
      <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 shrink-0 z-10 relative transition-colors duration-200">
        <div className="flex items-center gap-10">
          {/* Logo */}
          <div className="flex items-center gap-2 text-indigo-600">
            <Sparkles size={24} className="fill-indigo-100" />
            <span className="text-xl font-bold tracking-tight">ZIMO 灵鸮</span>
          </div>

          {/* Primary Nav */}
          <nav className="hidden md:flex items-center gap-1 h-full">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onChangeView(item.id as ViewState)}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
                    isActive 
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/10' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-[-16px] left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-t-full" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Area: Global Controls & User */}
        <div className="flex items-center gap-3 relative">
          {/* My Plan Shortcut */}
          {user && (
            <button
              onClick={() => onChangeView('my_plan')}
              className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-full text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-all group mr-1"
            >
              <CreditCard size={14} className="group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold whitespace-nowrap">
                {user.plan === 'free' ? t.user.plans.free : user.plan === 'basic' ? t.user.plans.basic : t.user.plans.pro}
              </span>
            </button>
          )}

          {/* Theme Toggle Sliding Switch */}
          <div 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-14 h-7 bg-slate-200 dark:bg-slate-700 rounded-full p-1 cursor-pointer relative transition-colors duration-300 flex items-center"
          >
            <div className={`absolute w-5 h-5 bg-white dark:bg-slate-900 rounded-full shadow-sm transform transition-transform duration-300 flex items-center justify-center z-10 ${isDarkMode ? 'translate-x-7' : 'translate-x-0'}`}>
              {isDarkMode ? <Moon size={12} className="text-indigo-400" /> : <Sun size={12} className="text-amber-500" />}
            </div>
            <div className="flex justify-between w-full px-1.5">
              <Moon size={12} className={`${!isDarkMode ? 'opacity-0' : 'opacity-40 text-slate-500'}`} />
              <Sun size={12} className={`${isDarkMode ? 'opacity-0' : 'opacity-40 text-slate-400'}`} />
            </div>
          </div>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
            className="h-7 px-2.5 flex items-center justify-center rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700"
          >
            {language === 'zh' ? 'EN' : '中文'}
          </button>

          <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1"></div>

          {!user ? (
            <button 
              onClick={onLoginClick}
              className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-white px-5 py-2 rounded-full text-sm font-medium transition-colors shadow-sm ml-1"
            >
              {t.user.login}
            </button>
          ) : (
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 p-1.5 pr-3 rounded-full border border-slate-200 dark:border-slate-700 transition-colors ml-1"
              >
                <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800" />
                <div className="flex flex-col items-start text-left hidden sm:flex">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-none">{user.name}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider font-semibold">
                    {user.plan === 'free' ? t.user.plans.free : user.plan === 'basic' ? t.user.plans.basic : t.user.plans.pro}
                  </span>
                </div>
                <ChevronDown size={14} className="text-slate-400 ml-1" />
              </button>

              {/* Dropdown */}
              {isDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-3 border-b border-slate-50 dark:border-slate-700/50 mb-1">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{t.user.quota}</p>
                      <p className="text-lg font-bold text-slate-800 dark:text-slate-100">
                        {user.quota === 'unlimited' ? t.user.unlimited : user.quota} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">{t.user.unit}</span>
                      </p>
                    </div>
                    
                    <button 
                      onClick={() => { onChangeView('account'); setIsDropdownOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      <User size={16} className="text-slate-400" />
                      {t.user.account}
                    </button>
                    <button 
                      onClick={() => { onChangeView('referral_dashboard'); setIsDropdownOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      <Megaphone size={16} className="text-slate-400" />
                      {t.user.promotion_center}
                    </button>
                    <button 
                      onClick={() => { onChangeView('history'); setIsDropdownOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      <History size={16} className="text-slate-400" />
                      {t.user.history}
                    </button>
                    <button 
                      onClick={() => { onChangeView('my_plan'); setIsDropdownOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      <CreditCard size={16} className="text-slate-400" />
                      {t.user.my_plan}
                    </button>
                    <div className="h-px bg-slate-100 dark:bg-slate-700 my-1"></div>
                    
                    {/* Admin Section */}
                    <div className="px-4 py-1.5">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{language === 'zh' ? '后台管理' : 'Management'}</p>
                    </div>
                    <button 
                      onClick={() => { onChangeView('distribution_config'); setIsDropdownOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      <Settings size={16} className="text-slate-400" />
                      {t.distribution_config.title}
                    </button>
                    <button 
                      onClick={() => { onChangeView('commission_audit'); setIsDropdownOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      <ClipboardCheck size={16} className="text-slate-400" />
                      {t.commission_audit.title}
                    </button>

                    <div className="h-px bg-slate-100 dark:bg-slate-700 my-1"></div>
                    <button 
                      onClick={() => { onLogout(); setIsDropdownOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut size={16} className="text-red-400" />
                      {t.user.logout}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
