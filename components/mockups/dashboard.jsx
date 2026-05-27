'use client';

import React, { useState } from 'react';
import {
  AlertTriangle, Flag, Lock, ChevronDown, ChevronRight,
  Sparkles, Send, Users, Map, GitBranch, Bug, Rocket, Wrench,
  Shield, CheckCircle2, Activity, Maximize2, X, Clock,
  Network, Layers, Search, Filter, Eye, ArrowUpRight,
  Hash, ExternalLink, FileText, Zap
} from 'lucide-react';

export default function ARTEEPDashboard() {
  const [expandedCards, setExpandedCards] = useState({ 'bug-404': true });
  const [activeTab, setActiveTab] = useState('tech-debt');
  const [copilotInput, setCopilotInput] = useState('');
  const [contextChip, setContextChip] = useState('BUG-404');
  const [hoveredNode, setHoveredNode] = useState(null);

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
    <div className="h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col overflow-hidden" style={{ fontFamily: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace' }}>
      {/* ============ TOP STRIP ============ */}
      <header className="border-b border-zinc-800 px-4 py-2 flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
              <div className="absolute inset-0 w-1.5 h-1.5 bg-amber-400 rounded-full animate-ping opacity-60" />
            </div>
            <span className="text-zinc-200 font-semibold tracking-[0.2em]">ART-EEP</span>
          </div>
          <span className="text-zinc-700">/</span>
          <span className="text-zinc-500">Onboarding</span>
          <span className="text-zinc-700">/</span>
          <span className="text-zinc-500">Playbook</span>
          <span className="text-zinc-700">/</span>
          <span className="text-zinc-200">SR-BE-ENG-2026-04</span>
        </div>
        <div className="flex items-center gap-4 text-zinc-500">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
            <span>Agent Online</span>
          </span>
          <span className="text-zinc-700">|</span>
          <span>v3.1.0</span>
          <span className="text-zinc-700">|</span>
          <span className="px-2 py-0.5 rounded-sm border border-zinc-800 text-zinc-400" style={{ fontFamily: 'ui-sans-serif, system-ui' }}>Trần Hữu Nam</span>
        </div>
      </header>

      {/* ============ MAIN SPLIT ============ */}
      <div className="flex-1 flex overflow-hidden">

        {/* ============ LEFT: PLAYBOOK 45% ============ */}
        <div style={{ width: '45%' }} className="border-r border-zinc-800 flex flex-col overflow-hidden">

          {/* Playbook header */}
          <div className="px-5 py-4 border-b border-zinc-800 shrink-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500" style={{ fontFamily: 'ui-sans-serif, system-ui' }}>Cẩm nang Hội nhập</span>
              <span className="text-[10px] px-1.5 py-0.5 border border-zinc-800 rounded-sm text-zinc-500">v.1.2</span>
              <span className="text-[10px] px-1.5 py-0.5 border border-emerald-500/30 bg-emerald-500/5 rounded-sm text-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5" />
                Verified
              </span>
            </div>
            <h1 className="text-xl font-semibold text-zinc-100 mb-3 tracking-tight" style={{ fontFamily: 'ui-sans-serif, system-ui' }}>
              Senior Backend Engineer
            </h1>
            <div className="flex items-center gap-3 text-xs text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3 h-3" />
                <span><span className="text-zinc-100 font-semibold">6</span> Phân hệ</span>
              </span>
              <span className="text-zinc-700">·</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                <span><span className="text-zinc-100 font-semibold">3</span> Nghiêm trọng</span>
              </span>
              <span className="text-zinc-700">·</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                <span><span className="text-zinc-100 font-semibold">7</span> Cao</span>
              </span>
              <span className="text-zinc-700">·</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-zinc-600 rounded-full" />
                <span><span className="text-zinc-100 font-semibold">12</span> TB</span>
              </span>
            </div>
          </div>

          {/* Dynamic Tabs */}
          <div className="px-3 py-2 border-b border-zinc-800 shrink-0">
            <div className="flex gap-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={isActive ? { boxShadow: '0 0 0 1px rgba(245, 158, 11, 0.4), 0 0 12px rgba(245, 158, 11, 0.15)' } : {}}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs whitespace-nowrap transition-all border shrink-0 ${
                      isActive
                        ? 'border-amber-500/50 bg-amber-500/5 text-amber-200'
                        : 'border-zinc-800/0 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 hover:border-zinc-800'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span style={{ fontFamily: 'ui-sans-serif, system-ui' }}>{tab.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-sm ${isActive ? 'bg-amber-500/15 text-amber-300' : 'bg-zinc-900 text-zinc-500'}`}>
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
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3" style={{ scrollbarWidth: 'thin', scrollbarColor: '#27272a transparent' }}>

            {/* Provenance row */}
            <div className="flex items-center gap-2 flex-wrap text-[10px] mb-1">
              <span className="px-2 py-1 rounded-sm bg-zinc-900/60 text-zinc-400 uppercase tracking-wider flex items-center gap-1.5" style={{ borderLeft: '2px solid rgba(245, 158, 11, 0.6)', borderTop: '1px solid #27272a', borderRight: '1px solid #27272a', borderBottom: '1px solid #27272a' }}>
                <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                <span className="text-zinc-500">Từ Preset:</span>
                <span className="text-amber-300">Tech Debt Inventory</span>
              </span>
              <span className="px-2 py-1 rounded-sm border border-zinc-800 bg-zinc-900/40 text-zinc-500 flex items-center gap-1.5">
                <Clock className="w-2.5 h-2.5" />
                last sync 2h ago
              </span>
              <span className="px-2 py-1 rounded-sm border border-zinc-800 bg-zinc-900/40 text-zinc-500">
                3 items · 1 critical
              </span>
            </div>

            {/* ============ CARD 1: CRITICAL BUG-404 (auto-expanded) ============ */}
            <article
              className="rounded-md border border-zinc-800 bg-zinc-900/40 overflow-hidden transition-all"
              style={{ borderLeft: '2px solid rgba(244, 63, 94, 0.5)' }}
            >
              <button
                onClick={() => toggleCard('bug-404')}
                className="w-full px-4 py-3 flex items-start justify-between gap-3 hover:bg-zinc-900/60 transition-colors text-left"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-rose-500/10 border border-rose-500/30 text-rose-300 uppercase tracking-wider font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-2.5 h-2.5" />
                      Critical
                    </span>
                    <span className="text-[10px] text-zinc-500">BUG-404</span>
                    <span className="text-zinc-700">·</span>
                    <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      reported 14 days ago
                    </span>
                  </div>
                  <h3 className="text-sm text-zinc-100 font-medium" style={{ fontFamily: 'ui-sans-serif, system-ui' }}>
                    Lỗi thanh toán Gateway
                  </h3>
                </div>
                <ChevronDown className={`w-4 h-4 text-zinc-600 shrink-0 mt-1 transition-transform ${expandedCards['bug-404'] ? 'rotate-180' : ''}`} />
              </button>

              {expandedCards['bug-404'] && (
                <div className="px-4 pb-4 pt-1 border-t border-zinc-800/60 space-y-3">
                  <p className="text-sm text-zinc-300 leading-relaxed" style={{ fontFamily: 'ui-sans-serif, system-ui' }}>
                    Khách hàng không thể thanh toán qua thẻ VISA từ <span className="text-zinc-100 font-medium">2h-4h sáng</span>. Vấn đề tái diễn vào 3 đêm liên tiếp; nghi do connection pool của Payment Gateway timeout khi reset hàng đêm.
                  </p>

                  {/* Meta grid */}
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="px-2.5 py-2 rounded-sm border border-zinc-800 bg-zinc-950/60">
                      <div className="text-zinc-500 uppercase tracking-wider text-[9px] mb-1">Owner</div>
                      <div className="text-zinc-200">@nam.tran</div>
                    </div>
                    <div className="px-2.5 py-2 rounded-sm border border-zinc-800 bg-zinc-950/60">
                      <div className="text-zinc-500 uppercase tracking-wider text-[9px] mb-1">Affected</div>
                      <div className="text-zinc-200">Payment Gateway · Visa API</div>
                    </div>
                    <div className="px-2.5 py-2 rounded-sm border border-zinc-800 bg-zinc-950/60">
                      <div className="text-zinc-500 uppercase tracking-wider text-[9px] mb-1">SLA Window</div>
                      <div className="text-rose-300">7 days remaining</div>
                    </div>
                    <div className="px-2.5 py-2 rounded-sm border border-zinc-800 bg-zinc-950/60">
                      <div className="text-zinc-500 uppercase tracking-wider text-[9px] mb-1">Confidence</div>
                      <div className="text-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        Verified · handover session 2024-Q4
                      </div>
                    </div>
                  </div>

                  {/* Action bar */}
                  <div className="flex items-center gap-2 pt-1">
                    <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-[11px] text-zinc-300 transition-colors">
                      <Network className="w-3 h-3" />
                      <span style={{ fontFamily: 'ui-sans-serif, system-ui' }}>View in Graph</span>
                    </button>
                    <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-[11px] text-zinc-300 transition-colors">
                      <FileText className="w-3 h-3" />
                      <span style={{ fontFamily: 'ui-sans-serif, system-ui' }}>Open Ticket</span>
                    </button>
                    <div className="flex-1" />
                    <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm border border-zinc-800 bg-zinc-900 hover:bg-amber-500/10 hover:border-amber-500/30 hover:text-amber-200 text-[11px] text-zinc-400 transition-colors">
                      <Flag className="w-3 h-3" />
                      <span style={{ fontFamily: 'ui-sans-serif, system-ui' }}>Flag as inaccurate</span>
                    </button>
                  </div>
                </div>
              )}
            </article>

            {/* ============ CARD 2: HIGH - Microservice User ============ */}
            <article
              className="rounded-md border border-zinc-800 bg-zinc-900/40 overflow-hidden transition-all"
              style={{ borderLeft: '2px solid rgba(245, 158, 11, 0.45)' }}
            >
              <button
                onClick={() => toggleCard('arch-debt')}
                className="w-full px-4 py-3 flex items-start justify-between gap-3 hover:bg-zinc-900/60 transition-colors text-left"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-amber-500/10 border border-amber-500/30 text-amber-300 uppercase tracking-wider font-semibold">
                      High
                    </span>
                    <span className="text-[10px] text-zinc-500">ARCH-DEBT-12</span>
                    <span className="text-zinc-700">·</span>
                    <span className="text-[10px] text-zinc-500">est. 3 sprints to resolve</span>
                  </div>
                  <h3 className="text-sm text-zinc-100 font-medium" style={{ fontFamily: 'ui-sans-serif, system-ui' }}>
                    Nợ kiến trúc: Microservice User
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1" style={{ fontFamily: 'ui-sans-serif, system-ui' }}>
                    Coupling cao với Order service · chia tách trong roadmap Q2.
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-600 shrink-0 mt-1" />
              </button>
            </article>

            {/* ============ CARD 3: RESTRICTED ============ */}
            <article
              className="rounded-md border border-zinc-800 bg-zinc-900/20 overflow-hidden"
              style={{ borderLeft: '2px solid rgba(82, 82, 91, 0.6)' }}
            >
              <div className="w-full px-4 py-3 flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-zinc-800 border border-zinc-700 text-zinc-400 uppercase tracking-wider font-semibold flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" />
                      Restricted
                    </span>
                    <span className="text-[10px] text-zinc-600">RBAC · level 4 required</span>
                  </div>
                  <h3 className="text-sm text-zinc-400 font-medium" style={{ fontFamily: 'ui-sans-serif, system-ui' }}>
                    Dữ liệu nhạy cảm DB
                  </h3>
                  <p className="text-xs text-zinc-600 mt-1" style={{ fontFamily: 'ui-sans-serif, system-ui' }}>
                    Nội dung bị che do vượt phạm vi quyền truy cập của bạn.
                  </p>
                </div>
                <button className="text-[11px] px-2.5 py-1 rounded-sm border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 flex items-center gap-1.5 transition-colors shrink-0" style={{ fontFamily: 'ui-sans-serif, system-ui' }}>
                  Request access
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </article>

            {/* Empty space hint */}
            <div className="pt-3 pb-1 text-center">
              <span className="text-[10px] text-zinc-700 uppercase tracking-widest">— end of section —</span>
            </div>
          </div>
        </div>

        {/* ============ RIGHT: GRAPH 55% ============ */}
        <div style={{ width: '55%' }} className="relative flex flex-col overflow-hidden bg-zinc-950">

          {/* Graph toolbar */}
          <div className="px-4 py-2 border-b border-zinc-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3 text-xs">
              <Network className="w-3.5 h-3.5 text-zinc-500" />
              <span className="text-zinc-300" style={{ fontFamily: 'ui-sans-serif, system-ui' }}>Knowledge Graph</span>
              <span className="text-zinc-700">/</span>
              <span className="text-amber-300/80 flex items-center gap-1">
                <Zap className="w-3 h-3" />
                BUG-404
              </span>
              <span className="text-zinc-700">·</span>
              <span className="text-zinc-500">ego(2) · 7 nodes · 9 edges</span>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-1.5 rounded-md hover:bg-zinc-900 text-zinc-500 hover:text-zinc-200 transition-colors">
                <Search className="w-3.5 h-3.5" />
              </button>
              <button className="p-1.5 rounded-md hover:bg-zinc-900 text-zinc-500 hover:text-zinc-200 transition-colors">
                <Filter className="w-3.5 h-3.5" />
              </button>
              <button className="p-1.5 rounded-md hover:bg-zinc-900 text-zinc-500 hover:text-zinc-200 transition-colors">
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Graph canvas with dot-matrix bg */}
          <div
            className="flex-1 relative overflow-hidden"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(63, 63, 70, 0.5) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
              backgroundPosition: '0 0',
            }}
          >
            {/* SVG GRAPH */}
            <svg viewBox="0 0 800 600" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
              <defs>
                {/* Amber glow filter */}
                <filter id="amberGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feFlood floodColor="#f59e0b" floodOpacity="0.6" />
                  <feComposite in2="blur" operator="in" />
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Edge gradient (dim) */}
                <linearGradient id="edgeDim" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3f3f46" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#3f3f46" stopOpacity="0.15" />
                </linearGradient>

                {/* Edge gradient (active spotlight) */}
                <linearGradient id="edgeActive" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.3" />
                </linearGradient>

                {/* Subtle radial backdrop behind central node */}
                <radialGradient id="centerHalo" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.18" />
                  <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.04" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Central halo */}
              <circle cx="400" cy="300" r="160" fill="url(#centerHalo)" />

              {/* === EDGES (drawn first so nodes overlay) === */}
              {/* From BUG-404 to its direct neighbors - SPOTLIGHT (active amber) */}
              <line x1="400" y1="300" x2="200" y2="180" stroke="url(#edgeActive)" strokeWidth="1.2" />
              <line x1="400" y1="300" x2="200" y2="420" stroke="url(#edgeActive)" strokeWidth="1.2" />
              <line x1="400" y1="300" x2="610" y2="180" stroke="url(#edgeActive)" strokeWidth="1.2" />
              <line x1="400" y1="300" x2="640" y2="380" stroke="url(#edgeActive)" strokeWidth="1.2" />
              <line x1="400" y1="300" x2="400" y2="500" stroke="url(#edgeActive)" strokeWidth="1.2" />
              <line x1="400" y1="300" x2="330" y2="110" stroke="url(#edgeActive)" strokeWidth="1.2" />

              {/* Secondary edges (dimmed) */}
              <line x1="200" y1="180" x2="200" y2="420" stroke="url(#edgeDim)" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="610" y1="180" x2="640" y2="380" stroke="url(#edgeDim)" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="400" y1="500" x2="610" y2="180" stroke="url(#edgeDim)" strokeWidth="1" strokeDasharray="3 3" />

              {/* === NODES === */}

              {/* Project node - Sprint 24 */}
              <g transform="translate(330, 110)" style={{ cursor: 'pointer' }} onMouseEnter={() => setHoveredNode('sprint-24')} onMouseLeave={() => setHoveredNode(null)}>
                <polygon points="0,-16 14,-8 14,8 0,16 -14,8 -14,-8" fill="#18181b" stroke="#52525b" strokeWidth="1" />
                <text x="0" y="32" textAnchor="middle" fill="#a1a1aa" fontSize="10" fontFamily="ui-sans-serif">Sprint 24</text>
                <text x="0" y="44" textAnchor="middle" fill="#52525b" fontSize="8">project</text>
              </g>

              {/* Tool node - Payment Gateway */}
              <g transform="translate(200, 180)" style={{ cursor: 'pointer' }} onMouseEnter={() => setHoveredNode('pay-gw')} onMouseLeave={() => setHoveredNode(null)}>
                <rect x="-32" y="-12" width="64" height="24" rx="3" fill="#18181b" stroke="#71717a" strokeWidth="1" />
                <text x="0" y="3" textAnchor="middle" fill="#d4d4d8" fontSize="10" fontFamily="ui-sans-serif">Payment GW</text>
                <text x="0" y="28" textAnchor="middle" fill="#52525b" fontSize="8">tool · external</text>
              </g>

              {/* Tool node - Visa API */}
              <g transform="translate(200, 420)" style={{ cursor: 'pointer' }} onMouseEnter={() => setHoveredNode('visa')} onMouseLeave={() => setHoveredNode(null)}>
                <rect x="-26" y="-12" width="52" height="24" rx="3" fill="#18181b" stroke="#71717a" strokeWidth="1" />
                <text x="0" y="3" textAnchor="middle" fill="#d4d4d8" fontSize="10" fontFamily="ui-sans-serif">Visa API</text>
                <text x="0" y="28" textAnchor="middle" fill="#52525b" fontSize="8">tool · external</text>
              </g>

              {/* Service node - Order Service (cut-corner square) */}
              <g transform="translate(610, 180)" style={{ cursor: 'pointer' }} onMouseEnter={() => setHoveredNode('order-svc')} onMouseLeave={() => setHoveredNode(null)}>
                <path d="M -26 -14 L 22 -14 L 30 -6 L 30 14 L -18 14 L -26 6 Z" fill="#18181b" stroke="#71717a" strokeWidth="1" />
                <text x="2" y="3" textAnchor="middle" fill="#d4d4d8" fontSize="10" fontFamily="ui-sans-serif">Order Svc</text>
                <text x="2" y="30" textAnchor="middle" fill="#52525b" fontSize="8">service</text>
              </g>

              {/* Data node - DB:payments (cylinder shape approximation) */}
              <g transform="translate(640, 380)" style={{ cursor: 'pointer' }} onMouseEnter={() => setHoveredNode('db-pay')} onMouseLeave={() => setHoveredNode(null)}>
                <ellipse cx="0" cy="-10" rx="28" ry="5" fill="#18181b" stroke="#71717a" strokeWidth="1" />
                <rect x="-28" y="-10" width="56" height="20" fill="#18181b" stroke="#71717a" strokeWidth="1" />
                <ellipse cx="0" cy="10" rx="28" ry="5" fill="#18181b" stroke="#71717a" strokeWidth="1" />
                <text x="0" y="3" textAnchor="middle" fill="#d4d4d8" fontSize="10" fontFamily="ui-sans-serif">db:payments</text>
                <text x="0" y="30" textAnchor="middle" fill="#52525b" fontSize="8">data</text>
              </g>

              {/* Person node */}
              <g transform="translate(400, 500)" style={{ cursor: 'pointer' }} onMouseEnter={() => setHoveredNode('nam')} onMouseLeave={() => setHoveredNode(null)}>
                <circle cx="0" cy="0" r="14" fill="#18181b" stroke="#71717a" strokeWidth="1" />
                <circle cx="0" cy="-3" r="3.5" fill="#71717a" />
                <path d="M -7 6 Q 0 0 7 6 Z" fill="#71717a" />
                <text x="0" y="32" textAnchor="middle" fill="#d4d4d8" fontSize="10" fontFamily="ui-sans-serif">@nam.tran</text>
                <text x="0" y="44" textAnchor="middle" fill="#52525b" fontSize="8">person · owner</text>
              </g>

              {/* === CENTRAL NODE - BUG-404 (highlighted, glowing) === */}
              <g transform="translate(400, 300)" filter="url(#amberGlow)">
                <circle cx="0" cy="0" r="26" fill="#1c1917" stroke="#f59e0b" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="20" fill="none" stroke="#f59e0b" strokeWidth="0.5" strokeOpacity="0.4" />
              </g>
              <g transform="translate(400, 300)">
                <text x="0" y="-2" textAnchor="middle" fill="#fbbf24" fontSize="11" fontWeight="600" fontFamily="ui-sans-serif">BUG-404</text>
                <text x="0" y="10" textAnchor="middle" fill="#f59e0b" fontSize="8" letterSpacing="1">CRITICAL</text>
              </g>
              <g transform="translate(400, 300)">
                <text x="0" y="48" textAnchor="middle" fill="#a1a1aa" fontSize="10" fontFamily="ui-sans-serif">Lỗi thanh toán Gateway</text>
              </g>
            </svg>

            {/* Legend - top right overlay */}
            <div className="absolute top-3 right-3 px-3 py-2.5 rounded-md border border-zinc-800 bg-zinc-900/85 backdrop-blur-sm text-[10px] space-y-1.5" style={{ fontFamily: 'ui-sans-serif, system-ui' }}>
              <div className="text-zinc-500 uppercase tracking-widest text-[9px] mb-2">Legend</div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#1c1917', border: '1px solid #f59e0b', boxShadow: '0 0 6px rgba(245, 158, 11, 0.6)' }} />
                <span className="text-zinc-300">Focus · spotlight</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#18181b', border: '1px solid #71717a' }} />
                <span className="text-zinc-400">Tool / Service</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5" style={{ backgroundColor: '#18181b', border: '1px solid #52525b', transform: 'rotate(45deg)' }} />
                <span className="text-zinc-400">Project</span>
              </div>
              <div className="flex items-center gap-2 pt-1.5 border-t border-zinc-800">
                <div className="w-4 h-px bg-amber-500/70" />
                <span className="text-zinc-400">Direct edge</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-px bg-zinc-600" style={{ borderTop: '1px dashed #52525b', backgroundColor: 'transparent' }} />
                <span className="text-zinc-500">Inferred</span>
              </div>
            </div>

            {/* Canvas label - bottom right */}
            <div className="absolute bottom-3 right-3 px-2 py-1 rounded-sm border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm text-[10px] text-zinc-500 flex items-center gap-1.5">
              <span className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse" />
              [Interactive Knowledge Graph Canvas]
            </div>

            {/* Spotlight status - bottom left */}
            <div className="absolute bottom-3 left-3 px-2.5 py-1.5 rounded-md border border-amber-500/30 bg-amber-500/5 backdrop-blur-sm text-[10px] flex items-center gap-2" style={{ fontFamily: 'ui-sans-serif, system-ui' }}>
              <Eye className="w-3 h-3 text-amber-400" />
              <span className="text-amber-200/90">Spotlight active</span>
              <span className="text-zinc-600">·</span>
              <span className="text-zinc-400">6 of 17 nodes highlighted</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============ COPILOT BAR ============ */}
      <div className="border-t border-zinc-800 bg-zinc-950 px-4 py-3 shrink-0">
        <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-zinc-800 bg-zinc-900/40 transition-colors focus-within:border-amber-500/40" style={{ boxShadow: '0 0 0 0 transparent' }}>
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />

          {/* Context chip */}
          {contextChip && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-amber-500/10 border border-amber-500/30 text-[11px] whitespace-nowrap" style={{ fontFamily: 'ui-sans-serif, system-ui' }}>
              <span className="text-amber-400/70 uppercase tracking-wider text-[9px]">Ngữ cảnh:</span>
              <span className="text-amber-200">{contextChip}</span>
              <button onClick={() => setContextChip(null)} className="ml-0.5 text-amber-400/60 hover:text-amber-200 transition-colors">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          <input
            value={copilotInput}
            onChange={e => setCopilotInput(e.target.value)}
            placeholder="Hỏi AI bất cứ điều gì về Cẩm nang này..."
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-zinc-600 text-zinc-100"
            style={{ fontFamily: 'ui-sans-serif, system-ui' }}
          />

          <div className="flex items-center gap-2 text-[10px] text-zinc-600 pr-1" style={{ fontFamily: 'ui-sans-serif, system-ui' }}>
            <kbd className="px-1.5 py-0.5 rounded-sm border border-zinc-800 bg-zinc-900 text-zinc-500">⌘</kbd>
            <kbd className="px-1.5 py-0.5 rounded-sm border border-zinc-800 bg-zinc-900 text-zinc-500">K</kbd>
          </div>

          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs hover:bg-amber-500/20 transition-colors"
            style={{ fontFamily: 'ui-sans-serif, system-ui' }}
          >
            <span>Hỏi</span>
            <Send className="w-3 h-3" />
          </button>
        </div>

        {/* Bottom thin status row */}
        <div className="flex items-center justify-between mt-2 px-1 text-[10px] text-zinc-600">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-1 h-1 bg-emerald-500 rounded-full" />
              <span>RBAC enforced · Senior Backend Engineer scope</span>
            </span>
            <span>·</span>
            <span>3 queries this session</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Token routing: dynamic</span>
            <span>·</span>
            <span>Cache: warm</span>
          </div>
        </div>
      </div>
    </div>
  );
}
