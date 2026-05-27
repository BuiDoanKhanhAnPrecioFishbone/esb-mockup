'use client';

import React, { useState } from 'react';
import {
  Database, Network, GitBranch, Folder, Mail, Users, FileText,
  Briefcase, Calendar, MessageSquare, Settings, AlertTriangle,
  AlertCircle, CheckCircle2, Clock, Loader2, Sparkles, X,
  ArrowRight, Pencil, Eye, Save, FileSignature, Info,
  ChevronRight, RefreshCw, Filter, Layers, Hash, Activity,
  Target, Volume2, Play, MoreHorizontal, Plus, Check, Mic
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════
   ART-EEP — Transactional Gateways
   
   Three critical gateway states discovered between the main UCs:
     1. Ontology Schema Mapping       (Step Zero foundation)
     2. Seeding Progress Command Center (UC-HO-01 intermediate)
     3. Glass-Box Transcript & Entity Editor (UC-HO-03 review)
   
   Primary UI language: Vietnamese (per stakeholder request).
   Design: light mode · enterprise deep-tech minimalism.
   ═══════════════════════════════════════════════════════════════════ */

const STATES = [
  { id: 1, num: '01', name: 'Ánh xạ Ontology',     uc: 'Step Zero' },
  { id: 2, num: '02', name: 'Nạp ngữ cảnh',         uc: 'UC-HO-01' },
  { id: 3, num: '03', name: 'Hộp kính biên bản',   uc: 'UC-HO-03' },
];

export default function ARTeepTransactionalGateways() {
  const [activeState, setActiveState] = useState(1);

  return (
    <div className="h-screen w-full bg-gray-50 text-gray-900 flex flex-col overflow-hidden" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif' }}>

      {/* Top brand + segmented switcher */}
      <header className="bg-white border-b border-gray-200 px-5 py-2.5 flex items-center justify-between shrink-0 gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-1.5 h-1.5 bg-violet-500 rounded-full" />
          <span className="text-gray-900 font-semibold tracking-[0.18em] text-xs" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>ART-EEP</span>
          <span className="text-gray-300 text-xs">·</span>
          <span className="text-gray-500 text-xs">Cổng giao dịch</span>
        </div>

        <div className="inline-flex items-center gap-0.5 p-0.5 rounded-md border border-gray-200 bg-gray-50">
          {STATES.map(s => {
            const isActive = s.id === activeState;
            return (
              <button
                key={s.id}
                onClick={() => setActiveState(s.id)}
                className={`flex items-center gap-2 px-3 py-1 rounded text-[11px] transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-violet-500/20 ${
                  isActive ? 'bg-white text-gray-900 font-medium shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <span className={isActive ? 'text-gray-400' : 'text-gray-400'} style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{s.num}</span>
                <span>{s.name}</span>
              </button>
            );
          })}
        </div>

        <div className="text-[11px] text-gray-500 shrink-0" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>
          {STATES.find(s => s.id === activeState).uc}
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        {activeState === 1 && <State1OntologyMapping />}
        {activeState === 2 && <State2SeedingProgress />}
        {activeState === 3 && <State3TranscriptEditor />}
      </main>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   STATE 1 — ÁNH XẠ LƯỢC ĐỒ ONTOLOGY (Step Zero foundation)
   ═══════════════════════════════════════════════════════════════════ */
function State1OntologyMapping() {
  const [view, setView] = useState('overview'); // 'overview' | 'conflict'

  return (
    <div className="h-full flex overflow-hidden">

      {/* LEFT — Table of entity definitions */}
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium">Step Zero · Ontology</span>
              <h1 className="text-xl font-semibold text-gray-900 tracking-tight mt-1">Ánh xạ lược đồ Ontology</h1>
              <p className="text-sm text-gray-500 mt-1">Cấu hình quy tắc dữ liệu của tổ chức trước khi triển khai bàn giao tri thức.</p>
            </div>
            <span className="text-[11px] text-gray-500 shrink-0 pt-1">An Quân Vũ · Quản trị nền tảng</span>
          </div>
        </div>

        {view === 'conflict' && (
          <div className="mx-6 mt-5 rounded-md border border-rose-200 bg-rose-50/60 px-3 py-2.5 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" strokeWidth={1.75} />
            <div className="text-[12px] text-rose-900 leading-relaxed">
              <strong>Phát hiện 2 xung đột ontology.</strong> Cùng một định danh đang được dùng ở 2 phòng ban khác nhau với định nghĩa không tương thích. Cần xử lý trước khi triển khai bàn giao mới.
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div className="px-6 py-3 border-b border-gray-200 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <SectionLabel count={5}>Phòng ban đã cấu hình</SectionLabel>
          </div>
          <div className="flex items-center gap-2">
            <button className="h-7 px-2 rounded-md border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-[11px] inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20">
              <Filter className="w-3 h-3" />
              Lọc
            </button>
            <PrimaryButton>
              <Plus className="w-3 h-3" />
              Thêm quy tắc
            </PrimaryButton>
          </div>
        </div>

        {/* Data table */}
        <div className="px-6 py-3">
          <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/60">
                  <th className="text-left px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-gray-500 font-medium">Phòng ban</th>
                  <th className="text-left px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-gray-500 font-medium">Nguồn dữ liệu</th>
                  <th className="text-left px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-gray-500 font-medium">Loại thực thể</th>
                  <th className="text-right px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-gray-500 font-medium">Quy tắc</th>
                  <th className="text-right px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-gray-500 font-medium">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                <OntologyRow
                  dept="Kỹ thuật"
                  deptSub="Engineering"
                  sources={[GitBranch, Folder, Mail]}
                  sourceLabels="Jira · GitHub · Drive"
                  entities={['Project', 'Ticket', 'Architecture Debt']}
                  rules={14}
                  status="active"
                  conflict={view === 'conflict'}
                />
                <OntologyRow
                  dept="Kinh doanh"
                  deptSub="Sales"
                  sources={[Briefcase, Calendar, Mail]}
                  sourceLabels="Salesforce · Calendar · Email"
                  entities={['Account', 'Deal', 'Contact']}
                  rules={9}
                  status="active"
                  conflict={view === 'conflict'}
                />
                <OntologyRow
                  dept="Vận hành Nhân sự"
                  deptSub="People Ops"
                  sources={[Users, FileText, Mail]}
                  sourceLabels="HRIS · Notion · Email"
                  entities={['Employee', 'Policy', 'Vendor']}
                  rules={11}
                  status="active"
                />
                <OntologyRow
                  dept="Sản phẩm"
                  deptSub="Product"
                  sources={[FileText, GitBranch, MessageSquare]}
                  sourceLabels="Notion · Jira · Slack"
                  entities={['Feature', 'Spec', 'Research']}
                  rules={7}
                  status="active"
                />
                <OntologyRow
                  dept="Tài chính"
                  deptSub="Finance"
                  sources={[FileText, Mail]}
                  sourceLabels="Notion · Email"
                  entities={['Vendor', 'Invoice']}
                  rules={0}
                  status="pending"
                />
              </tbody>
            </table>
          </div>

          <p className="text-[11px] text-gray-500 mt-3 px-1">
            Tổng cộng <strong className="text-gray-900">41 quy tắc</strong> đang hoạt động · cập nhật lần cuối 2 giờ trước bởi An Quân Vũ
          </p>
        </div>
      </div>

      {/* RIGHT — Edge case toggle panel */}
      <div className="w-96 border-l border-gray-200 bg-gray-50/60 flex flex-col overflow-hidden shrink-0">

        {/* Toggle */}
        <div className="px-4 py-2.5 border-b border-gray-200 bg-white shrink-0">
          <div className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-medium mb-2">Trạng thái</div>
          <div className="inline-flex items-center gap-0.5 p-0.5 rounded-md border border-gray-200 bg-gray-50 w-full">
            <button
              onClick={() => setView('overview')}
              className={`flex-1 px-2 py-1 rounded text-[11px] transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20 ${
                view === 'overview' ? 'bg-white text-gray-900 font-medium border border-gray-200' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Tổng quan
            </button>
            <button
              onClick={() => setView('conflict')}
              className={`flex-1 px-2 py-1 rounded text-[11px] transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20 inline-flex items-center justify-center gap-1.5 ${
                view === 'conflict' ? 'bg-white text-gray-900 font-medium border border-gray-200' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Xung đột
              <span className="text-[9px] px-1 py-0 rounded bg-rose-50 border border-rose-200 text-rose-700 font-semibold">2</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {view === 'overview' && <OntologyOverviewPanel />}
          {view === 'conflict' && <OntologyConflictPanel />}
        </div>
      </div>
    </div>
  );
}

function OntologyRow({ dept, deptSub, sources, sourceLabels, entities, rules, status, conflict }) {
  const hasConflict = conflict && (dept === 'Kỹ thuật' || dept === 'Kinh doanh');

  return (
    <tr
      className={`border-b border-gray-100 last:border-0 hover:bg-gray-50/40 transition-colors ${hasConflict ? 'bg-rose-50/30' : ''}`}
      style={hasConflict ? { boxShadow: 'inset 2px 0 0 rgb(244, 63, 94)' } : undefined}
    >
      <td className="px-4 py-3">
        <div className="text-sm font-medium text-gray-900">{dept}</div>
        <div className="text-[10px] text-gray-500 mt-0.5">{deptSub}</div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          {sources.map((Icon, i) => (
            <span key={i} className="w-5 h-5 rounded bg-gray-50 border border-gray-200 flex items-center justify-center">
              <Icon className="w-2.5 h-2.5 text-gray-600" strokeWidth={1.75} />
            </span>
          ))}
        </div>
        <div className="text-[10px] text-gray-500 mt-1">{sourceLabels}</div>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-1">
          {entities.map(e => (
            <span
              key={e}
              className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${
                hasConflict && e === 'Project'
                  ? 'bg-rose-50 border-rose-200 text-rose-700'
                  : 'bg-blue-50 border-blue-200 text-blue-700'
              }`}
            >
              {e}
            </span>
          ))}
        </div>
      </td>
      <td className="px-4 py-3 text-right">
        <span className="text-xs text-gray-700" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{rules}</span>
      </td>
      <td className="px-4 py-3 text-right">
        {status === 'active' && (
          <span className={`inline-flex items-center gap-1 text-[10px] ${hasConflict ? 'text-rose-700' : 'text-emerald-700'} font-medium`}>
            {hasConflict ? (
              <>
                <AlertTriangle className="w-2.5 h-2.5" />
                Xung đột
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Đang hoạt động
              </>
            )}
          </span>
        )}
        {status === 'pending' && (
          <span className="inline-flex items-center gap-1 text-[10px] text-gray-500 font-medium">
            <Clock className="w-2.5 h-2.5" />
            Chưa cấu hình
          </span>
        )}
      </td>
    </tr>
  );
}

function OntologyOverviewPanel() {
  return (
    <div className="p-4 space-y-4">
      <div>
        <SectionLabel>Tóm tắt cấu hình</SectionLabel>
        <div className="grid grid-cols-2 gap-2">
          <MiniStat value="5" label="Phòng ban" />
          <MiniStat value="41" label="Quy tắc" />
          <MiniStat value="8" label="Nguồn dữ liệu" />
          <MiniStat value="17" label="Loại thực thể" />
        </div>
      </div>

      <div>
        <SectionLabel>Hoạt động gần đây</SectionLabel>
        <div className="space-y-2">
          <ActivityTile
            timestamp="2 giờ trước"
            actor="An Quân Vũ"
            action="Thêm quy tắc mới · Sales › Salesforce · Deal"
          />
          <ActivityTile
            timestamp="Hôm qua"
            actor="An Quân Vũ"
            action="Cập nhật mapping · Engineering › Architecture Debt"
          />
          <ActivityTile
            timestamp="3 ngày trước"
            actor="Hệ thống"
            action="Đồng bộ ontology từ HRIS · 5 phòng ban được cập nhật"
          />
        </div>
      </div>

      <div className="rounded-md border border-emerald-200 bg-emerald-50/40 px-3 py-2.5 flex items-start gap-2">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
        <p className="text-[11px] text-emerald-900 leading-relaxed">
          <strong>Lược đồ ontology đang ổn định.</strong> Không có xung đột giữa các phòng ban được cấu hình.
        </p>
      </div>
    </div>
  );
}

function OntologyConflictPanel() {
  return (
    <div className="p-4 space-y-4">
      <div>
        <SectionLabel count={2}>Xung đột phát hiện</SectionLabel>
        <p className="text-[11px] text-gray-500 mb-3">
          Cùng định danh được dùng ở nhiều phòng ban với định nghĩa không tương thích.
        </p>
      </div>

      {/* Conflict 1 */}
      <div className="rounded-lg border border-rose-200 bg-white overflow-hidden">
        <div className="px-3 py-2 bg-rose-50/40 border-b border-rose-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <h3 className="text-xs font-semibold text-gray-900">"Project Atlas" — 2 định nghĩa</h3>
          </div>
        </div>

        <div className="p-3 space-y-2.5">
          <div className="rounded-md border border-gray-200 bg-gray-50/60 px-2.5 py-2">
            <div className="flex items-center gap-1.5 mb-1">
              <GitBranch className="w-3 h-3 text-gray-500" />
              <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Kỹ thuật</span>
            </div>
            <div className="text-xs font-medium text-gray-900">Dự án phần mềm</div>
            <div className="text-[10px] text-gray-500 mt-0.5">Sở hữu bởi nhóm Backend · 32 issues liên kết</div>
          </div>

          <div className="flex items-center justify-center">
            <span className="text-[10px] text-rose-600 px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200 uppercase tracking-wider font-semibold">vs</span>
          </div>

          <div className="rounded-md border border-gray-200 bg-gray-50/60 px-2.5 py-2">
            <div className="flex items-center gap-1.5 mb-1">
              <Briefcase className="w-3 h-3 text-gray-500" />
              <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Kinh doanh</span>
            </div>
            <div className="text-xs font-medium text-gray-900">Tài khoản khách hàng</div>
            <div className="text-[10px] text-gray-500 mt-0.5">$480K ARR · 14 deals liên kết</div>
          </div>

          <div className="text-[11px] text-rose-800 bg-rose-50/40 border border-rose-200 rounded px-2 py-1.5 leading-relaxed">
            <strong>12 bàn giao</strong> đang sử dụng định danh này — phải xử lý trước khi tạo bàn giao mới.
          </div>

          <div className="space-y-1.5 pt-1">
            <button className="w-full px-2.5 py-1.5 rounded-md bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium inline-flex items-center justify-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/30">
              <Pencil className="w-3 h-3" />
              Đổi tên một bên
            </button>
            <button className="w-full px-2.5 py-1.5 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20">
              Giữ riêng biệt với prefix phòng ban
            </button>
            <button className="w-full px-2.5 py-1.5 rounded-md text-gray-500 hover:text-gray-900 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20">
              Hợp nhất (chúng cùng một thực thể)
            </button>
          </div>
        </div>
      </div>

      {/* Conflict 2 — compact */}
      <div className="rounded-lg border border-rose-200 bg-white overflow-hidden">
        <div className="px-3 py-2 bg-rose-50/40 border-b border-rose-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <h3 className="text-xs font-semibold text-gray-900">"Vendor XYZ" — 2 định nghĩa</h3>
          </div>
          <button className="text-[10px] text-gray-500 hover:text-gray-900 inline-flex items-center gap-1">
            Mở rộng
            <ChevronRight className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ value, label }) {
  return (
    <div className="rounded-md border border-gray-200 bg-white px-3 py-2">
      <div className="text-xl font-semibold text-gray-900 tracking-tight" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{value}</div>
      <div className="text-[10px] text-gray-500 mt-0.5">{label}</div>
    </div>
  );
}

function ActivityTile({ timestamp, actor, action }) {
  return (
    <div className="rounded-md border border-gray-200 bg-white px-2.5 py-1.5">
      <div className="flex items-center justify-between mb-0.5">
        <span className="text-[10px] text-gray-500" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{timestamp}</span>
        <span className="text-[10px] text-gray-700 font-medium">{actor}</span>
      </div>
      <div className="text-[11px] text-gray-900 leading-relaxed">{action}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   STATE 2 — TIẾN TRÌNH NẠP NGỮ CẢNH (UC-HO-01 intermediate)
   ═══════════════════════════════════════════════════════════════════ */
function State2SeedingProgress() {
  return (
    <div className="h-full flex overflow-hidden">

      {/* LEFT — Progress + stats */}
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium">Trung tâm điều phối · UC-HO-01</span>
              <h1 className="text-xl font-semibold text-gray-900 tracking-tight mt-1">Đang nạp footprint của Minh Lê</h1>
              <p className="text-sm text-gray-500 mt-1">Quét tự động trên 6 nguồn dữ liệu được cấu hình cho phòng Kỹ thuật.</p>
            </div>
            <span className="text-[11px] text-gray-500 shrink-0 pt-1">Hà Vy · Quản lý</span>
          </div>
        </div>

        <div className="px-6 py-6">

          {/* Big progress */}
          <div className="rounded-lg border border-gray-200 bg-white p-5 mb-5">
            <div className="flex items-end justify-between mb-3">
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium mb-1">Tiến trình tổng thể</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-semibold text-gray-900 tracking-tight" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>42</span>
                  <span className="text-lg text-gray-500" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>%</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium mb-1">Còn lại</div>
                <div className="text-sm text-gray-900 font-medium">~6 phút</div>
              </div>
            </div>
            <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full bg-violet-600 rounded-full transition-all" style={{ width: '42%' }} />
            </div>
          </div>

          {/* Source stats */}
          <SectionLabel>Đã quét từ các nguồn</SectionLabel>
          <div className="grid grid-cols-2 gap-2.5 mb-6">
            <SourceStatCard icon={MessageSquare} value="147" label="luồng Slack đã phân tích" status="done" />
            <SourceStatCard icon={Folder}        value="24"  label="tệp Drive đã quét" status="done" />
            <SourceStatCard icon={GitBranch}     value="47"  label="vé Jira đã trích xuất" status="active" detail="đang phân loại" />
            <SourceStatCard icon={Mail}          value="89"  label="email metadata" status="active" detail="63% qua Purview" />
          </div>

          {/* Pipeline stages */}
          <SectionLabel>Giai đoạn xử lý</SectionLabel>
          <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
            <PipelineStage status="done"    label="Kết nối tới nguồn dữ liệu"   detail="6/6 connector phản hồi thành công" />
            <PipelineStage status="done"    label="Quét nội dung thô"            detail="307 đối tượng được nhận diện" />
            <PipelineStage status="active"  label="Phân loại độ nhạy cảm"        detail="Microsoft Purview · 63%" />
            <PipelineStage status="pending" label="Trích xuất thực thể và quan hệ" />
            <PipelineStage status="pending" label="Xây dựng bản đồ tri thức sơ bộ" last />
          </div>
        </div>
      </div>

      {/* RIGHT — Live activity feed */}
      <div className="w-[420px] border-l border-gray-200 bg-gray-50/60 flex flex-col overflow-hidden shrink-0">
        <div className="px-4 py-3 border-b border-gray-200 bg-white shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-3.5 h-3.5 text-violet-600" />
            <h2 className="text-sm font-semibold text-gray-900">Diễn giải hoạt động AI</h2>
            <span className="ml-auto text-[10px] text-gray-500 inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Trực tiếp
            </span>
          </div>
          <p className="text-[11px] text-gray-500">Mô tả backend bằng ngôn ngữ dễ hiểu.</p>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
          <FeedItem
            time="14:32:18"
            active
            text="Đang quét repository GitHub của Minh Lê — tìm thấy 3 dự án trọng yếu mà bạn ấy đóng góp gần đây nhất."
          />
          <FeedItem
            time="14:31:55"
            text="Phát hiện 3 dự án trọng yếu: Project Atlas, Payment Gateway v2, Customer Portal Refresh."
            entities={['Project Atlas', 'Payment Gateway v2', 'Customer Portal Refresh']}
          />
          <FeedItem
            time="14:31:08"
            text="Bắt đầu phân loại 89 email metadata qua dịch vụ phân loại độ nhạy cảm."
          />
          <FeedItem
            time="14:30:33"
            text="Đã trích xuất 47 vé Jira từ 90 ngày làm việc gần nhất — chỉ lấy tiêu đề và metadata, không lấy nội dung mô tả chi tiết."
          />
          <FeedItem
            time="14:29:47"
            text="Phát hiện một runbook chưa được tài liệu hóa: 'Payment Gateway timeout' — có 3 lần xảy ra trong quý gần nhất."
            highlight
          />
          <FeedItem
            time="14:28:21"
            text="Đang phân tích 147 luồng Slack có Minh Lê tham gia — tìm các quyết định kỹ thuật chưa được ghi chép."
          />
          <FeedItem
            time="14:27:09"
            text="Kết nối thành công tới Google Drive — quét 412 tệp mà Minh Lê là chủ sở hữu hoặc người chỉnh sửa gần đây."
          />
          <FeedItem
            time="14:26:42"
            text="Bắt đầu phiên nạp ngữ cảnh cho Minh Lê · phòng Kỹ thuật · 6 nguồn dữ liệu được kích hoạt."
            first
          />
        </div>
      </div>
    </div>
  );
}

function SourceStatCard({ icon: Icon, value, label, status, detail }) {
  const statusCfg = {
    done:   { dot: 'bg-emerald-500', text: 'text-emerald-700', label: 'Hoàn tất' },
    active: { dot: 'bg-violet-500',  text: 'text-violet-700',  label: 'Đang xử lý' },
  }[status];

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="w-7 h-7 rounded-md bg-gray-50 border border-gray-200 flex items-center justify-center">
          <Icon className="w-3.5 h-3.5 text-gray-600" strokeWidth={1.75} />
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] font-medium">
          <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot} ${status === 'active' ? 'animate-pulse' : ''}`} />
          <span className={statusCfg.text}>{statusCfg.label}</span>
        </span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-semibold text-gray-900 tracking-tight" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{value}</span>
      </div>
      <div className="text-[11px] text-gray-500 mt-0.5 leading-tight">{label}</div>
      {detail && <div className="text-[10px] text-gray-400 mt-1">{detail}</div>}
    </div>
  );
}

function PipelineStage({ status, label, detail, last }) {
  const config = {
    done:    { icon: CheckCircle2, iconCls: 'text-emerald-600',             labelCls: 'text-gray-900' },
    active:  { icon: Loader2,      iconCls: 'text-violet-600 animate-spin', labelCls: 'text-gray-900 font-medium' },
    pending: { icon: Clock,        iconCls: 'text-gray-300',                labelCls: 'text-gray-400' },
  }[status];
  const Icon = config.icon;
  return (
    <div className={`px-4 py-3 flex items-start gap-3 ${!last ? 'border-b border-gray-100' : ''}`}>
      <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${config.iconCls}`} strokeWidth={1.75} />
      <div className="flex-1 min-w-0">
        <div className={`text-sm ${config.labelCls}`}>{label}</div>
        {detail && <div className="text-[11px] text-gray-500 mt-0.5">{detail}</div>}
      </div>
    </div>
  );
}

function FeedItem({ time, text, active, highlight, first, entities }) {
  return (
    <div className={`rounded-md px-3 py-2 ${
      active ? 'bg-violet-50/60 border border-violet-200' :
      highlight ? 'bg-yellow-50/40 border border-yellow-200' :
      first ? 'bg-gray-50 border border-gray-200' :
      'bg-white border border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] text-gray-500" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{time}</span>
        {active && (
          <span className="inline-flex items-center gap-1 text-[10px] text-violet-700 font-medium">
            <Loader2 className="w-2.5 h-2.5 animate-spin" />
            đang xử lý
          </span>
        )}
        {highlight && (
          <span className="inline-flex items-center gap-1 text-[10px] text-yellow-800 font-medium">
            <Sparkles className="w-2.5 h-2.5" />
            phát hiện
          </span>
        )}
        {first && (
          <span className="text-[10px] text-gray-500 font-medium">bắt đầu</span>
        )}
      </div>
      <p className="text-[12px] text-gray-700 leading-relaxed">{text}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   STATE 3 — HỘP KÍNH BIÊN BẢN & TRÌNH SOẠN THỰC THỂ (UC-HO-03)
   ═══════════════════════════════════════════════════════════════════ */
function State3TranscriptEditor() {
  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">

      {/* Top action bar */}
      <div className="px-5 py-3 border-b border-gray-200 flex items-center justify-between shrink-0">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium">Review · UC-HO-03</span>
          <h1 className="text-base font-semibold text-gray-900 tracking-tight">Biên tập biên bản phỏng vấn</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-gray-500">Minh Lê · Người bàn giao</span>
          <span className="w-px h-4 bg-gray-200 mx-1" />
          <SecondaryButton>
            <Save className="w-3.5 h-3.5" />
            Lưu nháp
          </SecondaryButton>
          <button
            disabled
            className="h-8 px-3 rounded-md text-sm font-medium inline-flex items-center gap-1.5 bg-gray-100 text-gray-400 cursor-not-allowed"
          >
            <FileSignature className="w-3.5 h-3.5" />
            Ký xác nhận
          </button>
        </div>
      </div>

      {/* Blocked notice — 3 items must be verified */}
      <div className="px-5 py-2 border-b border-yellow-200 bg-yellow-50/40 flex items-center gap-2 shrink-0">
        <AlertTriangle className="w-3.5 h-3.5 text-yellow-700 shrink-0" strokeWidth={1.75} />
        <p className="text-[12px] text-yellow-900">
          <strong>Còn 3 đoạn có độ tin cậy thấp.</strong> Bạn cần xác minh hoặc sửa lại từng đoạn trước khi ký xác nhận.
        </p>
      </div>

      <div className="flex-1 flex overflow-hidden">

        {/* LEFT — Transcript editor with inline entities */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          <div className="px-5 py-2.5 border-b border-gray-200 bg-gray-50/60 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Mic className="w-3.5 h-3.5 text-gray-500" />
              <h2 className="text-xs uppercase tracking-[0.18em] text-gray-500 font-medium">Bản ghi nội dung phỏng vấn</h2>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-gray-500">
              <button className="px-2 py-0.5 rounded border border-gray-200 bg-white hover:bg-gray-50 inline-flex items-center gap-1.5 transition-colors">
                <Play className="w-2.5 h-2.5" fill="currentColor" />
                <span>Phát audio</span>
              </button>
              <span style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>42:18</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-8 py-6">
            <article className="max-w-2xl mx-auto space-y-5">

              {/* Section 1 — Project Atlas */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-violet-700 font-medium">Mục 01 · Quyết định kiến trúc</span>
                </div>
                <p className="text-[15px] text-gray-800 leading-relaxed">
                  Hôm nay <EntityBadge kind="person">Minh Lê</EntityBadge> sẽ bàn giao về <EntityBadge kind="project">Project Atlas</EntityBadge>. Trong Q3 vừa rồi, mình và <EntityBadge kind="person">Hà Vy</EntityBadge> đã quyết định tách <EntityBadge kind="concept">read/write paths</EntityBadge> để chuẩn bị cho việc <EntityBadge kind="concept">scaling</EntityBadge>. Quyết định này đã giúp chúng ta vượt qua đợt tăng tải gấp 8 lần vào tháng 9.
                </p>
              </div>

              {/* Section 2 — Payment Gateway (with low-confidence highlight) */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-violet-700 font-medium">Mục 02 · Payment Gateway timeout</span>
                </div>
                <p className="text-[15px] text-gray-800 leading-relaxed">
                  Về <EntityBadge kind="project">Payment Gateway v2</EntityBadge>, có một vấn đề tái diễn 3 lần trong quý này.{' '}
                  <LowConfidenceSpan>
                    Cách xử lý là khởi động lại dịch vụ connection pool trong khoảng 2 đến 4 giờ sáng, sau khi batch job đêm hoàn tất.
                  </LowConfidenceSpan>
                  {' '}Đó là cách <EntityBadge kind="person">Linh Phạm</EntityBadge> từ team Infrastructure hướng dẫn mình vào lần đầu xảy ra sự cố.
                </p>
              </div>

              {/* Section 3 — Vendor XYZ */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-violet-700 font-medium">Mục 03 · Quan hệ vendor</span>
                </div>
                <p className="text-[15px] text-gray-800 leading-relaxed">
                  Đối với <EntityBadge kind="project">Vendor XYZ</EntityBadge>, mình đã đàm phán điều khoản SLA mới —{' '}
                  <LowConfidenceSpan>
                    response window là 4 giờ cho critical issue, đổi lại penalty cao hơn cho mỗi lần vi phạm.
                  </LowConfidenceSpan>
                  {' '}Trong trường hợp <EntityBadge kind="concept">renewal trigger</EntityBadge> kích hoạt, có thể liên hệ <EntityBadge kind="person">Linh Phạm</EntityBadge> để hỗ trợ.
                </p>
              </div>

              {/* Section 4 — Onboarding handoff */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-violet-700 font-medium">Mục 04 · Bàn giao cho người kế nhiệm</span>
                </div>
                <p className="text-[15px] text-gray-800 leading-relaxed">
                  <EntityBadge kind="person">Trần Hữu Nam</EntityBadge> sẽ tiếp quản vai trò của mình từ tuần sau. Mình đã chuẩn bị tài liệu chi tiết về{' '}
                  <LowConfidenceSpan>
                    quy trình rollback cho Customer Portal khi lỗi xảy ra trong cửa sổ bảo trì.
                  </LowConfidenceSpan>
                  {' '}Khuyến nghị Nam pair cùng <EntityBadge kind="person">Hà Vy</EntityBadge> trong 2 phiên đầu để nắm context.
                </p>
              </div>

              {/* Legend */}
              <div className="pt-4 mt-6 border-t border-gray-100 flex items-center gap-3 flex-wrap text-[10px] text-gray-500">
                <span className="font-medium uppercase tracking-[0.18em]">Chú thích:</span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="inline-block w-3 h-3 rounded bg-blue-50 border border-blue-200" />
                  Dự án / sản phẩm
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="inline-block w-3 h-3 rounded bg-gray-100 border border-gray-200" />
                  Con người
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="inline-block w-3 h-3 rounded bg-violet-50 border border-violet-200" />
                  Khái niệm
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="inline-block w-3 h-3 rounded bg-yellow-100 border-b-2 border-yellow-400" />
                  Tin cậy thấp
                </span>
              </div>
            </article>
          </div>
        </div>

        {/* RIGHT — Low confidence drawer */}
        <div className="w-[400px] border-l border-gray-200 bg-gray-50/60 flex flex-col overflow-hidden shrink-0">
          <div className="px-4 py-3 border-b border-gray-200 bg-white shrink-0">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-3.5 h-3.5 text-yellow-700" />
              <h2 className="text-sm font-semibold text-gray-900">Cần kiểm tra</h2>
              <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-yellow-50 border border-yellow-200 text-yellow-800 font-semibold">3 đoạn</span>
            </div>
            <p className="text-[11px] text-gray-500">AI có độ tin cậy thấp ở những đoạn này. Hãy xác minh hoặc sửa trước khi ký.</p>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5">
            <LowConfidenceCard
              section="Mục 02 · Payment Gateway"
              confidence={62}
              snippet="khởi động lại dịch vụ connection pool trong khoảng 2 đến 4 giờ sáng, sau khi batch job đêm hoàn tất."
              reason="Thuật ngữ kỹ thuật không khớp với từ điển nội bộ"
            />
            <LowConfidenceCard
              section="Mục 03 · Quan hệ vendor"
              confidence={68}
              snippet="response window là 4 giờ cho critical issue, đổi lại penalty cao hơn cho mỗi lần vi phạm."
              reason="Số liệu tài chính cần xác nhận"
            />
            <LowConfidenceCard
              section="Mục 04 · Bàn giao"
              confidence={71}
              snippet="quy trình rollback cho Customer Portal khi lỗi xảy ra trong cửa sổ bảo trì."
              reason="Quy trình chưa được tài liệu hóa ở bất kỳ đâu khác"
            />
          </div>

          <div className="px-3 py-2.5 border-t border-gray-200 bg-white shrink-0 flex items-center justify-between text-[11px]">
            <span className="text-gray-500">Đã xử lý <strong className="text-gray-900">0/3</strong></span>
            <button className="text-gray-500 hover:text-gray-900 inline-flex items-center gap-1 transition-colors">
              <Eye className="w-3 h-3" />
              Ẩn các đoạn đã xử lý
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EntityBadge({ kind, children }) {
  const cfg = {
    project: { cls: 'bg-blue-50 border border-blue-200 text-blue-700' },
    person:  { cls: 'bg-gray-100 border border-gray-200 text-gray-700' },
    concept: { cls: 'bg-violet-50 border border-violet-200 text-violet-700' },
  }[kind];
  return (
    <span className={`inline-block px-1.5 py-0 rounded text-[13px] font-medium ${cfg.cls}`} style={{ lineHeight: '1.4' }}>
      {children}
    </span>
  );
}

function LowConfidenceSpan({ children }) {
  return (
    <span
      className="bg-yellow-50/60 border-b-2 border-yellow-400 px-0.5"
      style={{ textDecoration: 'none' }}
    >
      {children}
    </span>
  );
}

function LowConfidenceCard({ section, confidence, snippet, reason }) {
  return (
    <article className="rounded-lg border border-yellow-200 bg-white overflow-hidden" style={{ borderLeft: '2px solid rgb(234, 179, 8)' }}>
      <div className="px-3 py-2 border-b border-yellow-100 bg-yellow-50/40 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-[0.18em] text-yellow-800 font-medium">{section}</span>
        <span className="text-[10px] font-semibold text-yellow-800" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{confidence}% tin cậy</span>
      </div>
      <div className="px-3 py-2.5">
        <p className="text-[12px] text-gray-800 leading-relaxed italic border-l-2 border-yellow-300 pl-2.5 mb-2">
          "{snippet}"
        </p>
        <div className="flex items-start gap-1.5 mb-3">
          <Info className="w-3 h-3 text-gray-400 shrink-0 mt-0.5" />
          <p className="text-[10px] text-gray-500 leading-relaxed">{reason}</p>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          <button className="px-2 py-1.5 rounded-md bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-medium inline-flex items-center justify-center gap-1 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/30">
            <Check className="w-2.5 h-2.5" />
            Xác minh
          </button>
          <button className="px-2 py-1.5 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-[11px] font-medium inline-flex items-center justify-center gap-1 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20">
            <Pencil className="w-2.5 h-2.5" />
            Sửa lại
          </button>
          <button className="px-2 py-1.5 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 text-[11px] font-medium inline-flex items-center justify-center gap-1 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20">
            <X className="w-2.5 h-2.5" />
            Bỏ
          </button>
        </div>
      </div>
    </article>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SHARED PRIMITIVES
   ═══════════════════════════════════════════════════════════════════ */

function SectionLabel({ count, children }) {
  return (
    <h2 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium mb-3 flex items-center gap-2">
      <span>{children}</span>
      {count !== undefined && (
        <span className="text-gray-400" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>· {count}</span>
      )}
    </h2>
  );
}

function PrimaryButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="h-7 px-2.5 rounded-md bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/30"
    >
      {children}
    </button>
  );
}

function SecondaryButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="h-8 px-3 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 text-sm font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20"
    >
      {children}
    </button>
  );
}
