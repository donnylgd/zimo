import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, FileText, Settings, Play, AlertCircle, CheckCircle2, Loader2, Send, Sparkles, RefreshCw, Info, Search, User, Eye } from 'lucide-react';
import * as XLSX from 'xlsx';
import { UserProfile, UploadState, ViewState } from '../types';
import { Modal, ToastType } from './Shared';
import { Translations } from '../i18n';
import { aiService } from '../services/api';

type Stage = 'initial' | 'details' | 'tracking';

interface WorkspaceProps {
  user: UserProfile | null;
  onLoginClick: () => void;
  onStartGenerate: (file: File, config: any) => Promise<string | null>;
  setToast: (toast: { message: string, type: ToastType } | null) => void;
  onChangeView: (view: ViewState) => void;
  currentView: ViewState;
  t: Translations;
}

/**
 * 工作台组件
 * 
 * @param user 当前登录用户信息
 * @param onLoginClick 点击登录回调
 * @param onStartGenerate 开始生成任务回调
 * @param setToast 设置全局提示回调
 * @param onChangeView 切换视图回调
 * @param currentView 当前视图状态
 * @param t 国际化翻译对象
 * 
 * 核心业务流程：
 * 1. 达人数据导入（单条/批量）
 * 2. 邮件策略配置（AI 生成标题、卖点优化、深度思考策略）
 * 3. 预览与异步任务提交
 */
export const Workspace = ({ user, onLoginClick, onStartGenerate, setToast, onChangeView, currentView, t }: WorkspaceProps) => {

  // 业务阶段定义：初次邀约、细节沟通、单号同步
  const STAGES = [
    { id: 'initial', label: t.workspace.stage_initial, desc: t.workspace.stage_initial_desc },
    { id: 'details', label: t.workspace.stage_details, desc: t.workspace.stage_details_desc },
    { id: 'tracking', label: t.workspace.stage_tracking, desc: t.workspace.stage_tracking_desc }
  ];

  // 状态管理
  const [importMode, setImportMode] = useState<'single' | 'batch'>('batch'); // 导入模式
  const [currentStep, setCurrentStep] = useState(1); // 当前步骤 (1-3)
  const [validationError, setValidationError] = useState<string | null>(null); // 表单校验错误信息
  const [showValidation, setShowValidation] = useState(false); // 是否展示校验提醒
  
  // 单个达人信息状态
  const [singleCreator, setSingleCreator] = useState({
    name: '',
    email: '',
    followers: '',
    profileUrl: ''
  });

  const [file, setFile] = useState<File | null>(null); // 批量导入的文件对象
  const [uploadState, setUploadState] = useState<UploadState>('idle'); // 文件上传/解析状态
  const [uploadStats, setUploadStats] = useState({ // 文件解析统计
    total: 0,
    success: 0,
    failed: 0
  });

  // 核心生成配置状态
  const [config, setConfig] = useState({ 
    stage: 'initial' as Stage, // 业务阶段
    brandSize: 'small' as 'small' | 'large', // 品牌规模
    brandName: '', // 品牌名称
    subject: '', // 邮件标题
    enableFirstSentenceStrategy: false, // 是否开启深度思考（第一句话策略）
    firstSentenceValues: [] as string[], // 选中的价值点
    valuePointsKeywords: {} as Record<string, string>, // 价值点对应的关键词
    productName: '', // 产品名称
    sellingPoints: '', // 产品卖点
    commissionRate: '10', // 佣金比例
    freeSampleThreshold: '10000', // 免费样品门槛
    collabNotes: '', // 合作备注
    packageContent: '', // 包裹内容
    trackingNumber: '', // 物流单号
    carrier: '', // 承运商
    additionalNotes: '', // 额外说明
    tone: 'professional', // 邮件语气
    genLanguage: 'en' as 'en' | 'es' | 'pt' // 生成语言
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isGeneratingSubject, setIsGeneratingSubject] = useState(false); // 正在生成标题状态
  const [isOptimizingSellingPoints, setIsOptimizingSellingPoints] = useState(false); // 正在优化卖点状态
  const [subjectGenerated, setSubjectGenerated] = useState(false); // 标题是否已生成
  const [isGenerating, setIsGenerating] = useState(false); // 正在提交任务状态
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false); // 升级弹窗状态
  const [isTaskSubmittedModalOpen, setIsTaskSubmittedModalOpen] = useState(false); // 任务提交成功弹窗状态
  const [pendingDeepThinkingExpand, setPendingDeepThinkingExpand] = useState(false); // 升级后待展开深度思考状态

  // 权限判断：只有 Pro 或 Enterprise 计划可以使用深度思考
  const hasDeepThinkingAccess = user?.plan === 'pro' || user?.plan === 'enterprise';
  const prevPlanRef = useRef(user?.plan);
  const prevViewRef = useRef(currentView);

  useEffect(() => {
    // 权限降级处理：如果用户计划变更导致失去深度思考权限，则自动关闭该功能
    if (!hasDeepThinkingAccess && config.enableFirstSentenceStrategy) {
      setConfig(prev => ({ ...prev, enableFirstSentenceStrategy: false }));
      setToast({ message: t.workspace.plan_downgrade_hint, type: 'warning' });
    }

    // 升级成功后的交互逻辑：自动展开之前受限的功能
    const wasRestricted = prevPlanRef.current === 'free' || prevPlanRef.current === 'basic';
    const isNowPro = user?.plan === 'pro' || user?.plan === 'enterprise';
    
    if (wasRestricted && isNowPro && currentView === 'workspace' && prevViewRef.current === 'my_plan') {
      setToast({ message: t.workspace.deep_thinking_unlocked_toast, type: 'success' });
      if (pendingDeepThinkingExpand) {
        setConfig(prev => ({ ...prev, enableFirstSentenceStrategy: true }));
        setPendingDeepThinkingExpand(false);
      }
    }

    prevPlanRef.current = user?.plan;
    prevViewRef.current = currentView;
  }, [user?.plan, currentView]);

  const prevStageRef = useRef(config.stage);
  const prevBrandSizeRef = useRef(config.brandSize);

  // 监听阶段或品牌规模变化，重置已生成的标题
  useEffect(() => {
    if (prevStageRef.current !== config.stage || prevBrandSizeRef.current !== config.brandSize) {
      setSubjectGenerated(false);
      setConfig(prev => ({ ...prev, subject: '' }));
      prevStageRef.current = config.stage;
      prevBrandSizeRef.current = config.brandSize;
    }
  }, [config.stage, config.brandSize]);

  // 切换步骤时重置校验状态
  useEffect(() => {
    setShowValidation(false);
    setValidationError(null);
  }, [currentStep]);

  /**
   * 处理 AI 生成邮件标题
   * 
   * 调用 aiService.generateSubject 接口，根据当前阶段、品牌规模等生成标题。
   * 包含 API 调用失败后的本地兜底逻辑。
   */
  const handleGenerateSubject = async () => {
    if (!config.stage || !config.brandSize) {
      setShowValidation(true);
      return;
    }
    setIsGeneratingSubject(true);
    setToast({ message: t.common.loading_ai_subject, type: 'info' });
    
    try {
      const response = await aiService.generateSubject({
        stage: config.stage,
        brandSize: config.brandSize,
        brandName: config.brandName,
        productName: config.productName,
        genLanguage: config.genLanguage
      });
      
      if (response.code === 200) {
        setConfig(prev => ({ ...prev, subject: response.data.subject }));
        setSubjectGenerated(true);
        setToast({ message: t.common.success, type: 'success' });
      } else {
        throw new Error(response.message || 'API Error');
      }
    } catch (error) {
      console.error('Generate subject failed, using fallback:', error);
      // 兜底逻辑
      let fallbackSubject = '';
      const lang = config.genLanguage;
      
      if (config.stage === 'initial') {
        if (lang === 'es') {
          fallbackSubject = config.brandSize === 'large' 
            ? `【${config.brandName || 'Marca'}】x Invitación de colaboración para creadores de TikTok` 
            : `Colaboración pagada: ${config.productName || 'Producto'} innovador para su audiencia`;
        } else if (lang === 'pt') {
          fallbackSubject = config.brandSize === 'large' 
            ? `【${config.brandName || 'Marca'}】x Convite de colaboração para criadores do TikTok` 
            : `Colaboração paga: ${config.productName || 'Produto'} inovador para seu público`;
        } else {
          fallbackSubject = config.brandSize === 'large' 
            ? `【${config.brandName || 'Brand'}】x TikTok Creator Collaboration Invitation` 
            : `Paid Collaboration: Innovative ${config.productName || 'Product'} for Your Audience`;
        }
      } else if (config.stage === 'details') {
        if (lang === 'es') {
          fallbackSubject = config.brandSize === 'large'
            ? `【${config.brandName || 'Marca'}】Detalles de la colaboración y próximos pasos`
            : 'Detalles de la colaboración: Muestra gratuita e información sobre comisiones';
        } else if (lang === 'pt') {
          fallbackSubject = config.brandSize === 'large'
            ? `【${config.brandName || 'Marca'}】Detalhes da colaboração e próximos passos`
            : 'Detalhes da colaboração: Amostra grátis e informações sobre comissões';
        } else {
          fallbackSubject = config.brandSize === 'large'
            ? `【${config.brandName || 'Brand'}】Collaboration Details & Next Steps`
            : 'Collaboration Details: Free Sample & Commission Info';
        }
      } else if (config.stage === 'tracking') {
        if (lang === 'es') {
          fallbackSubject = config.brandSize === 'large'
            ? `【${config.brandName || 'Marca'}】Muestra enviada - Información de seguimiento en el interior`
            : '¡Su muestra está en camino! Información de seguimiento en el interior';
        } else if (lang === 'pt') {
          fallbackSubject = config.brandSize === 'large'
            ? `【${config.brandName || 'Marca'}】Amostra enviada - Informações de rastreamento dentro`
            : 'Sua amostra está a caminho! Informações de rastreamento dentro';
        } else {
          fallbackSubject = config.brandSize === 'large'
            ? `【${config.brandName || 'Brand'}】Sample Shipped - Tracking Info Inside`
            : 'Your Sample is on the Way! Tracking Info Inside';
        }
      }
      setConfig(prev => ({ ...prev, subject: fallbackSubject }));
      setSubjectGenerated(true);
      setToast({ message: t.common.dev_mode_notice + ': ' + t.common.success, type: 'warning' });
    } finally {
      setIsGeneratingSubject(false);
    }
  };

  /**
   * 处理 AI 优化产品卖点
   * 
   * 调用 aiService.optimizeSellingPoints 接口，对用户输入的产品卖点进行润色。
   * 包含 API 调用失败后的本地兜底逻辑。
   */
  const handleOptimizeSellingPoints = async () => {
    if (!config.sellingPoints) {
      setShowValidation(true);
      return;
    }
    if (isOptimizingSellingPoints) return;
    
    setIsOptimizingSellingPoints(true);
    setToast({ message: t.common.loading_ai_points, type: 'info' });
    
    try {
      const response = await aiService.optimizeSellingPoints({
        stage: config.stage,
        sellingPoints: config.sellingPoints,
        productName: config.productName,
        genLanguage: config.genLanguage
      });
      
      if (response.code === 200) {
        setConfig(prev => ({ ...prev, sellingPoints: response.data.optimizedPoints }));
        setToast({ message: t.common.success, type: 'success' });
      } else {
        throw new Error(response.message || 'API Error');
      }
    } catch (error) {
      console.error('Optimize selling points failed, using fallback:', error);
      // 兜底逻辑
      let optimized = config.sellingPoints;
      const lang = config.genLanguage;
      
      if (config.stage === 'initial') {
        if (lang === 'es') {
          optimized = `[Optimizado por AI] ${config.sellingPoints} (Enfoque: Conciso y Atractivo)`;
        } else if (lang === 'pt') {
          optimized = `[Otimizado por AI] ${config.sellingPoints} (Foco: Conciso e Atraente)`;
        } else {
          optimized = `[AI Optimized] ${config.sellingPoints} (Focus: Concise & Hooking)`;
        }
      } else if (config.stage === 'details') {
        if (lang === 'es') {
          optimized = `[Optimizado por AI] ${config.sellingPoints} (Enfoque: Completo y Orientado al Valor)`;
        } else if (lang === 'pt') {
          optimized = `[Otimizado por AI] ${config.sellingPoints} (Foco: Completo e Orientado ao Valor)`;
        } else {
          optimized = `[AI Optimized] ${config.sellingPoints} (Focus: Complete & Value-driven)`;
        }
      } else if (config.stage === 'tracking') {
        if (lang === 'es') {
          optimized = `[Optimizado por AI] ${config.sellingPoints} (Enfoque: Ligero y Estilo Notificación)`;
        } else if (lang === 'pt') {
          optimized = `[Otimizado por AI] ${config.sellingPoints} (Foco: Leve e Estilo Notificação)`;
        } else {
          optimized = `[AI Optimized] ${config.sellingPoints} (Focus: Light & Notification-style)`;
        }
      }
      setConfig(prev => ({ ...prev, sellingPoints: optimized }));
      setToast({ message: t.common.dev_mode_notice + ': ' + t.common.success, type: 'warning' });
    } finally {
      setIsOptimizingSellingPoints(false);
    }
  };

  /**
   * 获取当前步骤缺失的必填项
   * @param step 步骤编号
   * @returns 缺失项的描述数组
   */
  const getMissingItems = (step: number) => {
    const missing: string[] = [];
    if (step === 1) {
      if (importMode === 'single') {
        if (!singleCreator.name) missing.push(t.workspace.validation_missing_name);
        if (!singleCreator.email) missing.push(t.workspace.validation_missing_email);
        if (!singleCreator.followers) missing.push(t.workspace.validation_missing_followers);
      } else {
        if (!file || uploadState !== 'success') missing.push(t.workspace.validation_missing_file);
      }
      if (!config.stage) missing.push(t.workspace.validation_missing_stage);
    } else if (step === 2) {
      if (!config.productName) missing.push(t.workspace.validation_missing_product);
      if (!config.sellingPoints) missing.push(t.workspace.validation_missing_points);
      if (!config.subject) missing.push(t.workspace.validation_missing_subject);
      
      if (config.enableFirstSentenceStrategy) {
        if (config.firstSentenceValues.length === 0 || !areKeywordsValid) {
          missing.push(t.workspace.validation_missing_keywords);
        }
      }
      
      if (config.stage === 'tracking' && !config.trackingNumber) {
        missing.push(t.workspace.validation_missing_tracking);
      }
    }
    return missing;
  };

  /**
   * 验证当前步骤是否可以进入下一步
   * @param step 步骤编号
   * @returns 验证结果对象
   */
  const validateStep = (step: number) => {
    const missing = getMissingItems(step);
    if (missing.length > 0) {
      return { valid: false, messages: missing };
    }
    return { valid: true, messages: [] };
  };

  /**
   * 检查用户登录状态
   * @returns 是否已登录
   */
  const checkLogin = () => {
    if (!user) {
      setToast({ message: t.user.login_required_tip, type: 'warning' });
      onLoginClick();
      return false;
    }
    return true;
  };

  /**
   * 处理进入下一步
   */
  const handleNext = () => {
    if (currentStep === 1 && !checkLogin()) return;
    
    const { valid, messages } = validateStep(currentStep);
    if (valid) {
      setValidationError(null);
      setShowValidation(false);
      setCurrentStep(Math.min(3, currentStep + 1));
    } else {
      setValidationError(messages.join('; '));
      setShowValidation(true);
    }
  };

  /**
   * 验证提醒组件
   * 展示当前步骤缺失的必填项
   */
  const ValidationAlert = ({ step }: { step: number }) => {
    if (!showValidation) return null;
    
    const missing = step === 3 ? missingSteps : getMissingItems(step);
    if (missing.length === 0) return null;

    return (
      <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/20 rounded-xl animate-in fade-in slide-in-from-top-2">
        <div className="flex items-start gap-3">
          <div className="p-1.5 bg-amber-100 dark:bg-amber-500/20 rounded-lg text-amber-600 dark:text-amber-400">
            <Info size={16} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-800 dark:text-amber-300 mb-1">{t.workspace.validation_title}</h4>
            <ul className="space-y-1">
              {missing.map((item, i) => (
                <li key={i} className="text-xs text-amber-700/80 dark:text-amber-400/70 flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-amber-400 dark:bg-amber-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  /**
   * 摘要头部组件
   * 用于在后续步骤展示前序步骤的配置摘要
   */
  const SummaryHeader = ({ title, items }: { title: string, items: { label: string, value: string }[] }) => (
    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800 mb-6">
      <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3">{title}</h4>
      <div className="grid grid-cols-2 gap-3 text-sm">
        {items.map((item, i) => (
          <p key={i}><span className="text-slate-500">{item.label}:</span> {item.value}</p>
        ))}
      </div>
    </div>
  );

  /**
   * 处理文件上传与解析
   * 
   * 使用 XLSX 库解析上传的 Excel/CSV 文件，校验表头是否包含必填项（达人姓名、粉丝数、邮箱）。
   * 支持模拟部分成功、配额不足等业务场景。
   * 
   * @param e 文件输入事件
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    // Reset stats
    setUploadStats({ total: 0, success: 0, failed: 0 });

    const isCSV = selectedFile.name.endsWith('.csv');
    const isXLSX = selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls');

    if (!isCSV && !isXLSX) {
      setUploadState('format_error');
      return;
    }

    setUploadState('parsing');
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

        if (jsonData.length === 0) {
          setUploadState('empty_file');
          setToast({ message: t.workspace.upload_status_empty_file, type: 'error' });
          return;
        }

        const headers = jsonData[0].map(h => String(h).trim());
        const requiredHeaders = [t.workspace.creator_name, t.workspace.followers, t.workspace.email];
        const hasRequiredHeaders = requiredHeaders.every(rh => headers.includes(rh));

        if (!hasRequiredHeaders) {
          setUploadState('header_error');
          setToast({ message: t.workspace.upload_status_header_error, type: 'error' });
          return;
        }

        const totalRows = jsonData.length - 1; // Exclude header
        if (totalRows === 0) {
          setUploadState('empty_file');
          setToast({ message: t.workspace.upload_status_empty_file, type: 'error' });
          return;
        }

        // Simulate some errors if the filename has "partial"
        const name = selectedFile.name.toLowerCase();
        if (name.includes('partial')) {
          const successCount = Math.floor(totalRows * 0.85);
          const failedCount = totalRows - successCount;
          setUploadState('partial_error');
          setUploadStats({ total: totalRows, success: successCount, failed: failedCount });
          setToast({ message: t.workspace.upload_status_partial_success.replace('{success_count}', String(successCount)).replace('{issue_count}', String(failedCount)), type: 'warning' });
        } else if (name.includes('quota')) {
          setUploadState('quota_error');
          setToast({ message: t.workspace.quota_error, type: 'error' });
        } else {
          setUploadState('success');
          setUploadStats({ total: totalRows, success: totalRows, failed: 0 });
          setToast({ message: t.common.success_upload, type: 'success' });
        }
        setFile(selectedFile);
      } catch (error) {
        console.error('File parsing error:', error);
        setUploadState('parsing_failed');
        setToast({ message: t.workspace.upload_status_parsing_failed, type: 'error' });
      }
    };
    reader.onerror = () => {
      setUploadState('parsing_failed');
      setToast({ message: t.workspace.upload_status_parsing_failed, type: 'error' });
    };
    reader.readAsBinaryString(selectedFile);
  };

  /**
   * 处理开始生成任务
   * 
   * 提交生成配置到后端（模拟），成功后展示任务提交成功弹窗。
   * 包含登录校验、配额校验及单条/批量模式处理。
   */
  const handleStart = async () => {
    if (!user) {
      onLoginClick();
      return;
    }
    
    if (!isReady) {
      setShowValidation(true);
      setValidationError(t.workspace.not_ready);
      return;
    }
    
    setIsGenerating(true);
    setToast({ message: t.workspace.submitting, type: 'info' });
    
    try {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let resultTaskId = null;
      if (importMode === 'batch') {
        if (!file) {
          setIsGenerating(false);
          return;
        }
        // Check quota
        if (user.quota !== 'unlimited' && user.quota <= 0) {
          setUploadState('quota_error');
          setIsGenerating(false);
          return;
        }
        resultTaskId = await onStartGenerate(file, config);
      } else {
        if (!singleCreator.name || !singleCreator.email || !singleCreator.followers) {
          setIsGenerating(false);
          return;
        }
        // Check quota
        if (user.quota !== 'unlimited' && user.quota <= 0) {
          setIsGenerating(false);
          return;
        }
        const mockFile = new File([''], 'single_creator.csv', { type: 'text/csv' });
        resultTaskId = await onStartGenerate(mockFile, { ...config, singleCreator });
      }

      if (resultTaskId) {
        setIsTaskSubmittedModalOpen(true);
        setToast({ message: `${t.workspace.task_submitted_title}，正在后台生成`, type: 'success' });
      }
    } catch (error) {
      console.error('Task submission failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const areKeywordsValid = config.enableFirstSentenceStrategy 
    ? config.firstSentenceValues.every(v => config.valuePointsKeywords[v] && config.valuePointsKeywords[v].trim().length > 0)
    : true;

  const isReady = !(
    (importMode === 'batch' && (!file || uploadState !== 'success')) ||
    (importMode === 'single' && (!singleCreator.name || !singleCreator.email || !singleCreator.followers)) ||
    !config.tone || 
    !config.subject ||
    (config.stage !== 'tracking' && (!config.productName || !config.sellingPoints)) ||
    (config.stage === 'tracking' && !config.trackingNumber) ||
    (config.enableFirstSentenceStrategy && (config.firstSentenceValues.length === 0 || !areKeywordsValid))
  );

  const missingSteps = [];
  if (importMode === 'batch' && (!file || uploadState !== 'success')) missingSteps.push('导入达人数据');
  if (importMode === 'single' && (!singleCreator.name || !singleCreator.email || !singleCreator.followers)) missingSteps.push('完善达人信息');
  if (config.stage !== 'tracking' && (!config.productName || !config.sellingPoints)) missingSteps.push('完善产品与卖点');
  if (config.stage === 'tracking' && !config.trackingNumber) missingSteps.push('填写物流单号');
  if (!config.subject) missingSteps.push('生成邮件标题');
  if (config.enableFirstSentenceStrategy && (config.firstSentenceValues.length === 0 || !areKeywordsValid)) missingSteps.push('完善正文策略');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto pb-20">
      {/* 升级引导弹窗 */}
      <Modal 
        isOpen={isUpgradeModalOpen} 
        onClose={() => setIsUpgradeModalOpen(false)} 
        title={t.workspace.deep_thinking_lock_title} 
        width="max-w-sm"
      >
        <div className="py-4">
          <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-500/10 rounded-full flex items-center justify-center mb-6 mx-auto">
            <Sparkles size={32} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 text-center mb-8 leading-relaxed">
            {t.workspace.deep_thinking_lock_desc}
          </p>
          <div className="flex gap-3">
            <button 
              onClick={() => setIsUpgradeModalOpen(false)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              {t.workspace.not_now}
            </button>
            <button 
              onClick={() => {
                setIsUpgradeModalOpen(false);
                setPendingDeepThinkingExpand(true);
                onChangeView('my_plan');
                // 模拟滚动到专业版
                setTimeout(() => {
                  const proCard = document.querySelector('[data-plan-id="pro"]');
                  if (proCard) {
                    proCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    proCard.classList.add('ring-4', 'ring-indigo-500/50', 'scale-105');
                    setTimeout(() => {
                      proCard.classList.remove('ring-4', 'ring-indigo-500/50', 'scale-105');
                    }, 2000);
                  }
                }, 100);
              }}
              className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20"
            >
              {t.workspace.view_plans}
            </button>
          </div>
        </div>
      </Modal>

      {/* 任务已提交弹窗 */}
      <Modal 
        isOpen={isTaskSubmittedModalOpen} 
        onClose={() => setIsTaskSubmittedModalOpen(false)} 
        title={t.workspace.task_submitted_title} 
        width="max-w-sm"
      >
        <div className="py-4">
          <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 mx-auto">
            <CheckCircle2 size={32} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 text-center mb-8 leading-relaxed">
            {t.workspace.task_submitted_desc.replace('{time}', '2-5')}
          </p>
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => {
                setIsTaskSubmittedModalOpen(false);
                onChangeView('history');
              }}
              className="w-full px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
            >
              <Eye size={16} />
              {t.workspace.view_history}
            </button>
            <button 
              onClick={() => setIsTaskSubmittedModalOpen(false)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              {t.workspace.stay_here}
            </button>
          </div>
        </div>
      </Modal>

      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">{t.workspace.title}</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-3 text-base">{t.workspace.subtitle}</p>
      </div>

      {/* Step Navigation */}
      <div className="flex items-center justify-center gap-4 mb-12">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              currentStep === step ? 'bg-indigo-600 text-white' :
              currentStep > step ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
            }`}>
              {currentStep > step ? <CheckCircle2 size={16} /> : step}
            </div>
            <span className={`ml-2 text-sm font-medium ${currentStep === step ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}>
              {step === 1 ? t.workspace.step_1 : step === 2 ? t.workspace.step_2 : t.workspace.step_3}
            </span>
            {step < 3 && <div className="w-12 h-px bg-slate-200 dark:bg-slate-700 mx-4" />}
          </div>
        ))}
      </div>

      {/* Validation Error */}
      {showValidation && validationError && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2 mb-6 animate-in fade-in slide-in-from-top-2">
          <AlertCircle size={16} />
          {validationError}
        </div>
      )}

      <div className="space-y-8">
        {/* Step 1: Import */}
        {currentStep === 1 && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <ValidationAlert step={1} />
            
            {/* Generation Language Selection */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col transition-colors duration-200">
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Sparkles size={18} />
                </div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">{t.workspace.gen_language}</h3>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-4 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <Info size={16} className="text-indigo-400 shrink-0" />
                  {t.workspace.gen_language_hint}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: 'en', label: t.workspace.lang_en, flag: '🇺🇸' },
                    { id: 'es', label: t.workspace.lang_es, flag: '🇪🇸' },
                    { id: 'pt', label: t.workspace.lang_pt, flag: '🇧🇷' }
                  ].map(lang => (
                    <button
                      key={lang.id}
                      onClick={() => setConfig({ ...config, genLanguage: lang.id as any })}
                      className={`relative flex flex-col items-center justify-center py-6 px-4 rounded-2xl border-2 transition-all group ${
                        config.genLanguage === lang.id
                          ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-500/10 ring-1 ring-indigo-500 shadow-lg shadow-indigo-500/10'
                          : 'border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/30 hover:border-slate-200 dark:hover:border-slate-700'
                      }`}
                    >
                      <span className="text-3xl mb-3 group-hover:scale-110 transition-transform">{lang.flag}</span>
                      <span className={`text-sm font-bold ${config.genLanguage === lang.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`}>
                        {lang.label}
                      </span>
                      {config.genLanguage === lang.id && (
                        <div className="absolute top-3 right-3 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
                          <CheckCircle2 size={14} className="text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col transition-colors duration-200">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <UploadCloud size={18} />
                </div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">{t.workspace.creator_source}</h3>
              </div>
              
              {/* Import Mode Toggle */}
              <div className="bg-slate-200/50 dark:bg-slate-800 p-1 rounded-lg flex items-center">
                <button
                  onClick={() => setImportMode('single')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    importMode === 'single'
                      ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  {t.workspace.single}
                </button>
                <button
                  onClick={() => setImportMode('batch')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    importMode === 'batch'
                      ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  {t.workspace.batch}
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {importMode === 'single' ? (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="text-sm text-slate-600 dark:text-slate-400 bg-indigo-50/50 dark:bg-indigo-500/5 p-3 rounded-xl border border-indigo-100/50 dark:border-indigo-500/20 flex items-start gap-2">
                    <Info size={16} className="text-indigo-400 shrink-0 mt-0.5" />
                    <p>{t.workspace.single_mode_tip}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t.workspace.creator_name} <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        placeholder="例如：TechReviewer"
                        value={singleCreator.name}
                        onChange={e => setSingleCreator({...singleCreator, name: e.target.value})}
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t.workspace.email} <span className="text-red-500">*</span></label>
                      <input 
                        type="email" 
                        placeholder="例如：contact@example.com"
                        value={singleCreator.email}
                        onChange={e => setSingleCreator({...singleCreator, email: e.target.value})}
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t.workspace.followers} <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        placeholder="例如：1.5M"
                        value={singleCreator.followers}
                        onChange={e => setSingleCreator({...singleCreator, followers: e.target.value})}
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t.workspace.profile_url} <span className="text-slate-400 dark:text-slate-500 font-normal text-xs">{t.workspace.optional}</span></label>
                      <input 
                        type="url" 
                        placeholder="例如：https://tiktok.com/@techreviewer"
                        value={singleCreator.profileUrl}
                        onChange={e => setSingleCreator({...singleCreator, profileUrl: e.target.value})}
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col animate-in fade-in duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-slate-600 dark:text-slate-400 bg-indigo-50/50 dark:bg-indigo-500/5 p-3 rounded-xl border border-indigo-100/50 dark:border-indigo-500/20 flex items-start gap-2 flex-1 mr-4">
                      <Info size={16} className="text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-indigo-700 dark:text-indigo-300 mb-0.5">{t.workspace.batch_mode_tip}</p>
                        <p className="text-xs opacity-80">{t.workspace.upload_desc}</p>
                      </div>
                    </div>
                    <div className="group relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!checkLogin()) return;
                          // Download logic would go here
                        }}
                        className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all"
                      >
                        <FileText size={16} />
                        {t.workspace.download_template}
                      </button>
                      <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-slate-800 text-white text-[10px] rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
                        {t.workspace.download_template_tooltip}
                      </div>
                    </div>
                  </div>
                  
                  {/* File Upload Area */}
                  
                  <input 
                    type="file" 
                    accept=".csv,.xlsx,.xls" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                  
                  <div 
                    onClick={() => {
                      if (!checkLogin()) return;
                      fileInputRef.current?.click();
                    }}
                    className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center py-12 px-6 text-center cursor-pointer transition-all relative overflow-hidden ${
                      uploadState === 'success' 
                        ? 'border-emerald-200 dark:border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-500/5' 
                        : uploadState === 'format_error' || uploadState === 'header_error' || uploadState === 'quota_error' || uploadState === 'empty_file' || uploadState === 'parsing_failed'
                        ? 'border-red-200 dark:border-red-500/30 bg-red-50/50 dark:bg-red-500/5'
                        : uploadState === 'partial_error'
                        ? 'border-amber-200 dark:border-amber-500/30 bg-amber-50/50 dark:bg-amber-500/5'
                        : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5'
                    }`}
                  >
                    {uploadState === 'idle' && (
                      <>
                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                          <UploadCloud size={24} className="text-slate-400 dark:text-slate-500" />
                        </div>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">{t.workspace.upload_title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{t.workspace.upload_desc}</p>
                      </>
                    )}
                    
                    {uploadState === 'parsing' && (
                      <>
                        <div className="relative w-16 h-16 mb-4">
                          <Loader2 size={64} className="text-indigo-500 animate-spin opacity-20" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <UploadCloud size={24} className="text-indigo-500 animate-pulse" />
                          </div>
                        </div>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{t.common.loading_parsing}</p>
                        <div className="mt-4 w-48 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 animate-progress-indeterminate"></div>
                        </div>
                      </>
                    )}
 
                    {uploadState === 'success' && file && (
                      <>
                        <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center mb-4 animate-in zoom-in duration-300">
                          <CheckCircle2 size={24} className="text-emerald-500" />
                        </div>
                        <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400 mb-1">{file.name}</p>
                        <p className="text-xs text-emerald-600/70 dark:text-emerald-500/50">
                          {t.workspace.upload_status_success.replace('{count}', uploadStats.success.toString())}
                        </p>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setFile(null); setUploadState('idle'); }}
                          className="mt-4 px-4 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                        >
                          {t.workspace.reupload}
                        </button>
                      </>
                    )}
 
                    {uploadState === 'partial_error' && file && (
                      <>
                        <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center mb-4 animate-in zoom-in duration-300">
                          <AlertCircle size={24} className="text-amber-500" />
                        </div>
                        <p className="text-sm font-medium text-amber-700 dark:text-amber-400 mb-1">{file.name}</p>
                        <p className="text-xs text-amber-600/70 dark:text-amber-500/50">
                          {t.workspace.upload_status_partial_data_issue
                            .replace('{total}', uploadStats.total.toString())
                            .replace('{issue_count}', uploadStats.failed.toString())}
                        </p>
                        <div className="flex gap-3 mt-4">
                          <button 
                            onClick={(e) => { e.stopPropagation(); setUploadState('success'); }}
                            className="px-4 py-1.5 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-700 transition-all shadow-sm"
                          >
                            继续导入成功数据
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); setFile(null); setUploadState('idle'); }}
                            className="px-4 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                          >
                            {t.workspace.reupload}
                          </button>
                        </div>
                      </>
                    )}
 
                    {(uploadState === 'format_error' || uploadState === 'header_error' || uploadState === 'quota_error' || uploadState === 'empty_file' || uploadState === 'parsing_failed') && (
                      <>
                        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center mb-4 animate-in zoom-in duration-300">
                          <AlertCircle size={24} className="text-red-500" />
                        </div>
                        <p className="text-sm font-medium text-red-700 dark:text-red-400 mb-1">
                          {uploadState === 'format_error' && t.workspace.upload_status_file_type_error}
                          {uploadState === 'header_error' && t.workspace.upload_status_header_error}
                          {uploadState === 'quota_error' && t.workspace.quota_error}
                          {uploadState === 'empty_file' && t.workspace.upload_status_empty_file}
                          {uploadState === 'parsing_failed' && t.workspace.upload_status_parsing_failed}
                        </p>
                        <p className="text-xs text-red-600/70 dark:text-red-500/50 max-w-xs">
                          {uploadState === 'format_error' && t.workspace.format_error_desc}
                          {uploadState === 'header_error' && t.workspace.header_error_desc}
                          {uploadState === 'quota_error' && t.workspace.quota_error_desc}
                          {uploadState === 'empty_file' && '请检查文件内容是否包含有效达人数据'}
                          {uploadState === 'parsing_failed' && '文件编码或格式可能已损坏，请重新导出'}
                        </p>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setUploadState('idle'); }}
                          className="mt-4 px-4 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                        >
                          {t.workspace.retry}
                        </button>
                      </>
                    )}
                  </div>

                  {/* Status Feedback Area (Footer) */}
                  <div className="mt-4 flex items-center justify-between px-2">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${uploadState === 'idle' ? 'bg-slate-300' : uploadState === 'parsing' ? 'bg-indigo-500 animate-pulse' : uploadState === 'success' ? 'bg-emerald-500' : uploadState === 'partial_error' ? 'bg-amber-500' : 'bg-red-500'}`} />
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                          {uploadState === 'idle' && t.workspace.upload_status_default}
                          {uploadState === 'parsing' && t.workspace.upload_status_parsing}
                          {uploadState === 'success' && t.workspace.upload_status_success.replace('{count}', uploadStats.success.toString())}
                          {uploadState === 'partial_error' && t.workspace.upload_status_partial_success.replace('{success_count}', uploadStats.success.toString()).replace('{issue_count}', uploadStats.failed.toString())}
                          {uploadState === 'format_error' && t.workspace.upload_status_file_type_error}
                          {uploadState === 'header_error' && t.workspace.upload_status_header_error}
                          {uploadState === 'empty_file' && t.workspace.upload_status_empty_file}
                          {uploadState === 'parsing_failed' && t.workspace.upload_status_parsing_failed}
                          {uploadState === 'quota_error' && t.workspace.quota_error}
                        </span>
                      </div>
                    </div>
                    
                    {/* Demo State Switcher (Only for visualization) */}
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-slate-400 mr-1">演示状态:</span>
                      {(['idle', 'parsing', 'success', 'format_error', 'header_error', 'empty_file', 'partial_error', 'parsing_failed'] as const).map((s) => (
                        <button
                          key={s}
                          onClick={() => {
                            setUploadState(s);
                            if (s === 'success') setUploadStats({ total: 50, success: 50, failed: 0 });
                            if (s === 'partial_error') setUploadStats({ total: 100, success: 85, failed: 15 });
                          }}
                          className={`w-2 h-2 rounded-full transition-all hover:scale-125 ${uploadState === s ? 'ring-2 ring-indigo-500 ring-offset-1 dark:ring-offset-slate-900' : 'opacity-30'} ${
                            s === 'idle' ? 'bg-slate-400' : s === 'parsing' ? 'bg-indigo-500' : s === 'success' ? 'bg-emerald-500' : s === 'partial_error' ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                          title={s}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          </div>
        )}

        {/* Step 2: Config */}
        {currentStep === 2 && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Summary Header */}
            <div className="bg-indigo-50/50 dark:bg-indigo-500/5 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-500/20 mb-8 flex items-center justify-between group transition-all hover:bg-indigo-50 dark:hover:bg-indigo-500/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm group-hover:scale-110 transition-transform">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">{t.workspace.step_1_summary}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-indigo-400" /> {importMode === 'single' ? t.workspace.single : t.workspace.batch}</span>
                    <span className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-indigo-400" /> {STAGES.find(s => s.id === config.stage)?.label}</span>
                    <span className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-indigo-400" /> {t.workspace[`lang_${config.genLanguage as 'en' | 'es' | 'pt'}`]}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setCurrentStep(1)}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-indigo-100/50 dark:hover:bg-indigo-500/20 transition-all"
              >
                {t.workspace.modify}
              </button>
            </div>

            <ValidationAlert step={2} />

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col transition-colors duration-200">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Settings size={18} />
            </div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">{t.workspace.email_config}</h3>
          </div>
          
          <div className="p-6 space-y-8">
            {/* Stage Selector */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.workspace.current_stage}</label>
              <div className="bg-slate-100/80 dark:bg-slate-800 p-1 rounded-xl flex items-center mb-2">
                {STAGES.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setConfig({...config, stage: s.id as Stage})}
                    className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                      config.stage === s.id 
                        ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-sm ring-1 ring-slate-200/50 dark:ring-slate-600/50' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                <AlertCircle size={14} className="text-indigo-400" />
                {STAGES.find(s => s.id === config.stage)?.desc}
              </p>
            </div>

            <div className="h-px bg-slate-100 dark:bg-slate-800 -mx-6"></div>

            {/* Brand Strategy Group - Dynamic Content */}
            {config.stage !== 'tracking' ? (
              <div className="animate-in fade-in duration-500">
                <div className="flex items-center gap-2 mb-3">
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{t.workspace.brand_strategy}</h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">{t.workspace.core_material}</span>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-6">
                  {/* Brand Size Selection */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.workspace.brand_strategy_select}</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setConfig({...config, brandSize: 'small'})}
                        className={`py-2.5 px-3 text-sm font-medium rounded-lg border transition-all flex flex-col items-center justify-center gap-1 ${
                          config.brandSize === 'small'
                            ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300 shadow-sm'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span>{t.workspace.new_brand}</span>
                      </button>
                      <button
                        onClick={() => setConfig({...config, brandSize: 'large'})}
                        className={`py-2.5 px-3 text-sm font-medium rounded-lg border transition-all flex flex-col items-center justify-center gap-1 ${
                          config.brandSize === 'large'
                            ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300 shadow-sm'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span>{t.workspace.big_brand}</span>
                      </button>
                    </div>
                    <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 bg-white/60 dark:bg-slate-900/60 p-2 rounded border border-slate-100 dark:border-slate-800">
                      {config.brandSize === 'small' 
                        ? <span className="flex items-start gap-1.5"><AlertCircle size={14} className="text-amber-500 shrink-0 mt-0.5" /> {t.workspace.new_brand_desc}</span>
                        : <span className="flex items-start gap-1.5"><AlertCircle size={14} className="text-emerald-500 shrink-0 mt-0.5" /> {t.workspace.big_brand_desc}</span>
                      }
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t.workspace.brand_name} <span className="text-slate-400 dark:text-slate-500 font-normal text-xs">{t.workspace.optional}</span></label>
                      <input 
                        type="text" 
                        placeholder="例如：ZIMO"
                        value={config.brandName || ''}
                        onChange={e => setConfig({...config, brandName: e.target.value})}
                        className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t.workspace.product_name} <span className="text-red-500">*</span></label>
                        <span className={`text-xs ${config.productName.length > 50 ? 'text-red-500 font-medium' : 'text-slate-400 dark:text-slate-500'}`}>
                          {config.productName.length} / 50
                        </span>
                      </div>
                      <input 
                        type="text" 
                        placeholder="例如：Smart Vacuum V2"
                        value={config.productName}
                        maxLength={50}
                        onChange={e => setConfig({...config, productName: e.target.value})}
                        className={`w-full px-4 py-2.5 bg-white dark:bg-slate-900 border rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                          config.productName.length > 50 ? 'border-red-300 dark:border-red-500/50 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        {t.workspace.selling_points} <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={handleOptimizeSellingPoints}
                          disabled={isOptimizingSellingPoints || !config.sellingPoints}
                          className="text-[10px] font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 transition-all disabled:opacity-50"
                        >
                          {isOptimizingSellingPoints ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                          {isOptimizingSellingPoints ? t.common.loading_ai_points : t.workspace.ai_optimize}
                        </button>
                        <span className={`text-xs ${config.sellingPoints.length > 300 ? 'text-red-500 font-medium' : 'text-slate-400 dark:text-slate-500'}`}>
                          {config.sellingPoints.length} / 300
                        </span>
                      </div>
                    </div>
                    <textarea 
                      placeholder={t.workspace.selling_points_placeholder}
                      rows={3}
                      maxLength={300}
                      value={config.sellingPoints}
                      onChange={e => setConfig({...config, sellingPoints: e.target.value})}
                      className={`w-full px-4 py-2.5 bg-white dark:bg-slate-900 border rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none ${
                        config.sellingPoints.length > 300 ? 'border-red-300 dark:border-red-500/50 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t.workspace.commission_rate} <span className="text-slate-400 dark:text-slate-500 font-normal text-xs">{t.workspace.optional}</span></label>
                      <div className="relative">
                        <input 
                          type="number" 
                          placeholder="例如：10"
                          value={config.commissionRate}
                          onChange={e => setConfig({...config, commissionRate: e.target.value})}
                          className="w-full pl-4 pr-8 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-sm">%</span>
                      </div>
                    </div>
                    {config.stage === 'initial' ? (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t.workspace.sample_threshold} <span className="text-slate-400 dark:text-slate-500 font-normal text-xs">{t.workspace.optional}</span></label>
                        <input 
                          type="number" 
                          placeholder="例如：10000"
                          value={config.freeSampleThreshold}
                          onChange={e => setConfig({...config, freeSampleThreshold: e.target.value})}
                          className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t.workspace.collab_notes} <span className="text-slate-400 dark:text-slate-500 font-normal text-xs">{t.workspace.optional}</span></label>
                        <input 
                          type="text" 
                          placeholder={t.workspace.collab_notes_placeholder}
                          value={config.collabNotes}
                          onChange={e => setConfig({...config, collabNotes: e.target.value})}
                          className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in duration-500">
                <div className="flex items-center gap-2 mb-3">
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{t.workspace.stage_tracking}</h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">{t.workspace.core_material}</span>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t.workspace.tracking_number} <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        placeholder="例如：YT1234567890"
                        value={config.trackingNumber}
                        onChange={e => setConfig({...config, trackingNumber: e.target.value})}
                        className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t.workspace.carrier} <span className="text-slate-400 dark:text-slate-500 font-normal text-xs">{t.workspace.optional}</span></label>
                      <input 
                        type="text" 
                        placeholder="例如：FedEx, UPS, DHL"
                        value={config.carrier}
                        onChange={e => setConfig({...config, carrier: e.target.value})}
                        className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t.workspace.package_content} <span className="text-slate-400 dark:text-slate-500 font-normal text-xs">{t.workspace.optional}</span></label>
                    <textarea 
                      placeholder={t.workspace.package_content_placeholder}
                      rows={2}
                      value={config.packageContent}
                      onChange={e => setConfig({...config, packageContent: e.target.value})}
                      className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t.workspace.additional_notes} <span className="text-slate-400 dark:text-slate-500 font-normal text-xs">{t.workspace.optional}</span></label>
                    <textarea 
                      placeholder="例如：包裹包含两件样品，请注意查收。期待您的反馈！"
                      rows={2}
                      value={config.additionalNotes}
                      onChange={e => setConfig({...config, additionalNotes: e.target.value})}
                      className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="h-px bg-slate-100 dark:bg-slate-800 -mx-6"></div>

            {/* Subject Strategy */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{t.workspace.ai_subject}</h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/30">{t.workspace.ai_powered}</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    {t.workspace.current_gen_language.replace('{lang}', t.workspace[`lang_${config.genLanguage as 'en' | 'es' | 'pt'}`])}
                  </span>
                </div>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {subjectGenerated ? t.workspace.subject_refresh_tip : t.workspace.subject_tip}
                    </div>
                    <button 
                      onClick={handleGenerateSubject}
                      disabled={isGeneratingSubject}
                      className="bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-70 shrink-0 shadow-sm"
                    >
                      {isGeneratingSubject ? <Loader2 size={16} className="animate-spin" /> : subjectGenerated ? <RefreshCw size={14} /> : <Sparkles size={16} />}
                      {isGeneratingSubject ? t.common.loading_ai_subject : t.workspace.generate_subject}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={config.subject}
                      onChange={(e) => {
                        setConfig({...config, subject: e.target.value});
                        if (!subjectGenerated && e.target.value) setSubjectGenerated(true);
                      }}
                      placeholder={t.workspace.subject_placeholder || "请输入邮件标题"}
                      className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-500/30 rounded-lg text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                    />
                  </div>
                </div>
                {showValidation && !config.subject && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5 mt-2 bg-amber-50 dark:bg-amber-500/5 p-2 rounded-md border border-amber-100 dark:border-amber-500/20">
                    <AlertCircle size={14} />
                    {t.workspace.validation_missing_subject}
                  </p>
                )}
              </div>
            </div>

            <div className="h-px bg-slate-100 dark:bg-slate-800 -mx-6"></div>

            {/* Body Strategy */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{t.workspace.body_strategy}</h4>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-500/30">{t.workspace.advanced_gen}</span>
                    {!hasDeepThinkingAccess && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/30">
                        {t.workspace.deep_thinking_pro_tag}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    {t.workspace.current_gen_language.replace('{lang}', t.workspace[`lang_${config.genLanguage as 'en' | 'es' | 'pt'}`])}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {!hasDeepThinkingAccess 
                      ? t.workspace.deep_thinking_permission_hint
                      : (!config.enableFirstSentenceStrategy 
                          ? t.workspace.body_strategy_default
                          : (config.stage === 'initial' 
                              ? t.workspace.body_strategy_enabled_initial 
                              : (config.stage === 'details' 
                                  ? t.workspace.body_strategy_enabled_details 
                                  : t.workspace.body_strategy_enabled_tracking)))
                    }
                  </div>
                  <button 
                    onClick={() => {
                      if (!hasDeepThinkingAccess) {
                        setIsUpgradeModalOpen(true);
                        return;
                      }
                      setConfig({...config, enableFirstSentenceStrategy: !config.enableFirstSentenceStrategy});
                    }}
                    className={`px-5 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all shrink-0 ${
                      !hasDeepThinkingAccess
                        ? 'bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 cursor-not-allowed'
                        : config.enableFirstSentenceStrategy
                          ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 shadow-sm'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm'
                    }`}
                  >
                    <Sparkles size={16} className={config.enableFirstSentenceStrategy ? "text-indigo-500" : "text-slate-400"} />
                    {config.enableFirstSentenceStrategy ? t.workspace.cancel_deep_think : t.workspace.deep_think}
                  </button>
                </div>

                {config.enableFirstSentenceStrategy && (
                  <div className="pt-5 border-t border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">{t.workspace.value_points_title}</label>
                    <div className="grid grid-cols-1 gap-4">
                      {Object.entries(t.workspace.value_points[config.stage as keyof typeof t.workspace.value_points]).map(([id, vp]) => {
                        const isSelected = config.firstSentenceValues.includes(id);
                        const keywords = config.valuePointsKeywords[id] || '';
                        const isError = isSelected && keywords.trim().length === 0;

                        return (
                          <div key={id} className="space-y-3">
                            <button
                              onClick={() => {
                                const newValues = isSelected 
                                  ? config.firstSentenceValues.filter(v => v !== id)
                                  : [...config.firstSentenceValues, id];
                                setConfig({...config, firstSentenceValues: newValues});
                              }}
                              className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                                isSelected
                                  ? 'bg-indigo-50/50 dark:bg-indigo-500/10 border-indigo-300 dark:border-indigo-500/30 ring-1 ring-indigo-500/20 shadow-sm'
                                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-800/50'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1.5">
                                <span className={`text-sm font-medium ${isSelected ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-300'}`}>
                                  {vp.label}
                                </span>
                                {isSelected && <CheckCircle2 size={16} className="text-indigo-500" />}
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{vp.desc}</p>
                            </button>
                            
                            {isSelected && (
                              <div className="px-1 animate-in fade-in slide-in-from-top-1 duration-200">
                                <div className="flex items-center justify-between mb-1.5">
                                  <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                    {t.workspace.vp_keywords_label}
                                    {isError && <span className="text-red-500 text-[10px] animate-pulse">({t.workspace.vp_keywords_error})</span>}
                                  </label>
                                </div>
                                <input 
                                  type="text" 
                                  placeholder={vp.placeholder}
                                  value={keywords}
                                  onChange={e => {
                                    const val = e.target.value;
                                    setConfig({
                                      ...config, 
                                      valuePointsKeywords: {
                                        ...config.valuePointsKeywords,
                                        [id]: val
                                      }
                                    });
                                  }}
                                  className={`w-full px-4 py-2.5 bg-white dark:bg-slate-900 border rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                                    isError ? 'border-red-300 dark:border-red-500/50 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500'
                                  }`}
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.workspace.tone_of_voice}</label>
              <div className="flex flex-col sm:flex-row gap-3">
                {[
                  { id: 'professional', label: t.workspace.tone_pro },
                  { id: 'casual', label: t.workspace.tone_casual },
                  { id: 'urgent', label: t.workspace.tone_urgent }
                ].map(tone => (
                  <label
                    key={tone.id}
                    className={`relative flex-1 flex items-center py-3.5 px-4 rounded-xl text-sm font-medium border cursor-pointer transition-all ${
                      config.tone === tone.id 
                        ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300 shadow-sm' 
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="tone" 
                      value={tone.id} 
                      checked={config.tone === tone.id}
                      onChange={() => setConfig({...config, tone: tone.id})}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                        config.tone === tone.id ? 'border-indigo-500' : 'border-slate-300 dark:border-slate-600'
                      }`}>
                        {config.tone === tone.id && <div className="w-2 h-2 rounded-full bg-indigo-500" />}
                      </div>
                      {tone.label}
                    </div>
                  </label>
                ))}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 flex items-center gap-1.5">
                <AlertCircle size={14} className="text-slate-400 dark:text-slate-500" />
                {t.workspace.tone_tip}
              </p>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Step 3: Confirm & Generate */}
      {currentStep === 3 && (
        <div className="space-y-8 animate-in fade-in duration-500">
            <ValidationAlert step={3} />
            {/* Summary Headers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-indigo-50/50 dark:bg-indigo-500/5 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-500/20 flex items-center justify-between group transition-all hover:bg-indigo-50 dark:hover:bg-indigo-500/10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm group-hover:scale-110 transition-transform">
                    <User size={24} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">{t.workspace.step_1_summary}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-indigo-400" /> {importMode === 'single' ? t.workspace.single : t.workspace.batch}</span>
                      <span className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-indigo-400" /> {STAGES.find(s => s.id === config.stage)?.label}</span>
                      <span className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-indigo-400" /> {t.workspace[`lang_${config.genLanguage as 'en' | 'es' | 'pt'}`]}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-indigo-100/50 dark:hover:bg-indigo-500/20 transition-all"
                >
                  {t.workspace.modify}
                </button>
              </div>

              <div className="bg-indigo-50/50 dark:bg-indigo-500/5 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-500/20 flex items-center justify-between group transition-all hover:bg-indigo-50 dark:hover:bg-indigo-500/10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm group-hover:scale-110 transition-transform">
                    <Send size={24} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">{t.workspace.step_2_summary}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-indigo-400" /> {config.brandSize === 'small' ? t.workspace.new_brand : t.workspace.big_brand}</span>
                      <span className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-indigo-400" /> {t.workspace[`tone_${config.tone as 'pro' | 'casual' | 'urgent'}`]}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setCurrentStep(2)}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-indigo-100/50 dark:hover:bg-indigo-500/20 transition-all"
                >
                  {t.workspace.modify}
                </button>
              </div>
            </div>

            {/* Final Confirmation Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <CheckCircle2 size={20} className="text-emerald-500" />
                  {t.workspace.confirm_card_title}
                </h3>
              </div>
              
              <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Task Scope */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t.workspace.confirm_task_scope}</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500 dark:text-slate-400">{t.workspace.confirm_import_mode}</span>
                        <span className="font-medium text-slate-900 dark:text-slate-100">{importMode === 'single' ? t.workspace.single : t.workspace.batch}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500 dark:text-slate-400">{t.workspace.confirm_creator_count}</span>
                        <span className="font-medium text-slate-900 dark:text-slate-100">{importMode === 'single' ? '1' : (uploadStats.success || '0')} 位</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500 dark:text-slate-400">{t.workspace.gen_language}</span>
                        <span className="font-medium text-slate-900 dark:text-slate-100">{t.workspace[`lang_${config.genLanguage as 'en' | 'es' | 'pt'}`]}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500 dark:text-slate-400">{t.workspace.current_stage}</span>
                        <span className="font-medium text-slate-900 dark:text-slate-100">{STAGES.find(s => s.id === config.stage)?.label}</span>
                      </div>
                    </div>
                  </div>

                  {/* Generation Config */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t.workspace.confirm_gen_config}</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500 dark:text-slate-400">{t.workspace.brand_strategy}</span>
                        <span className="font-medium text-slate-900 dark:text-slate-100">{config.brandSize === 'small' ? t.workspace.new_brand : t.workspace.big_brand}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500 dark:text-slate-400">{t.workspace.confirm_subject_status}</span>
                        <span className={`font-medium ${subjectGenerated ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                          {subjectGenerated ? t.workspace.confirm_subject_done : t.workspace.confirm_subject_none}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500 dark:text-slate-400">{t.workspace.confirm_body_strategy}</span>
                        <span className="font-medium text-slate-900 dark:text-slate-100">
                          {config.enableFirstSentenceStrategy ? t.workspace.deep_think : t.workspace.body_strategy_default}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Execution Expectation */}
                <div className="p-6 bg-indigo-50/30 dark:bg-indigo-500/5 rounded-2xl border border-indigo-100/50 dark:border-indigo-500/10">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-4">{t.workspace.confirm_execution}</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      {t.workspace.confirm_expectation_text.replace('{count}', importMode === 'single' ? '1' : (uploadStats.success || '0').toString())}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      {t.workspace.confirm_quota_text.replace('{count}', importMode === 'single' ? '1' : (uploadStats.success || '0').toString())}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 italic">
                      <Info size={14} className="text-indigo-400" />
                      {t.workspace.confirm_view_history}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              className="px-6 py-2.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              {t.workspace.prev_step}
            </button>
          ) : <div />}
          
          {currentStep < 3 ? (
            <div className="flex items-center gap-4">
              {showValidation && getMissingItems(currentStep).length > 0 && (
                <span className="text-xs text-amber-600 dark:text-amber-400 font-medium hidden sm:block animate-pulse">
                  {t.workspace.validation_next_disabled}
                </span>
              )}
              <button
                onClick={handleNext}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm"
              >
                {t.workspace.next_step}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              {showValidation && !isReady && (
                <span className="text-xs text-amber-600 dark:text-amber-400 font-medium hidden sm:block animate-pulse">
                  {t.workspace.not_ready}
                </span>
              )}
              <div className="hidden lg:block text-right">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">{t.workspace.confirm_execution}</p>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  {t.workspace.confirm_expectation_text.replace('{count}', importMode === 'single' ? '1' : (uploadStats.success || '0').toString())}
                </p>
              </div>
              <button
                onClick={handleStart}
                disabled={isGenerating}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-70 flex items-center gap-2 hover:scale-105 active:scale-95"
              >
                {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={18} />}
                {isGenerating ? t.workspace.submitting : t.workspace.generate_btn}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
