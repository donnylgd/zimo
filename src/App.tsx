import React, { useState, useEffect } from 'react';
import { ViewState, UserProfile, PaymentState, PromotionStatus } from './types';
import { Layout } from './components/Layout';
import { Workspace } from './components/Workspace';
import { History, Task } from './components/History';
import { TaskDetail, TaskResult } from './components/TaskDetail';
import { MyPlan } from './components/MyPlan';
import { Transactions } from './components/Transactions';
import { MassSend } from './components/MassSend';
import { AccountCenter } from './components/AccountCenter';
import { DesignSystem } from './components/DesignSystem';
import { PromotionCenter } from './components/PromotionCenter';
import { InviteHistory } from './components/InviteHistory';
import { RewardHistory } from './components/RewardHistory';
import { AlipayInfo } from './components/AlipayInfo';
import { DistributionConfig } from './components/DistributionConfig';
import { CommissionAudit } from './components/CommissionAudit';
import { ReferralDashboard } from './components/ReferralDashboard';
import { PromotionApply } from './components/PromotionApply';
import { PromotionForm } from './components/PromotionForm';
import { PromotionPending } from './components/PromotionPending';
import { PromotionRejected } from './components/PromotionRejected';
import { Modal, Toast, MobilePrompt, ToastType } from './components/Shared';
import { QrCode, Loader2, CheckCircle2, AlertCircle, Eye, EyeOff, Settings, ClipboardCheck } from 'lucide-react';
import { translations, Language } from './i18n';
import { AnimatePresence, motion } from 'motion/react';

// Mock Data
// ... (omitted for brevity in this thought, but I'll include the full block in the actual call)

// Mock Data
const MOCK_TASKS: Task[] = [
  { id: 't1', filename: 'influencers_tech.csv', date: '2024-03-20 14:30', status: 'completed', total: 150, completed: 150, style: 'professional', stage: 'initial', subject: 'Paid Collaboration: Innovative Tech Gadget for Your Audience', brandSize: 'large', enableFirstSentenceStrategy: true, firstSentenceValues: ['data'] },
  { id: 't2', filename: 'beauty_creators_us.csv', date: '2024-03-19 09:15', status: 'failed', total: 500, completed: 120, style: 'casual', stage: 'details', subject: '【Brand Name】Collaboration Details & Next Steps', brandSize: 'small', enableFirstSentenceStrategy: false },
];

const MOCK_RESULTS: TaskResult[] = [
  { id: 'r1', creatorName: '@tech_guru', followers: '1.2M', generatedCopy: 'Hi Tech Guru, we love your recent review of the smart home hub. We are launching a new Smart Vacuum V2 with 5000Pa suction and auto-dust collection. Would you be interested in testing it out? Let me know!', status: 'success' },
  { id: 'r2', creatorName: '@gadget_girl', followers: '850K', generatedCopy: 'Dear Gadget Girl, your in-depth tech analyses are fantastic. Our new Smart Vacuum V2 features anti-tangle technology perfect for pet owners. We would be honored if you reviewed it.', status: 'success' },
  { id: 'r3', creatorName: '@beauty_queen', followers: '2.1M', generatedCopy: '', status: 'failed', failureReason: '数据字段缺失，未完成生成' },
  { id: 'r4', creatorName: '@lifestyle_vlog', followers: '450K', generatedCopy: 'Hey there! We saw your vlog about home organization. Our new Smart Vacuum V2 would fit perfectly in your next video. It has a sleek design and powerful suction.', status: 'success' },
  { id: 'r5', creatorName: '@home_decor', followers: '320K', generatedCopy: '', status: 'failed', failureReason: '内容生成异常，请重新执行任务' },
  { id: 'r6', creatorName: '@clean_freak', followers: '150K', generatedCopy: 'Hello! As someone who loves a clean home, you will appreciate our new Smart Vacuum V2. It is quiet yet powerful. Interested in a collaboration?', status: 'success' },
  { id: 'r7', creatorName: '@tech_insider', followers: '900K', generatedCopy: 'Hi! We have a new product that your tech-savvy audience will love. The Smart Vacuum V2 is our most advanced model yet.', status: 'success' },
  { id: 'r8', creatorName: '@minimalist_living', followers: '280K', generatedCopy: '', status: 'failed', failureReason: '未生成成功，请稍后重试' },
  { id: 'r9', creatorName: '@modern_home', followers: '540K', generatedCopy: 'Hi! Your home aesthetic is beautiful. Our Smart Vacuum V2 would be a great addition to your cleaning routine.', status: 'success' },
  { id: 'r10', creatorName: '@smart_tech', followers: '1.1M', generatedCopy: 'Greetings! We are looking for partners to showcase the Smart Vacuum V2. Its AI mapping technology is industry-leading.', status: 'success' },
  { id: 'r11', creatorName: '@future_tech', followers: '750K', generatedCopy: 'Hello! The future of cleaning is here with our Smart Vacuum V2. We would love to see it on your channel.', status: 'success' },
  { id: 'r12', creatorName: '@daily_vlogs', followers: '120K', generatedCopy: '', status: 'failed', failureReason: '内容生成异常，请重新执行任务' },
];

function LoginContent({ t, onLogin, onForgotPassword }: { t: any, onLogin: () => void, onForgotPassword: (phone: string) => void }) {
  const [loginMode, setLoginMode] = useState<'code' | 'password'>('code');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [captcha, setCaptcha] = useState('');
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isSending, setIsSending] = useState(false);

  const handleSendCode = () => {
    if (!phone || phone.length < 11) return;
    
    // Simulate risk control trigger for specific number or high frequency
    // For demo purposes, we'll trigger it if it's not already shown
    if (!showCaptcha) {
      setShowCaptcha(true);
      return;
    }

    if (!captcha) return;

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 1000);
  };

  const isFormValid = loginMode === 'code' 
    ? phone.length === 11 && code.length === 6 && (!showCaptcha || captcha.length === 4)
    : phone.length === 11 && password.length >= 6;

  return (
    <div className="py-4">
      <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl mb-6">
        <button 
          onClick={() => setLoginMode('code')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${loginMode === 'code' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
        >
          {t.user.login_switch_code}
        </button>
        <button 
          onClick={() => setLoginMode('password')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${loginMode === 'password' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
        >
          {t.user.login_switch_password}
        </button>
      </div>

      <div className="space-y-4">
        {/* Risk Tip */}
        {showCaptcha && loginMode === 'code' && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-3 py-2 bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-lg"
          >
            <AlertCircle size={14} className="text-amber-500 shrink-0" />
            <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">{t.user.login_captcha_tip}</p>
          </motion.div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{t.user.login_phone}</label>
          <input 
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
            placeholder={t.user.login_phone_placeholder}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 dark:text-white"
          />
        </div>

        {loginMode === 'code' ? (
          <>
            {showCaptcha && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-1.5"
              >
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{t.user.login_captcha}</label>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={captcha}
                    onChange={(e) => setCaptcha(e.target.value.toUpperCase().slice(0, 4))}
                    placeholder={t.user.login_captcha_placeholder}
                    className="flex-1 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 dark:text-white"
                  />
                  <div className="w-24 h-[46px] bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden cursor-pointer select-none group" onClick={() => setCaptcha('')}>
                    <span className="font-mono text-lg font-bold tracking-widest text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 transition-colors italic skew-x-12">R8K2</span>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{t.user.login_code}</label>
              <div className="flex gap-2">
                <input 
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder={t.user.login_code_placeholder}
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 dark:text-white"
                />
                <button 
                  onClick={handleSendCode}
                  disabled={isSending || countdown > 0 || phone.length < 11 || (showCaptcha && !captcha)}
                  className="px-4 py-3 rounded-xl border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:bg-indigo-50 dark:hover:bg-indigo-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all min-w-[100px]"
                >
                  {isSending ? <Loader2 size={18} className="animate-spin mx-auto" /> : countdown > 0 ? `${countdown}s` : t.user.login_get_code}
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 ml-1">{t.user.login_auto_register_tip}</p>
            </div>
          </>
        ) : (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between ml-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.user.login_password}</label>
              <button 
                onClick={() => onForgotPassword(phone)}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {t.user.login_forgot_password}
              </button>
            </div>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.user.login_password_placeholder}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 dark:text-white pr-10"
              />
              <button 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        )}

        <div className="pt-4">
          <button 
            onClick={onLogin}
            disabled={!isFormValid}
            className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loginMode === 'code' ? t.user.login_btn_code : t.user.login_btn_password}
          </button>
        </div>
      </div>
    </div>
  );
}

function ForgotPasswordContent({ t, phone: initialPhone, onReset, onCancel, onGoBind }: { t: any, phone?: string, onReset: () => void, onCancel: () => void, onGoBind: () => void }) {
  const [method, setMethod] = useState<'phone' | 'email'>('phone');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isSending, setIsSending] = useState(false);

  const handleSendCode = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 1000);
  };

  const getPasswordError = (pass: string) => {
    if (!pass) return '';
    if (/\s/.test(pass)) return t.user.login_password_space_error;
    if (pass.length < 8 || pass.length > 20) return t.user.login_password_length_error;
    if (!(/[a-zA-Z]/.test(pass) && /[0-9]/.test(pass))) return t.user.login_password_complexity_error;
    if (/^(12345678|87654321|password|11111111)$/i.test(pass)) return t.user.login_password_too_simple_error;
    return '';
  };

  const passwordError = getPasswordError(newPassword);
  const isFormValid = code.length === 6 && !passwordError && newPassword.length >= 8 && newPassword === confirmPassword;

  // Mask phone/email (mocking email for forgot password if not logged in)
  const maskedPhone = initialPhone ? initialPhone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : '138****8888';
  // For forgot password, we might not know the email if not logged in, 
  // but the prompt says "已绑定时脱敏", implying we should show it if it exists.
  // In a real app, we'd fetch this. Here we'll mock it if phone matches a known one or just show a placeholder.
  const maskedEmail = initialPhone === '13882695270' ? 'do****@gmail.com' : ''; 

  return (
    <div className="py-4 space-y-4">
      {/* Switch Method */}
      <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl mb-2">
        <button 
          onClick={() => setMethod('phone')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${method === 'phone' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
        >
          {t.account.forgot_password_method_phone}
        </button>
        <button 
          onClick={() => setMethod('email')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${method === 'email' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
        >
          {t.account.forgot_password_method_email}
        </button>
      </div>

      {method === 'email' && !maskedEmail ? (
        <div className="py-6 flex flex-col items-center text-center space-y-4 animate-in fade-in duration-300">
          <div className="w-12 h-12 bg-amber-50 dark:bg-amber-500/10 rounded-full flex items-center justify-center">
            <AlertCircle size={24} className="text-amber-500" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-800 dark:text-white">{t.account.forgot_password_email_unbound_tip}</p>
          </div>
          <button 
            onClick={onGoBind}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all"
          >
            {t.account.forgot_password_go_bind}
          </button>
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
              {method === 'phone' ? t.user.login_phone : t.account.email}
            </label>
            <div className="px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-sm font-medium">
              {method === 'phone' ? maskedPhone : maskedEmail}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{t.user.login_code}</label>
            <div className="flex gap-2">
              <input 
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder={t.user.login_code_placeholder}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 dark:text-white"
              />
              <button 
                onClick={handleSendCode}
                disabled={isSending || countdown > 0}
                className="px-4 py-3 rounded-xl border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:bg-indigo-50 dark:hover:bg-indigo-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all min-w-[100px]"
              >
                {isSending ? <Loader2 size={18} className="animate-spin mx-auto" /> : countdown > 0 ? `${countdown}s` : t.user.login_get_code}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{t.user.login_new_password}</label>
            <div className="relative">
              <input 
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={t.user.login_new_password_placeholder}
                className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border ${passwordError ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-100 dark:border-slate-700 focus:ring-indigo-500/20 focus:border-indigo-500'} focus:outline-none focus:ring-2 transition-all text-slate-900 dark:text-white pr-10`}
              />
              <button 
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {passwordError ? (
              <p className="text-[10px] text-red-500 mt-1 ml-1">{passwordError}</p>
            ) : (
              <p className="text-[10px] text-slate-400 mt-1 ml-1 leading-relaxed">
                {t.user.login_password_rule_hint}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{t.user.login_confirm_password}</label>
            <div className="relative">
              <input 
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t.user.login_confirm_password_placeholder}
                className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border ${confirmPassword && newPassword !== confirmPassword ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-100 dark:border-slate-700 focus:ring-indigo-500/20 focus:border-indigo-500'} focus:outline-none focus:ring-2 transition-all text-slate-900 dark:text-white pr-10`}
              />
              <button 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-[10px] text-red-500 mt-1 ml-1">{t.user.login_password_match_error}</p>
            )}
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              onClick={onCancel}
              className="flex-1 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              {t.user.cancel}
            </button>
            <button 
              onClick={onReset}
              disabled={!isFormValid}
              className="flex-1 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {t.account.forgot_password_btn}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SetPasswordContent({ t, phone: initialPhone, onSet, onCancel }: { t: any, phone?: string, onSet: () => void, onCancel: () => void }) {
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isSending, setIsSending] = useState(false);

  const handleSendCode = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 1000);
  };

  const getPasswordError = (pass: string) => {
    if (!pass) return '';
    if (/\s/.test(pass)) return t.user.login_password_space_error;
    if (pass.length < 8 || pass.length > 20) return t.user.login_password_length_error;
    if (!(/[a-zA-Z]/.test(pass) && /[0-9]/.test(pass))) return t.user.login_password_complexity_error;
    if (/^(12345678|87654321|password|11111111)$/i.test(pass)) return t.user.login_password_too_simple_error;
    return '';
  };

  const passwordError = getPasswordError(newPassword);
  const isFormValid = code.length === 6 && !passwordError && newPassword.length >= 8 && newPassword === confirmPassword;
  const maskedPhone = initialPhone ? initialPhone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : '138****8888';

  return (
    <div className="py-4 space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{t.user.login_phone}</label>
        <div className="px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-sm font-medium">
          {maskedPhone}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{t.user.login_code}</label>
        <div className="flex gap-2">
          <input 
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder={t.user.login_code_placeholder}
            className="flex-1 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 dark:text-white"
          />
          <button 
            onClick={handleSendCode}
            disabled={isSending || countdown > 0}
            className="px-4 py-3 rounded-xl border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:bg-indigo-50 dark:hover:bg-indigo-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all min-w-[100px]"
          >
            {isSending ? <Loader2 size={18} className="animate-spin mx-auto" /> : countdown > 0 ? `${countdown}s` : t.user.login_get_code}
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{t.user.login_new_password}</label>
        <div className="relative">
          <input 
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder={t.user.login_new_password_placeholder}
            className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border ${passwordError ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-100 dark:border-slate-700 focus:ring-indigo-500/20 focus:border-indigo-500'} focus:outline-none focus:ring-2 transition-all text-slate-900 dark:text-white pr-10`}
          />
          <button 
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {passwordError ? (
          <p className="text-[10px] text-red-500 mt-1 ml-1">{passwordError}</p>
        ) : (
          <p className="text-[10px] text-slate-400 mt-1 ml-1 leading-relaxed">
            {t.user.login_password_rule_hint}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{t.user.login_confirm_password}</label>
        <div className="relative">
          <input 
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={t.user.login_confirm_password_placeholder}
            className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border ${confirmPassword && newPassword !== confirmPassword ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-100 dark:border-slate-700 focus:ring-indigo-500/20 focus:border-indigo-500'} focus:outline-none focus:ring-2 transition-all text-slate-900 dark:text-white pr-10`}
          />
          <button 
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {confirmPassword && newPassword !== confirmPassword && (
          <p className="text-[10px] text-red-500 mt-1 ml-1">{t.user.login_password_match_error}</p>
        )}
      </div>

      <div className="pt-4 flex gap-3">
        <button 
          onClick={onCancel}
          className="flex-1 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
        >
          {t.user.cancel}
        </button>
        <button 
          onClick={onSet}
          disabled={!isFormValid}
          className="flex-1 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {t.user.login_set_password_btn}
        </button>
      </div>
    </div>
  );
}

function ChangePasswordContent({ t, user, onSet, onCancel, onGoBind }: { t: any, user: UserProfile | null, onSet: () => void, onCancel: () => void, onGoBind: () => void }) {
  const [method, setMethod] = useState<'phone' | 'email'>('phone');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isSending, setIsSending] = useState(false);

  const handleSendCode = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 1000);
  };

  const getPasswordError = (pass: string) => {
    if (!pass) return '';
    if (/\s/.test(pass)) return t.user.login_password_space_error;
    if (pass.length < 8 || pass.length > 20) return t.user.login_password_length_error;
    if (!(/[a-zA-Z]/.test(pass) && /[0-9]/.test(pass))) return t.user.login_password_complexity_error;
    if (/^(12345678|87654321|password|11111111)$/i.test(pass)) return t.user.login_password_too_simple_error;
    return '';
  };

  const passwordError = getPasswordError(newPassword);
  const isFormValid = code.length === 6 && !passwordError && newPassword.length >= 8 && newPassword === confirmPassword;

  // Mask phone/email
  const maskedPhone = user?.phone ? user.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : '138****8888';
  const maskedEmail = user?.email ? user.email.replace(/(.{2}).*(@.*)/, '$1****$2') : '';

  return (
    <div className="py-4 space-y-4">
      {/* Switch Method */}
      <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl mb-2">
        <button 
          onClick={() => setMethod('phone')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${method === 'phone' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
        >
          {t.account.change_password_method_phone}
        </button>
        <button 
          onClick={() => setMethod('email')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${method === 'email' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
        >
          {t.account.change_password_method_email}
        </button>
      </div>

      {method === 'email' && !user?.email ? (
        <div className="py-6 flex flex-col items-center text-center space-y-4 animate-in fade-in duration-300">
          <div className="w-12 h-12 bg-amber-50 dark:bg-amber-500/10 rounded-full flex items-center justify-center">
            <AlertCircle size={24} className="text-amber-500" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-800 dark:text-white">{t.account.change_password_email_unbound_tip}</p>
          </div>
          <button 
            onClick={onGoBind}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all"
          >
            {t.account.change_password_go_bind}
          </button>
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
              {method === 'phone' ? t.user.login_phone : t.account.email}
            </label>
            <div className="px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-sm font-medium">
              {method === 'phone' ? maskedPhone : maskedEmail}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{t.user.login_code}</label>
            <div className="flex gap-2">
              <input 
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder={t.user.login_code_placeholder}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 dark:text-white"
              />
              <button 
                onClick={handleSendCode}
                disabled={isSending || countdown > 0}
                className="px-4 py-3 rounded-xl border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:bg-indigo-50 dark:hover:bg-indigo-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all min-w-[100px]"
              >
                {isSending ? <Loader2 size={18} className="animate-spin mx-auto" /> : countdown > 0 ? `${countdown}s` : t.user.login_get_code}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{t.user.login_new_password}</label>
            <div className="relative">
              <input 
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={t.user.login_new_password_placeholder}
                className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border ${passwordError ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-100 dark:border-slate-700 focus:ring-indigo-500/20 focus:border-indigo-500'} focus:outline-none focus:ring-2 transition-all text-slate-900 dark:text-white pr-10`}
              />
              <button 
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {passwordError ? (
              <p className="text-[10px] text-red-500 mt-1 ml-1">{passwordError}</p>
            ) : (
              <p className="text-[10px] text-slate-400 mt-1 ml-1 leading-relaxed">
                {t.user.login_password_rule_hint}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{t.user.login_confirm_password}</label>
            <div className="relative">
              <input 
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t.user.login_confirm_password_placeholder}
                className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border ${confirmPassword && newPassword !== confirmPassword ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-100 dark:border-slate-700 focus:ring-indigo-500/20 focus:border-indigo-500'} focus:outline-none focus:ring-2 transition-all text-slate-900 dark:text-white pr-10`}
              />
              <button 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-[10px] text-red-500 mt-1 ml-1">{t.user.login_password_match_error}</p>
            )}
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              onClick={onCancel}
              className="flex-1 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              {t.user.cancel}
            </button>
            <button 
              onClick={onSet}
              disabled={!isFormValid}
              className="flex-1 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {t.account.change_password_btn}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function BindEmailContent({ t, onBind }: { t: any, onBind: (email: string) => void }) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [isSending, setIsSending] = useState(false);

  const handleSendCode = () => {
    if (!email || !email.includes('@')) return;
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 1000);
  };

  const isFormValid = email.includes('@') && code.length === 6;

  return (
    <div className="py-4 space-y-4">
      <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-500/5 border border-indigo-100/50 dark:border-indigo-500/10">
        <p className="text-xs text-indigo-600 dark:text-indigo-400 leading-relaxed">
          {t.account.email_recovery_desc}
        </p>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{t.account.email}</label>
        <input 
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.account.email_placeholder}
          className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 dark:text-white"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{t.account.code_placeholder}</label>
        <div className="flex gap-2">
          <input 
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder={t.account.code_placeholder}
            className="flex-1 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 dark:text-white"
          />
          <button 
            onClick={handleSendCode}
            disabled={isSending || countdown > 0 || !email.includes('@')}
            className="px-4 py-3 rounded-xl border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:bg-indigo-50 dark:hover:bg-indigo-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all min-w-[100px]"
          >
            {isSending ? <Loader2 size={18} className="animate-spin mx-auto" /> : countdown > 0 ? `${countdown}s` : t.account.get_code}
          </button>
        </div>
      </div>

      <div className="pt-4">
        <button 
          onClick={() => onBind(email)}
          disabled={!isFormValid}
          className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {t.account.bind_now}
        </button>
      </div>
    </div>
  );
}

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('workspace');
  const [promotionStatus, setPromotionStatus] = useState<PromotionStatus>('none');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [language, setLanguage] = useState<Language>('zh');
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const t = translations[language];

  // Handle dark mode toggle
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
  
  // Modals
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const [forgotPasswordPhone, setForgotPasswordPhone] = useState('');
  const [isSetPasswordModalOpen, setIsSetPasswordModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [isBindEmailModalOpen, setIsBindEmailModalOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentState, setPaymentState] = useState<PaymentState>('waiting');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [toast, setToast] = useState<{message: string, type: ToastType} | null>(null);

  // Handlers
  const toggleLanguage = () => {
    const newLang = language === 'zh' ? 'en' : 'zh';
    setLanguage(newLang);
    setToast({ 
      message: newLang === 'en' ? translations.en.common.tip_lang_en : translations.zh.common.tip_lang_zh, 
      type: 'info' 
    });
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    setToast({ 
      message: newMode ? t.common.tip_dark_mode : t.common.tip_light_mode, 
      type: 'info' 
    });
  };
  const handleLogin = () => {
    setIsLoginModalOpen(false);
    setUser({
      id: 'ZIMO_8269527',
      name: 'Donny Li',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Donny',
      quota: 3240,
      usedQuota: 1760,
      plan: 'basic',
      planStartDate: '2024-03-01',
      expireDate: '2024-04-01',
      registerDate: '2024-01-15',
      lastLoginDate: '2024-03-28',
      loginMethod: 'phone',
      hasPassword: false // Default to false for new logins as requested
    });
    setToast({ message: t.common.success, type: 'success' });
  };

  const handleResetPassword = () => {
    setIsForgotPasswordModalOpen(false);
    setToast({ message: t.common.success, type: 'success' });
  };

  const handleSetPassword = () => {
    if (user) {
      setUser({ ...user, hasPassword: true });
    }
    setIsSetPasswordModalOpen(false);
    setToast({ message: t.common.success, type: 'success' });
  };

  const handleUpdatePassword = () => {
    setIsChangePasswordModalOpen(false);
    setToast({ message: t.common.success, type: 'success' });
  };

  const handleBindEmail = (email: string) => {
    if (user) {
      setUser({ ...user, email });
    }
    setIsBindEmailModalOpen(false);
    setToast({ message: t.common.success_bind, type: 'success' });
  };

  const handleLogout = () => {
    setIsLogoutConfirmOpen(true);
  };

  const confirmLogout = () => {
    setUser(null);
    setCurrentView('workspace');
    setIsLogoutConfirmOpen(false);
    setToast({ message: t.user.logout, type: 'info' });
  };

  const handleStartGenerate = (file: File, config: any) => {
    if (!user) return;
    
    // Deduct quota
    if (user.quota !== 'unlimited') {
      setUser({ ...user, quota: user.quota - 1 });
    }

    const newTask: Task = {
      id: `t${Date.now()}`,
      filename: file.name,
      date: new Date().toLocaleString(),
      status: 'processing',
      total: 100,
      completed: 0,
      style: config.tone,
      stage: config.stage,
      subject: config.subject,
      brandSize: config.brandSize,
      enableFirstSentenceStrategy: config.enableFirstSentenceStrategy,
      firstSentenceValues: config.firstSentenceValues
    };
    
    setTasks([newTask, ...tasks]);
    setCurrentView('history');
    setToast({ message: t.workspace.generating_msg, type: 'success' });

    // Simulate completion
    setTimeout(() => {
      setTasks(prev => prev.map(t => t.id === newTask.id ? { ...t, status: 'completed', completed: 100 } : t));
      setToast({ message: `${t.workspace.title} ${file.name} ${t.history.status.completed}`, type: 'success' });
    }, 3000);
  };

  const handleBuyPlan = (planId: string) => {
    setSelectedPlan(planId);
    setPaymentState('waiting');
    setIsPaymentModalOpen(true);

    // Simulate payment success after 3 seconds
    setTimeout(() => {
      setPaymentState('success');
      setTimeout(() => {
        setIsPaymentModalOpen(false);
        setUser(prev => prev ? { 
          ...prev, 
          plan: planId as any, 
          quota: planId === 'pro' ? 'unlimited' : 5000,
          planStartDate: new Date().toLocaleDateString(),
          expireDate: '2024-04-26'
        } : null);
        setTransactions(prev => [{
          id: `ORD${Date.now()}`,
          date: new Date().toLocaleString(),
          amount: planId === 'pro' ? '¥299.00' : '¥99.00',
          plan: planId === 'pro' ? t.user.plans.pro : t.user.plans.basic,
          status: 'success'
        }, ...prev]);
        setToast({ message: t.user.payment_success, type: 'success' });
      }, 2000);
    }, 3000);
  };

  return (
    <>
      <MobilePrompt t={t} />
      
      <div className="hidden md:block">
        <AnimatePresence>
          {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </AnimatePresence>

        <Layout 
          currentView={currentView} 
          onChangeView={setCurrentView}
          user={user}
          onLoginClick={() => setIsLoginModalOpen(true)}
          onLogout={handleLogout}
          language={language}
          setLanguage={toggleLanguage}
          isDarkMode={isDarkMode}
          setIsDarkMode={toggleDarkMode}
        >
          {currentView === 'workspace' && (
            <Workspace 
              user={user} 
              onLoginClick={() => setIsLoginModalOpen(true)} 
              onStartGenerate={handleStartGenerate} 
              setToast={setToast}
              t={t}
            />
          )}
          
          {currentView === 'history' && (
            <History 
              tasks={tasks} 
              onViewTask={(id) => {
                setSelectedTaskId(id);
                setCurrentView('task_detail');
              }} 
              t={t}
            />
          )}

          {currentView === 'task_detail' && selectedTaskId && (
            <TaskDetail 
              taskId={selectedTaskId}
              filename={tasks.find(t => t.id === selectedTaskId)?.filename || 'Unknown'}
              stage={tasks.find(t => t.id === selectedTaskId)?.stage}
              subject={tasks.find(t => t.id === selectedTaskId)?.subject}
              style={tasks.find(t => t.id === selectedTaskId)?.style}
              date={tasks.find(t => t.id === selectedTaskId)?.date}
              status={tasks.find(t => t.id === selectedTaskId)?.status}
              brandSize={tasks.find(t => t.id === selectedTaskId)?.brandSize}
              enableFirstSentenceStrategy={tasks.find(t => t.id === selectedTaskId)?.enableFirstSentenceStrategy}
              firstSentenceValues={tasks.find(t => t.id === selectedTaskId)?.firstSentenceValues}
              results={MOCK_RESULTS}
              onBack={() => setCurrentView('history')}
              setToast={setToast}
              t={t}
            />
          )}

          {currentView === 'mass_send' && (
            <MassSend t={t} />
          )}

          {currentView === 'my_plan' && user && (
            <MyPlan 
              user={user} 
              onBuyPlan={handleBuyPlan}
              onRedeemCode={(code) => {
                setUser({ ...user, quota: user.quota === 'unlimited' ? 'unlimited' : user.quota + 100 });
                setToast({ message: t.common.success_redeem, type: 'success' });
              }}
              onViewTransactions={() => setCurrentView('transactions')}
              setToast={setToast}
              t={t}
            />
          )}

          {currentView === 'transactions' && (
            <Transactions 
              transactions={transactions} 
              onBack={() => setCurrentView('my_plan')} 
              t={t}
            />
          )}

          {currentView === 'account' && user && (
            <AccountCenter 
              user={user}
              onLogout={handleLogout}
              onViewHistory={() => setCurrentView('history')}
              onViewPlan={() => setCurrentView('my_plan')}
              onViewTransactions={() => setCurrentView('transactions')}
              onUpdateUser={(updates) => {
                setUser({ ...user, ...updates });
                setToast({ message: t.account.bind_success, type: 'success' });
              }}
              onSetPassword={() => setIsSetPasswordModalOpen(true)}
              onChangePassword={() => setIsChangePasswordModalOpen(true)}
              onBindEmail={() => setIsBindEmailModalOpen(true)}
              setToast={setToast}
              t={t}
            />
          )}

          {currentView === 'design_system' && (
            <DesignSystem />
          )}

          {currentView === 'promotion_center' && (
            promotionStatus === 'approved' ? (
              <PromotionCenter t={t} setToast={setToast} onChangeView={setCurrentView} />
            ) : (
              <ReferralDashboard t={t} onChangeView={setCurrentView} promotionStatus={promotionStatus} setPromotionStatus={setPromotionStatus} />
            )
          )}

          {currentView === 'referral_dashboard' && (
            <ReferralDashboard t={t} onChangeView={setCurrentView} promotionStatus={promotionStatus} setPromotionStatus={setPromotionStatus} />
          )}

          {currentView === 'promotion_apply' && (
            <PromotionApply 
              t={t} 
              onBack={() => setCurrentView('workspace')} 
              onApply={() => {
                if (!user) {
                  setToast({ message: t.user.login_required_tip, type: 'warning' });
                  setIsLoginModalOpen(true);
                  return;
                }
                setCurrentView('promotion_form');
              }}
            />
          )}

          {currentView === 'promotion_form' && (
            <PromotionForm 
              t={t} 
              onBack={() => setCurrentView('promotion_apply')} 
              onSubmit={() => {
                if (!user) {
                  setToast({ message: t.user.login_required_tip, type: 'warning' });
                  setIsLoginModalOpen(true);
                  return;
                }
                setToast({ message: '申请已提交，请等待审核', type: 'success' });
                setPromotionStatus('pending');
                setCurrentView('promotion_pending');
              }}
            />
          )}

          {currentView === 'promotion_pending' && (
            <PromotionPending t={t} onBack={() => setCurrentView('workspace')} />
          )}

          {currentView === 'promotion_rejected' && (
            <PromotionRejected 
              t={t} 
              onBack={() => setCurrentView('workspace')} 
              onReapply={() => setCurrentView('promotion_form')}
            />
          )}

          {currentView === 'invite_history' && (
            <InviteHistory t={t} onBack={() => setCurrentView('promotion_center')} />
          )}

          {currentView === 'reward_history' && (
            <RewardHistory t={t} onBack={() => setCurrentView('promotion_center')} />
          )}

          {currentView === 'alipay_info' && (
            <AlipayInfo t={t} onBack={() => setCurrentView('promotion_center')} setToast={setToast} />
          )}

          {currentView === 'distribution_config' && (
            <DistributionConfig t={t} setToast={setToast} onBack={() => setCurrentView('workspace')} />
          )}

          {currentView === 'commission_audit' && (
            <CommissionAudit t={t} setToast={setToast} onBack={() => setCurrentView('workspace')} />
          )}
        </Layout>

        {/* Dev Entry Buttons - Bottom Left (Hidden in Production) */}
        {import.meta.env.DEV && (
          <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2">
            <button 
              onClick={() => setCurrentView('distribution_config')}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 dark:text-slate-500 text-[10px] font-bold rounded-lg transition-all border border-slate-200 dark:border-slate-700 flex items-center gap-2 opacity-50 hover:opacity-100"
            >
              <Settings size={12} />
              {t.distribution_config.dev_entry}
            </button>
            <button 
              onClick={() => setCurrentView('commission_audit')}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 dark:text-slate-500 text-[10px] font-bold rounded-lg transition-all border border-slate-200 dark:border-slate-700 flex items-center gap-2 opacity-50 hover:opacity-100"
            >
              <ClipboardCheck size={12} />
              {t.commission_audit.dev_entry}
            </button>
          </div>
        )}

        {/* Login Modal */}
        <Modal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} title={t.user.login_title} width="max-w-sm">
          <LoginContent 
            t={t} 
            onLogin={handleLogin} 
            onForgotPassword={(phone) => {
              setForgotPasswordPhone(phone);
              setIsLoginModalOpen(false);
              setIsForgotPasswordModalOpen(true);
            }} 
          />
        </Modal>

        {/* Forgot Password Modal */}
        <Modal isOpen={isForgotPasswordModalOpen} onClose={() => setIsForgotPasswordModalOpen(false)} title={t.user.login_reset_password_title} width="max-w-sm">
          <ForgotPasswordContent 
            t={t} 
            phone={forgotPasswordPhone}
            onReset={handleResetPassword} 
            onCancel={() => setIsForgotPasswordModalOpen(false)}
            onGoBind={() => {
              setIsForgotPasswordModalOpen(false);
              setIsLoginModalOpen(true);
            }}
          />
        </Modal>

        {/* Set Password Modal */}
        <Modal isOpen={isSetPasswordModalOpen} onClose={() => setIsSetPasswordModalOpen(false)} title={t.user.login_set_password_title} width="max-w-sm">
          <SetPasswordContent 
            t={t} 
            phone={user?.phone}
            onSet={handleSetPassword} 
            onCancel={() => setIsSetPasswordModalOpen(false)} 
          />
        </Modal>

        {/* Change Password Modal */}
        <Modal isOpen={isChangePasswordModalOpen} onClose={() => setIsChangePasswordModalOpen(false)} title={t.account.change_password_title} width="max-w-sm">
          <ChangePasswordContent 
            t={t} 
            user={user} 
            onSet={handleUpdatePassword} 
            onCancel={() => setIsChangePasswordModalOpen(false)} 
            onGoBind={() => {
              setIsChangePasswordModalOpen(false);
              setIsBindEmailModalOpen(true);
            }}
          />
        </Modal>

        {/* Bind Email Modal */}
        <Modal isOpen={isBindEmailModalOpen} onClose={() => setIsBindEmailModalOpen(false)} title={t.account.bind_email_title} width="max-w-sm">
          <BindEmailContent t={t} onBind={handleBindEmail} />
        </Modal>

        {/* Logout Confirmation Modal */}
        <Modal isOpen={isLogoutConfirmOpen} onClose={() => setIsLogoutConfirmOpen(false)} title={t.user.logout_confirm_title} width="max-w-sm">
          <div className="py-4">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">{t.user.logout_confirm_desc}</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsLogoutConfirmOpen(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                {t.user.cancel}
              </button>
              <button 
                onClick={confirmLogout}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors"
              >
                {t.user.confirm_logout}
              </button>
            </div>
          </div>
        </Modal>

        {/* Payment Modal */}
        <Modal isOpen={isPaymentModalOpen} onClose={() => paymentState !== 'success' && setIsPaymentModalOpen(false)} title={t.user.payment_title} width="max-w-sm">
          <div className="flex flex-col items-center text-center py-4">
            {paymentState === 'waiting' && (
              <>
                <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6 tracking-tight">
                  {selectedPlan === 'pro' ? '¥299.00' : '¥99.00'}
                </div>
                <div className="w-48 h-48 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-center mb-6 relative">
                  <QrCode size={64} className="text-slate-300 dark:text-slate-600" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm">
                      <Loader2 size={24} className="text-emerald-500 animate-spin" />
                    </div>
                  </div>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" /> {t.user.payment_waiting}
                </p>
              </>
            )}

            {paymentState === 'success' && (
              <div className="py-8 flex flex-col items-center animate-in zoom-in-95 duration-300">
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 size={40} className="text-emerald-500" />
                </div>
                <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">{t.user.payment_success}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t.user.payment_success_desc}</p>
              </div>
            )}

            {paymentState === 'failed' && (
              <div className="py-8 flex flex-col items-center animate-in zoom-in-95 duration-300">
                <div className="w-20 h-20 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center mb-6">
                  <AlertCircle size={40} className="text-red-500" />
                </div>
                <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">{t.user.payment_failed}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{t.user.payment_failed_desc}</p>
                <button 
                  onClick={() => setPaymentState('waiting')}
                  className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
                >
                  {t.user.payment_retry}
                </button>
              </div>
            )}
          </div>
        </Modal>
      </div>
    </>
  );
}

export default App;
