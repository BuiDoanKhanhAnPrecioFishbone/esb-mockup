"use client";
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import { Send, Sparkles, X, ChevronRight, Flag, BarChart3, CheckCircle2, XCircle, AlertTriangle, Pencil, Check, Plus, PanelLeftClose, PanelLeftOpen, Eye, Network, Users, Crosshair, Search } from "lucide-react";

/* ART-EEP Consumer Plane — Knowledge Graph Explorer
   Post-commit view: shows only committed entries, which are NEVER gaps (§8.1c).
   Every node is purple (knowledge) or gray (structural) — no yellow gap nodes, no Filter control.
   Gaps live inside active sessions only, not in the committed graph. */

const NODES = [
  { id:"eng", label:"Engineering", type:"dept", depth:0, summary:"Engineering department\n7 knowledge modules\n42 entries across 3 handovers" },
  { id:"payment", label:"Payment Processing", type:"module", depth:1, parent:"eng", entries:12, verified:9, draft:3, gaps:0, summary:"Covers Kafka pipeline, Stripe integration,\nwebhook verification, PCI compliance", provenance:[{name:"Minh L\u00ea",date:"Jun 2026",count:10},{name:"Thanh \u0110\u1ee9c",date:"Mar 2026",count:2}] },
  { id:"auth", label:"Auth & Identity", type:"module", depth:1, parent:"eng", entries:8, verified:5, draft:3, gaps:0, summary:"OAuth2 PKCE, Azure AD SSO,\nJWT rotation, RBAC matrix", provenance:[{name:"Minh L\u00ea",date:"Jun 2026",count:8}] },
  { id:"database", label:"Database & Migrations", type:"module", depth:1, parent:"eng", entries:9, verified:5, draft:4, gaps:0, summary:"Cosmos DB partitioning, Flyway pipeline,\nmanual migration procedures", provenance:[{name:"Minh L\u00ea",date:"Jun 2026",count:7},{name:"Thanh \u0110\u1ee9c",date:"Mar 2026",count:2}] },
  { id:"cicd", label:"CI/CD & Deployments", type:"module", depth:1, parent:"eng", entries:6, verified:4, draft:2, gaps:0, summary:"GitHub Actions, Helm charts,\nsecrets injection, rollback runbook", provenance:[{name:"Minh L\u00ea",date:"Jun 2026",count:6}] },
  { id:"monitor", label:"Monitoring", type:"module", depth:1, parent:"eng", entries:5, verified:5, draft:0, gaps:0, summary:"Grafana dashboards, PagerDuty alerts,\nSLA definitions, escalation paths", provenance:[{name:"Minh L\u00ea",date:"Jun 2026",count:3},{name:"Thanh \u0110\u1ee9c",date:"Mar 2026",count:2}] },
  { id:"ratelimit", label:"Rate Limiting & API", type:"module", depth:1, parent:"eng", entries:4, verified:3, draft:1, gaps:0, summary:"Token bucket, API versioning,\nsunset policy, tenant configuration", provenance:[{name:"Minh L\u00ea",date:"Jun 2026",count:4}] },
  { id:"infra", label:"Infrastructure as Code", type:"module", depth:1, parent:"eng", entries:3, verified:3, draft:0, gaps:0, summary:"Terraform modules, AKS cluster config,\nnetwork policies", provenance:[{name:"Thanh \u0110\u1ee9c",date:"Mar 2026",count:3}] },
  { id:"e-kafka", label:"Kafka Event Pipeline", type:"entry", depth:2, parent:"payment", status:"verified", summary:"Async payment processing via Kafka\nRetry: 3x exponential backoff then DLQ\nIdempotency: payment_id + timestamp hash\n1,840 tokens" },
  { id:"e-stripe-wh", label:"Stripe Webhook Verification", type:"entry", depth:2, parent:"payment", status:"verified", summary:"HMAC-SHA256 signature verification\nReplay protection: 5-min timestamp window\n680 tokens" },
  { id:"e-race", label:"Payment Retry Race Condition", type:"entry", depth:2, parent:"payment", status:"verified", summary:"P2 incident 2026-05-15, 23 customers\nRoot cause: missing distributed lock\n920 tokens" },
  { id:"e-pci", label:"PCI Compliance Scope", type:"entry", depth:2, parent:"payment", status:"draft", summary:"Gap: card has title only, no description\nPCI compliance scope is critical knowledge\n0 tokens" },
  { id:"e-stripe-pin", label:"Stripe API Pinning", type:"entry", depth:2, parent:"payment", status:"draft", summary:"Pinned to 2024-12-18, never auto-upgrade\nSandbox then staging then prod\n520 tokens" },
  { id:"e-oauth", label:"OAuth2 PKCE Flow", type:"entry", depth:2, parent:"auth", status:"verified", summary:"Mobile clients via React Native\nS256 challenge, secure keychain storage\n7-day sliding refresh window\n1,420 tokens" },
  { id:"e-saml", label:"Azure AD SAML SSO", type:"entry", depth:2, parent:"auth", status:"verified", summary:"Enterprise SSO via SAML 2.0\nSP-initiated only, IdP blocked\nTenant metadata in Key Vault\n890 tokens" },
  { id:"e-jwt", label:"JWT Key Rotation", type:"entry", depth:2, parent:"auth", status:"draft", summary:"RSA-256 via Key Vault auto-rotation\n90-day cycle, 7-day grace period\nGap: emergency procedure is tacit knowledge\n1,100 tokens" },
  { id:"e-rbac", label:"RBAC Permission Matrix", type:"entry", depth:2, parent:"auth", status:"draft", summary:"4 roles x 12 permissions\nEntra ID group mapping\nGap: Q2 audit pending, content may be stale\n760 tokens" },
  { id:"e-cosmos", label:"Cosmos DB Partitioning", type:"entry", depth:2, parent:"database", status:"verified", summary:"Partition key: /orgId\nCross-partition queries blocked at SDK\nRU: 4,000/s autoscale to 8,000/s\n1,650 tokens" },
  { id:"e-migv8", label:"Migration v8 to v9", type:"entry", depth:2, parent:"database", status:"draft", summary:"Manual ALTER TABLE on legacy SQL mirror\nCustomer DBA restricts DDL automation\nContradiction with Flyway card resolved\n540 tokens" },
  { id:"e-flyway", label:"Flyway Migration Pipeline", type:"entry", depth:2, parent:"database", status:"verified", summary:"V{version}__{desc}.sql naming\nApplied on deploy via GitHub Actions\nRollback: manual scripts in /db/rollback/\n780 tokens" },
  { id:"e-gha", label:"GitHub Actions Matrix", type:"entry", depth:2, parent:"cicd", status:"verified", summary:"4 workflows: lint, test, build, deploy\nNode 18/20 x Ubuntu, 8min avg\nCoverage gate: 85% minimum\n1,280 tokens" },
  { id:"e-helm", label:"Helm Rollback Procedure", type:"entry", depth:2, parent:"cicd", status:"verified", summary:"7-step procedure (not just helm rollback)\nCheck init container, run rollback SQL,\nthen helm rollback, verify, post to Slack\n960 tokens" },
  { id:"e-grafana", label:"Grafana Dashboard Suite", type:"entry", depth:2, parent:"monitor", status:"verified", summary:"6 dashboards: SLA, latency, errors,\nthroughput, cost, dependencies\nBacked by Azure Monitor\n1,580 tokens" },
  { id:"e-sla", label:"SLA & Escalation Paths", type:"entry", depth:2, parent:"monitor", status:"verified", summary:"99.9% uptime target\nP1: 15min response, 4hr resolve\nEscalation: on-call then Ha Vy then CTO\n640 tokens" },
  { id:"e-bucket", label:"Token Bucket Rate Limiter", type:"entry", depth:2, parent:"ratelimit", status:"verified", summary:"Per-tenant in Redis, 1,000 req/min\nBurst: 1.5x for 10s\nAdmin API for mid-contract changes\n1,340 tokens" },
  { id:"e-sunset", label:"API Versioning & Sunset", type:"entry", depth:2, parent:"ratelimit", status:"verified", summary:"URL-based: /v1/, /v2/\nSunset header per RFC 8594\nv1 EOL: 2026-09-01\n480 tokens" },
  { id:"e-terraform", label:"Terraform Modules", type:"entry", depth:2, parent:"infra", status:"verified", summary:"AKS cluster, VNet, NSGs\nState in Azure Storage Account\nPlan/apply via GitHub Actions\n1,100 tokens" },
  { id:"s-keyvault", label:"Azure Key Vault", type:"system", depth:2, summary:"Secrets management\nOAuth tokens, API keys, tenant metadata\nCSI driver for Helm injection" },
  { id:"s-pagerduty", label:"PagerDuty", type:"system", depth:2, summary:"Alerting service\nIntegrated with Grafana alerting rules\nP1/P2/P3 thresholds configured" },
];

const EDGES = [
  {from:"eng",to:"payment",type:"hierarchy"},{from:"eng",to:"auth",type:"hierarchy"},{from:"eng",to:"database",type:"hierarchy"},{from:"eng",to:"cicd",type:"hierarchy"},{from:"eng",to:"monitor",type:"hierarchy"},{from:"eng",to:"ratelimit",type:"hierarchy"},{from:"eng",to:"infra",type:"hierarchy"},
  {from:"payment",to:"e-kafka",type:"hierarchy"},{from:"payment",to:"e-stripe-wh",type:"hierarchy"},{from:"payment",to:"e-race",type:"hierarchy"},{from:"payment",to:"e-pci",type:"hierarchy"},{from:"payment",to:"e-stripe-pin",type:"hierarchy"},
  {from:"auth",to:"e-oauth",type:"hierarchy"},{from:"auth",to:"e-saml",type:"hierarchy"},{from:"auth",to:"e-jwt",type:"hierarchy"},{from:"auth",to:"e-rbac",type:"hierarchy"},
  {from:"database",to:"e-cosmos",type:"hierarchy"},{from:"database",to:"e-migv8",type:"hierarchy"},{from:"database",to:"e-flyway",type:"hierarchy"},
  {from:"cicd",to:"e-gha",type:"hierarchy"},{from:"cicd",to:"e-helm",type:"hierarchy"},
  {from:"monitor",to:"e-grafana",type:"hierarchy"},{from:"monitor",to:"e-sla",type:"hierarchy"},
  {from:"ratelimit",to:"e-bucket",type:"hierarchy"},{from:"ratelimit",to:"e-sunset",type:"hierarchy"},
  {from:"infra",to:"e-terraform",type:"hierarchy"},
  {from:"e-oauth",to:"e-bucket",type:"cross",label:"rate-limited by"},{from:"e-rbac",to:"e-saml",type:"cross",label:"authenticated via"},{from:"e-gha",to:"e-helm",type:"cross",label:"deploys via"},{from:"e-helm",to:"e-flyway",type:"cross",label:"coordinates with"},{from:"e-helm",to:"e-migv8",type:"cross",label:"rollback includes"},{from:"e-cosmos",to:"e-migv8",type:"cross",label:"schema managed by"},{from:"e-grafana",to:"e-sla",type:"cross",label:"enforces"},{from:"e-kafka",to:"e-grafana",type:"cross",label:"monitored by"},{from:"e-stripe-wh",to:"e-bucket",type:"cross",label:"rate-limited by"},{from:"e-race",to:"e-kafka",type:"cross",label:"caused by"},{from:"e-jwt",to:"s-keyvault",type:"cross",label:"keys stored in"},{from:"e-saml",to:"s-keyvault",type:"cross",label:"metadata in"},{from:"e-helm",to:"s-keyvault",type:"cross",label:"secrets via CSI"},{from:"e-grafana",to:"s-pagerduty",type:"cross",label:"alerts via"},{from:"e-sla",to:"s-pagerduty",type:"cross",label:"escalates via"},{from:"e-terraform",to:"e-gha",type:"cross",label:"applied via"},
];

const CHIPS = [
  {label:"Show risks",response:"Found 5 knowledge gaps across 3 modules. JWT Key Rotation and Migration v8-v9 are the highest priority \u2014 both contain tacit knowledge that was partially captured during Minh Le's handover.",focus:["e-jwt","e-migv8","e-pci","e-rbac","e-stripe-pin"]},
  {label:"Critical paths",response:"3 critical operational procedures identified: Helm Rollback (7 manual steps), SLA Escalation (on-call chain), and Kafka DLQ monitoring. All verified during the last handover.",focus:["e-helm","e-sla","e-kafka","e-grafana"]},
  {label:"Auth flow",response:"Authentication spans 4 entries: OAuth2 PKCE for mobile, Azure AD SAML for enterprise SSO, JWT rotation for token management, and RBAC for authorization. JWT rotation has an unresolved gap \u2014 the emergency procedure.",focus:["e-oauth","e-saml","e-jwt","e-rbac","auth"]},
  {label:"Deploy pipeline",response:"Deployment flows through GitHub Actions (4 workflows, 8min avg) into Helm charts on AKS. The rollback procedure was tacit knowledge from Minh Le \u2014 now documented as a 7-step runbook.",focus:["e-gha","e-helm","e-flyway","e-terraform","cicd"]},
  {label:"Incident response",response:"Incident response starts at Grafana dashboards (6 panels), routes through PagerDuty (P1/P2/P3 thresholds), and follows the SLA escalation path: on-call \u2192 Ha Vy \u2192 CTO. The payment retry race condition is the most recent documented incident.",focus:["e-sla","e-grafana","s-pagerduty","e-race","monitor"]},
];

const PROMPTS = {
  "minh-le": { filter: n => n.provenance?.some(p => p.name.includes("Minh")), input: "Show me Minh L\u00ea's contributions", response: "Minh L\u00ea contributed 42 entries across 6 modules (Payment, Auth, Database, CI/CD, Monitoring, Rate Limiting). 5 knowledge gaps remain across 3 modules." },
  "thanh-duc": { filter: n => n.provenance?.some(p => p.name.includes("Thanh")), input: "Show me Thanh \u0110\u1ee9c's contributions", response: "Thanh \u0110\u1ee9c contributed 9 entries across 4 modules (Payment, Database, Monitoring, Infrastructure as Code). All entries are verified. Completed Mar 2026." },
};

/* Recommendation chips: each has an icon, a label, and either a focus array (graph highlight)
   and/or a canned AI response. The chatbot never creates new nodes — focus only highlights existing ones. */
const RECO_ICONS = { Eye, Network, Users, Crosshair, Search, Sparkles };
const SEED_THREADS = [
  { id:"t-risks", title:"Knowledge gaps & risks", ts:"2h", messages:[
    { role:"user", text:"Where are the biggest knowledge risks?" },
    { role:"ai", text:"Found 5 knowledge gaps across 3 modules. JWT Key Rotation and Migration v8–v9 are the highest priority — both contain tacit knowledge that was only partially captured during Minh Lê's handover.", focus:["e-jwt","e-migv8","e-pci","e-rbac","e-stripe-pin"],
      chips:[ {icon:"Eye",label:"Show the gaps",focus:["e-jwt","e-migv8","e-pci","e-rbac"]}, {icon:"Users",label:"Who contributed?",response:"All 5 gap entries trace back to Minh Lê's handover (Jun 2026). Thanh Đức's older entries are all verified."}, {icon:"Crosshair",label:"Zoom to JWT rotation",focus:["e-jwt","auth"]} ] },
  ] },
  { id:"t-deploy", title:"Deploy pipeline walkthrough", ts:"Yesterday", messages:[
    { role:"user", text:"How does deployment work end to end?" },
    { role:"ai", text:"Deployment flows through GitHub Actions (4 workflows, 8min avg) into Helm charts on AKS. The rollback procedure was tacit knowledge from Minh Lê — now documented as a 7-step runbook.", focus:["e-gha","e-helm","e-flyway","e-terraform","cicd"],
      chips:[ {icon:"Network",label:"Connected entries",focus:["e-gha","e-helm","e-flyway","e-terraform"]}, {icon:"Search",label:"Helm rollback details",focus:["e-helm"]} ] },
  ] },
  { id:"t-auth", title:"Auth & identity overview", ts:"3d", messages:[
    { role:"user", text:"Walk me through the auth flow." },
    { role:"ai", text:"Authentication spans 4 entries: OAuth2 PKCE for mobile, Azure AD SAML for enterprise SSO, JWT rotation for tokens, and RBAC for authorization. JWT rotation has an unresolved gap — the emergency procedure.", focus:["e-oauth","e-saml","e-jwt","e-rbac","auth"],
      chips:[ {icon:"Eye",label:"Show the gap",focus:["e-jwt"]}, {icon:"Network",label:"Connected entries",focus:["e-oauth","e-saml","e-jwt","e-rbac"]}, {icon:"Search",label:"SAML SSO details",focus:["e-saml"]} ] },
  ] },
];

const nodeR = (n) => n.type==="dept"?28:n.type==="module"?18:n.type==="system"?10:10;
/* Both resolved and dismissed return to normal purple. Only active gaps are yellow. */
const nodeFillBase = (n) => n.type==="dept"||n.type==="system"?"#f4f4f5":"#f5f3ff";
const nodeStrokeBase = (n) => n.type==="dept"||n.type==="system"?"#d4d4d8":"#c4b5fd";

function FilterChip({label,active,onClick}){return <button type="button" onClick={onClick} className={`px-2.5 py-1 text-[10px] font-medium rounded-full border transition-colors cursor-pointer ${active?"bg-violet-600 text-white border-violet-600":"bg-white text-gray-600 border-gray-200 hover:border-violet-300 hover:text-violet-700"}`}>{label}</button>;}

function initPos(nodes,w,h){const mods=nodes.filter(n=>n.depth===1);const cx=w/2,cy=h/2;nodes.forEach(n=>{n.vx=0;n.vy=0;});const d=nodes.find(n=>n.depth===0);if(d){d.x=cx;d.y=cy;}mods.forEach((m,i)=>{const a=(i/mods.length)*Math.PI*2-Math.PI/2;m.x=cx+Math.cos(a)*170;m.y=cy+Math.sin(a)*170;});nodes.filter(n=>n.depth===2).forEach(n=>{const p=nodes.find(pp=>pp.id===n.parent);if(!p){n.x=cx+(Math.random()-.5)*200;n.y=cy+(Math.random()-.5)*200;return;}const sibs=nodes.filter(s=>s.parent===n.parent&&s.depth===2);const idx=sibs.indexOf(n);const ba=Math.atan2(p.y-cy,p.x-cx);const spread=sibs.length>1?Math.PI*0.6:0;const a=ba-spread/2+(sibs.length>1?(idx/(sibs.length-1))*spread:0);n.x=p.x+Math.cos(a)*90;n.y=p.y+Math.sin(a)*90;});const kv=nodes.find(n=>n.id==="s-keyvault");const pd=nodes.find(n=>n.id==="s-pagerduty");if(kv){kv.x=cx+240;kv.y=cy-80;}if(pd){pd.x=cx+240;pd.y=cy+120;}}

function sim(nodes,edges,w,h){const a=0.2,rep=1800,sp=0.03,sl=100,ce=0.006,da=0.55;const m={};nodes.forEach(n=>{m[n.id]=n;});for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){const na=nodes[i],nb=nodes[j],dx=nb.x-na.x,dy=nb.y-na.y,d=Math.sqrt(dx*dx+dy*dy)||1;const f=rep/(d*d)*a,fx=(dx/d)*f,fy=(dy/d)*f;na.vx-=fx;na.vy-=fy;nb.vx+=fx;nb.vy+=fy;}edges.forEach(e=>{const s=m[e.from],t=m[e.to];if(!s||!t)return;const dx=t.x-s.x,dy=t.y-s.y,d=Math.sqrt(dx*dx+dy*dy)||1;const f=(d-sl)*sp*a,fx=(dx/d)*f,fy=(dy/d)*f;s.vx+=fx;s.vy+=fy;t.vx-=fx;t.vy-=fy;});nodes.forEach(n=>{if(n._d)return;n.vx+=(w/2-n.x)*ce*a;n.vy+=(h/2-n.y)*ce*a;n.vx*=da;n.vy*=da;n.x+=n.vx;n.y+=n.vy;n.x=Math.max(40,Math.min(w-40,n.x));n.y=Math.max(40,Math.min(h-40,n.y));});}

export default function KnowledgeGraphExplorer({embedded=false}={}){
  const svgRef=useRef(null),boxRef=useRef(null),animRef=useRef(null),nodesRef=useRef([]);
  const [dim,setDim]=useState({w:800,h:500});const [tick,setTick]=useState(0);
  const [hovered,setHovered]=useState(null);const [selected,setSelected]=useState(null);
  const [expanded,setExpanded]=useState(new Set());const [dragId,setDragId]=useState(null);
  const [tipPos,setTipPos]=useState({x:0,y:0});const [pan,setPan]=useState({x:0,y:0,s:1});
  const [panning,setPanning]=useState(false);const panRef=useRef({x:0,y:0,px:0,py:0});
  const [chatFocus,setChatFocus]=useState(null);const [chatResponse,setChatResponse]=useState("");const [chatInput,setChatInput]=useState("");
  // Chat threads (conversation history). Local-only mock state.
  const [threads,setThreads]=useState(SEED_THREADS);
  const [activeThread,setActiveThread]=useState(SEED_THREADS[0].id);
  const [historyOpen,setHistoryOpen]=useState(true);
  const [renamingThread,setRenamingThread]=useState(null);const [renameInput,setRenameInput]=useState("");
  const chatEndRef=useRef(null);
  const [reportingNode,setReportingNode]=useState(null);const [reportText,setReportText]=useState("");
  const [reported,setReported]=useState(new Map());
  const [fStatus,setFStatus]=useState("all");const [fContrib,setFContrib]=useState("all");const [fGaps,setFGaps]=useState("all");
  const hasActiveFilter=fStatus!=="all"||fContrib!=="all"||fGaps!=="all";
  const [resolvedGaps,setResolvedGaps]=useState(new Set());
  const [dismissedGaps,setDismissedGaps]=useState(new Set());

  const isGap=useCallback((id)=>{const nd=NODES.find(n=>n.id===id);return nd?.hasGap&&!resolvedGaps.has(id)&&!dismissedGaps.has(id);},[resolvedGaps,dismissedGaps]);
  const gapStatus=useCallback((id)=>{if(resolvedGaps.has(id))return"resolved";if(dismissedGaps.has(id))return"dismissed";return null;},[resolvedGaps,dismissedGaps]);
  /* Active gaps = yellow. Everything else (resolved, dismissed, normal) = standard purple. */
  const nodeFill=useCallback((n)=>isGap(n.id)?"#fef9c3":nodeFillBase(n),[isGap]);
  const nodeStroke=useCallback((n)=>isGap(n.id)?"#facc15":nodeStrokeBase(n),[isGap]);

  const {visNodes,visEdges}=useMemo(()=>{
    const show=new Set();NODES.filter(n=>n.depth<=1).forEach(n=>show.add(n.id));
    NODES.filter(n=>n.depth===2).forEach(n=>{if(n.type==="system"){if(expanded.size>0)show.add(n.id);return;}const p=NODES.find(pp=>pp.id===n.parent);if(p&&expanded.has(p.id))show.add(n.id);});
    if(chatFocus)chatFocus.forEach(id=>{show.add(id);const nd=NODES.find(nn=>nn.id===id);if(nd&&nd.parent){show.add(nd.parent);}});
    return{visNodes:NODES.filter(n=>show.has(n.id)),visEdges:EDGES.filter(e=>show.has(e.from)&&show.has(e.to))};
  },[expanded,chatFocus]);

  useEffect(()=>{const copies=visNodes.map(n=>{const o=nodesRef.current.find(x=>x.id===n.id);return{...n,x:o?.x??0,y:o?.y??0,vx:0,vy:0};});if(copies.some(n=>n.x===0&&n.y===0))initPos(copies,dim.w,dim.h);nodesRef.current=copies;let run=true;const step=()=>{if(!run)return;sim(nodesRef.current,visEdges,dim.w,dim.h);setTick(t=>t+1);animRef.current=requestAnimationFrame(step);};animRef.current=requestAnimationFrame(step);return()=>{run=false;cancelAnimationFrame(animRef.current);};},[visNodes,visEdges,dim]);
  useEffect(()=>{const el=boxRef.current;if(!el)return;const ro=new ResizeObserver(([e])=>{const{width,height}=e.contentRect;if(width>0)setDim({w:width,h:height});});ro.observe(el);return()=>ro.disconnect();},[]);
  useEffect(()=>{const params=new URLSearchParams(window.location.search);const prompt=params.get("prompt");if(!prompt)return;const cfg=PROMPTS[prompt];if(cfg){const mods=NODES.filter(n=>n.type==="module"&&cfg.filter(n)).map(n=>n.id);const entries=NODES.filter(n=>n.depth===2&&n.type==="entry"&&mods.includes(n.parent)).map(n=>n.id);const focus=[...mods,...entries];if(mods.length){setExpanded(new Set(mods));setChatFocus(focus);}setChatResponse(cfg.response);
    // Pre-fill the active chat thread with the from-session prompt + AI answer.
    const id="t-session";setThreads(prev=>[{id,title:cfg.input,ts:"now",messages:[{role:"user",text:cfg.input},{role:"ai",text:cfg.response,focus:focus.length?focus:null,chips:[{icon:"Eye",label:"Show the gaps",focus:entries.filter(e=>{const nd=NODES.find(n=>n.id===e);return nd?.hasGap;})},{icon:"Network",label:"Connected entries",focus:focus}]}]},...prev.filter(t=>t.id!==id)]);setActiveThread(id);}
    else{setChatResponse("Showing the full knowledge graph.");}window.history.replaceState({},"","/knowledge-graph");},[]);
  // Auto-scroll chat thread to bottom when messages change.
  useEffect(()=>{chatEndRef.current?.scrollIntoView({behavior:"smooth",block:"end"});},[threads,activeThread]);

  const onDown=useCallback((e,id)=>{e.stopPropagation();e.preventDefault();const n=nodesRef.current.find(x=>x.id===id);if(n){n._d=true;setDragId(id);}},[]);
  const onMove=useCallback((e)=>{if(dragId){const n=nodesRef.current.find(x=>x.id===dragId);if(n&&svgRef.current){const r=svgRef.current.getBoundingClientRect();n.x=(e.clientX-r.left-pan.x)/pan.s;n.y=(e.clientY-r.top-pan.y)/pan.s;n.vx=0;n.vy=0;setTick(t=>t+1);}}else if(panning){setPan(p=>({...p,x:panRef.current.px+e.clientX-panRef.current.x,y:panRef.current.py+e.clientY-panRef.current.y}));}if(hovered)setTipPos({x:e.clientX,y:e.clientY});},[dragId,panning,hovered,pan]);
  const onUp=useCallback(()=>{if(dragId){const n=nodesRef.current.find(x=>x.id===dragId);if(n)n._d=false;setDragId(null);}setPanning(false);},[dragId]);
  const onBgDown=useCallback((e)=>{if(e.target===svgRef.current||e.target.tagName==="rect"){setPanning(true);panRef.current={x:e.clientX,y:e.clientY,px:pan.x,py:pan.y};}},[pan]);
  const onWheel=useCallback((e)=>{e.preventDefault();const f=e.deltaY>0?0.93:1.07;setPan(p=>{const ns=Math.max(0.3,Math.min(3,p.s*f));const r=svgRef.current.getBoundingClientRect();const mx=e.clientX-r.left,my=e.clientY-r.top;return{s:ns,x:mx-(mx-p.x)*(ns/p.s),y:my-(my-p.y)*(ns/p.s)};});},[]);
  const onClickNode=useCallback((node)=>{if(node.type==="module"){setExpanded(prev=>{const n=new Set(prev);n.has(node.id)?n.delete(node.id):n.add(node.id);return n;});}setSelected(s=>s===node.id?null:node.id);setReportingNode(null);setReportText("");},[]);
  // Apply a focus array to the graph: expand parent modules + highlight nodes.
  const applyFocus=useCallback((focus)=>{if(!focus||!focus.length){return;}const mods=new Set();focus.forEach(id=>{const nd=NODES.find(n=>n.id===id);if(nd?.parent)mods.add(nd.parent);if(nd?.type==="module")mods.add(nd.id);});setExpanded(prev=>new Set([...prev,...mods]));setChatFocus(focus);},[]);
  // Append a user message + an AI reply to the active thread, and optionally focus the graph.
  const pushToThread=useCallback((userText,ai)=>{setThreads(prev=>prev.map(t=>t.id!==activeThread?t:{...t,messages:[...t.messages,{role:"user",text:userText},{role:"ai",text:ai.text,focus:ai.focus,chips:ai.chips}]}));if(ai.focus&&ai.focus.length){applyFocus(ai.focus);setChatResponse(ai.text);}},[activeThread,applyFocus]);
  // Recommendation chip inside the chat thread.
  const onRecoChip=useCallback((chip)=>{const ai={text:chip.response||`Highlighting ${chip.label.toLowerCase()} in the graph.`,focus:chip.focus,chips:chip.followups};pushToThread(chip.label,ai);},[pushToThread]);
  // Free-text send: match a canned CHIPS/PROMPTS response by keyword, else generic.
  const onSendChat=useCallback(()=>{const q=chatInput.trim();if(!q)return;const ql=q.toLowerCase();let match=CHIPS.find(c=>ql.includes(c.label.toLowerCase().split(" ")[0]));let ai;if(match){ai={text:match.response,focus:match.focus};}else{const node=NODES.find(n=>ql.includes(n.label.toLowerCase().slice(0,8)));if(node){const rel=NODES.filter(n=>n.parent===node.id).map(n=>n.id);ai={text:`${node.label}: ${(node.summary||"").split("\n")[0]}`,focus:rel.length?rel:[node.id]};}else{ai={text:"I searched the Engineering knowledge graph. Try asking about a specific module — Payment, Auth, Database, CI/CD — or about knowledge gaps and risks.",focus:null};}}pushToThread(q,ai);setChatInput("");},[chatInput,pushToThread]);
  // Create / select / rename threads.
  const onNewChat=useCallback(()=>{const id="t-"+Date.now();setThreads(prev=>[{id,title:"New chat",ts:"now",messages:[]},...prev]);setActiveThread(id);setChatFocus(null);setChatResponse("");},[]);
  const onRenameThread=(id)=>{const t=threads.find(x=>x.id===id);if(t&&renameInput.trim()){setThreads(prev=>prev.map(x=>x.id===id?{...x,title:renameInput.trim()}:x));}setRenamingThread(null);};
  const onAsk=(nodeId)=>{const nd=NODES.find(n=>n.id===nodeId);if(!nd)return;const q=nd.type==="module"?`What are the risks in ${nd.label}?`:`Tell me about ${nd.label}`;const rel=NODES.filter(n=>n.parent===nodeId).map(n=>n.id);let ai;if(rel.length>0){ai={text:`${nd.label} contains ${nd.entries||rel.length} entries. ${nd.gaps>0?`${nd.gaps} knowledge gap${nd.gaps>1?"s":""} need attention.`:""} ${nd.summary||""}`.trim(),focus:rel,chips:[{icon:"Network",label:"Connected entries",focus:rel},{icon:"Users",label:"Who contributed?",response:nd.provenance?nd.provenance.map(p=>`${p.name} (${p.count})`).join(", ")+".":"Contributor data unavailable."}]};}else{ai={text:nd.summary||"No additional details available.",focus:[nodeId],chips:[{icon:"Crosshair",label:"Zoom to node",focus:[nodeId]}]};}pushToThread(q,ai);};
  const onSubmitReport=(nodeId)=>{if(!nodeId)return;setReported(prev=>{const n=new Map(prev);n.set(nodeId,{text:reportText,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})});return n;});setReportingNode(null);setReportText("");};
  const onResolveGap=(id)=>setResolvedGaps(prev=>new Set([...prev,id]));
  const onDismissGap=(id)=>setDismissedGaps(prev=>new Set([...prev,id]));
  const clearAll=()=>{setExpanded(new Set());setPan({x:0,y:0,s:1});setSelected(null);setChatFocus(null);setChatResponse("");setChatInput("");setReportingNode(null);setReportText("");setFStatus("all");setFContrib("all");setFGaps("all");};

  const entryPasses=(nd)=>{if(fStatus!=="all"&&nd.status!==fStatus)return false;if(fGaps==="yes"&&!isGap(nd.id))return false;if(fContrib!=="all"){const par=NODES.find(p=>p.id===nd.parent);if(!par?.provenance)return false;if(fContrib==="minh-le"&&!par.provenance.some(p=>p.name.includes("Minh")))return false;if(fContrib==="thanh-duc"&&!par.provenance.some(p=>p.name.includes("Thanh")))return false;}return true;};
  const passesFilter=(id)=>{const nd=NODES.find(n=>n.id===id);if(!nd)return true;if(nd.type==="dept")return true;if(nd.type==="system")return !hasActiveFilter;if(nd.type==="module"){const kids=NODES.filter(c=>c.parent===nd.id&&c.depth===2);return kids.some(c=>entryPasses(c));}return entryPasses(nd);};
  const isHi=(id)=>{const nd=NODES.find(n=>n.id===id);if(nd?.type==="dept")return true;if(hasActiveFilter&&!passesFilter(id))return false;if(chatFocus)return chatFocus.includes(id);if(!selected)return true;if(id===selected)return true;return visEdges.some(e=>(e.from===selected&&e.to===id)||(e.to===selected&&e.from===id));};

  const nodes=nodesRef.current;const nm={};nodes.forEach(n=>{nm[n.id]=n;});
  const activeThreadData=threads.find(t=>t.id===activeThread)||threads[0];
  // Latest AI message in the active thread carries the contextual recommendation chips.
  const latestAi=activeThreadData?[...activeThreadData.messages].reverse().find(m=>m.role==="ai"):null;
  const selData=selected?NODES.find(n=>n.id===selected):null;
  const selEdges=selected?EDGES.filter(e=>e.from===selected||e.to===selected):[];
  const childEntries=selData?.type==="module"?NODES.filter(n=>n.parent===selData.id&&n.depth===2):[];
  const selGapStatus=selData?gapStatus(selData.id):null;
  const selIsGap=selData?isGap(selData.id):false;

  return(
    <div className={`${embedded?'px-5 py-4':'p-4'} flex flex-col h-full min-h-0`} style={{fontFamily:"'Inter',system-ui,sans-serif"}}>
      <div className="flex items-center justify-between mb-2 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center"><Sparkles className="w-4 h-4 text-white" strokeWidth={1.75}/></div>
          <div><h2 className="text-sm font-semibold text-gray-900 leading-tight">Knowledge Graph</h2>
          <p className="text-[11px] text-gray-500">{"Engineering \u00b7 "}{NODES.filter(n=>n.type==="module").length}{" modules \u00b7 "}{NODES.filter(n=>n.type==="entry").length}{" entries \u00b7 "}{EDGES.length}{" relationships"}</p></div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={()=>{setExpanded(new Set(NODES.filter(n=>n.type==="module").map(n=>n.id)));}} className="px-2.5 py-1 text-[11px] font-medium text-violet-700 bg-violet-50 rounded-md hover:bg-violet-100 transition-colors cursor-pointer">Expand all</button>
          <button onClick={clearAll} className="px-2.5 py-1 text-[11px] font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors cursor-pointer">Reset</button>
        </div>
      </div>
      {/* Filter control removed (\u00a78.1a) \u2014 the committed graph is browsed via chat + zoom, not status/contributor/gap filters. */}
      <div className="flex-1 min-h-0 flex gap-2">
        {/* 1. Chat history sidebar — collapsible */}
        {historyOpen?
          <div className="w-[124px] flex-shrink-0 bg-white border border-gray-200 rounded-lg flex flex-col overflow-hidden">
            <div className="px-2 py-2 border-b border-gray-100 flex items-center justify-between">
              <button onClick={onNewChat} className="flex items-center gap-1 text-[10px] font-medium text-violet-700 hover:text-violet-900 cursor-pointer"><Plus className="w-3 h-3"/>New chat</button>
              <button onClick={()=>setHistoryOpen(false)} title="Hide history" className="text-gray-400 hover:text-gray-600 cursor-pointer"><PanelLeftClose className="w-3.5 h-3.5"/></button>
            </div>
            <div className="flex-1 overflow-y-auto py-1">
              {threads.map(t=>{const isActive=t.id===activeThread;const isRen=renamingThread===t.id;return <div key={t.id} className={`group mx-1 mb-0.5 rounded-md px-2 py-1.5 cursor-pointer ${isActive?"bg-violet-50 border border-violet-200":"hover:bg-gray-50 border border-transparent"}`} onClick={()=>{if(!isRen){setActiveThread(t.id);setChatFocus(null);setChatResponse("");}}}>
                {isRen?
                  <input value={renameInput} autoFocus onClick={e=>e.stopPropagation()} onChange={e=>setRenameInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")onRenameThread(t.id);if(e.key==="Escape")setRenamingThread(null);}} onBlur={()=>onRenameThread(t.id)} className="w-full text-[10px] px-1 py-0.5 rounded border border-violet-300 focus:outline-none focus:ring-1 focus:ring-violet-500/30"/>
                  :<div className="flex items-start gap-1">
                    <div className="flex-1 min-w-0">
                      <p className={`text-[10px] leading-tight font-medium truncate ${isActive?"text-violet-800":"text-gray-700"}`}>{t.title}</p>
                      <p className="text-[9px] text-gray-400 font-mono mt-0.5">{t.ts}</p>
                    </div>
                    <button onClick={e=>{e.stopPropagation();setRenamingThread(t.id);setRenameInput(t.title);}} title="Rename" className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-violet-600 cursor-pointer shrink-0"><Pencil className="w-2.5 h-2.5"/></button>
                  </div>}
              </div>;})}
            </div>
          </div>
          :<button onClick={()=>setHistoryOpen(true)} title="Show history" className="w-8 flex-shrink-0 bg-white border border-gray-200 rounded-lg flex flex-col items-center justify-start pt-2 text-gray-400 hover:text-violet-600 cursor-pointer"><PanelLeftOpen className="w-4 h-4"/></button>
        }

        {/* 2. Active chat panel — always visible */}
        <div className="w-[220px] flex-shrink-0 bg-white border border-gray-200 rounded-lg flex flex-col overflow-hidden">
          <div className="px-3 py-2 border-b border-gray-100 flex items-center gap-1.5">
            <span className="flex items-center gap-1 px-1.5 py-0.5 bg-violet-50 rounded border border-violet-100 text-[9px] font-medium text-violet-700 shrink-0"><Sparkles className="w-2.5 h-2.5"/>AI</span>
            <p className="text-[11px] font-medium text-gray-800 truncate">{activeThreadData?.title||"New chat"}</p>
          </div>
          <div className="flex-1 overflow-y-auto px-2.5 py-2 space-y-2">
            {(!activeThreadData||activeThreadData.messages.length===0)&&<p className="text-[10px] text-gray-400 text-center mt-4">Ask about the knowledge graph to get started.</p>}
            {activeThreadData?.messages.map((m,mi)=>m.role==="user"
              ?<div key={mi} className="flex justify-end"><div className="max-w-[85%] bg-violet-600 text-white rounded-lg rounded-br-sm px-2.5 py-1.5 text-[10px] leading-snug">{m.text}</div></div>
              :<div key={mi} className="flex flex-col gap-1.5"><div className="max-w-[90%] bg-gray-100 text-gray-700 rounded-lg rounded-bl-sm px-2.5 py-1.5 text-[10px] leading-snug">{m.text}</div></div>
            )}
            {/* Dynamic recommendation chips below the latest AI message */}
            {latestAi?.chips?.length>0&&<div className="flex flex-wrap gap-1">{latestAi.chips.map((c,ci)=>{const Icon=RECO_ICONS[c.icon]||Sparkles;return <button key={ci} onClick={()=>onRecoChip(c)} className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-medium rounded-full border border-violet-200 bg-white text-violet-700 hover:bg-violet-50 cursor-pointer transition-colors"><Icon className="w-2.5 h-2.5"/>{c.label}</button>;})}</div>}
            <div ref={chatEndRef}/>
          </div>
          <div className="px-2 py-2 border-t border-gray-100 flex items-center gap-1.5">
            <input type="text" value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&onSendChat()} placeholder="Ask about the graph..." className="flex-1 min-w-0 px-2 py-1.5 text-[10px] border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-1 focus:ring-violet-500/20 focus:border-violet-300 text-gray-700 placeholder:text-gray-400"/>
            <button onClick={onSendChat} className="px-2 py-1.5 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition-colors cursor-pointer shrink-0"><Send className="w-3 h-3"/></button>
          </div>
        </div>

        {/* 3. Graph canvas — always primary, fills remaining space; drawer overlays it */}
        <div ref={boxRef} className="flex-1 min-w-0 bg-gray-50 rounded-lg border border-gray-200 relative overflow-hidden" style={{cursor:panning?'grabbing':dragId?'grabbing':'grab'}}>
          <svg ref={svgRef} width={dim.w} height={dim.h} className="w-full h-full" style={{touchAction:'none'}} onPointerMove={onMove} onPointerUp={onUp} onPointerDown={onBgDown} onWheel={onWheel}>
            <g transform={`translate(${pan.x},${pan.y}) scale(${pan.s})`}>
              {visEdges.map((e,i)=>{const s=nm[e.from],t=nm[e.to];if(!s||!t)return null;const sn=NODES.find(n=>n.id===e.from),tn=NODES.find(n=>n.id===e.to);const sr=nodeR(sn||{}),tr=nodeR(tn||{});const dx=t.x-s.x,dy=t.y-s.y,d=Math.sqrt(dx*dx+dy*dy)||1;const x1=s.x+(dx/d)*sr,y1=s.y+(dy/d)*sr,x2=t.x-(dx/d)*tr,y2=t.y-(dy/d)*tr;const hi=isHi(e.from)&&isHi(e.to);
                /* When a focus/selection is active, dim non-highlighted edges to ~20% instead of removing them. */
                const eOp=hi?0.4:(chatFocus||selected||hasActiveFilter)?0.08:0.4;return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={e.type==="cross"?"#c4b5fd":"#d4d4d8"} strokeWidth={e.type==="cross"?0.8:0.6} strokeDasharray={e.type==="cross"?"4,3":"none"} opacity={eOp} style={{transition:'opacity 0.15s'}}/>;
              })}
              {nodes.map(node=>{const r=nodeR(node),hi=isHi(node.id),isSel=selected===node.id,isHov=hovered===node.id,isMod=node.type==="module",isExp=expanded.has(node.id),isReported=reported.has(node.id);const nf=nodeFill(node);const ns=nodeStroke(node);
                /* Dim non-highlighted nodes to ~20% instead of removing them, so the graph stays whole. */
                const gOp=hi?1:(chatFocus||selected||hasActiveFilter)?0.2:1;
                return <g key={node.id} opacity={gOp} transform={`translate(${node.x||0},${node.y||0})`} style={{cursor:'pointer',transition:'opacity 0.15s'}} onPointerDown={e=>onDown(e,node.id)} onPointerEnter={e=>{setHovered(node.id);setTipPos({x:e.clientX,y:e.clientY});}} onPointerLeave={()=>setHovered(null)} onClick={()=>onClickNode(node)}>
                  {(isHov||isSel)&&<circle r={r+4} fill="none" stroke={ns} strokeWidth="1.5" opacity="0.3"/>}
                  <circle r={r} fill={nf} stroke={ns} strokeWidth={isSel?2:0.8}/>
                  {isMod&&<text textAnchor="middle" dominantBaseline="central" fontSize="10" fontWeight="500" fill="#6d28d9" style={{pointerEvents:'none'}}>{isExp?"\u2212":"+"}</text>}
                  {node.type==="dept"&&<text textAnchor="middle" dominantBaseline="central" fontSize="10" fontWeight="500" fill="#71717a" style={{pointerEvents:'none'}}>Eng</text>}
                  {isReported&&<g transform={`translate(${r-2},${-r+2})`}><circle r="5.5" fill="#fecaca" stroke="#f87171" strokeWidth="1"/><text textAnchor="middle" dominantBaseline="central" fontSize="7" fill="#991b1b" fontWeight="600">!</text></g>}
                  <text y={r+12} textAnchor="middle" fontSize={node.depth===0?11:node.depth===1?10:9} fontWeight={node.depth<=1?500:400} fill="#27272a" style={{pointerEvents:'none',userSelect:'none'}}>{node.label.length>20?node.label.slice(0,18)+"\u2026":node.label}</text>
                </g>;})}
            </g>
          </svg>
          {/* Focusing chip — top-left, clears chat focus */}
          {chatFocus&&chatFocus.length>0&&(()=>{const first=NODES.find(n=>n.id===chatFocus[0]);const par=first?.parent?NODES.find(n=>n.id===first.parent):null;const label=par?.label||first?.label||"selection";return <div className="absolute top-2 left-2 z-40 flex items-center gap-1.5 bg-violet-600 text-white rounded-full pl-2.5 pr-1.5 py-1 shadow-sm"><Crosshair className="w-3 h-3"/><span className="text-[10px] font-medium">Focusing: {label}</span><button onClick={()=>{setChatFocus(null);setChatResponse("");}} className="hover:bg-violet-700 rounded-full p-0.5 cursor-pointer"><X className="w-3 h-3"/></button></div>;})()}
          {hovered&&(()=>{const node=NODES.find(n=>n.id===hovered);if(!node)return null;const rect=boxRef.current?.getBoundingClientRect();if(!rect)return null;const tx=tipPos.x-rect.left+14,ty=tipPos.y-rect.top-8,flip=tx+240>rect.width;const nf=nodeFill(node);const ns=nodeStroke(node);const gs=gapStatus(node.id);
            return <div className="absolute pointer-events-none z-50" style={{left:flip?tx-254:tx,top:Math.max(4,Math.min(ty,rect.height-120))}}><div className="bg-white border border-gray-200 rounded-lg shadow-md p-2.5 w-[230px]" style={{borderLeft:`3px solid ${ns}`}}><div className="flex items-center gap-1.5 mb-1"><span className="text-[10px] font-medium px-1.5 py-0.5 rounded" style={{background:nf,border:`1px solid ${ns}`,color:isGap(node.id)?"#854d0e":node.type==="dept"||node.type==="system"?"#52525b":"#5b21b6"}}>{node.type==="dept"?"Department":node.type==="module"?"Module":node.type==="system"?"System":isGap(node.id)?"Entry (gap)":"Entry"}</span>{reported.has(node.id)&&!gs&&<span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">Reported</span>}</div><p className="text-xs font-medium text-gray-900 mb-0.5">{node.label}</p>{node.type==="module"&&<p className="text-[10px] text-gray-500">{node.entries}{" entries \u00b7 "}{node.verified}{" verified \u00b7 "}{node.draft}{" draft"}{node.gaps>0?` \u00b7 ${node.gaps} gaps`:""}</p>}{node.type==="entry"&&<p className="text-[10px] text-gray-500">{gs==="resolved"?"Verified":gs==="dismissed"?"Draft":node.status}{isGap(node.id)?" \u00b7 has gap":""}</p>}{node.type==="module"&&<p className="text-[10px] text-violet-600 mt-1">{"Click to "}{expanded.has(node.id)?"collapse":"expand"}</p>}</div></div>;})()}
          <div className="absolute bottom-2 left-2 flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded px-2 py-1"><span className="flex items-center gap-1 text-[9px] text-gray-400"><span className="w-2 h-2 rounded-full bg-gray-200 border border-gray-300 inline-block"></span>Structural</span><span className="flex items-center gap-1 text-[9px] text-gray-400"><span className="w-2 h-2 rounded-full bg-violet-100 border border-violet-300 inline-block"></span>Knowledge</span><span className="flex items-center gap-1 text-[9px] text-gray-400"><span className="w-2 h-2 rounded-full bg-rose-100 border border-rose-400 inline-block"></span>Reported</span><span className="text-[9px] text-gray-300">|</span><span className="text-[9px] text-gray-400">Solid = hierarchy</span><span className="text-[9px] text-gray-400">Dashed = cross-link</span></div>
        {/* 4. Node detail drawer — slides in as an overlay on the right, graph stays full underneath */}
        {selData&&<div className="absolute top-0 right-0 bottom-0 w-[440px] max-w-full bg-white border-l border-gray-200 shadow-xl overflow-y-auto z-30" style={{borderLeft:`3px solid ${reported.has(selData.id)&&!selGapStatus?"#f87171":nodeStroke(selData)}`}}><div className="p-3"><div className="flex items-start justify-between mb-2"><div><div className="flex items-center gap-1.5 mb-1"><span className="text-[10px] font-medium px-1.5 py-0.5 rounded" style={{background:nodeFill(selData),border:`1px solid ${nodeStroke(selData)}`,color:selIsGap?"#854d0e":"#5b21b6"}}>{selData.type==="dept"?"Department":selData.type==="module"?"Module":selData.type==="system"?"System":selIsGap?"Entry (gap)":"Entry"}</span>{reported.has(selData.id)&&!selGapStatus&&<span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">1 pending correction</span>}</div><h3 className="text-sm font-semibold text-gray-900">{selData.label}</h3></div><button onClick={()=>{setSelected(null);setReportingNode(null);setReportText("");}} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X className="w-4 h-4"/></button></div>
            {/* Status badges — resolved shows "Verified" (standard violet), dismissed shows "Draft" */}
            {selData.type==="entry"&&<div className="flex items-center gap-1.5 mb-2">{selGapStatus==="resolved"?<span className="text-[10px] px-1.5 py-0.5 rounded border bg-violet-50 text-violet-700 border-violet-200">Verified</span>:selGapStatus==="dismissed"?<span className="text-[10px] px-1.5 py-0.5 rounded border bg-gray-50 text-gray-600 border-gray-200">Draft</span>:<><span className={`text-[10px] px-1.5 py-0.5 rounded border ${selData.status==="verified"?"bg-violet-50 text-violet-700 border-violet-200":"bg-gray-50 text-gray-600 border-gray-200"}`}>{selData.status==="verified"?"Verified":"Draft"}</span>{selIsGap&&<span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-50 text-yellow-700 border border-yellow-200">Has gap</span>}</>}</div>}
            {/* GAP ACTION CARD — right after badges, before summary */}
            {selIsGap&&<div className="rounded-lg border border-yellow-200 bg-yellow-50/40 px-3 py-2.5 mb-3" style={{borderLeft:"2px solid rgb(234,179,8)",borderRadius:0}}><div className="flex items-start gap-2 mb-2"><AlertTriangle className="w-3.5 h-3.5 text-yellow-700 shrink-0 mt-0.5"/><p className="text-[11px] text-yellow-800">AI flagged this entry as a knowledge gap. Review and take action.</p></div><div className="flex items-center gap-2"><button onClick={()=>onResolveGap(selData.id)} className="h-7 px-3 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"><CheckCircle2 className="w-3 h-3"/>Mark as resolved</button><button onClick={()=>onDismissGap(selData.id)} className="h-7 px-3 rounded-md border border-gray-300 bg-white text-gray-600 text-[10px] font-medium inline-flex items-center gap-1.5 hover:bg-gray-50 transition-colors cursor-pointer"><XCircle className="w-3 h-3"/>Dismiss gap</button></div></div>}
            {/* Brief green confirmation — visible while this node is selected, then gone */}
            {selGapStatus==="resolved"&&<div className="rounded-md bg-emerald-50 border border-emerald-200 px-3 py-2 mb-3 flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5"/><p className="text-[11px] text-emerald-700">{"Gap resolved by H\u00e0 Vy \u00b7 entry is now verified."}</p></div>}
            {/* Module stats */}
            {selData.type==="module"&&<><div className="flex flex-wrap items-center gap-1.5 mb-2"><span className="text-[11px] text-gray-600">{selData.entries}{" entries"}</span><span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-50 text-violet-700 border border-violet-200">{selData.verified}{" verified"}</span><span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-50 text-gray-600 border border-gray-200">{selData.draft}{" draft"}</span>{selData.gaps>0&&<span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-50 text-yellow-700 border border-yellow-200">{selData.gaps}{" gaps"}</span>}</div>{selData.provenance?.map((p,i)=><p key={i} className="text-[10px] text-gray-400">{p.name}{" \u00b7 "}{p.date}{" \u00b7 "}{p.count}{" entries"}</p>)}</>}
            <p className="text-[11px] text-gray-600 whitespace-pre-wrap leading-relaxed mb-3">{selData.summary}</p>
            {reported.has(selData.id)&&!selGapStatus&&<div className="border-t border-gray-100 pt-2 mb-2"><p className="text-[10px] font-medium text-rose-600 uppercase tracking-wider mb-1.5">Pending correction</p><div className="rounded-md bg-rose-50/50 border-l-2 border-rose-300 px-3 py-2"><p className="text-[11px] text-gray-800 leading-relaxed">{reported.get(selData.id).text||"No correction provided \u2014 flagged as incorrect."}</p><p className="text-[9px] text-gray-400 mt-1">{"Reported by you \u00b7 "}{reported.get(selData.id).time}{" \u00b7 awaiting review by H\u00e0 Vy"}</p></div></div>}
            {childEntries.length>0&&<div className="border-t border-gray-100 pt-2 mb-2"><p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1.5">Entries</p>{childEntries.map(ce=>{const ceIsGap=isGap(ce.id);const ceGs=gapStatus(ce.id);return <button key={ce.id} onClick={()=>{setSelected(ce.id);setReportingNode(null);setReportText("");}} className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-50 text-left cursor-pointer transition-colors"><span className="w-2 h-2 rounded-full flex-shrink-0" style={{backgroundColor:reported.has(ce.id)&&!ceGs?"#f87171":ceIsGap?"#facc15":ceGs==="resolved"||ce.status==="verified"?"#a78bfa":"#d4d4d8"}}></span><span className="text-[11px] text-gray-800 flex-1 truncate">{ce.label}</span>{reported.has(ce.id)&&!ceGs?<span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-50 text-rose-600">Reported</span>:<span className={`text-[9px] px-1.5 py-0.5 rounded ${ceIsGap?"bg-yellow-50 text-yellow-600":ceGs==="resolved"||ce.status==="verified"?"bg-violet-50 text-violet-600":"bg-gray-50 text-gray-500"}`}>{ceIsGap?"Gap":ceGs==="resolved"||ce.status==="verified"?"Verified":"Draft"}</span>}</button>})}</div>}
            {selEdges.length>0&&<div className="border-t border-gray-100 pt-2 mb-2"><p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1.5">{"Cross-links ("}{selEdges.filter(e=>e.type==="cross").length}{")"}</p>{selEdges.filter(e=>e.type==="cross").map((e,i)=>{const oid=e.from===selData.id?e.to:e.from;const o=NODES.find(n=>n.id===oid);if(!o)return null;return <button key={i} onClick={()=>{setSelected(oid);if(o.parent)setExpanded(prev=>new Set([...prev,o.parent]));setReportingNode(null);setReportText("");}} className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-violet-50 text-left cursor-pointer transition-colors"><ChevronRight className="w-3 h-3 text-gray-400"/><span className="text-[11px] text-gray-800 flex-1">{o.label}</span>{e.label&&<span className="text-[9px] text-gray-400">{e.label}</span>}</button>;})}</div>}
            <div className="border-t border-gray-100 pt-2 flex flex-col gap-1.5">
              <button onClick={()=>onAsk(selData.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-violet-50 border border-violet-200 text-violet-700 text-[11px] font-medium hover:bg-violet-100 transition-colors cursor-pointer"><Sparkles className="w-3 h-3"/>{"Ask about this "}{selData.type}</button>
              {(selData.type==="module"||selData.type==="dept")&&<Link href={`/knowledge-graph/insights${selData.type==="module"?`?node=${selData.id}`:""}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-gray-200 text-gray-600 text-[11px] font-medium hover:bg-gray-50 hover:border-gray-300 transition-colors"><BarChart3 className="w-3 h-3"/>View insights</Link>}
              {selData.type==="entry"&&!reported.has(selData.id)&&!reportingNode&&!selGapStatus&&!selIsGap&&<button onClick={()=>setReportingNode(selData.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-gray-200 text-gray-600 text-[11px] font-medium hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer"><Flag className="w-3 h-3"/>Report an issue</button>}
            </div>
            {reportingNode===selData.id&&<div className="mt-2 rounded-lg bg-rose-50/50 border border-rose-200 p-3"><div className="flex items-center justify-between mb-2"><span className="text-[10px] font-medium text-rose-700 flex items-center gap-1"><Flag className="w-3 h-3"/>Report an issue</span><button onClick={()=>{setReportingNode(null);setReportText("");}} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X className="w-3 h-3"/></button></div><p className="text-[9px] text-gray-500 mb-1">Current content</p><div className="bg-gray-100 rounded-md px-2.5 py-2 text-[10px] text-gray-400 line-through leading-relaxed mb-2">{selData.summary}</div><p className="text-[9px] text-gray-500 mb-1">{"Your correction "}<span className="text-gray-400">(optional)</span></p><textarea value={reportText} onChange={e=>setReportText(e.target.value)} placeholder="What should it say instead?" className="w-full h-16 px-2.5 py-2 text-[11px] border border-emerald-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500/20 text-gray-700 placeholder:text-gray-400 resize-none"/><div className="flex justify-end mt-2"><button onClick={()=>onSubmitReport(selData.id)} className="px-3 py-1.5 rounded-md bg-white border border-rose-300 text-rose-700 text-[10px] font-medium hover:bg-rose-50 transition-colors cursor-pointer">Submit correction</button></div></div>}
          </div></div>}
        </div>
      </div>
    </div>
  );
}
