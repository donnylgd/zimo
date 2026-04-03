import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Info, ShieldCheck, CheckCircle2, Send, User, Phone, Globe, MessageSquare, BarChart3, PenTool, AlertCircle } from 'lucide-react';

interface PromotionFormProps {
  t: any;
  onBack: () => void;
  onSubmit: () => void;
}

export const PromotionForm = ({ t, onBack, onSubmit }: PromotionFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    channelType: '',
    channelName: '',
    channelLink: '',
    fansCount: '',
    expertise: '',
    reason: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = '请填写联系人姓名';
    if (!formData.phone.trim()) newErrors.phone = '请填写手机号';
    if (!formData.channelType) newErrors.channelType = '请选择推广渠道类型';
    if (!formData.channelName.trim()) newErrors.channelName = '请填写渠道账号名称';
    if (!formData.channelLink.trim()) {
      newErrors.channelLink = '请填写渠道主页链接';
    } else if (!formData.channelLink.includes('.') || !formData.channelLink.includes('/')) {
      newErrors.channelLink = '请填写正确的链接格式';
    }
    if (!formData.reason.trim()) newErrors.reason = '请填写申请理由';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = () => {
    if (validate()) {
      onSubmit();
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* A. Header Section */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">申请推广权限</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">请填写基础资料，我们会根据您提交的信息进行人工审核</p>
        </div>
      </div>

      {/* B. Application Instructions Section */}
      <div className="bg-indigo-50/50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
          <Info size={16} />
          申请须知
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: <ShieldCheck size={14} />, text: "推广权限采用申请审核制，非自动开通" },
            { icon: <CheckCircle2 size={14} />, text: "适合有公众号、小红书、抖音、社群等内容渠道的人申请" },
            { icon: <CheckCircle2 size={14} />, text: "审核通过后可开通正式推广中心及相关结算功能" },
            { icon: <CheckCircle2 size={14} />, text: "当前佣金采用人工审核、线下打款方式进行结算" }
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <div className="mt-0.5 text-indigo-500">{item.icon}</div>
              {item.text}
            </div>
          ))}
        </div>
      </div>

      {/* C. Form Area */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-10 space-y-10 shadow-sm">
        
        {/* A. Basic Identity Information */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
            <User size={18} className="text-indigo-500" />
            基础身份信息
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                联系人姓名 / 昵称 <span className="text-red-500">*</span>
              </label>
              <input 
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="请输入姓名或昵称"
                className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border ${errors.name ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-100 dark:border-slate-700 focus:ring-indigo-500/20 focus:border-indigo-500'} transition-all outline-none focus:ring-2`}
              />
              {errors.name && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} /> {errors.name}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                手机号 <span className="text-red-500">*</span>
              </label>
              <input 
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="请输入手机号"
                className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border ${errors.phone ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-100 dark:border-slate-700 focus:ring-indigo-500/20 focus:border-indigo-500'} transition-all outline-none focus:ring-2`}
              />
              {errors.phone && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} /> {errors.phone}</p>}
            </div>
          </div>
        </div>

        {/* B. Promotion Channel Information */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
            <Globe size={18} className="text-indigo-500" />
            推广渠道信息
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                推广渠道类型 <span className="text-red-500">*</span>
              </label>
              <select 
                value={formData.channelType}
                onChange={(e) => setFormData({...formData, channelType: e.target.value})}
                className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border ${errors.channelType ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-100 dark:border-slate-700 focus:ring-indigo-500/20 focus:border-indigo-500'} transition-all outline-none focus:ring-2 appearance-none cursor-pointer`}
              >
                <option value="">请选择渠道类型</option>
                <option value="official_account">公众号</option>
                <option value="xiaohongshu">小红书</option>
                <option value="douyin">抖音</option>
                <option value="wechat_group">微信社群</option>
                <option value="other">其他</option>
              </select>
              {errors.channelType && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} /> {errors.channelType}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                渠道账号名称 <span className="text-red-500">*</span>
              </label>
              <input 
                type="text"
                value={formData.channelName}
                onChange={(e) => setFormData({...formData, channelName: e.target.value})}
                placeholder="请输入账号名称"
                className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border ${errors.channelName ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-100 dark:border-slate-700 focus:ring-indigo-500/20 focus:border-indigo-500'} transition-all outline-none focus:ring-2`}
              />
              {errors.channelName && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} /> {errors.channelName}</p>}
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                渠道主页链接 / 账号链接 <span className="text-red-500">*</span>
              </label>
              <input 
                type="text"
                value={formData.channelLink}
                onChange={(e) => setFormData({...formData, channelLink: e.target.value})}
                placeholder="请输入完整的账号主页链接"
                className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border ${errors.channelLink ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-100 dark:border-slate-700 focus:ring-indigo-500/20 focus:border-indigo-500'} transition-all outline-none focus:ring-2`}
              />
              {errors.channelLink && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} /> {errors.channelLink}</p>}
            </div>
          </div>
        </div>

        {/* C. Resource Supplement Information */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
            <BarChart3 size={18} className="text-indigo-500" />
            资源补充信息
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                粉丝数 / 用户规模 <span className="text-slate-400 font-normal">(选填)</span>
              </label>
              <input 
                type="text"
                value={formData.fansCount}
                onChange={(e) => setFormData({...formData, fansCount: e.target.value})}
                placeholder="例如：10w+"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none focus:ring-2"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                擅长领域 <span className="text-slate-400 font-normal">(选填)</span>
              </label>
              <input 
                type="text"
                value={formData.expertise}
                onChange={(e) => setFormData({...formData, expertise: e.target.value})}
                placeholder="例如：科技、职场、AI工具"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none focus:ring-2"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                申请理由 / 推广资源说明 <span className="text-red-500">*</span>
              </label>
              <textarea 
                value={formData.reason}
                onChange={(e) => setFormData({...formData, reason: e.target.value})}
                placeholder="请简要说明您的账号资源、推广方式及擅长内容等，便于我们更快通过审核"
                rows={4}
                className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border ${errors.reason ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-100 dark:border-slate-700 focus:ring-indigo-500/20 focus:border-indigo-500'} transition-all outline-none focus:ring-2 resize-none`}
              />
              {errors.reason && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} /> {errors.reason}</p>}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="space-y-4">
          <button 
            onClick={handleFormSubmit}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
          >
            提交申请
          </button>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center">
            请尽量填写真实、可核验的渠道信息，便于审核通过
          </p>
        </div>

        {/* Footer Note */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center leading-relaxed">
            提交申请即代表您愿意提供真实渠道信息用于审核，并承诺遵守相关推广规范。<br />
            当前页面仅做申请资料提交，不代表自动开通推广权限。
          </p>
        </div>
      </div>
    </div>
  );
};
