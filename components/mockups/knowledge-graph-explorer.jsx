"use client";
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import { Send, Sparkles, X, ChevronRight, ChevronDown, Flag, BarChart3, CheckCircle2, XCircle, AlertTriangle, Pencil, Check, Plus, PanelLeftClose, PanelLeftOpen, Eye, Network, Users, Crosshair, Search, Clock } from "lucide-react";
import { KG_NODES as NODES, KG_EDGES as EDGES, KG_CHIPS as CHIPS, KG_PROMPTS as PROMPTS, KG_SEED_THREADS as SEED_THREADS, KG_REPORTED } from "@/lib/data";

/* ART-EEP Consumer Plane — Knowledge Graph Explorer
   Post-commit view: shows only committed entries, which are NEVER gaps (§8.1c).
   Every node is purple (knowledge) or gray (structural) — no yellow gap nodes, no Filter control.
   Gaps live inside active sessions only, not in the committed graph. */

/* Recommendation chips: each has an icon, a label, and either a focus array (graph highlight)
   and/or a canned AI response. The chatbot never creates new nodes — focus only highlights existing ones. */
const RECO_ICONS = { Eye, Network, Users, Crosshair, Search, Sparkles };

/* §10 — interactive node references in AI chat.
   Match node LABELS in plain message text, longest-first to avoid partial overlaps.
   Brackets [like this] around a label are stripped and still linked. */
const REF_LABELS = NODES.map(n=>({id:n.id,label:n.label})).sort((a,b)=>b.label.length-a.label.length);
const escapeRe = (s)=>s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
/* One regex: optional [ ], then any node label (alternation, longest-first), optional ]. */
const REF_RE = new RegExp("\\[?(?:"+REF_LABELS.map(r=>escapeRe(r.label)).join("|")+")\\]?","g");
const labelToId = (() => { const m={}; NODES.forEach(n=>{m[n.label.toLowerCase()]=n.id;}); return m; })();
/* Split a message into plain strings + {id,label} reference tokens. */
function splitRefs(text){
  if(!text) return [{plain:text||""}];
  const out=[]; let last=0; REF_RE.lastIndex=0; let mm;
  while((mm=REF_RE.exec(text))!==null){
    const raw=mm[0]; const core=raw.replace(/^\[/,"").replace(/\]$/,"");
    const id=labelToId[core.toLowerCase()];
    if(!id){continue;} // not a real node label — leave as plain (the alternation only matches labels, but guard anyway)
    if(mm.index>last) out.push({plain:text.slice(last,mm.index)});
    out.push({id,label:core});
    last=mm.index+raw.length;
  }
  if(last<text.length) out.push({plain:text.slice(last)});
  return out.length?out:[{plain:text}];
}
const REF_STYLE={color:"#5b21b6",background:"#f5f3ff",textDecoration:"underline",textDecorationColor:"#c4b5fd",textUnderlineOffset:"2px",borderRadius:"3px",padding:"1px 3px",cursor:"pointer"};
/* Renders AI message text with inline, hoverable/clickable node references. */
function NodeRefText({text,onRefHover,onRefLeave,onRefClick}){
  const parts=splitRefs(text);
  return <>{parts.map((p,i)=>p.plain!==undefined
    ? <React.Fragment key={i}>{p.plain}</React.Fragment>
    : <span key={i} style={REF_STYLE} className="inline" onMouseEnter={()=>onRefHover(p.id)} onMouseLeave={onRefLeave} onClick={()=>onRefClick(p.id)}>{p.label}</span>
  )}</>;
}

const nodeR = (n) => n.type==="dept"?16:n.type==="module"?12:n.type==="chunk"?6:n.type==="system"?10:9;

/* GV-01 — ambient drift. A stable per-node phase + period (seeded by index, NOT Math.random per frame)
   gives each node a gentle ±3px sinusoidal wander on a 10–20s cycle, out of sync with its neighbours.
   `t` is wall-clock ms; the index seeds both the phase and the (10–20s) period so motion is smooth. */
const NODE_INDEX = (() => { const m={}; NODES.forEach((n,i)=>{m[n.id]=i;}); return m; })();
const AMBIENT_AMP = 1.6; // px — KG-13: barely-there drift once settled
function ambientDrift(id, t){
  const i = NODE_INDEX[id] ?? 0;
  const px = 10000 + (i % 7) * 1600;          // X period: 10.0s–19.6s
  const py = 13000 + ((i*3) % 9) * 900;       // Y period: 13.0s–20.2s (different cadence)
  const phx = i * 1.7, phy = i * 2.3 + 0.9;   // distinct phases so nodes don't sync
  return {
    dx: Math.sin((t/px) * Math.PI*2 + phx) * AMBIENT_AMP,
    dy: Math.cos((t/py) * Math.PI*2 + phy) * AMBIENT_AMP,
  };
}
/* Both resolved and dismissed return to normal purple. Only active gaps are yellow. */
const nodeFillBase = (n) => n.type==="dept"||n.type==="system"?"#f4f4f5":n.type==="chunk"?"#a78bfa":"#f5f3ff";
const nodeStrokeBase = (n) => n.type==="dept"||n.type==="system"?"#d4d4d8":n.type==="chunk"?"#a78bfa":"#c4b5fd";

function initPos(nodes,w,h){const mods=nodes.filter(n=>n.depth===1);const cx=w/2,cy=h/2;nodes.forEach(n=>{n.vx=0;n.vy=0;});const d=nodes.find(n=>n.depth===0);if(d){d.x=cx;d.y=cy;}mods.forEach((m,i)=>{const a=(i/mods.length)*Math.PI*2-Math.PI/2;m.x=cx+Math.cos(a)*170;m.y=cy+Math.sin(a)*170;});nodes.filter(n=>n.depth===2).forEach(n=>{const p=nodes.find(pp=>pp.id===n.parent);if(!p){n.x=cx+(Math.random()-.5)*200;n.y=cy+(Math.random()-.5)*200;return;}const sibs=nodes.filter(s=>s.parent===n.parent&&s.depth===2);const idx=sibs.indexOf(n);const ba=Math.atan2(p.y-cy,p.x-cx);const spread=sibs.length>1?Math.PI*0.6:0;const a=ba-spread/2+(sibs.length>1?(idx/(sibs.length-1))*spread:0);n.x=p.x+Math.cos(a)*90;n.y=p.y+Math.sin(a)*90;});nodes.filter(n=>n.depth===3).forEach(n=>{const p=nodes.find(pp=>pp.id===n.parent);if(!p){n.x=cx;n.y=cy;return;}const sibs=nodes.filter(s=>s.parent===n.parent&&s.depth===3);const idx=sibs.indexOf(n);const ba=Math.atan2(p.y-cy,p.x-cx);const spread=sibs.length>1?Math.PI*0.5:0;const a=ba-spread/2+(sibs.length>1?(idx/(sibs.length-1))*spread:0);n.x=p.x+Math.cos(a)*48;n.y=p.y+Math.sin(a)*48;});const kv=nodes.find(n=>n.id==="s-keyvault");const pd=nodes.find(n=>n.id==="s-pagerduty");if(kv){kv.x=cx+240;kv.y=cy-80;}if(pd){pd.x=cx+240;pd.y=cy+120;}}

function sim(nodes,edges,w,h,alpha){const a=0.1*alpha,rep=1500,sp=0.016,sl=100,ce=0.006,da=0.4;const m={}; /* KG-13 — alpha-decayed forces + heavier friction (velocityDecay 0.6): nodes settle in ~1s, then only gently drift. */nodes.forEach(n=>{m[n.id]=n;});for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){const na=nodes[i],nb=nodes[j],dx=nb.x-na.x,dy=nb.y-na.y,d=Math.sqrt(dx*dx+dy*dy)||1;const f=rep/(d*d)*a,fx=(dx/d)*f,fy=(dy/d)*f;na.vx-=fx;na.vy-=fy;nb.vx+=fx;nb.vy+=fy;}edges.forEach(e=>{const s=m[e.from],t=m[e.to];if(!s||!t)return;const dx=t.x-s.x,dy=t.y-s.y,d=Math.sqrt(dx*dx+dy*dy)||1;const f=(d-sl)*sp*a,fx=(dx/d)*f,fy=(dy/d)*f;s.vx+=fx;s.vy+=fy;t.vx-=fx;t.vy-=fy;});nodes.forEach(n=>{if(n._d)return;n.vx+=(w/2-n.x)*ce*a;n.vy+=(h/2-n.y)*ce*a;n.vx*=da;n.vy*=da;n.x+=n.vx;n.y+=n.vy;n.x=Math.max(40,Math.min(w-40,n.x));n.y=Math.max(40,Math.min(h-40,n.y));});}

// KI-04 — offboarders whose handover has produced (or is producing) a graph. Only a committed
// session has nodes; an in-progress one is selectable but resolves to an empty canvas.
const EMPLOYEES=[
  {id:"minh-le",name:"Minh Lê",role:"Senior Backend Engineer",status:"complete"},
  {id:"phuong-anh",name:"Phương Anh Nguyễn",role:"Account Executive",status:"in-progress"},
];

export default function KnowledgeGraphExplorer({embedded=false}={}){
  const svgRef=useRef(null),boxRef=useRef(null),animRef=useRef(null),nodesRef=useRef([]),alphaRef=useRef(1);
  // KI-04 — which offboarder's graph is being explored.
  const [employeeId,setEmployeeId]=useState("minh-le");const [empOpen,setEmpOpen]=useState(false);
  const [dim,setDim]=useState({w:800,h:500});const [tick,setTick]=useState(0);
  const [hovered,setHovered]=useState(null);const [selected,setSelected]=useState(null);
  const [expanded,setExpanded]=useState(new Set());const [dragId,setDragId]=useState(null);
  const [tipPos,setTipPos]=useState({x:0,y:0});const [pan,setPan]=useState({x:0,y:0,s:1});
  const [panning,setPanning]=useState(false);const panRef=useRef({x:0,y:0,px:0,py:0});
  const [chatFocus,setChatFocus]=useState(null);const [chatResponse,setChatResponse]=useState("");const [chatInput,setChatInput]=useState("");
  // §10 — transient hover-highlight of a single node from a chat reference. Prefer this over chatFocus when set.
  const [refHover,setRefHover]=useState(null);
  // Chat threads (conversation history). Local-only mock state.
  const [threads,setThreads]=useState(SEED_THREADS);
  const [activeThread,setActiveThread]=useState(SEED_THREADS[0].id);
  const [historyOpen,setHistoryOpen]=useState(true);
  const [renamingThread,setRenamingThread]=useState(null);const [renameInput,setRenameInput]=useState("");
  const chatEndRef=useRef(null);
  const [reportingNode,setReportingNode]=useState(null);const [reportText,setReportText]=useState("");
  /* MV-01 — "Flagged" === "Reported": entries reported via the issue flow render rose and await Manager review.
     Seed 2 nodes as already flagged so the rose state is visible on load. */
  const [reported,setReported]=useState(()=>new Map(KG_REPORTED.map(r=>[r.id,{text:r.text,time:r.time,seeded:true}])));
  const [fStatus,setFStatus]=useState("all");const [fContrib,setFContrib]=useState("all");const [fGaps,setFGaps]=useState("all");
  const hasActiveFilter=fStatus!=="all"||fContrib!=="all"||fGaps!=="all";
  const [resolvedGaps,setResolvedGaps]=useState(new Set());
  const [dismissedGaps,setDismissedGaps]=useState(new Set());

  const isGap=useCallback((id)=>{const nd=NODES.find(n=>n.id===id);return nd?.hasGap&&!resolvedGaps.has(id)&&!dismissedGaps.has(id);},[resolvedGaps,dismissedGaps]);
  const gapStatus=useCallback((id)=>{if(resolvedGaps.has(id))return"resolved";if(dismissedGaps.has(id))return"dismissed";return null;},[resolvedGaps,dismissedGaps]);
  /* MV-01 — a node is "Flagged" iff it has an open report (reported via the issue flow, pending Manager review). */
  const isFlagged=useCallback((id)=>reported.has(id),[reported]);
  /* Flagged entries = rose. Everything else (verified, structural) = standard purple/gray. */
  const nodeFill=useCallback((n)=>isFlagged(n.id)?"#fff1f2":nodeFillBase(n),[isFlagged]);
  const nodeStroke=useCallback((n)=>isFlagged(n.id)?"#fda4af":nodeStrokeBase(n),[isFlagged]);

  const {visNodes,visEdges}=useMemo(()=>{
    const show=new Set();NODES.filter(n=>n.depth<=1).forEach(n=>show.add(n.id));
    NODES.filter(n=>n.depth===2).forEach(n=>{if(n.type==="system"){if(expanded.size>0)show.add(n.id);return;}const p=NODES.find(pp=>pp.id===n.parent);if(p&&expanded.has(p.id))show.add(n.id);});
    NODES.filter(n=>n.depth===3).forEach(n=>{if(expanded.has(n.parent))show.add(n.id);}); // KG-14 — chunks appear when their parent card is expanded
    const reveal=(id)=>{show.add(id);const nd=NODES.find(nn=>nn.id===id);if(nd&&nd.parent){show.add(nd.parent);const gp=NODES.find(g=>g.id===nd.parent);if(gp&&gp.parent)show.add(gp.parent);}};
    if(chatFocus)chatFocus.forEach(reveal);
    // Make a hovered chat-reference node (and its ancestors) visible so its glow can render even if collapsed.
    if(refHover)reveal(refHover);
    return{visNodes:NODES.filter(n=>show.has(n.id)),visEdges:EDGES.filter(e=>show.has(e.from)&&show.has(e.to))};
  },[expanded,chatFocus,refHover]);

  useEffect(()=>{const copies=visNodes.map(n=>{const o=nodesRef.current.find(x=>x.id===n.id);return{...n,x:o?.x??0,y:o?.y??0,vx:0,vy:0};});if(copies.some(n=>n.x===0&&n.y===0))initPos(copies,dim.w,dim.h);nodesRef.current=copies;alphaRef.current=1;let run=true;const step=()=>{if(!run)return;alphaRef.current=Math.max(0.02,alphaRef.current*0.94);sim(nodesRef.current,visEdges,dim.w,dim.h,alphaRef.current);setTick(t=>t+1);animRef.current=requestAnimationFrame(step);};animRef.current=requestAnimationFrame(step);return()=>{run=false;cancelAnimationFrame(animRef.current);};},[visNodes,visEdges,dim]);
  useEffect(()=>{const el=boxRef.current;if(!el)return;const ro=new ResizeObserver(([e])=>{const{width,height}=e.contentRect;if(width>0)setDim({w:width,h:height});});ro.observe(el);return()=>ro.disconnect();},[]);
  // Non-passive wheel listener: zoom the graph and block the browser's own zoom/scroll (incl. ctrl+wheel / trackpad pinch).
  useEffect(()=>{const el=boxRef.current;if(!el)return;const handler=(e)=>{e.preventDefault();const f=e.deltaY>0?0.93:1.07;setPan(p=>{const ns=Math.max(0.3,Math.min(3,p.s*f));const r=el.getBoundingClientRect();const mx=e.clientX-r.left,my=e.clientY-r.top;return{s:ns,x:mx-(mx-p.x)*(ns/p.s),y:my-(my-p.y)*(ns/p.s)};});};el.addEventListener("wheel",handler,{passive:false});return()=>el.removeEventListener("wheel",handler);},[]);
  useEffect(()=>{const params=new URLSearchParams(window.location.search);const prompt=params.get("session")||params.get("prompt");if(!prompt)return;const cfg=PROMPTS[prompt];if(cfg){const mods=NODES.filter(n=>n.type==="module"&&cfg.filter(n)).map(n=>n.id);const entries=NODES.filter(n=>n.depth===2&&n.type==="entry"&&mods.includes(n.parent)).map(n=>n.id);const focus=[...mods,...entries];if(mods.length){setExpanded(new Set(mods));setChatFocus(focus);}setChatResponse(cfg.response);
    // Pre-fill the active chat thread with the from-session prompt + AI answer.
    const id="t-session";setThreads(prev=>[{id,title:cfg.input,ts:"now",messages:[{role:"user",text:cfg.input},{role:"ai",text:cfg.response,focus:focus.length?focus:null,chips:[{icon:"Eye",label:"Show the gaps",focus:entries.filter(e=>{const nd=NODES.find(n=>n.id===e);return nd?.hasGap;})},{icon:"Network",label:"Connected entries",focus:focus}]}]},...prev.filter(t=>t.id!==id)]);setActiveThread(id);}
    else{setChatResponse("Showing the full knowledge graph.");}window.history.replaceState({},"","/knowledge-graph");},[]);
  // Auto-scroll chat thread to bottom when messages change.
  useEffect(()=>{chatEndRef.current?.scrollIntoView({behavior:"smooth",block:"end"});},[threads,activeThread]);

  const onDown=useCallback((e,id)=>{e.stopPropagation();e.preventDefault();const n=nodesRef.current.find(x=>x.id===id);if(n){n._d=true;setDragId(id);}alphaRef.current=Math.max(alphaRef.current,0.5);},[]);
  const onMove=useCallback((e)=>{if(dragId){const n=nodesRef.current.find(x=>x.id===dragId);if(n&&svgRef.current){const r=svgRef.current.getBoundingClientRect();n.x=(e.clientX-r.left-pan.x)/pan.s;n.y=(e.clientY-r.top-pan.y)/pan.s;n.vx=0;n.vy=0;setTick(t=>t+1);}}else if(panning){setPan(p=>({...p,x:panRef.current.px+e.clientX-panRef.current.x,y:panRef.current.py+e.clientY-panRef.current.y}));}if(hovered)setTipPos({x:e.clientX,y:e.clientY});},[dragId,panning,hovered,pan]);
  const onUp=useCallback(()=>{if(dragId){const n=nodesRef.current.find(x=>x.id===dragId);if(n)n._d=false;setDragId(null);}setPanning(false);},[dragId]);
  const onBgDown=useCallback((e)=>{if(e.target===svgRef.current||e.target.tagName==="rect"){setPanning(true);panRef.current={x:e.clientX,y:e.clientY,px:pan.x,py:pan.y};}},[pan]);
  // Wheel/trackpad zoom is wired as a NON-passive native listener (see effect below) so preventDefault()
  // actually fires — React's synthetic onWheel is passive and can't stop browser zoom / page scroll.
  const onClickNode=useCallback((node)=>{if(node.type==="module"||node.type==="entry"){setExpanded(prev=>{const n=new Set(prev);n.has(node.id)?n.delete(node.id):n.add(node.id);return n;});}setSelected(s=>s===node.id?null:node.id);setReportingNode(null);setReportText("");},[]);
  // Apply a focus array to the graph: expand parent modules + highlight nodes.
  const applyFocus=useCallback((focus)=>{if(!focus||!focus.length){return;}const mods=new Set();focus.forEach(id=>{const nd=NODES.find(n=>n.id===id);if(nd?.parent)mods.add(nd.parent);if(nd?.type==="module")mods.add(nd.id);});setExpanded(prev=>new Set([...prev,...mods]));setChatFocus(focus);},[]);
  // §10 — chat node reference interactions.
  // Hover: temporarily isolate the node (clears on leave, restoring any pre-existing chatFocus).
  const onRefHover=useCallback((id)=>{if(NODES.find(n=>n.id===id))setRefHover(id);},[]);
  const onRefLeave=useCallback(()=>setRefHover(null),[]);
  // Click: open the node drawer, expand its parent module, and focus/zoom to it.
  const onRefClick=useCallback((id)=>{const nd=NODES.find(n=>n.id===id);if(!nd)return;setRefHover(null);setSelected(id);setReportingNode(null);setReportText("");const mods=new Set();if(nd.parent)mods.add(nd.parent);if(nd.type==="module")mods.add(nd.id);if(mods.size)setExpanded(prev=>new Set([...prev,...mods]));setChatFocus([id]);},[]);
  // Append a user message + an AI reply to the active thread, and optionally focus the graph.
  const pushToThread=useCallback((userText,ai)=>{setThreads(prev=>prev.map(t=>t.id!==activeThread?t:{...t,messages:[...t.messages,{role:"user",text:userText},{role:"ai",text:ai.text,focus:ai.focus,chips:ai.chips}]}));if(ai.focus&&ai.focus.length){applyFocus(ai.focus);setChatResponse(ai.text);}},[activeThread,applyFocus]);
  // Recommendation chip inside the chat thread.
  const onRecoChip=useCallback((chip)=>{const ai={text:chip.response||`Highlighting ${chip.label.toLowerCase()} in the graph.`,focus:chip.focus,chips:chip.followups};pushToThread(chip.label,ai);},[pushToThread]);
  // Free-text send: match a canned CHIPS/PROMPTS response by keyword, else generic.
  const onSendChat=useCallback(()=>{const q=chatInput.trim();if(!q)return;const ql=q.toLowerCase();let match=CHIPS.find(c=>ql.includes(c.label.toLowerCase().split(" ")[0]));let ai;if(match){ai={text:match.response,focus:match.focus};}else{const node=NODES.find(n=>ql.includes(n.label.toLowerCase().slice(0,8)));if(node){const rel=NODES.filter(n=>n.parent===node.id).map(n=>n.id);ai={text:`${node.label}: ${(node.summary||"").split("\n")[0]}`,focus:rel.length?rel:[node.id]};}else{ai={text:"I searched Minh Lê’s knowledge graph. Try asking about a specific module — Payment Service, CI/CD Pipeline, Shared Libraries, Monitoring — or about knowledge gaps and risks.",focus:null};}}pushToThread(q,ai);setChatInput("");},[chatInput,pushToThread]);
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
  // §10 — effective focus: a hovered chat reference wins over chatFocus, isolating just that node.
  const focusIds = refHover ? [refHover] : chatFocus;
  const isHi=(id)=>{const nd=NODES.find(n=>n.id===id);if(refHover)return id===refHover;if(nd?.type==="dept")return true;if(hasActiveFilter&&!passesFilter(id))return false;if(focusIds)return focusIds.includes(id);if(!selected)return true;if(id===selected)return true;return visEdges.some(e=>(e.from===selected&&e.to===id)||(e.to===selected&&e.from===id));};

  const nodes=nodesRef.current;
  /* GV-01 — render-time positions = sim position + ambient drift (skip the node being dragged so it tracks the cursor).
     `tick` re-renders every frame, so reading the clock here animates the wander smoothly. */
  const _now=(typeof performance!=="undefined"?performance.now():Date.now());
  const dpos=(n)=>{if(!n)return{x:0,y:0};if(n._d||n.id===dragId)return{x:n.x||0,y:n.y||0};const d=ambientDrift(n.id,_now);return{x:(n.x||0)+d.dx,y:(n.y||0)+d.dy};};
  const nm={};nodes.forEach(n=>{const p=dpos(n);nm[n.id]={...n,x:p.x,y:p.y};});
  const activeThreadData=threads.find(t=>t.id===activeThread)||threads[0];
  // Latest AI message in the active thread carries the contextual recommendation chips.
  const latestAi=activeThreadData?[...activeThreadData.messages].reverse().find(m=>m.role==="ai"):null;
  const selData=selected?NODES.find(n=>n.id===selected):null;
  const selEdges=selected?EDGES.filter(e=>e.from===selected||e.to===selected):[];
  const childEntries=selData?.type==="module"?NODES.filter(n=>n.parent===selData.id&&n.depth===2):[];
  const selGapStatus=selData?gapStatus(selData.id):null;
  const selIsGap=selData?isGap(selData.id):false;
  // KI-04 — the POC only holds a committed graph for Minh Lê; other offboarders resolve to an empty canvas.
  const emp=EMPLOYEES.find(e=>e.id===employeeId)||EMPLOYEES[0];
  const hasGraph=emp.status==="complete";

  return(
    <div className={`${embedded?'px-5 py-4 h-[calc(100vh-3rem)]':'p-4 h-full'} flex flex-col min-h-0`} style={{fontFamily:"'Inter',system-ui,sans-serif"}}>
      <div className="flex items-center justify-between mb-2 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center"><Sparkles className="w-4 h-4 text-white" strokeWidth={1.75}/></div>
          <div>
            {/* KI-04 — title follows the selected offboarder; the chevron opens the employee picker. */}
            <div className="relative">
              <button onClick={()=>setEmpOpen(o=>!o)} className="flex items-center gap-1 group cursor-pointer">
                <h2 className="text-sm font-semibold text-gray-900 leading-tight">{emp.name}{"’s Knowledge Graph"}</h2>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 transition-transform ${empOpen?"rotate-180":""}`}/>
              </button>
              {empOpen&&<>
                <div className="fixed inset-0 z-40" onClick={()=>setEmpOpen(false)}/>
                <div className="absolute left-0 top-full mt-1 w-[248px] bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1">
                  {EMPLOYEES.map(e=><button key={e.id} onClick={()=>{setEmployeeId(e.id);setEmpOpen(false);clearAll();}} className={`w-full flex items-center gap-2 px-2.5 py-1.5 text-left hover:bg-violet-50 cursor-pointer ${e.id===employeeId?"bg-violet-50":""}`}>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-medium text-gray-900 truncate">{e.name}</p>
                      <p className="text-[10px] text-gray-500 truncate">{e.role}</p>
                    </div>
                    {e.status==="complete"
                      ? <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">Complete</span>
                      : <span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 border border-gray-200 shrink-0">In progress</span>}
                  </button>)}
                </div>
              </>}
            </div>
            <p className="text-[11px] text-gray-500">{emp.role}{hasGraph?<>{" · "}{NODES.filter(n=>n.type==="module").length}{" modules · "}{NODES.filter(n=>n.type==="entry").length}{" entries · "}{EDGES.length}{" relationships"}</>:" · handover in progress"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button disabled={!hasGraph} onClick={()=>{setExpanded(new Set(NODES.filter(n=>n.type==="module").map(n=>n.id)));}} className="px-2.5 py-1 text-[11px] font-medium text-violet-700 bg-violet-50 rounded-md hover:bg-violet-100 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">Expand all</button>
          <button disabled={!hasGraph} onClick={clearAll} className="px-2.5 py-1 text-[11px] font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">Reset</button>
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
              :<div key={mi} className="flex flex-col gap-1.5"><div className="max-w-[90%] bg-gray-100 text-gray-700 rounded-lg rounded-bl-sm px-2.5 py-1.5 text-[10px] leading-snug"><NodeRefText text={m.text} onRefHover={onRefHover} onRefLeave={onRefLeave} onRefClick={onRefClick}/></div></div>
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
          {/* KI-04 — an offboarder still mid-handover has committed nothing, so there is no graph to draw yet. */}
          {!hasGraph&&<div className="absolute inset-0 z-20 bg-gray-50 flex items-center justify-center px-6">
            <div className="text-center max-w-[320px]">
              <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center mx-auto mb-2.5"><Clock className="w-4 h-4 text-gray-400"/></div>
              <p className="text-[13px] font-medium text-gray-900">{emp.name}{"’s handover is still in progress"}</p>
              <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">Nothing has been committed to the Knowledge Graph yet. Her knowledge appears here once the session is committed.</p>
              <button onClick={()=>{setEmployeeId("minh-le");clearAll();}} className="mt-3 px-2.5 py-1 text-[11px] font-medium text-violet-700 bg-violet-50 rounded-md hover:bg-violet-100 transition-colors cursor-pointer">View Minh Lê’s graph</button>
            </div>
          </div>}
          <svg ref={svgRef} width={dim.w} height={dim.h} className="w-full h-full" style={{touchAction:'none'}} onPointerMove={onMove} onPointerUp={onUp} onPointerDown={onBgDown}>
            <g transform={`translate(${pan.x},${pan.y}) scale(${pan.s})`}>
              {visEdges.map((e,i)=>{const s=nm[e.from],t=nm[e.to];if(!s||!t)return null;const sn=NODES.find(n=>n.id===e.from),tn=NODES.find(n=>n.id===e.to);const sr=nodeR(sn||{}),tr=nodeR(tn||{});const dx=t.x-s.x,dy=t.y-s.y,d=Math.sqrt(dx*dx+dy*dy)||1;const x1=s.x+(dx/d)*sr,y1=s.y+(dy/d)*sr,x2=t.x-(dx/d)*tr,y2=t.y-(dy/d)*tr;const hi=isHi(e.from)&&isHi(e.to);
                /* When a focus/selection is active, dim non-highlighted edges to ~20% instead of removing them. */
                const eOp=hi?0.4:(focusIds||selected||hasActiveFilter)?0.08:0.4;return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={e.type==="cross"||e.type==="crosschunk"?"#c4b5fd":e.type==="chunk"?"#e5e7eb":"#d4d4d8"} strokeWidth={e.type==="crosschunk"?0.5:e.type==="cross"?0.8:e.type==="chunk"?0.5:0.6} strokeDasharray={e.type==="cross"?"4,3":e.type==="crosschunk"?"3,3":"none"} opacity={eOp} style={{transition:'opacity 0.15s'}}/>;
              })}
              {nodes.map(node=>{const r=nodeR(node),hi=isHi(node.id),isSel=selected===node.id,isHov=hovered===node.id,isMod=node.type==="module",isExp=expanded.has(node.id),isReported=reported.has(node.id);const nf=nodeFill(node);const ns=nodeStroke(node);
                /* Dim non-highlighted nodes to ~20% instead of removing them, so the graph stays whole. */
                const gOp=hi?1:(focusIds||selected||hasActiveFilter)?0.2:1;
                const rp=nm[node.id]||node;
                return <g key={node.id} opacity={gOp} transform={`translate(${rp.x||0},${rp.y||0})`} style={{cursor:'pointer',transition:'opacity 0.15s'}} onPointerDown={e=>onDown(e,node.id)} onPointerEnter={e=>{setHovered(node.id);setTipPos({x:e.clientX,y:e.clientY});}} onPointerLeave={()=>setHovered(null)} onClick={()=>onClickNode(node)}>
                  {(isHov||isSel||refHover===node.id)&&<circle r={r+4} fill="none" stroke={refHover===node.id?"#8b5cf6":ns} strokeWidth="1.5" opacity={refHover===node.id?0.55:0.3}/>}
                  <circle r={r} fill={nf} stroke={ns} strokeWidth={isSel?2:0.8}/>
                  {isMod&&<text textAnchor="middle" dominantBaseline="central" fontSize="10" fontWeight="500" fill="#6d28d9" style={{pointerEvents:'none'}}>{isExp?"\u2212":"+"}</text>}
                  {node.type==="dept"&&<text textAnchor="middle" dominantBaseline="central" fontSize="10" fontWeight="600" fill="#6d28d9" style={{pointerEvents:'none'}}>ML</text>}
                  {isReported&&<g transform={`translate(${r-2},${-r+2})`}><circle r="5.5" fill="#fecaca" stroke="#f87171" strokeWidth="1"/><text textAnchor="middle" dominantBaseline="central" fontSize="7" fill="#991b1b" fontWeight="600">!</text></g>}
                  <text y={r+12} textAnchor="middle" fontSize={node.depth===0?11:node.depth===1?10:9} fontWeight={node.depth<=1?500:400} fill="#27272a" style={{pointerEvents:'none',userSelect:'none'}}>{node.label.length>20?node.label.slice(0,18)+"\u2026":node.label}</text>
                </g>;})}
            </g>
          </svg>
          {/* §10 — transient "from chat" indicator while hovering a node reference (takes priority over chatFocus chip) */}
          {refHover&&(()=>{const nd=NODES.find(n=>n.id===refHover);if(!nd)return null;return <div className="absolute top-2 left-2 z-40 flex items-center gap-1.5 bg-violet-600 text-white rounded-full pl-2.5 pr-2.5 py-1 shadow-sm"><Crosshair className="w-3 h-3"/><span className="text-[10px] font-medium">{nd.label}{" · from chat"}</span></div>;})()}
          {/* Focusing chip — top-left, clears chat focus */}
          {!refHover&&chatFocus&&chatFocus.length>0&&(()=>{const first=NODES.find(n=>n.id===chatFocus[0]);const par=first?.parent?NODES.find(n=>n.id===first.parent):null;const label=par?.label||first?.label||"selection";return <div className="absolute top-2 left-2 z-40 flex items-center gap-1.5 bg-violet-600 text-white rounded-full pl-2.5 pr-1.5 py-1 shadow-sm"><Crosshair className="w-3 h-3"/><span className="text-[10px] font-medium">Focusing: {label}</span><button onClick={()=>{setChatFocus(null);setChatResponse("");}} className="hover:bg-violet-700 rounded-full p-0.5 cursor-pointer"><X className="w-3 h-3"/></button></div>;})()}
          {hovered&&(()=>{const node=NODES.find(n=>n.id===hovered);if(!node)return null;const rect=boxRef.current?.getBoundingClientRect();if(!rect)return null;const tx=tipPos.x-rect.left+14,ty=tipPos.y-rect.top-8,flip=tx+240>rect.width;const nf=nodeFill(node);const ns=nodeStroke(node);const gs=gapStatus(node.id);
            const tipFlagged=reported.has(node.id);
            return <div className="absolute pointer-events-none z-50" style={{left:flip?tx-254:tx,top:Math.max(4,Math.min(ty,rect.height-120))}}><div className="bg-white border border-gray-200 rounded-lg shadow-md p-2.5 w-[230px]" style={{borderLeft:`3px solid ${ns}`}}><div className="flex items-center gap-1.5 mb-1"><span className="text-[10px] font-medium px-1.5 py-0.5 rounded" style={{background:nf,border:`1px solid ${ns}`,color:tipFlagged?"#9f1239":node.type==="dept"||node.type==="system"?"#52525b":"#5b21b6"}}>{node.type==="dept"?"Offboarder":node.type==="module"?"Module":node.type==="system"?"Module":node.type==="chunk"?"Chunk":"Entry"}</span>{tipFlagged&&<span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1"><Flag className="w-2.5 h-2.5"/>Flagged</span>}</div><p className="text-xs font-medium text-gray-900 mb-0.5">{node.label}</p>{node.type==="module"&&<p className="text-[10px] text-gray-500">{node.entries}{" entries · "}{node.verified}{" verified"}{node.flagged>0?` · ${node.flagged} flagged`:""}</p>}{node.type==="entry"&&<p className="text-[10px] text-gray-500">{tipFlagged?"Flagged · pending Manager review":"Verified"}</p>}{node.type==="module"&&<p className="text-[10px] text-violet-600 mt-1">{"Click to "}{expanded.has(node.id)?"collapse":"expand"}</p>}</div></div>;})()}
          <div className="absolute bottom-2 left-2 flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded px-2 py-1"><span className="flex items-center gap-1 text-[9px] text-gray-400"><span className="w-2 h-2 rounded-full inline-block" style={{background:"#ede9fe",border:"1px solid #c4b5fd"}}></span>Verified</span><span className="flex items-center gap-1 text-[9px] text-gray-400"><span className="w-2 h-2 rounded-full inline-block" style={{background:"#fff1f2",border:"1px solid #fda4af"}}></span>Flagged</span><span className="flex items-center gap-1 text-[9px] text-gray-400"><span className="w-2 h-2 rounded-full bg-gray-200 border border-gray-300 inline-block"></span>Module</span><span className="text-[9px] text-gray-300">|</span><span className="text-[9px] text-gray-400">Solid = hierarchy</span><span className="text-[9px] text-gray-400">Dashed = cross-link</span></div>
        {/* 4. Node detail drawer — slides in as an overlay on the right, graph stays full underneath */}
        {selData&&(()=>{const selFlagged=reported.has(selData.id);return <div className="absolute top-0 right-0 bottom-0 w-[440px] max-w-full bg-white border-l border-gray-200 shadow-xl overflow-y-auto z-30" style={{borderLeft:`3px solid ${selFlagged?"#fda4af":nodeStroke(selData)}`}}><div className="p-3"><div className="flex items-start justify-between mb-2"><div><div className="flex items-center gap-1.5 mb-1"><span className="text-[10px] font-medium px-1.5 py-0.5 rounded" style={{background:nodeFill(selData),border:`1px solid ${nodeStroke(selData)}`,color:selFlagged?"#9f1239":selData.type==="dept"||selData.type==="system"?"#52525b":"#5b21b6"}}>{selData.type==="dept"?"Offboarder":selData.type==="module"?"Module":selData.type==="system"?"Module":selData.type==="chunk"?"Chunk":"Entry"}</span>{selFlagged&&<span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1"><Flag className="w-2.5 h-2.5"/>Flagged · pending review</span>}</div><h3 className="text-sm font-semibold text-gray-900">{selData.label}</h3></div><button onClick={()=>{setSelected(null);setReportingNode(null);setReportText("");}} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X className="w-4 h-4"/></button></div>
            {/* Status badges — entries are either Verified (purple) or Flagged (rose, pending Manager review). */}
            {selData.type==="entry"&&<div className="flex items-center gap-1.5 mb-2">{selFlagged?<span className="text-[10px] px-1.5 py-0.5 rounded border bg-rose-50 text-rose-700 border-rose-200 flex items-center gap-1"><Flag className="w-2.5 h-2.5"/>Flagged</span>:<span className="text-[10px] px-1.5 py-0.5 rounded border bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center gap-1"><CheckCircle2 className="w-2.5 h-2.5"/>Verified</span>}</div>}
            {/* GAP ACTION CARD — right after badges, before summary */}
            {selIsGap&&<div className="rounded-lg border border-yellow-200 bg-yellow-50/40 px-3 py-2.5 mb-3" style={{borderLeft:"2px solid rgb(234,179,8)",borderRadius:0}}><div className="flex items-start gap-2 mb-2"><AlertTriangle className="w-3.5 h-3.5 text-yellow-700 shrink-0 mt-0.5"/><p className="text-[11px] text-yellow-800">AI flagged this entry as a knowledge gap. Review and take action.</p></div><div className="flex items-center gap-2"><button onClick={()=>onResolveGap(selData.id)} className="h-7 px-3 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"><CheckCircle2 className="w-3 h-3"/>Mark as resolved</button><button onClick={()=>onDismissGap(selData.id)} className="h-7 px-3 rounded-md border border-gray-300 bg-white text-gray-600 text-[10px] font-medium inline-flex items-center gap-1.5 hover:bg-gray-50 transition-colors cursor-pointer"><XCircle className="w-3 h-3"/>Dismiss gap</button></div></div>}
            {/* Brief green confirmation — visible while this node is selected, then gone */}
            {selGapStatus==="resolved"&&<div className="rounded-md bg-emerald-50 border border-emerald-200 px-3 py-2 mb-3 flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5"/><p className="text-[11px] text-emerald-700">{"Gap resolved by H\u00e0 Vy · entry is now verified."}</p></div>}
            {/* Module stats */}
            {selData.type==="module"&&<><div className="flex flex-wrap items-center gap-1.5 mb-2"><span className="text-[11px] text-gray-600">{selData.entries}{" entries"}</span><span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">{selData.verified}{" verified"}</span>{selData.flagged>0&&<span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">{selData.flagged}{" flagged"}</span>}</div>{selData.provenance?.map((p,i)=><p key={i} className="text-[10px] text-gray-400">{p.name}{" · "}{p.date}{" · "}{p.count}{" entries"}</p>)}</>}
            <p className="text-[11px] text-gray-600 whitespace-pre-wrap leading-relaxed mb-3">{selData.summary}</p>
            {selFlagged&&<div className="border-t border-gray-100 pt-2 mb-2"><p className="text-[10px] font-medium text-rose-600 uppercase tracking-wider mb-1.5">Flagged · pending correction</p><div className="rounded-md bg-rose-50/50 border-l-2 border-rose-300 px-3 py-2"><p className="text-[11px] text-gray-800 leading-relaxed">{reported.get(selData.id).text||"No correction provided \u2014 flagged as incorrect."}</p><p className="text-[9px] text-gray-400 mt-1">{"Reported by you · "}{reported.get(selData.id).time}{" · awaiting review by H\u00e0 Vy"}</p></div></div>}
            {childEntries.length>0&&<div className="border-t border-gray-100 pt-2 mb-2"><p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1.5">Entries</p>{childEntries.map(ce=>{const ceFlagged=reported.has(ce.id);return <button key={ce.id} onClick={()=>{setSelected(ce.id);setReportingNode(null);setReportText("");}} className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-50 text-left cursor-pointer transition-colors"><span className="w-2 h-2 rounded-full flex-shrink-0" style={{backgroundColor:ceFlagged?"#fb7185":"#a78bfa"}}></span><span className="text-[11px] text-gray-800 flex-1 truncate">{ce.label}</span><span className={`text-[9px] px-1.5 py-0.5 rounded ${ceFlagged?"bg-rose-50 text-rose-600":"bg-emerald-50 text-emerald-600"}`}>{ceFlagged?"Flagged":"Verified"}</span></button>})}</div>}
            {selEdges.length>0&&<div className="border-t border-gray-100 pt-2 mb-2"><p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1.5">{"Cross-links ("}{selEdges.filter(e=>e.type==="cross").length}{")"}</p>{selEdges.filter(e=>e.type==="cross").map((e,i)=>{const oid=e.from===selData.id?e.to:e.from;const o=NODES.find(n=>n.id===oid);if(!o)return null;return <button key={i} onClick={()=>{setSelected(oid);if(o.parent)setExpanded(prev=>new Set([...prev,o.parent]));setReportingNode(null);setReportText("");}} className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-violet-50 text-left cursor-pointer transition-colors"><ChevronRight className="w-3 h-3 text-gray-400"/><span className="text-[11px] text-gray-800 flex-1">{o.label}</span>{e.label&&<span className="text-[9px] text-gray-400">{e.label}</span>}</button>;})}</div>}
            <div className="border-t border-gray-100 pt-2 flex flex-col gap-1.5">
              <button onClick={()=>onAsk(selData.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-violet-50 border border-violet-200 text-violet-700 text-[11px] font-medium hover:bg-violet-100 transition-colors cursor-pointer"><Sparkles className="w-3 h-3"/>{"Ask about this "}{selData.type}</button>
              {(selData.type==="module"||selData.type==="dept")&&<Link href={`/knowledge-graph/insights${selData.type==="module"?`?node=${selData.id}`:""}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-gray-200 text-gray-600 text-[11px] font-medium hover:bg-gray-50 hover:border-gray-300 transition-colors"><BarChart3 className="w-3 h-3"/>View insights</Link>}
              {selData.type==="entry"&&!reported.has(selData.id)&&!reportingNode&&!selGapStatus&&!selIsGap&&<button onClick={()=>setReportingNode(selData.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-gray-200 text-gray-600 text-[11px] font-medium hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer"><Flag className="w-3 h-3"/>Report an issue</button>}
            </div>
            {reportingNode===selData.id&&<div className="mt-2 rounded-lg bg-rose-50/50 border border-rose-200 p-3"><div className="flex items-center justify-between mb-2"><span className="text-[10px] font-medium text-rose-700 flex items-center gap-1"><Flag className="w-3 h-3"/>Report an issue</span><button onClick={()=>{setReportingNode(null);setReportText("");}} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X className="w-3 h-3"/></button></div><p className="text-[9px] text-gray-500 mb-1">Current content</p><div className="bg-gray-100 rounded-md px-2.5 py-2 text-[10px] text-gray-400 line-through leading-relaxed mb-2">{selData.summary}</div><p className="text-[9px] text-gray-500 mb-1">{"Your correction "}<span className="text-gray-400">(optional)</span></p><textarea value={reportText} onChange={e=>setReportText(e.target.value)} placeholder="What should it say instead?" className="w-full h-16 px-2.5 py-2 text-[11px] border border-emerald-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500/20 text-gray-700 placeholder:text-gray-400 resize-none"/><div className="flex justify-end mt-2"><button onClick={()=>onSubmitReport(selData.id)} className="px-3 py-1.5 rounded-md bg-white border border-rose-300 text-rose-700 text-[10px] font-medium hover:bg-rose-50 transition-colors cursor-pointer">Submit correction</button></div></div>}
          </div></div>;})()}
        </div>
      </div>
    </div>
  );
}
