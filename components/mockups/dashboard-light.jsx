'use client';

import React, { useState } from 'react';
import {
  AlertTriangle, Flag, Lock, ChevronDown, ChevronRight,
  Sparkles, Send, Users, Map, GitBranch, Bug, Rocket, Wrench,
  CheckCircle2, Clock, Network, Layers, X, ArrowUpRight
} from 'lucide-react';

export default function ARTEEPLightDashboard() {
  const [expandedCards, setExpandedCards] = useState({ 'bug-404': true });
  const [activeTab, setActiveTab] = useState('tech-debt');
  const [copilotInput, setCopilotInput] = useState('');
  const [contextChip, setContextChip] = useState('Lỗi thanh toán Gateway');

  const tabs = [
    { id: 'people',    label: 'Mạng lưới nhân sự',   icon: Users,     count: 14 },
    { id: 'projects',  label: 'Bản đồ dự án',         icon: Map,       count: 8 },
    { id: 'repos',     label: 'Kho Code & Repos',     icon: GitBranch, count: 23 },
    { id: 'tech-debt', label: 'Nợ kỹ thuật & Bugs',   icon: Bug,       count: 17, critical: 3 },
    { id: 'deploy',    label: 'Quy trình Deploy',     icon: Rocket,    count: 6 },
    { id: 'tools',     label: 'Thư mục Công cụ',      icon: Wrench,    count: 11 },
  ];

  const toggleCard = (id) => {
    setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="h-screen w-full bg-gray-50 text-gray-900 flex flex-col overflow-hidden" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif' }}>

      {/* ============ TOP STRIP ============ */}
      <header className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
            <span className="text-gray-900 font-semibold tracking-[0.18em]" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>ART-EEP</span>
          </div>
          <span className="text-gray-300">/</span>
          <span className="text-gray-500">Hội nhập</span>
          <span className="text-gray-300">/</span>
          <span className="text-gray-500">Cẩm nang</span>
          <span className="text-gray-300">/</span>
          <span className="text-gray-700" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>SR-BE-ENG-2026-04</span>
        </div>
        <div className="flex items-center gap-3 text-gray-500">
          <span className="px-2 py-0.5 rounded-md border border-gray-200 bg-gray-50 text-gray-700">Trần Hữu Nam</span>
        </div>
      </header>

      {/* ============ MAIN SPLIT ============ */}
      <div className="flex-1 flex overflow-hidden">

        {/* ============ LEFT: PLAYBOOK 45% ============ */}
        <div style={{ width: '45%' }} className="border-r border-gray-200 bg-white flex flex-col overflow-hidden">

          {/* Playbook header */}
          <div className="px-5 py-4 border-b border-gray-200 shrink-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium">Cẩm nang Hội nhập</span>
              <span className="text-[10px] px-1.5 py-0.5 border border-gray-200 rounded text-gray-500 bg-gray-50">v.1.2</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-3 tracking-tight">
              Senior Backend Engineer
            </h1>
            <div className="flex items-center gap-3 text-xs text-gray-600">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3 h-3 text-gray-400" />
                <span><span className="text-gray-900 font-semibold">6</span> Phân hệ</span>
              </span>
              <span className="text-gray-300">·</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                <span><span className="text-gray-900 font-semibold">3</span> Nghiêm trọng</span>
              </span>
              <span className="text-gray-300">·</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                <span><span className="text-gray-900 font-semibold">7</span> Cao</span>
              </span>
              <span className="text-gray-300">·</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                <span><span className="text-gray-900 font-semibold">12</span> Trung bình</span>
              </span>
            </div>
          </div>

          {/* Dynamic Tabs (N sections, generated per Manager's Builder configuration) */}
          <div className="px-3 py-2 border-b border-gray-200 shrink-0 bg-gray-50/60">
            <div className="flex gap-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs whitespace-nowrap transition-all border shrink-0 ${
                      isActive
                        ? 'border-amber-300 bg-amber-50 text-amber-800'
                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-white hover:border-gray-200'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{tab.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${isActive ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-500'}`}>
                      {tab.count}
                    </span>
                    {tab.critical && (
                      <span className="w-1 h-1 bg-rose-500 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">

            {/* Provenance chip — CUSTOM PROMPT source (UC-ON-01 AC.3) */}
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span
                className="px-2.5 py-1 rounded text-[11px] flex items-center gap-1.5 bg-amber-50/60"
                style={{
                  borderLeft: '2px solid rgb(245, 158, 11)',
                  borderTop: '1px solid rgb(229, 231, 235)',
                  borderRight: '1px solid rgb(229, 231, 235)',
                  borderBottom: '1px solid rgb(229, 231, 235)'
                }}
              >
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span className="text-gray-500">Từ yêu cầu tùy chỉnh của bạn</span>
              </span>
              <span className="px-2.5 py-1 rounded text-[11px] border border-gray-200 bg-gray-50 text-gray-500 flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                Cập nhật 2 giờ trước
              </span>
            </div>

            {/* ============ CARD 1: CRITICAL (auto-expanded per BR-05) ============ */}
            <article
              className="rounded-lg border border-gray-200 bg-white overflow-hidden"
              style={{ borderLeft: '2px solid rgb(244, 63, 94)' }}
            >
              <button
                onClick={() => toggleCard('bug-404')}
                className="w-full px-4 py-3 flex items-start justify-between gap-3 hover:bg-gray-50/50 transition-colors text-left"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-50 border border-rose-200 text-rose-700 uppercase tracking-wider font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-2.5 h-2.5" />
                      Nghiêm trọng
                    </span>
                    <span className="text-[10px] text-gray-500" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>BUG-404</span>
                    <span className="text-gray-300">·</span>
                    <span className="text-[10px] text-gray-500 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      Báo cáo 14 ngày trước
                    </span>
                  </div>
                  <h3 className="text-sm text-gray-900 font-semibold">
                    Lỗi thanh toán Gateway
                  </h3>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 mt-1 transition-transform ${expandedCards['bug-404'] ? 'rotate-180' : ''}`} />
              </button>

              {expandedCards['bug-404'] && (
                <div className="px-4 pb-4 pt-1 border-t border-gray-100 space-y-3">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Khách hàng không thể thanh toán qua thẻ VISA từ <span className="text-gray-900 font-semibold">2h-4h sáng</span>. Vấn đề tái diễn 3 đêm liên tiếp; nghi do connection pool của Payment Gateway timeout khi reset hàng đêm.
                  </p>

                  {/* Meta grid */}
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="px-2.5 py-2 rounded-md border border-gray-200 bg-gray-50/60">
                      <div className="text-gray-500 uppercase tracking-wider text-[9px] mb-1">Phụ trách</div>
                      <div className="text-gray-900">@nam.tran</div>
                    </div>
                    <div className="px-2.5 py-2 rounded-md border border-gray-200 bg-gray-50/60">
                      <div className="text-gray-500 uppercase tracking-wider text-[9px] mb-1">Ảnh hưởng</div>
                      <div className="text-gray-900">Payment Gateway · Visa API</div>
                    </div>
                    <div className="px-2.5 py-2 rounded-md border border-gray-200 bg-gray-50/60">
                      <div className="text-gray-500 uppercase tracking-wider text-[9px] mb-1">Thời hạn SLA</div>
                      <div className="text-rose-700 font-medium">Còn 7 ngày</div>
                    </div>
                    <div className="px-2.5 py-2 rounded-md border border-emerald-200 bg-emerald-50/40">
                      <div className="text-emerald-700/80 uppercase tracking-wider text-[9px] mb-1">Độ tin cậy</div>
                      <div className="text-emerald-700 flex items-center gap-1 font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        Đã xác thực
                      </div>
                    </div>
                  </div>

                  {/* Action bar */}
                  <div className="flex items-center gap-2 pt-1">
                    <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-gray-200 bg-white hover:bg-gray-50 text-[11px] text-gray-700 transition-colors">
                      <Network className="w-3 h-3" />
                      <span>Xem trong Sơ đồ</span>
                    </button>
                    <div className="flex-1" />
                    <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-gray-200 bg-white hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700 text-[11px] text-gray-600 transition-colors">
                      <Flag className="w-3 h-3" />
                      <span>Báo nội dung sai</span>
                    </button>
                  </div>
                </div>
              )}
            </article>

            {/* ============ CARD 2: HIGH (collapsed) ============ */}
            <article
              className="rounded-lg border border-gray-200 bg-white overflow-hidden"
              style={{ borderLeft: '2px solid rgb(245, 158, 11)' }}
            >
              <button
                onClick={() => toggleCard('arch-debt')}
                className="w-full px-4 py-3 flex items-start justify-between gap-3 hover:bg-gray-50/50 transition-colors text-left"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-700 uppercase tracking-wider font-semibold">
                      Cao
                    </span>
                    <span className="text-[10px] text-gray-500" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>ARCH-DEBT-12</span>
                    <span className="text-gray-300">·</span>
                    <span className="text-[10px] text-gray-500">ước tính 3 sprint</span>
                  </div>
                  <h3 className="text-sm text-gray-900 font-semibold">
                    Nợ kiến trúc: Microservice User
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Coupling cao với Order service · kế hoạch tách trong roadmap Q2.
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 shrink-0 mt-1" />
              </button>
            </article>

            {/* ============ CARD 3: MEDIUM (collapsed) ============ */}
            <article
              className="rounded-lg border border-gray-200 bg-white overflow-hidden"
              style={{ borderLeft: '2px solid rgb(156, 163, 175)' }}
            >
              <button
                onClick={() => toggleCard('test-coverage')}
                className="w-full px-4 py-3 flex items-start justify-between gap-3 hover:bg-gray-50/50 transition-colors text-left"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 border border-gray-200 text-gray-600 uppercase tracking-wider font-semibold">
                      Trung bình
                    </span>
                    <span className="text-[10px] text-gray-500" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>TEST-COV-08</span>
                  </div>
                  <h3 className="text-sm text-gray-900 font-semibold">
                    Độ phủ test thấp ở module Notification
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Coverage hiện tại 42% · mục tiêu nội bộ 70%.
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 shrink-0 mt-1" />
              </button>
            </article>

            {/* ============ CARD 4: RESTRICTED (RBAC masked per UC-ON-02 EX.4) ============ */}
            <article
              className="rounded-lg border border-gray-200 bg-gray-50/60 overflow-hidden"
            >
              <div className="w-full px-4 py-3 flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-200 border border-gray-300 text-gray-600 uppercase tracking-wider font-semibold flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" />
                      Hạn chế
                    </span>
                    <span className="text-[10px] text-gray-500">RBAC · cần cấp độ 4</span>
                  </div>
                  <h3 className="text-sm text-gray-600 font-medium">
                    [Dữ liệu giới hạn — Yêu cầu quyền truy cập]
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Nội dung này nằm ngoài phạm vi quyền hiện tại của bạn.
                  </p>
                </div>
                <button className="text-[11px] px-2.5 py-1 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 flex items-center gap-1.5 transition-colors shrink-0">
                  Yêu cầu quyền
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </article>

            <div className="pt-2 pb-1 text-center">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest">— hết phân hệ —</span>
            </div>
          </div>
        </div>

        {/* ============ RIGHT: GRAPH 55% ============ */}
        <div style={{ width: '55%' }} className="relative flex flex-col overflow-hidden bg-white">

          {/* Graph toolbar */}
          <div className="px-4 py-2.5 border-b border-gray-200 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 text-xs">
              <Network className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-gray-700 font-medium">Sơ đồ tri thức</span>
              <span className="text-gray-300">/</span>
              <span className="text-amber-700 font-medium" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>BUG-404</span>
              <span className="text-gray-300">·</span>
              <span className="text-gray-500">vùng lân cận cấp 1</span>
            </div>
          </div>

          {/* Graph canvas with subtle dot-matrix bg */}
          <div
            className="flex-1 relative overflow-hidden"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(0, 0, 0, 0.08) 1px, transparent 1px)',
              backgroundSize: '22px 22px',
            }}
          >
            {/* SVG GRAPH — minimal placeholder per BA scope */}
            <svg viewBox="0 0 800 580" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
              <defs>
                {/* Soft amber glow for the spotlighted node */}
                <filter id="softAmberGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feFlood floodColor="#f59e0b" floodOpacity="0.35" />
                  <feComposite in2="blur" operator="in" />
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Halo behind center */}
                <radialGradient id="amberHalo" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.12" />
                  <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.03" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Halo */}
              <circle cx="400" cy="290" r="170" fill="url(#amberHalo)" />

              {/* Edges — direct neighbors in amber (spotlight) */}
              <line x1="400" y1="290" x2="220" y2="180" stroke="#f59e0b" strokeWidth="1.2" strokeOpacity="0.7" />
              <line x1="400" y1="290" x2="220" y2="400" stroke="#f59e0b" strokeWidth="1.2" strokeOpacity="0.7" />
              <line x1="400" y1="290" x2="600" y2="180" stroke="#f59e0b" strokeWidth="1.2" strokeOpacity="0.7" />
              <line x1="400" y1="290" x2="600" y2="400" stroke="#f59e0b" strokeWidth="1.2" strokeOpacity="0.7" />
              <line x1="400" y1="290" x2="400" y2="490" stroke="#f59e0b" strokeWidth="1.2" strokeOpacity="0.7" />

              {/* Satellite nodes - neutral (dimmed) */}
              <g transform="translate(220, 180)">
                <rect x="-36" y="-13" width="72" height="26" rx="4" fill="#ffffff" stroke="#d4d4d8" strokeWidth="1" />
                <text x="0" y="3" textAnchor="middle" fill="#3f3f46" fontSize="11">Payment GW</text>
                <text x="0" y="32" textAnchor="middle" fill="#a1a1aa" fontSize="9">công cụ</text>
              </g>

              <g transform="translate(220, 400)">
                <rect x="-30" y="-13" width="60" height="26" rx="4" fill="#ffffff" stroke="#d4d4d8" strokeWidth="1" />
                <text x="0" y="3" textAnchor="middle" fill="#3f3f46" fontSize="11">Visa API</text>
                <text x="0" y="32" textAnchor="middle" fill="#a1a1aa" fontSize="9">công cụ</text>
              </g>

              <g transform="translate(600, 180)">
                <rect x="-32" y="-13" width="64" height="26" rx="4" fill="#ffffff" stroke="#d4d4d8" strokeWidth="1" />
                <text x="0" y="3" textAnchor="middle" fill="#3f3f46" fontSize="11">Order Svc</text>
                <text x="0" y="32" textAnchor="middle" fill="#a1a1aa" fontSize="9">dịch vụ</text>
              </g>

              <g transform="translate(600, 400)">
                <ellipse cx="0" cy="-9" rx="30" ry="5" fill="#ffffff" stroke="#d4d4d8" strokeWidth="1" />
                <rect x="-30" y="-9" width="60" height="18" fill="#ffffff" stroke="#d4d4d8" strokeWidth="1" />
                <ellipse cx="0" cy="9" rx="30" ry="5" fill="#ffffff" stroke="#d4d4d8" strokeWidth="1" />
                <text x="0" y="4" textAnchor="middle" fill="#3f3f46" fontSize="11">db:payments</text>
                <text x="0" y="32" textAnchor="middle" fill="#a1a1aa" fontSize="9">dữ liệu</text>
              </g>

              <g transform="translate(400, 490)">
                <circle cx="0" cy="0" r="15" fill="#ffffff" stroke="#d4d4d8" strokeWidth="1" />
                <circle cx="0" cy="-3" r="4" fill="#a1a1aa" />
                <path d="M -7 6 Q 0 0 7 6 Z" fill="#a1a1aa" />
                <text x="0" y="35" textAnchor="middle" fill="#3f3f46" fontSize="11">@nam.tran</text>
                <text x="0" y="48" textAnchor="middle" fill="#a1a1aa" fontSize="9">phụ trách</text>
              </g>

              {/* CENTRAL SPOTLIGHTED NODE — BUG-404 */}
              <g transform="translate(400, 290)" filter="url(#softAmberGlow)">
                <circle cx="0" cy="0" r="30" fill="#fffbeb" stroke="#f59e0b" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="23" fill="none" stroke="#f59e0b" strokeOpacity="0.35" strokeWidth="0.7" />
              </g>
              <g transform="translate(400, 290)">
                <text x="0" y="-1" textAnchor="middle" fill="#92400e" fontSize="12" fontWeight="700">BUG-404</text>
                <text x="0" y="12" textAnchor="middle" fill="#b45309" fontSize="8" letterSpacing="1.2">NGHIÊM TRỌNG</text>
                <text x="0" y="54" textAnchor="middle" fill="#52525b" fontSize="11">Lỗi thanh toán Gateway</text>
              </g>
            </svg>

            {/* Canvas label */}
            <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded border border-gray-200 bg-white/90 backdrop-blur-sm text-[10px] text-gray-500">
              [Sơ đồ tri thức tương tác]
            </div>
          </div>
        </div>
      </div>

      {/* ============ PERSISTENT COPILOT BAR ============ */}
      <div className="border-t border-gray-200 bg-white px-4 py-3 shrink-0">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white transition-colors focus-within:border-amber-300">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />

          {/* Context chip */}
          {contextChip && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-50 border border-amber-200 text-[11px] whitespace-nowrap">
              <span className="text-amber-700/70 uppercase tracking-wider text-[9px] font-medium">Ngữ cảnh:</span>
              <span className="text-amber-800 font-medium">{contextChip}</span>
              <button onClick={() => setContextChip(null)} className="ml-0.5 text-amber-600/70 hover:text-amber-900 transition-colors">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          <input
            value={copilotInput}
            onChange={e => setCopilotInput(e.target.value)}
            placeholder="Hỏi AI bất cứ điều gì về Cẩm nang này..."
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-gray-400 text-gray-900"
          />

          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-900 hover:bg-gray-800 text-white text-xs transition-colors"
          >
            <span>Hỏi</span>
            <Send className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
