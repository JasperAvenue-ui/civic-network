import { useState, useEffect } from "react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=Source+Serif+4:opsz,wght@8..60,300;8..60,400;8..60,600&family=JetBrains+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#070f1c;--bg-card:#0d1b2e;--bg-hover:#122240;
  --border:#1a3355;--border-light:#243f60;
  --gold:#c8a84b;--gold-dim:#8a7033;
  --cream:#e8dfc8;--cream-dim:#a89e8a;
  --blue:#4a9eff;--red:#e05252;--green:#4cae7f;
  --text-dim:#8e9ab0;
  --fdisplay:'Playfair Display',Georgia,serif;
  --fbody:'Source Serif 4',Georgia,serif;
  --fmono:'JetBrains Mono','Courier New',monospace;
  --sw:220px;
}
body{background:var(--bg);color:var(--cream);font-family:var(--fbody);font-size:14px}
.app{display:flex;min-height:100vh}
.sidebar{width:var(--sw);background:var(--bg-card);border-right:1px solid var(--border);display:flex;flex-direction:column;position:fixed;top:0;left:0;height:100vh;z-index:100}
.sb-logo{padding:22px 20px 18px;border-bottom:1px solid var(--border)}
.sb-logo h1{font-family:var(--fdisplay);font-size:14px;font-weight:700;color:var(--gold);letter-spacing:.04em;line-height:1.3}
.sb-logo span{font-size:10px;color:var(--text-dim);letter-spacing:.1em;font-family:var(--fmono);display:block;margin-top:4px}
.sb-nav{flex:1;padding:10px 0;overflow-y:auto}
.nav-item{display:flex;align-items:center;gap:10px;padding:10px 20px;cursor:pointer;transition:all .15s;font-size:12px;color:var(--text-dim);letter-spacing:.02em;border-left:2px solid transparent;font-family:var(--fmono)}
.nav-item:hover{color:var(--cream);background:var(--bg-hover)}
.nav-item.active{color:var(--gold);border-left-color:var(--gold);background:rgba(200,168,75,.08)}
.sb-user{padding:14px 20px;border-top:1px solid var(--border);font-size:12px}
.sb-user-name{font-family:var(--fdisplay);font-size:14px;color:var(--cream)}
.sb-user-sub{color:var(--text-dim);font-family:var(--fmono);font-size:10px;margin-top:2px}
.main{margin-left:var(--sw);flex:1;min-height:100vh;display:flex;flex-direction:column}
.topbar{padding:18px 30px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;background:var(--bg);position:sticky;top:0;z-index:50}
.topbar h2{font-family:var(--fdisplay);font-size:19px;font-weight:700}
.topbar-meta{font-family:var(--fmono);font-size:10px;color:var(--text-dim)}
.content{padding:28px 30px;max-width:1060px;width:100%}
.card{background:var(--bg-card);border:1px solid var(--border);border-radius:3px;padding:22px}
.ctitle{font-family:var(--fmono);font-size:11px;font-weight:500;color:var(--gold);text-transform:uppercase;letter-spacing:.08em;margin-bottom:14px}
.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:28px}
.stat-card{background:var(--bg-card);border:1px solid var(--border);padding:18px;border-radius:3px}
.stat-val{font-family:var(--fdisplay);font-size:30px;font-weight:700;color:var(--gold)}
.stat-lbl{font-size:11px;color:var(--text-dim);margin-top:4px;font-family:var(--fmono);letter-spacing:.05em}
.stat-sub{font-size:10px;color:var(--green);margin-top:6px;font-family:var(--fmono)}
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.prop-list{display:flex;flex-direction:column;gap:10px}
.prop-card{background:var(--bg-card);border:1px solid var(--border);border-radius:3px;padding:18px 22px;cursor:pointer;transition:all .15s;position:relative;overflow:hidden}
.prop-card:hover{border-color:var(--border-light);background:var(--bg-hover)}
.prop-card::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px}
.prop-card.s-voting::before{background:var(--blue)}
.prop-card.s-deliberation::before{background:var(--gold)}
.prop-card.s-passed::before{background:var(--green)}
.prop-card.s-failed::before{background:var(--red)}
.prop-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px}
.prop-title{font-family:var(--fdisplay);font-size:15px;font-weight:600;line-height:1.35}
.badge{font-family:var(--fmono);font-size:10px;padding:2px 7px;border-radius:2px;text-transform:uppercase;letter-spacing:.07em;white-space:nowrap;flex-shrink:0}
.b-voting{background:rgba(74,158,255,.15);color:var(--blue);border:1px solid rgba(74,158,255,.3)}
.b-deliberation{background:rgba(200,168,75,.15);color:var(--gold);border:1px solid rgba(200,168,75,.3)}
.b-passed{background:rgba(76,174,127,.15);color:var(--green);border:1px solid rgba(76,174,127,.3)}
.b-failed{background:rgba(224,82,82,.15);color:var(--red);border:1px solid rgba(224,82,82,.3)}
.prop-meta{display:flex;gap:14px;margin-top:8px;font-family:var(--fmono);font-size:10px;color:var(--text-dim);flex-wrap:wrap}
.prop-sum{margin-top:8px;font-size:13px;color:var(--cream-dim);line-height:1.65}
.vbar-wrap{margin-top:12px}
.vbar{height:4px;background:var(--border);border-radius:2px;overflow:hidden}
.vbar-fill{height:100%;background:linear-gradient(90deg,var(--green),var(--blue));transition:width .3s}
.vstats{display:flex;justify-content:space-between;margin-top:5px;font-family:var(--fmono);font-size:10px}
.lvl-tabs{display:flex;gap:0;margin-bottom:22px;border:1px solid var(--border);border-radius:3px;overflow:hidden}
.lvl-tab{flex:1;padding:9px;text-align:center;cursor:pointer;font-family:var(--fmono);font-size:11px;letter-spacing:.05em;color:var(--text-dim);border-right:1px solid var(--border);background:var(--bg-card);transition:all .15s}
.lvl-tab:last-child{border-right:none}
.lvl-tab.active{background:rgba(200,168,75,.12);color:var(--gold)}
.lvl-tab:hover:not(.active){background:var(--bg-hover);color:var(--cream)}
.crit-sec{margin-bottom:22px;padding:14px 18px;background:rgba(200,168,75,.05);border:1px solid rgba(200,168,75,.2);border-radius:3px}
.crit-lbl{font-family:var(--fmono);font-size:10px;color:var(--gold);letter-spacing:.07em;margin-bottom:10px}
.crit-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:6px}
.crit-item{display:flex;justify-content:space-between;align-items:center;font-size:11px;padding:5px 9px;background:rgba(0,0,0,.3);border-radius:2px}
.crit-name{color:var(--cream-dim)}
.crit-pct{font-family:var(--fmono);color:var(--gold);font-size:10px}
.alloc-row{margin-bottom:14px}
.alloc-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px}
.alloc-name{font-size:13px;color:var(--cream);display:flex;align-items:center;gap:7px}
.alloc-pct{font-family:var(--fmono);font-size:11px;color:var(--gold)}
input[type=range]{-webkit-appearance:none;width:100%;height:5px;border-radius:3px;background:var(--border);outline:none;cursor:pointer}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:15px;height:15px;border-radius:50%;background:var(--gold);cursor:pointer;border:2px solid var(--bg);transition:background .15s}
input[type=range]::-webkit-slider-thumb:hover{background:#d4b55a}
.rem-bar{display:flex;align-items:center;gap:10px;padding:10px 14px;background:var(--bg-card);border:1px solid var(--border);border-radius:3px;margin-bottom:22px;font-family:var(--fmono);font-size:11px}
.rem-lbl{color:var(--text-dim)}
.rem-val{color:var(--gold);font-size:15px;font-weight:500;min-width:36px}
.rem-track{flex:1;height:5px;background:var(--border);border-radius:3px;overflow:hidden}
.rem-fill{height:100%;background:var(--gold);transition:width .2s}
.save-btn{padding:11px 28px;background:var(--gold);color:#070f1c;border:none;cursor:pointer;font-family:var(--fmono);font-size:12px;font-weight:500;border-radius:2px;letter-spacing:.05em;transition:all .15s}
.save-btn:hover{background:#d4b55a}
.save-btn:disabled{opacity:.45;cursor:default}
.ledger-tbl{width:100%;border-collapse:collapse;font-family:var(--fmono);font-size:11px}
.ledger-tbl th{text-align:left;padding:9px 10px;color:var(--gold);border-bottom:1px solid var(--border);letter-spacing:.06em;font-size:10px}
.ledger-tbl td{padding:9px 10px;border-bottom:1px solid rgba(26,51,85,.4);color:var(--cream-dim);vertical-align:top}
.ledger-tbl tr:hover td{background:var(--bg-hover)}
.ltype{padding:2px 6px;border-radius:2px;font-size:9px;letter-spacing:.07em}
.lt-VOTE{background:rgba(74,158,255,.15);color:var(--blue)}
.lt-ALLOCATION{background:rgba(200,168,75,.15);color:var(--gold)}
.lt-PROPOSAL{background:rgba(76,174,127,.15);color:var(--green)}
.lt-MODERATION{background:rgba(160,160,160,.15);color:#aaa}
.lt-PASSED{background:rgba(76,174,127,.2);color:var(--green)}
.back-btn{display:flex;align-items:center;gap:5px;font-family:var(--fmono);font-size:11px;color:var(--text-dim);cursor:pointer;margin-bottom:22px;padding:5px 0;background:none;border:none;transition:color .15s}
.back-btn:hover{color:var(--cream)}
.det-title{font-family:var(--fdisplay);font-size:26px;font-weight:700;line-height:1.3;margin-bottom:11px}
.dtabs{display:flex;gap:0;border-bottom:1px solid var(--border);margin-bottom:22px}
.dtab{padding:9px 18px;font-family:var(--fmono);font-size:11px;cursor:pointer;color:var(--text-dim);border-bottom:2px solid transparent;transition:all .15s;margin-bottom:-1px}
.dtab.active{color:var(--gold);border-bottom-color:var(--gold)}
.dtab:hover:not(.active){color:var(--cream)}
.qblock{margin-bottom:22px}
.qnum{font-family:var(--fmono);font-size:10px;color:var(--gold);margin-bottom:6px}
.qtext{font-size:14px;color:var(--cream);margin-bottom:10px;line-height:1.55}
.opts{display:flex;flex-direction:column;gap:7px}
.opt-btn{padding:9px 14px;background:var(--bg-card);border:1px solid var(--border);color:var(--cream-dim);cursor:pointer;text-align:left;font-family:var(--fbody);font-size:13px;border-radius:2px;transition:all .15s;width:100%}
.opt-btn:hover{border-color:var(--border-light);color:var(--cream)}
.opt-btn.sel{border-color:var(--blue);color:var(--blue);background:rgba(74,158,255,.08)}
.opt-btn.corr{border-color:var(--green);color:var(--green);background:rgba(76,174,127,.1)}
.opt-btn.incorr{border-color:var(--red);color:var(--red);background:rgba(224,82,82,.1)}
.vote-acts{display:flex;gap:14px;margin-top:22px}
.vote-btn{flex:1;padding:15px;border:2px solid;cursor:pointer;font-family:var(--fmono);font-size:12px;letter-spacing:.05em;border-radius:2px;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:7px;background:transparent}
.vote-btn:disabled{opacity:.4;cursor:default}
.vbf{border-color:var(--green);color:var(--green)}
.vbf:hover:not(:disabled),.vbf.vactive{background:rgba(76,174,127,.15)}
.vba{border-color:var(--red);color:var(--red)}
.vba:hover:not(:disabled),.vba.vactive{background:rgba(224,82,82,.15)}
.notif{position:fixed;bottom:22px;right:22px;background:var(--bg-card);border:1px solid var(--green);color:var(--green);padding:10px 18px;font-family:var(--fmono);font-size:11px;border-radius:3px;z-index:1000;animation:slideIn .2s ease}
@keyframes slideIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.modal-ov{position:fixed;inset:0;background:rgba(7,15,28,.88);z-index:200;display:flex;align-items:center;justify-content:center;padding:22px}
.modal{background:var(--bg-card);border:1px solid var(--border-light);border-radius:3px;padding:28px;max-width:540px;width:100%}
.modal-title{font-family:var(--fdisplay);font-size:18px;font-weight:700;margin-bottom:6px}
.modal-sub{font-size:12px;color:var(--text-dim);margin-bottom:22px;line-height:1.6}
.fgrp{margin-bottom:18px}
.flbl{font-family:var(--fmono);font-size:10px;color:var(--gold);letter-spacing:.06em;display:block;margin-bottom:7px}
.finput{width:100%;background:var(--bg);border:1px solid var(--border);color:var(--cream);padding:9px 12px;font-family:var(--fbody);font-size:13px;border-radius:2px;outline:none;transition:border-color .15s}
.finput:focus{border-color:var(--gold)}
.ftarea{resize:vertical;min-height:90px}
.fsel{appearance:none;cursor:pointer}
.modal-acts{display:flex;gap:10px;margin-top:22px;justify-content:flex-end}
.btn-p{padding:9px 22px;background:var(--gold);color:#070f1c;border:none;cursor:pointer;font-family:var(--fmono);font-size:11px;font-weight:500;border-radius:2px;letter-spacing:.05em;transition:all .15s}
.btn-p:hover{background:#d4b55a}
.btn-p:disabled{opacity:.45;cursor:default}
.btn-g{padding:9px 22px;background:transparent;color:var(--text-dim);border:1px solid var(--border);cursor:pointer;font-family:var(--fmono);font-size:11px;border-radius:2px;letter-spacing:.05em;transition:all .15s}
.btn-g:hover{color:var(--cream);border-color:var(--border-light)}
.score-disp{text-align:center;padding:28px}
.score-num{font-family:var(--fdisplay);font-size:60px;font-weight:900}
.score-pass{color:var(--green)}
.score-fail{color:var(--red)}
.score-lbl{font-family:var(--fmono);font-size:13px;margin-top:7px}
.sec-bar-row{display:flex;align-items:center;gap:10px;margin-bottom:9px}
.sec-bar-name{width:130px;font-size:11px;color:var(--cream-dim);text-align:right;flex-shrink:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
.sec-bar-track{flex:1;height:7px;background:var(--border);border-radius:4px;overflow:hidden}
.sec-bar-fill{height:100%;border-radius:4px;transition:width .3s}
.sec-bar-pct{width:32px;font-family:var(--fmono);font-size:10px;color:var(--gold);flex-shrink:0}
.act-item{display:flex;gap:10px;padding:10px 0;border-bottom:1px solid rgba(26,51,85,.4);font-size:12px;align-items:flex-start}
.act-ico{width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;flex-shrink:0;margin-top:1px}
.act-ico-vote{background:rgba(74,158,255,.2)}
.act-ico-prop{background:rgba(76,174,127,.2)}
.act-ico-alloc{background:rgba(200,168,75,.2)}
.act-target{color:var(--cream);line-height:1.4}
.act-date{font-family:var(--fmono);font-size:10px;color:var(--text-dim);margin-top:2px}
.part-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.part-card{background:rgba(0,0,0,.3);border:1px solid var(--border);padding:13px;border-radius:3px}
.part-lvl{font-family:var(--fmono);font-size:10px;color:var(--gold);letter-spacing:.08em;margin-bottom:9px}
.part-row{display:flex;justify-content:space-between;align-items:center;padding:3px 0;font-size:11px;border-bottom:1px solid rgba(26,51,85,.4)}
.part-row:last-child{border-bottom:none}
.part-nm{color:var(--cream-dim);overflow:hidden;white-space:nowrap;text-overflow:ellipsis;max-width:110px}
.part-pts{font-family:var(--fmono);font-size:10px;color:var(--blue)}
.quorum-ring{position:relative;width:76px;height:76px;flex-shrink:0}
.quorum-ring svg{transform:rotate(-90deg)}
.qring-lbl{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-family:var(--fdisplay);font-size:15px;font-weight:700}
.qmeta{font-size:12px;color:var(--text-dim);font-family:var(--fmono);line-height:1.8}
.qmeta span{color:var(--cream);display:block;font-size:13px;margin-bottom:2px}
.profile-av{width:58px;height:58px;border-radius:50%;background:linear-gradient(135deg,var(--gold),#6b4c15);display:flex;align-items:center;justify-content:center;font-family:var(--fdisplay);font-size:22px;font-weight:700;color:#070f1c;flex-shrink:0}
.profile-name{font-family:var(--fdisplay);font-size:22px;font-weight:700}
.profile-user{font-family:var(--fmono);font-size:11px;color:var(--gold);margin-top:3px}
.profile-bio{font-size:12px;color:var(--text-dim);margin-top:6px}
.info-box{background:rgba(200,168,75,.06);border:1px solid rgba(200,168,75,.2);border-radius:3px;padding:14px 18px;font-size:13px;color:var(--cream-dim);line-height:1.7;margin-bottom:22px}
.tier-table{width:100%;border-collapse:collapse;font-size:12px;margin-top:10px}
.tier-table th{text-align:left;padding:7px 10px;font-family:var(--fmono);font-size:10px;color:var(--gold);letter-spacing:.06em;border-bottom:1px solid var(--border)}
.tier-table td{padding:7px 10px;border-bottom:1px solid rgba(26,51,85,.3);color:var(--cream-dim);vertical-align:top;line-height:1.5}
.tier-table tr:hover td{background:var(--bg-hover)}
@media(max-width:800px){.stats-grid{grid-template-columns:repeat(2,1fr)}.two-col{grid-template-columns:1fr}.part-grid{grid-template-columns:1fr}}
`;

const USER = { name: "Lea", username: "lea_citizenry", taxPaid: 12400, province: "Alberta", municipality: "Edmonton" };

const SECTORS = {
  federal: {
    critical: [
      { id: "fc_def", name: "National Defence", pct: 7.5 },
      { id: "fc_cyber", name: "Cybersecurity", pct: 5 },
      { id: "fc_border", name: "Border Systems", pct: 7.5 },
      { id: "fc_civic", name: "Civic Infrastructure", pct: 10 },
    ],
    flexible: [
      { id: "ff_health", name: "Healthcare Transfers", color: "#e05252" },
      { id: "ff_edu", name: "Education Transfers", color: "#4a9eff" },
      { id: "ff_infra", name: "Infrastructure", color: "#e67e22" },
      { id: "ff_climate", name: "Climate & Environment", color: "#4cae7f" },
      { id: "ff_indg", name: "Indigenous Affairs", color: "#9b59b6" },
      { id: "ff_digital", name: "Digital Innovation", color: "#16a085" },
      { id: "ff_foreign", name: "Foreign Affairs", color: "#c0392b" },
    ],
  },
  provincial: {
    critical: [
      { id: "pc_hosp", name: "Hospitals & Emergency", pct: 10 },
      { id: "pc_grid", name: "Power Grid & Utilities", pct: 10 },
      { id: "pc_just", name: "Justice & Courts", pct: 10 },
    ],
    flexible: [
      { id: "pf_k12", name: "K–12 Education", color: "#f39c12" },
      { id: "pf_post", name: "Post-Secondary", color: "#8e44ad" },
      { id: "pf_roads", name: "Roads & Transit", color: "#2ecc71" },
      { id: "pf_soc", name: "Social Services", color: "#e74c3c" },
      { id: "pf_hous", name: "Housing", color: "#1abc9c" },
      { id: "pf_env", name: "Environment", color: "#27ae60" },
    ],
  },
  municipal: {
    critical: [
      { id: "mc_water", name: "Water & Waste", pct: 10 },
      { id: "mc_fire", name: "Fire & Emergency", pct: 10 },
      { id: "mc_trans", name: "Public Transit", pct: 10 },
    ],
    flexible: [
      { id: "mf_roads", name: "Local Roads", color: "#95a5a6" },
      { id: "mf_parks", name: "Parks & Recreation", color: "#2ecc71" },
      { id: "mf_libs", name: "Libraries & Education", color: "#3498db" },
      { id: "mf_comm", name: "Community Programs", color: "#e67e22" },
      { id: "mf_plan", name: "Planning & Zoning", color: "#9b59b6" },
      { id: "mf_bylaw", name: "Bylaw & Safety", color: "#e74c3c" },
    ],
  },
};

const INIT_ALLOC = {
  federal:   { ff_health:25, ff_edu:20, ff_climate:15, ff_infra:10, ff_indg:0, ff_digital:0, ff_foreign:0 },
  provincial:{ pf_k12:20, pf_post:15, pf_roads:15, pf_soc:10, pf_hous:10, pf_env:0 },
  municipal: { mf_roads:15, mf_parks:20, mf_libs:15, mf_comm:10, mf_plan:10, mf_bylaw:0 },
};

const Q_P001 = [
  { q:"What income threshold qualifies for coverage?", opts:["$70,000","$90,000","$110,000","$80,000"], a:1 },
  { q:"What percentage of dental costs would be covered?", opts:["60%","75%","80%","90%"], a:2 },
  { q:"How is this proposal funded?", opts:["Income tax increase","GST increase","Corporate tax increase","Bond issuance"], a:2 },
  { q:"Which federal sector does this affect?", opts:["Digital Innovation","Indigenous Affairs","Healthcare Transfers","Infrastructure"], a:2 },
  { q:"What is the proposed corporate tax rate increase?", opts:["0.5%","1.2%","2.0%","1.8%"], a:1 },
  { q:"Does this proposal cover 100% of dental costs?", opts:["Yes","No"], a:1 },
  { q:"Who may vote on this proposal?", opts:["All Canadians","Citizens allocated to Healthcare Transfers","Anyone with a DDTAP account","Federal moderators only"], a:1 },
  { q:"What proposal type is this?", opts:["Emergency","Standard","Constitutional","Advisory"], a:1 },
  { q:"What vote majority is required to pass?", opts:["40%","More than 50%","60%","75%"], a:1 },
  { q:"What quorum percentage is required?", opts:["40%","50%","60%","75%"], a:2 },
];

const INIT_PROPOSALS = [
  {
    id:"p001", title:"Universal Dental Coverage Act",
    sector:"federal", sectorName:"Healthcare Transfers", sectorId:"ff_health",
    status:"voting", author:"j_morrison_yeg", created:"2026-03-01", deadline:"2026-06-01",
    summary:"Extend federal healthcare transfers to cover 80% of dental costs for all Canadians earning under $90,000/year, funded through a 1.2% increase in corporate tax contributions. This will ensure dental care is accessible to all Canadians regardless of employer benefits.",
    forVotes:10234, againstVotes:3891, totalEligible:18200, quorumPct:72,
    userVoted:null, userPassedTest:false, questions:Q_P001,
  },
  {
    id:"p002", title:"Mandatory Indigenous Language Curriculum",
    sector:"federal", sectorName:"Indigenous Affairs", sectorId:"ff_indg",
    status:"deliberation", author:"running_elk_b", created:"2026-04-15", deadline:"2026-07-15",
    summary:"Require all publicly funded K–12 schools to offer at least one Indigenous language course per grade level, developed in partnership with local Nations and funded through Indigenous Affairs allocations.",
    forVotes:0, againstVotes:0, totalEligible:0, quorumPct:0,
    userVoted:null, userPassedTest:false, questions:[],
  },
  {
    id:"p003", title:"Edmonton Active Transportation Network",
    sector:"municipal", sectorName:"Local Roads", sectorId:"mf_roads",
    status:"passed", author:"cycle_yyc", created:"2026-01-10", deadline:null,
    summary:"Allocate $45M over 3 years to expand dedicated cycling and pedestrian infrastructure in Edmonton, including 40km of new protected lanes and 12 new pedestrian crossings.",
    forVotes:8920, againstVotes:2103, totalEligible:14500, quorumPct:81,
    userVoted:"for", userPassedTest:true, questions:[],
  },
  {
    id:"p004", title:"Carbon Capture R&D Investment Fund",
    sector:"federal", sectorName:"Climate & Environment", sectorId:"ff_climate",
    status:"voting", author:"dr_priya_k", created:"2026-02-20", deadline:"2026-05-20",
    summary:"Establish a $2B federal fund for carbon capture research partnerships between universities and industry, with results mandated to remain open-source for 5 years post-discovery.",
    forVotes:5402, againstVotes:7801, totalEligible:16000, quorumPct:68,
    userVoted:null, userPassedTest:true, questions:[],
  },
];

const INIT_LEDGER = [
  { id:"L0042", type:"VOTE", actor:"lea_citizenry", action:"Voted FOR", target:"Edmonton Active Transportation Network", sector:"Municipal · Local Roads", ts:"2026-02-14 09:32", pts:"15pts" },
  { id:"L0041", type:"ALLOCATION", actor:"lea_citizenry", action:"Annual allocation submitted", target:"Federal · Provincial · Municipal", sector:"All Sectors", ts:"2026-02-01 14:05", pts:"—" },
  { id:"L0040", type:"PROPOSAL", actor:"dr_priya_k", action:"New proposal filed", target:"Carbon Capture R&D Investment Fund", sector:"Federal · Climate & Environment", ts:"2026-02-20 11:12", pts:"—" },
  { id:"L0039", type:"VOTE", actor:"j_morrison_yeg", action:"Voted FOR", target:"Universal Dental Coverage Act", sector:"Federal · Healthcare Transfers", ts:"2026-03-15 08:44", pts:"22pts" },
  { id:"L0038", type:"PROPOSAL", actor:"j_morrison_yeg", action:"New proposal filed", target:"Universal Dental Coverage Act", sector:"Federal · Healthcare Transfers", ts:"2026-03-01 10:00", pts:"—" },
  { id:"L0037", type:"MODERATION", actor:"mod_fed_health_02", action:"Comprehension test approved", target:"Universal Dental Coverage Act", sector:"Federal · Healthcare Transfers", ts:"2026-03-03 14:20", pts:"—" },
  { id:"L0036", type:"VOTE", actor:"running_elk_b", action:"Voted AGAINST", target:"Carbon Capture R&D Investment Fund", sector:"Federal · Climate & Environment", ts:"2026-04-01 16:00", pts:"8pts" },
  { id:"L0035", type:"PASSED", actor:"SYSTEM", action:"Proposal PASSED", target:"Edmonton Active Transportation Network", sector:"Municipal · Local Roads", ts:"2026-04-10 00:00", pts:"—" },
];

export default function DDTAP() {
  const [view, setView] = useState("dashboard");
  const [govLevel, setGovLevel] = useState("federal");
  const [alloc, setAlloc] = useState(INIT_ALLOC);
  const [savedAlloc, setSavedAlloc] = useState(INIT_ALLOC);
  const [proposals, setProposals] = useState(INIT_PROPOSALS);
  const [selectedId, setSelectedId] = useState(null);
  const [dtab, setDtab] = useState("overview");
  const [testAns, setTestAns] = useState({});
  const [testDone, setTestDone] = useState(false);
  const [testScore, setTestScore] = useState(null);
  const [notif, setNotif] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newProp, setNewProp] = useState({ title:"", sectorId:"ff_health", summary:"" });
  const [ledger, setLedger] = useState(INIT_LEDGER);
  const [filterSec, setFilterSec] = useState("all");

  const notify = (msg) => { setNotif(msg); setTimeout(() => setNotif(null), 3200); };
  const flexTotal = (lvl) => Object.values(alloc[lvl]).reduce((a,b)=>a+b,0);
  const rem = (lvl) => 70 - flexTotal(lvl);

  const updateAlloc = (lvl, id, val) => {
    const others = { ...alloc[lvl] }; delete others[id];
    const otherSum = Object.values(others).reduce((a,b)=>a+b,0);
    const clamped = Math.min(Math.max(0, val), 70 - otherSum);
    setAlloc(prev => ({ ...prev, [lvl]: { ...prev[lvl], [id]: clamped } }));
  };

  const saveAlloc = () => {
    setSavedAlloc(alloc);
    const nextId = "L" + String(parseInt(ledger[0].id.slice(1)) + 1).padStart(4,"0");
    setLedger(prev => [{ id:nextId, type:"ALLOCATION", actor:USER.username, action:"Annual allocation updated", target:"Federal · Provincial · Municipal", sector:"All Sectors", ts:new Date().toISOString().slice(0,16).replace("T"," "), pts:"—" }, ...prev]);
    notify("Allocations saved to civic ledger ✓");
  };

  const castVote = (proposalId, side) => {
    setProposals(prev => prev.map(p => {
      if (p.id !== proposalId) return p;
      const wasFor = p.userVoted === "for", wasAgainst = p.userVoted === "against";
      const toggling = p.userVoted === side;
      let fv = p.forVotes, av = p.againstVotes;
      if (!toggling) {
        if (side === "for") { fv++; if (wasAgainst) av--; }
        else { av++; if (wasFor) fv--; }
      } else {
        if (side === "for") fv--; else av--;
      }
      const nextId = "L" + String(parseInt(ledger[0].id.slice(1)) + 1).padStart(4,"0");
      setLedger(le => [{ id:nextId, type:"VOTE", actor:USER.username, action:`Voted ${side.toUpperCase()}`, target:p.title, sector:`${p.sector.charAt(0).toUpperCase()+p.sector.slice(1)} · ${p.sectorName}`, ts:new Date().toISOString().slice(0,16).replace("T"," "), pts:`${savedAlloc[p.sector]?.[p.sectorId]||0}pts` }, ...le]);
      return { ...p, forVotes:fv, againstVotes:av, userVoted:toggling?null:side };
    }));
    notify("Vote recorded on civic ledger ✓");
  };

  const submitTest = (p) => {
    const score = p.questions.filter((q,i) => testAns[i] === q.a).length;
    setTestScore(score); setTestDone(true);
    if (score >= 5) {
      setProposals(prev => prev.map(x => x.id === p.id ? { ...x, userPassedTest:true } : x));
      notify("Comprehension test passed — you may now vote");
    }
  };

  const createProposal = () => {
    const all3 = [...SECTORS.federal.flexible,...SECTORS.provincial.flexible,...SECTORS.municipal.flexible];
    const sec = all3.find(s => s.id === newProp.sectorId);
    const lvl = sec.id.startsWith("ff") ? "federal" : sec.id.startsWith("pf") ? "provincial" : "municipal";
    const p = { id:`p${Date.now()}`, title:newProp.title, sector:lvl, sectorName:sec.name, sectorId:sec.id, status:"deliberation", author:USER.username, created:new Date().toISOString().slice(0,10), deadline:new Date(Date.now()+90*86400000).toISOString().slice(0,10), summary:newProp.summary, forVotes:0, againstVotes:0, totalEligible:0, quorumPct:0, userVoted:null, userPassedTest:false, questions:[] };
    setProposals(prev => [p,...prev]);
    setShowCreate(false); setNewProp({ title:"", sectorId:"ff_health", summary:"" });
    notify("Proposal submitted to civic ledger ✓");
  };

  const openProposal = (p) => { setSelectedId(p.id); setView("proposal"); setDtab("overview"); setTestAns({}); setTestDone(false); setTestScore(null); };
  const getSelected = () => proposals.find(x => x.id === selectedId);

  const Badge = ({status}) => {
    const map = { voting:["VOTING","b-voting"], deliberation:["DELIBERATION","b-deliberation"], passed:["PASSED","b-passed"], failed:["FAILED","b-failed"] };
    const [lbl,cls] = map[status]||["?",""];
    return <span className={`badge ${cls}`}>{lbl}</span>;
  };

  const VoteBar = ({p}) => {
    const total = p.forVotes + p.againstVotes;
    if (!total) return null;
    const fp = Math.round((p.forVotes/total)*100);
    return (
      <div className="vbar-wrap">
        <div className="vbar"><div className="vbar-fill" style={{width:`${fp}%`}}/></div>
        <div className="vstats">
          <span style={{color:"var(--green)"}}>{fp}% For ({p.forVotes.toLocaleString()})</span>
          <span style={{color:"var(--text-dim)"}}>Quorum: {p.quorumPct}%</span>
          <span style={{color:"var(--red)"}}>{100-fp}% Against ({p.againstVotes.toLocaleString()})</span>
        </div>
      </div>
    );
  };

  const PropCard = ({p}) => {
    const ua = savedAlloc[p.sector]?.[p.sectorId]||0;
    return (
      <div className={`prop-card s-${p.status}`} onClick={()=>openProposal(p)}>
        <div className="prop-head">
          <div className="prop-title">{p.title}</div>
          <Badge status={p.status}/>
        </div>
        <div className="prop-meta">
          <span>{p.sector.toUpperCase()} · {p.sectorName.toUpperCase()}</span>
          <span>by {p.author}</span>
          {p.deadline && <span>Closes {p.deadline}</span>}
          {ua > 0 ? <span style={{color:"var(--blue)"}}>Your weight: {ua}pts</span>
                  : <span style={{color:"var(--red)"}}>No allocation — cannot vote</span>}
        </div>
        <div className="prop-sum">{p.summary.length>160?p.summary.slice(0,160)+"…":p.summary}</div>
        {p.status !== "deliberation" && <VoteBar p={p}/>}
      </div>
    );
  };

  const Dashboard = () => {
    const activeVoting = proposals.filter(p=>p.status==="voting").length;
    const voted = proposals.filter(p=>p.userVoted).length;
    return (
      <div className="content">
        <div className="stats-grid">
          <div className="stat-card"><div className="stat-val">${USER.taxPaid.toLocaleString()}</div><div className="stat-lbl">TAX YEAR 2026</div><div className="stat-sub">Annual contribution</div></div>
          <div className="stat-card"><div className="stat-val">{flexTotal("federal")+30}</div><div className="stat-lbl">FEDERAL POINTS</div><div className="stat-sub">Flex: {flexTotal("federal")} · Crit: 30</div></div>
          <div className="stat-card"><div className="stat-val">{activeVoting}</div><div className="stat-lbl">ACTIVE VOTES</div><div className="stat-sub">{proposals.filter(p=>p.status==="deliberation").length} in deliberation</div></div>
          <div className="stat-card"><div className="stat-val">{voted}</div><div className="stat-lbl">VOTES CAST</div><div className="stat-sub">{proposals.filter(p=>p.status==="voting"&&!p.userVoted).length} awaiting your vote</div></div>
        </div>
        <div className="two-col" style={{marginBottom:14}}>
          <div className="card">
            <div className="ctitle">Federal Allocation</div>
            {SECTORS.federal.flexible.map(s => {
              const pct = savedAlloc.federal[s.id]||0;
              return (
                <div key={s.id} className="sec-bar-row">
                  <div className="sec-bar-name">{s.name}</div>
                  <div className="sec-bar-track"><div className="sec-bar-fill" style={{width:`${(pct/70)*100}%`,background:s.color}}/></div>
                  <div className="sec-bar-pct">{pct}%</div>
                </div>
              );
            })}
          </div>
          <div className="card">
            <div className="ctitle">Recent Ledger Activity</div>
            {ledger.slice(0,5).map(e => (
              <div key={e.id} className="act-item">
                <div className={`act-ico ${e.type==="VOTE"?"act-ico-vote":e.type==="PROPOSAL"?"act-ico-prop":"act-ico-alloc"}`}>
                  {e.type==="VOTE"?"✓":e.type==="PROPOSAL"?"✎":e.type==="PASSED"?"✅":"⚡"}
                </div>
                <div>
                  <div className="act-target">{e.action}: {e.target.length>38?e.target.slice(0,38)+"…":e.target}</div>
                  <div className="act-date">{e.actor} · {e.ts}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="ctitle" style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span>Active Proposals</span>
            <button className="btn-p" onClick={()=>setShowCreate(true)}>+ New Proposal</button>
          </div>
          <div className="prop-list">{proposals.filter(p=>p.status==="voting").map(p=><PropCard key={p.id} p={p}/>)}</div>
        </div>
      </div>
    );
  };

  const Allocation = () => {
    const lvl = govLevel;
    const secs = SECTORS[lvl];
    const flexUsed = flexTotal(lvl);
    const remaining = rem(lvl);
    return (
      <div className="content">
        <div className="info-box">Each year, <strong>30%</strong> of your taxes go to mandatory Critical Infrastructure. You control the remaining <strong>70%</strong> by distributing it across sectors you care about. Your vote weight in any sector equals your allocation percentage there.</div>
        <div className="lvl-tabs">
          {["federal","provincial","municipal"].map(l=>(
            <div key={l} className={`lvl-tab ${govLevel===l?"active":""}`} onClick={()=>setGovLevel(l)}>{l.toUpperCase()}</div>
          ))}
        </div>
        <div className="rem-bar">
          <span className="rem-lbl">FLEXIBLE REMAINING:</span>
          <span className="rem-val">{remaining}%</span>
          <div className="rem-track"><div className="rem-fill" style={{width:`${(flexUsed/70)*100}%`}}/></div>
          <span style={{fontFamily:"var(--fmono)",fontSize:10,color:"var(--text-dim)"}}>{flexUsed}/70 used</span>
        </div>
        <div className="crit-sec">
          <div className="crit-lbl">🔒 CRITICAL INFRASTRUCTURE (30% — MANDATORY, AUTO-ALLOCATED)</div>
          <div className="crit-grid">
            {secs.critical.map(s=>(
              <div key={s.id} className="crit-item"><span className="crit-name">{s.name}</span><span className="crit-pct">{s.pct}%</span></div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="ctitle">Flexible Allocation — 70%</div>
          {secs.flexible.map(s => {
            const val = alloc[lvl][s.id]||0;
            const trackBg = `linear-gradient(to right,${s.color} 0%,${s.color} ${(val/70)*100}%,var(--border) ${(val/70)*100}%,var(--border) 100%)`;
            return (
              <div key={s.id} className="alloc-row">
                <div className="alloc-head">
                  <span className="alloc-name"><span style={{width:8,height:8,borderRadius:"50%",background:s.color,display:"inline-block",flexShrink:0}}/>{s.name}</span>
                  <span className="alloc-pct">{val}% <span style={{color:"var(--text-dim)",fontSize:10}}>(~${Math.round(val*USER.taxPaid/100).toLocaleString()})</span></span>
                </div>
                <input type="range" min={0} max={70} step={1} value={val} style={{background:trackBg}} onChange={e=>updateAlloc(lvl,s.id,parseInt(e.target.value))}/>
              </div>
            );
          })}
          <div style={{marginTop:22,display:"flex",alignItems:"center",gap:14}}>
            <button className="save-btn" onClick={saveAlloc}>Save to Civic Ledger</button>
            {remaining > 0 && <span style={{fontFamily:"var(--fmono)",fontSize:10,color:"var(--gold)"}}>⚠ {remaining}% unallocated — will distribute to Critical Infrastructure at deadline</span>}
          </div>
        </div>
      </div>
    );
  };

  const Proposals = () => {
    const allSecs = ["all",...new Set(proposals.map(p=>p.sector))];
    const filtered = filterSec === "all" ? proposals : proposals.filter(p=>p.sector===filterSec);
    return (
      <div className="content">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
          <div className="lvl-tabs" style={{flex:1,maxWidth:340,marginBottom:0}}>
            {allSecs.map(s=>(
              <div key={s} className={`lvl-tab ${filterSec===s?"active":""}`} onClick={()=>setFilterSec(s)}>{s.toUpperCase()}</div>
            ))}
          </div>
          <button className="btn-p" style={{marginLeft:14}} onClick={()=>setShowCreate(true)}>+ New Proposal</button>
        </div>
        <div className="prop-list">{filtered.map(p=><PropCard key={p.id} p={p}/>)}</div>
      </div>
    );
  };

  const ProposalDetail = () => {
    const p = getSelected();
    if (!p) return null;
    const ua = savedAlloc[p.sector]?.[p.sectorId]||0;
    const canVote = p.status==="voting" && ua>0 && p.userPassedTest;
    const total = p.forVotes+p.againstVotes;
    const fp = total>0?Math.round((p.forVotes/total)*100):0;
    const hasQ = p.questions.length>0;
    const tabs = ["overview", ...(hasQ && !p.userPassedTest && p.status==="voting" ? ["test"] : []), "vote"];
    return (
      <div className="content">
        <button className="back-btn" onClick={()=>setView("proposals")}>← Back to Proposals</button>
        <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:10}}>
          <Badge status={p.status}/>
          <span style={{fontFamily:"var(--fmono)",fontSize:10,color:"var(--text-dim)"}}>{p.sector.toUpperCase()} · {p.sectorName.toUpperCase()}</span>
        </div>
        <div className="det-title">{p.title}</div>
        <div style={{fontFamily:"var(--fmono)",fontSize:10,color:"var(--text-dim)",display:"flex",gap:18,flexWrap:"wrap",marginBottom:22}}>
          <span>By {p.author}</span>
          <span>Filed {p.created}</span>
          {p.deadline&&<span>Closes {p.deadline}</span>}
          {ua>0 ? <span style={{color:"var(--blue)"}}>Your weight: {ua} participation points</span>
                : <span style={{color:"var(--red)"}}>⚠ No allocation in {p.sectorName} — cannot vote</span>}
        </div>
        <div className="dtabs">
          {tabs.map(t=>(
            <div key={t} className={`dtab ${dtab===t?"active":""}`} onClick={()=>setDtab(t)}>
              {t==="overview"?"Overview":t==="test"?"Comprehension Test":"Vote"}
              {t==="test"&&!p.userPassedTest&&<span style={{color:"var(--gold)",marginLeft:4}}>Required</span>}
              {t==="vote"&&p.userVoted&&<span style={{color:"var(--green)",marginLeft:4}}>✓</span>}
            </div>
          ))}
        </div>

        {dtab==="overview" && (
          <div className="two-col">
            <div>
              <div className="card" style={{marginBottom:12}}>
                <div className="ctitle">Proposal Summary</div>
                <p style={{fontSize:13,lineHeight:1.8,color:"var(--cream-dim)"}}>{p.summary}</p>
              </div>
              {p.status!=="deliberation" && (
                <div className="card">
                  <div className="ctitle">Current Voting</div>
                  {total>0?(
                    <>
                      <div className="vbar" style={{height:8}}><div className="vbar-fill" style={{width:`${fp}%`}}/></div>
                      <div style={{display:"flex",justifyContent:"space-between",marginTop:10}}>
                        <div style={{fontFamily:"var(--fmono)",fontSize:11,color:"var(--green)"}}>▲ {fp}% For<br/><span style={{fontSize:10,color:"var(--text-dim)"}}>{p.forVotes.toLocaleString()} pts</span></div>
                        <div style={{fontFamily:"var(--fmono)",fontSize:11,color:"var(--red)",textAlign:"right"}}>▼ {100-fp}% Against<br/><span style={{fontSize:10,color:"var(--text-dim)"}}>{p.againstVotes.toLocaleString()} pts</span></div>
                      </div>
                    </>
                  ):<p style={{fontSize:12,color:"var(--text-dim)"}}>No votes recorded yet — voting opens after deliberation.</p>}
                </div>
              )}
            </div>
            <div>
              <div className="card" style={{marginBottom:12}}>
                <div className="ctitle">Quorum Status</div>
                <div style={{display:"flex",gap:18,alignItems:"center",marginTop:6}}>
                  <div className="quorum-ring">
                    <svg width="76" height="76">
                      <circle cx="38" cy="38" r="30" fill="none" stroke="var(--border)" strokeWidth="6"/>
                      <circle cx="38" cy="38" r="30" fill="none" stroke={p.quorumPct>=60?"var(--green)":"var(--blue)"} strokeWidth="6" strokeDasharray={`${(p.quorumPct/100)*188.5} 188.5`} strokeLinecap="round"/>
                    </svg>
                    <div className="qring-lbl" style={{color:p.quorumPct>=60?"var(--green)":"var(--blue)"}}>{p.quorumPct}%</div>
                  </div>
                  <div className="qmeta">
                    <span>{p.quorumPct>=60?"✅ Quorum Met":"⏳ Quorum Pending"}</span>
                    Requirement: 60% of eligible citizens<br/>
                    Majority needed: 50%+<br/>
                    Eligible citizens: {p.totalEligible.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="ctitle">Your Participation</div>
                <div style={{fontSize:12,lineHeight:2.2,fontFamily:"var(--fmono)",color:"var(--cream-dim)"}}>
                  <div>Sector allocation: <span style={{color:ua>0?"var(--gold)":"var(--red)"}}>{ua}pts</span></div>
                  <div>Comprehension test: <span style={{color:p.userPassedTest?"var(--green)":"var(--text-dim)"}}>{p.userPassedTest?"Passed ✓":"Not taken"}</span></div>
                  <div>Vote cast: <span style={{color:p.userVoted?"var(--green)":"var(--text-dim)"}}>{p.userVoted?p.userVoted.toUpperCase()+" ✓":"None"}</span></div>
                </div>
                {p.status==="voting"&&!p.userPassedTest&&hasQ&&ua>0&&(
                  <button className="save-btn" style={{marginTop:14}} onClick={()=>setDtab("test")}>Take Comprehension Test →</button>
                )}
                {canVote&&(
                  <button className="save-btn" style={{marginTop:14}} onClick={()=>setDtab("vote")}>Cast Your Vote →</button>
                )}
              </div>
            </div>
          </div>
        )}

        {dtab==="test" && (
          <div className="card">
            {testDone ? (
              <>
                <div className="score-disp">
                  <div className={`score-num ${testScore>=5?"score-pass":"score-fail"}`}>{testScore}/10</div>
                  <div className="score-lbl" style={{color:testScore>=5?"var(--green)":"var(--red)"}}>
                    {testScore>=5?"✅ PASSED — You may now vote":"❌ FAILED — Minimum 5/10 required"}
                  </div>
                  {testScore>=5?(
                    <button className="save-btn" style={{marginTop:22}} onClick={()=>setDtab("vote")}>Proceed to Vote →</button>
                  ):(
                    <button className="btn-g" style={{marginTop:22}} onClick={()=>{setTestAns({});setTestDone(false);setTestScore(null);}}>Retake Test</button>
                  )}
                </div>
                <div style={{marginTop:22}}>
                  {p.questions.map((q,i)=>(
                    <div key={i} className="qblock">
                      <div className="qnum">Q{i+1}</div>
                      <div className="qtext">{q.q}</div>
                      <div className="opts">
                        {q.opts.map((opt,j)=>{
                          const isSel = testAns[i]===j, isCorr = j===q.a;
                          const cls = isSel&&isCorr?"corr":isSel?"incorr":isCorr?"corr":"";
                          return <div key={j} className={`opt-btn ${cls}`}>{opt}</div>;
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ):(
              <>
                <div className="ctitle">Reading & Comprehension Test</div>
                <p style={{fontSize:12,color:"var(--cream-dim)",marginBottom:22,lineHeight:1.7}}>Answer at least <strong style={{color:"var(--gold)"}}>5 of 10</strong> questions correctly to unlock voting. You may retake this test as many times as needed.</p>
                {p.questions.map((q,i)=>(
                  <div key={i} className="qblock">
                    <div className="qnum">QUESTION {i+1} OF {p.questions.length}</div>
                    <div className="qtext">{q.q}</div>
                    <div className="opts">
                      {q.opts.map((opt,j)=>(
                        <button key={j} className={`opt-btn ${testAns[i]===j?"sel":""}`} onClick={()=>setTestAns(prev=>({...prev,[i]:j}))}>{opt}</button>
                      ))}
                    </div>
                  </div>
                ))}
                <button className="save-btn" style={{opacity:Object.keys(testAns).length<p.questions.length?.5:1}} onClick={()=>submitTest(p)}>
                  Submit Test ({Object.keys(testAns).length}/{p.questions.length} answered)
                </button>
              </>
            )}
          </div>
        )}

        {dtab==="vote" && (
          <div className="card">
            <div className="ctitle">Cast Your Vote</div>
            {(!canVote && !p.userVoted) ? (
              <div style={{padding:28,textAlign:"center",fontFamily:"var(--fmono)",fontSize:12}}>
                {ua===0 ? <span style={{color:"var(--red)"}}>You have 0% allocated to {p.sectorName}. Go to Tax Allocation to add this sector, then save your allocations.</span>
                : !p.userPassedTest ? <span style={{color:"var(--gold)"}}>You must pass the comprehension test before voting. <button className="btn-g" style={{marginLeft:8}} onClick={()=>setDtab("test")}>Take Test</button></span>
                : <span style={{color:"var(--text-dim)"}}>This proposal is not currently in the voting phase.</span>}
              </div>
            ):(
              <>
                <p style={{fontSize:13,lineHeight:1.75,color:"var(--cream-dim)",marginBottom:16}}>{p.summary}</p>
                <div style={{fontFamily:"var(--fmono)",fontSize:11,color:"var(--text-dim)",padding:"9px 12px",background:"rgba(0,0,0,.3)",borderRadius:2,marginBottom:18}}>
                  Your vote carries <span style={{color:"var(--gold)"}}>{ua} participation points</span> in {p.sectorName}
                </div>
                <div className="vote-acts">
                  <button className={`vote-btn vbf ${p.userVoted==="for"?"vactive":""}`} onClick={()=>castVote(p.id,"for")}>▲ VOTE FOR{p.userVoted==="for"&&" (Active)"}</button>
                  <button className={`vote-btn vba ${p.userVoted==="against"?"vactive":""}`} onClick={()=>castVote(p.id,"against")}>▼ VOTE AGAINST{p.userVoted==="against"&&" (Active)"}</button>
                </div>
                {p.userVoted&&<p style={{marginTop:10,fontFamily:"var(--fmono)",fontSize:10,color:"var(--green)"}}>✓ Vote recorded to civic ledger. Click again to change or retract.</p>}
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  const Ledger = () => (
    <div className="content">
      <div className="info-box">The Government-Hosted Distributed Ledger (GHDL) is an append-only, publicly verifiable record of all civic actions — votes, proposals, allocations, and moderation events. Every entry is permanent and tamper-proof. <span style={{color:"var(--gold)"}}>Your entries are highlighted.</span></div>
      <div className="card">
        <div className="ctitle" style={{display:"flex",justifyContent:"space-between"}}>
          <span>{ledger.length} Ledger Entries</span>
          <span style={{fontFamily:"var(--fmono)",fontSize:10,color:"var(--green)"}}>● LIVE · GHDL v1.0</span>
        </div>
        <div style={{overflowX:"auto"}}>
          <table className="ledger-tbl">
            <thead>
              <tr><th>ID</th><th>TYPE</th><th>ACTOR</th><th>ACTION</th><th>TARGET</th><th>SECTOR</th><th>TIMESTAMP</th><th>WEIGHT</th></tr>
            </thead>
            <tbody>
              {ledger.map(e=>(
                <tr key={e.id}>
                  <td style={{color:"var(--text-dim)"}}>{e.id}</td>
                  <td><span className={`ltype lt-${e.type}`}>{e.type}</span></td>
                  <td style={{color:e.actor===USER.username?"var(--gold)":"var(--cream-dim)"}}>{e.actor}</td>
                  <td>{e.action}</td>
                  <td style={{maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.target}</td>
                  <td style={{color:"var(--text-dim)"}}>{e.sector}</td>
                  <td style={{color:"var(--text-dim)"}}>{e.ts}</td>
                  <td style={{color:"var(--blue)"}}>{e.pts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const Profile = () => {
    const voted = proposals.filter(p=>p.userVoted).length;
    const myProps = proposals.filter(p=>p.author===USER.username);
    return (
      <div className="content">
        <div style={{display:"flex",gap:20,alignItems:"flex-start",marginBottom:28}}>
          <div className="profile-av">{USER.name.charAt(0)}</div>
          <div>
            <div className="profile-name">{USER.name}</div>
            <div className="profile-user">@{USER.username}</div>
            <div className="profile-bio">Citizen · {USER.municipality}, {USER.province} · DDTAP Pilot Member · Since Jan 2026</div>
          </div>
        </div>
        <div className="two-col" style={{marginBottom:14}}>
          <div className="stat-card"><div className="stat-val">${USER.taxPaid.toLocaleString()}</div><div className="stat-lbl">2026 TAX CONTRIBUTION</div></div>
          <div className="stat-card"><div className="stat-val">{voted}</div><div className="stat-lbl">PROPOSALS VOTED</div></div>
        </div>
        <div className="card" style={{marginBottom:14}}>
          <div className="ctitle">Participation Points by Sector</div>
          <div className="part-grid">
            {["federal","provincial","municipal"].map(lvl=>(
              <div key={lvl} className="part-card">
                <div className="part-lvl">{lvl.toUpperCase()}</div>
                {SECTORS[lvl].critical.slice(0,2).map(s=>(
                  <div key={s.id} className="part-row"><span className="part-nm">{s.name}</span><span className="part-pts">{s.pct}pts</span></div>
                ))}
                {SECTORS[lvl].flexible.filter(s=>savedAlloc[lvl][s.id]>0).map(s=>(
                  <div key={s.id} className="part-row">
                    <span className="part-nm" style={{display:"flex",alignItems:"center",gap:4}}>
                      <span style={{width:6,height:6,borderRadius:"50%",background:s.color,display:"inline-block",flexShrink:0}}/>
                      {s.name.length>17?s.name.slice(0,17)+"…":s.name}
                    </span>
                    <span className="part-pts">{savedAlloc[lvl][s.id]}pts</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="card" style={{marginBottom:14}}>
          <div className="ctitle">Conduct Rules — Protected vs. Prohibited</div>
          <table className="tier-table">
            <thead><tr><th>TIER</th><th>DESCRIPTION</th><th>CONSEQUENCE</th></tr></thead>
            <tbody>
              <tr><td style={{color:"var(--red)"}}>Tier 1</td><td>Hate, threats, harassment, doxxing</td><td>Ledger flag · 14-day comment pause · Elections Canada investigation</td></tr>
              <tr><td style={{color:"var(--gold)"}}>Tier 2</td><td>Bribery, paid representation, evidence tampering</td><td>Immediate suspension of roles · Elections Canada investigation</td></tr>
              <tr><td style={{color:"var(--blue)"}}>Tier 3</td><td>Spam, brigading, vote fraud</td><td>Account verification reset · Elections Canada investigation</td></tr>
            </tbody>
          </table>
        </div>
        {myProps.length>0&&(
          <div className="card">
            <div className="ctitle">My Proposals</div>
            <div className="prop-list">{myProps.map(p=><PropCard key={p.id} p={p}/>)}</div>
          </div>
        )}
      </div>
    );
  };

  const allFlexSecs = [...SECTORS.federal.flexible,...SECTORS.provincial.flexible,...SECTORS.municipal.flexible];
  const newSecLevel = newProp.sectorId.startsWith("ff")?"federal":newProp.sectorId.startsWith("pf")?"provincial":"municipal";
  const newSecAlloc = savedAlloc[newSecLevel]?.[newProp.sectorId]||0;

  const navItems = [
    { id:"dashboard", icon:"⬡", label:"Dashboard" },
    { id:"allocate", icon:"◈", label:"Tax Allocation" },
    { id:"proposals", icon:"◻", label:"Proposals" },
    { id:"ledger", icon:"≡", label:"Civic Ledger" },
    { id:"profile", icon:"○", label:"Profile" },
  ];

  const viewLabels = { dashboard:"Dashboard", allocate:"Tax Allocation", proposals:"Proposals", proposal:"Proposal Detail", ledger:"Civic Ledger", profile:"My Profile" };

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        <aside className="sidebar">
          <div className="sb-logo">
            <h1>The Civic Network</h1>
            <span>DDTAP · PILOT v0.1</span>
          </div>
          <nav className="sb-nav">
            {navItems.map(n=>(
              <div key={n.id} className={`nav-item ${view===n.id||(n.id==="proposals"&&view==="proposal")?"active":""}`} onClick={()=>setView(n.id)}>
                <span style={{fontSize:15,lineHeight:1}}>{n.icon}</span>
                {n.label}
              </div>
            ))}
          </nav>
          <div className="sb-user">
            <div className="sb-user-name">{USER.name}</div>
            <div className="sb-user-sub">@{USER.username}</div>
            <div className="sb-user-sub" style={{marginTop:4,color:"var(--green)"}}>● Active Citizen</div>
            <div className="sb-user-sub" style={{marginTop:2}}>{USER.municipality}, {USER.province}</div>
          </div>
        </aside>
        <main className="main">
          <div className="topbar">
            <h2>{viewLabels[view]}</h2>
            <span className="topbar-meta">May 13, 2026 · Tax Year 2026 · {USER.municipality}, {USER.province}</span>
          </div>
          {view==="dashboard"&&<Dashboard/>}
          {view==="allocate"&&<Allocation/>}
          {view==="proposals"&&<Proposals/>}
          {view==="proposal"&&<ProposalDetail/>}
          {view==="ledger"&&<Ledger/>}
          {view==="profile"&&<Profile/>}
        </main>
        {showCreate&&(
          <div className="modal-ov" onClick={e=>e.target===e.currentTarget&&setShowCreate(false)}>
            <div className="modal">
              <div className="modal-title">Submit a Proposal</div>
              <div className="modal-sub">Only citizens with tax allocated to the target sector may submit proposals in that sector. Proposals enter a 3-month public deliberation phase before voting opens.</div>
              <div className="fgrp">
                <label className="flbl">PROPOSAL TITLE</label>
                <input className="finput" placeholder="A clear, specific, actionable title…" value={newProp.title} onChange={e=>setNewProp(p=>({...p,title:e.target.value}))}/>
              </div>
              <div className="fgrp">
                <label className="flbl">TARGET SECTOR</label>
                <select className="finput fsel" value={newProp.sectorId} onChange={e=>setNewProp(p=>({...p,sectorId:e.target.value}))}>
                  <optgroup label="Federal">
                    {SECTORS.federal.flexible.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
                  </optgroup>
                  <optgroup label="Provincial (Alberta)">
                    {SECTORS.provincial.flexible.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
                  </optgroup>
                  <optgroup label="Municipal (Edmonton)">
                    {SECTORS.municipal.flexible.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
                  </optgroup>
                </select>
                <div style={{marginTop:6,fontFamily:"var(--fmono)",fontSize:10,color:newSecAlloc>0?"var(--green)":"var(--red)"}}>
                  {newSecAlloc>0?`✓ You have ${newSecAlloc}% allocated — eligible to propose`:"⚠ You have 0% allocated to this sector. Allocate taxes first."}
                </div>
              </div>
              <div className="fgrp">
                <label className="flbl">PROPOSAL SUMMARY</label>
                <textarea className="finput ftarea" placeholder="Describe the proposal clearly. Citizens will read this during deliberation and must pass a comprehension test to vote…" value={newProp.summary} onChange={e=>setNewProp(p=>({...p,summary:e.target.value}))}/>
              </div>
              <div className="modal-acts">
                <button className="btn-g" onClick={()=>setShowCreate(false)}>Cancel</button>
                <button className="btn-p" disabled={!newProp.title||!newProp.summary||newSecAlloc===0} onClick={createProposal}>Submit to Ledger</button>
              </div>
            </div>
          </div>
        )}
        {notif&&<div className="notif">{notif}</div>}
      </div>
    </>
  );
}
