'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles, ArrowRight, Lock, AlertTriangle, CheckCircle2,
  Clock, Users, Map, GitBranch, Bug, Rocket, Wrench,
  Network, Mic, Pause, Square, Award, TrendingUp, Check, X,
  MessageCircle, ChevronDown, Send, Flag, ArrowUpRight, Layers,
  GraduationCap, ShieldAlert, HelpCircle
} from 'lucide-react';

const STATES = [
  { id: 1, num: '01', name: 'Khởi tạo Cẩm nang',     uc: 'UC-ON-01.AC.1',
    scenario: 'Hà Vy (Quản lý) khởi tạo Cẩm nang cho một vai trò mới · Data Engineer Lead — chưa có dữ liệu bàn giao trong hệ thống.' },
  { id: 2, num: '02', name: 'Đọc Cẩm nang',          uc: 'UC-ON-02',
    scenario: 'Trần Hữu Nam · Ngày 3 hội nhập · đang đọc phân hệ "Nợ kỹ thuật & Bugs" trong Cẩm nang Senior Backend Engineer.' },
  { id: 3, num: '03', name: 'Dữ liệu hạn chế',       uc: 'UC-ON-02.EX.4',
    scenario: 'Trần Hữu Nam vừa nhấp vào phân hệ chứa dữ liệu cần quyền cao hơn — hệ thống thực thi RBAC ở tầng truy xuất.' },
  { id: 4, num: '04', name: 'Phỏng vấn AI',          uc: 'UC-HO-02',
    scenario: 'Minh Lê (người tiền nhiệm, sắp rời vị trí) đang trong phiên phỏng vấn bàn giao với AI · câu hỏi 7 trên 15.' },
  { id: 5, num: '05', name: 'Khoảng cách kỹ năng',   uc: 'UC-ON-03',
    scenario: 'Trần Hữu Nam vừa nhận báo cáo phân tích kỹ năng — so sánh với hồ sơ verified của @minh.le.' },
  { id: 6, num: '06', name: 'Duyệt sửa lỗi',         uc: 'UC-HO-06/07',
    scenario: 'Hà Vy (Quản lý) xem xét đề xuất sửa nội dung AI do Trần Hữu Nam gắn cờ · vòng học chủ động.' },
];

export default function ARTEEPPrototype() {
  const [currentState, setCurrentState] = useState(1);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') setCurrentState(s => Math.min(6, s + 1));
      if (e.key === 'ArrowLeft')  setCurrentState(s => Math.max(1, s - 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const active = STATES.find(s => s.id === currentState);

  return (
    <div className="h-screen w-full bg-gray-50 text-gray-900 flex flex-col overflow-hidden relative" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif' }}>

      {/* ============ TOP: STATE SWITCHER ============ */}
      <header className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center justify-between shrink-0 gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
          <span className="text-gray-900 font-semibold tracking-[0.18em] text-xs" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>ART-EEP</span>
          <span className="text-gray-300 text-xs">·</span>
          <span className="text-gray-500 text-xs">Demo Flow</span>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {STATES.map(s => {
            const isActive = s.id === currentState;
            return (
              <button
                key={s.id}
                onClick={() => setCurrentState(s.id)}
                className={`flex items-center gap-2 px-2.5 py-1 rounded-md text-[11px] border transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-200 bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="text-gray-400 font-medium" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{s.num}</span>
                <span>{s.name}</span>
              </button>
            );
          })}
        </div>

        <div className="text-[11px] text-gray-500 shrink-0" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>
          {active.uc}
        </div>
      </header>

      {/* ============ SCENARIO STRIP ============ */}
      <div className="bg-white border-b border-gray-200 px-5 py-2 flex items-center gap-2 shrink-0">
        <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-medium shrink-0">Kịch bản</span>
        <span className="w-px h-3 bg-gray-200" />
        <p className="text-xs text-gray-700 leading-snug">{active.scenario}</p>
      </div>

      {/* ============ ACTIVE STATE ============ */}
      <main className="flex-1 overflow-hidden">
        {currentState === 1 && <ColdStartState />}
        {currentState === 2 && <HappyPathState />}
        {currentState === 3 && <RBACState />}
        {currentState === 4 && <VoiceInterviewState />}
        {currentState === 5 && <SkillGapState />}
        {currentState === 6 && <DiffReviewState />}
      </main>

      {/* ============ KEYBOARD HINT ============ */}
      <div className="absolute bottom-3 right-4 flex items-center gap-1.5 text-[10px] text-gray-400 pointer-events-none">
        <kbd className="px-1.5 py-0.5 rounded border border-gray-200 bg-white text-gray-500" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>←</kbd>
        <kbd className="px-1.5 py-0.5 rounded border border-gray-200 bg-white text-gray-500" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>→</kbd>
        <span className="ml-1">điều hướng</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   STATE 1 — COLD START   (UC-ON-01.AC.1)
   ═══════════════════════════════════════════════════ */
function ColdStartState() {
  return (
    <div className="h-full flex overflow-hidden">
      <div style={{ width: '45%' }} className="bg-white border-r border-gray-200 flex flex-col">
        <div className="px-5 py-4 border-b border-gray-200 shrink-0">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium">Cẩm nang Hội nhập</span>
          <h1 className="text-xl font-semibold text-gray-900 mt-1.5 tracking-tight">Data Engineer Lead</h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] px-1.5 py-0.5 border border-amber-200 rounded text-amber-700 bg-amber-50">Chưa có bản ghi bàn giao</span>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-sm">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl border border-gray-200 bg-amber-50/60 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-amber-500" />
            </div>

            <h2 className="text-lg font-semibold text-gray-900 mb-2">Đây là vị trí mới</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-1">
              Hãy cùng AI xây dựng Cẩm nang đầu tiên!
            </p>
            <p className="text-xs text-gray-500 mb-6">
              Chưa có bản ghi bàn giao nào được đánh chỉ mục cho vai trò này.
            </p>

            <button className="px-4 py-2 rounded-md bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium inline-flex items-center gap-2 transition-colors">
              Bắt đầu thiết lập
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <p className="text-[11px] text-gray-400 mt-5">
              AI sẽ hỏi 3 câu để khởi tạo bộ Cẩm nang ban đầu.
            </p>
          </div>
        </div>
      </div>

      {/* Right: ghost graph */}
      <div
        style={{ width: '55%', backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px)', backgroundSize: '22px 22px' }}
        className="bg-white relative"
      >
        <div className="px-4 py-2.5 border-b border-gray-200 flex items-center gap-2 text-xs">
          <Network className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-gray-500">Sơ đồ tri thức · chờ thiết lập</span>
        </div>

        <svg viewBox="0 0 800 560" className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="xMidYMid meet" style={{ top: 41 }}>
          {/* Ghost edges */}
          {[
            [400, 280, 240, 180], [400, 280, 240, 390],
            [400, 280, 580, 180], [400, 280, 580, 390],
            [400, 280, 400, 470]
          ].map((c, i) => (
            <line key={i} x1={c[0]} y1={c[1]} x2={c[2]} y2={c[3]} stroke="#e4e4e7" strokeWidth="1" strokeDasharray="3 4" />
          ))}

          {/* Ghost satellite nodes */}
          {[
            [240, 180], [240, 390], [580, 180], [580, 390], [400, 470]
          ].map((p, i) => (
            <g key={i} transform={`translate(${p[0]}, ${p[1]})`}>
              <circle cx="0" cy="0" r="18" fill="#ffffff" stroke="#e4e4e7" strokeWidth="1" strokeDasharray="3 3" />
              <text x="0" y="4" textAnchor="middle" fill="#d4d4d8" fontSize="14">?</text>
            </g>
          ))}

          {/* Ghost central node */}
          <g transform="translate(400, 280)">
            <circle cx="0" cy="0" r="28" fill="#ffffff" stroke="#d4d4d8" strokeWidth="1" strokeDasharray="3 3" />
            <text x="0" y="5" textAnchor="middle" fill="#a1a1aa" fontSize="18">?</text>
          </g>
        </svg>

        <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded border border-gray-200 bg-white/90 text-[10px] text-gray-400">
          các node sẽ xuất hiện sau thiết lập
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   STATE 2 — HAPPY PATH   (UC-ON-02)
   ═══════════════════════════════════════════════════ */
function HappyPathState() {
  const [activeTab, setActiveTab] = useState('tech-debt');
  const tabs = [
    { id: 'people',    label: 'Mạng lưới nhân sự',   icon: Users },
    { id: 'projects',  label: 'Bản đồ dự án',         icon: Map },
    { id: 'repos',     label: 'Kho Code & Repos',     icon: GitBranch },
    { id: 'tech-debt', label: 'Nợ kỹ thuật & Bugs',   icon: Bug },
    { id: 'deploy',    label: 'Quy trình Deploy',     icon: Rocket },
    { id: 'tools',     label: 'Thư mục Công cụ',      icon: Wrench },
  ];

  return (
    <div className="h-full flex overflow-hidden">
      <div style={{ width: '45%' }} className="bg-white border-r border-gray-200 flex flex-col overflow-hidden">

        <div className="px-5 py-3 border-b border-gray-200 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium">Cẩm nang Hội nhập</span>
              <h1 className="text-lg font-semibold text-gray-900 mt-0.5 tracking-tight">Senior Backend Engineer</h1>
            </div>
            <span className="text-[11px] text-gray-500">Trần Hữu Nam</span>
          </div>
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
            <span className="flex items-center gap-1.5"><Layers className="w-3 h-3 text-gray-400" /><span><span className="text-gray-900 font-semibold">6</span> Phân hệ</span></span>
            <span className="text-gray-300">·</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-rose-500 rounded-full" /><span><span className="text-gray-900 font-semibold">3</span> Nghiêm trọng</span></span>
            <span className="text-gray-300">·</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-amber-500 rounded-full" /><span><span className="text-gray-900 font-semibold">7</span> Cao</span></span>
          </div>
        </div>

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
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span
              className="px-2.5 py-1 rounded text-[11px] flex items-center gap-1.5 bg-amber-50/60"
              style={{ borderLeft: '2px solid rgb(245, 158, 11)', borderTop: '1px solid rgb(229, 231, 235)', borderRight: '1px solid rgb(229, 231, 235)', borderBottom: '1px solid rgb(229, 231, 235)' }}
            >
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span className="text-gray-600">Tạo bởi AI · Từ phỏng vấn bàn giao của @minh.le</span>
            </span>
          </div>

          {/* Critical - auto-expanded */}
          <article className="rounded-lg border border-gray-200 bg-white overflow-hidden" style={{ borderLeft: '2px solid rgb(244, 63, 94)' }}>
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-50 border border-rose-200 text-rose-700 uppercase tracking-wider font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-2.5 h-2.5" />Nghiêm trọng
                </span>
                <span className="text-[10px] text-gray-500" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>BUG-404</span>
              </div>
              <h3 className="text-sm text-gray-900 font-semibold">Lỗi thanh toán Gateway</h3>
            </div>
            <div className="px-4 py-3 space-y-3">
              <p className="text-sm text-gray-700 leading-relaxed">
                Khách hàng không thể thanh toán qua thẻ VISA từ <span className="text-gray-900 font-semibold">2h-4h sáng</span>. Vấn đề tái diễn 3 đêm liên tiếp; nghi do connection pool timeout.
              </p>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <MetaCell label="Phụ trách" value="@nam.tran" />
                <MetaCell label="Ảnh hưởng" value="Payment GW · Visa API" />
                <MetaCell label="SLA" value={<span className="text-rose-700 font-medium">Còn 7 ngày</span>} />
                <MetaCell label="Độ tin cậy" value={<span className="text-emerald-700 flex items-center gap-1 font-medium"><CheckCircle2 className="w-3 h-3" />Đã xác thực</span>} accent="emerald" />
              </div>
              <div className="flex items-center justify-end gap-2">
                <button className="flex items-center gap-1 px-2 py-0.5 rounded border border-gray-200 bg-white hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700 text-[11px] text-gray-500 transition-colors">
                  <Flag className="w-3 h-3" />Báo sai
                </button>
              </div>
            </div>
          </article>

          {/* High - collapsed */}
          <article className="rounded-lg border border-gray-200 bg-white overflow-hidden" style={{ borderLeft: '2px solid rgb(245, 158, 11)' }}>
            <div className="w-full px-4 py-3 flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-700 uppercase tracking-wider font-semibold">Cao</span>
                  <span className="text-[10px] text-gray-500" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>ARCH-DEBT-12</span>
                </div>
                <h3 className="text-sm text-gray-900 font-semibold">Nợ kiến trúc: Microservice User</h3>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 shrink-0 mt-1 -rotate-90" />
            </div>
          </article>
        </div>

        {/* Persistent Copilot Bar */}
        <div className="border-t border-gray-200 bg-white px-4 py-3 shrink-0">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-amber-50 border border-amber-200 text-[11px] whitespace-nowrap">
              <span className="text-amber-700/70 uppercase tracking-wider text-[9px] font-medium">Ngữ cảnh:</span>
              <span className="text-amber-800">BUG-404</span>
            </div>
            <input placeholder="Hỏi AI bất cứ điều gì..." className="flex-1 bg-transparent outline-none text-sm placeholder:text-gray-400 text-gray-900" />
            <button className="px-2.5 py-1 rounded-md bg-gray-900 hover:bg-gray-800 text-white text-xs"><Send className="w-3 h-3" /></button>
          </div>
        </div>
      </div>

      <GraphPanel highlighted="BUG-404" />
    </div>
  );
}

function MetaCell({ label, value, accent }) {
  const borderCls = accent === 'emerald' ? 'border-emerald-200 bg-emerald-50/40' : 'border-gray-200 bg-gray-50/60';
  return (
    <div className={`px-2.5 py-2 rounded-md border ${borderCls}`}>
      <div className="text-gray-500 uppercase tracking-wider text-[9px] mb-1">{label}</div>
      <div className="text-gray-900 text-[11px]">{value}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   STATE 3 — RBAC MASKING   (UC-ON-02.EX.4)
   ═══════════════════════════════════════════════════ */
function RBACState() {
  return (
    <div className="h-full flex overflow-hidden">
      <div style={{ width: '45%' }} className="bg-white border-r border-gray-200 flex flex-col overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-200 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium">Cẩm nang Hội nhập</span>
              <h1 className="text-lg font-semibold text-gray-900 mt-0.5 tracking-tight">Senior Backend Engineer</h1>
            </div>
            <span className="text-[11px] text-gray-500">Trần Hữu Nam</span>
          </div>
        </div>

        <div className="px-3 py-2 border-b border-gray-200 shrink-0 bg-gray-50/60">
          <div className="flex gap-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs border border-gray-300 bg-white text-gray-700 shrink-0">
              <ShieldAlert className="w-3 h-3" />
              <span>Dữ liệu nhạy cảm DB</span>
            </button>
            <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs border border-transparent text-gray-500 shrink-0">
              <Bug className="w-3 h-3" /><span>Nợ kỹ thuật</span>
            </button>
            <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs border border-transparent text-gray-500 shrink-0">
              <Users className="w-3 h-3" /><span>Mạng lưới nhân sự</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="rounded-lg border border-gray-200 bg-gray-50/60 p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-white border border-gray-200 flex items-center justify-center">
              <Lock className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Dữ liệu giới hạn — Yêu cầu quyền truy cập</h3>
            <p className="text-xs text-gray-500 mb-1">Nội dung này yêu cầu cấp độ phân quyền cao hơn.</p>
            <p className="text-[11px] text-gray-400 mb-5" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>
              RBAC · cần cấp độ 4 · vai trò hiện tại: cấp độ 2
            </p>
            <button className="px-3 py-1.5 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 text-xs font-medium inline-flex items-center gap-1.5 transition-colors">
              Yêu cầu quyền truy cập
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="mt-4 space-y-2">
            <div className="h-3 rounded bg-gray-200/70" style={{ filter: 'blur(2px)' }} />
            <div className="h-3 rounded bg-gray-200/70 w-4/5" style={{ filter: 'blur(2px)' }} />
            <div className="h-3 rounded bg-gray-200/70 w-2/3" style={{ filter: 'blur(2px)' }} />
            <div className="h-20 rounded bg-gray-200/70 mt-3" style={{ filter: 'blur(3px)' }} />
            <div className="h-3 rounded bg-gray-200/70 w-3/4 mt-3" style={{ filter: 'blur(2px)' }} />
            <div className="h-3 rounded bg-gray-200/70 w-1/2" style={{ filter: 'blur(2px)' }} />
          </div>
        </div>
      </div>

      {/* Right: graph with locked node, NO amber glow (neutral denial state) */}
      <div
        style={{ width: '55%', backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px)', backgroundSize: '22px 22px' }}
        className="bg-white relative"
      >
        <div className="px-4 py-2.5 border-b border-gray-200 flex items-center gap-2 text-xs">
          <Network className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-gray-700 font-medium">Sơ đồ tri thức</span>
          <span className="text-gray-300">/</span>
          <span className="text-gray-500">vùng có dữ liệu hạn chế</span>
        </div>

        <svg viewBox="0 0 800 560" className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="xMidYMid meet" style={{ top: 41 }}>
          {[
            [400, 280, 240, 180], [400, 280, 240, 390],
            [400, 280, 580, 180], [400, 280, 580, 390]
          ].map((c, i) => (
            <line key={i} x1={c[0]} y1={c[1]} x2={c[2]} y2={c[3]} stroke="#d4d4d8" strokeWidth="1" strokeDasharray="3 3" />
          ))}

          {[
            { x: 240, y: 180, label: 'config-svc',  kind: 'dịch vụ' },
            { x: 240, y: 390, label: 'audit-log',   kind: 'dịch vụ' },
            { x: 580, y: 180, label: 'admin-panel', kind: 'công cụ' },
            { x: 580, y: 390, label: 'secrets-mgr', kind: 'công cụ' }
          ].map((n, i) => (
            <g key={i} transform={`translate(${n.x}, ${n.y})`}>
              <rect x="-36" y="-13" width="72" height="26" rx="4" fill="#ffffff" stroke="#d4d4d8" strokeWidth="1" />
              <text x="0" y="3" textAnchor="middle" fill="#71717a" fontSize="11">{n.label}</text>
              <text x="0" y="30" textAnchor="middle" fill="#a1a1aa" fontSize="9">{n.kind}</text>
            </g>
          ))}

          {/* Central locked node */}
          <g transform="translate(400, 280)">
            <circle cx="0" cy="0" r="34" fill="#f4f4f5" stroke="#a1a1aa" strokeWidth="1.5" strokeDasharray="4 3" />
            <g transform="translate(0, -3)">
              <rect x="-9" y="-1" width="18" height="13" rx="2" fill="#71717a" />
              <path d="M -6 -1 L -6 -6 Q -6 -11 0 -11 Q 6 -11 6 -6 L 6 -1" fill="none" stroke="#71717a" strokeWidth="2.5" strokeLinecap="round" />
            </g>
            <text x="0" y="52" textAnchor="middle" fill="#71717a" fontSize="11" fontWeight="600">Bị giới hạn</text>
            <text x="0" y="65" textAnchor="middle" fill="#a1a1aa" fontSize="9">RBAC · cấp độ 4</text>
          </g>
        </svg>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   STATE 4 — VOICE INTERVIEW   (UC-HO-02)
   ═══════════════════════════════════════════════════ */
function VoiceInterviewState() {
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
        <div className="text-xs flex items-center gap-2">
          <span className="text-gray-500">Bàn giao</span>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-medium">Phỏng vấn AI</span>
          <span className="text-gray-300">·</span>
          <span className="text-gray-700">@minh.le</span>
          <span className="text-gray-300">·</span>
          <span className="text-gray-500" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>HO-2026-04-22</span>
        </div>
        <div className="text-xs flex items-center gap-2 text-gray-500">
          <span>Câu hỏi <span className="text-gray-900 font-semibold">7</span> / 15</span>
          <div className="w-20 h-1 rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full bg-gray-900" style={{ width: '46%' }} />
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-6 overflow-y-auto">
        <div className="w-full max-w-2xl">

          {/* Concentric pulsing rings */}
          <div className="flex justify-center mb-6">
            <div className="relative flex items-center justify-center" style={{ width: 112, height: 112 }}>
              {/* Outer animated ring */}
              <span className="absolute inline-flex rounded-full bg-rose-400 opacity-20 animate-ping" style={{ width: 112, height: 112 }} />
              {/* Static mid ring */}
              <span className="absolute rounded-full bg-rose-100" style={{ width: 88, height: 88 }} />
              {/* Inner solid */}
              <span className="relative inline-flex items-center justify-center rounded-full bg-rose-500 shadow-sm" style={{ width: 64, height: 64 }}>
                <Mic className="w-7 h-7 text-white" strokeWidth={2} />
              </span>
            </div>
          </div>

          <div className="text-center mb-7">
            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
              <span className="text-rose-700 font-medium">Đang ghi âm</span>
              <span className="text-gray-300">·</span>
              <span className="text-gray-700" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>12:34</span>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50/60 p-5 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-medium">AI hỏi</span>
            </div>
            <p className="text-base text-gray-900 leading-relaxed">
              Bạn có thể chia sẻ thêm về những khó khăn khi làm việc với đối tác XYZ không?
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5 mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-medium">Phiên dịch trực tiếp</span>
              </div>
              <span className="text-[10px] text-gray-400">tự động đồng bộ</span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              Vâng, đối tác XYZ thường gặp khó khăn về việc tích hợp API. Họ yêu cầu nhiều
              tùy chỉnh ngoài chuẩn REST của chúng ta, đặc biệt là phần xử lý callback
              cho thanh toán. Tôi đã làm việc trực tiếp với team kỹ thuật của họ trong
              hai sprint vừa rồi và<span className="inline-block w-0.5 h-3.5 bg-gray-900 ml-0.5 align-middle animate-pulse" />
            </p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors">
              <Pause className="w-3.5 h-3.5" />Tạm dừng
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-900 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium transition-colors">
              <Square className="w-3.5 h-3.5" fill="currentColor" />Kết thúc phỏng vấn
            </button>
          </div>

          <p className="text-center text-[11px] text-gray-400 mt-5">
            AI sẽ chuyển sang câu hỏi tiếp theo sau 3 giây im lặng, hoặc khi bạn nhấn ↵
          </p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   STATE 5 — SKILL GAP   (UC-ON-03) — OVERLAY BARS
   ═══════════════════════════════════════════════════ */
function SkillGapState() {
  const skills = [
    { name: 'Go programming',           required: 4, current: 2, level: 'gap' },
    { name: 'Distributed Systems',      required: 4, current: 4, level: 'match' },
    { name: 'PostgreSQL · Performance', required: 3, current: 2, level: 'gap' },
    { name: 'Docker & Kubernetes',      required: 3, current: 3, level: 'match' },
    { name: 'Payment Gateway domain',   required: 3, current: 1, level: 'gap' },
    { name: 'React · TypeScript',       required: 1, current: 4, level: 'over' },
  ];

  const courses = [
    { title: 'Advanced Go for Backend Engineers', dur: '4 tuần', addr: 'Go programming',           src: 'Internal Academy' },
    { title: 'Payment Systems Architecture',       dur: '6 tuần', addr: 'Payment Gateway domain',  src: 'O\'Reilly Learning' },
    { title: 'PostgreSQL Query Optimization',      dur: '2 tuần', addr: 'PostgreSQL · Performance',src: 'Pluralsight' },
  ];

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-5">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium">Hội nhập · Trần Hữu Nam</span>
          <h1 className="text-2xl font-semibold text-gray-900 mt-1 tracking-tight">Phân tích khoảng cách kỹ năng</h1>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span
              className="px-2.5 py-1 rounded text-[11px] flex items-center gap-1.5 bg-amber-50/60"
              style={{ borderLeft: '2px solid rgb(245, 158, 11)', borderTop: '1px solid rgb(229, 231, 235)', borderRight: '1px solid rgb(229, 231, 235)', borderBottom: '1px solid rgb(229, 231, 235)' }}
            >
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span className="text-gray-600">So sánh với hồ sơ verified của @minh.le</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <SummaryCard icon={Check}        iconCls="text-emerald-700" labelCls="text-emerald-700" label="Khớp"        value="2" caption="kỹ năng đạt yêu cầu" />
          <SummaryCard icon={TrendingUp}   iconCls="text-amber-700"   labelCls="text-amber-700"   label="Khoảng cách" value="3" caption="cần được nâng cao" />
          <SummaryCard icon={Award}        iconCls="text-gray-700"    labelCls="text-gray-700"    label="Vượt trội"   value="1" caption="điểm mạnh bổ sung" />
        </div>

        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden mb-6">
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">So sánh kỹ năng</h2>
            <div className="flex items-center gap-3 text-[10px] text-gray-500">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-gray-300" />Yêu cầu</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-gray-900" />Hiện tại</span>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {skills.map((s, i) => <SkillRow key={i} {...s} />)}
          </div>
        </div>

        <div className="mb-2">
          <h2 className="text-sm font-semibold text-gray-900 mb-1">Lộ trình đề xuất</h2>
          <p className="text-xs text-gray-500 mb-3">Để thu hẹp 3 khoảng cách kỹ năng đã xác định.</p>
        </div>
        <div className="space-y-2 mb-8">
          {courses.map((c, i) => (
            <article key={i} className="rounded-lg border border-gray-200 bg-white p-4 flex items-start gap-3">
              <div className="w-9 h-9 rounded-md border border-gray-200 bg-gray-50 flex items-center justify-center shrink-0">
                <GraduationCap className="w-4 h-4 text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900">{c.title}</h3>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500 flex-wrap">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{c.dur}</span>
                  <span className="text-gray-300">·</span>
                  <span>Bù: <span className="text-gray-700">{c.addr}</span></span>
                  <span className="text-gray-300">·</span>
                  <span>{c.src}</span>
                </div>
              </div>
              <button className="text-[11px] px-2.5 py-1 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 inline-flex items-center gap-1 transition-colors shrink-0">
                Đăng ký <ArrowUpRight className="w-3 h-3" />
              </button>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ icon: Icon, iconCls, labelCls, label, value, caption }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-4 py-3">
      <div className={`flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] font-medium ${labelCls}`}>
        <Icon className="w-3 h-3" />{label}
      </div>
      <div className="text-2xl font-semibold text-gray-900 mt-1">{value}</div>
      <div className="text-[11px] text-gray-500">{caption}</div>
    </div>
  );
}

function SkillRow({ name, required, current, level }) {
  const reqPct = (required / 5) * 100;
  const curPct = (current / 5) * 100;
  const tag = level === 'gap'
    ? { text: `Khoảng cách: ${required - current} cấp độ`, cls: 'bg-amber-50 text-amber-700 border-amber-200' }
    : level === 'match'
      ? { text: 'Đạt yêu cầu', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
      : { text: `Vượt trội: +${current - required}`, cls: 'bg-gray-100 text-gray-700 border-gray-200' };

  return (
    <div className="px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-900 font-medium">{name}</span>
        <span className={`text-[10px] px-1.5 py-0.5 rounded border uppercase tracking-wider font-semibold ${tag.cls}`}>{tag.text}</span>
      </div>
      {/* Overlay track */}
      <div className="relative h-2 rounded-full bg-gray-100 overflow-hidden">
        <div className="absolute left-0 top-0 h-full bg-gray-300 rounded-full" style={{ width: `${reqPct}%` }} />
        <div className="absolute left-0 top-0 h-full bg-gray-900 rounded-full" style={{ width: `${curPct}%` }} />
      </div>
      <div className="flex items-center justify-between mt-1.5 text-[10px] text-gray-500">
        <span>Hiện tại <span className="text-gray-900 font-medium" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{current}/5</span></span>
        <span>Yêu cầu <span className="text-gray-700 font-medium" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{required}/5</span></span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   STATE 6 — DIFF REVIEW   (UC-HO-06 / UC-HO-07)
   ═══════════════════════════════════════════════════ */
function DiffReviewState() {
  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="max-w-5xl mx-auto p-6">
        <div className="mb-5">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium">Báo cáo nội dung sai · Hà Vy</span>
          <h1 className="text-2xl font-semibold text-gray-900 mt-1 tracking-tight">Xem xét đề xuất sửa</h1>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 mb-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 text-xs text-gray-600 flex-wrap">
            <span className="flex items-center gap-1.5"><Flag className="w-3 h-3 text-amber-500" /><span className="text-gray-500">Báo cáo bởi:</span><span className="text-gray-900 font-medium">@nam.tran</span></span>
            <span className="text-gray-300">·</span><span>2 giờ trước</span>
            <span className="text-gray-300">·</span><span>Phân hệ: <span className="text-gray-700">Nợ kỹ thuật & Bugs</span></span>
            <span className="text-gray-300">·</span><span style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>BUG-404</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-700 uppercase tracking-wider font-semibold flex items-center gap-1">
            <AlertTriangle className="w-2.5 h-2.5" />Đang chờ duyệt
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
            <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50/60 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-medium">AI đã tạo</span>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                Khách hàng không thể thanh toán qua thẻ VISA từ <span className="bg-rose-100 text-rose-800 px-1 rounded line-through decoration-rose-400">3h-5h sáng</span>. Vấn đề tái diễn <span className="bg-rose-100 text-rose-800 px-1 rounded line-through decoration-rose-400">2 đêm liên tiếp</span>; nghi do connection pool của Payment Gateway timeout khi reset hàng đêm.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-emerald-200 bg-white overflow-hidden" style={{ borderLeft: '2px solid rgb(16, 185, 129)' }}>
            <div className="px-4 py-2.5 border-b border-emerald-200/70 bg-emerald-50/40 flex items-center gap-2">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[10px] uppercase tracking-[0.18em] text-emerald-700 font-medium">Người dùng đề xuất</span>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                Khách hàng không thể thanh toán qua thẻ VISA từ <span className="bg-emerald-100 text-emerald-800 px-1 rounded">2h-4h sáng</span>. Vấn đề tái diễn <span className="bg-emerald-100 text-emerald-800 px-1 rounded">3 đêm liên tiếp</span>; nghi do connection pool của Payment Gateway timeout khi reset hàng đêm.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 mb-4">
          <div className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-medium mb-2">Lý do (từ @nam.tran)</div>
          <p className="text-sm text-gray-700 leading-relaxed">
            Tôi đã trực tiếp xử lý lỗi này trong sprint trước. Thời điểm chính xác là 2h-4h sáng, không phải 3h-5h. Đã xảy ra 3 đêm liên tiếp (không phải 2). Có log trong Datadog để chứng minh.
          </p>
          <div className="mt-2">
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-50 border border-gray-200 text-gray-500" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>
              Bằng chứng đính kèm: 2 file
            </span>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-gray-50/60 p-4 mb-5">
          <div className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-medium mb-2 flex items-center gap-1.5">
            <Network className="w-3 h-3" />Ảnh hưởng nếu chấp nhận
          </div>
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div><div className="text-gray-500 text-[11px]">Node Knowledge Graph</div><div className="text-gray-900 font-medium mt-0.5">1 node cập nhật</div></div>
            <div><div className="text-gray-500 text-[11px]">Phụ thuộc</div><div className="text-gray-900 font-medium mt-0.5">2 cẩm nang liên quan</div></div>
            <div><div className="text-gray-500 text-[11px]">Vòng học chủ động</div><div className="text-gray-900 font-medium mt-0.5">Có · sẽ tinh chỉnh</div></div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 flex-wrap pb-6">
          <button className="px-3 py-2 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium inline-flex items-center gap-1.5 transition-colors">
            <HelpCircle className="w-3.5 h-3.5" />Yêu cầu làm rõ
          </button>
          <button className="px-3 py-2 rounded-md border border-gray-300 bg-white hover:bg-rose-50 hover:border-rose-300 hover:text-rose-700 text-gray-700 text-sm font-medium inline-flex items-center gap-1.5 transition-colors">
            <X className="w-3.5 h-3.5" />Từ chối
          </button>
          <button className="px-4 py-2 rounded-md bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium inline-flex items-center gap-1.5 transition-colors">
            <Check className="w-3.5 h-3.5" />Chấp nhận thay đổi
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SHARED: GRAPH PANEL (State 2)
   ═══════════════════════════════════════════════════ */
function GraphPanel({ highlighted }) {
  return (
    <div
      style={{ width: '55%', backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px)', backgroundSize: '22px 22px' }}
      className="bg-white relative"
    >
      <div className="px-4 py-2.5 border-b border-gray-200 flex items-center gap-2 text-xs">
        <Network className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-700 font-medium">Sơ đồ tri thức</span>
        <span className="text-gray-300">/</span>
        <span className="text-amber-700 font-medium" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{highlighted}</span>
        <span className="text-gray-300">·</span>
        <span className="text-gray-500">vùng lân cận cấp 1</span>
      </div>

      <svg viewBox="0 0 800 560" className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="xMidYMid meet" style={{ top: 41 }}>
        <defs>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feFlood floodColor="#f59e0b" floodOpacity="0.35" />
            <feComposite in2="blur" operator="in" />
            <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <radialGradient id="halo2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="400" cy="280" r="160" fill="url(#halo2)" />

        {[
          [400, 280, 240, 180], [400, 280, 240, 390],
          [400, 280, 580, 180], [400, 280, 580, 390],
          [400, 280, 400, 470]
        ].map((c, i) => (
          <line key={i} x1={c[0]} y1={c[1]} x2={c[2]} y2={c[3]} stroke="#f59e0b" strokeWidth="1.2" strokeOpacity="0.7" />
        ))}

        {[
          { x: 240, y: 180, label: 'Payment GW',  kind: 'công cụ' },
          { x: 240, y: 390, label: 'Visa API',    kind: 'công cụ' },
          { x: 580, y: 180, label: 'Order Svc',   kind: 'dịch vụ' },
          { x: 580, y: 390, label: 'db:payments', kind: 'dữ liệu' }
        ].map((n, i) => (
          <g key={i} transform={`translate(${n.x}, ${n.y})`}>
            <rect x="-36" y="-13" width="72" height="26" rx="4" fill="#ffffff" stroke="#d4d4d8" strokeWidth="1" />
            <text x="0" y="3" textAnchor="middle" fill="#3f3f46" fontSize="11">{n.label}</text>
            <text x="0" y="30" textAnchor="middle" fill="#a1a1aa" fontSize="9">{n.kind}</text>
          </g>
        ))}

        <g transform="translate(400, 470)">
          <circle cx="0" cy="0" r="15" fill="#ffffff" stroke="#d4d4d8" strokeWidth="1" />
          <circle cx="0" cy="-3" r="4" fill="#a1a1aa" />
          <path d="M -7 6 Q 0 0 7 6 Z" fill="#a1a1aa" />
          <text x="0" y="35" textAnchor="middle" fill="#3f3f46" fontSize="11">@nam.tran</text>
        </g>

        <g transform="translate(400, 280)" filter="url(#softGlow)">
          <circle cx="0" cy="0" r="30" fill="#fffbeb" stroke="#f59e0b" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="23" fill="none" stroke="#f59e0b" strokeOpacity="0.35" />
        </g>
        <g transform="translate(400, 280)">
          <text x="0" y="-1" textAnchor="middle" fill="#92400e" fontSize="12" fontWeight="700">{highlighted}</text>
          <text x="0" y="12" textAnchor="middle" fill="#b45309" fontSize="8" letterSpacing="1.2">NGHIÊM TRỌNG</text>
          <text x="0" y="54" textAnchor="middle" fill="#52525b" fontSize="11">Lỗi thanh toán Gateway</text>
        </g>
      </svg>
    </div>
  );
}
