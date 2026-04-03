# 项目架构与业务流程文档

本文档旨在说明项目的代码架构、目录结构、文件说明以及核心业务流程。

## 1. 代码架构

本项目采用 **React 18 + Vite + TypeScript** 构建，是一个典型的单页应用 (SPA)。

### 核心技术栈
- **前端框架**: React 18
- **样式方案**: Tailwind CSS
- **动画库**: Framer Motion
- **图标库**: Lucide React
- **国际化**: 自定义 i18n 系统 (`src/i18n.ts`)
- **状态管理**: React Hooks (useState, useEffect, useContext)

## 2. 目录结构说明

```text
/src
  /components        # 可复用 UI 组件
    AccountCenter.tsx    # 个人中心
    AlipayInfo.tsx       # 支付宝信息管理
    CommissionAudit.tsx  # 佣金审核管理
    DistributionConfig.tsx # 分销规则配置
    PromotionApply.tsx   # 推广权限申请入口
    PromotionForm.tsx    # 推广权限申请表单
    Workspace.tsx        # 工作台/核心业务操作区
  /lib               # 工具函数与库配置
    utils.ts             # 通用工具函数 (如 cn 辅助函数)
  App.tsx            # 应用根组件，包含路由逻辑与全局模态框
  i18n.ts            # 国际化配置文件
  main.tsx           # 应用入口文件
  types.ts           # 全局 TypeScript 类型定义
  index.css          # 全局样式文件
```

## 3. 核心文件说明

- **`App.tsx`**: 应用的核心枢纽。它管理着应用的主要视图状态 (`currentView`)、用户登录状态 (`user`) 以及各种全局弹窗（登录、找回密码、支付等）。
- **`Workspace.tsx`**: 用户的主要操作界面，包含数据导入、配置生成和任务管理。
- **`AccountCenter.tsx`**: 提供用户个人信息展示、资产查看及账号绑定功能。
- **`i18n.ts`**: 集中管理应用中所有的中英文文案，支持动态切换。
- **`types.ts`**: 定义了应用中使用的关键数据结构，如 `UserProfile`、`PromotionStatus` 等。

## 4. 业务流程

### 4.1 登录与身份验证流程
1. 用户访问应用。
2. 触发需要登录的操作（如开始生成、提交申请）。
3. 弹出登录模态框 (`LoginContent`)。
4. 用户选择验证码或密码登录。
5. 登录成功后，更新全局 `user` 状态，并持久化用户信息。

### 4.2 推广权限申请流程
1. 用户进入“推广中心”。
2. 若未获得权限，显示申请入口 (`PromotionApply`)。
3. 点击申请，进入表单填写页 (`PromotionForm`)。
4. 填写基础信息、渠道信息及资源说明。
5. 提交申请后，进入“审核中”状态 (`PromotionPending`)。
6. 管理员在后台（模拟逻辑）进行审核。
7. 审核通过后，用户可进入正式的推广中心仪表盘。

### 4.3 佣金结算与提现流程
1. 用户通过推广获得收益。
2. 在“个人中心”查看资产。
3. 绑定支付宝信息 (`AlipayInfo`)。
4. 提交提现申请。
5. 管理员在“佣金审核”页面 (`CommissionAudit`) 查看并处理申请。
6. 审核通过后，佣金发放至用户账户。

## 5. 开发规范

- **注释**: 所有核心方法和组件必须包含中文 JSDoc 注释。
- **样式**: 优先使用 Tailwind CSS 类名，避免内联样式。
- **类型**: 严格使用 TypeScript 进行类型定义，避免使用 `any`。
- **国际化**: 所有用户可见的文案必须通过 `i18n.ts` 管理。
