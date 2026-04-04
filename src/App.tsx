/**
 * App.tsx
 * 应用程序主入口文件，负责全局状态管理、路由分发、用户认证逻辑以及全局弹窗控制。
 */
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
import { WithdrawalForm } from './components/WithdrawalForm';
import { InviteHistory } from './components/InviteHistory';
import { RewardHistory } from './components/RewardHistory';
import { AlipayInfo } from './components/AlipayInfo';
import { ReferralDashboard } from './components/ReferralDashboard';
import { PromotionApply } from './components/PromotionApply';
import { PromotionForm } from './components/PromotionForm';
import { PromotionPending } from './components/PromotionPending';
import { PromotionRejected } from './components/PromotionRejected';
import { Modal, Toast, MobilePrompt, ToastType } from './components/Shared';
import { QrCode, Loader2, CheckCircle2, AlertCircle, Eye, EyeOff, Settings, ClipboardCheck } from 'lucide-react';
import { translations, Language } from './i18n';
import { AnimatePresence, motion } from 'motion/react';
import { taskService } from './services/api';

// 模拟数据
const MOCK_TASKS: Task[] = [
  { id: 't1', filename: 'influencers_tech.csv', date: '2024-03-20 14:30', status: 'completed', total: 150, completed: 150, successCount: 148, failedCount: 2, style: 'professional', stage: 'initial', subject: 'Paid Collaboration: Innovative Tech Gadget for Your Audience', brandSize: 'large', enableFirstSentenceStrategy: true, firstSentenceValues: ['data'] },
  { id: 't2', filename: 'beauty_creators_us.csv', date: '2024-03-19 09:15', status: 'failed', total: 500, completed: 120, successCount: 110, failedCount: 10, style: 'casual', stage: 'details', subject: '【Brand Name】Collaboration Details & Next Steps', brandSize: 'small', enableFirstSentenceStrategy: false },
  { id: 't3', filename: 'fashion_vloggers_uk.xlsx', date: '2024-03-21 10:05', status: 'processing', total: 200, completed: 85, successCount: 80, failedCount: 5, style: 'friendly', stage: 'initial', subject: 'Fashion Week Special: Collaboration Opportunity', brandSize: 'small', enableFirstSentenceStrategy: true, firstSentenceValues: ['style'] },
  { id: 't4', filename: 'gaming_streamers.csv', date: '2024-03-21 11:20', status: 'queued', total: 300, completed: 0, successCount: 0, failedCount: 0, style: 'bold', stage: 'details', subject: 'Level Up Your Stream with Our New Gaming Gear', brandSize: 'large', enableFirstSentenceStrategy: false },
  { id: 't5', filename: 'home_decor_experts.csv', date: '2024-03-21 12:45', status: 'partial', total: 100, completed: 92, successCount: 88, failedCount: 4, style: 'professional', stage: 'initial', subject: 'Elevate Your Home Aesthetic with Our Collection', brandSize: 'small', enableFirstSentenceStrategy: true, firstSentenceValues: ['design'] },
];

// 模拟生成结果数据
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

/**
 * 登录内容组件
 * 
 * @param t 国际化翻译对象
 * @param onLogin 登录成功回调函数
 * @param onForgotPassword 点击忘记密码回调函数
 * 
 * 处理验证码登录和密码登录两种模式的切换、输入校验及发送验证码逻辑。
 */
function LoginContent({ t, onLogin, onForgotPassword }: { t: any, onLogin: () => void, onForgotPassword: (phone: string) => void }) {
  const [loginMode, setLoginMode] = useState<'code' | 'password'>('password');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [captcha, setCaptcha] = useState('');
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isSending, setIsSending] = useState(false);

  /**
   * 处理发送验证码逻辑
   */
  const handleSendCode = () => {
    if (!phone || phone.length < 11) return;
    
    // 模拟特定号码或高频操作触发的风控
    // 出于演示目的，如果尚未显示，我们将触发它
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

  /**
   * 校验登录表单是否有效
   * 
   * 根据当前登录模式（验证码/密码）判断必填项是否已填写且符合格式要求。
   * @returns {boolean} 是否允许提交登录
   */
  const isFormValid = loginMode === 'code' 
    ? phone.length === 11 && code.length === 6 && (!showCaptcha || captcha.length === 4)
    : phone.length === 11 && password.length >= 6;

  return (
    <div className="py-4">
      <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl mb-6">
        <button 
          onClick={() => setLoginMode('password')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${loginMode === 'password' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
        >
          {t.user.login_switch_password}
        </button>
        <button 
          onClick={() => setLoginMode('code')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${loginMode === 'code' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
        >
          {t.user.login_switch_code}
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
          <div className="space-y-4">
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
            <div className="flex items-center justify-center gap-1 text-xs text-slate-500">
              <span>{t.user.login_no_account}</span>
              <button 
                onClick={() => setLoginMode('code')}
                className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
              >
                {t.user.login_register}
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

/**
 * 忘记密码内容组件
 * 
 * @param t 国际化翻译对象
 * @param initialPhone 初始手机号（可选）
 * @param onReset 重置成功回调函数
 * @param onCancel 取消/返回回调函数
 * @param onGoBind 跳转到绑定/登录回调函数
 * 
 * 支持通过手机号或邮箱找回密码，包含验证码发送、新密码强度校验及确认密码一致性检查。
 */
function ForgotPasswordContent({ t, phone: initialPhone, onReset, onCancel, onGoBind }: { t: any, phone?: string, onReset: () => void, onCancel: () => void, onGoBind: () => void }) {
  const [method, setMethod] = useState<'phone' | 'email'>('phone');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isSending, setIsSending] = useState(false);

  /**
   * 处理发送重置验证码逻辑
   * 
   * 模拟异步发送验证码过程，成功后开启 60s 倒计时。
   */
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

  /**
   * 校验密码强度及合法性
   * 
   * @param pass 待校验的密码字符串
   * @returns {string} 错误信息，若校验通过则返回空字符串
   * 
   * 校验规则：不能包含空格、长度 8-20 位、必须包含字母和数字、不能是过于简单的常用密码。
   */
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

  // 掩码手机号/邮箱（模拟未登录时忘记密码的邮箱）
  const maskedPhone = initialPhone ? initialPhone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : '138****8888';
  // 对于忘记密码，如果未登录，我们可能不知道邮箱，
  // 但提示说“已绑定时脱敏”，意味着如果存在我们就应该显示它。
  // 在真实应用中，我们会获取这个。在这里，如果手机号匹配已知号码，我们将模拟它，或者只显示一个占位符。
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

/**
 * 设置密码内容组件
 * 
 * @param t 国际化翻译对象
 * @param initialPhone 用户手机号
 * @param onSet 设置成功回调函数
 * @param onCancel 取消回调函数
 * 
 * 用于新用户首次登录后设置登录密码，确保账号安全。
 */
function SetPasswordContent({ t, phone: initialPhone, onSet, onCancel }: { t: any, phone?: string, onSet: () => void, onCancel: () => void }) {
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isSending, setIsSending] = useState(false);

  /**
   * 处理发送设置密码验证码逻辑
   * 
   * 模拟发送逻辑并开启倒计时。
   */
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

  /**
   * 校验密码强度及合法性
   * 
   * @param pass 待校验的密码字符串
   * @returns {string} 错误信息，若校验通过则返回空字符串
   * 
   * 校验规则：不能包含空格、长度 8-20 位、必须包含字母和数字、不能是过于简单的常用密码。
   */
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

/**
 * 修改密码内容组件
 * 
 * @param t 国际化翻译对象
 * @param user 当前登录用户信息
 * @param onSet 修改成功回调函数
 * @param onCancel 取消回调函数
 * @param onGoBind 跳转到绑定邮箱回调函数
 * 
 * 已登录用户在个人中心修改密码，支持手机和邮箱两种验证方式。
 */
function ChangePasswordContent({ t, user, onSet, onCancel, onGoBind }: { t: any, user: UserProfile | null, onSet: () => void, onCancel: () => void, onGoBind: () => void }) {
  const [method, setMethod] = useState<'phone' | 'email'>('phone');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isSending, setIsSending] = useState(false);

  /**
   * 处理发送修改密码验证码逻辑
   */
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

  /**
   * 校验密码强度及合法性
   * 
   * @param pass 待校验的密码字符串
   * @returns {string} 错误信息，若校验通过则返回空字符串
   * 
   * 校验规则：不能包含空格、长度 8-20 位、必须包含字母和数字、不能是过于简单的常用密码。
   */
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

  // 掩码手机号/邮箱
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

/**
 * 绑定邮箱内容组件
 * 
 * @param t 国际化翻译对象
 * @param onBind 绑定成功回调函数
 * 
 * 引导用户绑定邮箱，用于账号安全找回和接收重要通知。
 */
function BindEmailContent({ t, onBind }: { t: any, onBind: (email: string) => void }) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [isSending, setIsSending] = useState(false);

  /**
   * 处理发送邮箱验证码逻辑
   * 
   * 校验邮箱格式后模拟发送验证码。
   */
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

  /**
   * 校验绑定邮箱表单是否有效
   * 
   * @returns {boolean} 是否允许提交绑定
   */
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

/**
 * 应用程序根组件
 * 
 * 负责：
 * 1. 全局状态管理：用户信息、任务列表、语言、主题、视图切换。
 * 2. 路由分发：根据 currentView 渲染不同的页面组件。
 * 3. 用户认证逻辑：登录、注册、找回密码、修改密码、绑定邮箱。
 * 4. 业务逻辑：创建生成任务、购买套餐、支付模拟。
 * 5. 全局 UI 控制：弹窗 (Modal)、提示 (Toast)、移动端适配提示。
 */
function App() {
  const [currentView, setCurrentView] = useState<ViewState>('workspace'); // 当前主视图
  const [promotionStatus, setPromotionStatus] = useState<PromotionStatus>('none'); // 推广状态
  const [user, setUser] = useState<UserProfile | null>(null); // 当前登录用户信息
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS); // 任务历史列表
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null); // 当前查看详情的任务 ID
  const [transactions, setTransactions] = useState<any[]>([]); // 充值交易记录
  const [language, setLanguage] = useState<Language>('zh'); // 当前语言
  const [isDarkMode, setIsDarkMode] = useState(false); // 是否为深色模式
  
  const t = translations[language]; // 翻译资源对象

  // 处理深色模式切换的副作用
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
  
  // 弹窗显隐控制状态
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

  // 处理函数
  /**
   * 切换界面语言
   * 
   * 在中文 (zh) 和英文 (en) 之间切换，并弹出提示。
   */
  const toggleLanguage = () => {
    const newLang = language === 'zh' ? 'en' : 'zh';
    setLanguage(newLang);
    setToast({ 
      message: newLang === 'en' ? translations.en.common.tip_lang_en : translations.zh.common.tip_lang_zh, 
      type: 'info' 
    });
  };

  /**
   * 切换深色/浅色模式
   * 
   * 切换全局主题颜色，并弹出提示。
   */
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    setToast({ 
      message: newMode ? t.common.tip_dark_mode : t.common.tip_light_mode, 
      type: 'info' 
    });
  };

  /**
   * 处理登录成功逻辑
   * 
   * 关闭登录弹窗，初始化模拟用户信息，并弹出成功提示。
   */
  const handleLogin = () => {
    setIsLoginModalOpen(false);
    setUser({
      id: 'ZIMO_8269527',
      name: 'Donny Li',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Donny',
      quota: 324,
      usedQuota: 1760,
      plan: 'basic',
      planStartDate: '2024-03-01',
      expireDate: '2024-04-01',
      registerDate: '2024-01-15',
      lastLoginDate: '2024-03-28',
      loginMethod: 'phone',
      hasPassword: false // 根据要求，新登录默认没有密码
    });
    setToast({ message: t.common.success, type: 'success' });
  };

  /**
   * 处理重置密码成功逻辑
   * 
   * 关闭忘记密码弹窗，并弹出成功提示。
   */
  const handleResetPassword = () => {
    setIsForgotPasswordModalOpen(false);
    setToast({ message: t.common.success, type: 'success' });
  };

  /**
   * 处理首次设置密码成功逻辑
   * 
   * 更新用户状态为已设置密码，关闭弹窗并提示。
   */
  const handleSetPassword = () => {
    if (user) {
      setUser({ ...user, hasPassword: true });
    }
    setIsSetPasswordModalOpen(false);
    setToast({ message: t.common.success, type: 'success' });
  };

  /**
   * 处理修改密码成功逻辑
   * 
   * 关闭修改密码弹窗并提示。
   */
  const handleUpdatePassword = () => {
    setIsChangePasswordModalOpen(false);
    setToast({ message: t.common.success, type: 'success' });
  };

  /**
   * 处理绑定邮箱成功逻辑
   * 
   * @param email 绑定的邮箱地址
   * 
   * 更新用户信息中的邮箱字段，关闭弹窗并提示。
   */
  const handleBindEmail = (email: string) => {
    if (user) {
      setUser({ ...user, email });
    }
    setIsBindEmailModalOpen(false);
    setToast({ message: t.common.success_bind, type: 'success' });
  };

  /**
   * 触发退出登录确认
   * 
   * 打开退出登录二次确认弹窗。
   */
  const handleLogout = () => {
    setIsLogoutConfirmOpen(true);
  };

  /**
   * 确认并执行退出登录
   * 
   * 清除用户信息，返回工作台视图，关闭确认窗并提示。
   */
  const confirmLogout = () => {
    setUser(null);
    setCurrentView('workspace');
    setIsLogoutConfirmOpen(false);
    setToast({ message: t.user.logout, type: 'info' });
  };

  /**
   * 处理开始生成建联文案任务
   * 
   * @param file 上传的 CSV/Excel 文件对象
   * @param config 生成配置（包含语气、阶段、品牌规模等）
   * @returns {Promise<string | null>} 返回创建的任务 ID，若失败则返回 null
   * 
   * 业务逻辑：
   * 1. 调用任务服务创建异步任务。
   * 2. 成功后扣除用户配额，并将新任务添加到历史列表顶部。
   * 3. 若任务状态为 processing，则开启前端模拟进度更新逻辑。
   * 4. 包含 API 调用失败时的模拟兜底逻辑。
   */
  const handleStartGenerate = async (file: File, config: any) => {
    if (!user) return null;
    
    try {
      const response = await taskService.createTask({
        importMode: config.singleCreator ? 'single' : 'batch',
        singleCreator: config.singleCreator,
        config: config
      });

      if (response.code === 200) {
        // 扣除配额
        if (user.quota !== 'unlimited') {
          setUser({ ...user, quota: user.quota - 1 });
        }

        const newTask: Task = {
          id: response.data.taskId,
          filename: file.name,
          date: new Date().toLocaleString(),
          status: response.data.status,
          total: 100,
          completed: 0,
          successCount: 0,
          failedCount: 0,
          style: config.tone,
          stage: config.stage,
          subject: config.subject,
          brandSize: config.brandSize,
          enableFirstSentenceStrategy: config.enableFirstSentenceStrategy,
          firstSentenceValues: config.firstSentenceValues
        };

        setTasks([newTask, ...tasks]);
        // setCurrentView('history');
        
        // 模拟任务进度（如果后端是异步的，这里可以轮询，但为了演示，我们保留模拟进度）
        if (response.data.status === 'processing') {
          let progress = 0;
          const interval = setInterval(() => {
            progress += 20;
            setTasks(prev => prev.map(task => 
              task.id === response.data.taskId 
                ? { 
                    ...task, 
                    completed: Math.min(100, progress), 
                    successCount: Math.floor(Math.min(100, progress) * 0.95),
                    failedCount: Math.floor(Math.min(100, progress) * 0.05),
                    status: progress >= 100 ? 'completed' : 'processing' 
                  } 
                : task
            ));
            if (progress >= 100) {
              clearInterval(interval);
            }
          }, 1000);
        }
        return response.data.taskId;
      } else {
        throw new Error(response.message || 'API Error');
      }
    } catch (error) {
      console.error('Create task failed, using fallback:', error);
      // 兜底逻辑
      if (user.quota !== 'unlimited') {
        setUser({ ...user, quota: user.quota - 1 });
      }

      const mockTaskId = `t${Date.now()}`;
      const newTask: Task = {
        id: mockTaskId,
        filename: file.name,
        date: new Date().toLocaleString(),
        status: 'processing',
        total: 100,
        completed: 0,
        successCount: 0,
        failedCount: 0,
        style: config.tone,
        stage: config.stage,
        subject: config.subject,
        brandSize: config.brandSize,
        enableFirstSentenceStrategy: config.enableFirstSentenceStrategy,
        firstSentenceValues: config.firstSentenceValues
      };

      setTasks([newTask, ...tasks]);
      // setCurrentView('history');

      // 模拟生成完成
      setTimeout(() => {
        setTasks(prev => prev.map(t => t.id === mockTaskId ? { ...t, status: 'completed', completed: 100, successCount: 98, failedCount: 2 } : t));
      }, 3000);
      return mockTaskId;
    }
  };

  /**
   * 处理购买会员套餐逻辑
   * 
   * @param planId 套餐 ID（basic 或 pro）
   * 
   * 业务逻辑：
   * 1. 打开支付弹窗并进入等待支付状态。
   * 2. 模拟 3 秒支付延迟，成功后更新用户等级、配额及有效期。
   * 3. 记录交易流水并弹出成功提示。
   */
  const handleBuyPlan = (planId: string) => {
    setSelectedPlan(planId);
    setPaymentState('waiting');
    setIsPaymentModalOpen(true);

    // 模拟 3 秒后支付成功
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
          <div className={currentView === 'workspace' ? 'block' : 'hidden'}>
            <Workspace 
              user={user} 
              onLoginClick={() => setIsLoginModalOpen(true)} 
              onStartGenerate={handleStartGenerate} 
              setToast={setToast}
              onChangeView={setCurrentView}
              currentView={currentView}
              t={t}
            />
          </div>
          
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
              total={tasks.find(t => t.id === selectedTaskId)?.total}
              completed={tasks.find(t => t.id === selectedTaskId)?.completed}
              successCount={tasks.find(t => t.id === selectedTaskId)?.successCount}
              failedCount={tasks.find(t => t.id === selectedTaskId)?.failedCount}
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
              onViewPromotion={() => setCurrentView('promotion_center')}
              setToast={setToast}
              t={t}
            />
          )}

          {currentView === 'design_system' && (
            <DesignSystem />
          )}

          {currentView === 'promotion_center' && user && (
            promotionStatus === 'approved' ? (
              <PromotionCenter user={user} t={t} setToast={setToast} onChangeView={setCurrentView} />
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
          
          {currentView === 'withdrawal_form' && user && (
            <WithdrawalForm 
              user={user} 
              t={t} 
              onBack={() => setCurrentView('promotion_center')} 
              onSuccess={() => setCurrentView('reward_history')}
              setToast={setToast}
            />
          )}
        </Layout>

        {/* 开发入口按钮 - 左下角（生产环境隐藏） */}
        {import.meta.env.DEV && (
          <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2">
          </div>
        )}

        {/* 登录弹窗 */}
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

        {/* 忘记密码弹窗 */}
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

        {/* 设置密码弹窗 */}
        <Modal isOpen={isSetPasswordModalOpen} onClose={() => setIsSetPasswordModalOpen(false)} title={t.user.login_set_password_title} width="max-w-sm">
          <SetPasswordContent 
            t={t} 
            phone={user?.phone}
            onSet={handleSetPassword} 
            onCancel={() => setIsSetPasswordModalOpen(false)} 
          />
        </Modal>

        {/* 修改密码弹窗 */}
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

        {/* 绑定邮箱弹窗 */}
        <Modal isOpen={isBindEmailModalOpen} onClose={() => setIsBindEmailModalOpen(false)} title={t.account.bind_email_title} width="max-w-sm">
          <BindEmailContent t={t} onBind={handleBindEmail} />
        </Modal>

        {/* 退出登录确认弹窗 */}
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

        {/* 支付弹窗 */}
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
