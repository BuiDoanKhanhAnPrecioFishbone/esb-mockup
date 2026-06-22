"use client";
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import { Send, Sparkles, X, ChevronRight, Flag, Filter, BarChart3 } from "lucide-react";

/* ART-EEP Consumer Plane — Knowledge Graph Explorer
   15 decisions + HITL report + filters + 0% hide on focus
   "View insights" button on module/dept nodes links to /knowledge-graph/insights */

const NODES = [
  { id:"eng", label:"Engineering", type:"dept", depth:0, summary:"Engineering department\n7 knowledge modules\n42 entries across 3 handovers" },
  { id:"payment", label:"Payment Processing", type:"module", depth:1, parent:"eng", entries:12, verified:9, draft:3, gaps:2, summary:"Covers Kafka pipeline, Stripe integration,\nwebhook verification, PCI compliance", provenance:[{name:"Minh L\u00ea",date:"Jun 2026",count:10},{name:"Thanh \u0110\u1ee9c",date:"Mar 2026",count:2}] },
  { id:"auth", label:"Auth & Identity", type:"module", depth:1, parent:"eng", entries:8, verified:5, draft:3, gaps:3, summary:"OAuth2 PKCE, Azure AD SSO,\nJWT rotation, RBAC matrix", provenance:[{name:"Minh L\u00ea",date:"Jun 2026",count:8}] },
  { id:"database", label:"Database & Migrations", type:"module", depth:1, parent:"eng", entries:9, verified:5, draft:4, gaps:4, summary:"Cosmos DB partitioning, Flyway pipeline,\nmanual migration procedures", provenance:[{name:"Minh L\u00ea",date:"Jun 2026",count:7},{name:"Thanh \u0110\u1ee9c",date:"Mar 2026",count:2}] },
  { id:"cicd", label:"CI/CD & Deployments", type:"module", depth:1, parent:"eng", entries:6, verified:4, draft:2, gaps:2, summary:"GitHub Actions, Helm charts,\nsecrets injection, rollback runbook", provenance:[{name:"Minh L\u00ea",date:"Jun 2026",count:6}] },
  { id:"monitor", label:"Monitoring", type:"module", depth:1, parent:"eng", entries:5, verified:5, draft:0, gaps:0, summary:"Grafana dashboards, PagerDuty alerts,\nSLA definitions, escalation paths", provenance:[{name:"Minh L\u00ea",date:"Jun 2026",count:3},{name:"Thanh \u0110\u1ee9c",date:"Mar 2026",count:2}] },
  { id:"ratelimit", label:"Rate Limiting & API", type:"module", depth:1, parent:"eng", entries:4, verified:3, draft:1, gaps:1, summary:"Token bucket, API versioning,\nsunset policy, tenant configuration", provenance:[{name:"Minh L\u00ea",date:"Jun 2026",count:4}] },
  { id:"infra", label:"Infrastructure as Code", type:"module", depth:1, parent:"eng", entries:3, verified:3, draft:0, gaps:0, summary:"Terraform modules, AKS cluster config,\nnetwork policies", provenance:[{name:"Thanh \u0110\u1ee9c",date:"Mar 2026",count:3}] },
  { id:"e-kafka", label:"Kafka Event Pipeline", type:"entry", depth:2, parent:"payment", status:"verified", summary:"Async payment processing via Kafka\nRetry: 3x exponential backoff then DLQ\nIdempotency: payment_id + timestamp hash\n1,840 tokens" },
  { id:"e-stripe-wh", label:"Stripe Webhook Verification", type:"entry", depth:2, parent:"payment", status:"verified", summary:"HMAC-SHA256 signature verification\nReplay protection: 5-min timestamp window\n680 tokens" },
  { id:"e-race", label:"Payment Retry Race Condition", type:"entry", depth:2, parent:"payment", status:"verified", summary:"P2 incident 2026-05-15, 23 customers\nRoot cause: missing distributed lock\n920 tokens" },
  { id:"e-pci", label:"PCI Compliance Scope", type:"entry", depth:2, parent:"payment", status:"draft", hasGap:true, summary:"Gap: card has title only, no description\nPCI compliance scope is critical knowledge\n0 tokens" },
  { id:"e-stripe-pin", label:"Stripe API Pinning", type:"entry", depth:2, parent:"payment", status:"draft", summary:"Pinned to 2024-12-18, never auto-upgrade\nSandbox then staging then prod\n520 tokens" },
  { id:"e-oauth", label:"OAuth2 PKCE Flow", type:"entry", depth:2, parent:"auth", status:"verified", summary:"Mobile clients via React Native\nS256 challenge, secure keychain storage\n7-day sliding refresh window\n1,420 tokens" },
  { id:"e-saml", label:"Azure AD SAML SSO", type:"entry", depth:2, parent:"auth", status:"verified", summary:"Enterprise SSO via SAML 2.0\nSP-initiated only, IdP blocked\nTenant metadata in Key Vault\n890 tokens" },
  { id:"e-jwt", label:"JWT Key Rotation", type:"entry", depth:2, parent:"auth", status:"draft", hasGap:true, summary:"RSA-256 via Key Vault auto-rotation\n90-day cycle, 7-day grace period\nGap: emergency procedure is tacit knowledge\n1,100 tokens" },
  { id:"e-rbac", label:"RBAC Permission Matrix", type:"entry", depth:2, parent:"auth", status:"draft", hasGap:true, summary:"4 roles x 12 permissions\nEntra ID group mapping\nGap: Q2 audit pending, content may be stale\n760 tokens" },
  { id:"e-cosmos", label:"Cosmos DB Partitioning", type:"entry", depth:2, parent:"database", status:"verified", summary:"Partition key: /orgId\nCross-partition queries blocked at SDK\nRU: 4,000/s autoscale to 8,000/s\n1,650 tokens" },
  { id:"e-migv8", label:"Migration v8 to v9", type:"entry", depth:2, parent:"database", status:"draft", hasGap:true, summary:"Manual ALTER TABLE on legacy SQL mirror\nCustomer DBA restricts DDL automation\nContradiction with Flyway card resolved\n540 tokens" },
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

const nodeR = (n) => n.type==="dept"?28:n.type==="module"?18:n.type==="system"?10:10;
const nodeFill = (n) => n.hasGap?"#fef9c3":n.type==="dept"||n.type==="system"?"#f4f4f5":"#f5f3ff";
const nodeStroke = (n) => n.hasGap?"#facc15":n.type==="dept"||n.type==="system"?"#d4d4d8":"#c4b5fd";

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
  const [reportingNode,setReportingNode]=useState(null);const [reportText,setReportText]=useState("");
  const [reported,setReported]=useState(new Map());
  const [fStatus,setFStatus]=useState("all");const [fContrib,setFContrib]=useState("all");const [fGaps,setFGaps]=useState("all");
  const hasActiveFilter=fStatus!=="all"||fContrib!=="all"||fGaps!=="all";

  const {visNodes,visEdges}=useMemo(()=>{
    const show=new Set();NODES.filter(n=>n.depth<=1).forEach(n=>show.add(n.id));
    NODES.filter(n=>n.depth===2).forEach(n=>{if(n.type==="system"){if(expanded.size>0)show.add(n.id);return;}const p=NODES.find(pp=>pp.id===n.parent);if(p&&expanded.has(p.id))show.add(n.id);});
    if(chatFocus)chatFocus.forEach(id=>{show.add(id);const nd=NODES.find(nn=>nn.id===id);if(nd&&nd.parent){show.add(nd.parent);}});
    return{visNodes:NODES.filter(n=>show.has(n.id)),visEdges:EDGES.filter(e=>show.has(e.from)&&show.has(e.to))};
  },[expanded,chatFocus]);

  useEffect(()=>{const copies=visNodes.map(n=>{const o=nodesRef.current.find(x=>x.id===n.id);return{...n,x:o?.x??0,y:o?.y??0,vx:0,vy:0};});if(copies.some(n=>n.x===0&&n.y===0))initPos(copies,dim.w,dim.h);nodesRef.current=copies;let run=true;const step=()=>{if(!run)return;sim(nodesRef.current,visEdges,dim.w,dim.h);setTick(t=>t+1);animRef.current=requestAnimationFrame(step);};animRef.current=requestAnimationFrame(step);return()=>{run=false;cancelAnimationFrame(animRef.current);};},[visNodes,visEdges,dim]);
  useEffect(()=>{const el=boxRef.current;if(!el)return;const ro=new ResizeObserver(([e])=>{const{width,height}=e.contentRect;if(width>0)setDim({w:width,h:height});});ro.observe(el);return()=>ro.disconnect();},[]);

  useEffect(()=>{
    const params=new URLSearchParams(window.location.search);const prompt=params.get("prompt");const cfg=prompt&&PROMPTS[prompt];
    if(cfg){const mods=NODES.filter(n=>n.type==="module"&&cfg.filter(n)).map(n=>n.id);const entries=NODES.filter(n=>n.depth===2&&n.type==="entry"&&mods.includes(n.parent)).map(n=>n.id);setExpanded(new Set(mods));setChatFocus([...mods,...entries]);setChatInput(cfg.input);setChatResponse(cfg.response);window.history.replaceState({},"","/knowledge-graph");}
  },[]);

  const onDown=useCallback((e,id)=>{e.stopPropagation();e.preventDefault();const n=nodesRef.current.find(x=>x.id===id);if(n){n._d=true;setDragId(id);}},[]);
  const onMove=useCallback((e)=>{if(dragId){const n=nodesRef.current.find(x=>x.id===dragId);if(n&&svgRef.current){const r=svgRef.current.getBoundingClientRect();n.x=(e.clientX-r.left-pan.x)/pan.s;n.y=(e.clientY-r.top-pan.y)/pan.s;n.vx=0;n.vy=0;setTick(t=>t+1);}}else if(panning){setPan(p=>({...p,x:panRef.current.px+e.clientX-panRef.current.x,y:panRef.current.py+e.clientY-panRef.current.y}));}if(hovered)setTipPos({x:e.clientX,y:e.clientY});},[dragId,panning,hovered,pan]);
  const onUp=useCallback(()=>{if(dragId){const n=nodesRef.current.find(x=>x.id===dragId);if(n)n._d=false;setDragId(null);}setPanning(false);},[dragId]);
  const onBgDown=useCallback((e)=>{if(e.target===svgRef.current||e.target.tagName==="rect"){setPanning(true);panRef.current={x:e.clientX,y:e.clientY,px:pan.x,py:pan.y};}},[pan]);
  const onWheel=useCallback((e)=>{e.preventDefault();const f=e.deltaY>0?0.93:1.07;setPan(p=>{const ns=Math.max(0.3,Math.min(3,p.s*f));const r=svgRef.current.getBoundingClientRect();const mx=e.clientX-r.left,my=e.clientY-r.top;return{s:ns,x:mx-(mx-p.x)*(ns/p.s),y:my-(my-p.y)*(ns/p.s)};});},[]);
  const onClickNode=useCallback((node)=>{if(node.type==="module"){setExpanded(prev=>{const n=new Set(prev);n.has(node.id)?n.delete(node.id):n.add(node.id);return n;});}setSelected(s=>s===node.id?null:node.id);setReportingNode(null);setReportText("");},[]);
  const onChip=useCallback((chip)=>{const mods=new Set();chip.focus.forEach(id=>{const nd=NODES.find(n=>n.id===id);if(nd?.parent){mods.add(nd.parent);}});setExpanded(prev=>new Set([...prev,...mods]));setChatFocus(chip.focus);setChatResponse(chip.response);setSelected(null);},[]);
  const onAsk=(nodeId)=>{const nd=NODES.find(n=>n.id===nodeId);if(!nd)return;const q=nd.type==="module"?`What are the risks in ${nd.label}?`:`Tell me about ${nd.label}`;setChatInput(q);const rel=NODES.filter(n=>n.parent===nodeId).map(n=>n.id);if(rel.length>0){setChatFocus(rel);setChatResponse(`${nd.label} contains ${nd.entries||rel.length} entries. ${nd.gaps>0?`${nd.gaps} knowledge gap${nd.gaps>1?"s":""} need attention.`:""} ${nd.summary||""}`);}else{setChatFocus([nodeId]);setChatResponse(nd.summary||"No additional details available.");}};
  const onSubmitReport=(nodeId)=>{if(!nodeId)return;setReported(prev=>{const n=new Map(prev);n.set(nodeId,{text:reportText,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})});return n;});setReportingNode(null);setReportText("");};
  const clearAll=()=>{setExpanded(new Set());setPan({x:0,y:0,s:1});setSelected(null);setChatFocus(null);setChatResponse("");setChatInput("");setReportingNode(null);setReportText("");setFStatus("all");setFContrib("all");setFGaps("all");};

  const entryPasses=(nd)=>{
    if(fStatus!=="all"&&nd.status!==fStatus)return false;
    if(fGaps==="yes"&&!nd.hasGap)return false;
    if(fContrib!=="all"){const par=NODES.find(p=>p.id===nd.parent);if(!par?.provenance)return false;if(fContrib==="minh-le"&&!par.provenance.some(p=>p.name.includes("Minh")))return false;if(fContrib==="thanh-duc"&&!par.provenance.some(p=>p.name.includes("Thanh")))return false;}
    return true;
  };
  const passesFilter=(id)=>{
    const nd=NODES.find(n=>n.id===id);if(!nd)return true;
    if(nd.type==="dept")return true;
    if(nd.type==="system")return !hasActiveFilter;
    if(nd.type==="module"){const kids=NODES.filter(c=>c.parent===nd.id&&c.depth===2);return kids.some(c=>entryPasses(c));}
    return entryPasses(nd);
  };
  const isHi=(id)=>{
    const nd=NODES.find(n=>n.id===id);
    if(nd?.type==="dept")return true;
    if(hasActiveFilter&&!passesFilter(id))return false;
    if(chatFocus)return chatFocus.includes(id);
    if(!selected)return true;
    if(id===selected)return true;
    return visEdges.some(e=>(e.from===selected&&e.to===id)||(e.to===selected&&e.from===id));
  };

  const nodes=nodesRef.current;const nm={};nodes.forEach(n=>{nm[n.id]=n;});
  const selData=selected?NODES.find(n=>n.id===selected):null;
  const selEdges=selected?EDGES.filter(e=>e.from===selected||e.to===selected):[];
  const childEntries=selData?.type==="module"?NODES.filter(n=>n.parent===selData.id&&n.depth===2):[];

  return(
    <div className={`${embedded?'':'p-4'} flex flex-col h-full min-h-0`} style={{fontFamily:"'Inter',system-ui,sans-serif"}}>
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
      <div className="flex items-center gap-3 mb-2 flex-shrink-0 relative z-10">
        <div className="flex items-center gap-1"><Filter className="w-3 h-3 text-gray-400"/><span className="text-[10px] text-gray-500 mr-1">Status</span><FilterChip label="All" active={fStatus==="all"} onClick={()=>setFStatus("all")}/><FilterChip label="Verified" active={fStatus==="verified"} onClick={()=>setFStatus("verified")}/><FilterChip label="Draft" active={fStatus==="draft"} onClick={()=>setFStatus("draft")}/></div>
        <span className="text-gray-200">|</span>
        <div className="flex items-center gap-1"><span className="text-[10px] text-gray-500 mr-1">Contributor</span><FilterChip label="All" active={fContrib==="all"} onClick={()=>setFContrib("all")}/><FilterChip label={"Minh L\u00ea"} active={fContrib==="minh-le"} onClick={()=>setFContrib("minh-le")}/><FilterChip label={"Thanh \u0110\u1ee9c"} active={fContrib==="thanh-duc"} onClick={()=>setFContrib("thanh-duc")}/></div>
        <span className="text-gray-200">|</span>
        <div className="flex items-center gap-1"><FilterChip label="Has gaps" active={fGaps==="yes"} onClick={()=>setFGaps(fGaps==="yes"?"all":"yes")}/></div>
        {hasActiveFilter&&<button type="button" onClick={()=>{setFStatus("all");setFContrib("all");setFGaps("all");}} className="text-[10px] text-violet-600 hover:text-violet-800 cursor-pointer ml-1">Clear filters</button>}
      </div>
      <div className="flex-1 min-h-0 flex gap-2">
        <div ref={boxRef} className={`${selected?'w-3/5':'w-full'} bg-gray-50 rounded-lg border border-gray-200 relative overflow-hidden transition-all duration-200`} style={{cursor:panning?'grabbing':dragId?'grabbing':'grab'}}>
          <svg ref={svgRef} width={dim.w} height={dim.h} className="w-full h-full" style={{touchAction:'none'}} onPointerMove={onMove} onPointerUp={onUp} onPointerDown={onBgDown} onWheel={onWheel}>
            <g transform={`translate(${pan.x},${pan.y}) scale(${pan.s})`}>
              {visEdges.map((e,i)=>{const s=nm[e.from],t=nm[e.to];if(!s||!t)return null;const sn=NODES.find(n=>n.id===e.from),tn=NODES.find(n=>n.id===e.to);const sr=nodeR(sn||{}),tr=nodeR(tn||{});const dx=t.x-s.x,dy=t.y-s.y,d=Math.sqrt(dx*dx+dy*dy)||1;const x1=s.x+(dx/d)*sr,y1=s.y+(dy/d)*sr,x2=t.x-(dx/d)*tr,y2=t.y-(dy/d)*tr;const hi=isHi(e.from)&&isHi(e.to);if(!hi)return null;return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={e.type==="cross"?"#c4b5fd":"#d4d4d8"} strokeWidth={e.type==="cross"?0.8:0.6} strokeDasharray={e.type==="cross"?"4,3":"none"} opacity={0.4} style={{transition:'opacity 0.15s'}}/>;
              })}
              {nodes.map(node=>{const r=nodeR(node),hi=isHi(node.id),isSel=selected===node.id,isHov=hovered===node.id,isMod=node.type==="module",isExp=expanded.has(node.id),isReported=reported.has(node.id);
                if(!hi)return null;
                return <g key={node.id} transform={`translate(${node.x||0},${node.y||0})`} style={{cursor:'pointer'}} onPointerDown={e=>onDown(e,node.id)} onPointerEnter={e=>{setHovered(node.id);setTipPos({x:e.clientX,y:e.clientY});}} onPointerLeave={()=>setHovered(null)} onClick={()=>onClickNode(node)}>
                  {(isHov||isSel)&&<circle r={r+4} fill="none" stroke={nodeStroke(node)} strokeWidth="1.5" opacity="0.3"/>}
                  <circle r={r} fill={nodeFill(node)} stroke={nodeStroke(node)} strokeWidth={isSel?2:0.8}/>
                  {isMod&&<text textAnchor="middle" dominantBaseline="central" fontSize="10" fontWeight="500" fill="#6d28d9" style={{pointerEvents:'none'}}>{isExp?"\u2212":"+"}</text>}
                  {node.type==="dept"&&<text textAnchor="middle" dominantBaseline="central" fontSize="10" fontWeight="500" fill="#71717a" style={{pointerEvents:'none'}}>Eng</text>}
                  {isReported&&<g transform={`translate(${r-2},${-r+2})`}><circle r="5.5" fill="#fecaca" stroke="#f87171" strokeWidth="1"/><text textAnchor="middle" dominantBaseline="central" fontSize="7" fill="#991b1b" fontWeight="600">!</text></g>}
                  <text y={r+12} textAnchor="middle" fontSize={node.depth===0?11:node.depth===1?10:9} fontWeight={node.depth<=1?500:400} fill="#27272a" style={{pointerEvents:'none',userSelect:'none'}}>{node.label.length>20?node.label.slice(0,18)+"\u2026":node.label}</text>
                </g>;})}
            </g>
          </svg>
          {hovered&&(()=>{const node=NODES.find(n=>n.id===hovered);if(!node)return null;const rect=boxRef.current?.getBoundingClientRect();if(!rect)return null;const tx=tipPos.x-rect.left+14,ty=tipPos.y-rect.top-8,flip=tx+240>rect.width;
            return <div className="absolute pointer-events-none z-50" style={{left:flip?tx-254:tx,top:Math.max(4,Math.min(ty,rect.height-120))}}><div className="bg-white border border-gray-200 rounded-lg shadow-md p-2.5 w-[230px]" style={{borderLeft:`3px solid ${nodeStroke(node)}`}}><div className="flex items-center gap-1.5 mb-1"><span className="text-[10px] font-medium px-1.5 py-0.5 rounded" style={{background:nodeFill(node),border:`1px solid ${nodeStroke(node)}`,color:node.hasGap?"#854d0e":node.type==="dept"||node.type==="system"?"#52525b":"#5b21b6"}}>{node.type==="dept"?"Department":node.type==="module"?"Module":node.type==="system"?"System":node.hasGap?"Entry (gap)":"Entry"}</span>{reported.has(node.id)&&<span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">Reported</span>}</div><p className="text-xs font-medium text-gray-900 mb-0.5">{node.label}</p>{node.type==="module"&&<p className="text-[10px] text-gray-500">{node.entries}{" entries \u00b7 "}{node.verified}{" verified \u00b7 "}{node.draft}{" draft"}{node.gaps>0?` \u00b7 ${node.gaps} gaps`:""}</p>}{node.type==="entry"&&<p className="text-[10px] text-gray-500">{node.status}{node.hasGap?" \u00b7 has gap":""}</p>}{node.type==="module"&&<p className="text-[10px] text-violet-600 mt-1">{"Click to "}{expanded.has(node.id)?"collapse":"expand"}</p>}</div></div>;})()}
          <div className="absolute bottom-2 left-2 flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded px-2 py-1"><span className="flex items-center gap-1 text-[9px] text-gray-400"><span className="w-2 h-2 rounded-full bg-gray-200 border border-gray-300 inline-block"></span>Structural</span><span className="flex items-center gap-1 text-[9px] text-gray-400"><span className="w-2 h-2 rounded-full bg-violet-100 border border-violet-300 inline-block"></span>Knowledge</span><span className="flex items-center gap-1 text-[9px] text-gray-400"><span className="w-2 h-2 rounded-full bg-yellow-100 border border-yellow-400 inline-block"></span>Gap</span><span className="flex items-center gap-1 text-[9px] text-gray-400"><span className="w-2 h-2 rounded-full bg-rose-100 border border-rose-400 inline-block"></span>Reported</span><span className="text-[9px] text-gray-300">|</span><span className="text-[9px] text-gray-400">Solid = hierarchy</span><span className="text-[9px] text-gray-400">Dashed = cross-link</span></div>
        </div>
        {selData&&<div className="w-2/5 bg-white border border-gray-200 rounded-lg overflow-y-auto" style={{borderLeft:`3px solid ${reported.has(selData.id)?"#f87171":nodeStroke(selData)}`}}><div className="p-3"><div className="flex items-start justify-between mb-2"><div><div className="flex items-center gap-1.5 mb-1"><span className="text-[10px] font-medium px-1.5 py-0.5 rounded" style={{background:nodeFill(selData),border:`1px solid ${nodeStroke(selData)}`,color:selData.hasGap?"#854d0e":selData.type==="dept"||selData.type==="system"?"#52525b":"#5b21b6"}}>{selData.type==="dept"?"Department":selData.type==="module"?"Module":selData.type==="system"?"System":selData.hasGap?"Entry (gap)":"Entry"}</span>{reported.has(selData.id)&&<span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">1 pending correction</span>}</div><h3 className="text-sm font-semibold text-gray-900">{selData.label}</h3></div><button onClick={()=>{setSelected(null);setReportingNode(null);setReportText("");}} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X className="w-4 h-4"/></button></div>
            {selData.type==="module"&&<><div className="flex flex-wrap items-center gap-1.5 mb-2"><span className="text-[11px] text-gray-600">{selData.entries}{" entries"}</span><span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-50 text-violet-700 border border-violet-200">{selData.verified}{" verified"}</span><span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-50 text-gray-600 border border-gray-200">{selData.draft}{" draft"}</span>{selData.gaps>0&&<span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-50 text-yellow-700 border border-yellow-200">{selData.gaps}{" gaps"}</span>}</div>{selData.provenance?.map((p,i)=><p key={i} className="text-[10px] text-gray-400">{p.name}{" \u00b7 "}{p.date}{" \u00b7 "}{p.count}{" entries"}</p>)}</>}
            {selData.type==="entry"&&<div className="flex items-center gap-1.5 mb-2"><span className={`text-[10px] px-1.5 py-0.5 rounded border ${selData.status==="verified"?"bg-violet-50 text-violet-700 border-violet-200":"bg-gray-50 text-gray-600 border-gray-200"}`}>{selData.status==="verified"?"Verified":"Draft"}</span>{selData.hasGap&&<span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-50 text-yellow-700 border border-yellow-200">Has gap</span>}</div>}
            <p className="text-[11px] text-gray-600 whitespace-pre-wrap leading-relaxed mb-3">{selData.summary}</p>
            {reported.has(selData.id)&&<div className="border-t border-gray-100 pt-2 mb-2"><p className="text-[10px] font-medium text-rose-600 uppercase tracking-wider mb-1.5">Pending correction</p><div className="rounded-md bg-rose-50/50 border-l-2 border-rose-300 px-3 py-2"><p className="text-[11px] text-gray-800 leading-relaxed">{reported.get(selData.id).text||"No correction provided \u2014 flagged as incorrect."}</p><p className="text-[9px] text-gray-400 mt-1">{"Reported by you \u00b7 "}{reported.get(selData.id).time}{" \u00b7 awaiting review by H\u00e0 Vy"}</p></div></div>}
            {childEntries.length>0&&<div className="border-t border-gray-100 pt-2 mb-2"><p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1.5">Entries</p>{childEntries.map(ce=><button key={ce.id} onClick={()=>{setSelected(ce.id);setReportingNode(null);setReportText("");}} className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-50 text-left cursor-pointer transition-colors"><span className="w-2 h-2 rounded-full flex-shrink-0" style={{backgroundColor:reported.has(ce.id)?"#f87171":ce.hasGap?"#facc15":ce.status==="verified"?"#a78bfa":"#d4d4d8"}}></span><span className="text-[11px] text-gray-800 flex-1 truncate">{ce.label}</span>{reported.has(ce.id)?<span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-50 text-rose-600">Reported</span>:<span className={`text-[9px] px-1.5 py-0.5 rounded ${ce.status==="verified"?"bg-violet-50 text-violet-600":"bg-gray-50 text-gray-500"}`}>{ce.status==="verified"?"Verified":"Draft"}</span>}</button>)}</div>}
            {selEdges.length>0&&<div className="border-t border-gray-100 pt-2 mb-2"><p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1.5">{"Cross-links ("}{selEdges.filter(e=>e.type==="cross").length}{")"}</p>{selEdges.filter(e=>e.type==="cross").map((e,i)=>{const oid=e.from===selData.id?e.to:e.from;const o=NODES.find(n=>n.id===oid);if(!o)return null;return <button key={i} onClick={()=>{setSelected(oid);if(o.parent)setExpanded(prev=>new Set([...prev,o.parent]));setReportingNode(null);setReportText("");}} className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-violet-50 text-left cursor-pointer transition-colors"><ChevronRight className="w-3 h-3 text-gray-400"/><span className="text-[11px] text-gray-800 flex-1">{o.label}</span>{e.label&&<span className="text-[9px] text-gray-400">{e.label}</span>}</button>;})}</div>}
            <div className="border-t border-gray-100 pt-2 flex flex-col gap-1.5">
              <button onClick={()=>onAsk(selData.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-violet-50 border border-violet-200 text-violet-700 text-[11px] font-medium hover:bg-violet-100 transition-colors cursor-pointer"><Sparkles className="w-3 h-3"/>{"Ask about this "}{selData.type}</button>
              {(selData.type==="module"||selData.type==="dept")&&<Link href={`/knowledge-graph/insights${selData.type==="module"?`?node=${selData.id}`:""}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-gray-200 text-gray-600 text-[11px] font-medium hover:bg-gray-50 hover:border-gray-300 transition-colors"><BarChart3 className="w-3 h-3"/>View insights</Link>}
              {selData.type==="entry"&&!reported.has(selData.id)&&!reportingNode&&<button onClick={()=>setReportingNode(selData.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-gray-200 text-gray-600 text-[11px] font-medium hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer"><Flag className="w-3 h-3"/>Report an issue</button>}
            </div>
            {reportingNode===selData.id&&<div className="mt-2 rounded-lg bg-rose-50/50 border border-rose-200 p-3"><div className="flex items-center justify-between mb-2"><span className="text-[10px] font-medium text-rose-700 flex items-center gap-1"><Flag className="w-3 h-3"/>Report an issue</span><button onClick={()=>{setReportingNode(null);setReportText("");}} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X className="w-3 h-3"/></button></div><p className="text-[9px] text-gray-500 mb-1">Current content</p><div className="bg-gray-100 rounded-md px-2.5 py-2 text-[10px] text-gray-400 line-through leading-relaxed mb-2">{selData.summary}</div><p className="text-[9px] text-gray-500 mb-1">{"Your correction "}<span className="text-gray-400">(optional)</span></p><textarea value={reportText} onChange={e=>setReportText(e.target.value)} placeholder="What should it say instead?" className="w-full h-16 px-2.5 py-2 text-[11px] border border-emerald-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500/20 text-gray-700 placeholder:text-gray-400 resize-none"/><div className="flex justify-end mt-2"><button onClick={()=>onSubmitReport(selData.id)} className="px-3 py-1.5 rounded-md bg-white border border-rose-300 text-rose-700 text-[10px] font-medium hover:bg-rose-50 transition-colors cursor-pointer">Submit correction</button></div></div>}
          </div></div>}
      </div>
      <div className="mt-2 flex-shrink-0 bg-white border border-gray-200 rounded-lg px-3 py-2">
        {chatResponse&&<div className="mb-2 bg-violet-50 border border-violet-100 rounded-md px-3 py-2"><p className="text-[11px] text-violet-800 leading-relaxed">{chatResponse}</p><button onClick={()=>{setChatFocus(null);setChatResponse("");}} className="text-[10px] text-violet-500 hover:text-violet-700 mt-1 cursor-pointer">Clear</button></div>}
        <div className="flex items-center gap-1.5 mb-1.5"><span className="flex items-center gap-1 px-2 py-0.5 bg-violet-50 rounded border border-violet-100 text-[10px] font-medium text-violet-700"><Sparkles className="w-2.5 h-2.5"/>AI Copilot</span>{CHIPS.map((c,i)=><button key={i} onClick={()=>onChip(c)} className={`px-2 py-0.5 text-[10px] font-medium rounded-full border transition-colors cursor-pointer ${chatFocus&&chatResponse===c.response?"bg-violet-600 text-white border-violet-600":"bg-white text-gray-600 border-gray-200 hover:border-violet-300 hover:text-violet-700"}`}>{c.label}</button>)}</div>
        <div className="flex items-center gap-2"><input type="text" value={chatInput} onChange={e=>setChatInput(e.target.value)} placeholder="Ask about the knowledge graph..." className="flex-1 px-2.5 py-1.5 text-[11px] border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-1 focus:ring-violet-500/20 focus:border-violet-300 text-gray-700 placeholder:text-gray-400"/><button className="px-3 py-1.5 bg-violet-600 text-white rounded-md text-[11px] font-medium hover:bg-violet-700 transition-colors cursor-pointer flex items-center gap-1"><Send className="w-3 h-3"/>Send</button></div>
      </div>
    </div>
  );
}
